import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import {
  Sprout, CloudRain, TrendingUp, Wallet, Bug, Check, ArrowLeft,
  MapPin, Leaf, Globe, MessageCircle, Copy, Sparkles,
  Loader2, AlertCircle, Calendar, RefreshCw
} from 'lucide-react'
import Background from './Background'
import { getFarmPlan, mapAgentResult, mapFarmPlan } from '../lib/api'

const AGENT_META = [
  { id: 'soil',    name: 'Soil & Crop Agent',   icon: Sprout,       task: 'Analyzing soil composition',  duration: 2400 },
  { id: 'weather', name: 'Weather Agent',       icon: CloudRain,    task: 'Fetching 7 day forecast',     duration: 1800 },
  { id: 'market',  name: 'Market Price Agent',  icon: TrendingUp,   task: 'Scanning regional markets',   duration: 3100 },
  { id: 'finance', name: 'Finance Agent',       icon: Wallet,       task: 'Matching loan programmes',    duration: 2200 },
  { id: 'pest',    name: 'Pest & Disease Agent',icon: Bug,          task: 'Scanning for crop threats',   duration: 2700 },
]

export default function ResultsScreen() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [stage, setStage] = useState('connecting')
  const [completed, setCompleted] = useState([])
  const [activeAgent, setActiveAgent] = useState(null)
  const [apiData, setApiData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('farmerProfile')
    if (!stored) {
      navigate('/onboarding')
      return
    }
    setProfile(JSON.parse(stored))
  }, [navigate])

  useEffect(() => {
    if (!profile) return
    let cancelled = false

    const run = async () => {
      // Visual choreography starts immediately
      await wait(800)
      if (cancelled) return
      setStage('dispatching')

      await wait(700)
      if (cancelled) return
      setStage('working')

      // Visually stagger agent completion while API works in background
      AGENT_META.forEach((agent) => {
        setTimeout(() => {
          if (cancelled) return
          setCompleted((prev) => prev.includes(agent.id) ? prev : [...prev, agent.id])
        }, agent.duration)
      })

      // Fire real API call in parallel
      try {
        const data = await getFarmPlan(profile)
        if (cancelled) return
        setApiData(data)

        // Make sure all agents show as complete (in case API was faster than timers)
        setCompleted(AGENT_META.map((a) => a.id))

        // Small pause before synthesis reveal
        await wait(600)
        if (cancelled) return
        setStage('done')
      } catch (err) {
        if (cancelled) return
        console.error('Farm plan failed:', err)
        setError(err.message || 'Could not reach the orchestrator. Please try again.')
        setStage('error')
      }
    }

    run()
    return () => { cancelled = true }
  }, [profile])

  if (!profile) return null

  // Build agent display data — use mapped API data if available, otherwise nothing on the cards
  const agents = AGENT_META.map((meta) => {
    const apiResult = apiData?.agentResults?.[meta.id]
    const mapped = apiResult ? mapAgentResult(meta.id, apiResult) : null
    return {
      ...meta,
      result: mapped || { title: 'Awaiting results', details: [] },
    }
  })

  const plan = apiData ? mapFarmPlan(apiData.farmPlan) : []

  return (
    <div className={`page-bg ${stage === 'done' ? 'celebratory' : ''}`}>
      <Background />
      <div className="page-content">
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
            {stage === 'working' && `${completed.length}/${AGENT_META.length}`}
            {stage === 'done' && '✓ ready'}
            {stage === 'error' && '! error'}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-16 w-full">
          <ProfileBanner profile={profile} />

          {stage === 'error' ? (
            <ErrorState error={error} onRetry={() => window.location.reload()} />
          ) : (
            <>
              <OrchestratorStatus stage={stage} completed={completed.length} total={AGENT_META.length} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {agents.map((agent, i) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    index={i}
                    stage={stage}
                    completed={completed.includes(agent.id)}
                    hasResult={!!apiData?.agentResults?.[agent.id]}
                    onClick={() => setActiveAgent(agent)}
                  />
                ))}
              </div>

              <AnimatePresence>
                {stage === 'done' && plan.length > 0 && (
                  <FarmPlan plan={plan} profile={profile} />
                )}
              </AnimatePresence>
            </>
          )}
        </div>

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

// ─────────────────────────────────────────────
// SUB COMPONENTS
// ─────────────────────────────────────────────

function ProfileBanner({ profile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-border rounded-2xl p-5 card-elevated mt-4 mb-8"
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-xs text-earth/70 font-mono uppercase tracking-wider mr-2">
          {profile.name ? `${profile.name}'s farm` : 'Farm profile'}
        </div>
        <Pill icon={MapPin} text={`${profile.state}${profile.lga ? ', ' + profile.lga : ''}`} />
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

function OrchestratorStatus({ stage, completed, total }) {
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
        <span className="text-xs text-earth/70 font-mono ml-auto">{completed}/{total} complete</span>
      )}
    </motion.div>
  )
}

function AgentCard({ agent, index, stage, completed, hasResult, onClick }) {
  const Icon = agent.icon
  const isWorking = stage === 'working' && !completed
  const canClick = completed && hasResult

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
      whileHover={canClick ? { y: -3 } : {}}
      onClick={canClick ? onClick : undefined}
      className={`relative bg-white border rounded-2xl p-5 transition-all overflow-hidden ${
        completed
          ? 'border-forest/40 card-elevated' + (canClick ? ' cursor-pointer' : '')
          : 'border-border'
      }`}
    >
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
            <div className="flex items-center gap-2 text-xs text-earth/70">
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

          {completed && hasResult && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-sm font-medium text-forest mb-2">
                {agent.result.title}
              </div>
              {agent.result.confidence && (
                <div className="inline-block text-[10px] font-mono uppercase tracking-wider text-earth/60 mb-2">
                  {agent.result.confidence}
                </div>
              )}
              <div className="text-xs text-earth/70 flex items-center gap-1">
                Tap card for details
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </div>
            </motion.div>
          )}

          {completed && !hasResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-earth/60 italic"
            >
              Waiting for orchestrator response...
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

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
        className="bg-white rounded-3xl p-7 max-w-md w-full card-elevated max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-forest flex items-center justify-center">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
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
              className="flex items-start justify-between gap-3 py-3 border-b border-border last:border-0"
            >
              <span className="text-sm text-earth/70 shrink-0">{d.label}</span>
              <span className="text-sm font-semibold text-earth text-right">{d.value}</span>
            </motion.div>
          ))}
        </div>

        {agent.result.confidence && (
          <div className="mt-5 p-3 rounded-xl bg-seedling/50 text-xs text-earth/80 text-center font-mono">
            {agent.result.confidence}
          </div>
        )}

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
        <div className="h-2 bg-gradient-to-r from-forest via-growth to-harvest" />

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-xs text-earth/70 flex-wrap">
            <Calendar className="w-3.5 h-3.5" />
            <span>Generated {new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="text-earth/40">·</span>
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-6 pt-5 border-t border-border flex items-center gap-2 text-xs text-earth/70"
          >
            <AlertCircle className="w-3 h-3" />
            This plan is an advisory built from live data. Always cross check with your local extension officer.
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function ErrorState({ error, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 bg-white border border-red-200 rounded-2xl p-6 card-elevated"
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-earth mb-1">
            Something went wrong
          </div>
          <div className="text-sm text-earth/70 mb-4">
            We could not reach the orchestrator. This usually clears up in a few seconds.
          </div>
          <div className="text-xs text-earth/60 font-mono mb-5 break-words">
            {error}
          </div>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest text-white text-sm font-semibold rounded-full hover:bg-forest-dark transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try again
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function cap(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
} 