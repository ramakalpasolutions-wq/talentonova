// src/components/AdminClient.js
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Plus,
  Trash2,
  Package,
  Image as ImageIcon,
  BookOpen,
  MessageSquare,
  Upload,
  CheckCircle,
  X,
  CreditCard,
  Save,
  Eye,
  Search,
  Filter,
  Edit3,
  Phone,
  Mail,
  Calendar,
  Clock,
  AlertCircle,
  XCircle,
  Download,
} from 'lucide-react'

const tabs = [
  { id: 'hero', label: 'Hero Images', icon: ImageIcon },
  { id: 'fee', label: 'Consultation Fee', icon: CreditCard },
  { id: 'services', label: 'Services', icon: Package },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'bookings', label: 'Bookings', icon: BookOpen },
  { id: 'contacts', label: 'Messages', icon: MessageSquare },
]

// ─── Reason Map (shared) ───
const REASON_MAP = {
  general: { label: 'General', icon: '💬', color: '#7a5c45' },
  education: { label: 'Education', icon: '🎓', color: '#3b82f6' },
  jobs: { label: 'Jobs', icon: '💼', color: '#8b5cf6' },
  visa: { label: 'Visa', icon: '📋', color: '#DE802B' },
  'test-prep': { label: 'Test Prep', icon: '📚', color: '#38a169' },
  other: { label: 'Other', icon: '✨', color: '#d69e2e' },
}

const REASON_FULL_MAP = {
  general: { label: 'General Inquiry', icon: '💬', color: '#7a5c45' },
  education: { label: 'Abroad Education', icon: '🎓', color: '#3b82f6' },
  jobs: { label: 'Job Placement', icon: '💼', color: '#8b5cf6' },
  visa: { label: 'Visa Consultation', icon: '📋', color: '#DE802B' },
  'test-prep': { label: 'Test Preparation', icon: '📚', color: '#38a169' },
  other: { label: 'Other', icon: '✨', color: '#d69e2e' },
}

