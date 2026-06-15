// src/app/api/auth/send-otp/route.js
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // ─── Validations ───
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // ─── Check if user already exists ───
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered. Please sign in.' },
        { status: 400 }
      )
    }

    // ─── Generate OTP and expiry (10 minutes) ───
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 mins
    const hashedPassword = await hashPassword(password)

    // ─── Save OTP (upsert - replace if exists) ───
    await prisma.otpVerification.upsert({
      where: { email },
      update: {
        otp,
        name,
        password: hashedPassword,
        expiresAt,
        attempts: 0,
      },
      create: {
        email,
        otp,
        name,
        password: hashedPassword,
        expiresAt,
        attempts: 0,
      },
    })

    // ─── Send OTP Email ───
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Talento Nova" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔐 Your OTP Code: ${otp}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#FAFBF9;padding:0;border-radius:16px;overflow:hidden">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#3E2C23 0%,#2a1f18 100%);padding:32px 30px;text-align:center">
            <div style="color:#DE802B;font-size:28px;font-weight:800;margin-bottom:4px">
              Talento<span style="color:#FFFFFF">Nova</span>
            </div>
            <div style="color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600">
              Email Verification
            </div>
          </div>

          <!-- Body -->
          <div style="padding:36px 30px;background:#FFFFFF">
            <h2 style="color:#3E2C23;margin:0 0 12px;font-size:22px;font-weight:800">
              Hi ${name}! 👋
            </h2>
            <p style="color:#3E2C23;font-size:15px;line-height:1.6;margin:0 0 24px;opacity:0.85">
              Thanks for signing up! Please verify your email address by entering the OTP code below:
            </p>

            <!-- OTP Box -->
            <div style="background:linear-gradient(135deg,#DE802B 0%,#c66f1d 100%);padding:24px;border-radius:12px;text-align:center;margin:24px 0;box-shadow:0 10px 30px rgba(222,128,43,0.3)">
              <div style="color:rgba(255,255,255,0.85);font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px">
                Your OTP Code
              </div>
              <div style="color:#FFFFFF;font-size:42px;font-weight:900;letter-spacing:10px;font-family:'Courier New',monospace;text-shadow:0 2px 8px rgba(0,0,0,0.2)">
                ${otp}
              </div>
            </div>

            <!-- Info Box -->
            <div style="background:#E5EEE4;padding:16px 20px;border-radius:10px;margin-top:24px;border-left:4px solid #DE802B">
              <div style="color:#3E2C23;font-size:13px;line-height:1.6;margin:0">
                ⏱️ This code expires in <strong>10 minutes</strong>.<br>
                🔒 Never share this code with anyone.<br>
                ⚠️ If you didn't request this, please ignore this email.
              </div>
            </div>

            <p style="color:#3E2C23;font-size:13px;line-height:1.6;margin:24px 0 0;opacity:0.7;text-align:center">
              Need help? Reply to this email and we'll assist you.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#3E2C23;color:rgba(255,255,255,0.7);padding:20px 30px;text-align:center;font-size:12px">
            © ${new Date().getFullYear()} Talento Nova Consultancy
          </div>
        </div>
      `,
    })

    return NextResponse.json(
      {
        message: 'OTP sent successfully',
        email,
        expiresIn: 600, // seconds
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    )
  }
}