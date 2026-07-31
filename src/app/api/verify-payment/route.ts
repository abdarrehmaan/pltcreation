import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET;
    const key_secret = rawKeySecret?.trim().replace(/^["']|["']$/g, '');

    if (!key_secret) {
      return NextResponse.json(
        { error: 'Razorpay Key Secret is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const razorpay_order_id = body.razorpay_order_id || body.order_id;
    const razorpay_payment_id = body.razorpay_payment_id || body.payment_id;
    const razorpay_signature = body.razorpay_signature || body.signature;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields: razorpay_order_id, razorpay_payment_id, razorpay_signature' },
        { status: 400 }
      );
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment signature verification failed. Signature mismatch.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error('Razorpay Verify Payment Error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed due to internal error' },
      { status: 500 }
    );
  }
}
