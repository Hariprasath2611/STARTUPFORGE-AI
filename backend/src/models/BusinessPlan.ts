import mongoose, { Schema, Document } from 'mongoose';

export interface IBusinessPlan extends Document {
  startupId: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  content: {
    executiveSummary: string;
    vision: string;
    mission: string;
    problemStatement: string;
    solution: string;
    marketAnalysis: string;
    businessModelCanvas: {
      customerSegments: string[];
      valuePropositions: string[];
      channels: string[];
      customerRelationships: string[];
      revenueStreams: string[];
      keyActivities: string[];
      keyResources: string[];
      keyPartners: string[];
      costStructure: string[];
    };
    marketingStrategy: string;
    growthStrategy: string;
    financialForecast: string;
    riskAnalysis: string;
    fundingPlan: string;
  };
  createdAt: Date;
}

const BusinessPlanSchema = new Schema<IBusinessPlan>({
  startupId: { type: Schema.Types.ObjectId, ref: 'Startup', required: true, index: true },
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: {
    executiveSummary: { type: String, default: '' },
    vision: { type: String, default: '' },
    mission: { type: String, default: '' },
    problemStatement: { type: String, default: '' },
    solution: { type: String, default: '' },
    marketAnalysis: { type: String, default: '' },
    businessModelCanvas: {
      customerSegments: { type: [String], default: [] },
      valuePropositions: { type: [String], default: [] },
      channels: { type: [String], default: [] },
      customerRelationships: { type: [String], default: [] },
      revenueStreams: { type: [String], default: [] },
      keyActivities: { type: [String], default: [] },
      keyResources: { type: [String], default: [] },
      keyPartners: { type: [String], default: [] },
      costStructure: { type: [String], default: [] }
    },
    marketingStrategy: { type: String, default: '' },
    growthStrategy: { type: String, default: '' },
    financialForecast: { type: String, default: '' },
    riskAnalysis: { type: String, default: '' },
    fundingPlan: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBusinessPlan>('BusinessPlan', BusinessPlanSchema);
