import { motion } from 'motion/react'

/**
 * Topographic Background (Option A)
 * Renders subtle contour lines like a soil/elevation map.
 * Layered behind everything via absolute positioning.
 *
 * Props:
 *  - variant: "default" | "calm" | "celebratory"
 *  - children: page content
 */
export default function Background({ variant = 'default', children }) {
  const className = `organic-bg min-h-screen ${variant !== 'default' ? variant : ''}`

  return (
    <div className={className}>
      {/* Topographic contour layer */}
      <TopographicLines />
      {/* Page content */}
      {children}
    </div>
  )
}

function TopographicLines() {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.2 }}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Subtle line gradient — fades at edges */}
        <radialGradient id="topo-fade" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#1A6B3C" stopOpacity="0.10" />
          <stop offset="60%" stopColor="#1A6B3C" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#1A6B3C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft glow layer behind contours */}
      <rect width="1440" height="900" fill="url(#topo-fade)" />

      {/* Topographic contour paths — drawn slowly on mount */}
      <g
        stroke="#1A6B3C"
        strokeWidth="1"
        fill="none"
        opacity="0.35"
      >
        {CONTOUR_PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 3 + i * 0.3, delay: 0.2 + i * 0.15, ease: 'easeOut' },
              opacity: { duration: 1.5, delay: 0.2 + i * 0.15 },
            }}
          />
        ))}
      </g>

      {/* Harvest accent contour lines for warmth */}
      <g
        stroke="#F5A623"
        strokeWidth="0.8"
        fill="none"
        opacity="0.18"
      >
        {ACCENT_CONTOURS.map((d, i) => (
          <motion.path
            key={`a-${i}`}
            d={d}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 4 + i * 0.4,
              delay: 1 + i * 0.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </g>
    </motion.svg>
  )
}

// Hand-tuned organic contour paths — feel like elevation lines on a soil map
const CONTOUR_PATHS = [
  'M -50 180 Q 250 120, 500 200 T 1000 180 T 1500 220',
  'M -50 280 Q 300 230, 600 290 T 1100 270 T 1500 310',
  'M -50 380 Q 280 330, 550 400 T 1050 370 T 1500 410',
  'M -50 480 Q 320 430, 620 510 T 1120 470 T 1500 520',
  'M -50 600 Q 280 540, 580 620 T 1080 580 T 1500 630',
  'M -50 720 Q 320 660, 640 740 T 1140 700 T 1500 750',
  'M -50 820 Q 280 760, 580 840 T 1080 800 T 1500 850',
]

const ACCENT_CONTOURS = [
  'M -50 130 Q 320 80, 640 150 T 1140 110 T 1500 160',
  'M -50 450 Q 280 390, 580 470 T 1080 430 T 1500 480',
  'M -50 670 Q 320 610, 640 690 T 1140 650 T 1500 700',
]