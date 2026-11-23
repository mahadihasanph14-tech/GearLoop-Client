import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'


export async function POST() {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1UdlrICRBwwjwZ1mwofc0VR2',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: '{{INTEGRATION_ID}}',
    });
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
  console.error(err);

  return NextResponse.json(
    { error: err instanceof Error ? err.message : "Something went wrong" },
    { status: 500 }
  );
}
}