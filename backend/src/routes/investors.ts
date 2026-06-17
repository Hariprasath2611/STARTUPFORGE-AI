import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Startup from '../models/Startup';
import { Notification } from '../models/Collaboration';

const router = Router();

// GET matching investors list for a startup
router.get('/match/:startupId', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const startup = await Startup.findById(req.params.startupId);
    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    // Find investors
    const investors = await User.find({ role: 'investor' }).select('-passwordHash');

    // Run matching heuristics
    const matches = investors.map(investor => {
      let score = 40; // Base score

      // Industry match
      const investorIndustries = investor.profileWizard?.investmentIndustries || [];
      if (investorIndustries.some(ind => ind.toLowerCase() === startup.industry.toLowerCase())) {
        score += 30;
      }

      // Stage match
      const investorStages = investor.profileWizard?.investmentStages || [];
      if (investorStages.some(st => st.toLowerCase() === startup.fundingStage.toLowerCase())) {
        score += 20;
      }

      const compatibilityScore = Math.min(score, 99);

      return {
        investor,
        compatibilityScore,
        reasoning: `Matched based on ${startup.fundingStage} stage preference and active interest in the ${startup.industry} sector.`
      };
    });

    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    res.json(matches);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit pitch deck to investor
router.post('/submit-pitch', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { investorId, startupId, note } = req.body;

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    // Create notification for the investor
    await new Notification({
      userId: investorId,
      title: 'New Pitch Submission',
      content: `${startup.name} has submitted a pitch for review. Note: "${note || 'None'}"`,
      link: `/investor/dashboard`
    }).save();

    res.json({ success: true, message: 'Pitch submitted successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST book meeting request
router.post('/book-meeting', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { investorId, startupId, dateTime } = req.body;

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    // Create notification for the investor
    await new Notification({
      userId: investorId,
      title: 'Meeting Request Scheduled',
      content: `${req.user?.email} requested a meeting for ${startup.name} at ${dateTime}`,
      link: `/investor/meetings`
    }).save();

    res.json({ success: true, message: 'Meeting requested successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
