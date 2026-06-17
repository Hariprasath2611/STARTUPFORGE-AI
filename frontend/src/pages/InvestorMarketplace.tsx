import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStartupStore } from '../store/startupStore';
import { 
  Building2, DollarSign, Target, Calendar, 
  Send, ShieldCheck, Sparkles, RefreshCw, MessageSquare
} from 'lucide-react';

export default function InvestorMarketplace() {
  const { activeStartup } = useStartupStore();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);

  // Submission inputs
  const [selectedInvestorId, setSelectedInvestorId] = useState<string | null>(null);
  const [pitchNote, setPitchNote] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, [activeStartup]);

  const fetchMatches = async () => {
    if (!activeStartup) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/investors/match/${activeStartup._id}`);
      setMatches(response.data);
    } catch (err) {
      console.warn("API Offline, generating mock investors list");
      setMatches([
        {
          investor: {
            _id: "inv_1",
            name: "Sovereign Capital Ventures",
            profileWizard: {
              completed: true,
              bio: "Series A / Seed lead partner focused on developer tools and automation.",
              investmentStages: ["Seed", "Series A"],
              investmentIndustries: ["SaaS", "AI", "DevTools"],
              ticketSizeMin: 100000,
              ticketSizeMax: 1500000
            }
          },
          compatibilityScore: 94,
          reasoning: "High alignment with SaaS/AI models and Seed stage requirements."
        },
        {
          investor: {
            _id: "inv_2",
            name: "Apex Angel Network",
            profileWizard: {
              completed: true,
              bio: "Pre-seed angel syndicate prioritizing B2B workflows and FinTech nodes.",
              investmentStages: ["Pre-Seed", "Seed"],
              investmentIndustries: ["Fintech", "SaaS"],
              ticketSizeMin: 25000,
              ticketSizeMax: 250000
            }
          },
          compatibilityScore: 78,
          reasoning: "Prefers Pre-seed rounds but focuses mainly on FinTech channels."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPitch = async () => {
    if (!activeStartup || !selectedInvestorId) return;
    try {
      await axios.post('/api/investors/submit-pitch', {
        investorId: selectedInvestorId,
        startupId: activeStartup._id,
        note: pitchNote
      });
      alert("Pitch submitted successfully! The investor has been notified.");
      setShowPitchModal(false);
      setPitchNote('');
    } catch (err) {
      alert("Error submitting pitch");
    }
  };

  const handleBookMeeting = async () => {
    if (!activeStartup || !selectedInvestorId) return;
    try {
      await axios.post('/api/investors/book-meeting', {
        investorId: selectedInvestorId,
        startupId: activeStartup._id,
        dateTime: meetingTime
      });
      alert("Meeting requested! Check notifications for updates.");
      setShowMeetingModal(false);
      setMeetingTime('');
    } catch (err) {
      alert("Error scheduling meeting");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display">Investor Marketplace</h1>
          <p className="text-xs text-textSecondary mt-1">Submit pitches and coordinate accelerator meeting requests with matching VC partners.</p>
        </div>
      </div>

      {!activeStartup ? (
        <div className="glass-panel p-12 rounded-2xl text-center text-textSecondary text-xs">
          Please select or create a startup workspace first.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active startup parameters banner */}
          <div className="p-4 bg-surface rounded-xl border border-borderBg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-textSecondary font-bold">Matching Criteria</span>
              <h3 className="font-display font-semibold text-xs mt-1 text-white">
                Venture: <span className="text-primary font-bold">{activeStartup.name}</span> • Sector: {activeStartup.industry} • Stage: {activeStartup.fundingStage}
              </h3>
            </div>
            <button 
              onClick={fetchMatches}
              className="px-3 py-1.5 bg-background border border-borderBg hover:border-primary/50 text-[10px] font-semibold text-textSecondary hover:text-white rounded-lg flex items-center space-x-1.5 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh Matches</span>
            </button>
          </div>

          {/* Matches grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 border border-borderBg hover:border-primary/20 transition-all relative overflow-hidden">
                {/* Score badge */}
                <div className="absolute top-4 right-4 flex items-center bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full text-[9px] font-bold text-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {match.compatibilityScore}% Compatibility
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-surface rounded-xl border border-borderBg text-primary"><Building2 className="h-5 w-5" /></div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{match.investor.name}</h4>
                      <span className="text-[9px] text-textSecondary uppercase font-bold tracking-wider">Stages: {match.investor.profileWizard?.investmentStages?.join(', ')}</span>
                    </div>
                  </div>

                  <p className="text-xs text-textSecondary leading-relaxed">{match.investor.profileWizard?.bio}</p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-textSecondary pt-2">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3.5 w-3.5 text-primary" />
                      <span>Ticket: ${match.investor.profileWizard?.ticketSizeMin?.toLocaleString()} - ${match.investor.profileWizard?.ticketSizeMax?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-3.5 w-3.5 text-primary" />
                      <span>Industries: {match.investor.profileWizard?.investmentIndustries?.join(', ')}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-surface rounded-xl border border-borderBg text-[10px] text-textSecondary">
                    <span className="font-bold text-white block mb-0.5">Matching Reason:</span>
                    {match.reasoning}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-borderBg/50">
                  <button
                    onClick={() => {
                      setSelectedInvestorId(match.investor._id);
                      setShowPitchModal(true);
                    }}
                    className="py-2 bg-primary hover:bg-secondary text-black font-semibold text-xs rounded-lg shadow-glow flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Pitch</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedInvestorId(match.investor._id);
                      setShowMeetingModal(true);
                    }}
                    className="py-2 bg-surface hover:bg-[#1E2430] border border-borderBg font-semibold text-xs rounded-lg text-textSecondary hover:text-white flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Book Meeting</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PITCH MODAL */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Submit Proposal Pitch</h3>
            <div>
              <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Introduction Note</label>
              <textarea
                value={pitchNote}
                onChange={(e) => setPitchNote(e.target.value)}
                placeholder="Include a short introductory note regarding what you do..."
                rows={4}
                className="w-full form-input text-xs"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2 text-xs">
              <button onClick={() => setShowPitchModal(false)} className="px-4 py-2 border border-borderBg rounded-lg hover:bg-surface/50 text-textSecondary hover:text-white transition-all">Cancel</button>
              <button onClick={handleSubmitPitch} className="px-4 py-2 bg-primary hover:bg-secondary text-black font-semibold rounded-lg shadow-glow transition-all">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* MEETING MODAL */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Schedule Meeting</h3>
            <div>
              <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Select Date & Time</label>
              <input
                type="datetime-local"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full form-input text-xs"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2 text-xs">
              <button onClick={() => setShowMeetingModal(false)} className="px-4 py-2 border border-borderBg rounded-lg hover:bg-surface/50 text-textSecondary hover:text-white transition-all">Cancel</button>
              <button onClick={handleBookMeeting} className="px-4 py-2 bg-primary hover:bg-secondary text-black font-semibold rounded-lg shadow-glow transition-all">Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
