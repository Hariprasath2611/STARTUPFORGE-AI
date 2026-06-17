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
    <div class="min-h-screen bg-[#0F1115] text-white">
      {/* Navigation */}
      <nav class="sticky top-0 z-50 border-b border-borderBg/50 bg-[#0F1115]/80 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <Flame class="h-6 w-6 text-primary animate-pulse" />
            <span class="font-display font-bold text-xl tracking-wider uppercase text-white">
              StartupForge<span class="text-primary">.AI</span>
            </span>
          </div>
          <div class="hidden md:flex items-center space-x-8 text-sm text-textSecondary">
            <a href="#features" class="hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" class="hover:text-primary transition-colors">Success Stories</a>
            <a href="#pricing" class="hover:text-primary transition-colors">Pricing</a>
            <a href="#faqs" class="hover:text-primary transition-colors">FAQ</a>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/auth')} 
              class="text-sm font-medium hover:text-primary transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/auth?signup=true')}
              class="px-4 py-2 text-sm font-medium rounded-lg bg-primary hover:bg-secondary border border-transparent shadow-glow transition-all duration-200"
            >
              Start Building
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section class="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Ambient Glow background */}
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div class="relative z-10">
          <div class="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full text-xs font-semibold text-primary mb-6 animate-bounce">
            <span>🚀 Incubator Cohort Summer 2026 Open</span>
          </div>
          
          <h1 class="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
            Turn Startup Ideas Into <br/>
            <span class="text-gradient-orange">Fundable Companies</span>
          </h1>
          
          <p class="text-lg sm:text-xl text-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Validate market demand, forecast financial runways, assemble co-founding teams, and pitch to institutional VCs—all powered by predictive AI.
          </p>

          <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <button 
              onClick={() => navigate('/auth?signup=true')}
              class="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-secondary font-semibold shadow-glow transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Building</span>
              <ArrowRight class="h-4 w-4" />
            </button>
            <button 
              onClick={() => navigate('/auth?signup=true&action=validate')}
              class="w-full sm:w-auto px-8 py-4 rounded-xl border border-borderBg hover:border-primary/50 bg-[#161A22]/40 backdrop-blur-sm font-semibold transition-all"
            >
              Validate Idea
            </button>
            <button 
              onClick={() => alert("Book a Demo: Contact our acceleration team at accelerator@startupforge.ai")}
              class="w-full sm:w-auto px-8 py-4 rounded-xl hover:bg-surface/50 text-textSecondary font-semibold transition-all"
            >
              Book Demo
            </button>
          </div>

          {/* Social Proof */}
          <div class="border-t border-borderBg/50 pt-10 max-w-5xl mx-auto">
            <p class="text-xs uppercase tracking-widest text-textSecondary mb-6 font-semibold">Backed by top-tier operators from</p>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-center opacity-50 grayscale hover:opacity-85 transition-opacity">
              <span class="text-lg font-bold">Y COMBINATOR</span>
              <span class="text-lg font-bold">STRIPE</span>
              <span class="text-lg font-bold">NOTION</span>
              <span class="text-lg font-bold">LINEAR</span>
              <span class="text-lg font-bold">CRUNCHBASE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-borderBg/40">
        <div class="text-center mb-16">
          <h2 class="font-display text-3xl sm:text-4xl font-bold mb-4">
            Accelerate Every Stage of Launch
          </h2>
          <p class="text-textSecondary max-w-2xl mx-auto">
            Comprehensive tools to guide you from kitchen-table brainstorm to Series A closing.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div class="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div class="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <Zap class="h-6 w-6 text-primary" />
            </div>
            <h3 class="font-display text-xl font-semibold mb-3">AI Startup Validator</h3>
            <p class="text-sm text-textSecondary leading-relaxed">
              Verify demand before writing code. Generate detailed viability scores, risk indexes, and market feedback charts.
            </p>
          </div>

          {/* Card 2 */}
          <div class="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div class="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <TrendingUp class="h-6 w-6 text-primary" />
            </div>
            <h3 class="font-display text-xl font-semibold mb-3">Simulation Engine</h3>
            <p class="text-sm text-textSecondary leading-relaxed">
              Stress-test financial runway, burn rates, subscriber graphs, and pricing variations using complex forecast metrics.
            </p>
          </div>

          {/* Card 3 */}
          <div class="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div class="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <Users class="h-6 w-6 text-primary" />
            </div>
            <h3 class="font-display text-xl font-semibold mb-3">Co-Founder Matching</h3>
            <p class="text-sm text-textSecondary leading-relaxed">
              Meet developers, designers, and marketers in our community. Assess personality fit with compatibility algorithms.
            </p>
          </div>

          {/* Card 4 */}
          <div class="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div class="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <FileText class="h-6 w-6 text-primary" />
            </div>
            <h3 class="font-display text-xl font-semibold mb-3">Business Plan & Deck Generator</h3>
            <p class="text-sm text-textSecondary leading-relaxed">
              Synthesize 15-page business plans (Lean Canvas models) and investor-ready 10-slide decks formatted for PDF downloads.
            </p>
          </div>

          {/* Card 5 */}
          <div class="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div class="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <Cpu class="h-6 w-6 text-primary" />
            </div>
            <h3 class="font-display text-xl font-semibold mb-3">Advisor Copilot</h3>
            <p class="text-sm text-textSecondary leading-relaxed">
              A 24/7 incubator partner. Get contextual guidance on fundraising legal terms, growth hack funnels, and technical API stacks.
            </p>
          </div>

          {/* Card 6 */}
          <div class="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div class="p-3 bg-primary/10 rounded-xl w-fit mb-6">
              <Shield class="h-6 w-6 text-primary" />
            </div>
            <h3 class="font-display text-xl font-semibold mb-3">Investor Marketplace</h3>
            <p class="text-sm text-textSecondary leading-relaxed">
              Submit investment proposals and pitch decks directly to matched angel and VC funds looking for your exact tech sector.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" class="py-20 bg-[#161A22]/30 border-t border-borderBg/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="font-display text-3xl sm:text-4xl font-bold mb-4">Graduates Raising Capital</h2>
            <p class="text-textSecondary">Hear from founders who validated, built, and funded their ventures.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="glass-panel p-8 rounded-2xl relative">
              <div class="flex items-center space-x-1 text-accent mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} class="h-4 w-4 fill-accent" />)}
              </div>
              <p class="text-sm text-textSecondary mb-6 italic leading-relaxed">
                "StartupForge's validation scoring flagged structural weaknesses in our initial monetization pipeline. Correcting that before writing code saved us 3 months of dev. We just closed our $1.2M Pre-seed."
              </p>
              <div>
                <h4 class="font-semibold text-white">Elena Rostova</h4>
                <p class="text-xs text-primary font-medium">CEO at OptimaFlow ($1.2M Seed Raised)</p>
              </div>
            </div>

            <div class="glass-panel p-8 rounded-2xl relative">
              <div class="flex items-center space-x-1 text-accent mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} class="h-4 w-4 fill-accent" />)}
              </div>
              <p class="text-sm text-textSecondary mb-6 italic leading-relaxed">
                "We matched with our Lead developer within 48 hours via the matching dashboard. The interactive runway simulations helped us align on a realistic burn-rate model that investors loved."
              </p>
              <div>
                <h4 class="font-semibold text-white">David Chen</h4>
                <p class="text-xs text-primary font-medium">Founder at SyncDock (Techstars Graduate)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-borderBg/30">
        <div class="text-center mb-16">
          <h2 class="font-display text-3xl sm:text-4xl font-bold mb-4">Transparent Pricing for Builders</h2>
          <p class="text-textSecondary">Scale your workspace as you raise capital and grow.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Free */}
          <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between border-t-2 border-t-textSecondary/25">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-textSecondary">Free</span>
              <h3 class="font-display text-3xl font-bold mt-2 mb-4">$0 <span class="text-sm font-normal text-textSecondary">/mo</span></h3>
              <p class="text-xs text-textSecondary mb-6">Test the validation simulator.</p>
              <ul class="text-xs space-y-3 mb-8 text-textSecondary">
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> 1 Startup Workspace</li>
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> 20 AI Validation Scans</li>
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> Basic Financial Charts</li>
              </ul>
            </div>
            <button onClick={() => navigate('/auth?signup=true')} class="w-full py-2.5 rounded-lg border border-borderBg hover:border-primary/50 text-xs font-semibold transition-all">Start Building</button>
          </div>

          {/* Starter */}
          <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between border-t-2 border-t-primary/50">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary">Starter</span>
              <h3 class="font-display text-3xl font-bold mt-2 mb-4">$29 <span class="text-sm font-normal text-textSecondary">/mo</span></h3>
              <p class="text-xs text-textSecondary mb-6">For single founders launching MVP.</p>
              <ul class="text-xs space-y-3 mb-8 text-textSecondary">
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> 3 Startup Workspaces</li>
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> 100 AI Scans & Advisor Queries</li>
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> MVP Planner & Business Plans</li>
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> Export Pitch Decks to PDF</li>
              </ul>
            </div>
            <button onClick={() => navigate('/auth?signup=true')} class="w-full py-2.5 rounded-lg bg-primary hover:bg-secondary text-xs font-semibold transition-all">Upgrade Now</button>
          </div>

          {/* Pro */}
          <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-primary/50 relative border-t-2 border-t-primary shadow-glow">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black font-extrabold text-[10px] uppercase px-2 py-0.5 rounded">Popular</div>
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary">Pro</span>
              <h3 class="font-display text-3xl font-bold mt-2 mb-4">$79 <span class="text-sm font-normal text-textSecondary">/mo</span></h3>
              <p class="text-xs text-textSecondary mb-6">For teams preparing for funding rounds.</p>
              <ul class="text-xs space-y-3 mb-8 text-textSecondary">
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> 10 Workspaces & Team Seats</li>
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> 500 AI Scans & Memory Advisor</li>
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> Competitor SWOT Matrices</li>
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> Unlimited Real-time Chat channels</li>
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> Pitch Submissions to Investors</li>
              </ul>
            </div>
            <button onClick={() => navigate('/auth?signup=true')} class="w-full py-2.5 rounded-lg bg-primary hover:bg-secondary text-xs font-semibold transition-all">Get Pro</button>
          </div>

          {/* Enterprise */}
          <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between border-t-2 border-t-accent">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-accent">Enterprise</span>
              <h3 class="font-display text-3xl font-bold mt-2 mb-4">$299 <span class="text-sm font-normal text-textSecondary">/mo</span></h3>
              <p class="text-xs text-textSecondary mb-6">For accelerator nodes and studios.</p>
              <ul class="text-xs space-y-3 mb-8 text-textSecondary">
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> Unlimited Workspaces</li>
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> Custom Model Training & Fine-tuning</li>
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> White-label Portal layouts</li>
                <li class="flex items-center"><Check class="h-4 w-4 text-primary mr-2" /> API Access & Webhook bindings</li>
              </ul>
            </div>
            <button onClick={() => navigate('/auth?signup=true')} class="w-full py-2.5 rounded-lg border border-borderBg hover:border-accent/50 text-xs font-semibold text-accent transition-all">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" class="py-20 max-w-4xl mx-auto px-4 sm:px-6 border-t border-borderBg/30">
        <h2 class="font-display text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div class="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} class="glass-panel rounded-xl overflow-hidden">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                class="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <span class="font-medium text-sm sm:text-base flex items-center">
                  <HelpCircle class="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown class={`h-4 w-4 text-textSecondary transition-transform ${activeFaq === idx ? 'rotate-188' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div class="px-6 pb-5 text-sm text-textSecondary leading-relaxed border-t border-borderBg/30 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer class="border-t border-borderBg bg-[#0b0c0f] py-12 text-center text-textSecondary text-xs">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div class="flex items-center space-x-2">
            <Flame class="h-5 w-5 text-primary" />
            <span class="font-display font-bold text-white uppercase tracking-wider">StartupForge AI</span>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="hover:text-primary">Privacy Policy</a>
            <a href="#" class="hover:text-primary">Terms of Service</a>
            <a href="#" class="hover:text-primary">API Status</a>
          </div>
          <p>© 2026 StartupForge AI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
