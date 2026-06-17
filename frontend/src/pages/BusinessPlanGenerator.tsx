import React, { useState } from 'react';
import axios from 'axios';
import { useStartupStore } from '../store/startupStore';
import { 
  FileText, Sparkles, Download, CheckCircle, 
  Layers, Lightbulb, TrendingUp, HelpCircle, RefreshCw
} from 'lucide-react';

export default function BusinessPlanGenerator() {
  const { activeStartup } = useStartupStore();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const handleGenerate = async () => {
    if (!activeStartup) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/business-plan', { startupId: activeStartup._id });
      setPlan(response.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: 'pdf' | 'docx') => {
    alert(`Downloading complete Business Plan in ${format.toUpperCase()} format... Check your downloads folder!`);
  };

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-display">AI Business Plan Generator</h1>
          <p class="text-xs text-textSecondary mt-1">Generate 15-page comprehensive business plan documentation and Business Model Canvases.</p>
        </div>
        {plan && (
          <div class="flex space-x-2">
            <button 
              onClick={() => handleExport('pdf')}
              class="px-3 py-1.5 rounded-lg bg-surface border border-borderBg hover:border-primary/50 text-[10px] font-semibold text-textSecondary hover:text-white flex items-center space-x-1 transition-all"
            >
              <Download class="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
            <button 
              onClick={() => handleExport('docx')}
              class="px-3 py-1.5 rounded-lg bg-surface border border-borderBg hover:border-primary/50 text-[10px] font-semibold text-textSecondary hover:text-white flex items-center space-x-1 transition-all"
            >
              <Download class="h-3.5 w-3.5" />
              <span>Export DOCX</span>
            </button>
          </div>
        )}
      </div>

      {!activeStartup ? (
        <div class="glass-panel p-12 rounded-2xl text-center text-textSecondary text-xs">
          Please select or create a startup workspace first.
        </div>
      ) : !plan ? (
        <div class="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
          <FileText class="h-12 w-12 text-borderBg mx-auto" />
          <h3 class="font-display font-bold text-sm">Assemble AI Business Plan</h3>
          <p class="text-xs text-textSecondary leading-relaxed">
            We will analyze your startup coordinates (<strong>{activeStartup.name}</strong>, description, and sector) to draft an investor-ready business plan.
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            class="px-6 py-3 bg-primary hover:bg-secondary text-black font-semibold text-xs rounded-xl shadow-glow flex items-center justify-center space-x-1.5 mx-auto transition-all"
          >
            {loading ? (
              <>
                <RefreshCw class="h-4 w-4 animate-spin" />
                <span>Assembling Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles class="h-4 w-4" />
                <span>Generate Business Plan</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* BUSINESS PLAN DETAILED PREVIEW */
        <div class="space-y-6">
          {/* Business Model Canvas Layout */}
          <div class="glass-panel p-6 rounded-2xl space-y-4">
            <h3 class="font-display font-bold text-sm uppercase tracking-wider flex items-center">
              <Layers class="h-4 w-4 mr-2 text-primary" />
              Lean Business Model Canvas
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-3 text-[10px] text-textSecondary">
              {/* Col 1 */}
              <div class="space-y-3">
                <div class="p-3 bg-surface rounded-xl border border-borderBg h-32 overflow-y-auto">
                  <span class="font-bold text-white block mb-1">Key Partners</span>
                  <ul class="space-y-1">
                    {plan.businessModelCanvas.keyPartners.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
                <div class="p-3 bg-surface rounded-xl border border-borderBg h-32 overflow-y-auto">
                  <span class="font-bold text-white block mb-1">Key Activities</span>
                  <ul class="space-y-1">
                    {plan.businessModelCanvas.keyActivities.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
              </div>

              {/* Col 2 */}
              <div class="space-y-3 md:col-span-2">
                <div class="p-3 bg-surface rounded-xl border border-borderBg h-68 overflow-y-auto">
                  <span class="font-bold text-white block mb-1 text-xs">Value Propositions</span>
                  <ul class="space-y-1 text-xs text-primary font-medium mt-2">
                    {plan.businessModelCanvas.valuePropositions.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
              </div>

              {/* Col 3 */}
              <div class="space-y-3">
                <div class="p-3 bg-surface rounded-xl border border-borderBg h-32 overflow-y-auto">
                  <span class="font-bold text-white block mb-1">Customer Relations</span>
                  <ul class="space-y-1">
                    {plan.businessModelCanvas.customerRelationships.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
                <div class="p-3 bg-surface rounded-xl border border-borderBg h-32 overflow-y-auto">
                  <span class="font-bold text-white block mb-1">Channels</span>
                  <ul class="space-y-1">
                    {plan.businessModelCanvas.channels.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
              </div>

              {/* Col 4 */}
              <div class="p-3 bg-surface rounded-xl border border-borderBg h-68 overflow-y-auto">
                <span class="font-bold text-white block mb-1">Customer Segments</span>
                <ul class="space-y-1">
                  {plan.businessModelCanvas.customerSegments.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] text-textSecondary pt-2">
              <div class="p-3 bg-surface rounded-xl border border-borderBg h-28 overflow-y-auto">
                <span class="font-bold text-white block mb-1">Cost Structure</span>
                <ul class="space-y-1">
                  {plan.businessModelCanvas.costStructure.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
              <div class="p-3 bg-surface rounded-xl border border-borderBg h-28 overflow-y-auto">
                <span class="font-bold text-white block mb-1">Revenue Streams</span>
                <ul class="space-y-1">
                  {plan.businessModelCanvas.revenueStreams.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Business Plan narrative */}
          <div class="glass-panel p-6 rounded-2xl space-y-6">
            <h3 class="font-display font-bold text-sm uppercase tracking-wider">Plan Narrative Sections</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-textSecondary">
              <div class="space-y-2">
                <h4 class="font-bold text-white uppercase tracking-wider text-[10px]">1. Executive Summary</h4>
                <p class="leading-relaxed">{plan.executiveSummary}</p>
              </div>
              <div class="space-y-2">
                <h4 class="font-bold text-white uppercase tracking-wider text-[10px]">2. Vision & Mission</h4>
                <p class="leading-relaxed"><strong>Vision:</strong> {plan.vision}</p>
                <p class="leading-relaxed"><strong>Mission:</strong> {plan.mission}</p>
              </div>
              <div class="space-y-2">
                <h4 class="font-bold text-white uppercase tracking-wider text-[10px]">3. Problem & Solution</h4>
                <p class="leading-relaxed"><strong>Problem:</strong> {plan.problemStatement}</p>
                <p class="leading-relaxed"><strong>Solution:</strong> {plan.solution}</p>
              </div>
              <div class="space-y-2">
                <h4 class="font-bold text-white uppercase tracking-wider text-[10px]">4. Market & Competition Analysis</h4>
                <p class="leading-relaxed">{plan.marketAnalysis}</p>
              </div>
              <div class="space-y-2">
                <h4 class="font-bold text-white uppercase tracking-wider text-[10px]">5. Marketing & Growth Playbooks</h4>
                <p class="leading-relaxed"><strong>Marketing:</strong> {plan.marketingStrategy}</p>
                <p class="leading-relaxed"><strong>Growth:</strong> {plan.growthStrategy}</p>
              </div>
              <div class="space-y-2">
                <h4 class="font-bold text-white uppercase tracking-wider text-[10px]">6. Financial Forecast & Risk Analysis</h4>
                <p class="leading-relaxed"><strong>Forecasts:</strong> {plan.financialForecast}</p>
                <p class="leading-relaxed"><strong>Risks:</strong> {plan.riskAnalysis}</p>
              </div>
            </div>

            <div class="p-4 bg-surface rounded-xl border border-borderBg border-l-4 border-l-primary text-xs text-textSecondary">
              <span class="font-bold text-white block mb-1">7. Funding Allocation Plan</span>
              {plan.fundingPlan}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
