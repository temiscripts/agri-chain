import { motion, useInView } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import Background from './Background'
import {
  ArrowRight, Sprout, MapPin, CloudRain, TrendingUp, Wallet,
  Check, Leaf, Shield, Globe
} from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <Background variant="default">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-10 pt-5 pb-4">
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
          className="text-xs text-slate font-mono"
        >
          v0.1 · BETA
        </motion.div>
      </nav>

      {/* Hero */}
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center relative leaf-glow">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/8 border border-forest/15 mb-8 relative z-10"
        >
          <Leaf className="w-3 h-3 text-forest" />
          <span className="text-xs text-forest font-semibold">AI Farm Advisor · Built for Nigerian Smallholders</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-[1.05] text-earth relative z-10"
        >
          From guesswork{' '}
          <span className="text-forest">to a clear plan.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-lg md:text-xl text-slate max-w-2xl mb-10 relative z-10"
        >
          Tell us your location, crop and farm size. Four AI agents work in parallel —
          soil, weather, markets, finance — and deliver a personalized weekly plan
          straight to your WhatsApp.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/onboarding')}
          className="group inline-flex items-center gap-2 px-7 py-3.5 bg-forest text-white font-semibold rounded-full hover:bg-forest-dark transition-colors relative z-10"
        >
          Get my farm plan
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-2xl w-full relative z-10"
        >
          {[
            { value: '36M+', label: 'Nigerian smallholder farmers' },
            { value: '40%', label: 'Average post-harvest loss' },
            { value: '4 agents', label: 'Working in parallel for you' },
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
              <div className="text-xs text-slate">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-16 text-xs text-slate font-mono tracking-wider relative z-10"
        >
          ↓ SEE THE AGENTS WORK
        </motion.div>
      </div>

      {/* DEMO SECTION — 4 agents in parallel */}
      <DemoSection />

      {/* Footer */}
      <div className="flex items-center justify-center gap-6 py-10 text-xs text-slate">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3 h-3" />
          Hausa · Yoruba · Igbo · English
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          Free for farmers, forever
        </div>
      </div>
      </Background>
  )
}

// ─────────────────────────────────────────────
// DEMO — 4 AGENTS WORKING IN PARALLEL
// ─────────────────────────────────────────────

const AGENTS = [
  {
    id: 'soil',
    name: 'Soil & Crop Agent',
    icon: Sprout,
    task: 'Checking soil composition',
    result: 'pH 6.2 · loamy · good for rice',
    duration: 2200,
  },
  {
    id: 'weather',
    name: 'Weather Agent',
    icon: CloudRain,
    task: 'Fetching 7-day forecast',
    result: 'Light rains Tue–Thu · plant Wednesday',
    duration: 1600,
  },
  {
    id: 'market',
    name: 'Market Price Agent',
    icon: TrendingUp,
    task: 'Querying nearest markets',
    result: 'Kano paying ₦42K/bag · +18% vs last month',
    duration: 2800,
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    icon: Wallet,
    task: 'Matching loan programmes',
    result: 'Eligible for BOA smallholder loan up to ₦500K',
    duration: 2000,
  },
]

function DemoSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="px-6 py-24 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-harvest/15 border border-harvest/30 mb-4">
          <span className="text-xs text-harvest font-semibold">⚡ Live multi-agent demo</span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-earth">
          One farmer. Four agents.
        </h2>
        <p className="text-slate max-w-xl mx-auto">
          Watch a real input dispatch four specialized agents in parallel —
          then synthesize their findings into one clear plan.
        </p>
      </motion.div>

      <DemoCanvas inView={inView} />
    </section>
  )
}

