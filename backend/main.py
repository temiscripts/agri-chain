"""
AgriChain FastAPI Backend
REST API for farm planning with auth, rate limiting, and database
"""

import sys
import os
import asyncio
import logging
import httpx
import queue as thread_queue
import time
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

sys.path.insert(0, str(Path(__file__).parent.parent))
sys.path.insert(0, str(Path(__file__).parent))

env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    load_dotenv(env_path)

env_path_backend = Path(__file__).parent / ".env"
if env_path_backend.exists():
    load_dotenv(env_path_backend)

from agrichain.ai.agents.orchestrator import OrchestratorAgent
from database import init_db, get_session, User
from auth import (
    verify_password, hash_password,
    create_access_token, decode_access_token
)

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_API_URL = "https://api.resend.com/emails"
DEMO_MODE = os.getenv("DEMO_MODE", "True").lower() == "true"

app = FastAPI(
    title="AgriChain API",
    description="AI-powered agricultural planning system for Nigerian farmers",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

orchestrator = OrchestratorAgent()

# ── Rate Limiter ──────────────────────────────────────────────────────────────

class RateLimiter:
    def __init__(self):
        self._requests: dict[str, list[float]] = {}
        self._lock = asyncio.Lock()

    async def check(self, request: Request, max_requests: int = 60, window: int = 60):
        now = time.time()
        cutoff = now - window
        ip = request.client.host if request.client else "unknown"
        async with self._lock:
            times = self._requests.get(ip, [])
            times = [t for t in times if t > cutoff]
            if len(times) >= max_requests:
                raise HTTPException(
                    status_code=429,
                    detail=f"Rate limit exceeded. Max {max_requests} requests per {window}s."
                )
            times.append(now)
            self._requests[ip] = times

rate_limiter = RateLimiter()


def rate_limit(max_requests: int = 60, window: int = 60):
    async def dependency(request: Request):
        await rate_limiter.check(request, max_requests, window)
    return dependency

# ── Token Blacklist ───────────────────────────────────────────────────────────

_blacklisted_tokens: set[str] = set()
_blacklist_lock = asyncio.Lock()


async def blacklist_token(token: str):
    async with _blacklist_lock:
        _blacklisted_tokens.add(token)


async def is_token_blacklisted(token: str) -> bool:
    async with _blacklist_lock:
        return token in _blacklisted_tokens

# ── Auth Dependency ───────────────────────────────────────────────────────────

async def get_current_user(
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = auth[len("Bearer "):]
    if await is_token_blacklisted(token):
        raise HTTPException(status_code=401, detail="Token has been revoked")
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ── Pydantic Models ───────────────────────────────────────────────────────────

class FarmPlanRequest(BaseModel):
    name: str = Field(..., description="Farmer's name", min_length=1, max_length=50)
    state: str = Field(..., description="Nigerian state", min_length=1)
    lga: str = Field(..., description="Local Government Area", min_length=1)
    crop: str = Field(..., description="Crop/fruit to grow", min_length=1)
    farm_size: float = Field(..., description="Farm size in hectares", gt=0, le=10000)
    language: str = Field(default="English", description="Language: English, Yoruba, Hausa, Igbo")
    email: Optional[str] = Field(None, description="Email to send the plan to")


class EmailResponse(BaseModel):
    success: bool
    message: str
    email_id: Optional[str] = None
    demo_mode: bool = DEMO_MODE


class SignUpRequest(BaseModel):
    email: str = Field(..., max_length=255)
    name: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=6, max_length=128)


class SignInRequest(BaseModel):
    email: str = Field(...)
    password: str = Field(...)


class UserOut(BaseModel):
    id: int
    name: str
    email: str


class AuthResponse(BaseModel):
    success: bool
    message: str
    access_token: Optional[str] = None
    token_type: Optional[str] = None
    user: Optional[UserOut] = None


class SignOutResponse(BaseModel):
    success: bool
    message: str

# ── Startup ───────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup():
    await init_db()
    logger.info("Database initialized")

# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {
        "name": "AgriChain API",
        "version": "1.0.0",
        "status": "running",
        "demo_mode": DEMO_MODE
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}

# ── Auth Endpoints ────────────────────────────────────────────────────────────

@app.post("/api/v1/auth/signup", response_model=AuthResponse, tags=["Auth"],
          dependencies=[Depends(rate_limit(5, 60))])
