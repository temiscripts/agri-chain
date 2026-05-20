const Anthropic = require('@anthropic-ai/sdk')
const { log, logError } = require('./logger')

const client = process.env.CLAUDE_API_KEY ? new Anthropic({ apiKey: process.env.CLAUDE_API_KEY }) : null

const SYSTEM_PROMPT = `You are AgriChain, a helpful agricultural advisor chatting with a Nigerian smallholder farmer over WhatsApp.

The farmer has already received a full farm plan from you, and is now asking follow-up questions. Use the farm profile and agent data below as ground truth — do not invent figures.

Rules:
- Always reply in the farmer's preferred language.
- Be conversational and brief — 2 to 4 short paragraphs maximum.
- Use practical, specific advice the farmer can act on this week.
- Use *bold* (single asterisks) for emphasis. WhatsApp does not render markdown headers.
- If the farmer asks something you cannot determine from the data, say so honestly and suggest who to ask (extension officer, cooperative, BoA branch).
- Never make up prices, loan amounts, or pest names — use only what the data shows.`

async function answerFollowUp({ session, question, requestId }) {
  if (!client) {
    return 'Sorry, I cannot answer follow-up questions right now. The advisor service is not configured.'
  }

  const { profile, agentResults, farmPlan, history = [] } = session

  const contextBlock = buildContextBlock(profile, agentResults, farmPlan)
  const messages = [
    ...history.slice(-6),
    { role: 'user', content: question },
  ]

  log('followUp', requestId, `Calling Claude for follow-up — historyLen=${history.length}`)

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: contextBlock },
      ],
      messages,
    })
    const answer = response.content[0].text.trim()
    log('followUp', requestId, `Follow-up SUCCESS input_tokens=${response.usage.input_tokens} output_tokens=${response.usage.output_tokens}`)
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

This week's plan that was already sent to the farmer:
${stringify(farmPlan)}`
}

function stringify(obj) {
  if (!obj) return 'unavailable'
  if (typeof obj === 'string') return obj
  try { return JSON.stringify(obj, null, 2) } catch { return 'unavailable' }
}

module.exports = { answerFollowUp }
