import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, MapPin, Sprout, Ruler, Globe, Check,
  Layers, Beaker, Calendar
} from 'lucide-react'
import Background from './Background'

const STATES = [
  'Kebbi', 'Kano', 'Kaduna', 'Plateau', 'Oyo', 'Lagos',
  'Ogun', 'Benue', 'Niger', 'Sokoto', 'Zamfara', 'Borno',
  'Adamawa', 'Taraba', 'Nasarawa', 'Kogi', 'Kwara', 'Ekiti',
  'Osun', 'Ondo', 'Edo', 'Delta', 'Rivers', 'Bayelsa',
  'Cross River', 'Akwa Ibom', 'Imo', 'Abia', 'Anambra', 'Enugu',
  'Ebonyi', 'Gombe', 'Bauchi', 'Jigawa', 'Yobe', 'Katsina', 'FCT',
]

const SOIL_TYPES = [
  { id: 'loamy', label: 'Loamy', desc: 'Dark, rich, well balanced', swatch: '#5C3317' },
  { id: 'clay', label: 'Clay', desc: 'Heavy, sticky when wet', swatch: '#A0522D' },
  { id: 'sandy', label: 'Sandy', desc: 'Light, drains quickly', swatch: '#D4A574' },
  { id: 'alluvial', label: 'Alluvial', desc: 'Found near rivers, very fertile', swatch: '#4A3520' },
  { id: 'laterite', label: 'Laterite', desc: 'Reddish, common in hot regions', swatch: '#B5651D' },
  { id: 'unsure', label: 'Not sure', desc: 'We will figure it out for you', swatch: '#999' },
]

const CROPS = [
  { id: 'rice', label: 'Rice', emoji: '🌾' },
  { id: 'maize', label: 'Maize', emoji: '🌽' },
  { id: 'cassava', label: 'Cassava', emoji: '🥔' },
  { id: 'yam', label: 'Yam', emoji: '🍠' },
  { id: 'tomato', label: 'Tomato', emoji: '🍅' },
  { id: 'sorghum', label: 'Sorghum', emoji: '🌾' },
  { id: 'beans', label: 'Beans', emoji: '🌱' },
  { id: 'groundnut', label: 'Groundnut', emoji: '🥜' },
]

const FERTILIZER_TYPES = [
  { id: 'natural', label: 'Natural only', desc: 'Manure, compost, mulch' },
  { id: 'artificial', label: 'Artificial only', desc: 'NPK, urea, DAP' },
  { id: 'both', label: 'Both', desc: 'A mix of natural and artificial' },
  { id: 'none', label: 'None', desc: 'I farm without fertilizer' },
]

const FERTILIZER_FREQUENCY = [
  { id: 'never', label: 'Never' },
  { id: 'once', label: 'Once per season' },
  { id: 'twice', label: 'Twice per season' },
  { id: 'multiple', label: 'Multiple times' },
]

const LANGUAGES = [
  { id: 'english', label: 'English', native: 'English' },
  { id: 'hausa', label: 'Hausa', native: 'Hausa' },
  { id: 'yoruba', label: 'Yoruba', native: 'Yorùbá' },
  { id: 'igbo', label: 'Igbo', native: 'Igbo' },
]

const TOTAL_STEPS = 5

