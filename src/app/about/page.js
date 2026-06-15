// src/app/about/page.js
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  Globe,
  Sparkles,
  GraduationCap,
  Briefcase,
  CheckCircle,
  Shield,
  BookOpen,
  Plane,
  Quote,
  ArrowRight,
  FileCheck,
  HeadphonesIcon,
  Lightbulb,
} from 'lucide-react'
import Link from 'next/link'

const team = [
  {
    name: 'Rajesh Kumar',
    role: 'Founder & CEO',
    exp: '15+ years experience',
    avatar: 'RK',
    bio: 'Visionary leader with deep expertise in international education consulting.',
  },
  {
    name: 'Priya Sharma',
    role: 'Senior Visa Expert',
    exp: '10+ years in UK & USA visas',
    avatar: 'PS',
    bio: 'Specialized in complex visa cases with a 99% approval rate.',
  },
  {
    name: 'Anand Patel',
    role: 'Career Counselor',
    exp: '8+ years job placement',
    avatar: 'AP',
    bio: 'Connects talent with leading global employers across industries.',
  },
  {
    name: 'Meera Nair',
    role: 'University Advisor',
    exp: '12+ years guidance',
    avatar: 'MN',
    bio: 'Helps students secure admits to top 100 universities worldwide.',
  },
]

const whatWeDo = [
  {
    icon: GraduationCap,
    title: 'Abroad Education',
    text: 'Complete guidance from university selection to admission to top-ranked global institutions in UK, USA, Canada, Australia, Germany, and more.',
    points: [
      'University shortlisting',
      'Application & SOP/LOR support',
      'Scholarship guidance',
      'Pre-departure briefing',
    ],
  },
  {
    icon: Briefcase,
    title: 'International Jobs',
    text: 'Direct connections with global employers offering rewarding career opportunities in IT, healthcare, engineering, finance, and other industries.',
    points: [
      'Resume optimization',
      'Job matching & referrals',
      'Interview preparation',
      'Work visa sponsorship',
    ],
  },
  {
    icon: FileCheck,
    title: 'Visa Processing',
    text: 'Expert visa consultation with a proven 98% approval rate across all major countries. We handle the paperwork — you focus on your dreams.',
    points: [
      'Student visas (F1, Tier 4)',
      'Work visas (H1B, Tier 2)',
      'PR & immigration',
      'Dependent & spouse visas',
    ],
  },
  {
    icon: BookOpen,
    title: 'Test Preparation',
    text: 'In-house coaching for IELTS, TOEFL, GRE, GMAT, SAT, PTE, and Duolingo with our experienced trainers and proven study materials.',
    points: [
      'IELTS & TOEFL coaching',
      'GRE / GMAT prep',
      'Mock tests & analysis',
      'Speaking practice',
    ],
  },
]

const values = [
  {
    icon: Shield,
    title: 'Integrity First',
    text: "Honest advice — even when it means telling you what you don't want to hear.",
  },
  {
    icon: Heart,
    title: 'Genuine Care',
    text: 'Your success is our success. We celebrate every visa approval like our own.',
  },
  {
    icon: Lightbulb,
    title: 'Expert Knowledge',
    text: 'Constantly updated on visa rules, university trends, and global job markets.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    text: 'Round-the-clock assistance throughout your journey — application to landing.',
  },
]

