import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client for this API route
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const bookingData = await request.json()
    
    console.log('Creating new booking:', bookingData)

    // Validate required fields
    const requiredFields = ['property_size', 'services', 'total_amount', 'address', 'preferred_date', 'agent_name', 'agent_email']
    const missingFields = requiredFields.filter(field => !bookingData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Insert the booking into Supabase
    const { data: newBooking, error: insertError } = await supabase
      .from('bookings')
      .insert([{
        ...bookingData,
        status: 'pending',
        payment_status: 'not_paid',
        editing_status: 'unassigned',
        created_at: new Date().toISOString()
      }])
      .select('*, reference_number, selected_package_name, additional_instructions, property_type, bedrooms, bathrooms, parking_spaces, suite_unit, access_instructions, agent_designation, agent_brokerage, feature_sheet_content, promotion_code')
      .single()

    if (insertError) {
      console.error('Error inserting booking:', insertError)
      return NextResponse.json(
        { error: 'Failed to create booking', details: insertError.message },
        { status: 500 }
      )
    }

    console.log('Booking created successfully:', newBooking.id)

    // Call the Supabase Edge Function to send confirmation email
    try {
      console.log('Calling edge function for email confirmation...')
      
      // Use the correct project reference for the edge function URL
      const edgeFunctionUrl = `https://jshnsfvvsmjlxlbdpehf.supabase.co/functions/v1/booking-confirmation`
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseAnonKey) {
        console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured')
        throw new Error('Missing Supabase anon key configuration')
      }
      
      const emailResponse = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ record: newBooking })
      })

      if (!emailResponse.ok) {
        const emailError = await emailResponse.text()
        console.error('Failed to send confirmation email:', {
          status: emailResponse.status,
          statusText: emailResponse.statusText,
          error: emailError
        })
        // Don't fail the booking creation if email fails
        console.warn('Booking created but confirmation email failed to send')
      } else {
        const emailResult = await emailResponse.json()
        console.log('Confirmation email sent successfully:', emailResult)
      }
    } catch (emailError) {
      console.error('Error calling edge function:', emailError)
      // Don't fail the booking creation if email fails
      console.warn('Booking created but confirmation email encountered an error')
    }

    return NextResponse.json({ 
      success: true, 
      booking: newBooking,
      message: 'Booking created successfully'
    })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
} 