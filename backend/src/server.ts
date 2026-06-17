import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/auth';
import startupRoutes from './routes/startups';
import aiRoutes from './routes/ai';
import collaborationRoutes from './routes/collaboration';
import subscriptionRoutes from './routes/subscriptions';
import adminRoutes from './routes/admin';
import cofounderRoutes from './routes/cofounders';
import investorRoutes from './routes/investors';

// Import Models for socket events
import { Message } from './models/Collaboration';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/startupforge';

// Middlewares
app.use(cors());
app.use(express.json());

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cofounders', cofounderRoutes);
app.use('/api/investors', investorRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Socket.io Realtime Collaboration Chat Setup
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // Join workspace room
  socket.on('join_workspace', (data: { startupId: string; channel: string }) => {
    const room = `${data.startupId}_${data.channel}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  // Handle message sending
  socket.on('send_message', async (data: {
    startupId: string;
    senderId: string;
    senderName: string;
    content: string;
    channel: string;
  }) => {
    try {
      const room = `${data.startupId}_${data.channel}`;
      
      // Save message to MongoDB
      const newMessage = new Message({
        startupId: data.startupId,
        senderId: data.senderId,
        senderName: data.senderName,
        content: data.content,
        channel: data.channel
      });
      await newMessage.save();

      // Broadcast to room
      io.to(room).emit('receive_message', newMessage);
      console.log(`Message broadcasted in room ${room}: ${data.content}`);
    } catch (err) {
      console.error('Socket error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Database Connection & Server Boot
async function startServer() {
  try {
    mongoose.set('strictQuery', false);
    // Suppress strict connection error locally so the application starts anyway
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB successfully connected.');
  } catch (error) {
    console.warn('MongoDB connection failed. Continuing in local-mock mode for databases.');
  }

  server.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
  });
}

startServer();
export { app, io };
