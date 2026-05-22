# AgriChain

A multi agent AI system that helps Nigerian smallholder farmers decide what to plant, when to plant, what to spray, when to sell, and where to get financing. The farmer answers a few questions about their location and crop, and five specialized agents dispatch in parallel to research soil conditions, weather forecasts, market prices, available finance, and pest risks. Their findings are synthesized into a single weekly plan delivered in the farmer's preferred Nigerian language (Hausa, Yoruba, Igbo, or English) and sent to their WhatsApp.

**Submission:** DSN x BCT LLM Agent Challenge 3.0, Task B (Recommendation)

- **Live deployment:** https://gilded-salmiakki-9cfe3e.netlify.app
- **Backend API:** https://agri-chain-production.up.railway.app

---

## The Problem

Nigeria has over 36 million smallholder farmers. Most of them lose nearly 40 percent of their harvest each season to bad timing, wrong inputs, pest outbreaks, or selling at the lowest market price. The information that would prevent these losses exists. It just lives in places farmers cannot reach: government meteorology databases, agricultural research portals, commodity exchanges, and bank loan registries.

AgriChain bridges that gap. It takes a few simple inputs from the farmer and replies with a clear, personalized action plan in a language they actually speak.

---

## How It Works

The system uses an orchestrator with five specialized agents working in parallel. Each agent owns one domain and returns structured output with a confidence level.

```
Farmer Input (web form or WhatsApp)
                              ↓
                     ┌─────────────────┐
                     │   Orchestrator  │
                     └────────┬────────┘
                              ↓
    ┌──────────┬──────────┬──────────┬──────────┬──────────┐
    ↓          ↓          ↓          ↓          ↓
┌───────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Soil  │ │Weather │ │ Market │ │Finance │ │  Pest  │
│ Agent │ │ Agent  │ │ Agent  │ │ Agent  │ │ Agent  │
└───┬───┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    └──────────┴──────────┴──────────┴──────────┘
                              ↓
                   ┌─────────────────────┐
                   │  Claude Synthesis   │
                   │  (one clean plan)   │
                   └──────────┬──────────┘
                              ↓
              ┌───────────────┴───────────────┐
              ↓                               ↓
          Web Result                   WhatsApp Delivery
```

### The Five Agents

| Agent | What It Does | Data Sources |
|---|---|---|
| Soil and Crop | Determines soil type, pH, nutrient profile, and crop suitability score | Soil databases, crop matching logic |
| Weather | Produces a 7 day forecast, flags flood and drought risk, recommends planting day | Open Meteo API |
| Market Price | Returns current crop price, best regional markets, and price trends | Commodity exchange data, market scrapers |
| Finance | Matches the farmer with eligible loan programmes and explains next steps | Bank of Agriculture, NIRSAL, cooperative registries |
| Pest and Disease | Scans for crop specific pest threats based on weather and season, recommends action | Agricultural research data |

Each agent returns a confidence label (high, medium, low) so the synthesized plan can be transparent about which recommendations rest on solid data versus reasoned estimation.

---

## Why This Fits Task B

The brief asks for a recommendation agent that goes beyond collaborative filtering, handles cold start and cross domain scenarios, supports multi turn conversation, and reasons before recommending. AgriChain satisfies each:

| Requirement | How AgriChain Meets It |
|---|---|
| Personalized recommendations | Tailored to crop, location, soil, scale, and language |
| Beyond collaborative filtering | Uses live external data plus agent reasoning, not historical user behavior |
| Cold start | No prior user history needed. A new farmer gets useful output on first contact |
| Cross domain | Five domains: agronomy, meteorology, commerce, finance, biosecurity |
| Multi turn conversational | WhatsApp inbound webhook lets farmers ask follow up questions ("what if rain comes late?") |
| Agentic workflows that reason before recommending | Orchestrator dispatches specialized agents and synthesizes their findings |
| Nigerian context bonus | Built end to end for Nigerian smallholders in their own languages |

---

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Motion (Framer Motion successor), React Router, Lucide React. Deployed on Netlify.

**Backend:** Node.js, Express, Anthropic Claude API for synthesis, individual agent modules with live API integrations. Deployed on Railway.

**Messaging:** WhatsApp Cloud API (Meta) for both outbound delivery and inbound multi turn conversation.

---

## Running It Locally

### Prerequisites

