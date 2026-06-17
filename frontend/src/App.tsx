import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { 
  Flame, LayoutDashboard, Building, Sparkles, Target, 
  FileText, Terminal, Presentation, Wallet, Bot, 
  Building2, Users, MessageSquare, FolderSearch, 
  CreditCard, ShieldAlert, LogOut, Menu
} from 'lucide-react';

// Import Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import StartupWorkspace from './pages/StartupWorkspace';
import Validator from './pages/Validator';
import CompetitorIntelligence from './pages/CompetitorIntelligence';
import BusinessPlanGenerator from './pages/BusinessPlanGenerator';
import MVPPlanner from './pages/MVPPlanner';
import PitchDeckGenerator from './pages/PitchDeckGenerator';
import SimulationEngine from './pages/SimulationEngine';
import Advisor from './pages/Advisor';
import InvestorMarketplace from './pages/InvestorMarketplace';
import CoFounderMatching from './pages/CoFounderMatching';
import TeamCollaboration from './pages/TeamCollaboration';
import KnowledgeBase from './pages/KnowledgeBase';
import Subscriptions from './pages/Subscriptions';
import AdminPanel from './pages/AdminPanel';

function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/workspace', label: 'Startup Workspace', icon: Building },
    { path: '/validator', label: 'AI Validator', icon: Sparkles },
    { path: '/competitors', label: 'Competitor Intelligence', icon: Target },
    { path: '/business-plan', label: 'Business Plan', icon: FileText },
    { path: '/mvp-plan', label: 'MVP Planner', icon: Terminal },
    { path: '/pitch-deck', label: 'Pitch Deck', icon: Presentation },
    { path: '/simulator', label: 'Simulation Engine', icon: Wallet },
    { path: '/advisor', label: 'AI Advisor', icon: Bot },
    { path: '/investors', label: 'Investor Marketplace', icon: Building2 },
    { path: '/cofounders', label: 'Co-Founder Matching', icon: Users },
    { path: '/collaboration', label: 'Team Collaboration', icon: MessageSquare },
    { path: '/knowledge', label: 'Knowledge Base', icon: FolderSearch },
    { path: '/billing', label: 'Subscriptions', icon: CreditCard },
  ];

  // Add Admin item if role is admin
  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin Panel', icon: ShieldAlert });
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-borderBg/50 bg-[#12161F] flex flex-col justify-between flex-shrink-0 hidden md:flex">
        <div className="p-5 flex flex-col space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Flame className="h-6 w-6 text-primary animate-pulse" />
            <span className="font-display font-bold text-lg tracking-wider uppercase">
              Forge<span className="text-primary">.AI</span>
            </span>
          </div>

          {/* User profile capsule */}
          <div className="p-3 bg-surface rounded-xl border border-borderBg flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold truncate text-white">{user?.name || 'Venture Founder'}</h4>
              <span className="text-[9px] text-textSecondary uppercase tracking-widest font-bold">{user?.role}</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-primary/10 border border-primary/20 text-primary' 
                      : 'text-textSecondary hover:text-white hover:bg-surface/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-borderBg/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-textSecondary hover:text-error hover:bg-error/5 rounded-lg transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Mobile Navbar Header */}
        <header className="h-14 border-b border-borderBg/50 bg-[#12161F]/80 backdrop-blur-md flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-sm uppercase tracking-wider">Forge AI</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-textSecondary hover:text-error transition-colors">Sign Out</button>
        </header>

        {/* Dynamic page container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function RouteLock({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <SidebarLayout>{children}</SidebarLayout> : <AuthPage />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Secured Dashboard Pages */}
        <Route path="/dashboard" element={<RouteLock><Dashboard /></RouteLock>} />
        <Route path="/workspace" element={<RouteLock><StartupWorkspace /></RouteLock>} />
        <Route path="/validator" element={<RouteLock><Validator /></RouteLock>} />
        <Route path="/competitors" element={<RouteLock><CompetitorIntelligence /></RouteLock>} />
        <Route path="/business-plan" element={<RouteLock><BusinessPlanGenerator /></RouteLock>} />
        <Route path="/mvp-plan" element={<RouteLock><MVPPlanner /></RouteLock>} />
        <Route path="/pitch-deck" element={<RouteLock><PitchDeckGenerator /></RouteLock>} />
        <Route path="/simulator" element={<RouteLock><SimulationEngine /></RouteLock>} />
        <Route path="/advisor" element={<RouteLock><Advisor /></RouteLock>} />
        <Route path="/investors" element={<RouteLock><InvestorMarketplace /></RouteLock>} />
        <Route path="/cofounders" element={<RouteLock><CoFounderMatching /></RouteLock>} />
        <Route path="/collaboration" element={<RouteLock><TeamCollaboration /></RouteLock>} />
        <Route path="/knowledge" element={<RouteLock><KnowledgeBase /></RouteLock>} />
        <Route path="/billing" element={<RouteLock><Subscriptions /></RouteLock>} />
        <Route path="/admin" element={<RouteLock><AdminPanel /></RouteLock>} />
      </Routes>
    </Router>
  );
}
