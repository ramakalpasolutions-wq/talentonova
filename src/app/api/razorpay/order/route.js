// src/app/api/razorpay/order/route.js
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(request) {
  try {
    const { amount } = await request.json()

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Razorpay not configured' },
        { status: 500 }
      )
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    })

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('Order error:', error)
    return NextResponse.json(
      { error: error.error?.description || error.message },
      { status: 500 }
    )
  }
}