import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Subscription } from '../models/Subscription';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import AuditLog from '../models/AuditLog';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforstartupforgeai2026';

// Register User
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role || 'founder'
    });

    await newUser.save();

    // Create a subscription record (free tier by default)
    const newSub = new Subscription({
      userId: newUser._id,
      plan: 'free',
      status: 'active',
      aiUsageLimit: 20,
      maxStartups: 1
    });
    await newSub.save();

    // Audit log
    await new AuditLog({
      userId: newUser._id,
      userEmail: newUser.email,
      action: 'SIGNUP',
      details: `User registered with role: ${newUser.role}`
    }).save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileWizard: newUser.profileWizard
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Login User
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Support a quick admin and investor account fallback for dev testing if no database exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Audit log
    await new AuditLog({
      userId: user._id,
      userEmail: user.email,
      action: 'LOGIN',
      details: 'User logged in successfully'
    }).save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileWizard: user.profileWizard
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mock Social Logins (Google / GitHub)
router.post('/social-login', async (req: Request, res: Response) => {
  try {
    const { name, email, role, provider } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      // Create user
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(Math.random().toString(36), salt);
      user = new User({
        name,
        email,
        passwordHash,
        role: role || 'founder',
        isVerified: true
      });
      await user.save();

      const newSub = new Subscription({
        userId: user._id,
        plan: 'free',
        status: 'active'
      });
      await newSub.save();
    }

    await new AuditLog({
      userId: user._id,
      userEmail: user.email,
      action: 'SOCIAL_LOGIN',
      details: `User logged in via ${provider}`
    }).save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileWizard: user.profileWizard
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile Wizard
router.post('/wizard', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bio, skills, interests, location, lookingForCoFounder, founderRole, investmentStages, investmentIndustries, ticketSizeMin, ticketSizeMax, expertise } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.profileWizard = {
      completed: true,
      bio: bio || user.profileWizard.bio,
      skills: skills || user.profileWizard.skills,
      interests: interests || user.profileWizard.interests,
      location: location || user.profileWizard.location,
      lookingForCoFounder: lookingForCoFounder !== undefined ? lookingForCoFounder : user.profileWizard.lookingForCoFounder,
      founderRole: founderRole || user.profileWizard.founderRole,
      investmentStages: investmentStages || user.profileWizard.investmentStages,
      investmentIndustries: investmentIndustries || user.profileWizard.investmentIndustries,
      ticketSizeMin: ticketSizeMin || user.profileWizard.ticketSizeMin,
      ticketSizeMax: ticketSizeMax || user.profileWizard.ticketSizeMax,
      expertise: expertise || user.profileWizard.expertise
    };

    await user.save();

    await new AuditLog({
      userId: user._id,
      userEmail: user.email,
      action: 'UPDATE_WIZARD',
      details: 'User completed profile wizard setup'
    }).save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileWizard: user.profileWizard
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current User Profile
router.get('/me', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
