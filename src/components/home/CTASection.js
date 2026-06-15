// src/components/home/CTASection.js
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} style={{ background: '#E5EEE4', padding: '100px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              display: 'inline-block',
              background: 'rgba(62,44,35,0.08)',
              border: '1px solid rgba(62,44,35,0.12)',
              borderRadius: '50px',
              padding: '8px 20px',
              fontSize: '14px',
              color: '#3E2C23',
              marginBottom: '24px',
              fontWeight: 600,
            }}
          >
            🚀 Start Your Journey Today
          </motion.div>

          <h2
            style={{
              fontSize: 'clamp(30px, 5vw, 56px)',
              fontWeight: 800,
              color: '#3E2C23',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            Ready to Study or Work Abroad?
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: '#7a5c45',
              marginBottom: '48px',
              lineHeight: 1.7,
            }}
          >
            Book a free consultation today. Our experts will guide you through
            every step — from choosing the right country to landing your dream
            job.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/book" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(62,44,35,0.2)',
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: '#3E2C23',
                  color: '#FFF6DE',
                  border: 'none',
                  padding: '18px 40px',
                  borderRadius: '50px',
                  fontSize: '17px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                Book Free Consultation
                <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link href="/contact" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'transparent',
                  color: '#3E2C23',
                  border: '2px solid #3E2C23',
                  padding: '18px 40px',
                  borderRadius: '50px',
                  fontSize: '17px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Phone size={18} />
                Contact Us
              </motion.button>
            </Link>
          </div>
        </motion.div>
        
        {/* Newsletter / CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(212,169,106,0.15) 0%, rgba(212,169,106,0.05) 100%)',
                      border: '1px solid rgba(212,169,106,0.2)',
                      borderRadius: '20px',
                      padding: 'clamp(24px, 4vw, 40px)',
                      margin: 'clamp(40px, 6vw, 50px)',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 'clamp(20px, 3vw, 28px)',
                        fontWeight: 800,
                        color: '#3E2C23',
                        marginBottom: '8px',
                      }}
                    >
                      Ready to Start Your Journey?
                    </h3>
                    <p
                      style={{
                        color: '#3E2C23',
                        fontSize: 'clamp(13px, 2vw, 15px)',
                        marginBottom: '20px',
                        lineHeight: 1.7,
                      }}
                    >
                      Book a free consultation with our experts today
                    </p>
                    <Link href="/book" style={{ textDecoration: 'none' }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          background: '#DE802B',
                          color: '#3E2C23',
                          border: 'none',
                          padding: '12px 28px',
                          borderRadius: '50px',
                          fontWeight: 700,
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        Book Meeting Now →
                      </motion.button>
                    </Link>
                  </motion.div>
      </div>
    </section>
  )
}