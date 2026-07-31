import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const rawKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TK6fduM3YcPbY9';
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || 'vG7nDDP26e0j7Vpo7E0v0Ok0';

    const key_id = rawKeyId?.trim().replace(/^["']|["']$/g, '');
    const key_secret = rawKeySecret?.trim().replace(/^["']|["']$/g, '');

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: 'Razorpay API credentials missing in environment variables (.env)' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    // Validate amount presence
    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      return NextResponse.json(
        { error: 'Invalid or missing amount' },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(Number(amount));

    // Validate minimum amount requirement (at least 100 paise = 1 INR)
    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Minimum amount must be at least 100 paise' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: razorpayOrder.id,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      status: razorpayOrder.status,
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);

    const statusCode = error.statusCode || error.status || 500;
    let errorMessage = error.description || error.error?.description || error.message || 'Failed to create Razorpay order';

    if (statusCode === 401 || errorMessage.includes('Authentication failed')) {
      errorMessage = 'Razorpay Authentication Failed (401): The Key ID or Key Secret in your .env file is invalid or deactivated. Please check your credentials in the Razorpay Dashboard.';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
