import { create } from 'zustand';
import axios from 'axios';

export interface Startup {
  _id: string;
  name: string;
  description: string;
  industry: string;
  targetAudience: string;
  market: string;
  businessModel: string;
  fundingStage: string;
  location: string;
  tags: string[];
  teamMembers: Array<{ userId: any; role: string }>;
  creatorId: string;
  healthScore: number;
  growthForecast: number;
  validationScore: number;
  fundingReadiness: number;
  marketOpportunity: number;
  documents: Array<{ name: string; url: string; type: string; uploadedAt: string }>;
}

interface StartupState {
  startups: Startup[];
  activeStartup: Startup | null;
  loading: boolean;
  fetchStartups: () => Promise<void>;
  createStartup: (startupData: Omit<Startup, '_id' | 'creatorId' | 'teamMembers' | 'documents' | 'healthScore' | 'growthForecast' | 'validationScore' | 'fundingReadiness' | 'marketOpportunity'>) => Promise<string | null>;
  selectStartup: (id: string) => void;
  updateStartupScores: (id: string, scores: Partial<Pick<Startup, 'healthScore' | 'growthForecast' | 'validationScore' | 'fundingReadiness' | 'marketOpportunity'>>) => Promise<void>;
  addDocument: (id: string, doc: { name: string; url: string; type: string }) => Promise<void>;
}

export const useStartupStore = create<StartupState>((set, get) => ({
  startups: [],
  activeStartup: null,
  loading: false,

  fetchStartups: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/api/startups');
      const startups = response.data;
      set({ 
        startups, 
        activeStartup: startups.length > 0 ? startups[0] : null,
        loading: false 
      });
    } catch (err) {
      console.warn("API Offline, populating mock startup workspace list");
      const mockStartups: Startup[] = [
        {
          _id: "startup_default_1",
          name: "SaaSify Engine",
          description: "An AI-powered client acquisition pipeline automating cold sequences and response analysis.",
          industry: "SaaS",
          targetAudience: "B2B SMBs, Agencies",
          market: "Global SaaS sector",
          businessModel: "Subscription / Usage API",
          fundingStage: "Pre-Seed",
          location: "New York, NY",
          tags: ["AI", "Cold Outreach", "B2B"],
          creatorId: "mock_user_123",
          teamMembers: [{ userId: { name: "Dev Founder" }, role: "CEO & Founder" }],
          healthScore: 82,
          growthForecast: 15,
          validationScore: 78,
          fundingReadiness: 65,
          marketOpportunity: 84,
          documents: [
            { name: "Executive Summary.pdf", url: "#", type: "pdf", uploadedAt: new Date().toISOString() },
            { name: "Financial Model.xlsx", url: "#", type: "xlsx", uploadedAt: new Date().toISOString() }
          ]
        }
      ];
      set({ startups: mockStartups, activeStartup: mockStartups[0], loading: false });
    }
  },

  createStartup: async (startupData) => {
    set({ loading: true });
    try {
      const response = await axios.post('/api/startups', startupData);
      const newStartup = response.data;
      set(state => ({
        startups: [...state.startups, newStartup],
        activeStartup: newStartup,
        loading: false
      }));
      return newStartup._id;
    } catch (err) {
      console.warn("API Offline, creating in-memory startup");
      const newMock: Startup = {
        ...startupData,
        _id: "startup_" + Math.random().toString(36).substring(5),
        creatorId: "mock_user_123",
        teamMembers: [{ userId: { name: "Dev Founder" }, role: "CEO & Founder" }],
        healthScore: 70,
        growthForecast: 5,
        validationScore: 60,
        fundingReadiness: 50,
        marketOpportunity: 50,
        documents: []
      };
      set(state => ({
        startups: [...state.startups, newMock],
        activeStartup: newMock,
        loading: false
      }));
      return newMock._id;
    }
  },

  selectStartup: (id) => {
    const startup = get().startups.find(s => s._id === id);
    if (startup) {
      set({ activeStartup: startup });
    }
  },

  updateStartupScores: async (id, scores) => {
    try {
      const response = await axios.put(`/api/startups/${id}`, scores);
      const updated = response.data;
      set(state => ({
        startups: state.startups.map(s => s._id === id ? { ...s, ...updated } : s),
        activeStartup: state.activeStartup?._id === id ? { ...state.activeStartup, ...updated } : state.activeStartup
      }));
    } catch (err) {
      set(state => {
        const list = state.startups.map(s => s._id === id ? { ...s, ...scores } : s);
        const active = state.activeStartup?._id === id ? { ...state.activeStartup, ...scores } : state.activeStartup;
        return { startups: list, activeStartup: active };
      });
    }
  },

  addDocument: async (id, doc) => {
    try {
      const response = await axios.post(`/api/startups/${id}/documents`, doc);
      const addedDoc = response.data;
      set(state => {
        const list = state.startups.map(s => {
          if (s._id === id) {
            return { ...s, documents: [...s.documents, addedDoc] };
          }
          return s;
        });
        const active = state.activeStartup?._id === id ? { ...state.activeStartup, documents: [...state.activeStartup.documents, addedDoc] } : state.activeStartup;
        return { startups: list, activeStartup: active };
      });
    } catch (err) {
      const newDoc = { ...doc, uploadedAt: new Date().toISOString() };
      set(state => {
        const list = state.startups.map(s => {
          if (s._id === id) {
            return { ...s, documents: [...s.documents, newDoc] };
          }
          return s;
        });
        const active = state.activeStartup?._id === id ? { ...state.activeStartup, documents: [...state.activeStartup.documents, newDoc] } : state.activeStartup;
        return { startups: list, activeStartup: active };
      });
    }
  }
}));
