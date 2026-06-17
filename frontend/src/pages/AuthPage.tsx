import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Flame, Shield, HelpCircle, Check, ArrowRight, Github } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, completeWizard, loading, user } = useAuthStore();

  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(1); // 1 = Auth Form, 2 = Wizard Setup

  // Auth Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'founder' | 'investor' | 'mentor'>('founder');

  // Wizard Inputs
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');
  const [lookingForCoFounder, setLookingForCoFounder] = useState(false);
  const [founderRole, setFounderRole] = useState<'developer' | 'designer' | 'marketer' | 'product_manager'>('developer');
  const [investmentStages, setInvestmentStages] = useState('');
  const [investmentIndustries, setInvestmentIndustries] = useState('');
  const [ticketMin, setTicketMin] = useState(25000);
  const [ticketMax, setTicketMax] = useState(250000);

  useEffect(() => {
    if (searchParams.get('signup') === 'true') {
      setIsSignup(true);
    }
  }, [searchParams]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      const success = await signup(name, email, password, role);
      if (success) {
        setStep(2); // Show onboarding wizard
      }
    } else {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  const handleWizardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSkills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const parsedInterests = interests.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const parsedStages = investmentStages.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const parsedIndustries = investmentIndustries.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const wizardData = {
      bio,
      skills: parsedSkills,
      interests: parsedInterests,
      location,
      lookingForCoFounder,
      founderRole: role === 'founder' ? founderRole : undefined,
      investmentStages: role === 'investor' ? parsedStages : undefined,
      investmentIndustries: role === 'investor' ? parsedIndustries : undefined,
      ticketSizeMin: role === 'investor' ? ticketMin : undefined,
      ticketSizeMax: role === 'investor' ? ticketMax : undefined
    };

    const success = await completeWizard(wizardData);
    if (success) {
      navigate('/dashboard');
    }
  };

  const triggerSocialLogin = async (provider: string) => {
    const success = await useAuthStore.getState().socialLogin(
      provider === 'google' ? 'Google Operator' : 'GitHub Operator',
      provider === 'google' ? 'google@startupforge.ai' : 'github@startupforge.ai',
      role,
      provider
    );
    if (success) {
      if (isSignup) {
        setStep(2);
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div class="min-h-screen bg-[#0F1115] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div class="flex justify-center items-center space-x-2 cursor-pointer mb-4" onClick={() => navigate('/')}>
          <Flame class="h-8 w-8 text-primary animate-pulse" />
          <span class="font-display font-bold text-2xl tracking-wider uppercase">StartupForge<span class="text-primary">.AI</span></span>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold font-display">
          {step === 1 
            ? (isSignup ? "Create your builder account" : "Sign in to your dashboard")
            : "Complete your onboarding profile"}
        </h2>
        <p class="mt-2 text-xs text-textSecondary">
          {step === 1 ? (
            isSignup ? (
              <span>Already have an account? <button onClick={() => setIsSignup(false)} class="text-primary hover:underline">Sign In</button></span>
            ) : (
              <span>New to StartupForge? <button onClick={() => setIsSignup(true)} class="text-primary hover:underline">Start Building</button></span>
            )
          ) : "Customize your incubator experience."}
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div class="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-glass">
          {step === 1 ? (
            /* AUTH FORM */
            <form class="space-y-5" onSubmit={handleAuthSubmit}>
              {isSignup && (
                <div>
                  <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    class="w-full form-input text-sm"
                  />
                </div>
              )}

              <div>
                <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  class="w-full form-input text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  class="w-full form-input text-sm"
                />
              </div>

              {isSignup && (
                <div>
                  <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Primary Role</label>
                  <div class="grid grid-cols-3 gap-2">
                    {['founder', 'investor', 'mentor'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r as any)}
                        class={`py-2 text-xs font-semibold rounded-lg capitalize border transition-all ${
                          role === r 
                            ? 'bg-primary/20 border-primary text-primary' 
                            : 'border-borderBg hover:bg-surface/50 text-textSecondary'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                class="w-full py-3 px-4 rounded-xl bg-primary hover:bg-secondary text-sm font-semibold shadow-glow flex items-center justify-center space-x-2 transition-all"
              >
                <span>{loading ? "Authenticating..." : (isSignup ? "Sign Up" : "Sign In")}</span>
                <ArrowRight class="h-4 w-4" />
              </button>

              {/* Social Login Separator */}
              <div class="relative my-6">
                <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-borderBg/50"></div></div>
                <div class="relative flex justify-center text-xs uppercase"><span class="bg-[#161a22] px-2 text-textSecondary text-[10px] tracking-widest">Or Continue With</span></div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => triggerSocialLogin('google')}
                  class="py-2.5 px-4 border border-borderBg rounded-xl bg-[#161A22]/40 hover:bg-[#161A22] text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
                >
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.48 0-6.3-2.82-6.3-6.3s2.82-6.3 6.3-6.3c1.55 0 2.96.56 4.05 1.48l3.11-3.11C18.82 2.305 15.72 1.065 12.24 1.065 6.015 1.065 1 6.08 1 12.305s5.015 11.24 11.24 11.24c6.225 0 11.24-5.015 11.24-11.24 0-.685-.06-1.35-.175-2.02H12.24z"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerSocialLogin('github')}
                  class="py-2.5 px-4 border border-borderBg rounded-xl bg-[#161A22]/40 hover:bg-[#161A22] text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
                >
                  <Github class="h-4 w-4" />
                  <span>GitHub</span>
                </button>
              </div>
            </form>
          ) : (
            /* WIZARD SETUP */
            <form class="space-y-5" onSubmit={handleWizardSubmit}>
              <div>
                <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Short Bio</label>
                <textarea
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your background, startup, or experience..."
                  rows={3}
                  class="w-full form-input text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  class="w-full form-input text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Growth, Sales, Product"
                  class="w-full form-input text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Interests (Comma-separated)</label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="SaaS, FinTech, DevTools"
                  class="w-full form-input text-sm"
                />
              </div>

              {role === 'founder' && (
                <>
                  <div>
                    <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Co-founder Focus</label>
                    <select
                      value={founderRole}
                      onChange={(e: any) => setFounderRole(e.target.value)}
                      class="w-full form-input text-sm"
                    >
                      <option value="developer">Developer (Technical)</option>
                      <option value="designer">Designer (UX/UI)</option>
                      <option value="marketer">Marketer (Growth/Sales)</option>
                      <option value="product_manager">Product Manager</option>
                    </select>
                  </div>

                  <div class="flex items-center space-x-3 pt-2">
                    <input
                      type="checkbox"
                      id="looking"
                      checked={lookingForCoFounder}
                      onChange={(e) => setLookingForCoFounder(e.target.checked)}
                      class="h-4 w-4 bg-background border-borderBg border rounded text-primary focus:ring-primary focus:ring-2"
                    />
                    <label htmlFor="looking" class="text-xs font-semibold text-textSecondary uppercase tracking-wider">Looking for Co-founders</label>
                  </div>
                </>
              )}

              {role === 'investor' && (
                <>
                  <div>
                    <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Target Investment Stages (Comma-separated)</label>
                    <input
                      type="text"
                      value={investmentStages}
                      onChange={(e) => setInvestmentStages(e.target.value)}
                      placeholder="Pre-Seed, Seed, Series A"
                      class="w-full form-input text-sm"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Target Industries (Comma-separated)</label>
                    <input
                      type="text"
                      value={investmentIndustries}
                      onChange={(e) => setInvestmentIndustries(e.target.value)}
                      placeholder="AI, SaaS, BioTech"
                      class="w-full form-input text-sm"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Min Ticket Size ($)</label>
                      <input
                        type="number"
                        value={ticketMin}
                        onChange={(e) => setTicketMin(Number(e.target.value))}
                        class="w-full form-input text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Max Ticket Size ($)</label>
                      <input
                        type="number"
                        value={ticketMax}
                        onChange={(e) => setTicketMax(Number(e.target.value))}
                        class="w-full form-input text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                class="w-full py-3 px-4 rounded-xl bg-primary hover:bg-secondary text-sm font-semibold shadow-glow flex items-center justify-center space-x-2 transition-all"
              >
                <span>{loading ? "Saving Profile..." : "Complete Setup"}</span>
                <ArrowRight class="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
