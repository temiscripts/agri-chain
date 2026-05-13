
import os
import json
import logging
import asyncio
from openai import OpenAI
from agrichain.ai.utils.brave_search import BraveSearch
from agrichain.ai.utils.state_crops import is_crop_suitable_for_state, get_state_crops

logger = logging.getLogger(__name__)
from dotenv import load_dotenv
load_dotenv()

class MarketAgent:

    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.brave = BraveSearch()

    def get_nearest_market(self, state: str) -> str:
        return f"{state} Central Market"

    async def get_wfp_prices(self, crop, market, state):
        prices = await asyncio.to_thread(self.brave.search_market_prices, crop, market, state)
        return {"prices": prices}

    async def analyze_market_prices(self, crop: str, state: str, farm_size: float):

        market = self.get_nearest_market(state)

        suitable = is_crop_suitable_for_state(crop, state)

        wfp = await self.get_wfp_prices(crop, market, state)
        brave = await asyncio.to_thread(self.brave.search_market_prices, crop, market, state)

        system_prompt = "You are a Nigerian agricultural market analyst."

        user = f"""
Crop: {crop}
State: {state}
Market: {market}
Suitable: {suitable}
Data: {json.dumps(wfp)[:400]}
Search: {brave}
"""

        try:
            res = await asyncio.to_thread(
                self.client.chat.completions.create,
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user}
                ],
                temperature=0.7,
                max_tokens=400
            )

            return res.choices[0].message.content.strip()

        except Exception:
            return f"Sell {crop} at {market}. Monitor weekly prices."
        
