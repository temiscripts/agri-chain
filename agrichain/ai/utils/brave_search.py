"""
Brave Search API integration for fetching market prices, weather alerts, and farming news.
SYNC VERSION (safe for async orchestration)
"""

import os
import json
import logging
import random
import threading
import time
from typing import List, Dict, Any
import httpx
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
load_dotenv()


class BraveSearch:
    """Brave Search API client for agricultural intelligence (SYNC SAFE)."""

    _rate_limit_lock = threading.Lock()
    _last_request_time = 0.0
    _min_interval_seconds = 2.0

    def __init__(self):
        self.api_key = os.getenv("BRAVE_API_KEY")
        self.base_url = "https://api.search.brave.com/res/v1/web/search"
        self.timeout = 10

        if not self.api_key:
            raise ValueError("BRAVE_API_KEY not found in environment variables")

    # -----------------------------
    # CORE SEARCH (SYNC)
    # -----------------------------
    def _throttle(self):
        with BraveSearch._rate_limit_lock:
            now = time.time()
            elapsed = now - BraveSearch._last_request_time
            if elapsed < BraveSearch._min_interval_seconds:
                time.sleep(BraveSearch._min_interval_seconds - elapsed)
            BraveSearch._last_request_time = time.time()

    def search(self, query: str, count: int = 3) -> List[Dict[str, Any]]:
        params = {
            "q": query,
            "count": min(count, 20),
        }

        headers = {
            "Accept": "application/json",
            "X-Subscription-Token": self.api_key,
            "User-Agent": "AgriChain/1.0"
        }

        for attempt in range(1, 4):
            try:
                self._throttle()
                with httpx.Client(timeout=self.timeout) as client:
                    response = client.get(
                        self.base_url,
                        params=params,
                        headers=headers
                    )
                    response.raise_for_status()

                data = response.json()

                results = []
                for result in data.get("web", {}).get("results", [])[:count]:
                    results.append({
                        "title": result.get("title", ""),
                        "description": result.get("description", ""),
                        "url": result.get("url", "")
                    })

                return results

            except httpx.HTTPStatusError as e:
                status_code = e.response.status_code
                if status_code == 429 and attempt < 3:
                    sleep_time = 1.5 * attempt + random.uniform(0.1, 0.3)
                    logger.warning(f"Brave Search rate limit hit, retrying in {sleep_time:.1f}s...")
                    time.sleep(sleep_time)
                    continue
                logger.error(f"Brave Search error: {e}")
                return []
            except (httpx.RequestError, OSError) as e:
                if attempt < 3:
                    sleep_time = 1.0 * attempt + random.uniform(0.1, 0.4)
                    logger.warning(f"Brave Search request failed ({e}), retrying in {sleep_time:.1f}s...")
                    time.sleep(sleep_time)
                    continue
                logger.warning(f"Brave Search unavailable: {e}")
                return []
            except Exception as e:
                logger.error(f"Brave Search error: {e}")
                return []

        return []

    # -----------------------------
    # MARKET PRICES
    # -----------------------------
    def search_market_prices(self, crop: str, market: str, state: str) -> str:
        query = f"{crop} price {market} {state} Nigeria market today"
        results = self.search(query, 3)

        if not results:
            return f"No recent market price data found for {crop} in {market}."

        summary = f"Market prices for {crop} in {market}, {state}:\n"
        for r in results:
            summary += f"- {r['title']}: {r['description']}\n"

        return summary

    # -----------------------------
    # SOIL
    # -----------------------------
    def search_soil_conditions(self, state: str, crop: str) -> str:
        query = f"{crop} soil conditions {state} Nigeria farming advice"
        results = self.search(query, 3)

        if not results:
            return f"No soil condition data found for {crop} in {state}."

        summary = f"Soil and crop information for {crop} in {state}:\n"
        for r in results:
            summary += f"- {r['title']}: {r['description']}\n"

        return summary

    # -----------------------------
    # WEATHER
    # -----------------------------
    def search_weather_alerts(self, state: str) -> str:
        query = f"flood drought weather alert {state} Nigeria"
        results = self.search(query, 3)

        if not results:
            return f"No specific weather alerts found for {state}."

        summary = f"Weather alerts for {state}:\n"
        for r in results:
            summary += f"- {r['title']}: {r['description']}\n"

        return summary

    # -----------------------------
    # LOANS
    # -----------------------------
    def search_loan_schemes(self, state: str) -> str:
        query = f"Bank of Agriculture loan scheme {state} Nigeria farmers"
        results = self.search(query, 3)

        if not results:
            return "Check Bank of Agriculture website for current loan schemes."

        summary = "Available loan schemes:\n"
        for r in results:
            summary += f"- {r['title']}: {r['description']}\n"

        return summary
    