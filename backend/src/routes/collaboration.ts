import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { Task, Message, Notification } from '../models/Collaboration';
import Startup from '../models/Startup';

const router = Router();

// GET tasks for startup
router.get('/tasks/:startupId', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { startupId } = req.params;
    const tasks = await Task.find({ startupId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE task
router.post('/tasks', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { startupId, title, description, assignedTo, dueDate } = req.body;

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    const newTask = new Task({
      startupId,
      title,
      description,
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      status: 'todo'
    });

    await newTask.save();

    // Create notifications for the assigned user
    if (assignedTo) {
      await new Notification({
        userId: assignedTo,
        title: 'New Task Assigned',
        content: `You have been assigned to: ${title} inside workspace: ${startup.name}`,
        link: `/workspace/collaboration`
      }).save();
    }

    res.status(201).json(newTask);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE task status
router.put('/tasks/:taskId', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { status, title, description, assignedTo, dueDate } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.status = status || task.status;
    task.title = title || task.title;
    task.description = description || task.description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET messages for channel
router.get('/messages/:startupId/:channel', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { startupId, channel } = req.params;
    const messages = await Message.find({ startupId, channel }).sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET notifications
router.get('/notifications', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ userId: req.user?.id }).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// MARK notification read
router.put('/notifications/:id/read', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
