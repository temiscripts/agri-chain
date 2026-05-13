import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, MapPin, Sprout, Ruler, Globe, Check
} from 'lucide-react'

const STATES = [
  'Kebbi', 'Kano', 'Kaduna', 'Plateau', 'Oyo', 'Lagos',
  'Ogun', 'Benue', 'Niger', 'Sokoto', 'Zamfara', 'Borno',
  'Adamawa', 'Taraba', 'Nasarawa', 'Kogi', 'Kwara', 'Ekiti',
  'Osun', 'Ondo', 'Edo', 'Delta', 'Rivers', 'Bayelsa',
  'Cross River', 'Akwa Ibom', 'Imo', 'Abia', 'Anambra', 'Enugu',
  'Ebonyi', 'Gombe', 'Bauchi', 'Jigawa', 'Yobe', 'Katsina', 'FCT',
]

const CROPS = [
  { id: 'rice', label: 'Rice', emoji: '🌾' },
  { id: 'maize', label: 'Maize', emoji: '🌽' },
  { id: 'cassava', label: 'Cassava', emoji: '🥔' },
  { id: 'yam', label: 'Yam', emoji: '🍠' },
  { id: 'tomato', label: 'Tomato', emoji: '🍅' },
  { id: 'sorghum', label: 'Sorghum', emoji: '🌾' },
  { id: 'beans', label: 'Beans', emoji: '🫘' },
  { id: 'groundnut', label: 'Groundnut', emoji: '🥜' },
]

const LANGUAGES = [
  { id: 'english', label: 'English', native: 'English' },
  { id: 'hausa', label: 'Hausa', native: 'Hausa' },
  { id: 'yoruba', label: 'Yoruba', native: 'Yorùbá' },
  { id: 'igbo', label: 'Igbo', native: 'Igbo' },
]

export default function OnboardingForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    state: '',
    lga: '',
    crop: '',
    farmSize: '',
    language: '',
  })

  const update = (field, value) => setData({ ...data, [field]: value })

  const canProceed = () => {
    if (step === 0) return data.state && data.lga
    if (step === 1) return data.crop && data.farmSize && Number(data.farmSize) > 0
    if (step === 2) return data.language
    return false
  }

  const next = () => {
    if (step < 2) setStep(step + 1)
    else handleSubmit()
  }

  const back = () => {
    if (step > 0) setStep(step - 1)
    else navigate('/')
  }

  const handleSubmit = () => {
    sessionStorage.setItem('farmerProfile', JSON.stringify(data))
    navigate('/results')
  }

  return (
    <div className="organic-bg min-h-screen flex flex-col">
      {/* Top nav */}
      <div className="px-6 md:px-10 py-6 flex items-center justify-between">
        <button
          onClick={back}
          className="flex items-center gap-2 text-slate hover:text-forest transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                s === step ? 'w-10 bg-forest' : s < step ? 'w-6 bg-forest/50' : 'w-6 bg-border'
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-slate font-mono">{step + 1} / 3</div>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-start md:items-center justify-center px-6 pt-4 pb-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* ── STEP 1: LOCATION ── */}
            {step === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/8 border border-forest/15 mb-6">
                  <MapPin className="w-3 h-3 text-forest" />
                  <span className="text-xs text-forest font-semibold">Step 1 · Your Location</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-earth mb-3">
                  Where is your farm?
                </h2>
                <p className="text-slate mb-10">
                  We use this to fetch your soil data, weather forecast, and nearest market prices.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-earth mb-2">State</label>
                    <select
                      value={data.state}
                      onChange={(e) => update('state', e.target.value)}
                      className="w-full bg-white border border-border rounded-xl py-3.5 px-4 text-earth focus:outline-none focus:border-forest transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Choose your state</option>
                      {STATES.sort().map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth mb-2">
                      Local Government Area (LGA)
                    </label>
                    <input
                      type="text"
                      value={data.lga}
                      onChange={(e) => update('lga', e.target.value)}
                      placeholder="e.g. Birnin Kebbi"
                      className="w-full bg-white border border-border rounded-xl py-3.5 px-4 text-earth placeholder:text-slate/60 focus:outline-none focus:border-forest transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: CROP + FARM SIZE ── */}
            {step === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/8 border border-forest/15 mb-6">
                  <Sprout className="w-3 h-3 text-forest" />
                  <span className="text-xs text-forest font-semibold">Step 2 · Your Crop</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-earth mb-3">
                  What are you growing?
                </h2>
                <p className="text-slate mb-8">
                  Pick your main crop. We'll tailor every recommendation to it.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {CROPS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => update('crop', c.id)}
                      className={`p-4 rounded-xl border transition-all text-center ${
                        data.crop === c.id
                          ? 'bg-forest/5 border-forest'
                          : 'bg-white border-border hover:border-forest/40'
                      }`}
                    >
                      <div className="text-2xl mb-1">{c.emoji}</div>
                      <div className={`text-sm font-medium ${
                        data.crop === c.id ? 'text-forest' : 'text-earth'
                      }`}>{c.label}</div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth mb-2">
                    <Ruler className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                    Farm size (in hectares)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={data.farmSize}
                      onChange={(e) => update('farmSize', e.target.value)}
                      placeholder="2"
                      className="w-full bg-white border border-border rounded-xl py-3.5 px-4 pr-24 text-earth font-mono text-lg placeholder:text-slate/60 focus:outline-none focus:border-forest transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate text-sm">
                      hectares
                    </span>
                  </div>
                  {data.farmSize && Number(data.farmSize) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs text-slate"
                    >
                      ≈ {(Number(data.farmSize) * 2.47).toFixed(1)} acres
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: LANGUAGE ── */}
            {step === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/8 border border-forest/15 mb-6">
                  <Globe className="w-3 h-3 text-forest" />
                  <span className="text-xs text-forest font-semibold">Step 3 · Your Language</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-earth mb-3">
                  Pick your language.
                </h2>
                <p className="text-slate mb-8">
                  Your farm plan will be delivered in this language.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => update('language', l.id)}
                      className={`text-left p-5 rounded-xl border transition-all ${
                        data.language === l.id
                          ? 'bg-forest/5 border-forest'
                          : 'bg-white border-border hover:border-forest/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`font-display font-semibold text-lg ${
                            data.language === l.id ? 'text-forest' : 'text-earth'
                          }`}>{l.label}</div>
                          <div className="text-sm text-slate">{l.native}</div>
                        </div>
                        {data.language === l.id && (
                          <div className="w-6 h-6 rounded-full bg-forest flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            <button
              onClick={next}
              disabled={!canProceed()}
              className={`w-full flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold transition-all ${
                canProceed()
                  ? 'bg-forest text-white hover:bg-forest-dark'
                  : 'bg-border text-slate/60 cursor-not-allowed'
              }`}
            >
              {step === 2 ? 'Generate my farm plan' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}