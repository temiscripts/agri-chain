const axios = require('axios')
const { log, logError } = require('./logger')

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'https://agri-chain-1.onrender.com'

async function synthesize({ farmerInput, agentResults, requestId }) {
  const { name, state, lga, crop, farmSize, language } = farmerInput

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
      logError('synthesis', requestId, `ML service returned success=false: ${JSON.stringify(data)}`)
      return null
    }

    log('synthesis', requestId, 'ML service SUCCESS')

    // His farm_plan is plain text — wrap into our shape so the rest of the pipeline works
    return {
      weeklyActions: data.farm_plan,
      weatherSummary: '',
      marketAdvice: '',
      financeOptions: '',
      pestAlert: '',
      language: language.toLowerCase(),
      _raw: data.farm_plan,
    }
  } catch (err) {
    logError('synthesis', requestId, `ML service failed: ${err.message}`)
    return null
  }
}

function capitalise(str) {
  if (!str) return 'English'
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

module.exports = { synthesize }
