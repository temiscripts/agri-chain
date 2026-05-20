const express = require('express')
const router = express.Router()
const { webhook } = require('../middleware/rateLimiter')
const { orchestrate } = require('../orchestrator/index')
const { sendWhatsApp, formatPlanAsMessage } = require('../utils/messageSender')
const { generateRequestId } = require('../utils/requestId')
const { log, logError } = require('../utils/logger')
const store = require('../utils/conversationStore')
const flow = require('../utils/conversationFlow')
const { answerFollowUp } = require('../utils/followUp')

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
  res.sendStatus(200)

  const requestId = generateRequestId()

  try {
    const change = req.body?.entry?.[0]?.changes?.[0]?.value
    const message = change?.messages?.[0]
    if (!message || message.type !== 'text') return
    if (change?.statuses) return

    const from = message.from
    const body = message.text.body.trim()
    log('webhook', requestId, `Inbound from ${from}: "${body}"`)

    await handleMessage(from, body, requestId)
  } catch (err) {
    logError('webhook', requestId, err.message)
  }
})

async function handleMessage(from, body, requestId) {
  if (flow.isResetCommand(body)) {
    store.clear(from)
    await sendWhatsApp(from, flow.t('welcome', 'english'), requestId)
    store.set(from, { stage: 'AWAITING_LANGUAGE' })
    return
  }

  const session = store.get(from)

  if (!session) {
    await sendWhatsApp(from, flow.t('welcome', 'english'), requestId)
    store.set(from, { stage: 'AWAITING_LANGUAGE' })
    return
  }

  switch (session.stage) {
    case 'AWAITING_LANGUAGE':
      return handleLanguage(from, body, requestId)
    case 'AWAITING_CROP':
      return handleCrop(from, body, session, requestId)
    case 'AWAITING_STATE':
      return handleState(from, body, session, requestId)
    case 'AWAITING_SIZE':
      return handleSize(from, body, session, requestId)
    case 'FOLLOW_UP':
      return handleFollowUp(from, body, session, requestId)
    default:
      store.clear(from)
      await sendWhatsApp(from, flow.t('welcome', 'english'), requestId)
      store.set(from, { stage: 'AWAITING_LANGUAGE' })
  }
}

async function handleLanguage(from, body, requestId) {
  const language = flow.parseLanguage(body)
  if (!language) {
    await sendWhatsApp(from, flow.t('invalidLanguage', 'english'), requestId)
    return
  }
  store.update(from, { stage: 'AWAITING_CROP', language })
  await sendWhatsApp(from, flow.t('askCrop', language), requestId)
}

async function handleCrop(from, body, session, requestId) {
  const crop = flow.parseCrop(body)
  if (!crop) {
    await sendWhatsApp(from, flow.t('invalidCrop', session.language), requestId)
    return
  }
  store.update(from, { stage: 'AWAITING_STATE', crop })
  await sendWhatsApp(from, flow.t('askState', session.language), requestId)
}

async function handleState(from, body, session, requestId) {
  const state = flow.parseState(body)
  if (!state) {
    await sendWhatsApp(from, flow.t('invalidState', session.language), requestId)
    return
  }
  store.update(from, { stage: 'AWAITING_SIZE', state })
  await sendWhatsApp(from, flow.t('askSize', session.language), requestId)
}

async function handleSize(from, body, session, requestId) {
  const farmSize = flow.parseSize(body)
  if (!farmSize) {
    await sendWhatsApp(from, flow.t('invalidSize', session.language), requestId)
    return
  }

  const profile = {
    name: 'Farmer',
    crop: session.crop,
    state: session.state,
    lga: session.state,
    farmSize,
    language: session.language,
    phoneNumber: from,
  }

  await sendWhatsApp(
    from,
    flow.t('generating', session.language, { crop: profile.crop, state: profile.state }),
    requestId
  )

  try {
    const { agentResults, farmPlan } = await orchestrate(profile, requestId)
    const planMessage = formatPlanAsMessage(farmPlan, profile)
    const footer = flow.t('followUp', session.language)
    await sendWhatsApp(from, planMessage + footer, requestId)

    store.set(from, {
      stage: 'FOLLOW_UP',
      profile,
      agentResults,
      farmPlan,
      language: session.language,
      history: [],
    })
    log('webhook', requestId, `Plan delivered to ${from} — entering follow-up mode`)
  } catch (err) {
    logError('webhook', requestId, `Orchestration failed: ${err.message}`)
    await sendWhatsApp(from, 'Sorry, something went wrong generating your plan. Please reply *new plan* to try again.', requestId)
    store.clear(from)
  }
}

async function handleFollowUp(from, body, session, requestId) {
  const answer = await answerFollowUp({ session, question: body, requestId })
  await sendWhatsApp(from, answer, requestId)

  const history = [
    ...(session.history || []),
    { role: 'user', content: body },
    { role: 'assistant', content: answer },
  ].slice(-12)

  store.update(from, { history })
}

module.exports = router
