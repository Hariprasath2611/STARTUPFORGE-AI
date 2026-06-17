import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Startup from './models/Startup';
import { Subscription } from './models/Subscription';
import AuditLog from './models/AuditLog';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/startupforge';

async function seedDatabase() {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clear existing collections
    await User.deleteMany({});
    await Startup.deleteMany({});
    await Subscription.deleteMany({});
    await AuditLog.deleteMany({});
    console.log('Cleared existing records.');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 1. Create Users
    const founder = new User({
      name: 'Elena Rostova',
      email: 'founder@startupforge.ai',
      passwordHash,
      role: 'founder',
      isVerified: true,
      profileWizard: {
        completed: true,
        bio: 'Elena is a technical product founder with 5 years experience at Stripe and Slack. Building next-gen B2B SaaS engines.',
        location: 'San Francisco, CA',
        skills: ['React', 'Node.js', 'TypeScript', 'Product Design'],
        interests: ['SaaS', 'Fintech', 'Developer Tools'],
        lookingForCoFounder: true,
        founderRole: 'developer'
      }
    });

    const investor = new User({
      name: 'Marcus Capital VC',
      email: 'investor@startupforge.ai',
      passwordHash,
      role: 'investor',
      isVerified: true,
      profileWizard: {
        completed: true,
        bio: 'Managing partner at Sovereign Seed Partners. Focusing on pre-seed and seed stage enterprise SaaS solutions.',
        location: 'New York, NY',
        skills: ['Venture Capital', 'Fundraising', 'B2B Sales', 'Strategy'],
        interests: ['AI', 'SaaS', 'Cloud Infrastructure'],
        lookingForCoFounder: false,
        investmentStages: ['Pre-Seed', 'Seed', 'Series A'],
        investmentIndustries: ['SaaS', 'AI', 'Fintech'],
        ticketSizeMin: 50000,
        ticketSizeMax: 1000000
      }
    });

    const mentor = new User({
      name: 'Sarah Jenkins',
      email: 'mentor@startupforge.ai',
      passwordHash,
      role: 'mentor',
      isVerified: true,
      profileWizard: {
        completed: true,
        bio: 'Growth advisor and startup mentor. Ex-director of marketing at HubSpot. Helping founders optimize conversion rates.',
        location: 'Boston, MA',
        skills: ['Marketing', 'Growth Hacking', 'SEO', 'Email Sequences'],
        interests: ['SaaS', 'Marketplaces'],
        lookingForCoFounder: false,
        expertise: ['Growth Marketing', 'Product Led Growth', 'Sales Playbooks']
      }
    });

    const admin = new User({
      name: 'Forge Admin',
      email: 'admin@startupforge.ai',
      passwordHash,
      role: 'admin',
      isVerified: true,
      profileWizard: {
        completed: true,
        bio: 'Forge platform operations and security administrator.',
        location: 'Austin, TX',
        skills: ['DevOps', 'Security', 'Database Architecture'],
        interests: ['Infrastructure'],
        lookingForCoFounder: false
      }
    });

    await founder.save();
    await investor.save();
    await mentor.save();
    await admin.save();
    console.log('Registered Founder, Investor, Mentor, and Admin accounts.');

    // 2. Create default Subscriptions
    await new Subscription({
      userId: founder._id,
      plan: 'pro',
      status: 'active',
      aiUsageLimit: 500,
      aiUsageCount: 22,
      maxStartups: 10
    }).save();

    await new Subscription({
      userId: investor._id,
      plan: 'enterprise',
      status: 'active',
      aiUsageLimit: 9999,
      aiUsageCount: 0,
      maxStartups: 999
    }).save();

    await new Subscription({
      userId: mentor._id,
      plan: 'free',
      status: 'active',
      aiUsageLimit: 20,
      aiUsageCount: 0,
      maxStartups: 1
    }).save();

    await new Subscription({
      userId: admin._id,
      plan: 'enterprise',
      status: 'active',
      aiUsageLimit: 9999,
      aiUsageCount: 0,
      maxStartups: 999
    }).save();

    console.log('Saved subscription limits.');

    // 3. Create Sample Startup Workspace for founder
    const startup = new Startup({
      name: 'OptimaFlow AI',
      description: 'An AI-powered client acquisition pipeline automating cold sequences and response analysis.',
      industry: 'AI / ML',
      targetAudience: 'B2B SMB Sales Managers, Agencies',
      market: 'Global B2B CRM market ($12B TAM)',
      businessModel: 'Usage-based SaaS API',
      fundingStage: 'Pre-Seed',
      location: 'San Francisco, CA',
      tags: ['AI', 'Cold Outreach', 'Sales Automation'],
      creatorId: founder._id,
      teamMembers: [
        { userId: founder._id, role: 'CEO & Founder' },
        { userId: mentor._id, role: 'Growth Advisor' }
      ],
      healthScore: 82,
      growthForecast: 15,
      validationScore: 78,
      fundingReadiness: 65,
      marketOpportunity: 84,
      documents: [
        { name: 'Executive Pitch Deck.pdf', url: '#', type: 'pdf', uploadedAt: new Date() },
        { name: 'Q3 Financial Sheet.xlsx', url: '#', type: 'xlsx', uploadedAt: new Date() }
      ]
    });

    await startup.save();
    console.log('Sample startup workspace initialized.');

    // 4. Log audit log
    await new AuditLog({
      userId: admin._id,
      userEmail: admin.email,
      action: 'SYSTEM_SEED',
      details: 'System databases successfully seeded with sample demo entries.'
    }).save();

    console.log('Seeding successfully completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
