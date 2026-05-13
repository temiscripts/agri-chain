import { motion, useInView } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight, Leaf, MessageCircle, Sprout,
  CloudRain, TrendingUp, Wallet, Check, Loader2
} from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="field-bg min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center shadow-soft">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-lg text-earth leading-none">AgriChain</div>
            <div className="text-[10px] text-slate font-mono tracking-wider mt-0.5">AGENT · BETA</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-seedling text-forest text-xs font-medium"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
          4 agents online
        </motion.div>
      </nav>

      {/* Hero */}
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-soft border border-gold/30 mb-8"
        >
          <Sprout className="w-3 h-3 text-gold" />
          <span className="text-xs text-earth font-semibold">AI Farm Advisor · For Nigerian Farmers</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl font-bold mb-6 max-w-4xl leading-[1.05] text-earth"
        >
          Your farm,{' '}
          <span className="text-forest">guided by intelligence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-lg md:text-xl text-slate max-w-2xl mb-10 leading-relaxed"
        >
          Four AI agents working together — analyzing your soil, watching the weather,
          tracking markets, and matching loans. Delivered to your WhatsApp, in your language.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/onboarding')}
          className="group inline-flex items-center gap-2 px-7 py-3.5 bg-forest text-white font-semibold rounded-full hover:bg-forest-deep transition-colors shadow-soft"
        >
          Get my farm plan
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-20 grid grid-cols-3 gap-6 md:gap-12 max-w-3xl w-full"
        >
          {[
            { value: '36M', label: 'Nigerian smallholder farmers' },
            { value: '40%', label: 'Average post-harvest losses' },
            { value: '4', label: 'Agents working for you' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
              className="text-center"
            >
              <div className="font-mono text-3xl md:text-4xl font-bold text-forest mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-slate leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-16 text-xs text-slate font-mono tracking-wider"
        >
          ↓ WATCH THE AGENTS WORK
        </motion.div>
      </div>

      {/* DEMO */}
      <AgentDemo />

      {/* Footer */}
      <div className="flex items-center justify-center gap-6 py-10 text-xs text-slate border-t border-line mt-12">
        <div className="flex items-center gap-1.5">
          <MessageCircle className="w-3 h-3 text-forest" />
          WhatsApp delivery
        </div>
        <div>·</div>
        <div className="flex items-center gap-1.5">
          <Leaf className="w-3 h-3 text-forest" />
          Built for Nigerian soil
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// LIVE AGENT DEMO
// ─────────────────────────────────────────────

const AGENTS = [
  {
    id: 'soil',
    name: 'Soil & Crop Agent',
    icon: Sprout,
    source: 'iSDAsoil API',
    color: '#1A6B3C',
    bg: '#E8F5E9',
    progress: 1800,
    result: {
      headline: 'Sandy loam · pH 6.4',
      lines: ['Nitrogen: Medium', 'Rice compatibility: Excellent'],
    },
  },
  {
    id: 'weather',
    name: 'Weather Agent',
    icon: CloudRain,
    source: 'NASA POWER + Open-Meteo',
    color: '#0277BD',
    bg: '#E1F5FE',
    progress: 2200,
    result: {
      headline: 'Rains stable · next 7 days',
      lines: ['Plant: Tue–Thu', 'No flood risk detected'],
    },
  },
  {
    id: 'market',
    name: 'Market Price Agent',
    icon: TrendingUp,
    source: 'WFP + AFEX data',
    color: '#F5A623',
    bg: '#FEF3D7',
    progress: 2600,
    result: {
      headline: 'Rice ₦52,000 / bag in Lagos',
      lines: ['+18% vs Kebbi spot price', 'Sell window: late June'],
    },
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    icon: Wallet,
    source: 'BoA + ADF schemes',
    color: '#6A1B9A',
    bg: '#F3E5F5',
    progress: 3000,
    result: {
      headline: '2 loan programmes available',
      lines: ['BoA Smallholder: Eligible', 'Apply via cooperative'],
    },
  },
]

function AgentDemo() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 mb-4">
          <span className="text-xs text-forest font-semibold">🌱 Watch live</span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-earth">
          Four agents. Working in parallel.
        </h2>
        <p className="text-slate max-w-xl mx-auto">
          Submit a farmer profile. Watch all four agents dispatch instantly,
          query real data sources, and synthesize one clear plan.
        </p>
      </motion.div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white border border-line rounded-2xl p-5 md:p-6 shadow-soft max-w-3xl mx-auto mb-10"
      >
        <div className="flex flex-wrap items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-seedling flex items-center justify-center text-lg">👨🏾‍🌾</div>
            <div>
              <div className="font-semibold text-earth">Chukwuemeka</div>
              <div className="text-xs text-slate">Smallholder farmer</div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <ProfileItem label="Location" value="Kebbi" />
            <ProfileItem label="Crop" value="Rice" />
            <ProfileItem label="Farm size" value="2 ha" />
            <ProfileItem label="Language" value="Hausa" />
          </div>
        </div>
      </motion.div>

      {/* Agents grid */}
      <AgentGrid inView={inView} />

      {/* Final WhatsApp plan */}
      <FinalPlan inView={inView} />
    </section>
  )
}

function ProfileItem({ label, value }) {
  return (
    <div>
      <div className="text-slate text-[10px] uppercase tracking-wider mb-0.5">{label}</div>
      <div className="font-medium text-earth">{value}</div>
    </div>
  )
}

function AgentGrid({ inView }) {
  const [states, setStates] = useState(AGENTS.map(() => 'idle'))

  useEffect(() => {
    if (!inView) return
    const timers = []

    // All agents dispatch at the same moment — THE parallel moment
    timers.push(setTimeout(() => {
      setStates(AGENTS.map(() => 'working'))
    }, 600))

    // Each agent completes at its own pace
    AGENTS.forEach((agent, i) => {
      timers.push(setTimeout(() => {
        setStates((prev) => {
          const next = [...prev]
          next[i] = 'done'
          return next
        })
      }, 600 + agent.progress))
    })

    return () => timers.forEach(clearTimeout)
  }, [inView])

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-10">
      {AGENTS.map((agent, i) => (
        <AgentCard key={agent.id} agent={agent} state={states[i]} index={i} inView={inView} />
      ))}
    </div>
  )
}

