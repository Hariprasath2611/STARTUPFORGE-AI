import React, { useState } from 'react';
import axios from 'axios';
import { useStartupStore } from '../store/startupStore';
import { 
  Terminal, Sparkles, Layers, ListTodo, Calendar, 
  Code2, CheckSquare, Plus, RefreshCw, Milestone
} from 'lucide-react';

export default function MVPPlanner() {
  const { activeStartup } = useStartupStore();
  const [loading, setLoading] = useState(false);
  const [mvp, setMvp] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'architecture' | 'roadmap'>('specs');

  const handleGenerate = async () => {
    if (!activeStartup) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/mvp-plan', { 
        idea: activeStartup.description, 
        targetAudience: activeStartup.targetAudience 
      });
      setMvp(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-display">AI MVP Product Planner</h1>
        <p className="text-xs text-textSecondary mt-1">Compile technical specifications, prioritization matrices, database schemas, and sprint roadmap targets.</p>
      </div>

      {!activeStartup ? (
        <div className="glass-panel p-12 rounded-2xl text-center text-textSecondary text-xs">
          Please select or create a startup workspace first.
        </div>
      ) : !mvp ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
          <Terminal className="h-12 w-12 text-borderBg mx-auto" />
          <h3 className="font-display font-bold text-sm">Assemble MVP Specifications</h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Translate startup coordinates for **{activeStartup.name}** into technical tasks, user stories, database layouts, and sprints.
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 bg-primary hover:bg-secondary text-black font-semibold text-xs rounded-xl shadow-glow flex items-center justify-center space-x-1.5 mx-auto transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Generating Roadmap...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate MVP Specifications</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* MVP WORKSPACE PANEL */
        <div className="space-y-6">
          {/* Navigation tabs */}
          <div className="flex border-b border-borderBg">
            {[
              { id: 'specs', label: 'Requirements', icon: ListTodo },
              { id: 'features', label: 'Prioritization', icon: Layers },
              { id: 'architecture', label: 'Architecture & DB', icon: Code2 },
              { id: 'roadmap', label: 'Sprint Roadmap', icon: Calendar }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-4 py-3 border-b-2 text-xs font-semibold tracking-wide transition-all ${
                    activeTab === tab.id 
                      ? 'border-primary text-primary bg-primary/5' 
                      : 'border-transparent text-textSecondary hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="glass-panel p-6 rounded-2xl">
            {activeTab === 'specs' && (
              <div className="space-y-6 text-xs text-textSecondary">
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Product Requirements</h3>
                  <p className="leading-relaxed bg-surface p-4 rounded-xl border border-borderBg">{mvp.productRequirements}</p>
                </div>
                <div className="space-y-3 pt-2">
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center">
                    <Milestone className="h-4 w-4 mr-2 text-primary" />
                    Target User Stories
                  </h3>
                  <div className="space-y-2">
                    {mvp.userStories.map((story: string, i: number) => (
                      <div key={i} className="p-3 bg-surface rounded-xl border border-borderBg flex items-center space-x-2">
                        <CheckSquare className="h-4 w-4 text-primary" />
                        <span>{story}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-2">MVP Feature Prioritization Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-borderBg text-textSecondary uppercase text-[9px] tracking-wider">
                        <th className="pb-3 pr-2">Feature Name</th>
                        <th className="pb-3 pr-2">Priority</th>
                        <th className="pb-3 pr-2">Effort</th>
                        <th className="pb-3">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mvp.featurePrioritization.map((feat: any, idx: number) => (
                        <tr key={idx} className="border-b border-borderBg/50 hover:bg-surface/20">
                          <td className="py-3 pr-2 font-semibold text-white">{feat.feature}</td>
                          <td className="py-3 pr-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              feat.priority === 'High' ? 'bg-error/20 text-error' : 'bg-warning/20 text-warning'
                            }`}>
                              {feat.priority}
                            </span>
                          </td>
                          <td className="py-3 pr-2 text-textSecondary">{feat.effort}</td>
                          <td className="py-3 text-textSecondary">{feat.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="space-y-6 text-xs text-textSecondary">
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">System Design & API Contracts</h3>
                  <p className="leading-relaxed bg-surface p-4 rounded-xl border border-borderBg">{mvp.technicalArchitecture}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Relational Schema Mockups</h4>
                    <pre className="bg-[#0b0c0f] p-4 rounded-xl text-primary font-mono text-[10px] overflow-x-auto whitespace-pre">
                      {mvp.databaseSchema}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">API Router Declarations</h4>
                    <pre className="bg-[#0b0c0f] p-4 rounded-xl text-primary font-mono text-[10px] overflow-x-auto whitespace-pre">
                      {mvp.apiDesign}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="space-y-6 text-xs text-textSecondary">
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Sprint Planning Roadmap</h3>
                  <p className="leading-relaxed bg-surface p-4 rounded-xl border border-borderBg">{mvp.developmentTimeline}</p>
                </div>
                
                <div className="p-4 bg-surface rounded-xl border border-borderBg border-l-4 border-l-primary flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block mb-0.5">Engineering Duration Estimate</span>
                    <span>Resources: {mvp.engineeringEstimates}</span>
                  </div>
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
