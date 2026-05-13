import os
import json
import logging
import asyncio
from openai import OpenAI
from agrichain.ai.utils.brave_search import BraveSearch

logger = logging.getLogger(__name__)


class FinanceAgent:

    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.brave = BraveSearch()

    def check_eligibility(self, crop, farm_size, state):
        return [
            {
                "name": "Bank of Agriculture Loan",
                "interest": "5-9%",
                "amount": f"{int(farm_size * 150000)} Naira"
            }
        ]

    async def analyze_financing(self, crop: str, farm_size: float, state: str):

        eligible = self.check_eligibility(crop, farm_size, state)
        loan_info = await asyncio.to_thread(self.brave.search_loan_schemes, state)

        try:
            res = await asyncio.to_thread(
                self.client.chat.completions.create,
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a finance advisor for farmers."},
                    {"role": "user", "content": f"""
Crop: {crop}
State: {state}
Eligible: {eligible}
Loans: {loan_info}
"""}
                ],
                temperature=0.7,
                max_tokens=400
            )

            return res.choices[0].message.content.strip()

        except Exception:
            return f"Apply for Bank of Agriculture loans in {state}."
        