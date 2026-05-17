const { log } = require('../utils/logger')

const TTL = {
  soil: 24 * 60 * 60 * 1000,    // 24 hours
  weather: 60 * 60 * 1000,       // 1 hour
  market: 3 * 60 * 60 * 1000,   // 3 hours
  demo: 7 * 24 * 60 * 60 * 1000, // 7 days
}

const store = new Map()

function get(key) {
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return null
  }
  return entry.value
}

function set(key, value, ttlType) {
  const ttl = TTL[ttlType] || TTL.weather
  store.set(key, { value, expiresAt: Date.now() + ttl })
}

function makeSoilKey(lat, lon) {
  return `soil_${lat.toFixed(3)}_${lon.toFixed(3)}`
}

function makeWeatherKey(lat, lon) {
  const date = new Date().toISOString().slice(0, 10)
  return `weather_${lat.toFixed(3)}_${lon.toFixed(3)}_${date}`
}

function makeMarketKey(state, crop) {
  return `market_${state.toLowerCase()}_${crop.toLowerCase()}`
}

function makeDemoKey(profile) {
  return `demo_${profile}`
}

function getStats() {
  return { entries: store.size }
}

module.exports = { get, set, makeSoilKey, makeWeatherKey, makeMarketKey, makeDemoKey, getStats }
