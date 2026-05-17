const axios = require('axios')
const { log, logError } = require('./logger')
const STATE_CENTROIDS = require('../data/stateCentroids')

// Try to resolve LGA name to coordinates via Open-Meteo geocoding.
// Falls back to state centroid if LGA not found.
async function geocode(state, lga, requestId) {
  const query = lga ? `${lga}, ${state}, Nigeria` : `${state}, Nigeria`

  try {
    log('geocoder', requestId, `Geocoding "${query}"`)
    const res = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name: `${lga || state} Nigeria`, count: 5, language: 'en', format: 'json' },
      timeout: 5000,
    })

    const results = (res.data.results || []).filter(
      (r) => r.country_code === 'NG'
    )

    if (results.length > 0) {
      const best = results[0]
      log('geocoder', requestId, `Resolved to lat=${best.latitude} lon=${best.longitude} (${best.name})`)
      return { lat: best.latitude, lon: best.longitude, source: 'geocoding-api' }
    }
  } catch (err) {
    logError('geocoder', requestId, `Geocoding API failed: ${err.message}`)
  }

  // Fallback to state centroid
  const normalized = Object.keys(STATE_CENTROIDS).find(
    (k) => k.toLowerCase() === state.toLowerCase()
  )

  if (normalized) {
    const coords = STATE_CENTROIDS[normalized]
    log('geocoder', requestId, `Using state centroid for ${state}: lat=${coords.lat} lon=${coords.lon}`)
    return { ...coords, source: 'state-centroid' }
  }

  throw new Error(`Cannot resolve coordinates for state="${state}"`)
}

module.exports = { geocode }
