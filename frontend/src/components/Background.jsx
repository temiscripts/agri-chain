import { motion } from 'motion/react'

/**
 * Background — Earthy mesh + topographic contour lines
 * Layer 1: organic gradient base (set in index.css)
 * Layer 2: drifting mesh blobs (gold + brown)
 * Layer 3: topographic contour lines (brown)
 * Layer 3.5: paper grain (set in index.css)
 * Layer 4: page content
 */
export default function Background({ variant = 'default', children }) {
  const className = `organic-bg ${variant !== 'default' ? variant : ''}`

  return (
    <div className={className}>
      <MeshBlobs />
      <TopographicLines />
      {children}
    </div>
  )
}

// ── Layer 2: drifting mesh blobs (Option B) ────────────────────
function MeshBlobs() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Top-right golden blob */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: [0, 30, -10, 0],
          y: [0, -20, 10, 0],
        }}
        transition={{
          opacity: { duration: 2 },
          x: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute"
        style={{
          top: '-15%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(245, 166, 35, 0.45) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Center earth-brown blob */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: [0, -40, 20, 0],
          y: [0, 30, -15, 0],
        }}
        transition={{
          opacity: { duration: 2, delay: 0.3 },
          x: { duration: 26, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute"
        style={{
          top: '20%',
          left: '20%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(120, 75, 40, 0.35) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Bottom-left amber blob */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: [0, 25, -30, 0],
          y: [0, -25, 15, 0],
        }}
        transition={{
          opacity: { duration: 2, delay: 0.6 },
          x: { duration: 24, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute"
        style={{
          bottom: '-10%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          background: 'radial-gradient(circle, rgba(180, 130, 60, 0.40) 0%, transparent 60%)',
          filter: 'blur(45px)',
        }}
      />

      {/* Bottom-right deep gold blob */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: [0, -20, 15, 0],
          y: [0, 20, -10, 0],
        }}
        transition={{
          opacity: { duration: 2, delay: 0.9 },
          x: { duration: 28, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 24, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute"
        style={{
          bottom: '-5%',
          right: '5%',
          width: '45vw',
          height: '45vw',
          background: 'radial-gradient(circle, rgba(210, 150, 70, 0.30) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}

// ── Layer 3: topographic contour lines (Option A) ──────────────
function TopographicLines() {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.2 }}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Primary contour lines — earth brown, thicker */}
      <g
        stroke="#4E342E"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.32"
      >
        {CONTOUR_PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3 + i * 0.25,
              delay: 0.3 + i * 0.12,
              ease: 'easeOut',
            }}
          />
        ))}
      </g>

      {/* Secondary thinner contour lines — deeper brown */}
      <g
        stroke="#3E2723"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.22"
      >
        {SECONDARY_CONTOURS.map((d, i) => (
          <motion.path
            key={`s-${i}`}
            d={d}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 4 + i * 0.3,
              delay: 0.8 + i * 0.18,
              ease: 'easeOut',
            }}
          />
        ))}
      </g>

      {/* Harvest gold accent lines — thin, sparse */}
      <g
        stroke="#A66D1F"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
        opacity="0.28"
      >
        {ACCENT_CONTOURS.map((d, i) => (
          <motion.path
            key={`a-${i}`}
            d={d}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 4.5 + i * 0.3,
              delay: 1.2 + i * 0.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </g>
    </motion.svg>
  )
}

// Primary contour paths — like elevation lines on a soil map
const CONTOUR_PATHS = [
  'M -100 100 Q 250 50, 500 130 T 1000 110 T 1600 150',
  'M -100 220 Q 300 170, 600 240 T 1100 210 T 1600 250',
  'M -100 340 Q 280 290, 550 360 T 1050 320 T 1600 360',
  'M -100 460 Q 320 410, 620 490 T 1120 450 T 1600 500',
  'M -100 590 Q 280 530, 580 610 T 1080 570 T 1600 620',
  'M -100 720 Q 320 660, 640 740 T 1140 700 T 1600 750',
  'M -100 840 Q 280 780, 580 860 T 1080 820 T 1600 870',
]

// Tighter, between-line secondary contours
const SECONDARY_CONTOURS = [
  'M -100 160 Q 280 110, 560 180 T 1060 160 T 1600 200',
  'M -100 280 Q 320 230, 620 300 T 1120 270 T 1600 310',
  'M -100 400 Q 280 350, 580 420 T 1080 390 T 1600 430',
  'M -100 520 Q 320 470, 640 550 T 1140 510 T 1600 560',
  'M -100 650 Q 280 600, 580 680 T 1080 640 T 1600 690',
  'M -100 780 Q 320 720, 640 800 T 1140 760 T 1600 810',
]

// Sparse harvest gold accents
const ACCENT_CONTOURS = [
  'M -100 80 Q 320 30, 640 100 T 1140 60 T 1600 110',
  'M -100 430 Q 280 380, 580 450 T 1080 410 T 1600 460',
  'M -100 680 Q 320 620, 640 700 T 1140 660 T 1600 710',
]