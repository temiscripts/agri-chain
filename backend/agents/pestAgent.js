const PEST_RULES = require('../data/pestRules')
const { log } = require('../utils/logger')

async function pestAgent({ crop, weatherData }, requestId) {
  log('pestAgent', requestId, `START crop=${crop}`)

  const rules = PEST_RULES[crop.toLowerCase()] || []

  if (rules.length === 0) {
    log('pestAgent', requestId, 'No pest rules defined for this crop')
    return {
      data: { alerts: [], alertCount: 0 },
      confidence: 'high',
      confidenceReason: 'No known high-risk pests for this crop under current conditions',
    }
  }

  const w = {
    avgTemp: weatherData?.avgTemp ?? 28,
    avgHumidity: weatherData?.avgHumidity ?? 70,
    totalRainfall: weatherData?.totalRainfall ?? 20,
  }

  const alerts = rules
    .filter((rule) => {
      try { return rule.trigger(w) }
      catch { return false }
    })
    .map(({ name, risk, action }) => ({ name, risk, action }))
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 }
      return (order[a.risk] ?? 3) - (order[b.risk] ?? 3)
    })

  const confidenceReason = alerts.length > 0
    ? `${alerts.length} pest risk(s) triggered by current weather (temp=${w.avgTemp.toFixed(1)}°C, humidity=${w.avgHumidity.toFixed(0)}%, rainfall=${w.totalRainfall.toFixed(1)}mm)`
    : 'Weather conditions do not trigger known pest risks for this crop'

  log('pestAgent', requestId, `SUCCESS confidence=high alerts=${alerts.length}`)
  return {
    data: { alerts, alertCount: alerts.length },
    confidence: 'high',
    confidenceReason,
  }
}

module.exports = pestAgent
