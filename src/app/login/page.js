// src/app/login/page.js
'use client'
import { useState, useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Globe,
  Sparkles,
  Shield,
  CheckCircle,
  KeyRound,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // login | register | otp
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(0)
  const [resending, setResending] = useState(false)
  const otpRefs = useRef([])
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ─── Countdown timer for resend OTP ───
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  // ─── LOGIN ───
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    })

    if (res?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  // ─── REGISTER STEP 1: Send OTP ───
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to send OTP')
        setLoading(false)
        return
      }

      setSuccess(`OTP sent to ${form.email}`)
      setMode('otp')
      setTimer(60) // 60 seconds before allowing resend
      setOtp(['', '', '', '', '', ''])
      setLoading(false)

      // Focus first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 300)
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  // ─── REGISTER STEP 2: Verify OTP ───
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: otpCode }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid OTP')
        setLoading(false)
        return
      }

      setSuccess('Account verified! Signing you in...')

      await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      })

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  // ─── Resend OTP ───
  const handleResendOTP = async () => {
    if (timer > 0) return
    setResending(true)
    setError('')

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to resend OTP')
      } else {
        setSuccess('New OTP sent!')
        setOtp(['', '', '', '', '', ''])
        setTimer(60)
        setTimeout(() => otpRefs.current[0]?.focus(), 100)
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setResending(false)
    }
  }

  // ─── OTP input handlers ───
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only numbers
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').trim().slice(0, 6)
    if (!/^\d+$/.test(pasted)) return
    const newOtp = pasted.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtp(newOtp)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const goBackToRegister = () => {
    setMode('register')
    setError('')
    setSuccess('')
    setOtp(['', '', '', '', '', ''])
    setTimer(0)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#C0E1D2',
        padding: isMobile ? '75px 12px 20px' : '90px 20px 40px',
        margin: isMobile ? '0' : '90px',
        borderRadius: isMobile ? '0' : '180px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Circles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.06, 0.14, 0.06],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: '#3E2C23',
            width: `${200 + i * 150}px`,
            height: `${200 + i * 150}px`,
            left: `${-5 + i * 25}%`,
            top: `${-10 + i * 20}%`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        style={{
          background: '#FFFFFF',
          borderRadius: isMobile ? '20px' : '28px',
          padding: isMobile
            ? '24px 18px'
            : 'clamp(28px, 5vw, 48px) clamp(24px, 4vw, 40px)',
          width: '100%',
          maxWidth: '460px',
          boxShadow:
            '0 30px 80px rgba(62,44,35,0.25), 0 10px 30px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 10,
          border: '1px solid rgba(62,44,35,0.06)',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Decorative Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: isMobile ? '5px' : '6px',
            background:
              'linear-gradient(90deg, #DE802B 0%, #FFB870 50%, #DE802B 100%)',
            borderTopLeftRadius: isMobile ? '20px' : '28px',
            borderTopRightRadius: isMobile ? '20px' : '28px',
            transformOrigin: 'left',
          }}
        />

        {/* Logo Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', damping: 12 }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '10px' : '14px',
          }}
        >
          <div
            style={{
              width: isMobile ? '54px' : '64px',
              height: isMobile ? '54px' : '64px',
              background: '#3E2C23',
              borderRadius: isMobile ? '16px' : '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: '0 10px 30px rgba(62,44,35,0.3)',
            }}
          >
            {mode === 'otp' ? (
              <KeyRound size={isMobile ? 26 : 32} color="#DE802B" />
            ) : (
              <Globe size={isMobile ? 26 : 32} color="#DE802B" />
            )}
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            textAlign: 'center',
            fontSize: isMobile ? '20px' : 'clamp(20px, 3vw, 24px)',
            fontWeight: 800,
            color: '#3E2C23',
            marginBottom: '6px',
            letterSpacing: '-0.5px',
          }}
        >
          {mode === 'otp' ? (
            'Verify Your Email'
          ) : (
            <>
              Talento<span style={{ color: '#DE802B' }}>Nova</span>
            </>
          )}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center',
            fontSize: isMobile ? '12px' : '13px',
            color: '#3E2C23',
            opacity: 0.7,
            marginBottom: isMobile ? '18px' : '24px',
          }}
        >
          {mode === 'login' && 'Welcome back! Sign in to continue'}
          {mode === 'register' && 'Create your account to get started'}
          {mode === 'otp' && (
            <>
              Enter the 6-digit code sent to{' '}
              <strong style={{ color: '#DE802B' }}>{form.email}</strong>
            </>
          )}
        </motion.p>

        {/* Mode Toggle — hide in OTP mode */}
        {mode !== 'otp' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              display: 'flex',
              background: '#E5EEE4',
              borderRadius: isMobile ? '12px' : '14px',
              padding: '5px',
              marginBottom: isMobile ? '18px' : '24px',
              position: 'relative',
            }}
          >
            <motion.div
              animate={{ x: mode === 'login' ? 0 : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                width: 'calc(50% - 5px)',
                height: 'calc(100% - 10px)',
                background: '#3E2C23',
                borderRadius: isMobile ? '8px' : '10px',
                boxShadow: '0 4px 12px rgba(62,44,35,0.2)',
              }}
            />

            {['login', 'register'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m)
                  setError('')
                  setSuccess('')
                }}
                style={{
                  flex: 1,
                  padding: isMobile ? '10px' : '11px',
                  border: 'none',
                  background: 'transparent',
                  color: mode === m ? '#DE802B' : '#3E2C23',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: isMobile ? '13px' : '14px',
                  textTransform: 'capitalize',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'color 0.3s',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </motion.div>
        )}

        {/* ─── FORMS ─── */}
        <AnimatePresence mode="wait">
          {/* LOGIN FORM */}
          {mode === 'login' && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleLogin}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '12px' : '14px',
              }}
            >
              {/* Email */}
              <div style={{ position: 'relative' }}>
                <Mail size={isMobile ? 16 : 18} style={iconStyle} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  style={isMobile ? mobileInputStyle : inputStyle}
                />
              </div>

              {/* Password */}
              <div style={{ position: 'relative' }}>
                <Lock size={isMobile ? 16 : 18} style={iconStyle} />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  style={
                    isMobile ? mobilePasswordInputStyle : passwordInputStyle
                  }
                />
                <PasswordToggle
                  isMobile={isMobile}
                  showPass={showPass}
                  setShowPass={setShowPass}
                />
              </div>

              <ErrorSuccess error={error} success={success} isMobile={isMobile} />

              <SubmitButton
                loading={loading}
                isMobile={isMobile}
                label="Sign In"
              />
            </motion.form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSendOTP}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '12px' : '14px',
              }}
            >
              {/* Name */}
              <div style={{ position: 'relative' }}>
                <User size={isMobile ? 16 : 18} style={iconStyle} />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  style={isMobile ? mobileInputStyle : inputStyle}
                />
              </div>

              {/* Email */}
              <div style={{ position: 'relative' }}>
                <Mail size={isMobile ? 16 : 18} style={iconStyle} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  style={isMobile ? mobileInputStyle : inputStyle}
                />
              </div>

              {/* Password */}
              <div style={{ position: 'relative' }}>
                <Lock size={isMobile ? 16 : 18} style={iconStyle} />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    isMobile
                      ? 'Password (min 6 chars)'
                      : 'Password (min. 6 characters)'
                  }
                  required
                  minLength={6}
                  style={
                    isMobile ? mobilePasswordInputStyle : passwordInputStyle
                  }
                />
                <PasswordToggle
                  isMobile={isMobile}
                  showPass={showPass}
                  setShowPass={setShowPass}
                />
              </div>

              <ErrorSuccess error={error} success={success} isMobile={isMobile} />

              <SubmitButton
                loading={loading}
                isMobile={isMobile}
                label="Send OTP"
                icon={Mail}
              />

              <p
                style={{
                  fontSize: isMobile ? '11px' : '12px',
                  color: '#3E2C23',
                  opacity: 0.6,
                  textAlign: 'center',
                  marginTop: '4px',
                  lineHeight: 1.5,
                }}
              >
                We&apos;ll send a 6-digit code to verify your email
              </p>
            </motion.form>
          )}

          {/* OTP FORM */}
          {mode === 'otp' && (
            <motion.form
              key="otp"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleVerifyOTP}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '16px' : '20px',
              }}
            >
              {/* OTP Inputs */}
              <div
                style={{
                  display: 'flex',
                  gap: isMobile ? '6px' : '10px',
                  justifyContent: 'center',
                  marginTop: '8px',
                }}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    style={{
                      width: isMobile ? '42px' : '52px',
                      height: isMobile ? '52px' : '60px',
                      textAlign: 'center',
                      fontSize: isMobile ? '22px' : '26px',
                      fontWeight: 800,
                      color: '#3E2C23',
                      background: digit ? '#FFFFFF' : '#E5EEE4',
                      border: digit
                        ? '2px solid #DE802B'
                        : '2px solid rgba(62,44,35,0.12)',
                      borderRadius: isMobile ? '10px' : '12px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxShadow: digit
                        ? '0 0 0 4px rgba(222,128,43,0.12)'
                        : 'none',
                      WebkitTapHighlightColor: 'transparent',
                      fontFamily: 'monospace',
                    }}
                  />
                ))}
              </div>

              {/* Timer / Resend */}
              <div
                style={{
                  textAlign: 'center',
                  fontSize: isMobile ? '12px' : '13px',
                  color: '#3E2C23',
                  opacity: 0.85,
                }}
              >
                {timer > 0 ? (
                  <span>
                    Resend OTP in{' '}
                    <strong style={{ color: '#DE802B' }}>{timer}s</strong>
                  </span>
                ) : (
                  <>
                    Didn&apos;t receive?{' '}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resending}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#DE802B',
                        fontWeight: 800,
                        cursor: resending ? 'not-allowed' : 'pointer',
                        textDecoration: 'underline',
                        fontSize: isMobile ? '12px' : '13px',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {resending ? (
                        <>
                          <RefreshCw
                            size={12}
                            style={{ animation: 'spin 1s linear infinite' }}
                          />
                          Sending...
                        </>
                      ) : (
                        'Resend OTP'
                      )}
                    </button>
                  </>
                )}
              </div>

              <ErrorSuccess error={error} success={success} isMobile={isMobile} />

              <SubmitButton
                loading={loading}
                isMobile={isMobile}
                label="Verify & Create Account"
                icon={CheckCircle}
                disabled={otp.join('').length !== 6}
              />

              {/* Back button */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={goBackToRegister}
                style={{
                  background: 'transparent',
                  color: '#3E2C23',
                  border: 'none',
                  padding: '8px',
                  fontWeight: 600,
                  fontSize: isMobile ? '12px' : '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  opacity: 0.75,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <ArrowLeft size={14} />
                Change email
              </motion.button>

              <style jsx>{`
                @keyframes spin {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Toggle link — hide in OTP mode */}
        {mode !== 'otp' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              textAlign: 'center',
              fontSize: isMobile ? '12px' : '13px',
              color: '#3E2C23',
              marginTop: isMobile ? '12px' : '14px',
              opacity: 0.85,
            }}
          >
            {mode === 'login' ? (
              <>
                New here?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register')
                    setError('')
                    setSuccess('')
                  }}
                  style={isMobile ? mobileLinkBtnStyle : linkBtnStyle}
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setError('')
                    setSuccess('')
                  }}
                  style={isMobile ? mobileLinkBtnStyle : linkBtnStyle}
                >
                  Sign in
                </button>
              </>
            )}
          </motion.p>
        )}

        {/* Demo Credentials — hide in OTP mode */}
        {mode !== 'otp' && (
          <div
            style={{
              display: isMobile ? 'grid' : 'block',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'unset',
              gap: isMobile ? '10px' : '0',
              marginTop: isMobile ? '16px' : '0',
            }}
          >
            <DemoCard
              isMobile={isMobile}
              title="Admin Demo"
              email="admin@consultancy.com"
              password="admin123"
            />
            <DemoCard
              isMobile={isMobile}
              title="User Demo"
              email="user@consultancy.com"
              password="user123"
            />
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ─── HELPER COMPONENTS ───

function PasswordToggle({ isMobile, showPass, setShowPass }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setShowPass(!showPass)}
      style={{
        position: 'absolute',
        right: isMobile ? '12px' : '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#DE802B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {showPass ? (
        <EyeOff size={isMobile ? 16 : 18} />
      ) : (
        <Eye size={isMobile ? 16 : 18} />
      )}
    </motion.button>
  )
}

function ErrorSuccess({ error, success, isMobile }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            background: 'rgba(229,62,62,0.1)',
            border: '1px solid rgba(229,62,62,0.3)',
            borderRadius: isMobile ? '10px' : '12px',
            padding: isMobile ? '10px 12px' : '12px 16px',
            color: '#c53030',
            fontSize: isMobile ? '12px' : '14px',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          ❌ {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          style={{
            background: 'rgba(56,161,105,0.1)',
            border: '1px solid rgba(56,161,105,0.3)',
            borderRadius: isMobile ? '10px' : '12px',
            padding: isMobile ? '10px 12px' : '12px 16px',
            color: '#276749',
            fontSize: isMobile ? '12px' : '14px',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          ✅ {success}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SubmitButton({ loading, isMobile, label, icon: Icon, disabled }) {
  const isDisabled = loading || disabled
  return (
    <motion.button
      type="submit"
      disabled={isDisabled}
      whileHover={{
        scale: isDisabled ? 1 : 1.02,
        boxShadow: isDisabled
          ? 'none'
          : '0 16px 40px rgba(222, 128, 43, 0.5)',
      }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      style={{
        background: isDisabled ? 'rgba(62,44,35,0.4)' : '#DE802B',
        color: '#3E2C23',
        border: 'none',
        padding: isMobile ? '14px' : '16px',
        borderRadius: isMobile ? '12px' : '14px',
        fontWeight: 800,
        fontSize: isMobile ? '14px' : '15px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginTop: isMobile ? '4px' : '8px',
        boxShadow: isDisabled
          ? 'none'
          : '0 8px 24px rgba(222, 128, 43, 0.4)',
        transition: 'all 0.3s',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '20px',
            height: '20px',
            border: '2.5px solid rgba(62,44,35,0.3)',
            borderTopColor: '#3E2C23',
            borderRadius: '50%',
          }}
        />
      ) : (
        <>
          {Icon && <Icon size={isMobile ? 16 : 18} />}
          {label}
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ display: 'flex' }}
          >
            <ArrowRight size={isMobile ? 16 : 18} />
          </motion.span>
        </>
      )}
    </motion.button>
  )
}

function DemoCard({ isMobile, title, email, password }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      style={{
        marginTop: isMobile ? '0' : '24px',
        padding: isMobile ? '10px 12px' : '14px',
        background: '#E5EEE4',
        borderRadius: isMobile ? '10px' : '12px',
        border: '1px dashed rgba(62,44,35,0.2)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: isMobile ? '9px' : '11px',
          color: '#DE802B',
          fontWeight: 700,
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        <Shield size={isMobile ? 10 : 12} />
        {title}
      </div>
      <div
        style={{
          fontSize: isMobile ? '10px' : '12px',
          color: '#3E2C23',
          fontFamily: 'monospace',
          lineHeight: 1.6,
          opacity: 0.85,
          wordBreak: isMobile ? 'break-all' : 'normal',
        }}
      >
        <div>📧 {email}</div>
        <div>🔑 {password}</div>
      </div>
    </motion.div>
  )
}

// ─── STYLES ───
const inputStyle = {
  width: '100%',
  paddingTop: '14px',
  paddingBottom: '14px',
  paddingLeft: '46px',
  paddingRight: '14px',
  border: '1.5px solid rgba(62,44,35,0.12)',
  borderRadius: '12px',
  background: '#E5EEE4',
  color: '#3E2C23',
  fontSize: '15px',
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
  fontWeight: 500,
  fontFamily: 'inherit',
}

const passwordInputStyle = { ...inputStyle, paddingRight: '48px' }

const mobileInputStyle = {
  width: '100%',
  paddingTop: '12px',
  paddingBottom: '12px',
  paddingLeft: '40px',
  paddingRight: '12px',
  border: '1.5px solid rgba(62,44,35,0.12)',
  borderRadius: '10px',
  background: '#E5EEE4',
  color: '#3E2C23',
  fontSize: '14px',
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
  fontWeight: 500,
  fontFamily: 'inherit',
}

const mobilePasswordInputStyle = { ...mobileInputStyle, paddingRight: '42px' }

const iconStyle = {
  position: 'absolute',
  left: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#DE802B',
  zIndex: 1,
}

const linkBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#DE802B',
  fontWeight: 800,
  cursor: 'pointer',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  fontSize: '13px',
  padding: 0,
}

const mobileLinkBtnStyle = { ...linkBtnStyle, fontSize: '12px' }