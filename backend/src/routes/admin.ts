import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import User from '../models/User';
import Startup from '../models/Startup';
import { Subscription, Payment } from '../models/Subscription';
import AuditLog from '../models/AuditLog';

const router = Router();

// GET platform analytics (Admin only)
router.get('/metrics', authenticateJWT, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStartups = await Startup.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ plan: { $ne: 'free' } });
    
    // Calculate total revenue
    const payments = await Payment.find({ status: 'succeeded' });
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    // Get count of role breakdowns
    const founders = await User.countDocuments({ role: 'founder' });
    const investors = await User.countDocuments({ role: 'investor' });
    const mentors = await User.countDocuments({ role: 'mentor' });

    res.json({
      totalUsers,
      totalStartups,
      activeSubscriptions,
      totalRevenue,
      usersByRole: { founders, investors, mentors },
      recentPayments: payments.slice(0, 10)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET users list (Admin only)
router.get('/users', authenticateJWT, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET all startups (Admin only)
router.get('/startups', authenticateJWT, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const startups = await Startup.find().populate('creatorId', 'name email');
    res.json(startups);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET audit logs (Admin only)
router.get('/logs', authenticateJWT, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
