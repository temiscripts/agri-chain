const NIGERIAN_STATES = new Set([
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
])

const SUPPORTED_CROPS = new Set([
  'rice', 'maize', 'cassava', 'yam', 'tomato', 'sorghum',
  'millet', 'cowpea', 'beans', 'groundnut',
])

const SUPPORTED_LANGUAGES = new Set(['english', 'hausa', 'yoruba', 'igbo', 'en', 'ha', 'yo', 'ig'])

const LANGUAGE_NORMALIZE = {
  english: 'english', en: 'english',
  hausa: 'hausa', ha: 'hausa',
  yoruba: 'yoruba', yo: 'yoruba',
  igbo: 'igbo', ig: 'igbo',
}

function validateFarmPlanRequest(body) {
  const { state, lga, crop, farmSize, language, phoneNumber } = body

  if (!state || typeof state !== 'string') {
    return fail('state', 'State is required')
  }
  const normalizedState = Object.keys(Object.fromEntries(
    [...NIGERIAN_STATES].map((s) => [s.toLowerCase(), s])
  ))[Object.keys(Object.fromEntries(
    [...NIGERIAN_STATES].map((s) => [s.toLowerCase(), s])
  )).indexOf(state.toLowerCase())]

  const matchedState = [...NIGERIAN_STATES].find(
    (s) => s.toLowerCase() === state.toLowerCase()
  )
  if (!matchedState) {
    return fail('state', `"${state}" is not a recognized Nigerian state`)
  }

  if (!lga || typeof lga !== 'string' || lga.trim().length < 2) {
    return fail('lga', 'LGA is required')
  }

  if (!crop || typeof crop !== 'string') {
    return fail('crop', 'Crop is required')
  }
  if (!SUPPORTED_CROPS.has(crop.toLowerCase())) {
    return fail('crop', `"${crop}" is not supported. Supported crops: ${[...SUPPORTED_CROPS].join(', ')}`)
  }

  const size = parseFloat(farmSize)
  if (isNaN(size) || size <= 0) {
    return fail('farmSize', 'Farm size must be a positive number')
  }
  if (size > 500) {
    return fail('farmSize', 'Farm size cannot exceed 500 hectares')
  }

  const lang = (language || 'english').toLowerCase()
  if (!SUPPORTED_LANGUAGES.has(lang)) {
    return fail('language', `"${language}" is not supported. Use: english, hausa, yoruba, igbo`)
  }

  if (phoneNumber && typeof phoneNumber === 'string') {
    const cleaned = phoneNumber.replace(/\s+/g, '')
    if (!/^\+?\d{10,15}$/.test(cleaned)) {
      return fail('phoneNumber', 'Phone number must be 10-15 digits, optionally starting with +')
    }
  }

  return {
    valid: true,
    normalized: {
      state: matchedState,
      lga: lga.trim(),
      crop: crop.toLowerCase(),
      farmSize: size,
      language: LANGUAGE_NORMALIZE[lang] || 'english',
      phoneNumber: phoneNumber || null,
    },
  }
}

function fail(field, message) {
  return { valid: false, error: 'VALIDATION_FAILED', field, message }
}

module.exports = { validateFarmPlanRequest, SUPPORTED_CROPS, NIGERIAN_STATES }
