// src/app/api/booking/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json()

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email and phone are required' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        message: message || null,
        amount: 0,
        status: 'pending',
      },
    })

    // Send email (optional)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
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
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_TO || process.env.EMAIL_USER,
          subject: `📅 New Meeting Request: ${name}`,
          html: `
            <div style="font-family:Arial;max-width:600px;margin:0 auto;background:#FFF6DE;padding:30px;border-radius:12px">
              <h2 style="color:#3E2C23">📅 New Meeting Request</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:10px 0;font-weight:bold;color:#3E2C23">Name:</td><td style="color:#3E2C23">${name}</td></tr>
                <tr><td style="padding:10px 0;font-weight:bold;color:#3E2C23">Email:</td><td style="color:#3E2C23">${email}</td></tr>
                <tr><td style="padding:10px 0;font-weight:bold;color:#3E2C23">Phone:</td><td style="color:#3E2C23">${phone}</td></tr>
                ${
                  message
                    ? `<tr><td style="padding:10px 0;font-weight:bold;color:#3E2C23;vertical-align:top">Message:</td><td style="color:#3E2C23">${message}</td></tr>`
                    : ''
                }
              </table>
              <div style="margin-top:24px;padding:14px;background:#3E2C23;color:#FFF6DE;border-radius:8px;text-align:center">
                ⚠️ Contact within 24 hours to schedule meeting
              </div>
            </div>
          `,
        })
      }
    } catch (e) {
      console.error('Email error:', e.message)
    }

    return NextResponse.json({ success: true, bookingId: booking.id })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}