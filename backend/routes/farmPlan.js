const express = require('express')
const router = express.Router()
const { standard } = require('../middleware/rateLimiter')
const { validateFarmPlanRequest } = require('../middleware/validator')
const { orchestrate } = require('../orchestrator/index')
const { sendPlan, formatPlanAsMessage } = require('../utils/messageSender')
const { generateRequestId } = require('../utils/requestId')
const { log, logError } = require('../utils/logger')
const { PROFILES, DEMO_RESULTS } = require('../data/demoProfiles')

router.post('/farm-plan', standard, async (req, res) => {
  const requestId = generateRequestId()
  log('farmPlan', requestId, `Incoming request from ${req.ip}`)

  const validation = validateFarmPlanRequest(req.body)
  if (!validation.valid) {
    return res.status(400).json({
      requestId,
      status: 'error',
      error: validation.error,
      field: validation.field,
      message: validation.message,
    })
  }

  const input = validation.normalized

  try {
    const { coords, agentResults, farmPlan } = await orchestrate(input, requestId)

    let messageSent = false
    if (input.phoneNumber) {
      const message = formatPlanAsMessage(farmPlan, input)
      const sendResult = await sendPlan(input.phoneNumber, message, requestId)
      messageSent = sendResult.sent
    }

    log('farmPlan', requestId, `Complete — whatsappSent=${messageSent}`)
    return res.json({
      requestId,
      status: 'success',
      farmPlan,
      agentResults,
      coords,
      whatsappSent: messageSent,
    })
  } catch (err) {
    logError('farmPlan', requestId, err.message)
    return res.status(500).json({
      requestId,
      status: 'error',
      error: 'ORCHESTRATION_FAILED',
      message: err.message,
    })
  }
})

router.get('/demo/:profile', async (req, res) => {
  const requestId = generateRequestId()
  const profileName = req.params.profile.toLowerCase()

  log('farmPlan', requestId, `Demo request for profile="${profileName}"`)

  const profileData = DEMO_RESULTS[profileName]
  if (!profileData) {
    return res.status(404).json({
      requestId,
      status: 'error',
      error: 'PROFILE_NOT_FOUND',
      message: `Demo profile "${profileName}" not found. Available: ${Object.keys(DEMO_RESULTS).join(', ')}`,
    })
  }

  const profile = PROFILES[profileName]
  return res.json({
    requestId,
    status: 'success',
    demo: true,
    profile: profile.input,
    farmPlan: profileData.farmPlan,
    agentResults: {
      soil: profileData.soil,
      weather: profileData.weather,
      market: profileData.market,
      finance: profileData.finance,
      pest: profileData.pest,
    },
    whatsappSent: false,
  })
})

router.get('/supported', (req, res) => {
  const { SUPPORTED_CROPS, NIGERIAN_STATES } = require('../middleware/validator')
  res.json({
    crops: [...SUPPORTED_CROPS].sort(),
    states: [...NIGERIAN_STATES].sort(),
    languages: ['english', 'hausa', 'yoruba', 'igbo'],
  })
})

module.exports = router
