import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, Shield, Zap, TrendingUp, Users, Cpu, FileText, 
  ChevronDown, HelpCircle, Check, ArrowRight, Star
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How does the AI Validator work?", a: "The AI Validator processes your startup idea against live market segments, competitors, and economic data using Gemini models. It scores your idea on market demand, competitive threats, technical feasibility, and funding readiness." },
    { q: "Can I invite co-founders and team members?", a: "Yes, StartupForge is collaborative. You can invite team members to your startup workspace, allocate tasks, share file resources, and chat in channels in real-time." },
    { q: "How does the Co-Founder matching work?", a: "We analyze founder profiles (skills, interests, personality profiles) and utilize predictive algorithms to match you with compatible partners (developers, designers, PMs, marketers)." },
    { q: "Is my IP secure?", a: "Absolutely. We encrypt all user documents and workspace ideas. Your proprietary data is never used to train public models." }
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-borderBg/50 bg-[#0F1115]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <Flame className="h-6 w-6 text-primary animate-pulse" />
            <span className="font-display font-bold text-xl tracking-wider uppercase text-white">
              StartupForge<span className="text-primary">.AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm text-textSecondary">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Success Stories</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-primary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/auth')} 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/auth?signup=true')}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary hover:bg-secondary border border-transparent shadow-glow transition-all duration-200"
            >
              Start Building
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Ambient Glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full text-xs font-semibold text-primary mb-6 animate-bounce">
            <span>🚀 Incubator Cohort Summer 2026 Open</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
            Turn Startup Ideas Into <br/>
            <span className="text-gradient-orange">Fundable Companies</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Validate market demand, forecast financial runways, assemble co-founding teams, and pitch to institutional VCs—all powered by predictive AI.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <button 
              onClick={() => navigate('/auth?signup=true')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-secondary font-semibold shadow-glow transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Building</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => navigate('/auth?signup=true&action=validate')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-borderBg hover:border-primary/50 bg-[#161A22]/40 backdrop-blur-sm font-semibold transition-all"
            >
              Validate Idea
            </button>
            <button 
              onClick={() => alert("Book a Demo: Contact our acceleration team at accelerator@startupforge.ai")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl hover:bg-surface/50 text-textSecondary font-semibold transition-all"
            >
              Book Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="border-t border-borderBg/50 pt-10 max-w-5xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-textSecondary mb-6 font-semibold">Backed by top-tier operators from</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-center opacity-50 grayscale hover:opacity-85 transition-opacity">
              <span className="text-lg font-bold">Y COMBINATOR</span>
              <span className="text-lg font-bold">STRIPE</span>
              <span className="text-lg font-bold">NOTION</span>
              <span className="text-lg font-bold">LINEAR</span>
              <span className="text-lg font-bold">CRUNCHBASE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-borderBg/40">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Accelerate Every Stage of Launch
          </h2>
          <p className="text-textSecondary max-w-2xl mx-auto">
            Comprehensive tools to guide you from kitchen-table brainstorm to Series A closing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">AI Startup Validator</h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              Verify demand before writing code. Generate detailed viability scores, risk indexes, and market feedback charts.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">Simulation Engine</h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              Stress-test financial runway, burn rates, subscriber graphs, and pricing variations using complex forecast metrics.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">Co-Founder Matching</h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              Meet developers, designers, and marketers in our community. Assess personality fit with compatibility algorithms.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">Business Plan & Deck Generator</h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              Synthesize 15-page business plans (Lean Canvas models) and investor-ready 10-slide decks formatted for PDF downloads.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">Advisor Copilot</h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              A 24/7 incubator partner. Get contextual guidance on fundraising legal terms, growth hack funnels, and technical API stacks.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">Investor Marketplace</h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              Submit investment proposals and pitch decks directly to matched angel and VC funds looking for your exact tech sector.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-[#161A22]/30 border-t border-borderBg/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Graduates Raising Capital</h2>
            <p className="text-textSecondary">Hear from founders who validated, built, and funded their ventures.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-2xl relative">
              <div className="flex items-center space-x-1 text-accent mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent" />)}
              </div>
              <p className="text-sm text-textSecondary mb-6 italic leading-relaxed">
                "StartupForge's validation scoring flagged structural weaknesses in our initial monetization pipeline. Correcting that before writing code saved us 3 months of dev. We just closed our $1.2M Pre-seed."
              </p>
              <div>
                <h4 className="font-semibold text-white">Elena Rostova</h4>
                <p className="text-xs text-primary font-medium">CEO at OptimaFlow ($1.2M Seed Raised)</p>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl relative">
              <div className="flex items-center space-x-1 text-accent mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent" />)}
              </div>
              <p className="text-sm text-textSecondary mb-6 italic leading-relaxed">
                "We matched with our Lead developer within 48 hours via the matching dashboard. The interactive runway simulations helped us align on a realistic burn-rate model that investors loved."
              </p>
              <div>
                <h4 className="font-semibold text-white">David Chen</h4>
                <p className="text-xs text-primary font-medium">Founder at SyncDock (Techstars Graduate)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-borderBg/30">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Transparent Pricing for Builders</h2>
          <p className="text-textSecondary">Scale your workspace as you raise capital and grow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Free */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-t-2 border-t-textSecondary/25">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-textSecondary">Free</span>
              <h3 className="font-display text-3xl font-bold mt-2 mb-4">$0 <span className="text-sm font-normal text-textSecondary">/mo</span></h3>
              <p className="text-xs text-textSecondary mb-6">Test the validation simulator.</p>
              <ul className="text-xs space-y-3 mb-8 text-textSecondary">
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> 1 Startup Workspace</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> 20 AI Validation Scans</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> Basic Financial Charts</li>
              </ul>
            </div>
            <button onClick={() => navigate('/auth?signup=true')} className="w-full py-2.5 rounded-lg border border-borderBg hover:border-primary/50 text-xs font-semibold transition-all">Start Building</button>
          </div>

          {/* Starter */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-t-2 border-t-primary/50">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Starter</span>
              <h3 className="font-display text-3xl font-bold mt-2 mb-4">$29 <span className="text-sm font-normal text-textSecondary">/mo</span></h3>
              <p className="text-xs text-textSecondary mb-6">For single founders launching MVP.</p>
              <ul className="text-xs space-y-3 mb-8 text-textSecondary">
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> 3 Startup Workspaces</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> 100 AI Scans & Advisor Queries</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> MVP Planner & Business Plans</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> Export Pitch Decks to PDF</li>
              </ul>
            </div>
            <button onClick={() => navigate('/auth?signup=true')} className="w-full py-2.5 rounded-lg bg-primary hover:bg-secondary text-xs font-semibold transition-all">Upgrade Now</button>
          </div>

          {/* Pro */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-primary/50 relative border-t-2 border-t-primary shadow-glow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black font-extrabold text-[10px] uppercase px-2 py-0.5 rounded">Popular</div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Pro</span>
              <h3 className="font-display text-3xl font-bold mt-2 mb-4">$79 <span className="text-sm font-normal text-textSecondary">/mo</span></h3>
              <p className="text-xs text-textSecondary mb-6">For teams preparing for funding rounds.</p>
              <ul className="text-xs space-y-3 mb-8 text-textSecondary">
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> 10 Workspaces & Team Seats</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> 500 AI Scans & Memory Advisor</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> Competitor SWOT Matrices</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> Unlimited Real-time Chat channels</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> Pitch Submissions to Investors</li>
              </ul>
            </div>
            <button onClick={() => navigate('/auth?signup=true')} className="w-full py-2.5 rounded-lg bg-primary hover:bg-secondary text-xs font-semibold transition-all">Get Pro</button>
          </div>

          {/* Enterprise */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-t-2 border-t-accent">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Enterprise</span>
              <h3 className="font-display text-3xl font-bold mt-2 mb-4">$299 <span className="text-sm font-normal text-textSecondary">/mo</span></h3>
              <p className="text-xs text-textSecondary mb-6">For accelerator nodes and studios.</p>
              <ul className="text-xs space-y-3 mb-8 text-textSecondary">
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> Unlimited Workspaces</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> Custom Model Training & Fine-tuning</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> White-label Portal layouts</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> API Access & Webhook bindings</li>
              </ul>
            </div>
            <button onClick={() => navigate('/auth?signup=true')} className="w-full py-2.5 rounded-lg border border-borderBg hover:border-accent/50 text-xs font-semibold text-accent transition-all">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 border-t border-borderBg/30">
        <h2 className="font-display text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-xl overflow-hidden">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-medium text-sm sm:text-base flex items-center">
                  <HelpCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`h-4 w-4 text-textSecondary transition-transform ${activeFaq === idx ? 'rotate-188' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 text-sm text-textSecondary leading-relaxed border-t border-borderBg/30 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-borderBg bg-[#0b0c0f] py-12 text-center text-textSecondary text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-white uppercase tracking-wider">StartupForge AI</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">API Status</a>
          </div>
          <p>© 2026 StartupForge AI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