export default function AdminClient({
  services,
  gallery,
  bookings,
  contacts,
  settings = {},
  heroImages = [],
}) {
  const [activeTab, setActiveTab] = useState('hero')
  const [serviceList, setServiceList] = useState(services)
  const [galleryList, setGalleryList] = useState(gallery)
  const [bookingList, setBookingList] = useState(bookings)
  const [contactList, setContactList] = useState(contacts)
  const [heroImagesList, setHeroImagesList] = useState(heroImages || [])
  const [consultationFee, setConsultationFee] = useState(
    settings.consultationFee || '0'
  )
  const [uploading, setUploading] = useState(false)
  const [savingFee, setSavingFee] = useState(false)
  const [toast, setToast] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [viewBooking, setViewBooking] = useState(null)
  const [viewContact, setViewContact] = useState(null)
  const [bookingSearch, setBookingSearch] = useState('')
  const [bookingFilter, setBookingFilter] = useState('all')
  const [contactSearch, setContactSearch] = useState('')
  const [contactReasonFilter, setContactReasonFilter] = useState('all')

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ESC to close preview
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setPreviewImage(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    document.body.style.overflow = previewImage ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [previewImage])

  // ─── Upload Hero Image (multi) ───
  const handleUploadHero = async (e) => {
    e.preventDefault()
    setUploading(true)
    const formData = new FormData(e.target)

    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.image) {
        setHeroImagesList((prev) => [...prev, data.image])
        e.target.reset()
        showToast('Hero image added!')
      } else {
        showToast(data.error || 'Failed', 'error')
      }
    } catch {
      showToast('Something went wrong', 'error')
    } finally {
      setUploading(false)
    }
  }

  // ─── Delete Single Hero Image ───
  const handleDeleteHero = async (id) => {
    if (!confirm('Remove this hero image?')) return
    try {
      const res = await fetch(`/api/admin/hero?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setHeroImagesList((prev) => prev.filter((img) => img.id !== id))
        showToast('Hero image removed')
      } else {
        showToast('Failed to remove', 'error')
      }
    } catch {
      showToast('Something went wrong', 'error')
    }
  }

  const handleSaveFee = async (e) => {
    e.preventDefault()
    setSavingFee(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'consultationFee',
          value: consultationFee,
        }),
      })
      const data = await res.json()
      if (data.setting) {
        showToast(
          `Fee updated to ${
            parseFloat(consultationFee) > 0 ? `₹${consultationFee}` : 'FREE'
          }`
        )
      } else {
        showToast(data.error || 'Failed', 'error')
      }
    } catch {
      showToast('Something went wrong', 'error')
    } finally {
      setSavingFee(false)
    }
  }

  const handleAddService = async (e) => {
    e.preventDefault()
    setUploading(true)
    const formData = new FormData(e.target)
    try {
      const res = await fetch('/api/admin/service', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.service) {
        setServiceList((prev) => [data.service, ...prev])
        e.target.reset()
        showToast('Service added!')
      } else {
        showToast(data.error || 'Failed', 'error')
      }
    } catch {
      showToast('Something went wrong', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteService = async (id) => {
    if (!confirm('Delete this service?')) return
    const res = await fetch(`/api/admin/service?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setServiceList((prev) => prev.filter((s) => s.id !== id))
      showToast('Service deleted')
    }
  }

  const handleAddGallery = async (e) => {
    e.preventDefault()
    setUploading(true)
    const formData = new FormData(e.target)
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.gallery) {
        setGalleryList((prev) => [data.gallery, ...prev])
        e.target.reset()
        showToast('Gallery image added!')
      } else {
        showToast(data.error || 'Failed', 'error')
      }
    } catch {
      showToast('Something went wrong', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteGallery = async (id) => {
    if (!confirm('Delete this image?')) return
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setGalleryList((prev) => prev.filter((g) => g.id !== id))
      showToast('Image deleted')
    }
  }

  const handleDeleteBooking = async (id) => {
    if (!confirm('Delete this booking? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/admin/booking?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setBookingList((prev) => prev.filter((b) => b.id !== id))
        showToast('Booking deleted')
      } else {
        showToast('Failed to delete', 'error')
      }
    } catch {
      showToast('Something went wrong', 'error')
    }
  }

  // ─── Update Booking Status ───
  const handleUpdateBooking = async (id, updates) => {
    try {
      const res = await fetch('/api/admin/booking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      const data = await res.json()
      if (data.booking) {
        setBookingList((prev) =>
          prev.map((b) => (b.id === id ? { ...b, ...data.booking } : b))
        )
        if (viewBooking?.id === id) {
          setViewBooking({ ...viewBooking, ...data.booking })
        }
        showToast('Booking updated!')
      } else {
        showToast(data.error || 'Failed', 'error')
      }
    } catch {
      showToast('Something went wrong', 'error')
    }
  }

  // ─── Export Bookings as CSV ───
  const exportBookings = () => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Amount',
      'Status',
      'Date',
      'Message',
    ]
    const rows = bookingList.map((b) => [
      b.name,
      b.email,
      b.phone,
      b.amount,
      b.status,
      new Date(b.createdAt).toLocaleDateString('en-IN'),
      (b.message || '').replace(/,/g, ';'),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${Date.now()}.csv`
    a.click()
    showToast('Bookings exported!')
  }

  const handleDeleteContact = async (id) => {
    if (!confirm('Delete this message?')) return
    try {
      const res = await fetch(`/api/admin/contact?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setContactList((prev) => prev.filter((c) => c.id !== id))
        showToast('Message deleted')
      } else {
        showToast('Failed to delete', 'error')
      }
    } catch {
      showToast('Something went wrong', 'error')
    }
  }

  // Filtered bookings
  const filteredBookings = bookingList.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.email.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.phone.includes(bookingSearch)
    const matchesFilter = bookingFilter === 'all' || b.status === bookingFilter
    return matchesSearch && matchesFilter
  })

  // Filtered contacts
  const filteredContacts = contactList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.message.toLowerCase().includes(contactSearch.toLowerCase())
    const matchesReason =
      contactReasonFilter === 'all' || c.reason === contactReasonFilter
    return matchesSearch && matchesReason
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#E5EEE4',
        paddingTop: '90px',
      }}
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'fixed',
              top: 'clamp(80px, 12vw, 100px)',
              right: 'clamp(12px, 3vw, 24px)',
              left: 'clamp(12px, 3vw, auto)',
              maxWidth: '400px',
              marginLeft: 'auto',
              zIndex: 9999,
              background: toast.type === 'error' ? '#c53030' : '#3E2C23',
              color: '#FFF6DE',
              padding: '14px 20px',
              borderRadius: '14px',
              fontWeight: 600,
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: 'clamp(13px, 2vw, 15px)',
            }}
          >
            {toast.type === 'error' ? (
              <X size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <ImagePreviewModal
            image={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}
      </AnimatePresence>

      {/* ───────── Animated Hero Header ───────── */}
      <div
        style={{
          background: '#C0E1D2',
          padding: 'clamp(50px, 7vw, 80px) clamp(16px, 4vw, 24px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background circles */}
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

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(222, 128, 43, 0.15)',
                border: '1px solid rgba(222, 128, 43, 0.3)',
                borderRadius: '50px',
                padding: '6px 14px',
                fontSize: '12px',
                color: '#DE802B',
                marginBottom: '14px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              🛡️ Admin Control
            </motion.div>

            {/* Title */}
            <h1
              style={{
                fontSize: 'clamp(26px, 4.5vw, 38px)',
                fontWeight: 800,
                color: '#3E2C23',
                marginBottom: '8px',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}
            >
              Admin Panel
            </h1>
            <p
              style={{
                color: '#3E2C23',
                fontSize: 'clamp(13px, 2vw, 15px)',
                opacity: 0.8,
                fontWeight: 500,
                maxWidth: '600px',
                lineHeight: 1.6,
              }}
            >
              Manage hero images, consultation fees, services, gallery,
              bookings and customer messages — all in one place
            </p>

            {/* Quick Stats Pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
                flexWrap: 'wrap',
              }}
            >
              {[
                {
                  label: 'Total Items',
                  value:
                    heroImagesList.length +
                    serviceList.length +
                    galleryList.length,
                },
                {
                  label: 'Active Bookings',
                  value: bookingList.filter(
                    (b) => b.status === 'pending' || b.status === 'success'
                  ).length,
                },
                { label: 'New Messages', value: contactList.length },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(62, 44, 35, 0.08)',
                    border: '1px solid rgba(62, 44, 35, 0.12)',
                    borderRadius: '50px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    color: '#3E2C23',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      background: '#DE802B',
                      color: '#3E2C23',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '11px',
                    }}
                  >
                    {item.value}
                  </span>
                  {item.label}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(24px, 5vw, 40px) clamp(12px, 3vw, 24px)',
        }}
      >
        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'clamp(10px, 2vw, 16px)',
            marginBottom: 'clamp(24px, 4vw, 40px)',
          }}
        >
          {[
            { label: 'Hero', value: heroImagesList.length, icon: ImageIcon },
            { label: 'Services', value: serviceList.length, icon: Package },
            { label: 'Gallery', value: galleryList.length, icon: ImageIcon },
            { label: 'Bookings', value: bookingList.length, icon: BookOpen },
            {
              label: 'Messages',
              value: contactList.length,
              icon: MessageSquare,
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: '#C0E1D2',
                borderRadius: '16px',
                padding: 'clamp(14px, 2.5vw, 20px)',
                boxShadow: '0 2px 12px rgba(62,44,35,0.07)',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(10px, 2vw, 14px)',
              }}
            >
              <s.icon size={22} color="#3E2C23" style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 'clamp(18px, 3vw, 24px)',
                    fontWeight: 800,
                    color: '#3E2C23',
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: '12px', color: '#3E2C23' }}>
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: 'clamp(20px, 4vw, 32px)',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '8px',
          }}
          className="hide-scrollbar"
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              animate={{
                background: activeTab === tab.id ? '#C0E1D2' : '#C0E1D2',
                color: activeTab === tab.id ? '#DE802B' : '#3E2C23',
              }}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRadius: '50px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* ─── HERO IMAGES TAB ─── */}
            {activeTab === 'hero' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                  gap: 'clamp(20px, 4vw, 32px)',
                }}
              >
                <div>
                  <SectionTitle icon={Plus}>Add Hero Image</SectionTitle>
                  <form
                    onSubmit={handleUploadHero}
                    encType="multipart/form-data"
                    style={formCardStyle}
                  >
                    <div
                      style={{
                        padding: '14px',
                        background: '#C0E1D2',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: '#3E2C23',
                        lineHeight: 1.6,
                      }}
                    >
                      📌 Upload multiple high-quality images (1920x1080+) for
                      the homepage hero carousel. Images will auto-rotate every
                      5 seconds.
                    </div>
                    <input
                      name="title"
                      placeholder="Image Title (optional)"
                      style={adminInput}
                    />
                    <UploadBox />
                    <SubmitButton uploading={uploading}>
                      {uploading ? '⏳ Uploading...' : '+ Add Hero Image'}
                    </SubmitButton>
                  </form>
                </div>

                <div>
                  <SectionTitle>
                    Hero Carousel ({heroImagesList.length})
                  </SectionTitle>
                  <div
                    style={{
                      background: '#E5EEE4',
                      borderRadius: '20px',
                      padding: 'clamp(16px, 3vw, 20px)',
                      boxShadow: '0 2px 16px rgba(62,44,35,0.08)',
                      maxHeight: '600px',
                      overflowY: 'auto',
                    }}
                  >
                    {heroImagesList.length > 0 ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                        }}
                      >
                        {heroImagesList.map((img, idx) => (
                          <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            style={{
                              background: '#fff',
                              borderRadius: '14px',
                              padding: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              boxShadow: '0 2px 8px rgba(62,44,35,0.05)',
                            }}
                          >
                            <div
                              style={{
                                background: '#d4a96a',
                                color: '#3E2C23',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '13px',
                                flexShrink: 0,
                              }}
                            >
                              {idx + 1}
                            </div>
                            <div
                              style={{
                                position: 'relative',
                                width: '80px',
                                height: '60px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                flexShrink: 0,
                                background: '#3E2C23',
                                cursor: 'pointer',
                              }}
                              onClick={() => setPreviewImage(img.imageUrl)}
                            >
                              <Image
                                src={img.imageUrl}
                                alt={img.title || `Hero ${idx + 1}`}
                                fill
                                sizes="80px"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontWeight: 700,
                                  color: '#3E2C23',
                                  fontSize: '13px',
                                  marginBottom: '2px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {img.title || `Hero Image ${idx + 1}`}
                              </div>
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: '#7a5c45',
                                }}
                              >
                                Slide #{idx + 1}
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setPreviewImage(img.imageUrl)}
                              style={iconBtnStyle(
                                'rgba(62,44,35,0.1)',
                                '#3E2C23'
                              )}
                              title="View"
                            >
                              <Eye size={16} />
                            </motion.button>
                            <DeleteButton
                              onClick={() => handleDeleteHero(img.id)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <EmptyImageBox />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ─── FEE TAB ─── */}
            {activeTab === 'fee' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                  gap: 'clamp(20px, 4vw, 32px)',
                }}
              >
                <div>
                  <SectionTitle icon={CreditCard}>
                    Set Consultation Fee
                  </SectionTitle>
                  <form onSubmit={handleSaveFee} style={formCardStyle}>
                    <div>
                      <label
                        style={{
                          fontSize: '13px',
                          color: '#3E2C23',
                          fontWeight: 600,
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Meeting Fee (₹)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span
                          style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#3E2C23',
                            fontSize: '18px',
                            fontWeight: 700,
                          }}
                        >
                          ₹
                        </span>
                        <input
                          type="number"
                          step="50"
                          min="0"
                          value={consultationFee}
                          onChange={(e) => setConsultationFee(e.target.value)}
                          placeholder="0 = Free, or amount"
                          required
                          style={{
                            ...adminInput,
                            paddingLeft: '36px',
                            fontSize: '18px',
                            fontWeight: 700,
                          }}
                        />
                      </div>
                    </div>

                    <SubmitButton uploading={savingFee} icon={Save}>
                      {savingFee ? 'Saving...' : 'Save Fee'}
                    </SubmitButton>
                  </form>
                </div>

                <div>
                  <SectionTitle>Current Status</SectionTitle>
                  <div
                    style={{
                      background:
                        parseFloat(consultationFee) > 0
                          ? 'linear-gradient(135deg, #3E2C23 0%, #5a3d2b 100%)'
                          : 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
                      borderRadius: '20px',
                      padding: 'clamp(28px, 5vw, 40px) clamp(20px, 4vw, 32px)',
                      textAlign: 'center',
                      color: '#FFF6DE',
                      boxShadow: '0 8px 30px rgba(62,44,35,0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '13px',
                        opacity: 0.8,
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      {parseFloat(consultationFee) > 0
                        ? 'Paid Consultation'
                        : 'Free Consultation'}
                    </div>
                    <div
                      style={{
                        fontSize: 'clamp(36px, 7vw, 48px)',
                        fontWeight: 800,
                        lineHeight: 1,
                        marginBottom: '8px',
                        wordBreak: 'break-word',
                      }}
                    >
                      {parseFloat(consultationFee) > 0
                        ? `₹${parseFloat(consultationFee).toLocaleString()}`
                        : 'FREE'}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.7 }}>
                      {parseFloat(consultationFee) > 0
                        ? 'per meeting booking'
                        : 'No charge for meetings'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SERVICES TAB ─── */}
            {activeTab === 'services' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                  gap: 'clamp(20px, 4vw, 32px)',
                }}
              >
                <div>
                  <SectionTitle icon={Plus}>Add New Service</SectionTitle>
                  <form
                    onSubmit={handleAddService}
                    encType="multipart/form-data"
                    style={formCardStyle}
                  >
                    <input
                      name="title"
                      placeholder="Service Title"
                      required
                      style={adminInput}
                    />
                    <textarea
                      name="description"
                      placeholder="Description"
                      required
                      rows={3}
                      style={{ ...adminInput, resize: 'vertical' }}
                    />
                    <UploadBox small />
                    <SubmitButton uploading={uploading}>
                      {uploading ? '⏳ Uploading...' : '+ Add Service'}
                    </SubmitButton>
                  </form>
                </div>

                <div>
                  <SectionTitle>
                    Current Services ({serviceList.length})
                  </SectionTitle>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      maxHeight: '500px',
                      overflowY: 'auto',
                    }}
                  >
                    {serviceList.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          background: '#C0E1D2',
                          borderRadius: '14px',
                          padding: '14px',
                          boxShadow: '0 2px 10px rgba(62,44,35,0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
                          onClick={() => s.image && setPreviewImage(s.image)}
                          style={{
                            position: 'relative',
                            width: '52px',
                            height: '52px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: 'rgba(62,44,35,0.08)',
                            cursor: s.image ? 'pointer' : 'default',
                          }}
                        >
                          {s.image && (
                            <Image
                              src={s.image}
                              alt={s.title}
                              fill
                              sizes="52px"
                              style={{ objectFit: 'cover' }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              color: '#3E2C23',
                              fontSize: '14px',
                              marginBottom: '4px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {s.title}
                          </div>
                          <div
                            style={{
                              color: '#3E2C23',
                              fontSize: '12px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {s.description?.slice(0, 60)}...
                          </div>
                        </div>

                        {s.image && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPreviewImage(s.image)}
                            style={iconBtnStyle(
                              'rgba(62,44,35,0.1)',
                              '#3E2C23'
                            )}
                            title="View"
                          >
                            <Eye size={16} />
                          </motion.button>
                        )}
                        <DeleteButton
                          onClick={() => handleDeleteService(s.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── GALLERY TAB ─── */}
            {activeTab === 'gallery' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                  gap: 'clamp(20px, 4vw, 32px)',
                }}
              >
                <div>
                  <SectionTitle>Add Gallery Image</SectionTitle>
                  <form
                    onSubmit={handleAddGallery}
                    encType="multipart/form-data"
                    style={formCardStyle}
                  >
                    <input
                      name="title"
                      placeholder="Image Title"
                      required
                      style={adminInput}
                    />
                    <UploadBox small />
                    <SubmitButton uploading={uploading}>
                      {uploading ? '⏳ Uploading...' : '+ Add Image'}
                    </SubmitButton>
                  </form>
                </div>

                <div>
                  <SectionTitle>Gallery ({galleryList.length})</SectionTitle>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(120px, 1fr))',
                      gap: '12px',
                      maxHeight: '500px',
                      overflowY: 'auto',
                    }}
                  >
                    {galleryList.map((item) => (
                      <div key={item.id} style={{ position: 'relative' }}>
                        <div
                          onClick={() =>
                            item.imageUrl && setPreviewImage(item.imageUrl)
                          }
                          style={{
                            position: 'relative',
                            height: '110px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: 'rgba(62,44,35,0.05)',
                            cursor: 'pointer',
                          }}
                        >
                          {item.imageUrl && (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              sizes="120px"
                              style={{ objectFit: 'cover' }}
                            />
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#7a5c45',
                            marginTop: '6px',
                            textAlign: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.title}
                        </div>

                        <div
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            display: 'flex',
                            gap: '4px',
                          }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setPreviewImage(item.imageUrl)}
                            style={{
                              background: 'rgba(62,44,35,0.85)',
                              border: 'none',
                              borderRadius: '6px',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#fff',
                            }}
                            title="View"
                          >
                            <Eye size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleDeleteGallery(item.id)}
                            style={{
                              background: 'rgba(229,62,62,0.85)',
                              border: 'none',
                              borderRadius: '6px',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#fff',
                            }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── BOOKINGS TAB ─── */}
            {activeTab === 'bookings' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <SectionTitle>
                    All Bookings ({filteredBookings.length})
                  </SectionTitle>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportBookings}
                    style={{
                      background: '#DE802B',
                      color: '#3E2C23',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Download size={15} /> Export CSV
                  </motion.button>
                </div>

                {/* Search + Status Filters */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      flex: 1,
                      minWidth: '200px',
                    }}
                  >
                    <Search
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#3E2C23',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      style={{
                        ...adminInput,
                        paddingLeft: '38px',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'pending', label: 'Pending' },
                      { id: 'success', label: 'Success' },
                      { id: 'failed', label: 'Failed' },
                    ].map((f) => (
                      <motion.button
                        key={f.id}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setBookingFilter(f.id)}
                        style={{
                          background:
                            bookingFilter === f.id ? '#3E2C23' : '#FFFFFF',
                          color:
                            bookingFilter === f.id ? '#C0E1D2' : '#3E2C23',
                          border: '1px solid rgba(62,44,35,0.15)',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        {f.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Mobile: Cards */}
                <div className="bookings-mobile" style={{ display: 'none' }}>
                  {filteredBookings.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      onView={() => setViewBooking(b)}
                      onDelete={() => handleDeleteBooking(b.id)}
                      onUpdateStatus={(status) =>
                        handleUpdateBooking(b.id, { status })
                      }
                    />
                  ))}
                </div>

                {/* Desktop: Table */}
                <div
                  className="bookings-desktop"
                  style={{
                    background: '#fff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 16px rgba(62,44,35,0.08)',
                  }}
                >
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '14px',
                        minWidth: '900px',
                      }}
                    >
                      <thead>
                        <tr style={{ background: '#C0E1D2', color: '#3E2C23' }}>
                          {[
                            'Name',
                            'Contact',
                            'Amount',
                            'Status',
                            'Date',
                            'Actions',
                          ].map((h) => (
                            <th
                              key={h}
                              style={{
                                padding: '14px 16px',
                                textAlign: 'left',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((b, i) => (
                          <tr
                            key={b.id}
                            style={{
                              borderBottom: '1px solid rgba(62,44,35,0.06)',
                              background:
                                i % 2 === 0 ? '#fff' : 'rgba(62,44,35,0.02)',
                            }}
                          >
                            <td
                              style={{
                                padding: '14px 16px',
                                fontWeight: 600,
                                color: '#3E2C23',
                              }}
                            >
                              {b.name}
                            </td>
                            <td
                              style={{
                                padding: '14px 16px',
                                color: '#7a5c45',
                              }}
                            >
                              <div style={{ fontSize: '13px' }}>{b.email}</div>
                              <div style={{ fontSize: '12px', opacity: 0.7 }}>
                                {b.phone}
                              </div>
                            </td>
                            <td
                              style={{
                                padding: '14px 16px',
                                fontWeight: 700,
                                color: b.amount > 0 ? '#3E2C23' : '#38a169',
                              }}
                            >
                              {b.amount > 0
                                ? `₹${b.amount.toLocaleString()}`
                                : 'FREE'}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <StatusBadge status={b.status} />
                            </td>
                            <td
                              style={{
                                padding: '14px 16px',
                                color: '#7a5c45',
                                whiteSpace: 'nowrap',
                                fontSize: '13px',
                              }}
                            >
                              {new Date(b.createdAt).toLocaleDateString(
                                'en-IN'
                              )}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setViewBooking(b)}
                                  style={iconBtnStyle(
                                    'rgba(222,128,43,0.15)',
                                    '#DE802B'
                                  )}
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </motion.button>
                                <DeleteButton
                                  onClick={() => handleDeleteBooking(b.id)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredBookings.length === 0 && (
                      <div
                        style={{
                          padding: '60px 24px',
                          textAlign: 'center',
                          color: '#7a5c45',
                        }}
                      >
                        <BookOpen
                          size={40}
                          color="rgba(62,44,35,0.2)"
                          style={{ margin: '0 auto 12px' }}
                        />
                        <p>No bookings match your filter</p>
                      </div>
                    )}
                  </div>
                </div>

                <style jsx>{`
                  @media (max-width: 768px) {
                    .bookings-mobile {
                      display: block !important;
                    }
                    .bookings-desktop {
                      display: none !important;
                    }
                  }
                `}</style>
              </div>
            )}

            {/* ─── CONTACTS TAB ─── */}
            {activeTab === 'contacts' && (
              <div>
                <SectionTitle>
                  Contact Messages ({filteredContacts.length})
                </SectionTitle>

                {/* Search */}
                <div
                  style={{
                    position: 'relative',
                    marginBottom: '16px',
                  }}
                >
                  <Search
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#3E2C23',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    style={{
                      ...adminInput,
                      paddingLeft: '38px',
                    }}
                  />
                </div>

                {/* ─── REASON FILTER CHIPS (correct location!) ─── */}
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                  }}
                >
                  {[
                    { id: 'all', label: 'All', icon: '📋' },
                    { id: 'general', label: 'General', icon: '💬' },
                    { id: 'education', label: 'Education', icon: '🎓' },
                    { id: 'jobs', label: 'Jobs', icon: '💼' },
                    { id: 'visa', label: 'Visa', icon: '📋' },
                    { id: 'test-prep', label: 'Test Prep', icon: '📚' },
                    { id: 'other', label: 'Other', icon: '✨' },
                  ].map((r) => (
                    <motion.button
                      key={r.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setContactReasonFilter(r.id)}
                      style={{
                        background:
                          contactReasonFilter === r.id
                            ? '#3E2C23'
                            : '#FFFFFF',
                        color:
                          contactReasonFilter === r.id
                            ? '#DE802B'
                            : '#3E2C23',
                        border: '1px solid rgba(62,44,35,0.15)',
                        padding: '7px 14px',
                        borderRadius: '50px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <span>{r.icon}</span>
                      {r.label}
                    </motion.button>
                  ))}
                </div>

                {/* Contact List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {filteredContacts.map((c, i) => {
                    const reasonInfo = c.reason ? REASON_MAP[c.reason] : null

                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{
                          background: '#C0E1D2',
                          borderRadius: '18px',
                          padding: 'clamp(16px, 3vw, 24px)',
                          boxShadow: '0 2px 12px rgba(62,44,35,0.07)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginBottom: '12px',
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                flexWrap: 'wrap',
                                marginBottom: '4px',
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 700,
                                  color: '#3E2C23',
                                  fontSize: 'clamp(15px, 2vw, 16px)',
                                }}
                              >
                                {c.name}
                              </div>
                              {/* Reason Chip */}
                              {reasonInfo && (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: reasonInfo.color,
                                    color: '#FFFFFF',
                                    padding: '3px 10px',
                                    borderRadius: '50px',
                                    fontSize: '10px',
                                    fontWeight: 800,
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    boxShadow: `0 2px 8px ${reasonInfo.color}40`,
                                  }}
                                >
                                  <span style={{ fontSize: '12px' }}>
                                    {reasonInfo.icon}
                                  </span>
                                  {reasonInfo.label}
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                color: '#3E2C23',
                                fontSize: '13px',
                                wordBreak: 'break-word',
                                opacity: 0.75,
                              }}
                            >
                              {c.email}
                              {c.phone && ` • ${c.phone}`}
                            </div>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#3E2C23',
                                whiteSpace: 'nowrap',
                                opacity: 0.7,
                              }}
                            >
                              {new Date(c.createdAt).toLocaleDateString(
                                'en-IN',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setViewContact(c)}
                              style={iconBtnStyle(
                                'rgba(222,128,43,0.15)',
                                '#DE802B'
                              )}
                              title="View"
                            >
                              <Eye size={16} />
                            </motion.button>
                            <DeleteButton
                              onClick={() => handleDeleteContact(c.id)}
                            />
                          </div>
                        </div>
                        <p
                          style={{
                            color: '#3E2C23',
                            fontSize: 'clamp(14px, 2vw, 15px)',
                            lineHeight: 1.7,
                            background: 'rgba(255,255,255,0.4)',
                            padding: '14px',
                            borderRadius: '10px',
                            wordBreak: 'break-word',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {c.message}
                        </p>
                      </motion.div>
                    )
                  })}

                  {filteredContacts.length === 0 && (
                    <div
                      style={{
                        padding: '60px 24px',
                        textAlign: 'center',
                        color: '#7a5c45',
                        background: '#fff',
                        borderRadius: '20px',
                      }}
                    >
                      <MessageSquare
                        size={40}
                        color="rgba(62,44,35,0.2)"
                        style={{ margin: '0 auto 12px' }}
                      />
                      <p>No messages found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Booking Details Modal */}
        <AnimatePresence>
          {viewBooking && (
            <BookingDetailModal
              booking={viewBooking}
              onClose={() => setViewBooking(null)}
              onUpdate={(updates) =>
                handleUpdateBooking(viewBooking.id, updates)
              }
            />
          )}
        </AnimatePresence>

        {/* Contact Details Modal */}
        <AnimatePresence>
          {viewContact && (
            <ContactDetailModal
              contact={viewContact}
              onClose={() => setViewContact(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Image Preview Modal ───
function ImagePreviewModal({ image, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
        }}
      >
        <X size={22} />
      </motion.button>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        <img
          src={image}
          alt="Preview"
          style={{
            display: 'block',
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
          }}
        />
      </motion.div>
    </motion.div>
  )
}

// ─── Helper Components ───
function SectionTitle({ icon: Icon, children }) {
  return (
    <h2
      style={{
        fontSize: 'clamp(17px, 2.5vw, 20px)',
        fontWeight: 700,
        color: '#3E2C23',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {Icon && <Icon size={20} />}
      {children}
    </h2>
  )
}

function UploadBox({ small }) {
  return (
    <div
      style={{
        border: '2px dashed rgba(62,44,35,0.2)',
        borderRadius: '12px',
        padding: small ? '20px' : '30px',
        textAlign: 'center',
      }}
    >
      <Upload
        size={small ? 24 : 32}
        color="#7a5c45"
        style={{ margin: '0 auto 8px' }}
      />
      {!small && (
        <p
          style={{
            fontSize: '13px',
            color: '#7a5c45',
            marginBottom: '8px',
          }}
        >
          Upload
        </p>
      )}
      <input
        name="image"
        type="file"
        accept="image/*"
        required
        style={{ fontSize: '13px', maxWidth: '100%' }}
      />
    </div>
  )
}

function SubmitButton({ uploading, children, icon: Icon }) {
  return (
    <motion.button
      type="submit"
      disabled={uploading}
      whileHover={{ scale: uploading ? 1 : 1.02 }}
      style={{
        background: uploading ? 'rgba(62,44,35,0.4)' : '#3E2C23',
        color: '#C0E1D2',
        border: 'none',
        padding: '14px',
        borderRadius: '12px',
        fontWeight: 700,
        cursor: uploading ? 'not-allowed' : 'pointer',
        fontSize: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      {Icon && <Icon size={18} />}
      {children}
    </motion.button>
  )
}

function DeleteButton({ onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        background: 'rgba(229,62,62,0.1)',
        border: 'none',
        borderRadius: '10px',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#e53e3e',
        flexShrink: 0,
      }}
      title="Delete"
    >
      <Trash2 size={16} />
    </motion.button>
  )
}

function EmptyImageBox() {
  return (
    <div
      style={{
        height: 'clamp(180px, 30vw, 240px)',
        borderRadius: '14px',
        background: 'rgba(62,44,35,0.05)',
        border: '2px dashed rgba(62,44,35,0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        color: '#7a5c45',
      }}
    >
      <ImageIcon size={40} />
      <p style={{ fontSize: '14px' }}>No hero images uploaded</p>
    </div>
  )
}

// ─── Status Badge ───
function StatusBadge({ status }) {
  const config = {
    success: {
      bg: 'rgba(56,161,105,0.15)',
      color: '#38a169',
      icon: CheckCircle,
      label: 'Confirmed',
    },
    pending: {
      bg: 'rgba(214,158,46,0.15)',
      color: '#d69e2e',
      icon: Clock,
      label: 'Pending',
    },
    failed: {
      bg: 'rgba(229,62,62,0.15)',
      color: '#e53e3e',
      icon: XCircle,
      label: 'Failed',
    },
    completed: {
      bg: 'rgba(62,128,222,0.15)',
      color: '#3b82f6',
      icon: CheckCircle,
      label: 'Completed',
    },
  }
  const cfg = config[status] || config.pending
  const Icon = cfg.icon

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 12px',
        borderRadius: '50px',
        fontSize: '12px',
        fontWeight: 700,
        background: cfg.bg,
        color: cfg.color,
        textTransform: 'capitalize',
      }}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  )
}

// ─── Booking Card (Mobile) ───
function BookingCard({ booking: b, onView, onDelete, onUpdateStatus }) {
  return (
    <div
      style={{
        background: '#C0E1D2',
        borderRadius: '14px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 2px 10px rgba(62,44,35,0.06)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '10px',
          gap: '10px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              color: '#3E2C23',
              fontSize: '15px',
              marginBottom: '4px',
            }}
          >
            {b.name}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#3E2C23',
              wordBreak: 'break-all',
              opacity: 0.8,
            }}
          >
            {b.email}
          </div>
          <div style={{ fontSize: '12px', color: '#7a5c45' }}>{b.phone}</div>
        </div>
        <StatusBadge status={b.status} />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '10px',
          borderTop: '1px solid rgba(62,44,35,0.1)',
          gap: '10px',
        }}
      >
        <span
          style={{
            fontWeight: 700,
            color: b.amount > 0 ? '#3E2C23' : '#38a169',
            fontSize: '15px',
          }}
        >
          {b.amount > 0 ? `₹${b.amount.toLocaleString()}` : 'FREE'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onView}
            style={iconBtnStyle('rgba(222,128,43,0.2)', '#DE802B')}
            title="View"
          >
            <Eye size={16} />
          </motion.button>
          <DeleteButton onClick={onDelete} />
        </div>
      </div>
    </div>
  )
}

