import React, { useState } from 'react';
import axios from 'axios';
import { useStartupStore } from '../store/startupStore';
import { 
  ShieldAlert, ShieldCheck, Target, Award, 
  HelpCircle, RefreshCw, Sparkles, AlertCircle
} from 'lucide-react';

export default function CompetitorIntelligence() {
  const { activeStartup } = useStartupStore();
  const [idea, setIdea] = useState(activeStartup?.description || '');
  const [industry, setIndustry] = useState(activeStartup?.industry || 'SaaS');
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleFetchCompetitors = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/competitors', { idea, industry });
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold font-display">Competitor Intelligence Engine</h1>
        <p class="text-xs text-textSecondary mt-1">Discover industry alternatives, perform SWOT analysis, and map custom competitive moats.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Parameters input */}
        <div class="glass-panel p-6 rounded-2xl h-fit space-y-4">
          <h3 class="font-display font-bold text-sm uppercase tracking-wider flex items-center">
            <Target class="h-4 w-4 mr-2 text-primary" />
            Discovery Parameters
          </h3>
          <form class="space-y-4" onSubmit={handleFetchCompetitors}>
            <div>
              <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Startup Concept</label>
              <textarea
                required
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Submit your startup description to scan competitor alternatives..."
                rows={4}
                class="w-full form-input text-xs"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Industry Focus</label>
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Fintech"
                class="w-full form-input text-xs"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              class="w-full py-3 rounded-xl bg-primary hover:bg-secondary text-black font-semibold text-xs shadow-glow flex items-center justify-center space-x-1.5 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw class="h-4 w-4 animate-spin" />
                  <span>Scanning Market...</span>
                </>
              ) : (
                <>
                  <Sparkles class="h-4 w-4" />
                  <span>Discover Competitors</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Discovery Results Panel */}
        <div class="md:col-span-2 space-y-6">
          {data ? (
            <div class="space-y-6">
              {/* SWOT Matrix */}
              <div class="grid grid-cols-2 gap-4">
                <div class="glass-panel p-4 rounded-xl border-t-2 border-t-success">
                  <span class="text-[9px] uppercase tracking-wider text-success font-bold">Strengths (Internal)</span>
                  <ul class="text-[11px] text-textSecondary space-y-1.5 mt-3">
                    {data.swot.strengths.map((str: string, i: number) => <li key={i}>• {str}</li>)}
                  </ul>
                </div>
                <div class="glass-panel p-4 rounded-xl border-t-2 border-t-error">
                  <span class="text-[9px] uppercase tracking-wider text-error font-bold">Weaknesses (Internal)</span>
                  <ul class="text-[11px] text-textSecondary space-y-1.5 mt-3">
                    {data.swot.weaknesses.map((str: string, i: number) => <li key={i}>• {str}</li>)}
                  </ul>
                </div>
                <div class="glass-panel p-4 rounded-xl border-t-2 border-t-accent">
                  <span class="text-[9px] uppercase tracking-wider text-accent font-bold">Opportunities (External)</span>
                  <ul class="text-[11px] text-textSecondary space-y-1.5 mt-3">
                    {data.swot.opportunities.map((str: string, i: number) => <li key={i}>• {str}</li>)}
                  </ul>
                </div>
                <div class="glass-panel p-4 rounded-xl border-t-2 border-t-warning">
                  <span class="text-[9px] uppercase tracking-wider text-warning font-bold">Threats (External)</span>
                  <ul class="text-[11px] text-textSecondary space-y-1.5 mt-3">
                    {data.swot.threats.map((str: string, i: number) => <li key={i}>• {str}</li>)}
                  </ul>
                </div>
              </div>

              {/* Competitor list */}
              <div class="glass-panel p-6 rounded-2xl space-y-4 overflow-hidden">
                <h3 class="font-display font-bold text-sm uppercase tracking-wider">Alternative Discovery Catalog</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="border-b border-borderBg text-textSecondary uppercase text-[9px] tracking-wider">
                        <th class="pb-3 pr-2">Company</th>
                        <th class="pb-3 pr-2">Funding</th>
                        <th class="pb-3 pr-2">Pricing</th>
                        <th class="pb-3 pr-2">Strengths</th>
                        <th class="pb-3">Weaknesses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.competitors.map((comp: any, idx: number) => (
                        <tr key={idx} class="border-b border-borderBg/50 hover:bg-surface/20 transition-all">
                          <td class="py-3 pr-2 font-bold text-white">
                            {comp.name}
                            <span class="block text-[8px] text-primary uppercase font-semibold mt-0.5">{comp.marketPosition}</span>
                          </td>
                          <td class="py-3 pr-2 text-textSecondary">{comp.funding}</td>
                          <td class="py-3 pr-2 text-textSecondary">{comp.pricing}</td>
                          <td class="py-3 pr-2 text-textSecondary">{comp.strengths}</td>
                          <td class="py-3 text-textSecondary">{comp.weaknesses}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Gap Analysis & Differentiation */}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="glass-panel p-5 rounded-xl space-y-2">
                  <span class="text-xs font-bold uppercase tracking-wider text-primary block">Market Gap Analysis</span>
                  <p class="text-[11px] text-textSecondary leading-relaxed">{data.gapAnalysis}</p>
                </div>
                <div class="glass-panel p-5 rounded-xl space-y-2">
                  <span class="text-xs font-bold uppercase tracking-wider text-accent block">Differentiation Advice</span>
                  <p class="text-[11px] text-textSecondary leading-relaxed">{data.differentiation}</p>
                </div>
              </div>
            </div>
          ) : (
            <div class="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center h-full">
              <AlertCircle class="h-12 w-12 text-borderBg mb-4" />
              <p class="text-xs text-textSecondary">Provide startup coordinates in the parameters menu and press Discover to map competitors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
