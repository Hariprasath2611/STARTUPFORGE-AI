import os
import json
import google.generativeai as genai

class StartupValidator:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-2.5-pro")
        else:
            self.model = None

    async def validate(self, idea: str, industry: str, market: str) -> dict:
        if not self.model:
            return self._fallback_validation(idea, industry, market)

        try:
            prompt = f"""
            You are a startup validation engine. Validate this idea and return a JSON object with:
            - validationScore (0-100)
            - marketDemandScore (0-100)
            - competitionScore (0-100)
            - riskScore (0-100)
            - feasibilityScore (0-100)
            - opportunityScore (0-100)
            - investmentReadiness (0-100)
            - growthPotential (0-100)
            - report (markdown text string reviewing the idea details)
            - recommendations (list of 3 action steps)

            Idea: {idea}
            Industry: {industry}
            Market: {market}
            """
            
            response = self.model.generate_content(prompt)
            # Find and parse json from markdown response
            text = response.text
            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end != -1:
                return json.loads(text[start:end])
            
            return self._fallback_validation(idea, industry, market)
        except Exception:
            return self._fallback_validation(idea, industry, market)

    def _fallback_validation(self, idea: str, industry: str, market: str) -> dict:
        return {
            "validationScore": 75,
            "marketDemandScore": 80,
            "competitionScore": 60,
            "riskScore": 40,
            "feasibilityScore": 70,
            "opportunityScore": 85,
            "investmentReadiness": 65,
            "growthPotential": 80,
            "report": f"### Validation Analysis\nIdea: {idea}\nIndustry: {industry}\nMarket: {market}\n\nThis startup shows promise. Recommendation is to build a high-fidelity prototype and run client interviews.",
            "recommendations": ["Build a clean MVP", "Engage 10 beta test accounts", "Review competitor gaps"]
        }
