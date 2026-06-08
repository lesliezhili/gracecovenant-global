import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  })
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown'
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const customerEmail = session.customer_details?.email
      if (customerEmail) {
        await supabase.from('profiles').update({
          membership_tier: 'supporter',
          stripe_customer_id: session.customer as string,
          membership_updated_at: new Date().toISOString(),
        }).eq('email', customerEmail)
      }
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await supabase.from('profiles').update({
        membership_tier: 'free',
        membership_updated_at: new Date().toISOString(),
      }).eq('stripe_customer_id', subscription.customer as string)
      break
    }
  }
  return NextResponse.json({ received: true })
}
