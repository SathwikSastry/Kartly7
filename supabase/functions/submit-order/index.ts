import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderProduct {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderRequest {
  customer_name: string
  email: string
  phone: string
  address: string
  products: OrderProduct[]
  total_amount: number
  transaction_id?: string
  screenshot_path?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body: OrderRequest = await req.json()

    // Server-side validation
    if (!body.customer_name || body.customer_name.trim().length < 2 || body.customer_name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid customer name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!body.email || !emailRegex.test(body.email) || body.email.length > 255) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const phoneRegex = /^[0-9]{10}$/
    if (!body.phone || !phoneRegex.test(body.phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number. Must be 10 digits.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!body.address || body.address.trim().length < 10 || body.address.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Invalid address. Must be between 10 and 500 characters.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!Array.isArray(body.products) || body.products.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid products list' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    for (const product of body.products) {
      if (!product.id || !product.name || typeof product.price !== 'number' || product.price <= 0 ||
          typeof product.quantity !== 'number' || product.quantity <= 0 || !Number.isInteger(product.quantity)) {
        return new Response(
          JSON.stringify({ error: 'Invalid product data' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    if (typeof body.total_amount !== 'number' || body.total_amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid total amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert order into database
    const { error: insertError } = await supabaseClient
      .from('orders')
      .insert([{
        user_id: user.id,
        customer_name: body.customer_name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone,
        address: body.address.trim(),
        products: body.products,
        total_amount: body.total_amount,
        payment_screenshot_url: body.screenshot_path || null,
        transaction_id: body.transaction_id?.trim() || null,
        status: 'Pending Verification',
      }])

    if (insertError) {
      console.error('Database insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Order created successfully for user ${user.id}`)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in submit-order function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
