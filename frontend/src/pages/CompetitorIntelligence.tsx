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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-display">Competitor Intelligence Engine</h1>
        <p className="text-xs text-textSecondary mt-1">Discover industry alternatives, perform SWOT analysis, and map custom competitive moats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Parameters input */}
        <div className="glass-panel p-6 rounded-2xl h-fit space-y-4">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider flex items-center">
            <Target className="h-4 w-4 mr-2 text-primary" />
            Discovery Parameters
          </h3>
          <form className="space-y-4" onSubmit={handleFetchCompetitors}>
            <div>
              <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Startup Concept</label>
              <textarea
                required
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Submit your startup description to scan competitor alternatives..."
                rows={4}
                className="w-full form-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Industry Focus</label>
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Fintech"
                className="w-full form-input text-xs"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-secondary text-black font-semibold text-xs shadow-glow flex items-center justify-center space-x-1.5 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Scanning Market...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Discover Competitors</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Discovery Results Panel */}
        <div className="md:col-span-2 space-y-6">
          {data ? (
            <div className="space-y-6">
              {/* SWOT Matrix */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-xl border-t-2 border-t-success">
                  <span className="text-[9px] uppercase tracking-wider text-success font-bold">Strengths (Internal)</span>
                  <ul className="text-[11px] text-textSecondary space-y-1.5 mt-3">
                    {data.swot.strengths.map((str: string, i: number) => <li key={i}>• {str}</li>)}
                  </ul>
                </div>
                <div className="glass-panel p-4 rounded-xl border-t-2 border-t-error">
                  <span className="text-[9px] uppercase tracking-wider text-error font-bold">Weaknesses (Internal)</span>
                  <ul className="text-[11px] text-textSecondary space-y-1.5 mt-3">
                    {data.swot.weaknesses.map((str: string, i: number) => <li key={i}>• {str}</li>)}
                  </ul>
                </div>
                <div className="glass-panel p-4 rounded-xl border-t-2 border-t-accent">
                  <span className="text-[9px] uppercase tracking-wider text-accent font-bold">Opportunities (External)</span>
                  <ul className="text-[11px] text-textSecondary space-y-1.5 mt-3">
                    {data.swot.opportunities.map((str: string, i: number) => <li key={i}>• {str}</li>)}
                  </ul>
                </div>
                <div className="glass-panel p-4 rounded-xl border-t-2 border-t-warning">
                  <span className="text-[9px] uppercase tracking-wider text-warning font-bold">Threats (External)</span>
                  <ul className="text-[11px] text-textSecondary space-y-1.5 mt-3">
                    {data.swot.threats.map((str: string, i: number) => <li key={i}>• {str}</li>)}
                  </ul>
                </div>
              </div>

              {/* Competitor list */}
              <div className="glass-panel p-6 rounded-2xl space-y-4 overflow-hidden">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider">Alternative Discovery Catalog</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-borderBg text-textSecondary uppercase text-[9px] tracking-wider">
                        <th className="pb-3 pr-2">Company</th>
                        <th className="pb-3 pr-2">Funding</th>
                        <th className="pb-3 pr-2">Pricing</th>
                        <th className="pb-3 pr-2">Strengths</th>
                        <th className="pb-3">Weaknesses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.competitors.map((comp: any, idx: number) => (
                        <tr key={idx} className="border-b border-borderBg/50 hover:bg-surface/20 transition-all">
                          <td className="py-3 pr-2 font-bold text-white">
                            {comp.name}
                            <span className="block text-[8px] text-primary uppercase font-semibold mt-0.5">{comp.marketPosition}</span>
                          </td>
                          <td className="py-3 pr-2 text-textSecondary">{comp.funding}</td>
                          <td className="py-3 pr-2 text-textSecondary">{comp.pricing}</td>
                          <td className="py-3 pr-2 text-textSecondary">{comp.strengths}</td>
                          <td className="py-3 text-textSecondary">{comp.weaknesses}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Gap Analysis & Differentiation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-panel p-5 rounded-xl space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block">Market Gap Analysis</span>
                  <p className="text-[11px] text-textSecondary leading-relaxed">{data.gapAnalysis}</p>
                </div>
                <div className="glass-panel p-5 rounded-xl space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent block">Differentiation Advice</span>
                  <p className="text-[11px] text-textSecondary leading-relaxed">{data.differentiation}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center h-full">
              <AlertCircle className="h-12 w-12 text-borderBg mb-4" />
              <p className="text-xs text-textSecondary">Provide startup coordinates in the parameters menu and press Discover to map competitors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
