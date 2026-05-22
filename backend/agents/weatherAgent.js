const axios = require('axios')
const cache = require('../cache/cacheManager')
const { log, logError } = require('../utils/logger')

const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast'
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

async function weatherAgent({ lat, lon }, requestId) {
  log('weatherAgent', requestId, `START lat=${lat} lon=${lon}`)

  const cacheKey = cache.makeWeatherKey(lat, lon)
  const cached = cache.get(cacheKey)
  if (cached) {
    log('weatherAgent', requestId, `CACHE_HIT key=${cacheKey}`)
    return cached
  }

  try {
    log('weatherAgent', requestId, `API_CALL url=${OPEN_METEO}`)
    const res = await axios.get(OPEN_METEO, {
      params: {
        latitude: lat,
        longitude: lon,
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_sum',
          'relative_humidity_2m_max',
          'windspeed_10m_max',
          'weathercode',
        ].join(','),
        timezone: 'Africa/Lagos',
        forecast_days: 7,
      },
      timeout: 8000,
    })

    const d = res.data.daily
    const avgTemp = avg(d.temperature_2m_max)
    const avgHumidity = avg(d.relative_humidity_2m_max)
    const totalRainfall = sum(d.precipitation_sum)
    const bestPlantingDay = pickBestPlantingDay(d)
    const floodRisk = totalRainfall > 80 ? 'high' : totalRainfall > 40 ? 'medium' : 'low'
    const droughtRisk = totalRainfall < 5 ? 'high' : totalRainfall < 15 ? 'medium' : 'none'

    const forecast = d.time.map((date, i) => ({
      date,
      dayName: DAYS[new Date(date).getDay()],
      tempMax: d.temperature_2m_max[i],
      tempMin: d.temperature_2m_min[i],
      rainfall: d.precipitation_sum[i],
      humidity: d.relative_humidity_2m_max[i],
    }))

    const result = {
      data: { forecast, avgTemp, avgHumidity, totalRainfall, bestPlantingDay, floodRisk, droughtRisk },
      confidence: 'high',
      confidenceReason: '7-day forecast from Open-Meteo',
    }

    cache.set(cacheKey, result, 'weather')
    log('weatherAgent', requestId, `SUCCESS confidence=high avgTemp=${avgTemp.toFixed(1)} rainfall=${totalRainfall.toFixed(1)}mm`)
    return result
  } catch (err) {
    logError('weatherAgent', requestId, err.message)
    return {
      data: {
        forecast: [],
        avgTemp: 28,
        avgHumidity: 70,
        totalRainfall: 20,
        bestPlantingDay: 'Monday',
        floodRisk: 'unknown',
        droughtRisk: 'unknown',
      },
      confidence: 'low',
      confidenceReason: 'Weather API unavailable — using regional average estimates',
    }
  }
}

function avg(arr) {
  if (!arr || arr.length === 0) return 0
  return arr.reduce((s, v) => s + (v || 0), 0) / arr.length
}

function sum(arr) {
  if (!arr || arr.length === 0) return 0
  return arr.reduce((s, v) => s + (v || 0), 0)
}

function pickBestPlantingDay(d) {
  let best = null
  let bestScore = Infinity
  d.time.forEach((date, i) => {
    const rain = d.precipitation_sum[i] || 0
    const humidity = d.relative_humidity_2m_max[i] || 70
    const score = Math.abs(rain - 8) + Math.abs(humidity - 70) * 0.1
    if (score < bestScore) {
      bestScore = score
      best = DAYS[new Date(date).getDay()]
    }
  })
  return best || 'Monday'
}

module.exports = weatherAgent
