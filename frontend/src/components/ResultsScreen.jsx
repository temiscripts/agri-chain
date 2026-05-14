import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Background from './Background' 
import { useNavigate } from 'react-router-dom'
import {
  Sprout, CloudRain, TrendingUp, Wallet, Check, ArrowLeft,
  MapPin, Leaf, Globe, MessageCircle, Copy, Sparkles,
  Loader2, AlertCircle, Calendar
} from 'lucide-react'

// ── MOCK DATA (replace with real API later) ─────────────────────
const MOCK_AGENTS = [
  {
    id: 'soil',
    name: 'Soil & Crop Agent',
    icon: Sprout,
    color: 'forest',
    task: 'Analyzing soil composition',
    duration: 2400,
    result: {
      title: 'Healthy loamy soil',
      details: [
        { label: 'pH level', value: '6.2 (optimal)' },
        { label: 'Nitrogen', value: 'Medium to high' },
        { label: 'Texture', value: 'Loamy' },
        { label: 'Match for crop', value: '94% suitable' },
      ],
    },
  },
  {
    id: 'weather',
    name: 'Weather Agent',
    icon: CloudRain,
    color: 'sky',
    task: 'Fetching 7 day forecast',
    duration: 1800,
    result: {
      title: 'Favorable planting window',
      details: [
        { label: 'Next 7 days', value: 'Light rains Tue to Thu' },
        { label: 'Best plant day', value: 'Wednesday morning' },
        { label: 'Flood risk', value: 'Low' },
        { label: 'Drought risk', value: 'None this week' },
      ],
    },
  },
  {
    id: 'market',
    name: 'Market Price Agent',
    icon: TrendingUp,
    color: 'harvest',
    task: 'Scanning regional markets',
    duration: 3100,
    result: {
      title: 'Kano paying premium prices',
      details: [
        { label: 'Best market', value: 'Kano · 142km away' },
        { label: 'Current price', value: '₦42,000 per bag' },
        { label: 'Trend', value: '+18% vs last month' },
        { label: 'Best sell window', value: '3 to 5 weeks from now' },
      ],
    },
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    icon: Wallet,
    color: 'forest',
    task: 'Matching loan programmes',
    duration: 2200,
    result: {
      title: 'Eligible for 2 programmes',
      details: [
        { label: 'BOA Smallholder Loan', value: 'Up to ₦500,000' },
        { label: 'Interest rate', value: '9% annual' },
        { label: 'ADF Grant', value: 'Up to ₦150,000' },
        { label: 'Apply at', value: 'Birnin Kebbi branch' },
      ],
    },
  },
]

const FARM_PLAN = {
  english: [
    { emoji: '🌱', label: 'This week', text: 'Plant rice on Wednesday — your soil is excellent (pH 6.2, loamy).' },
    { emoji: '🌧️', label: 'Weather', text: 'Light rains Tuesday to Thursday. No flood risk. Ideal for germination.' },
    { emoji: '💰', label: 'Market', text: 'Sell in Kano in 3 to 5 weeks. Price is ₦42,000 per bag and rising (+18%).' },
    { emoji: '🏦', label: 'Finance', text: 'You qualify for BOA loan up to ₦500K. Apply at the Birnin Kebbi branch.' },
  ],
  hausa: [
    { emoji: '🌱', label: 'Wannan mako', text: 'Shuka shinkafa Laraba. Ƙasarka tana da kyau sosai (pH 6.2, mai laushi).' },
    { emoji: '🌧️', label: 'Yanayi', text: 'Ruwan sama mai sauƙi Talata zuwa Alhamis. Babu hadarin ambaliya.' },
    { emoji: '💰', label: 'Kasuwa', text: 'Sayar a Kano cikin makonni 3 zuwa 5. Farashin ₦42,000 a kowace buhu, yana ƙaruwa (+18%).' },
    { emoji: '🏦', label: 'Kuɗi', text: 'Kana da haƙƙin samun rancen BOA har ₦500,000. Ka nemi reshen Birnin Kebbi.' },
  ],
  yoruba: [
    { emoji: '🌱', label: 'Ọsẹ̀ yìí', text: 'Gbin ìrẹsì ní Ọjọ́rú. Erùpẹ̀ rẹ dára gan an (pH 6.2, ńláńlá).' },
    { emoji: '🌧️', label: 'Ojú ọjọ́', text: 'Òjò díẹ̀ láti Ọjọ́ Ìṣẹgun sí Ọjọ́bọ̀. Kò sí ewu omi.' },
    { emoji: '💰', label: 'Ọjà', text: 'Tà ní Kano láàrín ọsẹ̀ 3 sí 5. Iye owó jẹ́ ₦42,000 fún àpò kọ̀ọ̀kan.' },
    { emoji: '🏦', label: 'Owó', text: 'O lẹ̀tọ́ sí àwìn BOA tó tó ₦500,000. Lọ sí ẹ̀ka Birnin Kebbi.' },
  ],
  igbo: [
    { emoji: '🌱', label: 'Izu a', text: 'Kụọ osikapa na Wenezdee. Aja gị dị mma nke ukwuu (pH 6.2).' },
    { emoji: '🌧️', label: 'Ihu igwe', text: 'Mmiri ozuzo dị nro Tuzdee ruo Tọzdee. Enweghị ihe egwu idei mmiri.' },
    { emoji: '💰', label: 'Ahịa', text: 'Ree na Kano izu 3 ruo 5 site ugbu a. Ọnụahịa bụ ₦42,000 maka akpa.' },
    { emoji: '🏦', label: 'Ego', text: 'I ruru eru maka mbinye ego BOA ruo ₦500,000. Gaa Birnin Kebbi.' },
  ],
}

