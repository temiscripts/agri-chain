# AgriChain AI - Multi-Agent Agricultural Intelligence Platform

AgriChain AI is a comprehensive agricultural intelligence system designed specifically for Nigerian smallholder farmers. It uses a multi-agent architecture to provide personalized weekly farm plans based on real-time soil, weather, market, and financing data.

## Features

- **4 Specialized Agents**: Soil & Crop, Weather, Market Price, and Finance agents that work in parallel
- **Real-time Data Integration**: Uses free APIs (iSDAsoil, NASA POWER, Open-Meteo, WFP, Brave Search)
- **AI-Powered Synthesis**: OpenAI GPT-4o generates comprehensive, actionable weekly farm plans
- **Multi-language Support**: Plans generated in English, Yoruba, Hausa, and Igbo
- **Security First**: Input sanitization protects against prompt injection attacks
- **Nigerian-Specific**: Validated against 36 Nigerian states, 20+ local crops, and real loan schemes
- **Graceful Degradation**: System continues operating even if individual agents fail

## System Architecture

```
agrichain/ai/
├── agents/
│   ├── orchestrator.py      # Coordinates all agents in parallel
│   ├── soil_agent.py        # Soil health & crop compatibility
│   ├── weather_agent.py     # Weather forecasts & risk alerts
│   ├── market_agent.py      # Market prices & sell timing
│   └── finance_agent.py     # Loan schemes & eligibility
├── utils/
│   ├── sanitizer.py         # Input validation & security
│   ├── brave_search.py      # Brave Search API integration
│   └── translator.py        # OpenAI translation module
├── tests/
│   ├── test_agents.py       # Agent unit tests
│   └── test_orchestrator.py # Integration tests
├── logs/
│   └── security.log         # Security event logging
├── demo.py                  # Interactive demo
├── main.py                  # Simple entry point
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Installation

### Prerequisites
- Python 3.8+
- OpenAI API Key
- Brave Search API Key

### Setup

1. **Clone/Setup the workspace**:
```bash
cd agrichain
```

2. **Create virtual environment**:
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

3. **Install dependencies**:
```bash
cd agrichain/ai
pip install -r requirements.txt
```

4. **Configure API Keys** in `.env`:
```
OPENAI_API_KEY=your_openai_key_here
BRAVE_API_KEY=your_brave_search_key_here
```

## Usage

### Interactive Demo

Run the interactive demo to test with custom farmer profiles from the repository root:

```bash
cd ..\..
python -m agrichain.ai.demo
```

The demo will:
1. Prompt for farmer information (name, location, crop, farm size)
2. Display language selection menu
3. Dispatch all 4 agents in parallel
4. Display execution timing for each agent
5. Show the complete farm plan in chosen language
6. Ask if user wants to generate another plan

### Quick Test

Run the main script with pre-configured test data (Chukwuemeka, Kebbi State, Rice, 2 hectares, Hausa):

```bash
python main.py
```

### Running Tests

Run the full test suite:

```bash
pytest tests/ -v
```

Run specific test file:

```bash
pytest tests/test_agents.py -v
```

## API Integrations

### Free APIs Used

1. **iSDAsoil** - Soil property data
   - Endpoint: https://api.isdasoil.org/v1/properties
   - No authentication required for basic requests

2. **NASA POWER** - Historical weather & agroclimatology
   - Endpoint: https://power.larc.nasa.gov/api/v1/agro
   - Free for research & educational use

3. **Open-Meteo** - 7-day weather forecast
   - Endpoint: https://api.open-meteo.com/v1/forecast
   - Free, no API key required

4. **WFP Food Prices** - Agricultural commodity prices
   - Endpoint: https://wfp.org/api/v1/pricetimeseries
   - Free public data

5. **Brave Search** - Market prices, weather alerts, farming news
   - API Key required (free tier available)
   - Used for current market intelligence

### Paid APIs

- **OpenAI GPT-4o** - AI reasoning and plan synthesis
  - Used for all natural language generation and synthesis
  - Required for intelligent plan creation

## Security Features

### Input Sanitization
- Strips prompt injection attempts ("ignore previous instructions", "you are now", etc.)
- Removes dangerous character sequences (\n\n, ###, [INST], <<SYS>>)
- Enforces maximum input lengths

### Input Validation
- Farm size: 0.1 - 10,000 hectares
- Language: English, Yoruba, Hausa, Igbo only
- State: One of Nigeria's 36 states + FCT
- Crop: Validated against 20+ common Nigerian crops
- Farmer name: Max 50 characters, alphanumeric + spaces

### System Prompt Protection
- All user inputs wrapped in clear delimiters: `<farmer_input>...</farmer_input>`
- System instructions separated from data fields
- Output validation ensures plan contains required sections

### Security Logging
- All suspicious inputs logged to `logs/security.log`
- Timestamp and pattern type recorded
- No crashes - suspicious inputs are sanitized and processed normally

## Farm Plan Structure

The synthesized farm plan contains exactly 3 sections:

### 1. WHAT TO DO THIS WEEK
- Specific farming activities (planting, irrigation, weeding, harvesting)
- Soil amendments recommended
- Preparation tasks

### 2. WHEN AND WHERE TO SELL
- Nearest major market location
- Current and expected price range
- Optimal harvesting and selling timing
- Marketing strategies

### 3. FINANCING OPTIONS
- Eligible loan schemes (BoA, ADF, FADAMA, etc.)
- Application process and timeline
- Required documentation
- Contact information

## Supported Nigerian States

Abia, Adamawa, Akwa Ibom, Anambra, Bauchi, Bayelsa, Benue, Borno, Cross River, Delta, Ebonyi, Edo, Ekiti, Enugu, FCT, Gombe, Imo, Jigawa, Kaduna, Kano, Katsina, Kebbi, Kogi, Kwara, Lagos, Nasarawa, Niger, Ogun, Ondo, Osun, Oyo, Plateau, Rivers, Sokoto, Taraba, Yobe, Zamfara

## Supported Crops

Rice, Maize, Cassava, Yam, Sorghum, Millet, Groundnut, Soybean, Beans, Cowpea, Tomato, Onion, Pepper, Okra, Eggplant, Lettuce, Cucumber, Watermelon, Mango, Coconut

## Supported Languages

- English
- Yoruba
- Hausa  
- Igbo

## Troubleshooting

### API Key Errors
- Ensure `.env` file contains valid `OPENAI_API_KEY` and `BRAVE_API_KEY`
- Check that keys haven't expired or reached usage limits

### No Results from Agents
- Check internet connection
- Verify API status (especially OpenAI)
- Check system log: `logs/security.log`

### Translation Issues
- OpenAI API may have response delays
- Verify language spelling matches exactly: English, Yoruba, Hausa, Igbo

### Input Validation Errors
- Ensure state name matches exact spelling from NIGERIAN_STATES
- Crop must be in NIGERIAN_CROPS list
- Farm size must be numeric and between 0.1-10000

## Performance

Typical execution times:
- Soil Agent: 2-4 seconds
- Weather Agent: 2-4 seconds
- Market Agent: 2-4 seconds
- Finance Agent: 1-2 seconds
- Plan Synthesis: 3-5 seconds
- Translation: 2-3 seconds
- **Total: 15-25 seconds**

All 4 agents run in parallel, so total time is approximately the slowest agent + synthesis + translation.

## Logging

Security events are logged to `agrichain/ai/logs/security.log`:
- Timestamp of suspicious input
- Type of field (farmer_name, state, crop, etc.)
- Pattern that was detected
- Sanitized input that was used

## Example Output

```
AGRICHAIN WEEKLY FARM PLAN
============================================================
Farmer: Chukwuemeka
Location: Ngaski, Kebbi
Crop: Rice
Farm Size: 2 hectares
Language: Hausa
============================================================

