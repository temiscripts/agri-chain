# AgriChain Backend

AI-powered agricultural planning REST API for Nigerian farmers.

## Tech Stack

- **Framework:** FastAPI
- **Database:** SQLite (via SQLAlchemy + aiosqlite)
- **Auth:** JWT (python-jose) + bcrypt (passlib)
- **AI:** OpenAI (via OrchestratorAgent)
- **Email:** Resend API

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment:
   - Copy `.env.example` to `.env` and set your keys:
     - `RESEND_API_KEY` — email service key (optional, demo mode works without it)
     - `DEMO_MODE` — set to `False` to disable demo mode
     - `JWT_SECRET_KEY` — optional, defaults to a dev secret
     - `OPENAI_API_KEY` — required for farm plan generation
     - `DATABASE_URL` — optional, defaults to local SQLite

## Run

```bash
cd backend
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## Project Structure

```
backend/
├── main.py          # FastAPI app, endpoints, rate limiter
├── auth.py          # JWT creation/validation, password hashing
├── database.py      # SQLAlchemy engine, User model, session
├── requirements.txt
├── .env.example
└── README.md
```

## API Endpoints

### Health
- `GET /` — API info and status
- `GET /health` — health check

### Auth
- `POST /api/v1/auth/signup` — register (rate limited: 5/min)
- `POST /api/v1/auth/signin` — login (rate limited: 10/min)
- `POST /api/v1/auth/signout` — logout (revokes token)
- `GET /api/v1/auth/me` — current user info (requires auth)

### Farm Planning
- `POST /api/v1/farm-plan` — generate a farm plan (SSE stream, rate limited: 20/min)

### Email
- `POST /api/v1/send-plan-email` — send farm plan via email

### Reference Data
- `GET /api/v1/states` — list Nigerian states
- `GET /api/v1/crops` — list crops (optionally filter by `?state=`)
- `GET /api/v1/languages` — supported languages (English, Yoruba, Hausa, Igbo)
