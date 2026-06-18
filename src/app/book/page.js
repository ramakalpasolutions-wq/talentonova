// src/app/book/page.js
'use client'
import { useState, useEffect } from 'react'
import Script from 'next/script'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  CreditCard,
  Shield,
  Send,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react'

export default function BookPage() {
  const { data: session } = useSession()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [consultationFee, setConsultationFee] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [feeLoaded, setFeeLoaded] = useState(false)

  // Fetch consultation fee from settings
  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setConsultationFee(parseFloat(data.consultationFee || 0))
        setFeeLoaded(true)
      })
      .catch(() => setFeeLoaded(true))
  }, [])

  // Pre-fill from session
  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
      }))
    }
  }, [session])

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const isPaid = consultationFee > 0

  // FREE BOOKING
  const handleFreeBooking = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (res.ok) {
        setSuccess({ type: 'free' })
      } else {
        setError(data.error || 'Booking failed')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // PAID BOOKING via Razorpay
  const handlePaidBooking = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: consultationFee }),
      })

      const { orderId, error: orderError } = await orderRes.json()

      if (orderError || !orderId) {
        setError(orderError || 'Failed to create order')
        setLoading(false)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: consultationFee * 100,
        currency: 'INR',
        name: 'TalentaNova Consultancy',
        description: 'In-Person Consultation Booking',
        order_id: orderId,
        handler: async function (response) {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              bookingData: { ...form, amount: consultationFee },
            }),
          })

          const data = await verifyRes.json()
          if (data.success) {
            setSuccess({
              type: 'paid',
              paymentId: response.razorpay_payment_id,
              amount: consultationFee,
            })
          } else {
            setError('Payment verification failed')
          }
          setLoading(false)
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#DE802B' },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setError('Payment cancelled')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        setError(response.error?.description || 'Payment failed')
        setLoading(false)
      })
      rzp.open()
    } catch (err) {
      console.error(err)
      setError('Something went wrong')
      setLoading(false)
    }
  }

  const handleSubmit = isPaid ? handlePaidBooking : handleFreeBooking

  // ─── SUCCESS SCREEN ───
  if (success) {
    return (
      <PageWrapper>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={successCard}
        >
          <motion.div
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'rgba(56,161,105,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            <CheckCircle size={56} color="#38a169" />
          </motion.div>

          <h2
            style={{
              fontSize: 'clamp(22px, 3vw, 28px)',
              fontWeight: 800,
              color: '#3E2C23',
              margin: '24px 0 12px',
            }}
          >
            {success.type === 'paid'
              ? 'Payment Successful! 🎉'
              : 'Meeting Requested! 🎉'}
          </h2>

          <p
            style={{
              color: '#3E2C23',
              fontSize: 'clamp(14px, 2vw, 16px)',
              lineHeight: 1.7,
              opacity: 0.85,
            }}
          >
            {success.type === 'paid'
              ? `Your in-person consultation has been booked. We'll contact you within 24 hours to schedule the meeting.`
              : `Thank you for your interest! Our team will contact you within 24 hours to schedule a meeting.`}
          </p>

          {success.type === 'paid' && (
            <div
              style={{
                background: '#C0E1D2',
                borderRadius: '14px',
                padding: '20px',
                margin: '24px 0',
                border: '1px solid rgba(62,44,35,0.08)',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#3E2C23',
                  fontWeight: 600,
                  opacity: 0.7,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Amount Paid
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#DE802B',
                  margin: '6px 0 12px',
                }}
              >
                ₹{success.amount?.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#3E2C23',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  opacity: 0.6,
                }}
              >
                Payment ID: {success.paymentId}
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginTop: '24px',
              flexWrap: 'wrap',
            }}
          >
            <a href="/" style={primaryBtn}>
              Home
            </a>
            <a href="/dashboard" style={secondaryBtn}>
              Dashboard
            </a>
          </div>
        </motion.div>
      </PageWrapper>
    )
  }

  // ─── LOADING ───
  if (!feeLoaded) {
    return (
      <PageWrapper>
        <div
          style={{
            color: '#3E2C23',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          Loading...
        </div>
      </PageWrapper>
    )
  }

  // ─── MAIN FORM ───
  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={formCard}
      >
        {/* Badge */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: isPaid
                ? 'rgba(222, 128, 43, 0.15)'
                : 'rgba(56,161,105,0.12)',
              border: `1px solid ${
                isPaid ? 'rgba(222, 128, 43, 0.3)' : 'rgba(56,161,105,0.25)'
              }`,
              color: isPaid ? '#DE802B' : '#38a169',
              padding: '6px 16px',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={12} />
            {isPaid ? 'Premium Consultation' : 'Free Consultation'}
          </div>
        </div>

        <h2
          style={{
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 800,
            color: '#3E2C23',
            marginBottom: '8px',
            textAlign: 'center',
            letterSpacing: '-0.5px',
          }}
        >
          Book a Meeting
        </h2>
        <p
          style={{
            color: '#3E2C23',
            marginBottom: '24px',
            fontSize: 'clamp(13px, 2vw, 14px)',
            textAlign: 'center',
            lineHeight: 1.6,
            opacity: 0.75,
          }}
        >
          Schedule an in-person meeting to discuss your abroad education or
          career goals with our experts
        </p>

        {/* Meeting Info Card */}
        <div
          style={{
            background: '#C0E1D2',
            border: '1px solid rgba(62,44,35,0.08)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(222, 128, 43, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Calendar size={16} color="#DE802B" />
            </div>
            <span
              style={{
                fontSize: '13px',
                color: '#3E2C23',
                fontWeight: 600,
              }}
            >
              In-Person Meeting (30–45 mins)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(222, 128, 43, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MapPin size={16} color="#DE802B" />
            </div>
            <span
              style={{
                fontSize: '13px',
                color: '#3E2C23',
                fontWeight: 600,
              }}
            >
              Office: Guntur, Andhra Pradesh
            </span>
          </div>

          {isPaid && (
            <div
              style={{
                background: '#3E2C23',
                color: '#FFF6DE',
                padding: '14px 16px',
                borderRadius: '12px',
                marginTop: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255,246,222,0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 600,
                  }}
                >
                  Consultation Fee
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#DE802B',
                    marginTop: '2px',
                  }}
                >
                  ₹{consultationFee.toLocaleString()}
                </div>
              </div>
              <CreditCard size={28} color="#DE802B" />
            </div>
          )}
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <div style={{ position: 'relative' }}>
            <User size={17} style={iconStyle} />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              style={bookInput}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={17} style={iconStyle} />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              style={bookInput}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Phone size={17} style={iconStyle} />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              style={bookInput}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <MessageSquare
              size={17}
              style={{ ...iconStyle, top: '16px', transform: 'none' }}
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What would you like to discuss? (optional)"
              rows={3}
              style={{
                ...bookInput,
                paddingTop: '14px',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  background: 'rgba(229,62,62,0.1)',
                  border: '1px solid rgba(229,62,62,0.25)',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#c53030',
                  fontSize: '14px',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                ❌ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{
              background: loading ? 'rgba(62,44,35,0.5)' : '#DE802B',
              color: '#3E2C23',
              border: 'none',
              padding: '16px',
              borderRadius: '14px',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 'clamp(14px, 2vw, 16px)',
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: loading
                ? 'none'
                : '0 8px 24px rgba(222, 128, 43, 0.4)',
            }}
          >
            {loading ? (
              'Processing...'
            ) : isPaid ? (
              <>
                <CreditCard size={18} />
                Pay ₹{consultationFee.toLocaleString()} & Book
              </>
            ) : (
              <>
                <Send size={18} />
                Book Free Meeting
              </>
            )}
          </motion.button>

          {isPaid ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '12px',
                color: '#3E2C23',
                marginTop: '4px',
                opacity: 0.7,
                fontWeight: 600,
              }}
            >
              <Shield size={13} />
              Secured by Razorpay • 256-bit SSL
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '4px',
                flexWrap: 'wrap',
              }}
            >
              {['✓ No payment', '✓ Expert team', '✓ 24hr response'].map(
                (item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: '11px',
                      color: '#3E2C23',
                      fontWeight: 600,
                      opacity: 0.7,
                    }}
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          )}
        </form>
      </motion.div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </PageWrapper>
  )
}

