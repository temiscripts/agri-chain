// Approximate Nigerian market prices (Naira) — updated May 2025.
// Used when the WFP live API is unavailable.
// Prices are per standard unit: rice/maize/sorghum/millet/cowpea/beans/groundnut = per 50kg bag,
// cassava = per tonne, yam = per 100-tuber heap, tomato = per 50kg crate.

const PRICES = {
  rice:      { unit: '50kg bag',      min: 38000, max: 48000, bestMarkets: ['Kano', 'Lagos', 'Onitsha'] },
  maize:     { unit: '100kg bag',     min: 28000, max: 38000, bestMarkets: ['Kano', 'Ibadan', 'Kaduna'] },
  cassava:   { unit: 'tonne',         min: 55000, max: 80000, bestMarkets: ['Onitsha', 'Lagos', 'Enugu'] },
  yam:       { unit: '100-tuber heap',min: 35000, max: 60000, bestMarkets: ['Makurdi', 'Abuja', 'Onitsha'] },
  tomato:    { unit: '50kg crate',    min: 15000, max: 35000, bestMarkets: ['Kano', 'Lagos', 'Ibadan'] },
  sorghum:   { unit: '100kg bag',     min: 30000, max: 42000, bestMarkets: ['Kano', 'Maiduguri', 'Sokoto'] },
  millet:    { unit: '100kg bag',     min: 32000, max: 45000, bestMarkets: ['Kano', 'Sokoto', 'Katsina'] },
  cowpea:    { unit: '50kg bag',      min: 55000, max: 75000, bestMarkets: ['Kano', 'Ibadan', 'Onitsha'] },
  beans:     { unit: '50kg bag',      min: 50000, max: 70000, bestMarkets: ['Lagos', 'Ibadan', 'Abuja'] },
  groundnut: { unit: '50kg bag',      min: 45000, max: 65000, bestMarkets: ['Kano', 'Kaduna', 'Sokoto'] },
}

function getFallbackPrice(crop) {
  const data = PRICES[crop.toLowerCase()]
  if (!data) return null
  const mid = Math.round((data.min + data.max) / 2)
  return {
    crop,
    price: mid,
    priceMin: data.min,
    priceMax: data.max,
    unit: data.unit,
    bestMarkets: data.bestMarkets,
    currency: 'NGN',
    source: 'fallback',
    dataAge: 'May 2025 estimate',
  }
}

module.exports = { getFallbackPrice }
