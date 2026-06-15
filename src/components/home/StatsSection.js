// src/components/home/StatsSection.js
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const stats = [
  { number: '5000+', label: 'Students Placed', icon: '🎓', color: '#3E2C23' },
  { number: '50+', label: 'Partner Universities', icon: '🏛️', color: '#3E2C23' },
  { number: '15+', label: 'Countries', icon: '🌍', color: '#3E2C23' },
  { number: '98%', label: 'Visa Success Rate', icon: '✅', color: '#3E2C23' },
]

export default function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} style={{ background: '#C0E1D2', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '40px',
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                animate={isInView ? { scale: [0.8, 1.1, 1] } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                style={{ fontSize: '40px', marginBottom: '8px' }}
              >
                {stat.icon}
              </motion.div>
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: 800,
                  color: '#3E2C23',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#7a5c45',
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}