function DemoCanvas({ inView }) {
  const [stage, setStage] = useState('idle') // idle → dispatching → working → done
  const [completedAgents, setCompletedAgents] = useState([])

  useEffect(() => {
    if (!inView) return
    let cancelled = false

    const run = async () => {
      // Show input briefly
      await wait(700)
      if (cancelled) return
      setStage('dispatching')

      // Dispatch all 4 in parallel
      await wait(600)
      if (cancelled) return
      setStage('working')

      // Each agent completes independently based on its duration
      AGENTS.forEach((agent) => {
        setTimeout(() => {
          if (cancelled) return
          setCompletedAgents((prev) => [...prev, agent.id])
        }, agent.duration)
      })

      // Wait for slowest agent then synthesize
      const longest = Math.max(...AGENTS.map((a) => a.duration))
      await wait(longest + 800)
      if (cancelled) return
      setStage('done')
    }

    run()
    return () => { cancelled = true }
  }, [inView])

  return (
    <div className="relative">
      {/* Soft glow behind */}
      <div className="absolute inset-0 bg-forest/5 blur-3xl rounded-3xl" />

      <div className="relative bg-white border border-border rounded-2xl card-elevated overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-seedling/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-forest flex items-center justify-center">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <div className="font-display font-semibold text-sm text-earth">
              Orchestrator
            </div>
            <span className="text-xs text-slate ml-2">·</span>
            <span className="text-xs text-slate">demo</span>
          </div>
          <div className="text-xs text-slate font-mono">
            {stage === 'idle' && 'waiting'}
            {stage === 'dispatching' && 'dispatching agents...'}
            {stage === 'working' && `${completedAgents.length}/4 complete`}
            {stage === 'done' && '✓ synthesis ready'}
          </div>
        </div>

        {/* Farmer input card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="px-6 py-5 border-b border-border"
        >
          <div className="text-xs text-slate mb-2 font-mono">FARMER INPUT</div>
          <div className="flex flex-wrap items-center gap-3">
            <InputPill icon={MapPin} text="Kebbi, Nigeria" />
            <InputPill icon={Sprout} text="Rice" />
            <InputPill icon={Leaf} text="2 hectares" />
            <InputPill icon={Globe} text="Hausa" />
          </div>
        </motion.div>

        {/* 4 agents grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6 bg-cream/40">
          {AGENTS.map((agent, i) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              index={i}
              stage={stage}
              completed={completedAgents.includes(agent.id)}
              inView={inView}
            />
          ))}
        </div>

        {/* Synthesized output */}
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
              <div className="font-display font-semibold text-sm text-forest">
                Weekly Farm Plan · in Hausa
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-border">
              <PlanLine label="🌱 Wannan mako" text="Shuka shinkafa Laraba — ƙasarka tana da kyau (pH 6.2)." />
              <PlanLine label="🌧️ Yanayi" text="Ruwan sama mai sauƙi Talata zuwa Alhamis. Babu hadarin ambaliyar ruwa." />
              <PlanLine label="💰 Kasuwa" text="Sayar a Kano cikin makonni 3. ₦42,000/buhu yanzu (+18%)." />
              <PlanLine label="🏦 Kuɗi" text="Kana da haƙƙin samun rancen BOA har ₦500,000. Ka nemi reshen Birnin Kebbi." />
              <div className="mt-3 pt-3 border-t border-border text-xs text-slate flex items-center gap-1.5">
                <Check className="w-3 h-3 text-forest" />
                Sent to WhatsApp · +234 ••• ••• 4421
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function AgentCard({ agent, index, stage, completed, inView }) {
  const Icon = agent.icon
  const isWorking = stage === 'working' && !completed
  const isDispatching = stage === 'dispatching'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
      className={`relative rounded-xl border bg-white p-4 transition-all ${
        completed ? 'border-forest/40' : 'border-border'
      }`}
    >
      {/* Working indicator bar */}
      {isWorking && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: agent.duration / 1000, ease: 'easeInOut' }}
          className="absolute top-0 left-0 h-0.5 bg-harvest rounded-t-xl"
        />
      )}

      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          completed ? 'bg-forest text-white' : isWorking ? 'bg-harvest/15 text-harvest' : 'bg-seedling text-forest'
        }`}>
          {completed ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-earth mb-0.5">{agent.name}</div>
          <div className="text-xs text-slate">
            {stage === 'idle' && 'standing by'}
            {(isDispatching || isWorking) && (
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
            {stage === 'done' && !completed && <span className="text-forest font-medium">{agent.result}</span>}
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

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms))
}