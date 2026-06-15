// src/components/ServicesClient.js
'use client'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import SafeImage from '@/components/SafeImage'
import Link from 'next/link'
import {
  ArrowRight,
  Clock,
  Users,
  Star,
  Package,
  Sparkles,
  X,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react'

export default function ServicesClient({ services }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [selectedService, setSelectedService] = useState(null)

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedService(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selectedService ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [selectedService])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#E5EEE4',
        paddingTop: '70px',
      }}
    >
      {/* ───────── Hero ───────── */}
      <div
        style={{
          marginTop:'20px',
          background:
            '#C0E1D2',
          padding: 'clamp(60px, 8vw, 100px) 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 4 + i, repeat: Infinity }}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: '#3E2C23',
              width: `${250 + i * 100}px`,
              height: `${250 + i * 100}px`,
              left: `${10 + i * 25}%`,
              top: `${-30 + i * 20}%`,
              pointerEvents: 'none',
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,246,222,0.1)',
              border: '1px solid rgba(255,246,222,0.2)',
              borderRadius: '50px',
              padding: '8px 18px',
              fontSize: '13px',
              color: '#de802b',
              marginBottom: '20px',
              fontWeight: 600,
            }}
          >
            <Sparkles size={14} /> EXPERT GUIDANCE
          </div>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 60px)',
              fontWeight: 800,
              color: '#3e2c23',
              marginBottom: '16px',
              letterSpacing: '-1px',
              lineHeight: 1.1,
            }}
          >
            Our Services
          </h1>
          <p
            style={{
              color: '#3e2c23',
              fontSize: 'clamp(15px, 2vw, 18px)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.7,
              padding: '0 16px',
            }}
          >
            Everything you need to study or work abroad — under one roof
          </p>
        </motion.div>
      </div>

      {/* ───────── Grid ───────── */}
      <div
        ref={ref}
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 32px)',
        }}
      >
        {services.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
              gap: 'clamp(20px, 3vw, 32px)',
              alignItems: 'stretch',
            }}
          >
            {services.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={i}
                isInView={isInView}
                onViewMore={() => setSelectedService(service)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ───────── Modal ───────── */}
      <AnimatePresence>
        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ────────────────────────────────────────
// SERVICE CARD
// ────────────────────────────────────────
function ServiceCard({ service, index, isInView, onViewMore }) {
  const isLongDescription = service.description?.length > 180

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      style={{
        background: '#C0E1D2',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(62,44,35,0.08)',
        border: '1px solid rgba(62,44,35,0.05)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'box-shadow 0.3s',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = '0 16px 40px rgba(62,44,35,0.15)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = '0 4px 24px rgba(62,44,35,0.08)')
      }
    >
      {/* Image */}
      <div
        style={{
          position: 'relative',
          height: '220px',
          flexShrink: 0,
          overflow: 'hidden',
          background: 'rgba(62,44,35,0.05)',
          cursor: 'pointer',
        }}
        onClick={onViewMore}
      >
        <SafeImage
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(62,44,35,0.15), transparent 40%)',
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          padding: 'clamp(20px, 3vw, 28px)',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: '14px',
        }}
      >
        <h3
          style={{
            fontSize: 'clamp(17px, 2vw, 20px)',
            fontWeight: 700,
            color: '#3E2C23',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {service.title}
        </h3>

        {/* Description with View More */}
        <div style={{ flexGrow: 1 }}>
          <p
            style={{
              color: '#3E2C23',
              fontSize: '14px',
              lineHeight: 1.7,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {service.description}
          </p>

          {/* View More Button */}
          {isLongDescription && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onViewMore}
              style={{
                background: 'none',
                border: 'none',
                color: '#DE802B',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                padding: '8px 0 0 0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View More <ChevronDown size={14} />
            </motion.button>
          )}
        </div>

        {/* Meta Badges */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '8px',
            borderTop: '1px solid rgba(62,44,35,0.06)',
          }}
        >
          {[
            { icon: Clock, text: '24hr' },
            { icon: Users, text: 'Experts' },
            { icon: Star, text: '5★' },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                background: 'rgba(62,44,35,0.05)',
                borderRadius: '50px',
                fontSize: '11px',
                color: '#7a5c45',
                fontWeight: 600,
              }}
            >
              <Icon size={11} />
              {text}
            </div>
          ))}
        </div>

        {/* Book Button */}
        <Link
          href={`/book?service=${service.id}`}
          style={{ textDecoration: 'none', marginTop: 'auto' }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              background: '#3E2C23',
              color: '#FFF6DE',
              border: 'none',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Book a Service
            <ArrowRight size={15} />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

// ────────────────────────────────────────
// SERVICE MODAL (View More)
// ────────────────────────────────────────
function ServiceModal({ service, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFF6DE',
          borderRadius: '24px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(62,44,35,0.9)',
            border: 'none',
            color: '#FFF6DE',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#3E2C23'
            e.currentTarget.style.transform = 'rotate(90deg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(62,44,35,0.9)'
            e.currentTarget.style.transform = 'rotate(0deg)'
          }}
        >
          <X size={20} />
        </button>

        {/* Image */}
        <div
          style={{
            position: 'relative',
            height: 'clamp(220px, 35vw, 320px)',
            overflow: 'hidden',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
        >
          <SafeImage
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 700px) 100vw, 700px"
            style={{ objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(62,44,35,0.9), transparent 50%)',
            }}
          />

          {/* Title overlay on image */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '24px 28px',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: '#DE802B',
                color: '#3E2C23',
                padding: '4px 12px',
                borderRadius: '50px',
                fontSize: '11px',
                fontWeight: 700,
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
               Service
            </div>
            <h2
              style={{
                fontSize: 'clamp(22px, 4vw, 32px)',
                fontWeight: 800,
                color: '#FFF6DE',
                lineHeight: 1.2,
                margin: 0,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {service.title}
            </h2>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: 'clamp(24px, 4vw, 36px)' ,background:'#E5EEE4'}}>
          {/* Description */}
          <div style={{ marginBottom: '28px' }}>
            <h3
              style={{
                fontSize: '13px',
                color: '#DE802B',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              About This Service
            </h3>
            <p
              style={{
                color: '#3E2C23',
                fontSize: 'clamp(15px, 2vw, 16px)',
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
              }}
            >
              {service.description}
            </p>
          </div>

          {/* Features */}
          <div style={{ marginBottom: '28px' }}>
            <h3
              style={{
                fontSize: '13px',
                color: '#DE802B',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '14px',
              }}
            >
              What You Get
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
              }}
            >
              {[
                'Expert one-on-one consultation',
                'Step-by-step guidance',
                'Document review & feedback',
                '24-hour response time',
                'Success-driven approach',
                'Lifetime support access',
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 14px',
                    background: '#C0E1D2',
                    borderRadius: '10px',
                  }}
                >
                  <CheckCircle2
                    size={18}
                    color="#38a169"
                    style={{ flexShrink: 0, marginTop: '1px' }}
                  />
                  <span
                    style={{
                      fontSize: '13px',
                      color: '#3E2C23',
                      fontWeight: 500,
                    }}
                  >
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '28px',
              padding: '20px',
              background: '#C0E1D2',
              borderRadius: '14px',
            }}
          >
            {[
              { icon: Clock, label: 'Response', value: '24hr' },
              { icon: Users, label: 'Team', value: 'Experts' },
              { icon: Star, label: 'Rating', value: '5★' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <Icon
                  size={20}
                  color="#3E2C23"
                  style={{ margin: '0 auto 6px' }}
                />
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#3E2C23',
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#3E2C23',
                    marginTop: '2px',
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href={`/book?service=${service.id}`}
              style={{ textDecoration: 'none', flex: 1, minWidth: '180px' }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  background: '#3E2C23',
                  color: '#FFF6DE',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                Book This Service <ArrowRight size={16} />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              style={{
                background: 'transparent',
                color: '#3E2C23',
                border: '2px solid rgba(62,44,35,0.2)',
                padding: '16px 28px',
                borderRadius: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '15px',
              }}
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ────────────────────────────────────────
// EMPTY STATE
// ────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: '#fff',
        borderRadius: '24px',
        padding: 'clamp(40px, 8vw, 80px) clamp(24px, 5vw, 40px)',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(62,44,35,0.08)',
        border: '2px dashed rgba(62,44,35,0.1)',
      }}
    >
      <Package
        size={56}
        color="rgba(62,44,35,0.2)"
        style={{ margin: '0 auto 20px' }}
      />
      <h3
        style={{
          color: '#3E2C23',
          fontSize: 'clamp(20px, 3vw, 24px)',
          fontWeight: 700,
          marginBottom: '12px',
        }}
      >
        No Services Available
      </h3>
      <p
        style={{
          color: '#7a5c45',
          fontSize: 'clamp(14px, 2vw, 16px)',
          marginBottom: '24px',
          lineHeight: 1.7,
        }}
      >
        Our admin team is preparing exciting services for you. Check back soon!
      </p>
      <Link href="/contact" style={{ textDecoration: 'none' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: '#3E2C23',
            color: '#FFF6DE',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '50px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '15px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Contact Us <ArrowRight size={16} />
        </motion.button>
      </Link>
    </motion.div>
  )
}