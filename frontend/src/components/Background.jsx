import { motion } from 'motion/react'

/**
 * Background layers (fixed, behind all page content):
 *  - Layer 1: drifting mesh blobs (gold + brown)
 *  - Layer 2: topographic contour lines (static, fades in once)
 * Paper grain is handled in CSS.
 */
export default function Background() {
  return (
    <>
      <MeshBlobs />
      <TopographicLines />
    </>
  )
}

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
          top: '35%',
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
    </div>
  )
}

function TopographicLines() {
  const primary = generateContours(9, 0)
  const secondary = generateContours(9, 0.5)
  const accent = generateContours(5, 0.25)

  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.4 }}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
      preserveAspectRatio="none"
      viewBox="0 0 1440 900"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#4E342E" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.32">
        {primary.map((d, i) => <path key={`p-${i}`} d={d} />)}
      </g>
      <g stroke="#3E2723" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.22">
        {secondary.map((d, i) => <path key={`s-${i}`} d={d} />)}
      </g>
      <g stroke="#A66D1F" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.30">
        {accent.map((d, i) => <path key={`a-${i}`} d={d} />)}
      </g>
    </motion.svg>
  )
}

function generateContours(count, offset) {
  const lines = []
  const total = 900
  const spacing = total / (count + 1)
  for (let i = 0; i < count; i++) {
    const y = spacing * (i + 1) + offset * (spacing / 2)
    const a1 = 25 + (i * 17) % 35
    const a2 = 35 + (i * 23) % 30
    const a3 = 20 + (i * 29) % 40
    lines.push(
      `M -100 ${y} Q 240 ${y - a1}, 480 ${y + a2 / 2} T 960 ${y - a3 / 2} T 1600 ${y + a1 / 3}`
    )
  }
  return lines
}