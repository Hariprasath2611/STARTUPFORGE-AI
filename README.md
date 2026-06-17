# StartupForge AI - Enterprise SaaS Platform

StartupForge AI is an AI-powered startup incubator SaaS platform that helps founders validate ideas, run cash runway simulations, build product blueprints (MVPs), generate slide presentations, recruit co-founders, and pitch matched venture capitals.

---

## 🏗️ Directory Architecture

```
startupforge-ai/
├── package.json (monorepo scripts)
├── README.md
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/ (Pages: Landing, Dashboard, Workspace, Validator, Simulator, Advisor, Marketplace, Chat)
├── backend/
│   ├── package.json
│   ├── src/server.ts
│   ├── src/models/ (Mongoose schemas: Users, Startups, BusinessPlans, PitchDecks, Tasks, Messages)
│   └── src/routes/ (Routers: Auth, Startups, AI, Collaboration, Subscriptions, Admin)
└── ai-service/
    ├── requirements.txt
    ├── main.py (FastAPI application routers)
    └── app/ (Agents, vector RAG search, and Scikit-Learn predictions)
```

---

## ⚡ Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI string
- **Python** (v3.9 or higher)

### 2. Configure Environment Variables
Copy `backend/.env.example` to `backend/.env` (already initialized with default settings):
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/startupforge
JWT_SECRET=supersecretjwtkeyforstartupforgeai2026
GEMINI_API_KEY=your-gemini-api-key-here
AI_SERVICE_URL=http://localhost:8000
```

### 3. Install Monorepo Dependencies
In the root directory, run:
```bash
npm run install:all
```

### 4. Seed Database Models
Populate the database with pre-configured Founder, Investor, Mentor, and Admin accounts:
```bash
cd backend
npm run seed
```
**Seed Accounts:**
- **Founder:** `founder@startupforge.ai` (Password: `password123`)
- **Investor:** `investor@startupforge.ai` (Password: `password123`)
- **Mentor:** `mentor@startupforge.ai` (Password: `password123`)
- **Admin:** `admin@startupforge.ai` (Password: `password123`)

### 5. Running the Application
From the root directory, start both frontend and backend concurrently:
```bash
npm run dev
```
- **Frontend App:** `http://localhost:3000` (Proxies requests to `:5000`)
- **Backend API:** `http://localhost:5000`
- **FastAPI AI Server:** Start separately:
  ```bash
  cd ai-service
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  python main.py
  ```
  *(Note: If the Python FastAPI service is not running or no Gemini API keys are supplied, the Node.js backend automatically boots high-fidelity, deterministic local rules simulators, keeping the frontend 100% functional).*

---

## 💎 Features Checklist

- [x] **Investor-grade Dashboard:** Recharts analytics, startup viability radars, and progress trackers.
- [x] **Startup Workspace:** Industry tags, team tables, metadata setups, and vector file indices.
- [x] **AI viability Validator:** Comprehensive risk indexes, demand analyses, and PDF action reports.
- [x] **Competitor discovery:** SWOT grids, GAP maps, pricing/funding tables, and positioning guides.
- [x] **AI Business Plans:** Business Model Canvases (BMC) and narrative outlines.
- [x] **AI MVP Roadmap:** Product requirements, prioritized backlogs, and engineering duration milestones.
- [x] **AI Pitch Decks:** Slide players, custom visual type screens, and link share clips.
- [x] **Runway Simulator:** Numeric inputs, burn runway estimations, and best/worst case scenario graphics.
- [x] **AI Advisor Copilot:** Context-aware chatbot with system memory hooks.
- [x] **Investor Marketplace:** Compatibility matching rankings, pitch note submit portals, and booking triggers.
- [x] **Co-Founder Matching:** Complementary skill indexes and compatibility analytics forecasts.
- [x] **Team Collaboration:** WebSocket channels general logs and Kanban checklists.
- [x] **Knowledge Base:** Vector uploader catalogs and retrieval segments.
- [x] **Subscription Billing:** Pricing models checklists and payment invoice receipts.
- [x] **Admin Center:** Users directories, active ventures databases, and event audit streams.
