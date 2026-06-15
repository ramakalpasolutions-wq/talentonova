// src/components/GalleryClient.js
'use client'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import SafeImage from '@/components/SafeImage'
import Link from 'next/link'
import {
  ArrowRight,
  Image as ImageIcon,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function GalleryClient({ gallery }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [selectedIndex, setSelectedIndex] = useState(null)

  const validGallery =
    gallery?.filter(
      (item) => item.imageUrl && item.imageUrl.trim() !== ''
    ) || []

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') setSelectedIndex(null)
      if (e.key === 'ArrowRight')
        setSelectedIndex((prev) => (prev + 1) % validGallery.length)
      if (e.key === 'ArrowLeft')
        setSelectedIndex(
          (prev) => (prev - 1 + validGallery.length) % validGallery.length
        )
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedIndex, validGallery.length])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [selectedIndex])

  const selected = selectedIndex !== null ? validGallery[selectedIndex] : null

  const goNext = (e) => {
    e?.stopPropagation()
    setSelectedIndex((prev) => (prev + 1) % validGallery.length)
  }

  const goPrev = (e) => {
    e?.stopPropagation()
    setSelectedIndex(
      (prev) => (prev - 1 + validGallery.length) % validGallery.length
    )
  }

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
          marginTop: '20px',
          background: '#C0E1D2',
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
            <Sparkles size={14} /> OUR JOURNEY
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
            Our Gallery
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
            Real moments from our students&apos; journeys to global universities
          </p>
        </motion.div>
      </div>

      {/* ───────── Image Grid (Pinterest-style) ───────── */}
      <div
        ref={ref}
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 32px)',
        }}
      >
        {validGallery.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
              gap: 'clamp(14px, 2vw, 20px)',
            }}
          >
            {validGallery.map((item, i) => (
              <GalleryImage
                key={item.id}
                item={item}
                index={i}
                isInView={isInView}
                onView={() => setSelectedIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ───────── Lightbox ───────── */}
      <AnimatePresence>
        {selected && (
          <Lightbox
            item={selected}
            currentIndex={selectedIndex}
            total={validGallery.length}
            onClose={() => setSelectedIndex(null)}
            onNext={goNext}
            onPrev={goPrev}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ────────────────────────────────────────
// GALLERY IMAGE (Clean clickable image card)
// ────────────────────────────────────────
function GalleryImage({ item, index, isInView, onView }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -4 }}
      onClick={onView}
      style={{
        position: 'relative',
        height: 'clamp(240px, 30vw, 300px)',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(62,44,35,0.12)',
        background: '#C0E1D2',
        transition: 'box-shadow 0.3s',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          '0 16px 40px rgba(62, 44, 35, 0.25)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow =
          '0 4px 20px rgba(62, 44, 35, 0.12)')
      }
    >
     
    <SafeImage
    src={item.imageUrl}
    alt={item.title || 'Gallery image'}
    fill
    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
    style={{ objectFit: 'cover' }}
    />

      {/* Hover overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(62,44,35,0.7) 0%, rgba(62,44,35,0.2) 100%)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '20px',
        }}
      >
        {item.title && (
          <p
            style={{
              color: '#FFF6DE',
              fontWeight: 700,
              fontSize: 'clamp(14px, 1.8vw, 16px)',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              margin: 0,
            }}
          >
            {item.title}
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}

// ────────────────────────────────────────
// LIGHTBOX (Just the image, clean)
// ────────────────────────────────────────
function Lightbox({ item, currentIndex, total, onClose, onNext, onPrev }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10001,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: '#DE802B',
          border: 'none',
          color: '#3E2C23',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <X size={22} />
      </motion.button>

      {/* Previous Button */}
      {total > 1 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onPrev}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10001,
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'rgba(222, 128, 43, 0.9)',
            border: 'none',
            color: '#3E2C23',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <ChevronLeft size={26} />
        </motion.button>
      )}

      {/* Next Button */}
      {total > 1 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onNext}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10001,
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'rgba(222, 128, 43, 0.9)',
            border: 'none',
            color: '#3E2C23',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <ChevronRight size={26} />
        </motion.button>
      )}

      {/* Image */}
      <motion.div
        key={currentIndex}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        <img
          src={item.imageUrl}
          alt={item.title || 'Gallery'}
          style={{
            display: 'block',
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
          }}
        />

        {/* Optional title at bottom */}
        {item.title && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background:
                'linear-gradient(to top, rgba(62,44,35,0.9), transparent)',
              padding: '30px 24px 20px',
              color: '#FFF6DE',
              fontWeight: 700,
              fontSize: 'clamp(15px, 2vw, 18px)',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            {item.title}
          </div>
        )}
      </motion.div>

      {/* Image counter (top center) */}
      {total > 1 && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(62, 44, 35, 0.8)',
            color: '#FFF6DE',
            padding: '8px 18px',
            borderRadius: '50px',
            fontSize: '13px',
            fontWeight: 700,
            backdropFilter: 'blur(10px)',
            zIndex: 10001,
          }}
        >
          {currentIndex + 1} / {total}
        </div>
      )}
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
      <ImageIcon
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
        Gallery Coming Soon
      </h3>
      <p
        style={{
          color: '#7a5c45',
          fontSize: 'clamp(14px, 2vw, 16px)',
          marginBottom: '24px',
          lineHeight: 1.7,
        }}
      >
        Our admin team is preparing amazing memories to share with you. Check
        back soon!
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