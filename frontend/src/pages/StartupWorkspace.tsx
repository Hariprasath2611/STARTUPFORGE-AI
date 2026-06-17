import React, { useState } from 'react';
import { useStartupStore } from '../store/startupStore';
import { 
  Building, Globe, Briefcase, DollarSign, MapPin, 
  Tag, Users, Upload, FileText, Check, Plus
} from 'lucide-react';

export default function StartupWorkspace() {
  const { startups, activeStartup, createStartup, addDocument } = useStartupStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('SaaS');
  const [targetAudience, setTargetAudience] = useState('');
  const [market, setMarket] = useState('');
  const [businessModel, setBusinessModel] = useState('SaaS Subscription');
  const [fundingStage, setFundingStage] = useState('Pre-Seed');
  const [location, setLocation] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  // Document inputs
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('pdf');

  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const successId = await createStartup({
      name,
      description,
      industry,
      targetAudience,
      market,
      businessModel,
      fundingStage,
      location,
      tags
    });
    if (successId) {
      setIsCreating(false);
      setName('');
      setDescription('');
      setTargetAudience('');
      setMarket('');
      setLocation('');
      setTagsInput('');
    }
  };

  const handleDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStartup || !docName) return;
    await addDocument(activeStartup._id, {
      name: docName,
      url: "#",
      type: docType
    });
    setDocName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold font-display">Startup Workspace</h1>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary hover:bg-secondary text-black shadow-glow flex items-center space-x-1.5 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>{isCreating ? "Back to Workspace" : "New Startup"}</span>
        </button>
      </div>

      {isCreating ? (
        /* CREATE STARTUP FORM */
        <div className="glass-panel p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto shadow-glass">
          <h2 className="text-lg font-bold font-display mb-6">Initialize Venture Workspace</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Startup Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acme AI"
                  className="w-full form-input text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full form-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">One-sentence Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly state what your company builds..."
                rows={2}
                className="w-full form-input text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Industry Sector</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full form-input text-sm"
                >
                  <option value="SaaS">SaaS</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Healthtech">Healthtech</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Web3">Web3</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Funding Stage</label>
                <select
                  value={fundingStage}
                  onChange={(e) => setFundingStage(e.target.value)}
                  className="w-full form-input text-sm"
                >
                  <option value="Idea">Idea Phase</option>
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Bootstrapped">Bootstrapped</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Business Model</label>
                <input
                  type="text"
                  required
                  value={businessModel}
                  onChange={(e) => setBusinessModel(e.target.value)}
                  placeholder="B2B SaaS / Product-led Growth"
                  className="w-full form-input text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Target Audience</label>
                <input
                  type="text"
                  required
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="SMB Operators, DevOps Teams"
                  className="w-full form-input text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Total Obtainable Market (SOM)</label>
                <input
                  type="text"
                  required
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  placeholder="$150M SOM in APAC"
                  className="w-full form-input text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="B2B, Analytics, Automation"
                  className="w-full form-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary hover:bg-secondary font-semibold text-black shadow-glow transition-all"
            >
              Initialize Workspace
            </button>
          </form>
        </div>
      ) : activeStartup ? (
        /* WORKSPACE VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metadata details */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl space-y-5">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Building className="h-6 w-6" /></div>
                <div>
                  <h2 className="text-xl font-bold font-display">{activeStartup.name}</h2>
                  <p className="text-xs text-textSecondary">{activeStartup.industry} • {activeStartup.location}</p>
                </div>
              </div>
              <p className="text-sm text-textSecondary leading-relaxed">{activeStartup.description}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-borderBg">
                <div className="flex items-center space-x-2 text-xs text-textSecondary">
                  <Globe className="h-4 w-4 text-primary" />
                  <span><strong>Market:</strong> {activeStartup.market}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-textSecondary">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span><strong>Business Model:</strong> {activeStartup.businessModel}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-textSecondary">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span><strong>Stage:</strong> {activeStartup.fundingStage}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-textSecondary">
                  <Users className="h-4 w-4 text-primary" />
                  <span><strong>Audience:</strong> {activeStartup.targetAudience}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {activeStartup.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-surface border border-borderBg text-[10px] font-semibold text-textSecondary flex items-center">
                    <Tag className="h-3 w-3 mr-1 text-primary" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Document upload section */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider">Workspace Knowledge Files</h3>
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleDocSubmit}>
                <input
                  type="text"
                  required
                  placeholder="Document Name (e.g. Q3 Financial Forecast)"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="flex-1 form-input text-xs"
                />
                <select 
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="form-input text-xs"
                >
                  <option value="pdf">PDF</option>
                  <option value="xlsx">Excel</option>
                  <option value="docx">Word</option>
                </select>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-secondary text-black font-semibold text-xs rounded-lg shadow-glow transition-all flex items-center justify-center space-x-1.5">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Add File</span>
                </button>
              </form>

              <div className="space-y-2 pt-2">
                {activeStartup.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-borderBg hover:border-primary/20 transition-all">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-white">{doc.name}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-textSecondary px-2 py-0.5 rounded bg-background border border-borderBg">{doc.type}</span>
                  </div>
                ))}
                {activeStartup.documents.length === 0 && (
                  <p className="text-xs text-textSecondary text-center py-4">No documents uploaded. Add files to train the RAG semantic query agents.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar: Team members */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 h-fit">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider">Venture Team</h3>
            <div className="space-y-3">
              {activeStartup.teamMembers.map((member, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 bg-surface rounded-xl border border-borderBg">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                    {member.userId?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{member.userId?.name || 'Venture Partner'}</h4>
                    <p className="text-[10px] text-textSecondary">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl text-center">
          <p className="text-sm text-textSecondary">No startup workspaces registered. Click "New Startup" above to create your first accelerator profile.</p>
        </div>
      )}
    </div>
  );
}