const countries = [
  { flag: '🇬🇧', name: 'United Kingdom' },
  { flag: '🇺🇸', name: 'United States' },
  { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇦🇺', name: 'Australia' },
  { flag: '🇩🇪', name: 'Germany' },
  { flag: '🇮🇪', name: 'Ireland' },
  { flag: '🇳🇿', name: 'New Zealand' },
  { flag: '🇫🇷', name: 'France' },
  { flag: '🇸🇬', name: 'Singapore' },
  { flag: '🇳🇱', name: 'Netherlands' },
  { flag: '🇸🇪', name: 'Sweden' },
  { flag: '🇦🇪', name: 'UAE' },
]

// ─── Shared section header component ───
function SectionHeader({ badge, title, subtitle, light = false }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 52px)' }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: light ? 'rgba(255,255,255,0.12)' : '#FFFFFF',
          border: light
            ? '1px solid rgba(255,255,255,0.2)'
            : '1px solid #DE802B',
          borderRadius: '4px',
          padding: '7px 16px',
          fontSize: '11px',
          color: '#DE802B',
          marginBottom: '18px',
          fontWeight: 800,
          letterSpacing: '2px',
          boxShadow: light ? 'none' : '0 4px 14px rgba(222,128,43,0.15)',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#DE802B',
          }}
        />
        {badge}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          fontSize: 'clamp(28px, 4.5vw, 44px)',
          fontWeight: 900,
          color: light ? '#FFFFFF' : '#3E2C23',
          marginBottom: '14px',
          letterSpacing: '-1px',
          lineHeight: 1.1,
        }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          style={{
            color: light ? 'rgba(255,255,255,0.75)' : '#3E2C23',
            fontSize: 'clamp(14px, 1.7vw, 16px)',
            opacity: light ? 1 : 0.75,
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

export default function AboutPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const ref2 = useRef(null)
  const isInView2 = useInView(ref2, { once: true, margin: '-100px' })

  const ref3 = useRef(null)
  const isInView3 = useInView(ref3, { once: true, margin: '-100px' })

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#E5EEE4',
        paddingTop: '70px',
      }}
    >
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION — Gallery-style (Clean & Simple)
      ═══════════════════════════════════════════════════════ */}
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
            <Sparkles size={14} /> ABOUT TALENTO NOVA
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
            Your Gateway to Global Success
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
            We&apos;ve been turning international dreams into reality —
            helping 5,000+ students and professionals study and work in the
            world&apos;s top destinations.
          </p>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          OUR STORY — Asymmetric layout with vertical accent
      ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          padding: 'clamp(70px, 9vw, 110px) clamp(16px, 4vw, 32px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: 'clamp(36px, 5vw, 60px)',
            alignItems: 'start',
          }}
        >
          {/* Story Text — with vertical line accent */}
          <div
            style={{
              position: 'relative',
              paddingLeft: 'clamp(20px, 3vw, 32px)',
              borderLeft: '4px solid #DE802B',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: '#DE802B',
                color: '#FFFFFF',
                padding: '5px 12px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '2px',
                borderRadius: '4px',
                marginBottom: '20px',
              }}
            >
              OUR STORY
            </div>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 900,
                color: '#3E2C23',
                marginBottom: '24px',
                letterSpacing: '-1px',
                lineHeight: 1.1,
              }}
            >
              Born from a passion for
              <br />
              <span style={{ color: '#DE802B', fontStyle: 'italic' }}>
                changing lives
              </span>
            </h2>
            <p
              style={{
                color: '#3E2C23',
                fontSize: 'clamp(14px, 1.7vw, 16px)',
                lineHeight: 1.85,
                marginBottom: '18px',
                opacity: 0.82,
              }}
            >
              <strong style={{ color: '#3E2C23' }}>Talento Nova</strong> was
              founded in 2010 with a simple yet powerful belief — every
              ambitious student and professional deserves access to world-class
              education and career opportunities, regardless of where they come
              from.
            </p>
            <p
              style={{
                color: '#3E2C23',
                fontSize: 'clamp(14px, 1.7vw, 16px)',
                lineHeight: 1.85,
                marginBottom: '18px',
                opacity: 0.82,
              }}
            >
              What started as a small office in Guntur has grown into a
              full-service international consultancy, trusted by thousands of
              families across India. Our team of visa experts, university
              advisors, and career counselors work tirelessly to make your
              global aspirations a reality.
            </p>
            <p
              style={{
                color: '#3E2C23',
                fontSize: 'clamp(14px, 1.7vw, 16px)',
                lineHeight: 1.85,
                opacity: 0.82,
              }}
            >
              Today, we&apos;re proud to have helped{' '}
              <strong style={{ color: '#DE802B' }}>5,000+ students</strong> and
              professionals successfully study, work, and settle in
              <strong style={{ color: '#DE802B' }}> 15+ countries</strong> —
              and we&apos;re just getting started.
            </p>
          </div>

          {/* Founder Quote Card */}
          <motion.div
            whileHover={{ y: -6 }}
            style={{
              background: '#3E2C23',
              borderRadius: '8px',
              padding: 'clamp(32px, 4vw, 44px)',
              color: '#FFFFFF',
              boxShadow:
                '0 30px 80px rgba(62,44,35,0.3), 0 10px 30px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.4s',
              border: '1px solid rgba(222,128,43,0.2)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background:
                  'linear-gradient(225deg, #DE802B 0%, rgba(222,128,43,0) 70%)',
                opacity: 0.4,
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                background: '#DE802B',
                borderRadius: '14px',
                marginBottom: '20px',
                boxShadow: '0 10px 24px rgba(222,128,43,0.4)',
              }}
            >
              <Quote size={28} color="#FFFFFF" />
            </div>

            <p
              style={{
                fontSize: 'clamp(17px, 2.2vw, 21px)',
                lineHeight: 1.55,
                fontWeight: 500,
                marginBottom: '28px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              &ldquo;We don&apos;t just process applications.{' '}
              <span style={{ color: '#DE802B', fontStyle: 'italic' }}>
                We build futures
              </span>{' '}
              — one student, one professional, one family at a time.&rdquo;
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                paddingTop: '22px',
                borderTop: '1px dashed rgba(255,255,255,0.2)',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #DE802B 0%, #c66f1d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '17px',
                  boxShadow: '0 8px 20px rgba(222,128,43,0.4)',
                }}
              >
                RK
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px' }}>
                  Rajesh Kumar
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    opacity: 0.7,
                    marginTop: '2px',
                    letterSpacing: '0.5px',
                  }}
                >
                  Founder & CEO
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MISSION / VISION / VALUES — Numbered cards
      ═══════════════════════════════════════════════════════ */}
      <div
        ref={ref}
        style={{
          background: '#FFFFFF',
          padding: 'clamp(70px, 9vw, 110px) clamp(16px, 4vw, 24px)',
        }}
      >
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <SectionHeader
            badge="WHAT DRIVES US"
            title="Mission, Vision & Values"
            subtitle="The principles that guide every decision we make"
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(20px, 3vw, 28px)',
            }}
          >
            {[
              {
                icon: Target,
                num: '01',
                title: 'Our Mission',
                text: 'To empower individuals with the knowledge, resources, and personalized guidance needed to successfully pursue world-class education and rewarding careers abroad.',
              },
              {
                icon: Eye,
                num: '02',
                title: 'Our Vision',
                text: 'To be the most trusted global education consultancy — recognized for unwavering integrity, deep expertise, and life-changing outcomes for every student and professional we serve.',
              },
              {
                icon: Heart,
                num: '03',
                title: 'Our Values',
                text: 'Transparency in every conversation, dedication to your success, and genuine care for your journey. We treat every visa approval, admission, and job offer as our own victory.',
              },
            ].map(({ icon: Icon, num, title, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -10 }}
                style={{
                  background: '#FAFBF9',
                  borderRadius: '8px',
                  padding: 'clamp(32px, 4vw, 40px) clamp(24px, 3vw, 32px)',
                  position: 'relative',
                  border: '2px solid rgba(62,44,35,0.06)',
                  transition: 'all 0.3s',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#DE802B'
                  e.currentTarget.style.boxShadow =
                    '0 20px 50px rgba(62,44,35,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(62,44,35,0.06)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-10px',
                    fontSize: '140px',
                    fontWeight: 900,
                    color: 'rgba(222,128,43,0.06)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                    letterSpacing: '-8px',
                  }}
                >
                  {num}
                </div>

                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    background:
                      'linear-gradient(135deg, #DE802B 0%, #c66f1d 100%)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '22px',
                    boxShadow: '0 10px 24px rgba(222,128,43,0.35)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Icon size={28} color="#FFFFFF" />
                </div>
                <h3
                  style={{
                    fontSize: 'clamp(20px, 2.5vw, 24px)',
                    fontWeight: 800,
                    color: '#3E2C23',
                    marginBottom: '14px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: '#3E2C23',
                    lineHeight: 1.75,
                    fontSize: 'clamp(14px, 1.6vw, 15px)',
                    opacity: 0.78,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          WHAT WE DO — Horizontal card layout
      ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          background: '#FAFBF9',
          padding: 'clamp(70px, 9vw, 110px) clamp(16px, 4vw, 24px)',
        }}
      >
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <SectionHeader
            badge="WHAT WE DO"
            title="Comprehensive Services"
            subtitle="From your first inquiry to your first day abroad — we're with you every step of the way"
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
              gap: 'clamp(20px, 3vw, 28px)',
            }}
          >
            {whatWeDo.map(({ icon: Icon, title, text, points }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  padding: 'clamp(28px, 3.5vw, 36px)',
                  border: '2px solid rgba(62,44,35,0.06)',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 24px 60px rgba(62,44,35,0.12)'
                  e.currentTarget.style.borderColor = '#DE802B'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'rgba(62,44,35,0.06)'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background:
                      'linear-gradient(90deg, #DE802B 0%, #FFB870 100%)',
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '18px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      background: '#3E2C23',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 8px 20px rgba(62,44,35,0.2)',
                    }}
                  >
                    <Icon size={28} color="#DE802B" />
                  </div>
                  <h3
                    style={{
                      fontSize: 'clamp(19px, 2.3vw, 23px)',
                      fontWeight: 800,
                      color: '#3E2C23',
                      lineHeight: 1.2,
                      paddingTop: '8px',
                    }}
                  >
                    {title}
                  </h3>
                </div>

                <p
                  style={{
                    color: '#3E2C23',
                    fontSize: 'clamp(13px, 1.5vw, 14.5px)',
                    lineHeight: 1.7,
                    marginBottom: '20px',
                    opacity: 0.78,
                  }}
                >
                  {text}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px dashed rgba(62,44,35,0.15)',
                  }}
                >
                  {points.map((point, j) => (
                    <div
                      key={j}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12.5px',
                        color: '#3E2C23',
                        fontWeight: 500,
                      }}
                    >
                      <CheckCircle
                        size={13}
                        color="#DE802B"
                        style={{ flexShrink: 0 }}
                      />
                      {point}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          STATS — White cards on green background
      ═══════════════════════════════════════════════════════ */}
      <div
        ref={ref2}
        style={{
          background: '#C0E1D2',
          padding: 'clamp(70px, 9vw, 110px) clamp(16px, 4vw, 24px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(62,44,35,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <SectionHeader
            badge="NUMBERS THAT SPEAK"
            title="A Track Record We're Proud Of"
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: 'clamp(18px, 2.5vw, 24px)',
            }}
          >
            {[
              {
                icon: Award,
                title: '15+',
                text: 'Years of Excellence',
                desc: 'Industry leadership since 2010',
              },
              {
                icon: Users,
                title: '5,000+',
                text: 'Students Placed',
                desc: 'Across 15+ countries worldwide',
              },
              {
                icon: Globe,
                title: '15+',
                text: 'Countries Covered',
                desc: 'Global education network',
              },
              {
                icon: Target,
                title: '98%',
                text: 'Visa Success Rate',
                desc: 'Industry-leading approval rate',
              },
            ].map(({ icon: Icon, title, text, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView2 ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, type: 'spring' }}
                whileHover={{ y: -6 }}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  padding: 'clamp(24px, 3vw, 32px) clamp(20px, 2.5vw, 24px)',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(62,44,35,0.08)',
                  border: '1px solid rgba(62,44,35,0.05)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0 20px 50px rgba(62,44,35,0.15)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0 10px 30px rgba(62,44,35,0.08)')
                }
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    background:
                      'linear-gradient(135deg, #DE802B 0%, #c66f1d 100%)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 8px 20px rgba(222,128,43,0.35)',
                  }}
                >
                  <Icon size={26} color="#FFFFFF" />
                </div>
                <div
                  style={{
                    fontSize: 'clamp(32px, 5vw, 44px)',
                    fontWeight: 900,
                    color: '#DE802B',
                    marginBottom: '6px',
                    lineHeight: 1,
                    letterSpacing: '-1px',
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    color: '#3E2C23',
                    fontSize: '14px',
                    fontWeight: 800,
                    marginBottom: '6px',
                  }}
                >
                  {text}
                </div>
                <div
                  style={{
                    color: '#3E2C23',
                    fontSize: '11.5px',
                    opacity: 0.65,
                    lineHeight: 1.5,
                  }}
                >
                  {desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          COUNTRIES WE COVER
      ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: 'clamp(70px, 9vw, 110px) clamp(16px, 4vw, 24px)',
        }}
      >
        <SectionHeader
          badge="GLOBAL REACH"
          title="Countries We Cover"
          subtitle="Your dream destination is within reach"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: 'clamp(12px, 2vw, 16px)',
          }}
        >
          {countries.map(({ flag, name }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4, scale: 1.04 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '6px',
                padding: 'clamp(16px, 2vw, 20px) clamp(14px, 2vw, 18px)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'default',
                border: '1px solid rgba(62,44,35,0.08)',
                transition: 'all 0.3s',
                borderLeft: '3px solid #DE802B',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 12px 28px rgba(62,44,35,0.12)'
                e.currentTarget.style.borderLeftWidth = '6px'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderLeftWidth = '3px'
              }}
            >
              <span style={{ fontSize: 'clamp(24px, 3vw, 30px)' }}>{flag}</span>
              <span
                style={{
                  fontSize: 'clamp(12px, 1.5vw, 14px)',
                  fontWeight: 700,
                  color: '#3E2C23',
                }}
              >
                {name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          WHY CHOOSE US — Dark section with glass cards
      ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          background: '#3E2C23',
          padding: 'clamp(70px, 9vw, 110px) clamp(16px, 4vw, 24px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(222,128,43,0.15) 0%, rgba(222,128,43,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <SectionHeader
            badge="WHY CHOOSE US"
            title="The Talento Nova Difference"
            subtitle="Four reasons families across India trust us with their biggest dreams"
            light
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: 'clamp(18px, 2.5vw, 24px)',
            }}
          >
            {values.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                  padding: 'clamp(24px, 3vw, 30px) clamp(20px, 2.5vw, 24px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(222,128,43,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(222,128,43,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    background:
                      'linear-gradient(135deg, #DE802B 0%, #c66f1d 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px',
                    boxShadow: '0 10px 24px rgba(222,128,43,0.4)',
                  }}
                >
                  <Icon size={26} color="#FFFFFF" />
                </div>
                <h3
                  style={{
                    fontSize: 'clamp(17px, 2.1vw, 19px)',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: '10px',
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 'clamp(13px, 1.5vw, 14px)',
                    lineHeight: 1.65,
                  }}
                >
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          OUR TEAM
      ═══════════════════════════════════════════════════════ */}
      <div
        ref={ref3}
        style={{
          background: '#FAFBF9',
          padding: 'clamp(70px, 9vw, 110px) clamp(16px, 4vw, 24px)',
        }}
      >
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <SectionHeader
            badge="MEET THE EXPERTS"
            title="Our Leadership Team"
            subtitle="Decades of combined expertise, committed to your success"
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: 'clamp(18px, 2.5vw, 24px)',
            }}
          >
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView3 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '2px solid rgba(62,44,35,0.06)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#DE802B'
                  e.currentTarget.style.boxShadow =
                    '0 20px 50px rgba(62,44,35,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(62,44,35,0.06)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #3E2C23 0%, #2a1f18 100%)',
                    padding:
                      'clamp(28px, 3.5vw, 36px) 20px clamp(60px, 6vw, 72px)',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, #DE802B 0%, #c66f1d 100%)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '26px',
                      fontWeight: 900,
                      margin: '0 auto',
                      boxShadow:
                        '0 14px 30px rgba(222,128,43,0.5), 0 0 0 6px rgba(222,128,43,0.15)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {member.avatar}
                  </div>
                </div>

                <div
                  style={{
                    padding:
                      '0 clamp(20px, 2.5vw, 26px) clamp(24px, 3vw, 28px)',
                    textAlign: 'center',
                    marginTop: '-40px',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '6px',
                      padding: '14px 14px 18px',
                      boxShadow: '0 10px 25px rgba(62,44,35,0.1)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'clamp(16px, 2vw, 18px)',
                        fontWeight: 800,
                        color: '#3E2C23',
                        marginBottom: '4px',
                      }}
                    >
                      {member.name}
                    </div>
                    <div
                      style={{
                        color: '#DE802B',
                        fontWeight: 800,
                        fontSize: '12px',
                        marginBottom: '8px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {member.role}
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        background: 'rgba(222,128,43,0.1)',
                        color: '#DE802B',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '50px',
                        marginBottom: '12px',
                      }}
                    >
                      {member.exp}
                    </div>
                    <p
                      style={{
                        color: '#3E2C23',
                        fontSize: '12.5px',
                        lineHeight: 1.55,
                        opacity: 0.75,
                        fontStyle: 'italic',
                      }}
                    >
                      &ldquo;{member.bio}&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 24px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            background:
              'linear-gradient(135deg, #DE802B 0%, #c66f1d 60%, #a85d18 100%)',
            borderRadius: '12px',
            padding: 'clamp(40px, 6vw, 70px) clamp(28px, 4vw, 60px)',
            boxShadow: '0 30px 80px rgba(222,128,43,0.4)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.08) 1.5px, transparent 1.5px)',
              backgroundSize: '28px 28px',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: '-80px',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: 'rgba(62,44,35,0.15)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(28px, 4vw, 48px)',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '16px',
                  marginBottom: '20px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <Plane size={32} color="#FFFFFF" />
              </motion.div>

              <h2
                style={{
                  fontSize: 'clamp(28px, 4.5vw, 42px)',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  marginBottom: '14px',
                  letterSpacing: '-1px',
                  lineHeight: 1.1,
                }}
              >
                Ready to Begin Your
                <br />
                <span style={{ fontStyle: 'italic' }}>Global Journey?</span>
              </h2>
              <p
                style={{
                  color: 'rgba(255,255,255,0.92)',
                  fontSize: 'clamp(14px, 1.8vw, 17px)',
                  lineHeight: 1.6,
                  marginBottom: '0',
                }}
              >
                Take the first step. Book a free consultation today and
                let&apos;s map out your path to international success
                together.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'stretch',
              }}
            >
              <Link href="/book" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: '#C0E1D2',
                    color: '#DE802B',
                    border: 'none',
                    padding: '16px 28px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 14px 35px rgba(0,0,0,0.25)',
                    WebkitTapHighlightColor: 'transparent',
                    width: '100%',
                  }}
                >
                  Book Free Consultation
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: '#FFFFFF',
                    border: '2px solid rgba(255,255,255,0.5)',
                    padding: '16px 28px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    WebkitTapHighlightColor: 'transparent',
                    width: '100%',
                  }}
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}