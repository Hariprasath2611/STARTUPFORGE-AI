import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import numpy as np

# Import mock agents and models (defined in submodules)
# If libraries fail, we will fallback locally inside the route handlers.

app = FastAPI(title="StartupForge AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ValidateRequest(BaseModel):
    idea: str
    industry: Optional[str] = "tech"
    market: Optional[str] = "B2B"

class CompetitorRequest(BaseModel):
    idea: str
    industry: Optional[str] = "tech"

class BusinessPlanRequest(BaseModel):
    name: str
    description: str
    industry: str
    targetAudience: str
    businessModel: str

class MVPPlanRequest(BaseModel):
    idea: str
    targetAudience: str

class PitchDeckRequest(BaseModel):
    name: str
    description: str
    industry: str
    businessModel: str

class AdvisorRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []

# Mock Predictors
def predict_success_probability(idea_len: int, industry: str) -> float:
    # A simple deterministic regression mock using length of description and industry weight
    base = 0.65
    length_bonus = min(idea_len * 0.001, 0.15)
    industry_bonus = 0.08 if industry.lower() in ["ai", "saas", "fintech", "healthcare"] else 0.02
    return round((base + length_bonus + industry_bonus) * 100, 1)

@app.get("/")
def home():
    return {"status": "AI service is online"}

@app.post("/api/validate")
async def validate_idea(req: ValidateRequest):
    # Simulate high-intelligence validation metrics using simple calculations
    success_prob = predict_success_probability(len(req.idea), req.industry or "tech")
    
    demand = min(int(55 + (len(req.idea) % 35)), 95)
    competition = min(int(45 + (len(req.idea) % 40)), 90)
    risk = max(int(70 - (len(req.idea) % 30)), 35)
    feasibility = min(int(60 + (len(req.idea) % 25)), 90)
    opportunity = min(int(50 + (len(req.idea) % 45)), 95)
    
    overall = round((demand + feasibility + opportunity - (risk * 0.2)) / 2.8, 1)

    return {
        "validationScore": overall,
        "marketDemandScore": demand,
        "competitionScore": competition,
        "riskScore": risk,
        "feasibilityScore": feasibility,
        "opportunityScore": opportunity,
        "investmentReadiness": success_prob,
        "growthPotential": round(overall * 1.05, 1),
        "report": f"### AI INCUBATOR ENGINE REPORT\n\nAnalyzed startup idea targeting '{req.market}' within the '{req.industry}' sector.\n\n#### Demand Analysis\nWe estimate high initial interest. Pain point resonance is strong with target groups.\n\n#### Competition and Moat\nCompetition score sits at {competition}%. Key incumbents control distribution channels; build strong product-led growth (PLG) viral mechanics to establish a moat.\n\n#### Risk & Mitigation Plans\n- Operational challenges: High engineering setup time (Mitigation: Use serverless wrappers).\n- Churn risk: Retain customers using integrated workflows.",
        "recommendations": [
            "Initiate a closed developer beta with 50 test cohorts.",
            "Formulate strong API-first integration connectors.",
            "Establish feedback loops to guide product roadmapping."
        ],
        "chartData": [
            {"subject": "Market Demand", "A": demand, "fullMark": 100},
            {"subject": "Competitor Moat", "A": 100 - competition, "fullMark": 100},
            {"subject": "Technical Feasibility", "A": feasibility, "fullMark": 100},
            {"subject": "Investment Appeal", "A": success_prob, "fullMark": 100},
            {"subject": "Growth Speed", "A": opportunity, "fullMark": 100}
        ]
    }

@app.post("/api/competitors")
async def discover_competitors(req: CompetitorRequest):
    return {
        "competitors": [
            {
                "name": f"{req.industry.capitalize()}Flow Inc",
                "funding": "$15M Series A",
                "pricing": "$99/mo",
                "revenueModel": "Subscription",
                "segments": "Large Enterprise",
                "strengths": "Deep integrations, enterprise SLAs",
                "weaknesses": "Clunky user interface, long custom implementation schedules",
                "marketPosition": "Incumbent Leader"
            },
            {
                "name": "SyncBase AI",
                "funding": "Bootstrapped",
                "pricing": "$19/mo base",
                "revenueModel": "Tiered SaaS",
                "segments": "SMBs, Freelancers",
                "strengths": "Fast loading times, highly aesthetic user interface",
                "weaknesses": "Lacks complex security controls, missing enterprise integrations",
                "marketPosition": "Niche Challenger"
            }
        ],
        "swot": {
            "strengths": ["Proprietary automation templates", "Advanced natural language inputs", "Low compute footprint"],
            "weaknesses": ["Small brand awareness", "Initial integration limits", "High cost of custom datasets"],
            "opportunities": ["Expanding B2B automation tools", "Platform partnerships with Vercel", "Targeting European GDPR compliance sectors"],
            "threats": ["Major providers adding native utilities", "Tech stack pricing models changing"]
        },
        "gapAnalysis": "Market lacks a streamlined, developer-first workspace that automatically links mock validations with interactive product stories.",
        "differentiation": "Provide custom templates, high-fidelity exports, and a unified collaborative environment."
    }

@app.post("/api/business-plan")
async def generate_business_plan(req: BusinessPlanRequest):
    return {
        "executiveSummary": f"{req.name} solves a core friction in the {req.industry} industry by addressing target segments of {req.targetAudience}.",
        "vision": f"To build the ultimate automation software within the {req.industry} landscape.",
        "mission": "Deliver beautiful, lightning-fast solutions that save teams 15+ hours weekly.",
        "problemStatement": f"Operations for {req.targetAudience} are manual, disparate, and error-prone, resulting in high overheads.",
        "solution": f"A single platform that uses AI agents to organize, automate, and report on operational tasks.",
        "marketAnalysis": "TAM is estimated at $8.5 Billion. Projected annual growth rate (CAGR) is 14%.",
        "businessModelCanvas": {
            "customerSegments": [req.targetAudience, "Dev Teams", "Operations Directors"],
            "valuePropositions": ["Saves 20 hours/month", "Automates 90% of manual data entry", "Real-time compliance alerts"],
            "channels": ["Word of Mouth", "Product Hunt", "SaaS Accelerators"],
            "customerRelationships": ["Self-Service Portal", "Priority Slack support for Pro clients"],
            "revenueStreams": ["Pro Tier ($49/mo)", "Enterprise Custom ($499/mo)"],
            "keyActivities": ["API development", "Customer success outreach"],
            "keyResources": ["Compute nodes", "Engineering talent", "Proprietary schemas"],
            "keyPartners": ["Database hosts", "Identity providers"],
            "costStructure": ["Infrastructure", "Staff", "Marketing campaigns"]
        },
        "marketingStrategy": "SEO content hubs, active product building updates on Twitter, and direct outreach to startup hubs.",
        "growthStrategy": "Product-led growth framework utilizing team seat expansion triggers.",
        "financialForecast": "Year 1 ARR target: $150k. Year 2 ARR: $500k. Cash-flow positive in Month 12.",
        "riskAnalysis": "Security leaks represent a critical risk. Mitigation involves strict data storage hashing.",
        "fundingPlan": f"Seeking $350k seed round funding for hiring 2 product engineers and booting growth channels."
    }

@app.post("/api/mvp-plan")
async def generate_mvp_plan(req: MVPPlanRequest):
    return {
        "productRequirements": "Focus on user logins, simple profile setups, submitting ideas, and visualizing score analytics panels.",
        "featurePrioritization": [
            {"feature": "Authentication & Database Setup", "priority": "High", "effort": "Low", "value": "High"},
            {"feature": "AI Validator Form & Scoreboard", "priority": "High", "effort": "Medium", "value": "High"},
            {"feature": "PDF / PNG Export Reports", "priority": "Medium", "effort": "Low", "value": "Medium"}
        ],
        "userStories": [
            f"As a {req.targetAudience}, I want to type my startup concept so that I can see market fit scores.",
            f"As a {req.targetAudience}, I want to collaborate with my team on tasks so that we can meet milestones."
        ],
        "technicalArchitecture": "Next.js clients hosting Tailwind UI, running on Vercel Edge. Backend built in Node + MongoDB.",
        "databaseSchema": "User Schema (Name, Email, Hash). Startup Schema (Name, CreatorId, Details, Scores).",
        "apiDesign": "POST /api/auth/register, POST /api/startups, PUT /api/startups/:id/scores",
        "developmentTimeline": "Weeks 1-2: Scaffolding, schemas, and auth. Weeks 3-4: Scoring algorithms and charts. Weeks 5-6: Exports and dashboard polishing.",
        "engineeringEstimates": "Estimated 140 developer hours."
    }

@app.post("/api/pitch-deck")
async def generate_pitch_deck(req: PitchDeckRequest):
    return {
        "slides": [
            {"title": f"Introducing {req.name}", "bullets": [f"Pioneering next-gen {req.industry} services.", f"Designed specifically for {req.businessModel} formats.", "Lightning fast operations."], "visualType": "quote"},
            {"title": "The Problem", "bullets": ["Operational tools are manual and complex", "Siloed data blocks growth", "Average team wastes 30% time on maintenance"], "visualType": "text"},
            {"title": "The Solution", "bullets": [f"{req.name} aggregates resources in a single pane", "Automated pipelines save 20+ hours per week", "Visual dashboard allows easy auditing"], "visualType": "metrics"},
            {"title": "Market Scale", "bullets": ["Global TAM is $15B and growing", "Target SOM in first 3 years: $120M", "Customer acquisition cost is low"], "visualType": "chart"},
            {"title": "Business Model", "bullets": ["Subscription-based pricing model", "Tiered options for SMBs and Enterprises", "Transaction fee cut from integrations"], "visualType": "grid"},
            {"title": "The Ask", "bullets": ["Seeking $750k Seed funding", "Development scale: 65%", "Growth & marketing scale: 35%"], "visualType": "metrics"}
        ]
    }

@app.post("/api/advisor")
async def run_advisor(req: AdvisorRequest):
    reply = "I've reviewed your question. Let's analyze this strategically:\n\n"
    msg = req.message.lower()
    if "funding" in msg or "raise" in msg or "investor" in msg:
      reply += "For funding readiness, focus on building your data room. Prepare a clean 10-slide deck, high-fidelity financial projections for 3 years, and proof of target market interviews. Investors look for high momentum."
    elif "marketing" in msg or "sales" in msg or "growth" in msg:
      reply += "For initial distribution, set up email sequencing and build a custom lead list using LinkedIn. Offer product demos directly to operators. Do not spend capital on paid ads until conversion metrics are stable."
    else:
      reply += "To make progress today, list your top 3 core operational assumptions. Create a simple feedback form, send it to 10 prospective target customers, and schedule interviews. Real data beats theory every time."
    return {"reply": reply}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
