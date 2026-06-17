import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = Router();

// GET co-founder matching list
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    // Find all users looking for co-founders who are NOT the current user
    const users = await User.find({
      _id: { $ne: currentUserId },
      role: 'founder',
      'profileWizard.lookingForCoFounder': true
    }).select('-passwordHash');

    // Add dynamic AI compatibility scores based on overlapping interests and complementary skills
    const currentUser = await User.findById(currentUserId);
    const results = users.map(user => {
      let score = 50; // Base score
      
      if (currentUser) {
        // Complementary roles (e.g. Developer matches Designer/PM)
        const myRole = currentUser.profileWizard?.founderRole;
        const targetRole = user.profileWizard?.founderRole;
        if (myRole && targetRole && myRole !== targetRole) {
          score += 20; // 20% boost for complementary role
        }

        // Shared interests
        const myInterests = currentUser.profileWizard?.interests || [];
        const targetInterests = user.profileWizard?.interests || [];
        const commonInterests = myInterests.filter(i => targetInterests.includes(i));
        score += commonInterests.length * 5; // 5% boost per shared interest

        // Distinct skills
        const mySkills = currentUser.profileWizard?.skills || [];
        const targetSkills = user.profileWizard?.skills || [];
        const distinctSkills = targetSkills.filter(s => !mySkills.includes(s));
        score += Math.min(distinctSkills.length * 3, 15); // Boost up to 15% for diverse skills
      }

      // Cap at 98%
      const compatibilityScore = Math.min(score, 98);

      return {
        user,
        compatibilityScore,
        analysis: `Highly compatible due to complementary skill sets and mutual interest in ${user.profileWizard?.interests?.[0] || 'market disruption'}.`
      };
    });

    // Sort by compatibility score descending
    results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
