const { evaluate } = require('../data/financeRules')
const { log } = require('../utils/logger')

async function financeAgent({ crop, farmSize }, requestId) {
  log('financeAgent', requestId, `START crop=${crop} farmSize=${farmSize}`)

  const programmes = evaluate({ farmSize, crop })

  log('financeAgent', requestId, `SUCCESS confidence=high eligible=${programmes.length} programmes`)
  return {
    data: { programmes },
    confidence: 'high',
    confidenceReason: 'Rule-based eligibility check — deterministic',
  }
}

module.exports = financeAgent
