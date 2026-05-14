import { motion } from 'motion/react'

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

// ── Layer 2: drifting mesh blobs ──────────────────────────────
function MeshBlobs() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
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
          top: '30%',
          left: '20%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(120, 75, 40, 0.35) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />
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

// ── Layer 3: topographic contour lines — distributed evenly ──
function TopographicLines() {
  // Generate evenly-spaced contour lines across the full viewport height
  const primaryLines = generateContours(8, 1)
  const secondaryLines = generateContours(8, 0.5)
  const accentLines = generateContours(4, 1)

  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.2 }}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
      preserveAspectRatio="none"
      viewBox="0 0 1440 1000"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Primary contour lines — earth brown, thicker */}
      <g
        stroke="#4E342E"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.30"
      >
        {primaryLines.map((d, i) => (
          <motion.path
            key={`p-${i}`}
            d={d}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3 + i * 0.2,
              delay: 0.3 + i * 0.1,
              ease: 'easeOut',
            }}
          />
        ))}
      </g>

      {/* Secondary thinner contour lines */}
      <g
        stroke="#3E2723"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.22"
      >
        {secondaryLines.map((d, i) => (
          <motion.path
            key={`s-${i}`}
            d={d}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 4 + i * 0.25,
              delay: 0.6 + i * 0.12,
              ease: 'easeOut',
            }}
          />
        ))}
      </g>

      {/* Harvest gold accent lines — sparse */}
      <g
        stroke="#A66D1F"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.28"
      >
        {accentLines.map((d, i) => (
          <motion.path
            key={`a-${i}`}
            d={d}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 4.5 + i * 0.3,
              delay: 1.0 + i * 0.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </g>
    </motion.svg>
  )
}

/**
 * Generates contour-shaped paths evenly spread across viewBox 1440x1000.
 * count = number of lines, offset = vertical shift for secondary layer
 */
function generateContours(count, offset) {
  const lines = []
  const totalHeight = 1000
  const spacing = totalHeight / (count + 1)

  for (let i = 0; i < count; i++) {
    const y = spacing * (i + 1) + offset * (spacing / 2)
    // Use deterministic-looking wave variation per line
    const a1 = 30 + (i * 17) % 40
    const a2 = 40 + (i * 23) % 35
    const a3 = 25 + (i * 29) % 45
    const path =
      `M -100 ${y} ` +
      `Q 240 ${y - a1}, 480 ${y + a2 / 2} ` +
      `T 960 ${y - a3 / 2} ` +
      `T 1600 ${y + a1 / 3}`
    lines.push(path)
  }
  return lines
}