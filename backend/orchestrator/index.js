const soilAgent = require('../agents/soilAgent')
const weatherAgent = require('../agents/weatherAgent')
const marketAgent = require('../agents/marketAgent')
const financeAgent = require('../agents/financeAgent')
const pestAgent = require('../agents/pestAgent')
const { geocode } = require('../utils/geocoder')
const { synthesize } = require('../utils/synthesis')
const { log, logError } = require('../utils/logger')

async function orchestrate(input, requestId) {
  const { state, lga, crop, farmSize, language } = input

  log('orchestrator', requestId, `Geocoding ${lga}, ${state}`)
  const coords = await geocode(state, lga, requestId)
  const { lat, lon } = coords
  log('orchestrator', requestId, `Coordinates resolved lat=${lat} lon=${lon} via ${coords.source}`)

  log('orchestrator', requestId, 'Dispatching 5 agents in parallel')
  const [soilRes, weatherRes, marketRes, financeRes] = await Promise.allSettled([
    soilAgent({ lat, lon, crop, state }, requestId),
    weatherAgent({ lat, lon }, requestId),
    marketAgent({ state, crop }, requestId),
    financeAgent({ crop, farmSize }, requestId),
  ])

  const soil = extractResult(soilRes, 'soilAgent', requestId)
  const weather = extractResult(weatherRes, 'weatherAgent', requestId)
  const market = extractResult(marketRes, 'marketAgent', requestId)
  const finance = extractResult(financeRes, 'financeAgent', requestId)

  const pestRes = await pestAgent(
    { crop, weatherData: weather?.data },
    requestId
  ).catch((err) => {
    logError('orchestrator', requestId, `pestAgent failed: ${err.message}`)
    return { data: { alerts: [], alertCount: 0 }, confidence: 'low', confidenceReason: 'Pest agent error' }
  })

  const agentResults = { soil, weather, market, finance, pest: pestRes }
  log('orchestrator', requestId, 'All agents complete — calling synthesis')

  const claudePlan = await synthesize({ farmerInput: input, agentResults, requestId })
  const farmPlan = claudePlan || buildTemplatePlan(agentResults, input)

  return { coords, agentResults, farmPlan }
}

function extractResult(settled, agentName, requestId) {
  if (settled.status === 'fulfilled') return settled.value
  logError('orchestrator', requestId, `${agentName} failed: ${settled.reason?.message}`)
  return { data: null, confidence: 'low', confidenceReason: `${agentName} failed`, error: settled.reason?.message }
}

function buildTemplatePlan(agentResults, input) {
  const { soil, weather, market, finance, pest } = agentResults
  const { crop, state, language } = input

  const soilSummary = soil?.data
    ? `Soil pH ${soil.data.ph}, ${soil.data.texture} texture, ${soil.data.nitrogen} nitrogen (${soil.data.suitability}% suitable for ${crop})`
    : 'Soil data unavailable'

  const weatherSummary = weather?.data
    ? `Avg temperature ${weather.data.avgTemp?.toFixed(1)}°C, ${weather.data.totalRainfall?.toFixed(0)}mm rain expected. Best planting day: ${weather.data.bestPlantingDay}. Flood risk: ${weather.data.floodRisk}.`
    : 'Weather data unavailable'

  const marketSummary = market?.data
    ? `${crop} selling at ₦${market.data.price?.toLocaleString()} per ${market.data.unit}. Best markets: ${market.data.bestMarkets?.join(', ')}.`
    : 'Market data unavailable'

  const financeList = finance?.data?.programmes?.length > 0
    ? finance.data.programmes.map((p) => p.maxAmount ? `${p.name} (up to ₦${p.maxAmount.toLocaleString()})` : `${p.name} (${p.amountLabel || 'amount varies'})`).join('; ')
    : 'No finance programmes matched'

  const pestSummary = pest?.data?.alerts?.length > 0
    ? pest.data.alerts.map((a) => `${a.name} [${a.risk} risk]: ${a.action}`).join(' | ')
    : 'No active pest alerts for current conditions'

  return {
    weeklyActions: `Plant ${crop} on ${weather?.data?.bestPlantingDay || 'a suitable day this week'}. ${soilSummary}.`,
    weatherSummary,
    marketAdvice: marketSummary,
    financeOptions: financeList,
    pestAlert: pestSummary,
    language,
    generatedBy: 'template-fallback',
  }
}

module.exports = { orchestrate }