function AgentCard({ agent, state, index, inView }) {
  const Icon = agent.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
      className={`bg-white border rounded-2xl p-5 transition-all duration-500 ${
        state === 'done' ? 'border-line shadow-soft' :
        state === 'working' ? 'border-forest/40 shadow-soft-lg' :
        'border-line'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: agent.bg }}
        >
          <Icon className="w-5 h-5" style={{ color: agent.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-earth text-sm">{agent.name}</div>
          <div className="text-xs text-slate font-mono">{agent.source}</div>
        </div>
        <StatusBadge state={state} />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-line rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: '0%' }}
          animate={{
            width: state === 'idle' ? '0%' : state === 'working' ? '70%' : '100%',
          }}
          transition={{
            duration: state === 'working' ? agent.progress / 1000 : 0.4,
            ease: 'easeInOut',
          }}
          className="h-full rounded-full"
          style={{ background: agent.color }}
        />
      </div>

      {/* Result */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: state === 'done' ? 1 : 0,
          height: state === 'done' ? 'auto' : 0,
        }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden"
      >
        <div className="pt-2 border-t border-line">
          <div className="font-semibold text-earth text-sm mb-1.5">{agent.result.headline}</div>
          {agent.result.lines.map((line, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-slate">
              <div className="w-1 h-1 rounded-full" style={{ background: agent.color }} />
              {line}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function StatusBadge({ state }) {
  if (state === 'idle') {
    return (
      <div className="text-[10px] text-slate font-mono uppercase tracking-wider">Idle</div>
    )
  }
  if (state === 'working') {
    return (
      <div className="flex items-center gap-1 text-[10px] text-forest font-mono uppercase tracking-wider">
        <Loader2 className="w-3 h-3 animate-spin" />
        Working
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 text-[10px] text-forest font-mono uppercase tracking-wider">
      <Check className="w-3 h-3" />
      Done
    </div>
  )
}

function FinalPlan({ inView }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!inView) return
    // Show after the slowest agent (3.6s) finishes
    const t = setTimeout(() => setShow(true), 4200)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 text-xs text-slate font-mono uppercase tracking-wider">
          <div className="w-8 h-px bg-line" />
          Synthesized & sent
          <div className="w-8 h-px bg-line" />
        </div>
      </div>

      {/* WhatsApp mockup */}
      <div className="bg-[#ECE5DD] rounded-2xl p-4 shadow-soft-lg">
        <div className="bg-[#075E54] text-white rounded-t-lg px-4 py-3 -m-4 mb-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">AgriChain Agent</div>
            <div className="text-[10px] opacity-80">online</div>
          </div>
        </div>

        <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm text-sm text-earth leading-relaxed">
          <div className="font-semibold mb-2 text-forest">🌾 Sannu Chukwuemeka!</div>
          <div className="mb-3 text-slate text-xs">Wannan ne shirin gonarka na wannan makon:</div>

          <div className="space-y-2">
            <PlanLine icon="🌱" label="Shuka" value="Talata zuwa Alhamis" />
            <PlanLine icon="💧" label="Yanayi" value="Ruwa zai zo, babu ambaliya" />
            <PlanLine icon="💰" label="Sayarwa" value="Lagos ₦52,000 — jira ƙarshen Yuni" />
            <PlanLine icon="🏦" label="Lamuni" value="BoA Smallholder — Kuna cancanta" />
          </div>

          <div className="mt-3 pt-3 border-t border-line text-[10px] text-slate text-right">
            12:04 PM ✓✓
          </div>
        </div>
      </div>

      <div className="text-center mt-4 text-xs text-slate">
        Generated in <span className="font-mono text-forest font-semibold">3.6s</span> ·
        Delivered to <span className="font-mono text-forest font-semibold">+234 ••• ••82</span>
      </div>
    </motion.div>
  )
}

function PlanLine({ icon, label, value }) {
  return (
    <div className="flex gap-2 text-xs">
      <span>{icon}</span>
      <span className="font-semibold text-earth">{label}:</span>
      <span className="text-slate flex-1">{value}</span>
    </div>
  )
}