const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Maps our frontend form data to the exact shape Temi's API expects.
 * Drops fields the backend does not use (soilType, fertilizerType, etc.)
 * Converts farmSize from string to number.
 */
function buildRequestBody(farmerProfile) {
  return {
    name: farmerProfile.name || 'Farmer',
    crop: farmerProfile.crop,
    state: farmerProfile.state,
    lga: farmerProfile.lga,
    farmSize: Number(farmerProfile.farmSize) || 1,
    language: farmerProfile.language || 'english',
    phoneNumber: farmerProfile.phoneNumber || null,
  }
}

/**
 * Main orchestrator call. Sends the farmer profile, gets back
 * agent results + a synthesized farm plan.
 */
export async function getFarmPlan(farmerProfile) {
  const body = buildRequestBody(farmerProfile)

  const res = await fetch(`${API_URL}/api/farm-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`Farm plan request failed (${res.status}): ${errorText}`)
  }

  return res.json()
}

/**
 * Quick reachability check.
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_URL}/health`)
    return res.ok
  } catch {
    return false
  }
}

/**
 * Maps an agent's raw API data into the structured shape the
 * AgentCard / AgentDetailModal components expect.
 * Returns { title, confidence: { label, level }, details: [{ label, value }] }
 */
export function mapAgentResult(agentId, agentResult) {
  if (!agentResult || !agentResult.data) {
    return { title: 'No data available', details: [] }
  }

  const { data, confidence } = agentResult
  const confidenceLevel = confidence ? confidence.toLowerCase() : null
  const confidenceTag = confidence
    ? {
        label: `${confidence.charAt(0).toUpperCase() + confidence.slice(1)} confidence`,
        level: confidenceLevel,
      }
    : null

  switch (agentId) {
    case 'soil':
      return {
        title: data.suitability >= 80
          ? 'Healthy soil for this crop'
          : data.suitability >= 50
          ? 'Soil is workable'
          : 'Soil may need amendment',
        confidence: confidenceTag,
        details: [
          { label: 'pH level', value: data.ph ?? '—' },
          { label: 'Nitrogen', value: data.nitrogen ?? '—' },
          { label: 'Texture', value: data.texture ?? '—' },
          { label: 'Organic carbon', value: data.organicCarbon ? `${data.organicCarbon}%` : '—' },
          { label: 'Suitability', value: data.suitability ? `${data.suitability}%` : '—' },
        ],
      }

    case 'weather':
      return {
        title: data.bestPlantingDay
          ? `Best day to plant: ${data.bestPlantingDay}`
          : 'Weather analysis complete',
        confidence: confidenceTag,
        details: [
          { label: 'Avg temperature', value: data.avgTemp ? `${data.avgTemp}°C` : '—' },
          { label: 'Avg humidity', value: data.avgHumidity ? `${data.avgHumidity}%` : '—' },
          { label: 'Total rainfall', value: data.totalRainfall ? `${data.totalRainfall} mm` : '—' },
          { label: 'Flood risk', value: cap(data.floodRisk) || '—' },
          { label: 'Drought risk', value: cap(data.droughtRisk) || '—' },
        ],
      }

    case 'market':
      return {
        title: data.price
          ? `${data.crop ? cap(data.crop) : 'Crop'} at ₦${data.price.toLocaleString()}`
          : 'Market scan complete',
        confidence: confidenceTag,
        details: [
          { label: 'Best markets', value: data.bestMarkets?.join(', ') || '—' },
          { label: 'Current price', value: data.price ? `₦${data.price.toLocaleString()}` : '—' },
          { label: 'Unit', value: data.unit || '—' },
          { label: 'Trend', value: data.trend || '—' },
        ],
      }

    case 'finance': {
      const programmes = data.programmes || []
      const primary = programmes[0]
      return {
        title: programmes.length
          ? `Eligible for ${programmes.length} ${programmes.length === 1 ? 'programme' : 'programmes'}`
          : 'No matching programmes',
        confidence: confidenceTag,
        details: primary
          ? [
              { label: 'Programme', value: primary.name },
              { label: 'Max amount', value: primary.maxAmount ? `₦${primary.maxAmount.toLocaleString()}` : '—' },
              { label: 'Interest rate', value: primary.interestRate || '—' },
              { label: 'Next steps', value: primary.nextSteps || '—' },
            ]
          : [],
      }
    }

    case 'pest': {
      const alerts = data.alerts || []
      const top = alerts[0]
      return {
        title: alerts.length
          ? `${alerts.length} pest ${alerts.length === 1 ? 'alert' : 'alerts'}`
          : 'No pest threats detected',
        confidence: confidenceTag,
        details: top
          ? [
              { label: 'Threat', value: top.name },
              { label: 'Risk level', value: cap(top.risk) || '—' },
              { label: 'Action', value: top.action || '—' },
            ]
          : [],
      }
    }

    default:
      return { title: 'Agent complete', details: [] }
  }
}

/**
 * Maps the API farmPlan prose into the emoji+label+text array
 * the FarmPlan component renders.
 */
export function mapFarmPlan(apiFarmPlan) {
  if (!apiFarmPlan) return []

  const plan = []
  if (apiFarmPlan.weeklyActions) {
    plan.push({ emoji: '🌱', label: 'This week', text: apiFarmPlan.weeklyActions })
  }
  if (apiFarmPlan.weatherSummary) {
    plan.push({ emoji: '🌧️', label: 'Weather', text: apiFarmPlan.weatherSummary })
  }
  if (apiFarmPlan.marketAdvice) {
    plan.push({ emoji: '💰', label: 'Market', text: apiFarmPlan.marketAdvice })
  }
  if (apiFarmPlan.financeOptions) {
    plan.push({ emoji: '🏦', label: 'Finance', text: apiFarmPlan.financeOptions })
  }
  if (apiFarmPlan.pestAlert) {
    plan.push({ emoji: '🐛', label: 'Pest alert', text: apiFarmPlan.pestAlert })
  }
  return plan
}

function cap(s) {
  if (!s || typeof s !== 'string') return s || ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}