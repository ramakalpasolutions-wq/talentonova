// src/components/home/Testimonials.js
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    country: 'UK 🇬🇧',
    university: 'University of Manchester',
    course: 'MSc Data Science',
    rating: 5,
    text: 'TalentaNova made my dream of studying in the UK a reality. From visa guidance to SOP review, they were with me at every step. Got into my first choice university!',
    avatar: 'PS',
  },
  {
    name: 'Rahul Mehta',
    country: 'Canada 🇨🇦',
    university: 'University of Toronto',
    course: 'MBA',
    rating: 5,
    text: 'The job placement support was incredible. They helped me craft the perfect resume and prepare for interviews. Got a work permit and job within 3 months of graduating!',
    avatar: 'RM',
  },
  {
    name: 'Ananya Patel',
    country: 'Australia 🇦🇺',
    university: 'University of Melbourne',
    course: 'Engineering',
    rating: 5,
    text: 'Professional team with genuine advice. They helped me secure a scholarship worth $15,000! The entire process was so smooth and stress-free.',
    avatar: 'AP',
  },
  {
    name: 'Kiran Kumar',
    country: 'USA 🇺🇸',
    university: 'NYU Stern',
    course: 'MS Finance',
    rating: 5,
    text: 'Got into NYU with their guidance! The IELTS coaching they provided helped me score 8.5 bands. Highly recommend TalentaNova to anyone wanting to study abroad.',
    avatar: 'KK',
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={ref}
      style={{ background: '#3E2C23', padding: '80px 24px' }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(255,246,222,0.1)',
              border: '1px solid rgba(255,246,222,0.15)',
              borderRadius: '50px',
              padding: '6px 18px',
              fontSize: '13px',
              color: '#d4a96a',
              marginBottom: '16px',
              fontWeight: 600,
            }}
          >
            STUDENT STORIES
          </div>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              color: '#FFF6DE',
            }}
          >
            What Our Students Say
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div style={{ position: 'relative' }}>
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'rgba(255,246,222,0.04)',
              border: '1px solid rgba(255,246,222,0.1)',
              borderRadius: '24px',
              padding: '48px 40px',
              textAlign: 'center',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#d4a96a',
                color: '#3E2C23',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 800,
                margin: '0 auto 20px',
              }}
            >
              {testimonials[active].avatar}
            </div>

            {/* Stars */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '4px',
                marginBottom: '20px',
              }}
            >
              {[...Array(testimonials[active].rating)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill="#d4a96a"
                  color="#d4a96a"
                />
              ))}
            </div>

            {/* Quote */}
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255,246,222,0.85)',
                lineHeight: 1.8,
                marginBottom: '28px',
                fontStyle: 'italic',
                maxWidth: '600px',
                margin: '0 auto 28px',
              }}
            >
              &ldquo;{testimonials[active].text}&rdquo;
            </p>

            {/* Info */}
            <div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#FFF6DE',
                }}
              >
                {testimonials[active].name}
              </div>
              <div
                style={{ color: '#d4a96a', fontSize: '14px', marginTop: '4px' }}
              >
                {testimonials[active].course} •{' '}
                {testimonials[active].university}
              </div>
              <div
                style={{
                  color: 'rgba(255,246,222,0.5)',
                  fontSize: '13px',
                  marginTop: '4px',
                }}
              >
                {testimonials[active].country}
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              marginTop: '32px',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setActive(
                  (prev) =>
                    (prev - 1 + testimonials.length) % testimonials.length
                )
              }
              style={{
                background: 'rgba(255,246,222,0.1)',
                border: '1px solid rgba(255,246,222,0.15)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFF6DE',
              }}
            >
              <ChevronLeft size={20} />
            </motion.button>

            {testimonials.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                animate={{
                  width: i === active ? '28px' : '10px',
                  background:
                    i === active
                      ? '#FFF6DE'
                      : 'rgba(255,246,222,0.25)',
                }}
                style={{
                  height: '10px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              />
            ))}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setActive((prev) => (prev + 1) % testimonials.length)
              }
              style={{
                background: 'rgba(255,246,222,0.1)',
                border: '1px solid rgba(255,246,222,0.15)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFF6DE',
              }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}