async def signup(req: SignUpRequest, session: AsyncSession = Depends(get_session)):
    existing = await session.execute(select(User).where(User.email == req.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(
        email=req.email,
        name=req.name,
        hashed_password=hash_password(req.password)
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    token = create_access_token({"sub": user.email})
    return AuthResponse(
        success=True,
        message="Account created successfully" + (" (demo mode)" if DEMO_MODE else ". Please verify your email."),
        access_token=token,
        token_type="bearer",
        user=UserOut(id=user.id, name=user.name, email=user.email)
    )


@app.post("/api/v1/auth/signin", response_model=AuthResponse, tags=["Auth"],
          dependencies=[Depends(rate_limit(10, 60))])
async def signin(req: SignInRequest, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User).where(User.email == req.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user.email})
    return AuthResponse(
        success=True,
        message="Signed in successfully",
        access_token=token,
        token_type="bearer",
        user=UserOut(id=user.id, name=user.name, email=user.email)
    )


@app.post("/api/v1/auth/signout", response_model=SignOutResponse, tags=["Auth"])
async def signout(request: Request, current_user: User = Depends(get_current_user)):
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        await blacklist_token(auth[len("Bearer "):])
    return SignOutResponse(success=True, message="Signed out successfully")

# ── Farm Plan ─────────────────────────────────────────────────────────────────

@app.post("/api/v1/farm-plan", tags=["Farm Planning"],
          dependencies=[Depends(rate_limit(20, 60))])
async def generate_farm_plan(request: FarmPlanRequest):
    q = thread_queue.Queue()

    def stream_callback(chunk):
        q.put(chunk)

    def run_orchestrate():
        try:
            asyncio.run(
                orchestrator.orchestrate(
                    name=request.name,
                    state=request.state,
                    lga=request.lga,
                    crop=request.crop,
                    farm_size=str(request.farm_size),
                    language=request.language,
                    stream_callback=stream_callback
                )
            )
        except Exception as e:
            logger.error(f"Orchestration error: {e}")
            q.put(f"\n[Error: {str(e)}]")
        finally:
            q.put(None)

    async def stream_generator():
        loop = asyncio.get_event_loop()
        loop.run_in_executor(None, run_orchestrate)
        while True:
            chunk = await loop.run_in_executor(None, q.get)
            if chunk is None:
                break
            yield chunk

    return StreamingResponse(stream_generator(), media_type="text/plain; charset=utf-8")

# ── Email ─────────────────────────────────────────────────────────────────────

async def send_plan_via_email(email: str, farmer_name: str, farm_plan: str, lga: str, state: str, crop: str) -> Dict[str, Any]:
    if DEMO_MODE:
        logger.info(f"[DEMO] Email would be sent to {email}")
        return {
            "success": True,
            "message": f"Farm plan for {farmer_name} ready (demo mode)",
            "email_id": f"demo_{datetime.now().timestamp()}",
            "demo_mode": True
        }
    if not RESEND_API_KEY:
        logger.error("RESEND_API_KEY not configured")
        return {"success": False, "message": "Email service not configured", "demo_mode": False}
    try:
        html = f"""<html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
<h2>AgriChain - Your Farm Plan</h2>
<p>Hello <strong>{farmer_name}</strong>,</p>
<p>Your farm plan for <strong>{crop}</strong> in {lga}, {state}:</p>
<pre style="background:#f5f5f5;padding:15px;border-radius:5px;">{farm_plan}</pre>
<p>AgriChain Team</p></body></html>"""
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                RESEND_API_URL,
                json={"from": "noreply@agrichain.local", "to": email, "subject": f"AgriChain Farm Plan - {crop}", "html": html},
                headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"}
            )
            resp.raise_for_status()
            data = resp.json()
            return {"success": True, "message": f"Farm plan sent to {email}", "email_id": data.get("id"), "demo_mode": False}
    except Exception as e:
        logger.error(f"Email error: {e}")
        return {"success": False, "message": f"Failed to send: {str(e)}", "demo_mode": False}


@app.post("/api/v1/send-plan-email", response_model=EmailResponse, tags=["Email"])
async def send_plan_email(
    email: str, farmer_name: str, farm_plan: str, lga: str, state: str, crop: str
) -> EmailResponse:
    try:
        result = await send_plan_via_email(email, farmer_name, farm_plan, lga, state, crop)
        return EmailResponse(**result)
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

# ── Reference Data ────────────────────────────────────────────────────────────

@app.get("/api/v1/states", tags=["Reference Data"])
async def get_states():
    from agrichain.ai.utils.sanitizer import NIGERIAN_STATES
    return {"states": sorted(NIGERIAN_STATES)}


@app.get("/api/v1/crops", tags=["Reference Data"])
async def get_crops(state: Optional[str] = None):
    try:
        if state:
            from agrichain.ai.utils.state_crops import get_suitable_crops_for_state
            crops = get_suitable_crops_for_state(state)
            return {"state": state, "crops": crops}
        from agrichain.ai.utils.sanitizer import NIGERIAN_CROPS
        return {"crops": sorted(NIGERIAN_CROPS)}
    except Exception as e:
        logger.error(f"Error getting crops: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/v1/languages", tags=["Reference Data"])
async def get_languages():
    return {"languages": ["English", "Yoruba", "Hausa", "Igbo"]}


@app.get("/api/v1/auth/me", tags=["Auth"])
async def get_me(current_user: User = Depends(get_current_user)):
    return UserOut(id=current_user.id, name=current_user.name, email=current_user.email)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