// ─── Booking Detail Modal ───
function BookingDetailModal({ booking, onClose, onUpdate }) {
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes || '')
  const [meetingDate, setMeetingDate] = useState(
    booking.meetingDate
      ? new Date(booking.meetingDate).toISOString().split('T')[0]
      : ''
  )
  const [savingNotes, setSavingNotes] = useState(false)

  const handleSaveNotes = async () => {
    setSavingNotes(true)
    await onUpdate({ adminNotes, meetingDate })
    setSavingNotes(false)
  }

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
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#3E2C23',
            color: '#FFF6DE',
            padding: '24px 28px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '11px',
                color: '#DE802B',
                fontWeight: 700,
                letterSpacing: '1px',
                marginBottom: '4px',
              }}
            >
              BOOKING DETAILS
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>
              {booking.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#DE802B',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#3E2C23',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '28px' }}>
          {/* Contact Info */}
          <div style={{ marginBottom: '24px' }}>
            <SectionLabel>Contact Info</SectionLabel>
            <div
              style={{
                display: 'grid',
                gap: '10px',
                marginTop: '12px',
              }}
            >
              <InfoRow icon={Mail} label="Email" value={booking.email} />
              <InfoRow icon={Phone} label="Phone" value={booking.phone} />
              <InfoRow
                icon={Calendar}
                label="Booked On"
                value={new Date(booking.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
            </div>
          </div>

          {/* Payment Info */}
          <div
            style={{
              background: '#C0E1D2',
              padding: '16px 20px',
              borderRadius: '14px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#3E2C23',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  opacity: 0.7,
                  textTransform: 'uppercase',
                }}
              >
                Payment Amount
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: booking.amount > 0 ? '#DE802B' : '#38a169',
                  marginTop: '4px',
                }}
              >
                {booking.amount > 0
                  ? `₹${booking.amount.toLocaleString()}`
                  : 'FREE'}
              </div>
              {booking.razorpayPaymentId && (
                <div
                  style={{
                    fontSize: '11px',
                    color: '#3E2C23',
                    marginTop: '6px',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    opacity: 0.65,
                  }}
                >
                  ID: {booking.razorpayPaymentId}
                </div>
              )}
            </div>
            <StatusBadge status={booking.status} />
          </div>

          {/* Customer Message */}
          {booking.message && (
            <div style={{ marginBottom: '24px' }}>
              <SectionLabel>Customer Message</SectionLabel>
              <p
                style={{
                  marginTop: '10px',
                  padding: '14px',
                  background: '#E5EEE4',
                  borderRadius: '10px',
                  color: '#3E2C23',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  wordBreak: 'break-word',
                }}
              >
                {booking.message}
              </p>
            </div>
          )}

          {/* Update Status */}
          <div style={{ marginBottom: '24px' }}>
            <SectionLabel>Update Status</SectionLabel>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '10px',
                flexWrap: 'wrap',
              }}
            >
              {[
                { id: 'pending', label: 'Pending', color: '#d69e2e' },
                { id: 'success', label: 'Confirmed', color: '#38a169' },
                { id: 'completed', label: 'Completed', color: '#3b82f6' },
                { id: 'failed', label: 'Failed', color: '#e53e3e' },
              ].map((s) => (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdate({ status: s.id })}
                  style={{
                    background: booking.status === s.id ? s.color : '#fff',
                    color: booking.status === s.id ? '#fff' : s.color,
                    border: `2px solid ${s.color}`,
                    padding: '8px 16px',
                    borderRadius: '50px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  {s.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Meeting Date */}
          <div style={{ marginBottom: '20px' }}>
            <SectionLabel>Meeting Date (Optional)</SectionLabel>
            <input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              style={{
                ...adminInput,
                marginTop: '10px',
              }}
            />
          </div>

          {/* Admin Notes */}
          <div style={{ marginBottom: '20px' }}>
            <SectionLabel>Admin Notes (Private)</SectionLabel>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about this booking..."
              rows={3}
              style={{
                ...adminInput,
                marginTop: '10px',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Save + Actions */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveNotes}
              disabled={savingNotes}
              style={{
                flex: 1,
                minWidth: '140px',
                background: '#3E2C23',
                color: '#C0E1D2',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: savingNotes ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Save size={16} />
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={`tel:${booking.phone}`}
              style={{
                background: '#DE802B',
                color: '#3E2C23',
                border: 'none',
                padding: '14px 18px',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
              }}
            >
              <Phone size={16} /> Call
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={`mailto:${booking.email}`}
              style={{
                background: '#C0E1D2',
                color: '#3E2C23',
                border: '2px solid #3E2C23',
                padding: '12px 18px',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
              }}
            >
              <Mail size={16} /> Email
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Contact Detail Modal ───
function ContactDetailModal({ contact, onClose }) {
  const reasonInfo = contact.reason ? REASON_FULL_MAP[contact.reason] : null

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
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#3E2C23',
            color: '#FFF6DE',
            padding: '24px 28px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 2,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: '11px',
                color: '#DE802B',
                fontWeight: 700,
                letterSpacing: '1px',
              }}
            >
              CONTACT MESSAGE
            </div>
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 800,
                marginTop: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {contact.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#DE802B',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#3E2C23',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '28px' }}>
          {/* Reason Badge (Prominent) */}
          {reasonInfo && (
            <div style={{ marginBottom: '24px' }}>
              <SectionLabel>Reason for Inquiry</SectionLabel>
              <div
                style={{
                  marginTop: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: `linear-gradient(135deg, ${reasonInfo.color} 0%, ${reasonInfo.color}dd 100%)`,
                  color: '#FFFFFF',
                  padding: '12px 20px',
                  borderRadius: '50px',
                  fontWeight: 800,
                  fontSize: '14px',
                  boxShadow: `0 8px 22px ${reasonInfo.color}50`,
                  letterSpacing: '0.5px',
                }}
              >
                <span style={{ fontSize: '20px' }}>{reasonInfo.icon}</span>
                {reasonInfo.label}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div style={{ marginBottom: '20px' }}>
            <SectionLabel>Contact Info</SectionLabel>
            <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
              <InfoRow icon={Mail} label="Email" value={contact.email} />
              {contact.phone && (
                <InfoRow icon={Phone} label="Phone" value={contact.phone} />
              )}
              <InfoRow
                icon={Calendar}
                label="Sent On"
                value={new Date(contact.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
            </div>
          </div>

          {/* Full Message */}
          <div style={{ marginBottom: '24px' }}>
            <SectionLabel>Full Message</SectionLabel>
            <p
              style={{
                marginTop: '10px',
                padding: '16px',
                background: '#E5EEE4',
                borderRadius: '12px',
                color: '#3E2C23',
                fontSize: '15px',
                lineHeight: 1.8,
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                border: '1px solid rgba(62,44,35,0.08)',
              }}
            >
              {contact.message}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={`mailto:${contact.email}?subject=Re: ${
                reasonInfo ? reasonInfo.label : 'Your Inquiry'
              } - ${contact.name}`}
              style={{
                flex: 1,
                minWidth: '140px',
                background: '#DE802B',
                color: '#FFFFFF',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none',
                boxShadow: '0 6px 18px rgba(222,128,43,0.4)',
              }}
            >
              <Mail size={16} /> Reply via Email
            </motion.a>
            {contact.phone && (
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`tel:${contact.phone}`}
                style={{
                  background: '#3E2C23',
                  color: '#C0E1D2',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                }}
              >
                <Phone size={16} /> Call
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Small Helpers ───
function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: '11px',
        color: '#DE802B',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}
    >
      {children}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        background: '#E5EEE4',
        borderRadius: '10px',
      }}
    >
      <Icon size={16} color="#DE802B" style={{ flexShrink: 0 }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: '11px',
            color: '#3E2C23',
            opacity: 0.6,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#3E2C23',
            fontWeight: 600,
            wordBreak: 'break-word',
          }}
        >
          {value}
        </div>
      </div>
    </div>
  )
}

const iconBtnStyle = (bg, color) => ({
  background: bg,
  border: 'none',
  borderRadius: '8px',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: color,
  backdropFilter: 'blur(8px)',
})

const formCardStyle = {
  background: '#FFFFFF',
  borderRadius: '20px',
  padding: 'clamp(20px, 4vw, 32px)',
  boxShadow: '0 2px 16px rgba(62,44,35,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

const adminInput = {
  width: '100%',
  padding: '13px 16px',
  border: '1.5px solid rgba(62,44,35,0.12)',
  borderRadius: '12px',
  background: 'rgba(62,44,35,0.03)',
  color: '#3E2C23',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}