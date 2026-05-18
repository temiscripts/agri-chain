import { motion, useInView } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight, Sprout, MapPin, CloudRain, TrendingUp, Wallet, Bug,
  Check, Leaf, Shield, Globe, Zap
} from 'lucide-react'
import Background from './Background'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="page-bg">
      <Background />
      <div className="page-content">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-10 pt-5 pb-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-forest">AgriChain</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs text-earth/70 font-mono"
          >
            v0.1 · BETA
          </motion.div>
        </nav>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative leaf-glow py-16 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/25 mb-8"
          >
            <Leaf className="w-3 h-3 text-forest" />
            <span className="text-xs text-forest font-semibold">AI Farm Advisor. Built for Nigerian Smallholders</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-[1.05] text-earth"
          >
            From guesswork{' '}
            <span className="text-forest">to a clear plan.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg md:text-xl text-earth/80 max-w-2xl mb-10"
          >
            Tell us your location, crop and farm size. Five AI agents work in parallel,
            covering soil, weather, markets, finance and pest control, then deliver a
            personalized weekly plan straight to your WhatsApp.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/onboarding')}
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-forest text-white font-semibold rounded-full hover:bg-forest-dark transition-colors shadow-lg"
          >
            Get my farm plan
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full"
          >
            {[
              { value: '36M+', label: 'Nigerian smallholder farmers' },
              { value: '40%', label: 'Average post-harvest loss' },
              { value: '5 agents', label: 'Working in parallel for you' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-2xl md:text-3xl font-bold text-forest mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-earth/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-16 text-xs text-earth/60 font-mono tracking-wider"
          >
            ↓ SEE THE AGENTS WORK
          </motion.div>
        </div>

        {/* Demo section */}
        <DemoSection />

        {/* Sample profiles */}
        <SampleProfiles />

        {/* Footer */}
        <div className="flex items-center justify-center gap-6 py-10 text-xs text-earth/70">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            Hausa · Yoruba · Igbo · English
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            Free for farmers, forever
          </div>
        </div>
      </div>
    </div>
  )
}

// ── DEMO ────────────────────────────────────────────────────────
const AGENTS = [
  { id: 'soil', name: 'Soil & Crop Agent', icon: Sprout, task: 'Checking soil composition', result: 'pH 6.2, loamy, good for rice', duration: 2200 },
  { id: 'weather', name: 'Weather Agent', icon: CloudRain, task: 'Fetching 7 day forecast', result: 'Light rains Tue to Thu. Plant Wednesday', duration: 1600 },
  { id: 'market', name: 'Market Price Agent', icon: TrendingUp, task: 'Querying nearest markets', result: 'Kano paying ₦42K per bag. +18% vs last month', duration: 2800 },
  { id: 'finance', name: 'Finance Agent', icon: Wallet, task: 'Matching loan programmes', result: 'Eligible for BOA smallholder loan up to ₦500K', duration: 2000 },
  { id: 'pest', name: 'Pest & Disease Agent', icon: Bug, task: 'Scanning for crop threats', result: 'Blast disease risk high. Apply tricyclazole', duration: 2400 },
]

function DemoSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="px-6 py-20 max-w-6xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-harvest/20 border border-harvest/40 mb-4">
          <span className="text-xs text-earth font-semibold">⚡ Live multi-agent demo</span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-earth">
          One farmer. Five agents.
        </h2>
        <p className="text-earth/75 max-w-xl mx-auto">
          Watch a real input dispatch five specialized agents in parallel,
          then synthesize their findings into one clear plan.
        </p>
      </motion.div>

      <DemoCanvas inView={inView} />
    </section>
  )
}

