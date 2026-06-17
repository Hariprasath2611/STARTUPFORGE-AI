import mongoose, { Schema, Document } from 'mongoose';

export interface IPitchDeck extends Document {
  startupId: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  slides: Array<{
    title: string;
    bullets: string[];
    visualType?: 'chart' | 'grid' | 'quote' | 'metrics' | 'text';
  }>;
  createdAt: Date;
}

const PitchDeckSchema = new Schema<IPitchDeck>({
  startupId: { type: Schema.Types.ObjectId, ref: 'Startup', required: true, index: true },
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  slides: [{
    title: { type: String, required: true },
    bullets: { type: [String], default: [] },
    visualType: { type: String, enum: ['chart', 'grid', 'quote', 'metrics', 'text'], default: 'text' }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPitchDeck>('PitchDeck', PitchDeckSchema);
