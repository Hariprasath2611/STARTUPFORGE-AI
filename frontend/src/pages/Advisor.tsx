import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Sparkles, Send, Bot, User, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Advisor() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I am your StartupForge AI Advisor. Ask me anything regarding funding rounds, product-market validation, growth strategies, or tech architectures." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Assemble conversation history for the AI Service context window
      const historyPayload = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content
      }));

      const response = await axios.post('/api/ai/advisor', {
        message: input,
        history: historyPayload
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I had trouble contacting my cognitive servers. Please retry!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[calc(100vh-12rem)] shadow-glass overflow-hidden border border-borderBg">
      {/* Advisor Header */}
      <div className="p-4 bg-surface border-b border-borderBg flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary animate-pulse"><Bot className="h-5 w-5" /></div>
          <div>
            <h3 className="text-sm font-bold font-display text-white">AI Incubator Copilot</h3>
            <span className="text-[9px] uppercase tracking-wider text-success font-semibold flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-success mr-1"></span>
              Context Memory Active
            </span>
          </div>
        </div>
      </div>

      {/* Message scrolling grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex items-start space-x-2.5 max-w-2xl ${m.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`p-2 rounded-full ${m.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-surface border border-borderBg text-white'}`}>
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`p-3 text-xs leading-relaxed rounded-2xl whitespace-pre-line ${
              m.role === 'user' 
                ? 'bg-primary text-black font-semibold' 
                : 'bg-surface border border-borderBg text-textSecondary'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start space-x-2.5">
            <div className="p-2 rounded-full bg-surface border border-borderBg text-white"><Bot className="h-4 w-4" /></div>
            <div className="p-3 bg-surface border border-borderBg rounded-2xl flex items-center space-x-2">
              <RefreshCw className="h-3.5 w-3.5 text-primary animate-spin" />
              <span className="text-[10px] text-textSecondary font-semibold">Advisor is typing...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Input panel */}
      <form className="p-4 bg-[#11141b] border-t border-borderBg flex gap-2" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about CAC optimization, pre-seed valuations, SAFEs, or product roadmaps..."
          className="flex-1 form-input text-xs"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary hover:bg-secondary text-black font-semibold text-xs rounded-xl shadow-glow transition-all flex items-center justify-center"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
