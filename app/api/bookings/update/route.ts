import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client for this API route
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const updates = await request.json()
    
    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Request body must be an array of updates' },
        { status: 400 }
      )
    }

    // Validate each update has an id
    if (!updates.every(update => update.id)) {
      return NextResponse.json(
        { error: 'Each update must include an id' },
        { status: 400 }
      )
    }

    // Process each update individually to ensure proper handling of empty strings
    const results = await Promise.all(updates.map(async (update) => {
      const { id, ...updateData } = update
      
      // Log the update data for debugging
      console.log('Updating booking:', id, 'with data:', updateData)
      
      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select('id, status, payment_status, editing_status, raw_photos_link, final_edits_link, tour_360_link, editor_link, delivery_page_link, invoice_link, reference_number, selected_package_name, additional_instructions, property_type, bedrooms, bathrooms, parking_spaces, suite_unit, access_instructions, agent_designation, agent_brokerage, feature_sheet_content, promotion_code')
        .single()

      if (error) {
        console.error('Supabase error for booking', id, ':', error)
        throw error
      }

      return data
    }))

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'No data returned from update' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error('Error updating bookings:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
} 