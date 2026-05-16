const axios = require('axios')
const cache = require('../cache/cacheManager')
const { getFallbackPrice } = require('../data/marketFallback')
const { log, logError } = require('../utils/logger')

const WFP_URL = 'https://api.hungermapdata.org/v2/foodsecurity/country/NGA/marketprices'

async function marketAgent({ state, crop }, requestId) {
  log('marketAgent', requestId, `START state=${state} crop=${crop}`)

  const cacheKey = cache.makeMarketKey(state, crop)
  const cached = cache.get(cacheKey)
  if (cached) {
    log('marketAgent', requestId, `CACHE_HIT key=${cacheKey}`)
    return cached
  }

  try {
    log('marketAgent', requestId, `API_CALL url=${WFP_URL}`)
    const res = await axios.get(WFP_URL, { timeout: 8000 })
    const prices = res.data

    const matched = findBestMatch(prices, crop, state)
    if (!matched) throw new Error('No matching commodity found in WFP data')

    const dataAgeHours = getDataAgeHours(matched.date)
    const confidence = dataAgeHours < 24 ? 'high' : dataAgeHours < 72 ? 'medium' : 'low'

    const result = {
      data: {
        crop,
        price: matched.price,
        unit: matched.unit || '50kg bag',
        bestMarkets: matched.markets || [state],
        trend: matched.trend || null,
        currency: 'NGN',
        dataAge: `${Math.round(dataAgeHours)} hours ago`,
        source: 'WFP HungerMap',
      },
      confidence,
      confidenceReason: `WFP live market data — ${Math.round(dataAgeHours)} hours old`,
    }

    cache.set(cacheKey, result, 'market')
    log('marketAgent', requestId, `SUCCESS confidence=${confidence} price=${matched.price}`)
    return result
  } catch (err) {
    logError('marketAgent', requestId, `WFP API failed: ${err.message} — using fallback`)

    const fallback = getFallbackPrice(crop)
    if (!fallback) {
      return {
        data: null,
        confidence: 'low',
        confidenceReason: 'Market data unavailable — no fallback for this crop',
      }
    }

    const result = {
      data: { ...fallback, state },
      confidence: 'low',
      confidenceReason: 'WFP API unavailable — using May 2025 price estimates',
    }
    log('marketAgent', requestId, `FALLBACK price=${fallback.price} for ${crop}`)
    return result
  }
}

function findBestMatch(prices, crop, state) {
  if (!Array.isArray(prices)) return null

  const cropAliases = {
    rice: ['rice', 'paddy rice', 'rice (imported)'],
    maize: ['maize', 'corn', 'yellow maize'],
    cassava: ['cassava', 'cassava flour', 'garri'],
    yam: ['yam', 'yams'],
    tomato: ['tomato', 'tomatoes'],
    sorghum: ['sorghum', 'guinea corn'],
    millet: ['millet', 'pearl millet'],
    cowpea: ['cowpea', 'beans (brown)', 'beans'],
    beans: ['beans', 'cowpea'],
    groundnut: ['groundnut', 'groundnut oil', 'peanuts'],
  }

  const aliases = cropAliases[crop] || [crop]
  const stateEntries = prices.filter(
    (p) => p.admin1 && p.admin1.toLowerCase().includes(state.toLowerCase())
  )
  const pool = stateEntries.length > 0 ? stateEntries : prices

  for (const alias of aliases) {
    const match = pool.find(
      (p) => p.commodity && p.commodity.toLowerCase().includes(alias)
    )
    if (match) {
      return {
        price: match.price || match.value,
        unit: match.unit,
        date: match.date || match.period,
        markets: match.market ? [match.market] : [state],
        trend: null,
      }
    }
  }
  return null
}

function getDataAgeHours(dateStr) {
  if (!dateStr) return 999
  const parsed = new Date(dateStr)
  if (isNaN(parsed)) return 999
  return (Date.now() - parsed.getTime()) / (1000 * 60 * 60)
}

module.exports = marketAgent
