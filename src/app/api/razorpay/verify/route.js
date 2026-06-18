// src/app/api/razorpay/verify/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = await request.json()

    // Verify signature
    const generated = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generated !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Save booking
    const booking = await prisma.booking.create({
      data: {
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        message: bookingData.message || null,
        amount: bookingData.amount,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: 'success',
      },
    })

    // Send emails
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

        // To user
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: bookingData.email,
          subject: '✅ Consultation Booked - TalentaNova',
          html: `
            <div style="font-family:Arial;max-width:600px;margin:0 auto;background:#FFF6DE;padding:30px;border-radius:12px">
              <h2 style="color:#3E2C23">🎉 Consultation Confirmed!</h2>
              <p style="color:#3E2C23">Dear ${bookingData.name},</p>
              <p style="color:#3E2C23">
                Your in-person consultation slot has been booked successfully.
                Our team will contact you within 24 hours to schedule the meeting.
              </p>
              <div style="background:#3E2C23;color:#FFF6DE;padding:20px;border-radius:8px;margin:20px 0">
                <p style="margin:0 0 8px"><strong>Amount Paid:</strong> ₹${bookingData.amount.toLocaleString()}</p>
                <p style="margin:0 0 8px"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                <p style="margin:0"><strong>Booking ID:</strong> ${booking.id}</p>
              </div>
              <p style="color:#3E2C23">Looking forward to meeting you! 🌍</p>
            </div>
          `,
        })

        // To admin
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_TO || process.env.EMAIL_USER,
          subject: `💰 New Consultation Booking: ${bookingData.name}`,
          html: `
            <div style="font-family:Arial;max-width:600px;margin:0 auto;background:#FFF6DE;padding:30px;border-radius:12px">
              <h2 style="color:#3E2C23">💰 New Paid Booking</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:10px 0;font-weight:bold;color:#3E2C23">Name:</td><td style="color:#3E2C23">${bookingData.name}</td></tr>
                <tr><td style="padding:10px 0;font-weight:bold;color:#3E2C23">Email:</td><td style="color:#3E2C23">${bookingData.email}</td></tr>
                <tr><td style="padding:10px 0;font-weight:bold;color:#3E2C23">Phone:</td><td style="color:#3E2C23">${bookingData.phone}</td></tr>
                <tr><td style="padding:10px 0;font-weight:bold;color:#3E2C23">Amount:</td><td style="color:#3E2C23">₹${bookingData.amount}</td></tr>
                ${bookingData.message ? `<tr><td style="padding:10px 0;font-weight:bold;color:#3E2C23;vertical-align:top">Message:</td><td style="color:#3E2C23">${bookingData.message}</td></tr>` : ''}
                <tr><td style="padding:10px 0;font-weight:bold;color:#3E2C23">Payment ID:</td><td style="color:#3E2C23;font-size:11px">${razorpay_payment_id}</td></tr>
              </table>
              <div style="margin-top:24px;padding:14px;background:#3E2C23;color:#FFF6DE;border-radius:8px;text-align:center">
                ⚠️ Schedule meeting within 24 hours
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
    console.error('Verify error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}