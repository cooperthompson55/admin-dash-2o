import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  // Set up response headers to ensure JSON response
  const headers = {
    'Content-Type': 'application/json',
  }

  try {
    console.log('Starting email send process...')
    
    const { to, subject, html, bookingId } = await request.json()

    if (!to || !subject || !html) {
      console.error('Missing required fields:', { to, subject, hasHtml: !!html })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers }
      )
    }

    console.log('Sending email to:', to)
    
    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'RePhotos <noreply@rephotos.ca>',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error.message },
        { status: 500, headers }
      )
    }

    console.log('Email sent successfully:', data)

    // Update booking with delivery_email_sent = true if bookingId is provided
    if (bookingId) {
      console.log('Updating booking status:', bookingId)
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ delivery_email_sent: true })
        .eq('id', bookingId)

      if (updateError) {
        console.error('Error updating booking:', updateError)
      }
    }

    return NextResponse.json({ success: true }, { headers })
  } catch (error: any) {
    console.error('Error sending email:', {
      name: error?.name,
      message: error?.message,
      status: error?.status,
      code: error?.code,
      stack: error?.stack
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error?.message || 'Unknown error'
      },
      { status: 500, headers }
    )
  }
} 