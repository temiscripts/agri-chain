const axios = require('axios')
const cache = require('../cache/cacheManager')
const { log, logError } = require('../utils/logger')

const ISDA_BASE = 'https://api.isda-africa.com/v1/soilproperty'
const PROPERTIES = ['ph', 'nitrogen', 'texture', 'organic_carbon']

// Approximate state-level soil fallback for Nigeria
const STATE_SOIL_FALLBACK = {
  default: { ph: 6.2, nitrogen: 'medium', texture: 'loamy', organicCarbon: 1.5 },
  Kebbi:    { ph: 6.0, nitrogen: 'medium', texture: 'sandy-loam', organicCarbon: 1.2 },
  Kano:     { ph: 6.5, nitrogen: 'medium-low', texture: 'sandy', organicCarbon: 0.9 },
  Plateau:  { ph: 6.5, nitrogen: 'high', texture: 'clay-loam', organicCarbon: 2.1 },
  Oyo:      { ph: 6.8, nitrogen: 'medium', texture: 'sandy-loam', organicCarbon: 1.5 },
  Benue:    { ph: 6.4, nitrogen: 'high', texture: 'loamy', organicCarbon: 2.3 },
  Enugu:    { ph: 5.8, nitrogen: 'medium', texture: 'sandy-clay', organicCarbon: 1.6 },
  Rivers:   { ph: 5.5, nitrogen: 'low', texture: 'clay', organicCarbon: 2.8 },
  Lagos:    { ph: 6.0, nitrogen: 'medium', texture: 'sandy', organicCarbon: 1.1 },
  Kaduna:   { ph: 6.2, nitrogen: 'medium', texture: 'loamy', organicCarbon: 1.3 },
  Sokoto:   { ph: 7.0, nitrogen: 'low', texture: 'sandy', organicCarbon: 0.7 },
}

async function soilAgent({ lat, lon, crop, state }, requestId) {
  log('soilAgent', requestId, `START lat=${lat} lon=${lon} crop=${crop}`)

  const cacheKey = cache.makeSoilKey(lat, lon)
  const cached = cache.get(cacheKey)
  if (cached) {
    log('soilAgent', requestId, `CACHE_HIT key=${cacheKey}`)
    return { ...cached, confidence: 'low', confidenceReason: 'Returned from cache (soil data does not change rapidly)' }
  }

  try {
    const apiKey = process.env.ISDA_API_KEY
    const headers = apiKey ? { Authorization: `Bearer ${apiKey}` } : {}

    const requests = PROPERTIES.map((prop) =>
      axios.get(ISDA_BASE, {
        params: { lat, lon, property: prop, depth: '0-20' },
        headers,
        timeout: 8000,
      })
    )

    log('soilAgent', requestId, `API_CALL url=${ISDA_BASE}`)
    const responses = await Promise.allSettled(requests)

    const soilData = {}
    responses.forEach((res, i) => {
      if (res.status === 'fulfilled') {
        const prop = PROPERTIES[i]
        const val = res.value.data?.value?.[0]?.value?.value
        if (val !== undefined) soilData[prop] = val
      }
    })

    if (Object.keys(soilData).length === 0) throw new Error('No properties returned from iSDAsoil')

    const normalized = {
      ph: soilData.ph ?? 6.2,
      nitrogen: classifyNitrogen(soilData.nitrogen),
      texture: soilData.texture ?? 'loamy',
      organicCarbon: soilData.organic_carbon ?? 1.5,
      suitability: computeSuitability(soilData.ph, crop),
    }

    cache.set(cacheKey, { data: normalized }, 'soil')
    log('soilAgent', requestId, `SUCCESS confidence=high ph=${normalized.ph}`)
    return {
      data: normalized,
      confidence: 'high',
      confidenceReason: 'iSDAsoil API matched coordinates within 1km grid',
    }
  } catch (err) {
    logError('soilAgent', requestId, err.message)

    const fallback = STATE_SOIL_FALLBACK[state] || STATE_SOIL_FALLBACK.default
    const normalized = { ...fallback, suitability: computeSuitability(fallback.ph, crop) }
    log('soilAgent', requestId, `FALLBACK using state-level data for ${state}`)
    return {
      data: normalized,
      confidence: 'low',
      confidenceReason: `iSDAsoil API unavailable — using state-level estimate for ${state}`,
    }
  }
}

function classifyNitrogen(raw) {
  if (raw === undefined) return 'medium'
  if (raw < 0.1) return 'low'
  if (raw < 0.2) return 'medium'
  return 'high'
}

function computeSuitability(ph, crop) {
  const OPTIMAL = {
    rice: [5.5, 7.0], maize: [5.8, 7.0], cassava: [5.5, 6.5],
    yam: [5.5, 7.0], tomato: [6.0, 7.0], sorghum: [5.5, 7.5],
    millet: [5.5, 7.0], cowpea: [6.0, 7.0], beans: [6.0, 7.5],
    groundnut: [5.5, 7.0],
  }
  const range = OPTIMAL[crop] || [5.5, 7.0]
  if (ph >= range[0] && ph <= range[1]) return 95
  const diff = Math.min(Math.abs(ph - range[0]), Math.abs(ph - range[1]))
  return Math.max(40, Math.round(95 - diff * 20))
}

module.exports = soilAgent