You will need Node.js 18 or higher and npm. The backend requires an Anthropic Claude API key for synthesis; WhatsApp delivery and the optional iSDA/Africa's Talking integrations are off by default if their keys are absent.

### Backend Setup

```bash
cd backend
npm install

# Create a .env file with the following keys
cat > .env <<'EOF'
CLAUDE_API_KEY=your_anthropic_key_here
WHATSAPP_TOKEN=your_meta_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id
WHATSAPP_VERIFY_TOKEN=any_string_you_choose
ISDA_API_KEY=optional_isda_soil_key
AT_API_KEY=optional_africas_talking_key
AT_USERNAME=optional_africas_talking_username
FRONTEND_URL=http://localhost:5173
PORT=8000
EOF

npm start
```

The backend will start on `http://localhost:8000`. Weather data is fetched from the Open-Meteo API, which requires no key.

### Frontend Setup

```bash
cd frontend
npm install

# Create a .env file pointing to your backend
echo "VITE_API_URL=http://localhost:8000" >> .env

npm run dev
```

The frontend will start on `http://localhost:5173`. Open it in your browser.

---

## API Reference

### POST /api/farm-plan

Main orchestrator endpoint. Dispatches all five agents in parallel, then synthesizes a plan.

**Request:**
```json
{
  "name": "Amina",
  "crop": "rice",
  "state": "Kebbi",
  "lga": "Birnin Kebbi",
  "farmSize": 2,
  "language": "english",
  "phoneNumber": "+2348012345678"
}
```

**Response:**
```json
{
  "requestId": "abc123",
  "status": "success",
  "coords": { "lat": 12.45, "lon": 4.20 },
  "agentResults": {
    "soil":    { "data": { "ph": 6.2, "nitrogen": "medium-high", "texture": "loamy", "suitability": 94 }, "confidence": "high" },
    "weather": { "data": { "avgTemp": 27.4, "bestPlantingDay": "Wednesday", "floodRisk": "low" }, "confidence": "high" },
    "market":  { "data": { "price": 42000, "unit": "50kg bag", "bestMarkets": ["Kano", "Birnin Kebbi"] }, "confidence": "high" },
    "finance": { "data": { "programmes": [{ "name": "Bank of Agriculture Smallholder Loan", "maxAmount": 500000 }] }, "confidence": "high" },
    "pest":    { "data": { "alerts": [{ "name": "Blast Disease", "risk": "high", "action": "Apply tricyclazole before Wednesday's rain" }] }, "confidence": "high" }
  },
  "farmPlan": {
    "weeklyActions": "Plant rice on Wednesday...",
    "weatherSummary": "...",
    "marketAdvice": "...",
    "financeOptions": "...",
    "pestAlert": "...",
    "language": "english"
  },
  "whatsappSent": true
}
```

If `phoneNumber` is provided in the request, the synthesized plan is also sent to that number via WhatsApp.

### POST /webhook/whatsapp

Inbound WhatsApp webhook. Receives messages from farmers, maintains conversation state, and replies in their preferred language. Enables multi turn recommendation.

### GET /health

Returns `{ "status": "healthy" }` if the server is reachable.

---

## Reproducing the Demo

1. Open the live deployment at https://gilded-salmiakki-9cfe3e.netlify.app
2. Either fill out the 5 step form, or click one of the three sample farmer profiles (Chukwuemeka, Adaeze, or Bashir) for instant results
3. Wait roughly 30 seconds for the agents to complete and Claude to synthesize the plan
4. Click any agent card to see the underlying data and confidence level
5. Click "Send to WhatsApp" to deliver the plan to a Nigerian number

---

## Repository Layout

```
agri-chain/
├── backend/         Node.js + Express API, orchestrator, and the five agents
│   ├── agents/      soilAgent, weatherAgent, marketAgent, financeAgent, pestAgent
│   ├── orchestrator/  parallel dispatch + Claude synthesis
│   ├── routes/      /api/farm-plan and /webhook/whatsapp
│   └── server.js    Express entry point
├── frontend/        React 18 + Vite + Tailwind web app (Netlify)
├── agrichain/ai/    Experimental Python agent prototypes and tests
└── README.md
```

---

## License

This codebase is submitted for the DSN x BCT LLM Agent Challenge 3.0 and is intended for evaluation by the organizing judges. All third party APIs (Anthropic, Meta WhatsApp, Open-Meteo) are used under their respective terms.
