// src/components/DashboardClient.js
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  User,
  Award,
  Calendar,
  FileText,
} from 'lucide-react'

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: '#38a169',
    bg: 'rgba(56,161,105,0.15)',
    label: 'Confirmed',
  },
  completed: {
    icon: Award,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.15)',
    label: 'Completed',
  },
  pending: {
    icon: Clock,
    color: '#d69e2e',
    bg: 'rgba(214,158,46,0.15)',
    label: 'Pending',
  },
  failed: {
    icon: XCircle,
    color: '#e53e3e',
    bg: 'rgba(229,62,62,0.15)',
    label: 'Failed',
  },
}

export default function DashboardClient({ session, bookings }) {
  const confirmed = bookings.filter((b) => b.status === 'success').length
  const completed = bookings.filter((b) => b.status === 'completed').length
  const pending = bookings.filter((b) => b.status === 'pending').length
  const totalSpent = bookings
    .filter((b) => b.status === 'success' || b.status === 'completed')
    .reduce((sum, b) => sum + b.amount, 0)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#E5EEE4',
        paddingTop: '90px',
      }}
    >
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
            maxWidth: '1100px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(14px, 3vw, 20px)',
              flexWrap: 'wrap',
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2, damping: 12 }}
              style={{
                width: 'clamp(60px, 9vw, 75px)',
                height: 'clamp(60px, 9vw, 75px)',
                borderRadius: '50%',
                background: '#DE802B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(22px, 3.5vw, 28px)',
                fontWeight: 800,
                color: '#3E2C23',
                flexShrink: 0,
                boxShadow: '0 10px 28px rgba(222,128,43,0.45)',
                border: '3px solid #FFFFFF',
              }}
            >
              {session.user.name?.[0]?.toUpperCase() || 'U'}
            </motion.div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(222, 128, 43, 0.15)',
                  border: '1px solid rgba(222, 128, 43, 0.3)',
                  borderRadius: '50px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  color: '#DE802B',
                  marginBottom: '10px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                <Award size={12} /> Dashboard
              </motion.div>
              <h1
                style={{
                  fontSize: 'clamp(22px, 4vw, 34px)',
                  fontWeight: 800,
                  color: '#3E2C23',
                  marginBottom: '6px',
                  lineHeight: 1.2,
                  letterSpacing: '-0.5px',
                }}
              >
                Welcome back, {session.user.name?.split(' ')[0]}! 👋
              </h1>
              <p
                style={{
                  color: '#3E2C23',
                  fontSize: 'clamp(13px, 2vw, 15px)',
                  wordBreak: 'break-word',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  opacity: 0.85,
                  fontWeight: 500,
                }}
              >
                <span>{session.user.email}</span>
                {session.user.role === 'admin' && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    style={{
                      background: '#3E2C23',
                      color: '#DE802B',
                      padding: '3px 12px',
                      borderRadius: '50px',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 12px rgba(62,44,35,0.25)',
                    }}
                  >
                    🛡️ ADMIN
                  </motion.span>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: 'clamp(28px, 5vw, 48px) clamp(12px, 3vw, 24px)',
        }}
      >
        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 'clamp(12px, 2vw, 20px)',
            marginBottom: 'clamp(32px, 5vw, 48px)',
          }}
        >
          {[
            {
              label: 'Total Bookings',
              value: bookings.length,
              icon: BookOpen,
              color: '#3E2C23',
              bg: '#C0E1D2',
            },
            {
              label: 'Confirmed',
              value: confirmed,
              icon: CheckCircle,
              color: '#38a169',
              bg: 'rgba(56,161,105,0.15)',
            },
            {
              label: 'Completed',
              value: completed,
              icon: Award,
              color: '#3b82f6',
              bg: 'rgba(59,130,246,0.15)',
            },
            {
              label: 'Total Spent',
              value: `₹${totalSpent.toLocaleString()}`,
              icon: User,
              color: '#DE802B',
              bg: 'rgba(222,128,43,0.15)',
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: 'clamp(20px, 3vw, 24px)',
                boxShadow: '0 2px 16px rgba(62,44,35,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                border: '1px solid rgba(62,44,35,0.06)',
                transition: 'box-shadow 0.3s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  '0 12px 32px rgba(62,44,35,0.15)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  '0 2px 16px rgba(62,44,35,0.08)')
              }
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <stat.icon size={24} color={stat.color} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 'clamp(20px, 3vw, 26px)',
                    fontWeight: 800,
                    color: '#3E2C23',
                    wordBreak: 'break-word',
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#3E2C23',
                    opacity: 0.7,
                    fontWeight: 600,
                    marginTop: '4px',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Admin Link */}
        {session.user.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: '#3E2C23',
              borderRadius: '20px',
              padding: 'clamp(20px, 3vw, 24px) clamp(20px, 4vw, 28px)',
              marginBottom: 'clamp(28px, 5vw, 40px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 8px 24px rgba(62,44,35,0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative circle */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                position: 'absolute',
                right: '-60px',
                top: '-60px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: '#DE802B',
                pointerEvents: 'none',
              }}
            />
            <div style={{ minWidth: 0, flex: 1, position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  fontSize: 'clamp(16px, 2.5vw, 18px)',
                  fontWeight: 700,
                  color: '#FFF6DE',
                  marginBottom: '4px',
                }}
              >
                🛡️ Admin Panel
              </div>
              <div
                style={{
                  color: 'rgba(255,246,222,0.7)',
                  fontSize: 'clamp(13px, 2vw, 14px)',
                }}
              >
                Manage services, gallery and view all bookings
              </div>
            </div>
            <Link
              href="/admin"
              style={{ textDecoration: 'none', position: 'relative', zIndex: 1 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: '#DE802B',
                  color: '#3E2C23',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '50px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(222,128,43,0.4)',
                }}
              >
                Go to Admin <ArrowRight size={18} />
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Bookings */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(18px, 3vw, 22px)',
                fontWeight: 700,
                color: '#3E2C23',
              }}
            >
              Your Bookings
            </h2>
            <Link href="/book" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: '#DE802B',
                  color: '#3E2C23',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '50px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(222,128,43,0.3)',
                }}
              >
                + New Booking
              </motion.button>
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: 'clamp(40px, 7vw, 60px) clamp(20px, 4vw, 60px)',
                textAlign: 'center',
                boxShadow: '0 2px 16px rgba(62,44,35,0.06)',
                border: '2px dashed rgba(62,44,35,0.1)',
              }}
            >
              <BookOpen size={48} color="rgba(62,44,35,0.3)" />
              <p
                style={{
                  color: '#3E2C23',
                  marginTop: '16px',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                No bookings yet
              </p>
              <p
                style={{
                  color: '#3E2C23',
                  opacity: 0.7,
                  fontSize: '13px',
                  marginTop: '8px',
                }}
              >
                Start your journey by booking a consultation
              </p>
              <Link href="/services" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    marginTop: '20px',
                    background: '#3E2C23',
                    color: '#FFF6DE',
                    border: 'none',
                    padding: '12px 28px',
                    borderRadius: '50px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Browse Services
                </motion.button>
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {bookings.map((booking, i) => {
                const cfg = statusConfig[booking.status] || statusConfig.pending
                const StatusIcon = cfg.icon
                const isCompleted = booking.status === 'completed'

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -2 }}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '18px',
                      padding: 'clamp(18px, 3vw, 24px) clamp(20px, 4vw, 28px)',
                      boxShadow: '0 2px 16px rgba(62,44,35,0.06)',
                      borderLeft: `4px solid ${cfg.color}`,
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        '0 8px 24px rgba(62,44,35,0.12)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        '0 2px 16px rgba(62,44,35,0.06)')
                    }
                  >
                    {/* Top Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                        marginBottom:
                          booking.adminNotes || booking.meetingDate
                            ? '14px'
                            : '0',
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '8px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div
                            style={{
                              fontSize: 'clamp(15px, 2vw, 17px)',
                              fontWeight: 700,
                              color: '#3E2C23',
                            }}
                          >
                            {booking.service?.title || 'Consultation Service'}
                          </div>
                          {isCompleted && (
                            <span
                              style={{
                                fontSize: '10px',
                                background: '#DE802B',
                                color: '#3E2C23',
                                padding: '3px 8px',
                                borderRadius: '50px',
                                fontWeight: 800,
                                letterSpacing: '0.5px',
                              }}
                            >
                              ✨ DONE
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            color: '#3E2C23',
                            opacity: 0.75,
                            marginBottom: '4px',
                          }}
                        >
                          <Calendar size={13} />
                          Booked on{' '}
                          {new Date(booking.createdAt).toLocaleDateString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </div>

                        {booking.razorpayPaymentId && (
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#3E2C23',
                              opacity: 0.5,
                              wordBreak: 'break-all',
                              fontFamily: 'monospace',
                              marginTop: '4px',
                            }}
                          >
                            Payment ID: {booking.razorpayPaymentId}
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'clamp(12px, 2vw, 16px)',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              fontSize: '10px',
                              color: '#3E2C23',
                              opacity: 0.6,
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                            }}
                          >
                            Amount
                          </div>
                          <div
                            style={{
                              fontSize: 'clamp(18px, 3vw, 22px)',
                              fontWeight: 800,
                              color: booking.amount > 0 ? '#DE802B' : '#38a169',
                            }}
                          >
                            {booking.amount > 0
                              ? `₹${booking.amount.toLocaleString()}`
                              : 'FREE'}
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: cfg.bg,
                            color: cfg.color,
                            padding: '8px 16px',
                            borderRadius: '50px',
                            fontSize: '13px',
                            fontWeight: 700,
                            border: `1.5px solid ${cfg.color}`,
                          }}
                        >
                          <StatusIcon size={14} />
                          {cfg.label}
                        </div>
                      </div>
                    </div>

                    {/* Meeting Date (if set by admin) */}
                    {booking.meetingDate && (
                      <div
                        style={{
                          background: 'rgba(59,130,246,0.1)',
                          border: '1px solid rgba(59,130,246,0.25)',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          marginTop: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <Calendar size={16} color="#3b82f6" />
                        <div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#3b82f6',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            Meeting Scheduled
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#3E2C23',
                              fontWeight: 700,
                              marginTop: '2px',
                            }}
                          >
                            {new Date(booking.meetingDate).toLocaleDateString(
                              'en-IN',
                              {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Admin Notes (if provided) */}
                    {booking.adminNotes && (
                      <div
                        style={{
                          background: '#E5EEE4',
                          border: '1px solid rgba(62,44,35,0.08)',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          marginTop: '10px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                        }}
                      >
                        <FileText
                          size={16}
                          color="#DE802B"
                          style={{ flexShrink: 0, marginTop: '2px' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#DE802B',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              marginBottom: '4px',
                            }}
                          >
                            Message from Team
                          </div>
                          <div
                            style={{
                              fontSize: '13px',
                              color: '#3E2C23',
                              lineHeight: 1.6,
                              wordBreak: 'break-word',
                            }}
                          >
                            {booking.adminNotes}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Completed badge — Thank you message */}
                    {isCompleted && (
                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(222,128,43,0.1) 0%, rgba(56,161,105,0.1) 100%)',
                          border: '1px solid rgba(222,128,43,0.2)',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          marginTop: '10px',
                          textAlign: 'center',
                          fontSize: '13px',
                          color: '#3E2C23',
                          fontWeight: 600,
                        }}
                      >
                        🎉 Thank you for choosing TalentaNova! Hope to see you
                        again.
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 