function DemoCanvas({ inView }) {
  const [stage, setStage] = useState('idle')
  const [completed, setCompleted] = useState([])

  useEffect(() => {
    if (!inView) return
    let cancelled = false
    const run = async () => {
      await wait(700); if (cancelled) return
      setStage('dispatching')
      await wait(600); if (cancelled) return
      setStage('working')
      AGENTS.forEach((a) => setTimeout(() => {
        if (!cancelled) setCompleted((p) => [...p, a.id])
      }, a.duration))
      const longest = Math.max(...AGENTS.map((a) => a.duration))
      await wait(longest + 800); if (cancelled) return
      setStage('done')
    }
    run()
    return () => { cancelled = true }
  }, [inView])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-forest/5 blur-3xl rounded-3xl" />
      <div className="relative bg-white/95 border border-border rounded-2xl card-elevated overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-seedling/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-forest flex items-center justify-center">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <div className="font-display font-semibold text-sm text-earth">Orchestrator</div>
            <span className="text-xs text-slate ml-2">·</span>
            <span className="text-xs text-slate">demo</span>
          </div>
          <div className="text-xs text-slate font-mono">
            {stage === 'idle' && 'waiting'}
            {stage === 'dispatching' && 'dispatching agents...'}
            {stage === 'working' && `${completed.length}/5 complete`}
            {stage === 'done' && '✓ synthesis ready'}
          </div>
        </div>

        <div className="px-6 py-5 border-b border-border">
          <div className="text-xs text-slate mb-2 font-mono">FARMER INPUT</div>
          <div className="flex flex-wrap items-center gap-3">
            <InputPill icon={MapPin} text="Kebbi, Nigeria" />
            <InputPill icon={Sprout} text="Rice" />
            <InputPill icon={Leaf} text="2 hectares" />
            <InputPill icon={Globe} text="Hausa" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6 bg-cream/40">
          {AGENTS.map((agent, i) => (
            <DemoAgentCard
              key={agent.id}
              agent={agent}
              index={i}
              stage={stage}
              completed={completed.includes(agent.id)}
              inView={inView}
            />
          ))}
        </div>

        {stage === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-6 py-6 border-t border-border bg-seedling/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-forest flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="font-display font-semibold text-sm text-forest">Weekly Farm Plan. In Hausa</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-border">
              <PlanLine label="🌱 Wannan mako" text="Shuka shinkafa Laraba. Ƙasarka tana da kyau (pH 6.2)." />
              <PlanLine label="🌧️ Yanayi" text="Ruwan sama mai sauƙi Talata zuwa Alhamis. Babu hadarin ambaliyar ruwa." />
              <PlanLine label="💰 Kasuwa" text="Sayar a Kano cikin makonni 3. ₦42,000 a kowace buhu (+18%)." />
              <PlanLine label="🏦 Kuɗi" text="Kana da haƙƙin samun rancen BOA har ₦500,000." />
              <PlanLine label="🐛 Kwari" text="Hadarin cuta mai tsanani. Yi amfani da maganin tricyclazole." />
              <div className="mt-3 pt-3 border-t border-border text-xs text-slate flex items-center gap-1.5">
                <Check className="w-3 h-3 text-forest" /> Sent to WhatsApp. +234 ••• ••• 4421
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function DemoAgentCard({ agent, index, stage, completed, inView }) {
  const Icon = agent.icon
  const isWorking = stage === 'working' && !completed
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
      className={`relative rounded-xl border bg-white p-4 transition-all ${completed ? 'border-forest/40' : 'border-border'}`}
    >
      {isWorking && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: agent.duration / 1000, ease: 'easeInOut' }}
          className="absolute top-0 left-0 h-0.5 bg-harvest rounded-t-xl"
        />
      )}
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          completed ? 'bg-forest text-white' : isWorking ? 'bg-harvest/15 text-harvest' : 'bg-seedling text-forest'
        }`}>
          {completed ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-earth mb-0.5">{agent.name}</div>
          <div className="text-xs text-slate">
            {stage === 'idle' && 'standing by'}
            {(stage === 'dispatching' || isWorking) && (
              <span className="inline-flex items-center gap-1.5">
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-harvest animate-pulse" />
                  <span className="w-1 h-1 rounded-full bg-harvest animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 rounded-full bg-harvest animate-pulse" style={{ animationDelay: '300ms' }} />
                </span>
                {agent.task}
              </span>
            )}
            {completed && <span className="text-forest font-medium">{agent.result}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function InputPill({ icon: Icon, text }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-seedling border border-forest/15">
      <Icon className="w-3 h-3 text-forest" />
      <span className="text-xs font-medium text-forest">{text}</span>
    </div>
  )
}

function PlanLine({ label, text }) {
  return (
    <div className="py-1.5">
      <div className="text-xs font-semibold text-forest mb-0.5">{label}</div>
      <div className="text-sm text-earth">{text}</div>
    </div>
  )
}

// ── SAMPLE PROFILES ──────────────────────────────────────────────

const SAMPLE_PROFILES = [
  {
    name: 'Chukwuemeka',
    emoji: '🌾',
    role: 'Rice farmer',
    location: 'Kebbi. Birnin Kebbi',
    farmSize: '2 hectares',
    language: 'Hausa',
    profile: {
      name: 'Chukwuemeka',
      phoneNumber: '08012345678',
      state: 'Kebbi',
      lga: 'Birnin Kebbi',
      soilType: 'alluvial',
      crop: 'rice',
      farmSize: '2',
      fertilizerType: 'both',
      fertilizerFrequency: 'twice',
      language: 'hausa',
    },
  },
  {
    name: 'Adaeze',
    emoji: '🍅',
    role: 'Tomato farmer',
    location: 'Plateau. Jos North',
    farmSize: '1.5 hectares',
    language: 'Igbo',
    profile: {
      name: 'Adaeze',
      phoneNumber: '08023456789',
      state: 'Plateau',
      lga: 'Jos North',
      soilType: 'loamy',
      crop: 'tomato',
      farmSize: '1.5',
      fertilizerType: 'natural',
      fertilizerFrequency: 'multiple',
      language: 'igbo',
    },
  },
  {
    name: 'Bashir',
    emoji: '🌽',
    role: 'Maize farmer',
    location: 'Oyo. Ibadan North',
    farmSize: '3 hectares',
    language: 'Yoruba',
    profile: {
      name: 'Bashir',
      phoneNumber: '08034567890',
      state: 'Oyo',
      lga: 'Ibadan North',
      soilType: 'sandy',
      crop: 'maize',
      farmSize: '3',
      fertilizerType: 'artificial',
      fertilizerFrequency: 'once',
      language: 'yoruba',
    },
  },
]

function SampleProfiles() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const navigate = useNavigate()

  const handleSelect = (profile) => {
    sessionStorage.setItem('farmerProfile', JSON.stringify(profile))
    navigate('/results')
  }

  return (
    <section ref={ref} className="px-6 py-20 max-w-6xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/25 mb-4">
          <Zap className="w-3 h-3 text-forest" />
          <span className="text-xs text-forest font-semibold">Try a sample farmer</span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-earth">
          Skip the form. Pick a farmer.
        </h2>
        <p className="text-earth/75 max-w-xl mx-auto">
          See AgriChain in action with three real Nigerian farmer profiles.
          Tap any card to dispatch the agents instantly.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SAMPLE_PROFILES.map((p, i) => (
          <motion.button
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(p.profile)}
            className="text-left bg-white/95 border border-border rounded-2xl p-5 card-elevated hover:border-forest/40 transition-colors group"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="text-4xl">{p.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-earth text-lg">{p.name}</div>
                <div className="text-xs text-forest font-medium">{p.role}</div>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <Detail icon={MapPin} text={p.location} />
              <Detail icon={Leaf} text={p.farmSize} />
              <Detail icon={Globe} text={p.language} />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xs text-earth/60 font-mono">SAMPLE PROFILE</span>
              <div className="inline-flex items-center gap-1 text-sm font-semibold text-forest group-hover:gap-2 transition-all">
                Try it
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
        className="text-center mt-8 text-xs text-earth/60"
      >
        Or fill in your own details using the Get Started button at the top.
      </motion.div>
    </section>
  )
}

function Detail({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-earth/80">
      <Icon className="w-3.5 h-3.5 text-forest shrink-0" />
      <span>{text}</span>
    </div>
  )
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)) }