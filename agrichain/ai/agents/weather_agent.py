 
"""  
Weather Agent - Lightweight weather data aggregator
FIXED: async safety + proper BraveSearch usage
"""

import logging
import httpx
import asyncio
from datetime import datetime, timedelta
from agrichain.ai.utils.brave_search import BraveSearch
from agrichain.ai.utils.geocoder import OpenStreetMapGeocoder

logger = logging.getLogger(__name__)


class WeatherAgent:

    def __init__(self):
        self.brave = BraveSearch()
        self.geocoder = OpenStreetMapGeocoder()

    # -----------------------------
    # NASA POWER
    # -----------------------------
    async def get_nasa_power_data(self, latitude: float, longitude: float):
        try:
            url = "https://power.larc.nasa.gov/api/temporal/daily/point"

            today = datetime.utcnow().date()
            start_date = today.strftime("%Y%m%d")
            end_date = (today + timedelta(days=7)).strftime("%Y%m%d")

            params = {
                "longitude": longitude,
                "latitude": latitude,
                "parameters": "T2M,PRECTOT,RH2M,WS2M",
                "community": "agroclimatology",
                "format": "JSON",
                "start": start_date,
                "end": end_date
            }

            async with httpx.AsyncClient(timeout=10) as client:
                r = await client.get(url, params=params)
                r.raise_for_status()
                return r.json()

        except Exception as e:
            logger.warning(f"NASA API error: {e}")
            return {}

    # -----------------------------
    # OPEN METEO
    # -----------------------------
    async def get_open_meteo_forecast(self, latitude: float, longitude: float):
        try:
            url = "https://api.open-meteo.com/v1/forecast"

            params = {
                "latitude": latitude,
                "longitude": longitude,
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max",
                "timezone": "Africa/Lagos",
                "forecast_days": 7
            }

            async with httpx.AsyncClient(timeout=10) as client:
                r = await client.get(url, params=params)
                r.raise_for_status()
                return r.json()

        except Exception as e:
            logger.warning(f"Open-Meteo error: {e}")
            return {}

    # -----------------------------
    # FIXED BRAVE CALL (ASYNC WRAPPED)
    # -----------------------------
    async def search_weather_alerts(self, state: str):
        return await asyncio.to_thread(
            self.brave.search_weather_alerts,
            state
        )

    # -----------------------------
    # MAIN ANALYSIS
    # -----------------------------
    async def analyze_weather(self, state: str, lga: str, crop: str):

        latitude, longitude = await self.geocoder.get_coordinates(state, lga)

        nasa_task = self.get_nasa_power_data(latitude, longitude)
        meteo_task = self.get_open_meteo_forecast(latitude, longitude)
        alerts_task = self.search_weather_alerts(state)

        nasa, meteo, alerts = await asyncio.gather(
            nasa_task,
            meteo_task,
            alerts_task
        )

        rain = "moderate"

        try:
            rain_data = meteo.get("daily", {}).get("precipitation_sum", [])
            if rain_data and max(rain_data) > 20:
                rain = "high"
        except Exception:
            pass

        return f"""
WEATHER ANALYSIS ({state}, {lga})

• Crop: {crop}
• Rainfall risk: {rain}

ALERTS:
{alerts}

RECOMMENDATION:
- Monitor rainfall patterns
- Adjust irrigation accordingly
""".strip()
    