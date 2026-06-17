import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useStartupStore } from '../store/startupStore';
import { 
  MessageSquare, Users, CheckSquare, Plus, 
  Send, RefreshCw, Layers, CheckCircle2
} from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
}

interface Message {
  senderName: string;
  content: string;
  createdAt: string;
}

export default function TeamCollaboration() {
  const { user } = useAuthStore();
  const { activeStartup } = useStartupStore();

  const [activeTab, setActiveTab] = useState<'chat' | 'tasks'>('chat');
  const [channel, setChannel] = useState('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeStartup) return;

    // Fetch message history and tasks list
    fetchHistory();
    fetchTasks();

    // Initialize WebSockets
    const socket = io('http://localhost:5000');
    socketRef.current = socket;

    socket.emit('join_workspace', { startupId: activeStartup._id, channel });

    socket.on('receive_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [activeStartup, channel]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    if (!activeStartup) return;
    try {
      const response = await axios.get(`/api/collaboration/messages/${activeStartup._id}/${channel}`);
      setMessages(response.data);
    } catch (err) {
      console.warn("WebSocket API Offline, populating mock chat message logs");
      setMessages([
        { senderName: "Sarah Jenkins", content: "Hey team! I uploaded the new pitch design outlines in the Workspace tab. Let me know what you think.", createdAt: new Date(Date.now() - 3600000).toISOString() },
        { senderName: "Dev Founder", content: "Awesome, let's review it during our next sync. I'll write the API spec templates in the MVP Planner today.", createdAt: new Date(Date.now() - 1800000).toISOString() }
      ]);
    }
  };

  const fetchTasks = async () => {
    if (!activeStartup) return;
    try {
      const response = await axios.get(`/api/collaboration/tasks/${activeStartup._id}`);
      setTasks(response.data);
    } catch (err) {
      console.warn("API Offline, loading mock tasks lists");
      setTasks([
        { _id: "task_1", title: "Complete landing page mockups", description: "Design Figma frameworks", status: "todo" },
        { _id: "task_2", title: "Integrate stripe APIs", description: "Establish token validation calls", status: "in_progress" },
        { _id: "task_3", title: "Verify database models", description: "Connect mongoose routers", status: "done" }
      ]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeStartup || !user) return;

    const msgPayload = {
      startupId: activeStartup._id,
      senderId: user.id,
      senderName: user.name,
      content: inputMessage,
      channel
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('send_message', msgPayload);
    } else {
      // Offline fallback: push message manually
      setMessages(prev => [...prev, {
        senderName: user.name,
        content: inputMessage,
        createdAt: new Date().toISOString()
      }]);
    }
    setInputMessage('');
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !activeStartup) return;

    try {
      const response = await axios.post('/api/collaboration/tasks', {
        startupId: activeStartup._id,
        title: taskTitle,
        description: 'Assigned via Collaboration Dashboard'
      });
      setTasks(prev => [...prev, response.data]);
      setTaskTitle('');
      setShowTaskForm(false);
    } catch (err) {
      // Fallback
      setTasks(prev => [...prev, {
        _id: "task_" + Math.random().toString(36).substring(5),
        title: taskTitle,
        description: 'Local memory assignment',
        status: 'todo'
      }]);
      setTaskTitle('');
      setShowTaskForm(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    try {
      await axios.put(`/api/collaboration/tasks/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display">Team Collaboration</h1>
          <p className="text-xs text-textSecondary mt-1">Coordinate task boards and communicate across WebSocket chat channels.</p>
        </div>
        <div className="flex space-x-2 text-[10px] font-semibold">
          {[
            { id: 'chat', label: 'Chat Channels', icon: MessageSquare },
            { id: 'tasks', label: 'Tasks Board', icon: CheckSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1 transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary/20 border-primary text-primary shadow-glow' 
                  : 'border-borderBg hover:bg-surface/50 text-textSecondary hover:text-white'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {!activeStartup ? (
        <div className="glass-panel p-12 rounded-2xl text-center text-textSecondary text-xs">
          Please select or create a startup workspace first.
        </div>
      ) : activeTab === 'chat' ? (
        /* CHAT CHANNELS PANEL */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-16rem)] overflow-hidden">
          {/* Channels Sidebar */}
          <div className="glass-panel p-4 rounded-2xl space-y-4">
            <span className="text-[9px] uppercase tracking-widest text-textSecondary font-bold block">Channels</span>
            <div className="space-y-1 text-xs">
              {['general', 'engineering', 'marketing', 'fundraising'].map(ch => (
                <button
                  key={ch}
                  onClick={() => setChannel(ch)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-semibold tracking-wide transition-all ${
                    channel === ch 
                      ? 'bg-primary/10 border border-primary/20 text-primary' 
                      : 'hover:bg-surface text-textSecondary'
                  }`}
                >
                  # {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Chat scrolling feed */}
          <div className="md:col-span-3 glass-panel rounded-2xl flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center space-x-2 text-[10px] text-textSecondary">
                    <span className="font-bold text-white">{m.senderName}</span>
                    <span>•</span>
                    <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-textSecondary bg-surface border border-borderBg p-3 rounded-xl max-w-xl leading-relaxed">{m.content}</p>
                </div>
              ))}
              <div ref={scrollRef}></div>
            </div>

            <form className="p-4 bg-[#11141b] border-t border-borderBg flex gap-2" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Type a message in #${channel}...`}
                className="flex-1 form-input text-xs"
              />
              <button type="submit" className="px-4 py-2 bg-primary hover:bg-secondary text-black font-semibold text-xs rounded-xl shadow-glow">
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* KANBAN TASKS BOARD */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-textSecondary">Tasks checklist</span>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="px-3 py-1.5 bg-primary hover:bg-secondary text-black font-semibold text-[10px] rounded-lg shadow-glow flex items-center space-x-1 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Task</span>
            </button>
          </div>

          {showTaskForm && (
            <form onSubmit={handleCreateTask} className="glass-panel p-4 rounded-xl flex gap-2 items-center max-w-md">
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task Title (e.g. Map competitor gaps)"
                className="flex-1 form-input text-xs py-2"
              />
              <button type="submit" className="px-4 py-2 bg-primary hover:bg-secondary text-black font-semibold text-xs rounded-lg shadow-glow">Add</button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: TODO */}
            <div className="glass-panel p-4 rounded-2xl space-y-4 border-t-2 border-t-textSecondary/30">
              <span className="text-[9px] uppercase tracking-wider text-textSecondary font-bold block">Backlog / Todo ({tasks.filter(t => t.status === 'todo').length})</span>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'todo').map(t => (
                  <div key={t._id} className="p-3 bg-surface rounded-xl border border-borderBg space-y-2">
                    <h4 className="text-xs font-bold text-white">{t.title}</h4>
                    <p className="text-[10px] text-textSecondary">{t.description}</p>
                    <button onClick={() => handleUpdateTaskStatus(t._id, 'in_progress')} className="text-[9px] font-bold text-primary hover:underline block pt-1">Start Task →</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: IN PROGRESS */}
            <div className="glass-panel p-4 rounded-2xl space-y-4 border-t-2 border-t-warning">
              <span className="text-[9px] uppercase tracking-wider text-warning font-bold block">In Progress ({tasks.filter(t => t.status === 'in_progress').length})</span>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'in_progress').map(t => (
                  <div key={t._id} className="p-3 bg-surface rounded-xl border border-borderBg space-y-2">
                    <h4 className="text-xs font-bold text-white">{t.title}</h4>
                    <p className="text-[10px] text-textSecondary">{t.description}</p>
                    <button onClick={() => handleUpdateTaskStatus(t._id, 'done')} className="text-[9px] font-bold text-success hover:underline block pt-1">Mark Completed ✓</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: DONE */}
            <div className="glass-panel p-4 rounded-2xl space-y-4 border-t-2 border-t-success">
              <span className="text-[9px] uppercase tracking-wider text-success font-bold block">Done ({tasks.filter(t => t.status === 'done').length})</span>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'done').map(t => (
                  <div key={t._id} className="p-3 bg-surface rounded-xl border border-borderBg space-y-2 opacity-75">
                    <h4 className="text-xs font-bold text-white line-through">{t.title}</h4>
                    <p className="text-[10px] text-textSecondary">{t.description}</p>
                    <span className="text-[8px] text-success font-bold flex items-center pt-1"><CheckCircle2 className="h-3 w-3 mr-1" /> Complete</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
