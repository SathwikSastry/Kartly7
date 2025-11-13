import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderProduct {
  id: string
  quantity: number
}

interface OrderRequest {
  customer_name: string
  email: string
  phone: string
  address: string
  products: OrderProduct[]
  points_to_redeem?: number
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
      console.error('Authentication failed', {
        timestamp: new Date().toISOString(),
        error_type: 'AUTH_FAILED'
      })
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

    // Validate product structure
    for (const product of body.products) {
      if (!product.id || typeof product.quantity !== 'number' || product.quantity <= 0 || !Number.isInteger(product.quantity)) {
        return new Response(
          JSON.stringify({ error: 'Invalid product data' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Validate points redemption amount
    const pointsToRedeem = body.points_to_redeem || 0
    if (typeof pointsToRedeem !== 'number' || pointsToRedeem < 0 || !Number.isInteger(pointsToRedeem)) {
      return new Response(
        JSON.stringify({ error: 'Invalid points redemption amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch product prices from database and calculate server-side total
    const productIds = body.products.map(p => p.id)
    const { data: productsData, error: productsError } = await supabaseClient
      .from('products')
      .select('id, name, price')
      .in('id', productIds)

    if (productsError) {
      console.error('Failed to fetch products', {
        timestamp: new Date().toISOString(),
        error_code: productsError.code
      })
      return new Response(
        JSON.stringify({ error: 'Failed to verify product prices' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify all products exist
    if (productsData.length !== productIds.length) {
      return new Response(
        JSON.stringify({ error: 'One or more products not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate actual total from database prices
    const productMap = new Map(productsData.map(p => [p.id, p]))
    let calculatedTotal = 0
    const orderProducts = []

    for (const item of body.products) {
      const product = productMap.get(item.id)
      if (!product) {
        return new Response(
          JSON.stringify({ error: `Product ${item.id} not found` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const itemTotal = Number(product.price) * item.quantity
      calculatedTotal += itemTotal
      orderProducts.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: item.quantity
      })
    }

    // Verify and process points redemption
    let pointsDiscount = 0
    let actualPointsToRedeem = 0

    if (pointsToRedeem > 0) {
      // Fetch user's current points
      const { data: userPointsData, error: pointsError } = await supabaseClient
        .from('user_points')
        .select('total_points')
        .eq('user_id', user.id)
        .single()

      if (pointsError && pointsError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Failed to fetch user points', {
          timestamp: new Date().toISOString(),
          error_code: pointsError.code
        })
        return new Response(
          JSON.stringify({ error: 'Failed to verify points balance' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const availablePoints = userPointsData?.total_points || 0

      // Verify user has enough points
      if (pointsToRedeem > availablePoints) {
        return new Response(
          JSON.stringify({ error: 'Insufficient points balance' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Calculate discount (100 points = ₹10)
      pointsDiscount = (pointsToRedeem / 100) * 10

      // Ensure discount doesn't exceed order total
      if (pointsDiscount > calculatedTotal) {
        pointsDiscount = calculatedTotal
        actualPointsToRedeem = Math.floor((calculatedTotal / 10) * 100)
      } else {
        actualPointsToRedeem = pointsToRedeem
      }
    }

    const finalTotal = calculatedTotal - pointsDiscount

    if (finalTotal < 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid order total after discount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert order into database
    const { data: orderData, error: insertError } = await supabaseClient
      .from('orders')
      .insert([{
        user_id: user.id,
        customer_name: body.customer_name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone,
        address: body.address.trim(),
        products: orderProducts,
        total_amount: finalTotal,
        payment_screenshot_url: body.screenshot_path || null,
        transaction_id: body.transaction_id?.trim() || null,
        status: 'Pending Verification',
      }])
      .select('id')
      .single()

    if (insertError) {
      console.error('Order creation failed', {
        timestamp: new Date().toISOString(),
        user_id: user.id,
        error_code: insertError.code
      })
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const orderId = orderData.id

    // Calculate points earned (5 points per ₹100)
    const pointsEarned = Math.floor(finalTotal / 100) * 5

    // Update user points atomically (deduct redeemed, add earned)
    const netPointsChange = pointsEarned - actualPointsToRedeem

    if (netPointsChange !== 0 || actualPointsToRedeem > 0) {
      // Ensure user_points record exists
      const { data: existingPoints } = await supabaseClient
        .from('user_points')
        .select('id, total_points')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!existingPoints) {
        // Create initial points record
        const { error: createError } = await supabaseClient
          .from('user_points')
          .insert({
            user_id: user.id,
            total_points: Math.max(0, netPointsChange),
            tier: 'Bronze'
          })

        if (createError) {
          console.error('Failed to create user points', {
            timestamp: new Date().toISOString(),
            user_id: user.id,
            error_code: createError.code
          })
        }
      } else {
        // Update existing points
        const newTotal = existingPoints.total_points + netPointsChange
        const { error: updateError } = await supabaseClient
          .from('user_points')
          .update({ total_points: Math.max(0, newTotal) })
          .eq('user_id', user.id)

        if (updateError) {
          console.error('Failed to update user points', {
            timestamp: new Date().toISOString(),
            user_id: user.id,
            error_code: updateError.code
          })
        }
      }

      // Record points transactions
      const transactions = []
      
      if (actualPointsToRedeem > 0) {
        transactions.push({
          user_id: user.id,
          order_id: orderId,
          points_change: -actualPointsToRedeem,
          transaction_type: 'redeemed',
          description: `Redeemed ${actualPointsToRedeem} points for ₹${pointsDiscount.toFixed(2)} discount`
        })
      }

      if (pointsEarned > 0) {
        transactions.push({
          user_id: user.id,
          order_id: orderId,
          points_change: pointsEarned,
          transaction_type: 'earned',
          description: `Earned ${pointsEarned} points from order`
        })
      }

      if (transactions.length > 0) {
        const { error: transactionError } = await supabaseClient
          .from('points_transactions')
          .insert(transactions)

        if (transactionError) {
          console.error('Failed to record points transactions', {
            timestamp: new Date().toISOString(),
            user_id: user.id,
            error_code: transactionError.code
          })
        }
      }
    }

    console.log(`Order created successfully for user ${user.id}`, {
      order_id: orderId,
      total: finalTotal,
      points_earned: pointsEarned,
      points_redeemed: actualPointsToRedeem
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        order_id: orderId,
        points_earned: pointsEarned,
        points_redeemed: actualPointsToRedeem
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Order submission error', {
      timestamp: new Date().toISOString(),
      error_type: 'INTERNAL_ERROR'
    })
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
