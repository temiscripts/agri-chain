const axios = require('axios')
const { log, logError } = require('./logger')

// ── WhatsApp ──────────────────────────────────────────────────────────────────

const WA_MAX_LENGTH = 4000

function splitMessage(message) {
  if (message.length <= WA_MAX_LENGTH) return [message]
  const chunks = []
  let remaining = message
  while (remaining.length > 0) {
    if (remaining.length <= WA_MAX_LENGTH) { chunks.push(remaining); break }
    let cut = remaining.lastIndexOf('\n', WA_MAX_LENGTH)
    if (cut <= 0) cut = WA_MAX_LENGTH
    chunks.push(remaining.slice(0, cut).trim())
    remaining = remaining.slice(cut).trim()
  }
  return chunks
}

function normalisePhone(phoneNumber) {
  // WhatsApp API requires numbers without leading +
  return String(phoneNumber).replace(/^\+/, '')
}

async function sendWhatsApp(phoneNumber, message, requestId) {
  const token = process.env.WHATSAPP_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneNumberId) {
    log('messageSender', requestId, 'WhatsApp not configured — skipping send')
    return { sent: false, channel: 'whatsapp', reason: 'not-configured' }
  }

  const to = normalisePhone(phoneNumber)
  const chunks = splitMessage(message)
  log('messageSender', requestId, `Sending WhatsApp to ${to} (${chunks.length} chunk(s))`)

  try {
    for (const chunk of chunks) {
      await axios.post(
        `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
        { messaging_product: 'whatsapp', to, type: 'text', text: { body: chunk } },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, timeout: 8000 }
      )
    }
    log('messageSender', requestId, `WhatsApp sent successfully to ${to}`)
    return { sent: true, channel: 'whatsapp' }
  } catch (err) {
    logError('messageSender', requestId, `WhatsApp send failed: ${err.message}`)
    return { sent: false, channel: 'whatsapp', reason: err.message }
  }
}

// ── SMS fallback via Africa's Talking ────────────────────────────────────────

async function sendSMS(phoneNumber, message, requestId) {
  const apiKey = process.env.AT_API_KEY
  const username = process.env.AT_USERNAME

  if (!apiKey || !username) {
    log('messageSender', requestId, "Africa's Talking not configured — skipping SMS")
    return { sent: false, channel: 'sms', reason: 'not-configured' }
  }

  try {
    log('messageSender', requestId, `Sending SMS to ${phoneNumber}`)
    const params = new URLSearchParams({ username, to: phoneNumber, message })
    await axios.post('https://api.africastalking.com/version1/messaging', params.toString(), {
      headers: {
        apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      timeout: 8000,
    })
    log('messageSender', requestId, `SMS sent successfully to ${phoneNumber}`)
    return { sent: true, channel: 'sms' }
  } catch (err) {
    logError('messageSender', requestId, `SMS send failed: ${err.message}`)
    return { sent: false, channel: 'sms', reason: err.message }
  }
}

// ── Dispatch: WhatsApp first, SMS fallback ────────────────────────────────────

async function sendPlan(phoneNumber, planText, requestId) {
  if (!phoneNumber) return { sent: false, reason: 'no-phone-number' }

  const wa = await sendWhatsApp(phoneNumber, planText, requestId)
  if (wa.sent) return wa

  log('messageSender', requestId, 'WhatsApp failed — trying SMS fallback')
  return sendSMS(phoneNumber, planText, requestId)
}

// ── Format farm plan as readable message ─────────────────────────────────────

function formatPlanAsMessage(farmPlan, profile) {
  const header = `*AgriChain Farm Plan* — ${profile.crop} · ${profile.state}`
  const footer = '_Reply with your crop, state, and farm size to get a new plan anytime._'

  // ML service returns plain text in _raw — send it directly
  if (farmPlan._raw) {
    return `${header}\n\n${farmPlan._raw}\n\n${footer}`
  }

  const lines = [header, '']
  if (farmPlan.weeklyActions) lines.push(`🌱 *This Week*\n${farmPlan.weeklyActions}`)
  if (farmPlan.weatherSummary) lines.push(`\n🌧️ *Weather*\n${farmPlan.weatherSummary}`)
  if (farmPlan.marketAdvice) lines.push(`\n💰 *Market*\n${farmPlan.marketAdvice}`)
  if (farmPlan.financeOptions) lines.push(`\n🏦 *Finance*\n${farmPlan.financeOptions}`)
  if (farmPlan.pestAlert) lines.push(`\n⚠️ *Pest Alert*\n${farmPlan.pestAlert}`)
  lines.push(`\n${footer}`)

  return lines.join('\n')
}

module.exports = { sendPlan, formatPlanAsMessage, sendWhatsApp, sendSMS }
