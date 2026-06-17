import os
import google.generativeai as genai

class AIAdvisor:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-2.5-pro")
        else:
            self.model = None

    async def chat(self, message: str, history: list) -> str:
        if not self.model:
            # High-fidelity static rules fallback if no key is configured
            return self._generate_fallback_response(message)

        try:
            # Construct a conversation history prompt for Gemini
            prompt = "You are a world-class startup advisor at StartupForge AI. Help this founder with strategic advice.\n\n"
            for turn in history:
                role = "Founder" if turn.get("role") == "user" else "Advisor"
                prompt += f"{role}: {turn.get('content')}\n"
            
            prompt += f"Founder: {message}\nAdvisor:"
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error contacting AI model: {str(e)}. Fallback response:\n\n{self._generate_fallback_response(message)}"

    def _generate_fallback_response(self, message: str) -> str:
        msg = message.lower()
        if "funding" in msg or "raise" in msg:
            return "To prepare for fundraising, establish your milestones first. Define how much you need (e.g. $500k for 18 months runway) and what milestone it achieves (e.g., reaching $25k MRR). Keep your slides punchy and focused on user acquisition growth."
        if "marketing" in msg or "growth" in msg:
            return "Focus on finding your early evangelists. Do not do mass-marketing. Instead, find 100 people who absolutely love your product and would be disappointed if it disappeared. Engage them in a private Slack channel."
        return "I suggest mapping out your user journeys. Document where users drop off in your funnel, then make that step 10x simpler. Let me know what specific section you want to map out!"
