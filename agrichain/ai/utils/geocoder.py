
    
"""
OpenStreetMap (Nominatim) geocoder for converting Nigerian state/LGA to coordinates.
Free, no API key required.
"""

import logging
import httpx
from typing import Tuple

logger = logging.getLogger(__name__)


class OpenStreetMapGeocoder:
    def __init__(self):
        self.base_url = "https://nominatim.openstreetmap.org/search"

        # Proper User-Agent with contact email (required best practice for Nominatim)
        self.headers = {
            "User-Agent": "AgriChainAI/1.0 (contact: opeblow2021@gmail.com)",
            "Accept-Language": "en"
        }

        # Simple in-memory cache (hackathon-friendly)
        self.cache = {}

    async def get_coordinates(self, state: str, lga: str = "") -> Tuple[float, float]:
        """
        Get latitude and longitude from OpenStreetMap Nominatim API.
        """

        # ---- Input cleanup ----
        state = state.strip().title() if state else ""
        lga = lga.strip().title() if lga else ""

        if not state:
            logger.warning("Empty state provided to geocoder")
            return self.fallback_coords()

        # ---- Cache key ----
        key = f"{state}-{lga}"

        if key in self.cache:
            logger.info(f"Cache hit for {key}")
            return self.cache[key]

        # ---- Build query ----
        query = ", ".join([part for part in [lga, state, "Nigeria"] if part])

        params = {
            "q": query,
            "format": "json",
            "limit": 1
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.base_url,
                    params=params,
                    headers=self.headers,
                    timeout=10
                )
                response.raise_for_status()
                data = response.json()

            if not data:
                logger.warning(f"No geocoding result for {query}")
                return self.fallback_coords()

            lat = float(data[0].get("lat", 0))
            lon = float(data[0].get("lon", 0))

            coords = (lat, lon)

            # ---- Store in cache ----
            self.cache[key] = coords

            return coords

        except Exception as e:
            logger.error(f"OpenStreetMap geocoding error: {e}")
            return self.fallback_coords()

    def fallback_coords(self) -> Tuple[float, float]:
        """
        Default fallback (center of Nigeria).
        """
        return (9.0820, 8.6753)
    