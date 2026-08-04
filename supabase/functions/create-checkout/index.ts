import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { roomId, checkIn, checkOut, guestCount, userEmail } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Fetch room
    const { data: room, error: roomError } = await supabaseClient
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (roomError || !room) throw new Error('Room not found')

    const price = room.base_price_php || room.price
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    if (nights <= 0) throw new Error('Invalid date range')

    const totalPrice = price * nights
    const bookingRef = `USB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // 2. Create booking (FILLING ALL MANDATORY COLUMNS)
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert({
        booking_ref: bookingRef,
        guest_first_name: 'Guest',
        guest_last_name: 'User',
        guest_email: userEmail,
        guest_phone: 'Not Provided',
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        num_adults: guestCount,
        num_children: 0,
        rate_per_night_php: price,
        subtotal_php: totalPrice,
        extras_total_php: 0,
        discount_amount_php: 0,
        vat_php: 0,
        service_charge_php: 0,
        total_amount_php: totalPrice,
        status: 'pending',
        payment_status: 'unpaid',
        early_checkin_requested: false,
        late_checkout_requested: false,
        honeymoon_package: false,
        booked_via: 'website_direct'
      })
      .select()
      .single()

    if (bookingError) throw new Error(`Booking creation failed: ${bookingError.message}`)

    // 3. Create Stripe Session
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const origin = req.headers.get('origin')

    const formData = new URLSearchParams()
    formData.append('payment_method_types[0]', 'card')
    formData.append('line_items[0][price_data][currency]', 'php')
    formData.append('line_items[0][price_data][product_data][name]', room.name)
    formData.append('line_items[0][price_data][product_data][description]', `${nights} nights at Uyayi Resort`)
    formData.append('line_items[0][price_data][unit_amount]', Math.round(price * 100).toString())
    formData.append('line_items[0][quantity]', nights.toString())
    formData.append('mode', 'payment')
    formData.append('success_url', `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`)
    formData.append('cancel_url', `${origin}/booking/cancelled`)
    formData.append('customer_email', userEmail)
    formData.append('metadata[booking_id]', booking.id)
    formData.append('metadata[room_id]', roomId)

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const session = await stripeResponse.json()

    if (!stripeResponse.ok) {
      throw new Error(session.error?.message || 'Stripe API error')
    }

    // 4. Update booking
    await supabaseClient
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id)

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Function error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
