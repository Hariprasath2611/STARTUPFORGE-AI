import mongoose, { Schema, Document } from 'mongoose';

export interface IStartup extends Document {
  name: string;
  description: string;
  industry: string;
  targetAudience: string;
  market: string;
  businessModel: string;
  fundingStage: string;
  location: string;
  tags: string[];
  teamMembers: Array<{
    userId: mongoose.Types.ObjectId;
    role: string;
  }>;
  creatorId: mongoose.Types.ObjectId;
  healthScore: number;
  growthForecast: number;
  validationScore: number;
  fundingReadiness: number;
  marketOpportunity: number;
  documents: Array<{
    name: string;
    url: string;
    type: string;
    uploadedAt: Date;
  }>;
  createdAt: Date;
}

const StartupSchema = new Schema<IStartup>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  targetAudience: { type: String, required: true },
  market: { type: String, required: true },
  businessModel: { type: String, required: true },
  fundingStage: { type: String, required: true },
  location: { type: String, required: true },
  tags: { type: [String], default: [] },
  teamMembers: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, default: 'Member' }
  }],
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  healthScore: { type: Number, default: 70 },
  growthForecast: { type: Number, default: 0 },
  validationScore: { type: Number, default: 0 },
  fundingReadiness: { type: Number, default: 50 },
  marketOpportunity: { type: Number, default: 50 },
  documents: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IStartup>('Startup', StartupSchema);
