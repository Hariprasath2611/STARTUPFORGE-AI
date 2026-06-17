import mongoose, { Schema, Document } from 'mongoose';

// Task Schema
export interface ITask extends Document {
  startupId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  assignedTo?: mongoose.Types.ObjectId;
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: Date;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
  startupId: { type: Schema.Types.ObjectId, ref: 'Startup', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export const Task = mongoose.model<ITask>('Task', TaskSchema);

// Message Schema
export interface IMessage extends Document {
  startupId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  content: string;
  channel: string; // e.g. "general", "marketing", "tech"
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  startupId: { type: Schema.Types.ObjectId, ref: 'Startup', required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  channel: { type: String, default: 'general', index: true },
  createdAt: { type: Date, default: Date.now }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);

// Notification Schema
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
