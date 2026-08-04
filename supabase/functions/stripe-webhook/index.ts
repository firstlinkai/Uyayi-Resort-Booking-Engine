import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0"
import Stripe from 'npm:stripe@^13.10.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new Response("No signature", { status: 400 })
  }

  const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
  })

  let event
  const body = await req.text()

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      endpointSecret ?? ""
    )
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Initialize Supabase
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  )

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object
      const bookingId = session.metadata?.booking_id

      if (bookingId) {
        const { error } = await supabaseClient
          .from("bookings")
          .update({ status: "confirmed" })
          .eq("id", bookingId)

        if (error) {
          console.error(`Error updating booking ${bookingId}:`, error)
          return new Response("Error updating booking", { status: 500 })
        }
        
        console.log(`Booking ${bookingId} confirmed!`)
      }
      break

    case "checkout.session.expired":
      const expiredSession = event.data.object
      const expiredBookingId = expiredSession.metadata?.booking_id

      if (expiredBookingId) {
        await supabaseClient
          .from("bookings")
          .update({ status: "expired" })
          .eq("id", expiredBookingId)
      }
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  })
})
