// src/app/api/auth/verify-otp/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // ─── Find OTP record ───
    const otpRecord = await prisma.otpVerification.findUnique({
      where: { email },
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new one.' },
        { status: 404 }
      )
    }

    // ─── Check expiration ───
    if (new Date() > otpRecord.expiresAt) {
      await prisma.otpVerification.delete({ where: { email } })
      return NextResponse.json(
        { error: 'OTP expired. Please request a new one.' },
        { status: 410 }
      )
    }

    // ─── Max attempts check (5) ───
    if (otpRecord.attempts >= 5) {
      await prisma.otpVerification.delete({ where: { email } })
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      )
    }

    // ─── Verify OTP ───
    if (otpRecord.otp !== otp.toString()) {
      await prisma.otpVerification.update({
        where: { email },
        data: { attempts: otpRecord.attempts + 1 },
      })

      const remaining = 5 - (otpRecord.attempts + 1)
      return NextResponse.json(
        {
          error: `Invalid OTP. ${remaining} attempt${
            remaining !== 1 ? 's' : ''
          } remaining.`,
        },
        { status: 400 }
      )
    }

    // ─── OTP Valid → Create User ───
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      await prisma.otpVerification.delete({ where: { email } })
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        name: otpRecord.name,
        email: otpRecord.email,
        password: otpRecord.password, // Already hashed
        role: 'user',
      },
    })

    // ─── Delete OTP record after successful verification ───
    await prisma.otpVerification.delete({ where: { email } })

    return NextResponse.json(
      {
        message: 'Account created successfully',
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}