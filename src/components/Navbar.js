// src/components/Navbar.js
'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  ChevronDown,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()
  const userMenuRef = useRef(null)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false)
    setShowUserMenu(false)
  }, [pathname])

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          background: '#C0E1D2',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          // ✅ FIXED: Use rgba with 0 alpha instead of 'transparent'
          borderBottom: scrolled
            ? '1px solid rgba(62,44,35,0.15)'
            : '1px solid rgba(62,44,35,0)',
          boxShadow: scrolled ? '0 2px 20px rgba(62,44,35,0.08)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0 clamp(16px, 4vw, 24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: scrolled ? '64px' : '72px',
            transition: 'height 0.3s ease',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
           <motion.div
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    position: 'relative',
  }}
>
  <span
    style={{
      fontSize: 'clamp(18px, 3vw, 22px)',
      fontWeight: 800,
      color: '#DE802B',
      letterSpacing: '-0.5px',
    }}
  >
    Talento Nova
  </span>
  <span
    style={{
      fontSize: 'clamp(18px, 3vw, 22px)',
      fontWeight: 800,
      color: '#3E2C23',
      letterSpacing: '-0.5px',
      position: 'relative',
    }}
  >
    Consultancy
    <motion.span
      initial={{ width: 0 }}
      whileHover={{ width: '100%' }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        bottom: '-2px',
        left: 0,
        height: '2px',
        background: '#DE802B',
        borderRadius: '2px',
      }}
    />
  </span>
</motion.div>
          </Link>

          {/* ─── Desktop Nav ─── */}
          <div className="nav-desktop" style={desktopNavStyle}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    textDecoration: 'none',
                    color: isActive ? '#DE802B' : '#3E2C23',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '15px',
                    transition: 'color 0.2s',
                    position: 'relative',
                    padding: '6px 0',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#DE802B')}
                  onMouseLeave={(e) =>
                    (e.target.style.color = isActive ? '#DE802B' : '#3E2C23')
                  }
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navActive"
                      style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: '#DE802B',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              )
            })}

            {/* User Menu / Login */}
            {session ? (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#3E2C23',
                    color: '#C0E1D2',
                    border: 'none',
                    padding: '8px 14px 8px 8px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#C0E1D2',
                      color: '#3E2C23',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800,
                    }}
                  >
                    {session.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span
                    style={{
                      maxWidth: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {session.user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        background: '#C0E1D2',
                        border: '1px solid rgba(62,44,35,0.15)',
                        borderRadius: '14px',
                        padding: '8px',
                        minWidth: '200px',
                        boxShadow: '0 10px 40px rgba(62,44,35,0.15)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          padding: '10px 12px 12px',
                          borderBottom: '1px solid rgba(62,44,35,0.08)',
                          marginBottom: '6px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#3E2C23',
                          }}
                        >
                          {session.user?.name}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#7a5c45',
                            marginTop: '2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {session.user?.email}
                        </div>
                      </div>

                      <MenuItem
                        href="/dashboard"
                        icon={LayoutDashboard}
                        label="Dashboard"
                      />
                      {session.user?.role === 'admin' && (
                        <MenuItem href="/admin" icon={Shield} label="Admin Panel" />
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          color: '#e53e3e',
                          background: 'rgba(229,62,62,0)', // ✅ Fixed
                          border: 'none',
                          width: '100%',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 500,
                          textAlign: 'left',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = 'rgba(229,62,62,0.08)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = 'rgba(229,62,62,0)')
                        }
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: '#3E2C23',
                    color: '#C0E1D2',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Login
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="nav-mobile-btn"
            style={{
              background: isOpen ? '#3E2C23' : 'rgba(62,44,35,0.08)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              color: isOpen ? '#FFF6DE' : '#3E2C23',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? 'x' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* ─── Mobile Menu Overlay ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: '#00000066',
                zIndex: 998,
                backdropFilter: 'blur(4px)',
              }}
            />

            {/* Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(320px, 85vw)',
                background: '#C0E1D2',
                zIndex: 999,
                padding: '90px 24px 24px',
                overflowY: 'auto',
                boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* User Info (if logged in) */}
              {session && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    background: '#3E2C23',
                    color: '#C0E1D2',
                    padding: '16px',
                    borderRadius: '14px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#C0E1D2',
                      color: '#3E2C23',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 800,
                    }}
                  >
                    {session.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {session.user?.name}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        opacity: 0.7,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {session.user?.email}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Nav Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'block',
                          padding: '14px 16px',
                          color: isActive ? '#FFF6DE' : '#3E2C23',
                          background: isActive ? '#3E2C23' : 'rgba(62, 44, 35, 0)',
                          textDecoration: 'none',
                          fontWeight: isActive ? 700 : 500,
                          borderRadius: '12px',
                          fontSize: '15px',
                          transition: 'all 0.2s',
                        }}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: '1px',
                  background: 'rgba(62,44,35,0.1)',
                  margin: '20px 0',
                }}
              />

              {/* Account Links */}
              {session ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <MobileMenuItem
                    href="/dashboard"
                    icon={LayoutDashboard}
                    label="Dashboard"
                    onClick={() => setIsOpen(false)}
                  />
                  {session.user?.role === 'admin' && (
                    <MobileMenuItem
                      href="/admin"
                      icon={Shield}
                      label="Admin Panel"
                      onClick={() => setIsOpen(false)}
                    />
                  )}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => signOut({ callbackUrl: '/' })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 16px',
                      color: '#e53e3e',
                      background: 'rgba(229,62,62,0.08)',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: 600,
                      textAlign: 'left',
                      marginTop: '8px',
                    }}
                  >
                    <LogOut size={18} /> Sign Out
                  </motion.button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  style={{ textDecoration: 'none' }}
                >
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      background: '#3E2C23',
                      color: '#FFF6DE',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <User size={18} /> Login / Register
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}

// ─── Sub Components ───
function MenuItem({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        borderRadius: '8px',
        color: '#3E2C23',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 500,
        background: 'rgba(62,44,35,0)', // ✅ Fixed
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = 'rgba(62,44,35,0.06)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = 'rgba(62,44,35,0)') // ✅ Fixed
      }
    >
      <Icon size={16} /> {label}
    </Link>
  )
}

function MobileMenuItem({ href, icon: Icon, label, onClick }) {
  return (
    <Link href={href} onClick={onClick} style={{ textDecoration: 'none' }}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 16px',
          color: '#3E2C23',
          background: 'rgba(62,44,35,0.05)',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: 500,
        }}
      >
        <Icon size={18} /> {label}
      </motion.div>
    </Link>
  )
}

const desktopNavStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'clamp(20px, 3vw, 32px)',
}