AGRICHAIN WEEKLY FARM PLAN FOR CHUKWUEMEKA

WHAT TO DO THIS WEEK:
- Prepare rice paddies for planting season
- Check soil moisture levels (should be 60-70%)
- Apply NPK fertilizer at recommended rates
- Install irrigation lines for water management
- Weed fields to remove competing plants

WHEN AND WHERE TO SELL:
- Nearest market: Birnin Kebbi Central Market, Kebbi
- Current rice price: 250,000 Naira per ton
- Expected revenue from 2 hectares: 500,000 - 750,000 Naira
- Sell timing: October-November during harvest season
- Contact neighboring traders for bulk orders

FINANCING OPTIONS:
- Bank of Agriculture Anchor Borrower Program: 5-9% interest
- Agricultural Development Fund: Concessional rates
- Local cooperative lending: Variable rates
- Next steps: Visit Birnin Kebbi BoA branch with farm documents

============================================================
Execution time: 19.5s
```

## Development

### Adding a New Agent

1. Create file in `agents/` directory
2. Inherit from base agent pattern (see soil_agent.py)
3. Implement async `analyze_*` method
4. Add to orchestrator.py
5. Update tests

### Adding New API Integration

1. Create utility in `utils/` directory
2. Add error handling and logging
3. Use free or low-cost APIs preferred
4. Document API in README.md

## License

AgriChain AI - Agricultural Intelligence for Nigerian Farmers
Created for smallholder farmer empowerment.

## Support

For issues or questions:
1. Check security.log for input validation errors
2. Verify API keys in .env
3. Run test suite to identify failing agents
4. Check agent-specific errors in logs


