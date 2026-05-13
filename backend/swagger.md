# AgriChain API - Swagger UI Guide

## Running the Backend

```bash
cd backend
pip install -r requirements.txt
python uvicorn main:app --reload
```

The server starts at **http://localhost:8000**

## Accessing Swagger UI

Open your browser: **http://localhost:8000/docs**

You'll see an **Authorize** button at the top right.

---

## Authentication Flow (Step-by-Step)

### 1. Sign Up

- Find **POST /api/v1/auth/signup** in the Swagger UI
- Click **"Try it out"**
- Enter a JSON body:
  ```json
  {
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }
  ```
- Click **"Execute"**
- **Copy the `access_token`** from the response (a long JWT string like `eyJhbGci...`)

### 2. Authorize in Swagger UI

- Click the **Authorize** button (top right)
- In the **Value** field, paste the token directly (do NOT add "Bearer " prefix — Swagger adds it automatically)
- Click **"Authorize"**, then **"Close"**

Now all protected endpoints will send this token automatically.

### 3. Verify Authentication

- Find **GET /api/v1/auth/me**
- Click **"Try it out"** → **"Execute"**
- If it returns your user info (`id`, `name`, `email`), you're authenticated

---

## Using Other Endpoints

### Farm Plan (Public — no token needed)

- **POST /api/v1/farm-plan** — generates a farm plan (streaming response)
- No auth required
- Rate limited to 20 requests per 60 seconds

### Sign In (if already registered)

- **POST /api/v1/auth/signin** — same response format as signup
- Get a new token and re-authorize

### Sign Out

- **POST /api/v1/auth/signout** — (requires auth) blacklists the current token
- You'll need to sign in again after this

### Reference Data (Public — no token needed)

- **GET /api/v1/states** — list Nigerian states
- **GET /api/v1/crops?state=Abia** — list crops for a state
- **GET /api/v1/languages** — supported languages

---

## Important Notes

### Rate Limiting
| Endpoint | Limit |
|---|---|
| Sign Up | 5 requests / 60s |
| Sign In | 10 requests / 60s |
| Farm Plan | 20 requests / 60s |

### Demo Mode
By default `DEMO_MODE=True`. Emails won't actually be sent.
Set `DEMO_MODE=False` in `.env` to enable real email sending via Resend.

### Token Lifetime
Tokens expire after **24 hours**. After expiry, sign in again to get a new one.

### Authorize Button vs Manual Header
- Using the **Authorize** button: paste the raw token (without "Bearer ")
- Manually: set header `Authorization: Bearer <token>`

---

## Troubleshooting

| Problem | Solution |
|---|---|
| 401 "Not authenticated" | You forgot to authorize, or the token expired |
| 401 "Token has been revoked" | You called signout. Sign in again. |
| 409 "Email already registered" | Use a different email or call signin instead |
| 429 "Rate limit exceeded" | Wait 60 seconds before retrying |
| 422 Validation Error | Check your request body matches the schema |
