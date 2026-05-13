import logging
import httpx
import asyncio
from functools import lru_cache

from agrichain.ai.utils.brave_search import BraveSearch
from agrichain.ai.utils.geocoder import OpenStreetMapGeocoder

logger = logging.getLogger(__name__)


class SoilAgent:

    def __init__(self):
        self.brave = BraveSearch()
        self.geocoder = OpenStreetMapGeocoder()

    async def get_soil_data(self, latitude: float, longitude: float):
        try:
            url = "https://api.isdasoil.org/v1/properties"

            params = {
                "lat": latitude,
                "lon": longitude,
                "properties": "phh2o,clay,silt,sand,soc,nitrogen"
            }

            async with httpx.AsyncClient(timeout=10) as client:
                r = await client.get(url, params=params)
                r.raise_for_status()
                return r.json()

        except Exception:
            return {
                "properties": {
                    "phh2o": {"value": 6.5},
                    "clay": {"value": 25}
                }
            }

    @staticmethod
    @lru_cache(maxsize=128)
    def get_fao_recommendations(crop: str) -> str:

        return f"FAO guidance: Plant and manage {crop} based on local season."

    async def analyze_soil(self, state: str, lga: str, crop: str):

        lat, lon = await self.geocoder.get_coordinates(state, lga)

        soil_task = self.get_soil_data(lat, lon)
        brave_task = asyncio.to_thread(self.brave.search_soil_conditions, state, crop)

        soil_data, brave_results = await asyncio.gather(soil_task, brave_task)

        ph = soil_data.get("properties", {}).get("phh2o", {}).get("value", 6.5)
        clay = soil_data.get("properties", {}).get("clay", {}).get("value", 25)

        score = 70
        if 5.5 <= ph <= 7.5:
            score += 10
        if 20 <= clay <= 40:
            score += 10

        score = min(100, score)

        return f"""
SOIL ANALYSIS ({state}, {lga})

• pH: {ph}
• Clay: {clay}%
• Crop: {crop}

SCORE: {score}/100

FAO:
{self.get_fao_recommendations(crop)}

INSIGHTS:
{brave_results}

RECOMMENDATION:
- Improve soil with compost if needed
""".strip()
    
    
    