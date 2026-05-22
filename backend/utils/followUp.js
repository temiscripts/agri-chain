const Anthropic = require('@anthropic-ai/sdk')
const { log, logError } = require('./logger')

const client = process.env.CLAUDE_API_KEY ? new Anthropic({ apiKey: process.env.CLAUDE_API_KEY }) : null

const BASE_PROMPT = `You are AgriChain, a helpful agricultural advisor chatting with a Nigerian smallholder farmer over WhatsApp.

The farmer has already received a farm plan and is now asking follow-up questions. Use the farm profile and agent data below as ground truth — do not invent figures.

Rules:
- Always reply in the farmer's preferred language.
- Use *bold* for emphasis. WhatsApp does not render markdown headers.
- If the farmer asks something you cannot determine from the data, say so honestly and suggest who to ask (extension officer, cooperative, BoA branch).
- Never make up prices, loan amounts, or pest names — only use what the data shows.`

const BRIEF_RULES = `- Be conversational and brief — 2 to 4 short paragraphs maximum.`

const DETAIL_RULES = `- The farmer has asked for more detail on a specific section. Give a thorough, structured response of 5 to 8 sentences covering that topic fully. Include specific actions, quantities, timing, and named resources where the data supports it.`

const DETAIL_KEYWORDS = [
  'more detail', 'more details', 'tell me more', 'explain more', 'explain further',
  'more about', 'elaborate', 'give me more', 'what else', 'expand',
  'in detail', 'detailed', 'full explanation',
]

function isDetailRequest(text) {
  const lower = text.toLowerCase()
  return DETAIL_KEYWORDS.some(k => lower.includes(k))
}

async function answerFollowUp({ session, question, requestId }) {
  if (!client) {
    return 'Sorry, I cannot answer follow-up questions right now. The advisor service is not configured.'
  }

  const { profile, agentResults, farmPlan, history = [] } = session
  const detailed = isDetailRequest(question)

  const systemPrompt = `${BASE_PROMPT}\n${detailed ? DETAIL_RULES : BRIEF_RULES}`
  const contextBlock = buildContextBlock(profile, agentResults, farmPlan)
  const messages = [
    ...history.slice(-6),
    { role: 'user', content: question },
  ]

  log('followUp', requestId, `Calling Claude — detailed=${detailed} historyLen=${history.length}`)

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: detailed ? 1200 : 600,
      system: [
        { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: contextBlock },
      ],
      messages,
    })
    const answer = response.content[0].text.trim()
    log('followUp', requestId, `Follow-up SUCCESS tokens=${response.usage.output_tokens} detailed=${detailed}`)
    return answer
  } catch (err) {
    logError('followUp', requestId, `Claude follow-up failed: ${err.message}`)
    return 'Sorry, I had trouble processing that question. Could you rephrase or try again?'
  }
}

function buildContextBlock(profile, agentResults, farmPlan) {
  const { name, crop, state, lga, farmSize, language } = profile
  const { soil, weather, market, finance, pest } = agentResults || {}

  return `Farmer profile:
- Name: ${name || 'farmer'}
- Location: ${lga}, ${state}
- Crop: ${crop}
- Farm size: ${farmSize} hectares
- Language: ${language}

Soil data: ${stringify(soil?.data)}
Weather data: ${stringify(weather?.data)}
Market data: ${stringify(market?.data)}
Finance data: ${stringify(finance?.data)}
Pest data: ${stringify(pest?.data)}

Farm plan already sent to the farmer:
${stringify(farmPlan)}`
}

function stringify(obj) {
  if (!obj) return 'unavailable'
  if (typeof obj === 'string') return obj
  try { return JSON.stringify(obj, null, 2) } catch { return 'unavailable' }
}

module.exports = { answerFollowUp }
