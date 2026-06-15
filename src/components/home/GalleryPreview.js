// src/components/home/GalleryPreview.js
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import SafeImage from '@/components/SafeImage'
import Link from 'next/link'
import { X, ArrowRight, ImageIcon } from 'lucide-react'

export default function GalleryPreview({ gallery, totalCount = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [selected, setSelected] = useState(null)

  // Only show items with real images
  const validGallery =
    gallery?.filter(
      (item) => item.imageUrl && item.imageUrl.trim() !== ''
    ) || []

  // ✅ Show max 8 images
  const displayGallery = validGallery.slice(0, 8)

  // ✅ Show "View More" button always if there's at least 1 image
  // OR if total count is more than what's displayed
  const hasMore = totalCount > displayGallery.length || displayGallery.length >= 8

  // ESC to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [selected])

  return (
    <section
      ref={ref}
      style={{
        background: '#C0E1D2',
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
              background: 'rgba(222, 128, 43, 0.15)',
              border: '1px solid rgba(222, 128, 43, 0.3)',
              borderRadius: '50px',
              padding: 'clamp(5px, 1vw, 6px) clamp(14px, 2.5vw, 18px)',
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              color: '#DE802B',
              marginBottom: '16px',
              fontWeight: 700,
              letterSpacing: '1px',
            }}
          >
            GALLERY
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
            Our Gallery
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
            Real moments from our students&apos; journeys abroad
          </p>
        </motion.div>

        {displayGallery.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            style={{
              textAlign: 'center',
              padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 24px)',
              background: '#E5EEE4',
              borderRadius: '24px',
              border: '2px dashed rgba(62, 44, 35, 0.2)',
            }}
          >
            <ImageIcon
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
              Gallery Coming Soon
            </h3>
            <p
              style={{
                color: '#3E2C23',
                fontSize: 'clamp(14px, 2vw, 15px)',
                opacity: 0.7,
              }}
            >
              Admin can upload gallery images
            </p>
          </motion.div>
        ) : (
          <>
            {/* ─── Responsive Gallery Grid ─── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                gap: 'clamp(12px, 2vw, 20px)',
              }}
            >
              {displayGallery.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  onClick={() => setSelected(item)}
                  style={{
                    position: 'relative',
                    height: 'clamp(180px, 26vw, 240px)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(62,44,35,0.12)',
                    background: '#E5EEE4',
                    transition: 'box-shadow 0.3s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      '0 16px 40px rgba(62,44,35,0.25)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      '0 4px 20px rgba(62,44,35,0.12)')
                  }
                >
                  <SafeImage
                    src={item.imageUrl}
                    alt={item.title || 'Gallery'}
                    fill
                    sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
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
                        'linear-gradient(to top, rgba(62,44,35,0.85), transparent 60%)',
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
                          fontSize: 'clamp(12px, 1.8vw, 15px)',
                          margin: 0,
                          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        }}
                      >
                        {item.title}
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* ─── View More Button (Always shows if any images exist) ─── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              style={{
                textAlign: 'center',
                marginTop: 'clamp(32px, 5vw, 48px)',
              }}
            >
              <Link href="/gallery" style={{ textDecoration: 'none' }}>
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
                  View Full Gallery <ArrowRight size={18} />
                </motion.button>
              </Link>

              {/* Show total count hint */}
              {totalCount > displayGallery.length && (
                <p
                  style={{
                    marginTop: '12px',
                    fontSize: '13px',
                    color: '#3E2C23',
                    opacity: 0.7,
                    fontWeight: 600,
                  }}
                >
                  +{totalCount - displayGallery.length} more memories to
                  explore
                </p>
              )}
            </motion.div>
          </>
        )}
      </div>

      {/* ─── Lightbox ─── */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelected(null)}
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
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
            }}
          >
            <img
              src={selected.imageUrl}
              alt={selected.title || 'Gallery'}
              style={{
                display: 'block',
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
            />
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#DE802B',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#3E2C23',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <X size={20} />
            </button>
            {selected.title && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background:
                    'linear-gradient(to top, rgba(62,44,35,0.95), transparent)',
                  padding: '40px 24px 24px',
                  color: '#FFF6DE',
                  fontWeight: 700,
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                }}
              >
                {selected.title}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}