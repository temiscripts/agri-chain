const express = require('express')
const router = express.Router()
const { webhook } = require('../middleware/rateLimiter')
const { orchestrate } = require('../orchestrator/index')
const { validateFarmPlanRequest } = require('../middleware/validator')
const { sendWhatsApp, formatPlanAsMessage } = require('../utils/messageSender')
const { generateRequestId } = require('../utils/requestId')
const { log, logError } = require('../utils/logger')

// GET /webhook/whatsapp — Meta webhook verification
router.get('/whatsapp', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    log('webhook', null, 'WhatsApp webhook verified')
    return res.status(200).send(challenge)
  }
  log('webhook', null, 'WhatsApp verification failed — token mismatch')
  return res.sendStatus(403)
})

// POST /webhook/whatsapp — receive inbound messages from farmers
router.post('/whatsapp', webhook, async (req, res) => {
  // Acknowledge immediately — Meta requires a 200 within 5 seconds
  res.sendStatus(200)

  const requestId = generateRequestId()

  try {
    const entry = req.body?.entry?.[0]
    const change = entry?.changes?.[0]?.value
    const message = change?.messages?.[0]

    if (!message || message.type !== 'text') return
    if (change?.statuses) return // ignore delivery receipts

    const from = message.from // farmer's phone number
    const body = message.text.body.trim()
    log('webhook', requestId, `Inbound WhatsApp from ${from}: "${body}"`)

    const parsed = parseInboundMessage(body)
    if (!parsed) {
      await sendWhatsApp(from, buildHelpMessage(), requestId)
      return
    }

    const validation = validateFarmPlanRequest({ ...parsed, phoneNumber: from })
    if (!validation.valid) {
      await sendWhatsApp(
        from,
        `Sorry, I could not understand your request: ${validation.message}\n\nFormat: [crop], [state], [farm size in hectares]\nExample: rice, Kebbi, 2`,
        requestId
      )
      return
    }

    const input = { ...validation.normalized, phoneNumber: from }
    await sendWhatsApp(from, `Got it! Generating your ${input.crop} farm plan for ${input.state}. This takes about 20 seconds...`, requestId)

    const { agentResults, farmPlan } = await orchestrate(input, requestId)
    const message_ = formatPlanAsMessage(farmPlan, input)
    await sendWhatsApp(from, message_, requestId)

    log('webhook', requestId, `Farm plan delivered via WhatsApp to ${from}`)
  } catch (err) {
    logError('webhook', requestId, err.message)
  }
})

function parseInboundMessage(text) {
  // Accepts formats like:
  //   "rice, Kebbi, 2"
  //   "rice kebbi 2ha"
  //   "Rice / Kebbi / 2.5 hectares"
  const cleaned = text.replace(/hectares?|ha\b/gi, '').replace(/[/|]/g, ',')
  const parts = cleaned.split(/[\s,]+/).filter(Boolean)
  if (parts.length < 2) return null

  const CROPS = ['rice', 'maize', 'cassava', 'yam', 'tomato', 'sorghum', 'millet', 'cowpea', 'beans', 'groundnut']
  const STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']

  let crop = null, state = null, farmSize = null

  for (const part of parts) {
    if (!crop && CROPS.includes(part.toLowerCase())) {
      crop = part.toLowerCase()
    } else if (!state) {
      const matched = STATES.find((s) => s.toLowerCase() === part.toLowerCase())
      if (matched) state = matched
    } else if (!farmSize && !isNaN(parseFloat(part))) {
      farmSize = parseFloat(part)
    }
  }

  if (!crop || !state) return null

  return {
    crop,
    state,
    lga: state, // default LGA to state name — geocoder will use state centroid
    farmSize: farmSize || 1,
    language: 'english',
  }
}

function buildHelpMessage() {
  return [
    '*AgriChain* — AI Farm Advisor 🌱',
    '',
    'Send your farm details in this format:',
    '*[crop], [state], [farm size in hectares]*',
    '',
    'Example: _rice, Kebbi, 2_',
    '',
    'Supported crops: rice, maize, cassava, yam, tomato, sorghum, millet, cowpea, beans, groundnut',
  ].join('\n')
}

module.exports = router
