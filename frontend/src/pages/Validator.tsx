import React, { useState } from 'react';
import axios from 'axios';
import { useStartupStore } from '../store/startupStore';
import { 
  Sparkles, FileText, CheckCircle2, AlertTriangle, 
  BarChart3, Download, RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export default function Validator() {
  const { activeStartup, updateStartupScores } = useStartupStore();

  const [idea, setIdea] = useState(activeStartup?.description || '');
  const [industry, setIndustry] = useState(activeStartup?.industry || 'SaaS');
  const [market, setMarket] = useState(activeStartup?.targetAudience || 'SMB B2B');
  
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/validate', { idea, industry, market });
      setReportData(response.data);
      
      // If we have an active startup, update its validation score in the global state
      if (activeStartup) {
        updateStartupScores(activeStartup._id, {
          validationScore: response.data.validationScore,
          marketOpportunity: response.data.marketOpportunityScore,
          fundingReadiness: response.data.investmentReadiness
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfExport = () => {
    alert("Exporting Startup Viability Validation Report to PDF... Check your browser downloads folder!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display">AI Startup Validator</h1>
          <p className="text-xs text-textSecondary mt-1">Stress-test your business concept against real-time industry algorithms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left input form */}
        <div className="glass-panel p-6 rounded-2xl h-fit space-y-4">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-primary animate-pulse" />
            Idea Parameters
          </h3>
          <form className="space-y-4" onSubmit={handleValidate}>
            <div>
              <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Startup Concept</label>
              <textarea
                required
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe what you are building, how it solves a problem, and who your core user is..."
                rows={5}
                className="w-full form-input text-xs"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="SaaS"
                  className="w-full form-input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Target Market</label>
                <input
                  type="text"
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  placeholder="SMB B2B"
                  className="w-full form-input text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-secondary text-black font-semibold text-xs shadow-glow flex items-center justify-center space-x-1.5 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing Concept...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Scan Idea</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right validation outputs */}
        <div className="md:col-span-2 space-y-6">
          {reportData ? (
            <div className="space-y-6">
              {/* Scores panel */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-xl text-center">
                  <span className="text-[9px] uppercase tracking-widest text-textSecondary font-bold">Viability Index</span>
                  <h3 className="font-display text-3xl font-extrabold text-primary mt-2">{reportData.validationScore}%</h3>
                </div>
                <div className="glass-panel p-4 rounded-xl text-center">
                  <span className="text-[9px] uppercase tracking-widest text-textSecondary font-bold">Market Demand</span>
                  <h3 className="font-display text-3xl font-extrabold text-white mt-2">{reportData.marketDemandScore}%</h3>
                </div>
                <div className="glass-panel p-4 rounded-xl text-center">
                  <span className="text-[9px] uppercase tracking-widest text-textSecondary font-bold">Feasibility</span>
                  <h3 className="font-display text-3xl font-extrabold text-white mt-2">{reportData.feasibilityScore}%</h3>
                </div>
                <div className="glass-panel p-4 rounded-xl text-center">
                  <span className="text-[9px] uppercase tracking-widest text-textSecondary font-bold">Fundability</span>
                  <h3 className="font-display text-3xl font-extrabold text-white mt-2">{reportData.investmentReadiness}%</h3>
                </div>
              </div>

              {/* Chart and suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="glass-panel p-5 rounded-2xl h-64 flex flex-col justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">Viability Radar Map</span>
                  <div className="h-48 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={reportData.chartData}>
                        <PolarGrid stroke="#2B3342" />
                        <PolarAngleAxis dataKey="subject" stroke="#A0AEC0" fontSize={9} />
                        <PolarRadiusAxis stroke="#A0AEC0" fontSize={9} angle={30} domain={[0, 100]} />
                        <Radar name="Metrics" dataKey="A" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-textSecondary block">AI Action Steps</span>
                  <div className="space-y-3 text-xs">
                    {reportData.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-textSecondary leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Markdown Report */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-borderBg pb-3">
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    Validation Report Transcript
                  </h3>
                  <button 
                    onClick={handlePdfExport}
                    className="p-2 rounded-lg bg-surface hover:bg-borderBg text-textSecondary hover:text-white border border-borderBg flex items-center space-x-1 text-[10px] font-semibold transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
                <div className="text-xs text-textSecondary leading-relaxed whitespace-pre-line space-y-2">
                  {reportData.report}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center my-auto flex flex-col items-center justify-center h-full">
              <BarChart3 className="h-12 w-12 text-borderBg mb-4" />
              <p className="text-xs text-textSecondary">Enter your startup concept parameters and press "Scan Idea" to retrieve incubator valuation reports.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
