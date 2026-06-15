// src/components/home/ServicesPreview.js
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SafeImage from '@/components/SafeImage'
import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'

export default function ServicesPreview({ services }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{
        background: '#E5EEE4',
        padding: 'clamp(50px, 8vw, 80px) clamp(16px, 4vw, 24px)',
      }}
    >
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(40px, 6vw, 60px)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(222, 128, 43, 0.12)',
              border: '1px solid rgba(222, 128, 43, 0.25)',
              borderRadius: '50px',
              padding: 'clamp(5px, 1vw, 6px) clamp(14px, 2.5vw, 18px)',
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              color: '#DE802B',
              marginBottom: '16px',
              fontWeight: 700,
              letterSpacing: '1px',
            }}
          >
            WHAT WE OFFER
          </div>
          <h2
            style={{
              fontSize: 'clamp(26px, 4vw, 48px)',
              fontWeight: 800,
              color: '#3E2C23',
              marginBottom: '14px',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}
          >
            Our Services
          </h2>
          <p
            style={{
              color: '#3E2C23',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.7,
              fontSize: 'clamp(14px, 2vw, 16px)',
              padding: '0 10px',
              opacity: 0.85,
            }}
          >
            Comprehensive support for every step of your international journey
          </p>
        </motion.div>

        {!services || services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            style={{
              textAlign: 'center',
              padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 24px)',
              background: '#C0E1D2',
              borderRadius: '24px',
              border: '2px dashed rgba(62, 44, 35, 0.2)',
            }}
          >
            <Package
              size={48}
              color="rgba(62, 44, 35, 0.4)"
              style={{ margin: '0 auto 16px' }}
            />
            <h3
              style={{
                color: '#3E2C23',
                fontSize: 'clamp(18px, 2.5vw, 20px)',
                fontWeight: 700,
                marginBottom: '8px',
              }}
            >
              No Services Yet
            </h3>
            <p
              style={{
                color: '#3E2C23',
                fontSize: 'clamp(14px, 2vw, 15px)',
                opacity: 0.7,
              }}
            >
              Admin will add services soon
            </p>
          </motion.div>
        ) : (
          <>
            {/* ─── Services Grid ─── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: 'clamp(16px, 2.5vw, 24px)',
                alignItems: 'stretch',
              }}
            >
              {services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(62, 44, 35, 0.08)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(62, 44, 35, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'box-shadow 0.3s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      '0 16px 40px rgba(62, 44, 35, 0.15)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      '0 4px 16px rgba(62, 44, 35, 0.06)')
                  }
                >
                  {/* Image */}
                  <div
                    style={{
                      position: 'relative',
                      height: 'clamp(180px, 25vw, 220px)',
                      flexShrink: 0,
                      overflow: 'hidden',
                      background: '#C0E1D2',
                    }}
                  >
                    <SafeImage
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      padding: 'clamp(18px, 2.5vw, 24px)',
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                      gap: '12px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 'clamp(16px, 2vw, 18px)',
                        fontWeight: 700,
                        color: '#3E2C23',
                        lineHeight: 1.3,
                        margin: 0,
                      }}
                    >
                      {service.title}
                    </h3>

                    <p
                      style={{
                        fontSize: 'clamp(13px, 1.8vw, 14px)',
                        color: '#3E2C23',
                        lineHeight: 1.6,
                        margin: 0,
                        opacity: 0.75,
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {service.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginTop: 'auto',
                        paddingTop: '8px',
                      }}
                    >
                      <Link
                        href={`/book?service=${service.id}`}
                        style={{
                          textDecoration: 'none',
                          width: '100%',
                        }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            width: '100%',
                            background: '#DE802B',
                            color: '#3E2C23',
                            border: 'none',
                            padding: 'clamp(10px, 1.5vw, 12px) 20px',
                            borderRadius: '50px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: 'clamp(13px, 1.8vw, 14px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(222, 128, 43, 0.3)',
                          }}
                        >
                          Book Now <ArrowRight size={14} />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ─── View All Button ─── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              style={{
                textAlign: 'center',
                marginTop: 'clamp(32px, 5vw, 48px)',
              }}
            >
              <Link href="/services" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    background: '#3E2C23',
                    color: '#C0E1D2',
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'transparent',
                    color: '#3E2C23',
                    border: '2px solid #3E2C23',
                    padding:
                      'clamp(12px, 2vw, 14px) clamp(28px, 5vw, 40px)',
                    borderRadius: '50px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: 'clamp(14px, 2vw, 16px)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s',
                  }}
                >
                  View All Services <ArrowRight size={18} />
                </motion.button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}