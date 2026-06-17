import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import Startup from '../models/Startup';
import AuditLog from '../models/AuditLog';

const router = Router();

// Get all startups for user
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const startups = await Startup.find({
      $or: [
        { creatorId: userId },
        { 'teamMembers.userId': userId }
      ]
    });
    res.json(startups);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create Startup
router.post('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, description, industry, targetAudience, market, businessModel, fundingStage, location, tags } = req.body;

    const newStartup = new Startup({
      name,
      description,
      industry,
      targetAudience,
      market,
      businessModel,
      fundingStage,
      location,
      tags: tags || [],
      creatorId: userId,
      teamMembers: [{ userId, role: 'CEO / Founder' }]
    });

    await newStartup.save();

    await new AuditLog({
      userId,
      userEmail: req.user?.email,
      action: 'CREATE_STARTUP',
      details: `Created startup: ${newStartup.name} (${newStartup._id})`
    }).save();

    res.status(201).json(newStartup);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get startup by ID
router.get('/:id', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const startup = await Startup.findById(req.params.id).populate('teamMembers.userId', 'name email profileWizard.founderRole');
    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }
    res.json(startup);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Startup
router.put('/:id', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, description, industry, targetAudience, market, businessModel, fundingStage, location, tags, healthScore, growthForecast, validationScore, fundingReadiness, marketOpportunity } = req.body;

    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    // Check if user is a member of the startup
    const isMember = startup.creatorId.toString() === userId || startup.teamMembers.some(m => m.userId.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Unauthorized workspace access' });
    }

    startup.name = name || startup.name;
    startup.description = description || startup.description;
    startup.industry = industry || startup.industry;
    startup.targetAudience = targetAudience || startup.targetAudience;
    startup.market = market || startup.market;
    startup.businessModel = businessModel || startup.businessModel;
    startup.fundingStage = fundingStage || startup.fundingStage;
    startup.location = location || startup.location;
    startup.tags = tags || startup.tags;

    if (healthScore !== undefined) startup.healthScore = healthScore;
    if (growthForecast !== undefined) startup.growthForecast = growthForecast;
    if (validationScore !== undefined) startup.validationScore = validationScore;
    if (fundingReadiness !== undefined) startup.fundingReadiness = fundingReadiness;
    if (marketOpportunity !== undefined) startup.marketOpportunity = marketOpportunity;

    await startup.save();

    await new AuditLog({
      userId,
      userEmail: req.user?.email,
      action: 'UPDATE_STARTUP',
      details: `Updated startup details for ${startup.name}`
    }).save();

    res.json(startup);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mock Document Upload
router.post('/:id/documents', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { name, url, type } = req.body;
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    startup.documents.push({
      name,
      url,
      type,
      uploadedAt: new Date()
    });

    await startup.save();
    res.status(201).json(startup.documents[startup.documents.length - 1]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