export default function OnboardingForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    state: '',
    lga: '',
    soilType: '',
    crop: '',
    farmSize: '',
    fertilizerType: '',
    fertilizerFrequency: '',
    language: '',
  })

  const update = (field, value) => setData({ ...data, [field]: value })

  const canProceed = () => {
    if (step === 0) return data.state && data.lga
    if (step === 1) return data.soilType
    if (step === 2) return data.crop && data.farmSize && Number(data.farmSize) > 0
    if (step === 3) return data.fertilizerType && data.fertilizerFrequency
    if (step === 4) return data.language
    return false
  }

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1)
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
    <div className="page-bg calm">
      <Background />
      <div className="page-content">
        {/* Nav */}
        <div className="px-6 md:px-10 pt-5 pb-3 flex items-center justify-between">
          <button
            onClick={back}
            className="flex items-center gap-2 text-earth hover:text-forest transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  s === step ? 'w-8 bg-forest' : s < step ? 'w-5 bg-forest/50' : 'w-5 bg-earth/20'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-earth/70 font-mono">{step + 1} / {TOTAL_STEPS}</div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-start md:items-center justify-center px-6 pt-8 pb-12">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {/* STEP 1: LOCATION */}
              {step === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/25 mb-6">
                    <MapPin className="w-3 h-3 text-forest" />
                    <span className="text-xs text-forest font-semibold">Step 1 · Your Location</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-earth mb-3">
                    Where is your farm?
                  </h2>
                  <p className="text-earth/75 mb-10">
                    We use this to fetch soil data, weather forecast, and nearest market prices.
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-earth mb-2">State</label>
                      <select
                        value={data.state}
                        onChange={(e) => update('state', e.target.value)}
                        className="w-full bg-white border border-border rounded-xl py-3.5 px-4 text-earth focus:outline-none focus:border-forest transition-colors cursor-pointer"
                      >
                        <option value="">Choose your state</option>
                        {STATES.sort().map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth mb-2">Local Government Area (LGA)</label>
                      <input
                        type="text"
                        value={data.lga}
                        onChange={(e) => update('lga', e.target.value)}
                        placeholder="e.g. Birnin Kebbi"
                        className="w-full bg-white border border-border rounded-xl py-3.5 px-4 text-earth placeholder:text-earth/40 focus:outline-none focus:border-forest transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SOIL TYPE */}
              {step === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/25 mb-6">
                    <Layers className="w-3 h-3 text-forest" />
                    <span className="text-xs text-forest font-semibold">Step 2 · Your Soil</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-earth mb-3">
                    What is your soil like?
                  </h2>
                  <p className="text-earth/75 mb-8">
                    Pick the closest match. If you do not know, choose Not sure and we will analyze it.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SOIL_TYPES.map((s) => (
                      <motion.button
                        key={s.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => update('soilType', s.id)}
                        className={`text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                          data.soilType === s.id ? 'bg-forest/10 border-forest' : 'bg-white border-border hover:border-forest/40'
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-lg shrink-0 border border-earth/10"
                          style={{ backgroundColor: s.swatch }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm ${
                            data.soilType === s.id ? 'text-forest' : 'text-earth'
                          }`}>{s.label}</div>
                          <div className="text-xs text-earth/70">{s.desc}</div>
                        </div>
                        {data.soilType === s.id && (
                          <Check className="w-4 h-4 text-forest shrink-0" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: CROP + FARM SIZE */}
              {step === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/25 mb-6">
                    <Sprout className="w-3 h-3 text-forest" />
                    <span className="text-xs text-forest font-semibold">Step 3 · Your Crop</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-earth mb-3">
                    What are you growing?
                  </h2>
                  <p className="text-earth/75 mb-8">
                    Pick your main crop. We will tailor every recommendation to it.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {CROPS.map((c) => (
                      <motion.button
                        key={c.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => update('crop', c.id)}
                        className={`p-4 rounded-xl border transition-all text-center ${
                          data.crop === c.id ? 'bg-forest/10 border-forest' : 'bg-white border-border hover:border-forest/40'
                        }`}
                      >
                        <div className="text-2xl mb-1">{c.emoji}</div>
                        <div className={`text-sm font-medium ${data.crop === c.id ? 'text-forest' : 'text-earth'}`}>{c.label}</div>
                      </motion.button>
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
                        className="w-full bg-white border border-border rounded-xl py-3.5 px-4 pr-24 text-earth font-mono text-lg placeholder:text-earth/40 focus:outline-none focus:border-forest transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-earth/60 text-sm">hectares</span>
                    </div>
                    {data.farmSize && Number(data.farmSize) > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-xs text-earth/70"
                      >
                        ≈ {(Number(data.farmSize) * 2.47).toFixed(1)} acres
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: FERTILIZER PRACTICES */}
              {step === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/25 mb-6">
                    <Beaker className="w-3 h-3 text-forest" />
                    <span className="text-xs text-forest font-semibold">Step 4 · Your Practices</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-earth mb-3">
                    How do you fertilize?
                  </h2>
                  <p className="text-earth/75 mb-8">
                    This helps us tailor input recommendations and yield estimates.
                  </p>

                  <div className="mb-8">
                    <label className="block text-sm font-medium text-earth mb-3">
                      <Beaker className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                      Type of fertilizer
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {FERTILIZER_TYPES.map((f) => (
                        <motion.button
                          key={f.id}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => update('fertilizerType', f.id)}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            data.fertilizerType === f.id ? 'bg-forest/10 border-forest' : 'bg-white border-border hover:border-forest/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={`font-semibold text-sm ${
                                data.fertilizerType === f.id ? 'text-forest' : 'text-earth'
                              }`}>{f.label}</div>
                              <div className="text-xs text-earth/70">{f.desc}</div>
                            </div>
                            {data.fertilizerType === f.id && (
                              <Check className="w-4 h-4 text-forest shrink-0" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth mb-3">
                      <Calendar className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                      How often do you apply it?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {FERTILIZER_FREQUENCY.map((f) => (
                        <motion.button
                          key={f.id}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => update('fertilizerFrequency', f.id)}
                          className={`text-center p-3 rounded-xl border transition-all ${
                            data.fertilizerFrequency === f.id ? 'bg-forest/10 border-forest' : 'bg-white border-border hover:border-forest/40'
                          }`}
                        >
                          <div className={`font-semibold text-sm ${
                            data.fertilizerFrequency === f.id ? 'text-forest' : 'text-earth'
                          }`}>{f.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: LANGUAGE */}
              {step === 4 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/25 mb-6">
                    <Globe className="w-3 h-3 text-forest" />
                    <span className="text-xs text-forest font-semibold">Step 5 · Your Language</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-earth mb-3">
                    Pick your language.
                  </h2>
                  <p className="text-earth/75 mb-8">
                    Your farm plan will be delivered in this language.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {LANGUAGES.map((l) => (
                      <motion.button
                        key={l.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => update('language', l.id)}
                        className={`text-left p-5 rounded-xl border transition-all ${
                          data.language === l.id ? 'bg-forest/10 border-forest' : 'bg-white border-border hover:border-forest/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-display font-semibold text-lg ${data.language === l.id ? 'text-forest' : 'text-earth'}`}>{l.label}</div>
                            <div className="text-sm text-earth/70">{l.native}</div>
                          </div>
                          {data.language === l.id && (
                            <div className="w-6 h-6 rounded-full bg-forest flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12"
            >
              <button
                onClick={next}
                disabled={!canProceed()}
                className={`w-full flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold transition-all ${
                  canProceed() ? 'bg-forest text-white hover:bg-forest-dark' : 'bg-earth/20 text-earth/40 cursor-not-allowed'
                }`}
              >
                {step === TOTAL_STEPS - 1 ? 'Generate my farm plan' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}