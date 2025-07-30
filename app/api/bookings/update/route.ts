import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateBookingData } from '@/lib/constants'

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

    // Process each update individually with validation and pricing recalculation
    const results = await Promise.all(updates.map(async (update) => {
      const { id, ...updateData } = update
      
      // Log the original update data
      console.log('Updating booking:', id, 'with original data:', updateData)
      
      // Validate and normalize the data
      const validation = validateBookingData(updateData)
      
      if (!validation.isValid) {
        console.error('Validation errors for booking', id, ':', validation.errors)
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
      }
      
      // Use the normalized data for the update
      const normalizedData = validation.normalizedData
      console.log('Updating booking:', id, 'with normalized data:', normalizedData)
      
      const { data, error } = await supabase
        .from('bookings')
        .update(normalizedData)
        .eq('id', id)
        .select('*')
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