const axios = require('axios')
const Anthropic = require('@anthropic-ai/sdk')
const { log, logError } = require('./logger')

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'https://agri-chain-1.onrender.com'
const claude = process.env.CLAUDE_API_KEY ? new Anthropic({ apiKey: process.env.CLAUDE_API_KEY }) : null

const CLAUDE_SYSTEM_PROMPT = `You are AgriChain, an agricultural advisor for Nigerian smallholder farmers. You receive data from 5 AI agents and write a concise weekly farm plan.

STRICT RULES:
- Each section must be a maximum of 3 sentences.
- Write plain prose only. No markdown. No bold, no headers, no bullet points, no dashes. Just clean sentences a farmer can read in 10 seconds.
- Be specific: use exact days, prices in naira, and named locations from the data.
- Never hallucinate figures. Only use what the agent data provides.
- Always write in the farmer's requested language.

Output valid JSON only with these exact keys:
{
  "weeklyActions": "max 3 sentences, plain prose",
  "weatherSummary": "max 3 sentences, plain prose",
  "marketAdvice": "max 3 sentences, plain prose",
  "financeOptions": "max 3 sentences, plain prose",
  "pestAlert": "max 3 sentences, plain prose, or 'No active pest threats this week' if none",
  "language": "english | hausa | yoruba | igbo"
}`

async function synthesize({ farmerInput, agentResults, requestId }) {
  const { name, state, lga, crop, farmSize, language } = farmerInput

  // Primary: ML guy's service
  log('synthesis', requestId, `Calling ML service language=${language}`)
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/orchestrate`,
      {
        name: name || 'Farmer',
        state,
        lga,
        crop,
        farm_size: String(farmSize),
        language: capitalise(language),
        soil_type: 'Loamy',
        fertilization_method: 'Mixed (both organic and inorganic)',
      },
      { timeout: 60000 }
    )

    const data = response.data
    if (!data.success) {
      logError('synthesis', requestId, `ML service returned success=false`)
    } else {
      log('synthesis', requestId, 'ML service SUCCESS')
      return {
        weeklyActions: data.farm_plan,
        weatherSummary: '',
        marketAdvice: '',
        financeOptions: '',
        pestAlert: '',
        language: language.toLowerCase(),
        _raw: data.farm_plan,
      }
    }
  } catch (err) {
    logError('synthesis', requestId, `ML service failed: ${err.message} — falling back to Claude`)
  }

  // Fallback: Claude with tuned prompt
  if (!claude) {
    log('synthesis', requestId, 'CLAUDE_API_KEY not set — skipping Claude fallback')
    return null
  }

  log('synthesis', requestId, 'Calling Claude fallback synthesis')
  try {
    const userMessage = buildUserMessage(farmerInput, agentResults)
    const response = await claude.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: [{ type: 'text', text: CLAUDE_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userMessage }],
    })

    const raw = response.content[0].text.trim()
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const farmPlan = JSON.parse(jsonStr)
    log('synthesis', requestId, `Claude fallback SUCCESS tokens=${response.usage.output_tokens}`)
    return farmPlan
  } catch (err) {
    logError('synthesis', requestId, `Claude fallback failed: ${err.message}`)
    return null
  }
}

function buildUserMessage(input, agentResults) {
  const { state, lga, crop, farmSize, language } = input
  const { soil, weather, market, finance, pest } = agentResults

  return `Farmer: ${lga}, ${state} | Crop: ${crop} | Farm size: ${farmSize} hectares | Language: ${language}

SOIL: ${soil?.data ? JSON.stringify(soil.data) : 'unavailable'}
WEATHER: ${weather?.data ? JSON.stringify(weather.data) : 'unavailable'}
MARKET: ${market?.data ? JSON.stringify(market.data) : 'unavailable'}
FINANCE: ${finance?.data ? JSON.stringify(finance.data) : 'unavailable'}
PEST: ${pest?.data ? JSON.stringify(pest.data) : 'unavailable'}

Write the farm plan JSON now. Language: ${language}.`
}

function capitalise(str) {
  if (!str) return 'English'
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

module.exports = { synthesize }
