import React, { useState } from 'react';
import { useStartupStore } from '../store/startupStore';
import { 
  FolderOpen, Search, Sparkles, FileText, 
  HelpCircle, RefreshCw, Layers, ArrowRight
} from 'lucide-react';

export default function KnowledgeBase() {
  const { activeStartup } = useStartupStore();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setSearching(true);

    setTimeout(() => {
      // High fidelity mockup search results matching RAG responses
      setResults([
        {
          text: "...our Year 3 SOM targets are established at $150M in APAC regions, focusing primarily on B2B subscription models...",
          source: "Executive Summary.pdf",
          score: 0.9412
        },
        {
          text: "...monthly expenses are capped at $12k initially with $3k base revenue targets, projecting month 14 cash-flow break evens...",
          source: "Financial Model.xlsx",
          score: 0.8123
        }
      ]);
      setSearching(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-display">Vector Knowledge Base</h1>
        <p className="text-xs text-textSecondary mt-1">Upload documents to Pinecone to run semantic search queries and RAG context injection blocks.</p>
      </div>

      {!activeStartup ? (
        <div className="glass-panel p-12 rounded-2xl text-center text-textSecondary text-xs">
          Please select or create a startup workspace first.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Document list left panel */}
          <div className="glass-panel p-6 rounded-2xl h-fit space-y-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider flex items-center">
              <FolderOpen className="h-4 w-4 mr-2 text-primary" />
              Indexed Documents
            </h3>
            <div className="space-y-2 text-xs text-textSecondary">
              {activeStartup.documents.map((doc, idx) => (
                <div key={idx} className="p-3 bg-surface rounded-xl border border-borderBg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-white">{doc.name}</span>
                  </div>
                  <span className="text-[8px] bg-background border border-borderBg px-2 py-0.5 rounded tracking-widest text-[9px] uppercase font-bold">{doc.type}</span>
                </div>
              ))}
              {activeStartup.documents.length === 0 && (
                <p className="text-center py-4">No documents indexed. Upload files inside Startup Workspace tab.</p>
              )}
            </div>
          </div>

          {/* Search right panel */}
          <div className="md:col-span-2 space-y-6">
            {/* Search Bar Form */}
            <form onSubmit={handleSearch} className="glass-panel p-4 rounded-xl flex gap-2 items-center">
              <Search className="h-5 w-5 text-textSecondary ml-2" />
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask your knowledge base (e.g. What is our projected SOM target?)"
                className="flex-1 form-input border-transparent focus:ring-0 bg-transparent text-xs py-2"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-4 py-2 bg-primary hover:bg-secondary text-black font-semibold text-xs rounded-lg shadow-glow flex items-center justify-center space-x-1.5 transition-all"
              >
                {searching ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Query</span>
                  </>
                )}
              </button>
            </form>

            {/* Results Grid */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-textSecondary">RAG Retrieval Output</span>
              
              {results.map((res, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-2xl border border-borderBg hover:border-primary/20 transition-all space-y-3 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    {Math.round(res.score * 100)}% Similarity
                  </div>

                  <p className="text-xs text-textSecondary italic leading-relaxed pt-2">"{res.text}"</p>

                  <div className="flex items-center space-x-1.5 text-[9px] text-textSecondary uppercase font-bold tracking-wider pt-2 border-t border-borderBg/50">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>Source: {res.source}</span>
                  </div>
                </div>
              ))}

              {results.length === 0 && !searching && (
                <div className="glass-panel p-12 text-center text-textSecondary text-xs">
                  Enter queries to extract vector references from indexed PDF or Excel files.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
