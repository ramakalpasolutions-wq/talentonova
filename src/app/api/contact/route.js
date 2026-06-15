// src/app/api/contact/route.js
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

// Map reason value → display label + emoji
const reasonMap = {
  general: { label: 'General Inquiry', icon: '💬' },
  education: { label: 'Abroad Education', icon: '🎓' },
  jobs: { label: 'Job Placement', icon: '💼' },
  visa: { label: 'Visa Consultation', icon: '📋' },
  'test-prep': { label: 'Test Preparation', icon: '📚' },
  other: { label: 'Other', icon: '✨' },
}

export async function POST(request) {
  try {
    const { name, email, phone, reason, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      )
    }

    // Validate reason — fallback to "general" if invalid
    const validReason = reasonMap[reason] ? reason : 'general'
    const reasonInfo = reasonMap[validReason]

    // ─── Save to DB (now includes reason) ───
    await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || '',
        reason: validReason,
        message,
      },
    })

    // ─── Send Email ───
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
      to: process.env.EMAIL_TO,
      subject: `${reasonInfo.icon} ${reasonInfo.label} — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FFF6DE;padding:30px;border-radius:12px">
          <h2 style="color:#3E2C23;border-bottom:2px solid #3E2C23;padding-bottom:10px;margin-top:0">
            New Contact Message
          </h2>

          <!-- Reason Badge -->
          <div style="display:inline-block;background:#DE802B;color:#FFFFFF;padding:8px 16px;border-radius:50px;font-weight:bold;font-size:14px;margin-bottom:20px">
            ${reasonInfo.icon} ${reasonInfo.label}
          </div>

          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:10px 0;color:#3E2C23;font-weight:bold;width:120px">Name:</td>
              <td style="padding:10px 0;color:#3E2C23">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#3E2C23;font-weight:bold">Email:</td>
              <td style="padding:10px 0;color:#3E2C23">
                <a href="mailto:${email}" style="color:#DE802B;text-decoration:none">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#3E2C23;font-weight:bold">Phone:</td>
              <td style="padding:10px 0;color:#3E2C23">
                ${
                  phone
                    ? `<a href="tel:${phone}" style="color:#DE802B;text-decoration:none">${phone}</a>`
                    : 'Not provided'
                }
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#3E2C23;font-weight:bold">Inquiry Type:</td>
              <td style="padding:10px 0;color:#3E2C23">${reasonInfo.icon} ${reasonInfo.label}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#3E2C23;font-weight:bold;vertical-align:top">Message:</td>
              <td style="padding:10px 0;color:#3E2C23;line-height:1.6">${message.replace(
                /\n/g,
                '<br>'
              )}</td>
            </tr>
          </table>

          <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(62,44,35,0.15);font-size:12px;color:#3E2C23;opacity:0.7">
            Received at: ${new Date().toLocaleString('en-IN', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}