// ─────────────────────────────────────────────────────────────────

export default function ResultsScreen() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [stage, setStage] = useState('connecting') // connecting → dispatching → working → done
  const [completed, setCompleted] = useState([])
  const [activeAgent, setActiveAgent] = useState(null)

  // Load farmer profile from session
  useEffect(() => {
    const stored = sessionStorage.getItem('farmerProfile')
    if (!stored) {
      navigate('/onboarding')
      return
    }
    setProfile(JSON.parse(stored))
  }, [navigate])

  // Orchestrate the visual flow
  useEffect(() => {
    if (!profile) return
    let cancelled = false

    const run = async () => {
      await wait(900)
      if (cancelled) return
      setStage('dispatching')

      await wait(800)
      if (cancelled) return
      setStage('working')

      MOCK_AGENTS.forEach((agent) => {
        setTimeout(() => {
          if (cancelled) return
          setCompleted((prev) => [...prev, agent.id])
        }, agent.duration)
      })

      const longest = Math.max(...MOCK_AGENTS.map((a) => a.duration))
      await wait(longest + 1000)
      if (cancelled) return
      setStage('done')
    }

    run()
    return () => { cancelled = true }
  }, [profile])

  if (!profile) return null

  const lang = profile.language || 'english'
  const plan = FARM_PLAN[lang] || FARM_PLAN.english

  return (
    <div className={`page-bg ${stage === 'done' ? 'celebratory' : ''}`}>
      <Background />
      <div className="page-content">
        {/* Top nav */}
        <div className="px-6 md:px-10 pt-5 pb-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2 text-earth hover:text-forest transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-forest flex items-center justify-center">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-forest">AgriChain</span>
          </div>
          <div className="text-xs text-earth/70 font-mono">
            {stage === 'connecting' && 'init'}
            {stage === 'dispatching' && 'dispatching'}
            {stage === 'working' && `${completed.length}/4`}
            {stage === 'done' && '✓ ready'}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-16 w-full">
          {/* Profile summary banner */}
          <ProfileBanner profile={profile} />

          {/* Orchestrator status */}
          <OrchestratorStatus stage={stage} completed={completed.length} />

          {/* 4 agents grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {MOCK_AGENTS.map((agent, i) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                index={i}
                stage={stage}
                completed={completed.includes(agent.id)}
                onClick={() => setActiveAgent(agent)}
              />
            ))}
          </div>

          {/* Final farm plan */}
          <AnimatePresence>
            {stage === 'done' && (
              <FarmPlan plan={plan} profile={profile} />
            )}
          </AnimatePresence>
        </div>

        {/* Agent detail modal */}
        <AnimatePresence>
          {activeAgent && (
            <AgentDetailModal
              agent={activeAgent}
              onClose={() => setActiveAgent(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── PROFILE BANNER ──────────────────────────────────────────────
function ProfileBanner({ profile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-border rounded-2xl p-5 card-elevated mt-4 mb-8"
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-xs text-slate font-mono uppercase tracking-wider mr-2">
          Farm profile
        </div>
        <Pill icon={MapPin} text={`${profile.state}, ${profile.lga}`} />
        <Pill icon={Sprout} text={cap(profile.crop)} />
        <Pill icon={Leaf} text={`${profile.farmSize} hectares`} />
        <Pill icon={Globe} text={cap(profile.language)} />
      </div>
    </motion.div>
  )
}

function Pill({ icon: Icon, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-seedling border border-forest/15"
    >
      <Icon className="w-3.5 h-3.5 text-forest" />
      <span className="text-sm font-medium text-forest">{text}</span>
    </motion.div>
  )
}

// ── ORCHESTRATOR STATUS ─────────────────────────────────────────
function OrchestratorStatus({ stage, completed }) {
  const labels = {
    connecting: 'Connecting to orchestrator',
    dispatching: 'Dispatching agents in parallel',
    working: 'Agents working',
    done: 'Synthesis complete',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex items-center gap-3 text-sm"
    >
      <div className={`relative w-2.5 h-2.5 rounded-full ${
        stage === 'done' ? 'bg-forest' : 'bg-harvest'
      }`}>
        {stage !== 'done' && (
          <motion.div
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-harvest"
          />
        )}
      </div>
      <span className="font-medium text-earth">{labels[stage]}</span>
      {stage === 'working' && (
        <span className="text-xs text-slate font-mono ml-auto">{completed}/4 complete</span>
      )}
    </motion.div>
  )
}

// ── AGENT CARD ──────────────────────────────────────────────────
function AgentCard({ agent, index, stage, completed, onClick }) {
  const Icon = agent.icon
  const isWorking = stage === 'working' && !completed
  const canClick = completed

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
      whileHover={canClick ? { y: -3 } : {}}
      onClick={canClick ? onClick : undefined}
      className={`relative bg-white border rounded-2xl p-5 transition-all overflow-hidden ${
        completed
          ? 'border-forest/40 card-elevated cursor-pointer'
          : 'border-border'
      }`}
    >
      {/* Progress bar */}
      {isWorking && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: agent.duration / 1000, ease: 'easeInOut' }}
          className="absolute top-0 left-0 h-1 bg-harvest"
        />
      )}

      <div className="flex items-start gap-4">
        <motion.div
          animate={
            completed
              ? { scale: [1, 1.15, 1], rotate: [0, 5, 0] }
              : isWorking
              ? { scale: [1, 1.05, 1] }
              : {}
          }
          transition={
            completed
              ? { duration: 0.5 }
              : { duration: 1.2, repeat: Infinity }
          }
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            completed
              ? 'bg-forest text-white'
              : isWorking
              ? 'bg-harvest/15 text-harvest'
              : 'bg-seedling text-forest'
          }`}
        >
          {completed ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-earth mb-1">
            {agent.name}
          </div>

          {(stage === 'connecting' || stage === 'dispatching') && (
            <div className="flex items-center gap-2 text-xs text-slate">
              <Loader2 className="w-3 h-3 animate-spin" />
              Standing by
            </div>
          )}

          {isWorking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-harvest font-medium"
            >
              <span className="flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-harvest animate-pulse" />
                <span className="w-1 h-1 rounded-full bg-harvest animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 rounded-full bg-harvest animate-pulse" style={{ animationDelay: '300ms' }} />
              </span>
              {agent.task}
            </motion.div>
          )}

          {completed && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-sm font-medium text-forest mb-2">
                {agent.result.title}
              </div>
              <div className="text-xs text-slate flex items-center gap-1">
                Tap card for details
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── AGENT DETAIL MODAL ──────────────────────────────────────────
function AgentDetailModal({ agent, onClose }) {
  const Icon = agent.icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-earth/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-7 max-w-md w-full card-elevated"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-forest flex items-center justify-center">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-earth text-lg">
              {agent.name}
            </div>
            <div className="text-sm text-forest font-medium">
              {agent.result.title}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {agent.result.details.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <span className="text-sm text-slate">{d.label}</span>
              <span className="text-sm font-semibold text-earth">{d.value}</span>
            </motion.div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-full bg-seedling text-forest font-medium hover:bg-forest hover:text-white transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── FARM PLAN ───────────────────────────────────────────────────
function FarmPlan({ plan, profile }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = plan.map((p) => `${p.emoji} ${p.label}\n${p.text}`).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-10"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-2 mb-4"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Sparkles className="w-5 h-5 text-harvest" />
        </motion.div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-earth">
          Your weekly farm plan
        </h2>
      </motion.div>

      <div className="relative bg-white border-2 border-forest/20 rounded-3xl overflow-hidden card-elevated">
        {/* Decorative top stripe */}
        <div className="h-2 bg-gradient-to-r from-forest via-growth to-harvest" />

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-xs text-slate">
            <Calendar className="w-3.5 h-3.5" />
            <span>Generated {new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="text-slate/50">·</span>
            <Globe className="w-3.5 h-3.5" />
            <span>{cap(profile.language)}</span>
          </div>

          <div className="space-y-5">
            {plan.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                className="flex gap-4 p-4 rounded-2xl bg-seedling/40 border border-forest/10"
              >
                <div className="text-3xl shrink-0">{item.emoji}</div>
                <div className="flex-1">
                  <div className="font-semibold text-forest text-sm mb-1 uppercase tracking-wide">
                    {item.label}
                  </div>
                  <div className="text-earth leading-relaxed">{item.text}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-7 flex flex-col md:flex-row gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-forest text-white font-semibold rounded-full hover:bg-forest-dark transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Send to WhatsApp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-border text-earth font-semibold rounded-full hover:border-forest transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-forest" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy plan'}
            </motion.button>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-6 pt-5 border-t border-border flex items-center gap-2 text-xs text-slate"
          >
            <AlertCircle className="w-3 h-3" />
            This plan is an advisory built from live data. Always cross check with your local extension officer.
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ── HELPERS ─────────────────────────────────────────────────────
function wait(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function cap(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}