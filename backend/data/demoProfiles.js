const PROFILES = {
  chukwuemeka: {
    input: { state: 'Kebbi', lga: 'Birnin Kebbi', crop: 'rice', farmSize: 2, language: 'hausa', phoneNumber: null },
    coords: { lat: 12.45, lon: 4.20 },
  },
  amaka: {
    input: { state: 'Plateau', lga: 'Jos North', crop: 'tomato', farmSize: 1.5, language: 'igbo', phoneNumber: null },
    coords: { lat: 9.93, lon: 8.89 },
  },
  seun: {
    input: { state: 'Oyo', lga: 'Ibadan North', crop: 'maize', farmSize: 3, language: 'yoruba', phoneNumber: null },
    coords: { lat: 7.85, lon: 3.93 },
  },
}

const DEMO_RESULTS = {
  chukwuemeka: {
    soil: {
      data: { ph: 6.2, nitrogen: 'medium-high', texture: 'loamy', organicCarbon: 1.8, suitability: 94 },
      confidence: 'high',
      confidenceReason: 'iSDAsoil API matched coordinates within 1km grid',
    },
    weather: {
      data: {
        forecast: 'Light rains Tuesday to Thursday. Clear skies Friday to Sunday.',
        avgTemp: 27.4,
        avgHumidity: 72,
        totalRainfall: 18.5,
        bestPlantingDay: 'Wednesday',
        floodRisk: 'low',
        droughtRisk: 'none',
      },
      confidence: 'high',
      confidenceReason: '7-day forecast from Open-Meteo',
    },
    market: {
      data: {
        crop: 'rice',
        price: 42000,
        unit: '50kg bag',
        bestMarkets: ['Kano', 'Birnin Kebbi'],
        trend: '+18% vs last month',
        currency: 'NGN',
      },
      confidence: 'high',
      confidenceReason: 'WFP live market data — updated 4 hours ago',
    },
    finance: {
      data: {
        programmes: [
          { name: 'Bank of Agriculture (BoA) Smallholder Loan', maxAmount: 500000, interestRate: '9% per annum', nextSteps: 'Visit Birnin Kebbi BoA branch with BVN.' },
          { name: 'Agricultural Development Fund (ADF) Grant', maxAmount: 150000, interestRate: 'Grant — no repayment', nextSteps: 'Contact Kebbi ADP office.' },
        ],
      },
      confidence: 'high',
      confidenceReason: 'Rule-based — deterministic',
    },
    pest: {
      data: {
        alerts: [
          { name: 'Blast Disease', risk: 'high', action: 'Apply tricyclazole fungicide before Wednesday\'s rain.' },
        ],
        alertCount: 1,
      },
      confidence: 'high',
      confidenceReason: 'Triggered by high humidity (72%) forecast',
    },
    farmPlan: {
      weeklyActions: 'Shuka shinkafa Laraba. Ƙasarka tana da kyau sosai (pH 6.2, mai laushi).',
      weatherSummary: 'Ruwan sama mai sauƙi Talata zuwa Alhamis. Babu hadarin ambaliya.',
      marketAdvice: 'Sayar a Kano cikin makonni 3 zuwa 5. Farashin ₦42,000 a kowace buhu (+18%).',
      financeOptions: 'Kana da haƙƙin samun rancen BOA har ₦500,000. Ka nemi reshen Birnin Kebbi.',
      pestAlert: 'Hadarin cutar Blast yana da yawa. Yi amfani da maganin fungi tricyclazole kafin ruwan Laraba.',
      language: 'hausa',
    },
  },

  amaka: {
    soil: {
      data: { ph: 6.5, nitrogen: 'high', texture: 'clay-loam', organicCarbon: 2.1, suitability: 88 },
      confidence: 'high',
      confidenceReason: 'iSDAsoil API matched coordinates within 1km grid',
    },
    weather: {
      data: {
        forecast: 'Mostly dry this week with light showers on Friday.',
        avgTemp: 24.8,
        avgHumidity: 65,
        totalRainfall: 8.2,
        bestPlantingDay: 'Monday',
        floodRisk: 'low',
        droughtRisk: 'low',
      },
      confidence: 'high',
      confidenceReason: '7-day forecast from Open-Meteo',
    },
    market: {
      data: {
        crop: 'tomato',
        price: 24000,
        unit: '50kg crate',
        bestMarkets: ['Jos Main Market', 'Abuja'],
        trend: '+12% vs last month',
        currency: 'NGN',
      },
      confidence: 'medium',
      confidenceReason: 'WFP data 28 hours old — slightly stale',
    },
    finance: {
      data: {
        programmes: [
          { name: 'Agricultural Development Fund (ADF) Grant', maxAmount: 150000, interestRate: 'Grant — no repayment', nextSteps: 'Contact Plateau ADP office.' },
          { name: 'Cooperative Society Credit', maxAmount: null, interestRate: 'Varies', nextSteps: 'Register with local cooperative.' },
        ],
      },
      confidence: 'high',
      confidenceReason: 'Rule-based — deterministic',
    },
    pest: {
      data: {
        alerts: [
          { name: 'Tomato Leafminer (Tuta absoluta)', risk: 'high', action: 'Deploy pheromone traps this week. Inspect leaves daily.' },
        ],
        alertCount: 1,
      },
      confidence: 'high',
      confidenceReason: 'Endemic pest — present above 22°C',
    },
    farmPlan: {
      weeklyActions: 'Kụọ tomato n\'ụbọchị Mọnde. Aja gị dị mma (pH 6.5). Hie anya n\'ọchịchọ ụdọ oge nile.',
      weatherSummary: 'Ihu igwe dị mma n\'izu a. Mmiri ozuzo dị nta n\'ụbọchị Fraịde.',
      marketAdvice: 'Ree na Jos ma ọ bụ Abuja. Ọnụahịa bụ ₦24,000 maka crate ọ bụla (+12%).',
      financeOptions: 'I nwere ike nweta ADF grant ruo ₦150,000. Gaa ụlọ ADP nke Plateau.',
      pestAlert: 'Ụdọ Leafminer nke Tuta absoluta dị elu. Jiri nke a ijide ya tupu ọ bilie.',
      language: 'igbo',
    },
  },

  seun: {
    soil: {
      data: { ph: 6.8, nitrogen: 'medium', texture: 'sandy-loam', organicCarbon: 1.5, suitability: 91 },
      confidence: 'high',
      confidenceReason: 'iSDAsoil API matched coordinates within 1km grid',
    },
    weather: {
      data: {
        forecast: 'Intermittent rains through the week. Heaviest on Wednesday.',
        avgTemp: 29.2,
        avgHumidity: 78,
        totalRainfall: 32.4,
        bestPlantingDay: 'Thursday',
        floodRisk: 'medium',
        droughtRisk: 'none',
      },
      confidence: 'high',
      confidenceReason: '7-day forecast from Open-Meteo',
    },
    market: {
      data: {
        crop: 'maize',
        price: 32000,
        unit: '100kg bag',
        bestMarkets: ['Ibadan', 'Lagos'],
        trend: '+8% vs last month',
        currency: 'NGN',
      },
      confidence: 'high',
      confidenceReason: 'WFP live market data — updated 2 hours ago',
    },
    finance: {
      data: {
        programmes: [
          { name: 'Bank of Agriculture (BoA) Smallholder Loan', maxAmount: 500000, interestRate: '9% per annum', nextSteps: 'Visit Ibadan BoA branch with BVN.' },
          { name: 'Agricultural Development Fund (ADF) Grant', maxAmount: 150000, interestRate: 'Grant — no repayment', nextSteps: 'Contact Oyo ADP office.' },
        ],
      },
      confidence: 'high',
      confidenceReason: 'Rule-based — deterministic',
    },
    pest: {
      data: {
        alerts: [
          { name: 'Fall Armyworm', risk: 'high', action: 'Ṣayẹ àwọn leaves whorl lójoojúmọ. Lo emamectin benzoate.' },
          { name: 'Stem Borer', risk: 'medium', action: 'Fi granules sínú whorl ní ọsẹ 2–3.' },
        ],
        alertCount: 2,
      },
      confidence: 'high',
      confidenceReason: 'High temperature (29°C) and humidity (78%) trigger both pests',
    },
    farmPlan: {
      weeklyActions: 'Gbin àgbàdo ní Ọjọ́bọ̀. Erùpẹ̀ rẹ dára (pH 6.8). Yẹra fún agbe ní àárọ̀ Ọjọ́rú nítorí òjò.',
      weatherSummary: 'Òjò tó lekoko Ọjọ́rú. Ewu omi kékèké. Gbin lẹ́yìn Ọjọ́rú.',
      marketAdvice: 'Tà ní Ibadan tàbí Lagos. Iye owó jẹ́ ₦32,000 fún àpò (+8%). Tà ní ọsẹ̀ 10–12.',
      financeOptions: 'O lẹ̀tọ́ sí BOA àti ADF. Lọ sí ẹ̀ka Ibadan pẹ̀lú BVN rẹ.',
      pestAlert: 'Fall Armyworm ní ewu gíga. Ṣayẹ àwọn ọgbin lójoojúmọ. Lo emamectin benzoate lẹ́sẹ̀kẹsẹ̀.',
      language: 'yoruba',
    },
  },
}

module.exports = { PROFILES, DEMO_RESULTS }
