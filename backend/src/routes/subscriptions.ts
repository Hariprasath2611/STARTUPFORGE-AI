import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { Subscription, Payment } from '../models/Subscription';
import AuditLog from '../models/AuditLog';

const router = Router();

// GET billing and subscription status
router.get('/status', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    let subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      // Create default free subscription
      subscription = new Subscription({
        userId,
        plan: 'free',
        status: 'active',
        aiUsageLimit: 20,
        maxStartups: 1
      });
      await subscription.save();
    }

    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });

    res.json({
      subscription,
      payments
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST mock checkout session
router.post('/checkout', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { plan } = req.body; // starter, pro, enterprise

    if (!['starter', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Determine plan limits
    let cost = 0;
    let aiUsageLimit = 100;
    let maxStartups = 3;

    if (plan === 'starter') {
      cost = 29;
      aiUsageLimit = 100;
      maxStartups = 3;
    } else if (plan === 'pro') {
      cost = 79;
      aiUsageLimit = 500;
      maxStartups = 10;
    } else if (plan === 'enterprise') {
      cost = 299;
      aiUsageLimit = 999999;
      maxStartups = 999;
    }

    // Update User subscription
    let subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      subscription = new Subscription({ userId });
    }

    subscription.plan = plan;
    subscription.status = 'active';
    subscription.aiUsageLimit = aiUsageLimit;
    subscription.maxStartups = maxStartups;
    subscription.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await subscription.save();

    // Log payment record
    const payment = new Payment({
      userId,
      amount: cost,
      status: 'succeeded',
      plan,
      stripePaymentIntentId: 'mock_intent_' + Math.random().toString(36).substring(7)
    });
    await payment.save();

    await new AuditLog({
      userId,
      userEmail: req.user?.email,
      action: 'UPGRADE_SUBSCRIPTION',
      details: `Upgraded to ${plan} plan. Payment: $${cost}`
    }).save();

    res.json({
      success: true,
      subscription,
      payment
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST cancel subscription
router.post('/cancel', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    subscription.plan = 'free';
    subscription.aiUsageLimit = 20;
    subscription.maxStartups = 1;
    await subscription.save();

    await new AuditLog({
      userId,
      userEmail: req.user?.email,
      action: 'CANCEL_SUBSCRIPTION',
      details: 'Canceled premium subscription, reverted to Free tier.'
    }).save();

    res.json({
      success: true,
      subscription
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
