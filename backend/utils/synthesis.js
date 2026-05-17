const Anthropic = require('@anthropic-ai/sdk')
const { log, logError } = require('./logger')

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })

// Cached system prompt — Anthropic caches this block across requests (5-min TTL)
const SYSTEM_PROMPT = `You are AgriChain, an expert agricultural advisor for Nigerian smallholder farmers.

You receive structured data from 5 specialized AI agents (soil, weather, market, finance, pest) and synthesize it into a clear, actionable weekly farm plan.

Rules:
- Be specific and practical. Give exact days, quantities, prices, and locations where available.
- If an agent returned null or failed, acknowledge the gap briefly and move on.
- Always respond in the farmer's requested language. If the language is Hausa, Yoruba, or Igbo, write the entire plan in that language.
- For WhatsApp formatting use *bold* and _italic_ sparingly. Keep it readable as plain text too.
- Never hallucinate prices or loan amounts — only use figures from the agent data.
- The pest alert must name the specific pest, the risk level, and one concrete action.
- Output valid JSON only. No markdown fences, no extra text outside the JSON object.

Output format (JSON):
{
  "weeklyActions": "What to do in the field this week — planting, irrigation, harvesting steps",
  "weatherSummary": "What the weather means for their farm this week",
  "marketAdvice": "Where to sell, current price, and timing advice",
  "financeOptions": "Which programmes they qualify for and exact next steps",
  "pestAlert": "Named pest(s), risk level, and one specific action to take now — or 'No active pest alerts this week' if none",
  "language": "the language code used: english | hausa | yoruba | igbo"
}`

async function synthesize({ farmerInput, agentResults, requestId }) {
  if (!process.env.CLAUDE_API_KEY) {
    log('synthesis', requestId, 'CLAUDE_API_KEY not set — skipping Claude synthesis')
    return null
  }

  const userMessage = buildUserMessage(farmerInput, agentResults)
  log('synthesis', requestId, `Calling Claude API language=${farmerInput.language}`)

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' }, // prompt caching — saves tokens on repeated calls
        },
      ],
      messages: [{ role: 'user', content: userMessage }],
    })

    const raw = response.content[0].text.trim()
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const farmPlan = JSON.parse(jsonStr)
    log('synthesis', requestId, `Claude synthesis SUCCESS input_tokens=${response.usage.input_tokens} output_tokens=${response.usage.output_tokens}`)
    return farmPlan
  } catch (err) {
    logError('synthesis', requestId, `Claude API failed: ${err.message}`)
    return null
  }
}

function buildUserMessage(input, agentResults) {
  const { state, lga, crop, farmSize, language } = input
  const { soil, weather, market, finance, pest } = agentResults

  return `Farmer profile:
- Location: ${lga}, ${state}, Nigeria
- Crop: ${crop}
- Farm size: ${farmSize} hectares
- Language: ${language}

Agent results:

SOIL AGENT (confidence: ${soil?.confidence ?? 'unknown'}):
${soil?.data ? JSON.stringify(soil.data, null, 2) : 'Data unavailable'}

WEATHER AGENT (confidence: ${weather?.confidence ?? 'unknown'}):
${weather?.data ? JSON.stringify({ ...weather.data, forecast: weather.data.forecast?.slice(0, 3) }, null, 2) : 'Data unavailable'}

MARKET AGENT (confidence: ${market?.confidence ?? 'unknown'}):
${market?.data ? JSON.stringify(market.data, null, 2) : 'Data unavailable'}

FINANCE AGENT (confidence: ${finance?.confidence ?? 'unknown'}):
${finance?.data ? JSON.stringify(finance.data, null, 2) : 'Data unavailable'}

PEST AGENT (confidence: ${pest?.confidence ?? 'unknown'}):
${pest?.data ? JSON.stringify(pest.data, null, 2) : 'Data unavailable'}

Generate the farm plan JSON now. Language must be: ${language}.`
}

module.exports = { synthesize }
