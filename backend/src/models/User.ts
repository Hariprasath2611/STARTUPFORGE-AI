import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'founder' | 'investor' | 'mentor' | 'admin';
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  profileWizard: {
    completed: boolean;
    bio: string;
    skills: string[];
    interests: string[];
    location: string;
    avatarUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    // Founder specific
    lookingForCoFounder: boolean;
    founderRole?: 'developer' | 'designer' | 'marketer' | 'product_manager';
    // Investor specific
    investmentStages?: string[];
    investmentIndustries?: string[];
    ticketSizeMin?: number;
    ticketSizeMax?: number;
    // Mentor specific
    expertise?: string[];
  };
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['founder', 'investor', 'mentor', 'admin'], default: 'founder' },
  isVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  profileWizard: {
    completed: { type: Boolean, default: false },
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    location: { type: String, default: '' },
    avatarUrl: { type: String },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    lookingForCoFounder: { type: Boolean, default: false },
    founderRole: { type: String, enum: ['developer', 'designer', 'marketer', 'product_manager'] },
    investmentStages: { type: [String], default: [] },
    investmentIndustries: { type: [String], default: [] },
    ticketSizeMin: { type: Number },
    ticketSizeMax: { type: Number },
    expertise: { type: [String], default: [] }
  }
});

export default mongoose.model<IUser>('User', UserSchema);
