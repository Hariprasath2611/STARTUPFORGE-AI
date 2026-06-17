import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useStartupStore } from '../store/startupStore';
import { 
  Plus, Lightbulb, TrendingUp, ShieldCheck, HeartPulse, 
  Users, Layers, Settings, FileSpreadsheet, Play, Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { startups, activeStartup, fetchStartups, selectStartup } = useStartupStore();

  useEffect(() => {
    fetchStartups();
  }, []);

  const chartData = [
    { name: 'Month 1', users: 120, revenue: 1200 },
    { name: 'Month 2', users: 340, revenue: 3400 },
    { name: 'Month 3', users: 890, revenue: 8900 },
    { name: 'Month 4', users: 1980, revenue: 19800 },
    { name: 'Month 5', users: 4500, revenue: 45000 },
    { name: 'Month 6', users: 9800, revenue: 98000 }
  ];

  const radarData = activeStartup ? [
    { subject: 'Validation', A: activeStartup.validationScore || 70, fullMark: 100 },
    { subject: 'Market Opp', A: activeStartup.marketOpportunity || 75, fullMark: 100 },
    { subject: 'Funding Ready', A: activeStartup.fundingReadiness || 60, fullMark: 100 },
    { subject: 'Health Score', A: activeStartup.healthScore || 80, fullMark: 100 },
    { subject: 'Growth Forecast', A: activeStartup.growthForecast * 5 || 75, fullMark: 100 }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Top Welcome Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-surface to-surface/40 p-6 rounded-2xl border border-borderBg">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display">Welcome Back, {user?.name || 'Founder'}</h1>
          <p className="text-xs sm:text-sm text-textSecondary mt-1">Accelerate your product roadmap and raise capital with StartupForge AI.</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select 
            value={activeStartup?._id || ''}
            onChange={(e) => selectStartup(e.target.value)}
            className="form-input text-xs font-semibold bg-background border border-borderBg py-2"
          >
            {startups.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            {startups.length === 0 && <option>No workspaces</option>}
          </select>
          <button 
            onClick={() => navigate('/workspace')} 
            className="p-2 rounded-lg bg-primary hover:bg-secondary text-black shadow-glow transition-all"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">Validation Score</span>
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary"><Lightbulb className="h-4 w-4" /></span>
          </div>
          <div className="mt-4">
            <h3 className="font-display text-2xl font-bold">{activeStartup?.validationScore || 0}%</h3>
            <p className="text-[10px] text-success mt-1">▲ Strong market viability</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">Market Opportunity</span>
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary"><Layers className="h-4 w-4" /></span>
          </div>
          <div className="mt-4">
            <h3 className="font-display text-2xl font-bold">{activeStartup?.marketOpportunity || 0}%</h3>
            <p className="text-[10px] text-success mt-1">▲ Venture-scale size</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">Funding Readiness</span>
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary"><ShieldCheck className="h-4 w-4" /></span>
          </div>
          <div className="mt-4">
            <h3 className="font-display text-2xl font-bold">{activeStartup?.fundingReadiness || 0}%</h3>
            <p className="text-[10px] text-warning mt-1">● Pitch deck ready</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">Startup Health</span>
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary"><HeartPulse className="h-4 w-4" /></span>
          </div>
          <div className="mt-4">
            <h3 className="font-display text-2xl font-bold">{activeStartup?.healthScore || 0}%</h3>
            <p className="text-[10px] text-success mt-1">▲ 15 mo runway</p>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Growth projection chart */}
        <div className="glass-panel p-6 rounded-2xl md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider">Growth Forecast Projection</h3>
            <span className="text-xs text-textSecondary font-medium">6 Month Estimate</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2B3342" />
                <XAxis dataKey="name" stroke="#A0AEC0" fontSize={10} />
                <YAxis stroke="#A0AEC0" fontSize={10} />
                <Tooltip contentStyle={{ background: '#161A22', borderColor: '#2B3342', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#FF6B00" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="ARR ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Health Chart */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Startup Health Radar</h3>
          {activeStartup ? (
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#2B3342" />
                  <PolarAngleAxis dataKey="subject" stroke="#A0AEC0" fontSize={9} />
                  <PolarRadiusAxis stroke="#A0AEC0" fontSize={9} angle={30} domain={[0, 100]} />
                  <Radar name={activeStartup.name} dataKey="A" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-xs text-textSecondary text-center my-auto">Create a startup workspace to load radar scorecards.</div>
          )}
        </div>
      </div>

      {/* Activity and AI insights panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Insight Panel */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-2 text-primary">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider">AI Incubation Advisor Insights</h3>
          </div>
          <div className="space-y-4 text-xs text-textSecondary leading-relaxed">
            <div className="p-3 bg-surface rounded-xl border border-borderBg">
              <span className="font-bold text-white block mb-1">🎯 Next Step Recommendation</span>
              Your validation score stands at {activeStartup?.validationScore || 70}%. The highest leverage action is to build a standard pitch deck for local VC reviews. Use our automated generator to export a PDF deck.
            </div>
            <div className="p-3 bg-surface rounded-xl border border-borderBg">
              <span className="font-bold text-white block mb-1">💡 Competitive Gaps Flagged</span>
              Competitors in the {activeStartup?.industry || 'technology'} industry are lacking developer integrations. Standardize your API routing files to secure a unique selling proposition (USP).
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider">Quick Actions Portal</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/validator')}
              className="p-4 rounded-xl bg-surface hover:bg-[#1E2430] border border-borderBg text-left flex flex-col justify-between h-28 group transition-all"
            >
              <Lightbulb className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xs block text-white">AI Validator</span>
                <span className="text-[9px] text-textSecondary">Test startup ideas viability</span>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/pitch-deck')}
              className="p-4 rounded-xl bg-surface hover:bg-[#1E2430] border border-borderBg text-left flex flex-col justify-between h-28 group transition-all"
            >
              <Layers className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xs block text-white">Pitch Deck</span>
                <span className="text-[9px] text-textSecondary">Create slide decks</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/simulator')}
              className="p-4 rounded-xl bg-surface hover:bg-[#1E2430] border border-borderBg text-left flex flex-col justify-between h-28 group transition-all"
            >
              <TrendingUp className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xs block text-white">Simulation</span>
                <span className="text-[9px] text-textSecondary">Forecast cash runways</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/advisor')}
              className="p-4 rounded-xl bg-surface hover:bg-[#1E2430] border border-borderBg text-left flex flex-col justify-between h-28 group transition-all"
            >
              <Users className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xs block text-white">AI Advisor</span>
                <span className="text-[9px] text-textSecondary">Chat with AI Copilot</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
