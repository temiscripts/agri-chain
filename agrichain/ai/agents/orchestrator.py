"""  
Orchestrator Agent - Fixed Language + Stable Production Version
"""

import os
import asyncio
import time
import logging
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

from agrichain.ai.agents.soil_agent import SoilAgent
from agrichain.ai.agents.weather_agent import WeatherAgent
from agrichain.ai.agents.market_agent import MarketAgent
from agrichain.ai.agents.finance_agent import FinanceAgent
from agrichain.ai.utils.sanitizer import validate_all_inputs

env_path = Path(__file__).parent.parent.parent.parent / ".env"
load_dotenv(env_path)

logger = logging.getLogger(__name__)


class OrchestratorAgent:

    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        self.soil_agent = SoilAgent()
        self.weather_agent = WeatherAgent()
        self.market_agent = MarketAgent()
        self.finance_agent = FinanceAgent()

    # -----------------------------
    # SAFE WRAPPER
    # -----------------------------
    async def safe_run(self, coro, timeout, fallback):
        try:
            return await asyncio.wait_for(coro, timeout=timeout)
        except Exception:
            return fallback

    # -----------------------------
    # DISPATCHERS
    # -----------------------------
    async def dispatch_soil_agent(self, state, lga, crop):
        start = time.time()
        result = await self.safe_run(
            self.soil_agent.analyze_soil(state, lga, crop),
            timeout=8,
            fallback=f"Soil suitable for {crop} in {state}."
        )
        return result, time.time() - start

    async def dispatch_weather_agent(self, state, lga, crop):
        start = time.time()
        result = await self.safe_run(
            self.weather_agent.analyze_weather(state, lga, crop),
            timeout=8,
            fallback=f"Stable weather expected in {state}."
        )
        return result, time.time() - start

    async def dispatch_market_agent(self, crop, state, farm_size):
        start = time.time()
        result = await self.safe_run(
            self.market_agent.analyze_market_prices(crop, state, farm_size),
            timeout=6,
            fallback=f"Monitor {crop} market prices."
        )
        return result, time.time() - start

    async def dispatch_finance_agent(self, crop, farm_size, state):
        start = time.time()
        result = await self.safe_run(
            self.finance_agent.analyze_financing(crop, farm_size, state),
            timeout=6,
            fallback="Check BOA or cooperative loans."
        )
        return result, time.time() - start

    # -----------------------------
    # LANGUAGE FIX (IMPORTANT)
    # -----------------------------
    def get_language_instruction(self, language: str) -> str:
        language_map = {
            "English": "IMPORTANT: Respond ONLY in English. Do not mix languages.",
            "Yoruba": "IMPORTANT: Respond ONLY in Yoruba language. Every sentence must be Yoruba.",
            "Hausa": "IMPORTANT: Respond ONLY in Hausa language. Every sentence must be Hausa.",
            "Igbo": "IMPORTANT: Respond ONLY in Igbo language. Every sentence must be Igbo."
        }
        return language_map.get(language, "IMPORTANT: Respond ONLY in English.")

    def get_section_titles(self, language: str) -> dict:
        titles = {
            "English": {
                "what_to_do": "WHAT TO DO THIS WEEK",
                "when_where_sell": "WHEN AND WHERE TO SELL",
                "financing": "FINANCING OPTIONS"
            },
            "Yoruba": {
                "what_to_do": "KINI LATI ṢE Ọ̀SẸ̀ YÌÍ",
                "when_where_sell": "NÍGBÀ ATI NÍBO LÁTI TA",
                "financing": "ÀWỌN ÀṢẸJỌ̀ FUN ÌSÚNÁWÓ"
            },
            "Hausa": {
                "what_to_do": "ABINDA ZA A YI A WANNAN MAKO",
                "when_where_sell": "YA YAKE A SAYARWA",
                "financing": "ZAƊI NA KUƊI"
            },
            "Igbo": {
                "what_to_do": "IHE IGA EME IZUUKA A",
                "when_where_sell": "EBE NA OGE EZI AHIA",
                "financing": "NDỊ EKWERE INYE EGO"
            }
        }
        return titles.get(language, titles["English"])

    def get_fallback_farm_plan(self, crop: str, state: str, language: str) -> str:
        fallback_plans = {
            "English": f"""
1. WHAT TO DO THIS WEEK
- Check soil moisture and add compost or fertilizer if needed.
- Monitor for pests and diseases in your {crop} field.
- Keep irrigation steady and weed control active.

2. WHEN AND WHERE TO SELL
- Compare prices at local markets before harvest.
- Sell at nearby markets or collection centers in {state}.

3. FINANCING OPTIONS
- Consider Bank of Agriculture and cooperative loans.
- Use savings and local credit groups to support farm cashflow.
""",
            "Yoruba": f"""
1. KINI LATI ṢE Ọ̀SẸ̀ YÌÍ
- Ṣayẹwo ìmúnira ilẹ̀, fi compost tàbí ìràwọ̀ kun bí ó ṣe yẹ.
- Ṣe ìmúlòlùfẹ́ fun àwọn kokoro àti àìlera lori okra rẹ.
- Mú irigeson pọ̀ to ati pa koríko mọ́lẹ̀.

2. NÍGBÀ ATI NÍBO LÁTI TA
- Ṣe ìfọwọ́ba àwọn owó ni ọja agbegbe ṣáájú ikore.
- Ta ni ọja tó sún mọ́lẹ̀ sí ọ̀pọ̀lọpọ̀ ibi ni {state}.

3. ÀWỌN ÀṢẸJỌ̀ FUN ÌSÚNÁWÓ
- Wò ó sí Bank of Agriculture ati àwọn awin ìjọpọ̀.
- Lo ìpamọ́ àti ìjọsọpọ̀ àgùntàn láti ṣe atilẹyin owo.
""",
            "Hausa": f"""
1. ABINDA ZA A YI A WANNAN MAKO
- Duba danshin ƙasa kuma ƙara taki ko compost idan ya cancanta.
- Kula da kwari da cututtuka a gonar {crop}.
- Ci gaba da shayar da iri da tsaftace ciyawa.

2. YA YAKE A SAYARWA
- Kwatanta farashin kasuwa kafin girbi.
- Sayar da kayanka a kasuwannin cikin {state} ko wuraren tattarawa.

3. ZAƊI NA KUƊI
- Duba bashi daga Bank of Agriculture da kungiyoyin hadin gwiwa.
- Yi amfani da ajiya da kungiyar lamuni ta gari.
""",
            "Igbo": f"""
1. GỊNỊ KA A GA-EME N’IZU A
- Lelee mmiri n’ala ma tinye aja ma ọ bụ compost ma ọ bụrụ na ọ dị mkpa.
- Nyere okra gị ọtụtụ nlekọta megide ndị nje na pests.
- Jide n’aka na ịgba mmiri na-aga n’usoro.

2. OLEE OGE NA EBE I SI ERE
- Tụnyere ọnụ ahịa ahịa tupu i buo okra.
- Ree n’ahịa obodo ma ọ bụ n’etiti ahịa dị nso na {state}.

3. NZỌỤỤ ỤLỌ AHỤ
- Lelee ụgwọ Bank of Agriculture na nkwado otu ugbo.
- Jiri ego echekwara na otu nkwado obodo kwado ego ubi.
"""
        }
        return fallback_plans.get(language, fallback_plans["English"])

    # -----------------------------
    # SYNTHESIS LAYER (FIXED)
    # -----------------------------
    async def generate_farm_plan(
        self, name, state, lga, crop, farm_size,
        soil, weather, market, finance, language
    ):

        language_instruction = self.get_language_instruction(language)
        section_titles = self.get_section_titles(language)

        system_prompt = f"""
You are an expert agricultural advisor for Nigerian farmers.

{language_instruction}

CRITICAL RULE:
You MUST write the entire response strictly in the requested language.
Do NOT translate into English.
Do NOT mix languages.

Return EXACTLY 3 sections with these headings:

1. {section_titles['what_to_do']}
2. {section_titles['when_where_sell']}
3. {section_titles['financing']}

Use the exact section headings above. Do not use English headings when the requested language is not English.

Keep it practical, short, and farmer-friendly.
"""

        user_prompt = f"""
Farmer: {name}
Location: {lga}, {state}
Crop: {crop}
Farm Size: {farm_size} hectares

SOIL:
{soil}

WEATHER:
{weather}

MARKET:
{market}

FINANCE:
{finance}
"""

        try:
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.6,
                max_tokens=1200
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            logger.error(f"OpenAI error: {e}")
            return self.get_fallback_farm_plan(crop, state, language)

    # -----------------------------
    # STREAMING SYNTHESIS LAYER (NEW)
    # -----------------------------
    async def generate_farm_plan_stream(
        self, name, state, lga, crop, farm_size,
        soil, weather, market, finance, language,
        stream_callback
    ):
        """Generate farm plan with streaming and real-time callback."""

        language_instruction = self.get_language_instruction(language)
        section_titles = self.get_section_titles(language)

        system_prompt = f"""
You are an expert agricultural advisor for Nigerian farmers.

{language_instruction}

CRITICAL RULE:
You MUST write the entire response strictly in the requested language.
Do NOT translate into English.
Do NOT mix languages.

Return EXACTLY 3 sections with these headings:

1. {section_titles['what_to_do']}
2. {section_titles['when_where_sell']}
3. {section_titles['financing']}

Use the exact section headings above. Do not use English headings when the requested language is not English.

Keep it practical, short, and farmer-friendly.
"""

        user_prompt = f"""
Farmer: {name}
Location: {lga}, {state}
Crop: {crop}
Farm Size: {farm_size} hectares

SOIL:
{soil}

WEATHER:
{weather}

MARKET:
{market}

FINANCE:
{finance}
"""

        try:
            # Use streaming API
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.6,
                max_tokens=1200,
                stream=True
            )

            full_response = ""
            for chunk in response:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    # Call callback with each chunk for real-time display
                    if stream_callback:
                        stream_callback(content)

            return full_response.strip()

        except Exception as e:
            logger.error(f"OpenAI streaming error: {e}")
            fallback = self.get_fallback_farm_plan(crop, state, language)
            if stream_callback:
                stream_callback(fallback)
            return fallback

    # -----------------------------
    # MAIN ORCHESTRATION
    # -----------------------------
    async def orchestrate(self, name, state, lga, crop, farm_size, language, stream_callback=None):

        valid, inputs = validate_all_inputs(
            name, state, lga, crop, str(farm_size), language
        )

        if not valid:
            return {
                "success": False,
                "error": "Input validation failed",
                "details": inputs
            }

        name = inputs["name"]
        state = inputs["state"]
        lga = inputs["lga"]
        crop = inputs["crop"]
        farm_size = inputs["farm_size"]
        language = inputs["language"]

        print("Dispatching agents...")

        soil_task = self.dispatch_soil_agent(state, lga, crop)
        weather_task = self.dispatch_weather_agent(state, lga, crop)
        market_task = self.dispatch_market_agent(crop, state, farm_size)
        finance_task = self.dispatch_finance_agent(crop, farm_size, state)

        (soil, soil_t), (weather, weather_t), (market, market_t), (finance, finance_t) = await asyncio.gather(
            soil_task,
            weather_task,
            market_task,
            finance_task
        )

        print("Synthesizing farm plan...")

        synth_start = time.time()
        
        # Use streaming if callback provided, otherwise use regular generation
        if stream_callback:
            farm_plan = await self.generate_farm_plan_stream(
                name, state, lga, crop, farm_size,
                soil, weather, market, finance,
                language,
                stream_callback
            )
        else:
            farm_plan = await self.generate_farm_plan(
                name, state, lga, crop, farm_size,
                soil, weather, market, finance,
                language
            )
        
        synthesis_t = time.time() - synth_start

        print("\nFarm plan ready!")

        return {
            "success": True,
            "farmer_name": name,
            "location": f"{lga}, {state}",
            "crop": crop,
            "farm_size": farm_size,
            "language": language,
            "farm_plan": farm_plan,
            "agent_reports": {
                "soil": soil,
                "weather": weather,
                "market": market,
                "finance": finance
            },
            "execution_times": {
                "soil": f"{soil_t:.1f}s",
                "weather": f"{weather_t:.1f}s",
                "market": f"{market_t:.1f}s",
                "finance": f"{finance_t:.1f}s",
                "synthesis": f"{synthesis_t:.1f}s",
                "total": f"{(soil_t + weather_t + market_t + finance_t):.1f}s"
            }
        }
    