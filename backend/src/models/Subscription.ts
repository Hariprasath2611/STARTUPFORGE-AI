import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  stripeSubscriptionId?: string;
  currentPeriodEnd: Date;
  aiUsageLimit: number;
  aiUsageCount: number;
  maxStartups: number;
  createdAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  plan: { type: String, enum: ['free', 'starter', 'pro', 'enterprise'], default: 'free' },
  status: { type: String, enum: ['active', 'canceled', 'past_due'], default: 'active' },
  stripeSubscriptionId: { type: String },
  currentPeriodEnd: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // 30 days
  aiUsageLimit: { type: Number, default: 20 }, // 20 requests for free tier
  aiUsageCount: { type: Number, default: 0 },
  maxStartups: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: string;
  stripePaymentIntentId?: string;
  plan: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, required: true },
  stripePaymentIntentId: { type: String },
  plan: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
