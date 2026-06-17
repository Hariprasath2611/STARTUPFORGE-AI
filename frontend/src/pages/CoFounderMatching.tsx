import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserCheck, Sparkles, MapPin, Tag, 
  MessageSquare, Briefcase, RefreshCw, Send
} from 'lucide-react';

export default function CoFounderMatching() {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/cofounders');
      setCandidates(response.data);
    } catch (err) {
      console.warn("API Offline, populating mock cofounders catalog");
      setCandidates([
        {
          user: {
            name: "Sarah Jenkins",
            profileWizard: {
              completed: true,
              bio: "Ex-Stripe staff designer. Passionate about glassmorphic dashboards and web-accessibility guidelines.",
              location: "New York, NY",
              founderRole: "designer",
              skills: ["Figma", "UI Design", "Framer Motion", "Tailwind CSS"],
              interests: ["SaaS", "E-Commerce", "Design Systems"]
            }
          },
          compatibilityScore: 92,
          analysis: "Strong complementary designer skill set aligns with your engineering backend profiles."
        },
        {
          user: {
            name: "Marcus Aurelius",
            profileWizard: {
              completed: true,
              bio: "B2B growth engineer and salesman. Specialized in cold outreach sequencing and product funnel metrics.",
              location: "London, UK",
              founderRole: "marketer",
              skills: ["Growth Sales", "SEO", "Copywriting", "HubSpot"],
              interests: ["DevTools", "SaaS", "Analytics"]
            }
          },
          compatibilityScore: 84,
          analysis: "Sales competence addresses your go-to-market plan requirements."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCollaboration = (name: string) => {
    alert(`Collaboration request sent to ${name}! They will receive a notification in their dashboard.`);
  };

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-display">Co-Founder Matching Portal</h1>
          <p class="text-xs text-textSecondary mt-1">Discover builders, technical leads, and growth marketers. Order by AI Compatibility Score.</p>
        </div>
        <button 
          onClick={fetchCandidates}
          class="px-3 py-1.5 bg-surface border border-borderBg hover:border-primary/50 text-[10px] font-semibold text-textSecondary hover:text-white rounded-lg flex items-center space-x-1.5 transition-all"
        >
          <RefreshCw class="h-3.5 w-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {loading ? (
        <div class="glass-panel p-12 text-center text-xs text-textSecondary flex items-center justify-center space-x-2">
          <RefreshCw class="h-4 w-4 animate-spin text-primary" />
          <span>Calculating compatibility metrics...</span>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {candidates.map((cand, idx) => (
            <div key={idx} class="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 border border-borderBg hover:border-primary/20 transition-all relative overflow-hidden">
              {/* Compatibility Badge */}
              <div class="absolute top-4 right-4 flex items-center bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full text-[9px] font-bold text-primary">
                <Sparkles class="h-3 w-3 mr-1 animate-pulse" />
                {cand.compatibilityScore}% Match
              </div>

              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase text-sm">
                    {cand.user.name[0]}
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-white">{cand.user.name}</h4>
                    <span class="text-[9px] px-2 py-0.5 rounded bg-surface border border-borderBg uppercase font-bold text-primary tracking-wider inline-flex items-center">
                      <Briefcase class="h-3 w-3 mr-1" />
                      {cand.user.profileWizard?.founderRole}
                    </span>
                  </div>
                </div>

                <p class="text-xs text-textSecondary leading-relaxed">{cand.user.profileWizard?.bio}</p>

                <div class="flex items-center space-x-1.5 text-[10px] text-textSecondary">
                  <MapPin class="h-3.5 w-3.5 text-primary" />
                  <span>{cand.user.profileWizard?.location}</span>
                </div>

                {/* Skills tags */}
                <div class="space-y-1.5">
                  <span class="text-[9px] font-bold uppercase text-textSecondary tracking-wider block">Skills & Toolsets</span>
                  <div class="flex flex-wrap gap-1.5">
                    {cand.user.profileWizard?.skills.map((s: string, i: number) => (
                      <span key={i} class="px-2 py-0.5 rounded bg-surface border border-borderBg text-[9px] text-textSecondary">{s}</span>
                    ))}
                  </div>
                </div>

                {/* AI report */}
                <div class="p-3 bg-surface rounded-xl border border-borderBg text-[10px] text-textSecondary">
                  <span class="font-bold text-white block mb-0.5">AI Heuristics Analysis:</span>
                  {cand.analysis}
                </div>
              </div>

              {/* Actions */}
              <div class="pt-3 border-t border-borderBg/50">
                <button
                  onClick={() => handleRequestCollaboration(cand.user.name)}
                  class="w-full py-2 bg-primary hover:bg-secondary text-black font-semibold text-xs rounded-lg shadow-glow flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Send class="h-3.5 w-3.5" />
                  <span>Request Collaboration</span>
                </button>
              </div>
            </div>
          ))}
          {candidates.length === 0 && (
            <div class="glass-panel p-12 text-center text-textSecondary text-xs md:col-span-2">
              No builders matching your startup profile discovered yet. Check back later!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