// ─── Helpers ───
function PageWrapper({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#E5EEE4',
        paddingTop: '90px',
        paddingBottom: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '110px clamp(16px, 4vw, 24px) 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background circles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 4 + i, repeat: Infinity }}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: '#C0E1D2',
            width: `${250 + i * 100}px`,
            height: `${250 + i * 100}px`,
            left: `${i * 30}%`,
            top: `${i * 15}%`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}

      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  )
}

const iconStyle = {
  position: 'absolute',
  left: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#DE802B',
}

const bookInput = {
  width: '100%',
  padding: '14px 14px 14px 44px',
  border: '1.5px solid rgba(62,44,35,0.12)',
  borderRadius: '12px',
  background: '#E5EEE4',
  color: '#3E2C23',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
  fontWeight: 500,
  transition: 'all 0.2s',
}

const formCard = {
  background: '#FFFFFF',
  borderRadius: '24px',
  padding: 'clamp(24px, 4vw, 40px)',
  boxShadow: '0 8px 40px rgba(62,44,35,0.12)',
  border: '1px solid rgba(62,44,35,0.05)',
}

const successCard = {
  background: '#FFFFFF',
  borderRadius: '24px',
  padding: 'clamp(40px, 6vw, 60px) clamp(24px, 4vw, 40px)',
  textAlign: 'center',
  boxShadow: '0 8px 40px rgba(62,44,35,0.12)',
  border: '1px solid rgba(62,44,35,0.05)',
}

const primaryBtn = {
  background: '#DE802B',
  color: '#3E2C23',
  padding: '14px 28px',
  borderRadius: '50px',
  fontWeight: 700,
  textDecoration: 'none',
  fontSize: '15px',
  display: 'inline-block',
  boxShadow: '0 4px 16px rgba(222, 128, 43, 0.3)',
}

const secondaryBtn = {
  background: '#C0E1D2',
  color: '#3E2C23',
  padding: '14px 28px',
  borderRadius: '50px',
  fontWeight: 700,
  textDecoration: 'none',
  fontSize: '15px',
  display: 'inline-block',
  border: '2px solid #3E2C23',
}