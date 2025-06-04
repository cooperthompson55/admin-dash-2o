import { NextResponse } from 'next/server'
import { Dropbox } from 'dropbox'
import fetch from 'node-fetch'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 })
    }

    // Exchange the code for tokens
    const tokenResponse = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.DROPBOX_CLIENT_ID || '',
        client_secret: process.env.DROPBOX_CLIENT_SECRET || '',
        redirect_uri: process.env.DROPBOX_REDIRECT_URI || '',
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', errorText)
      throw new Error('Failed to exchange code for token')
    }

    const tokens = await tokenResponse.json()

    // Store tokens in cookies
    const cookieStore = await cookies()
    cookieStore.set('dropbox_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in
    })

    if (tokens.refresh_token) {
      cookieStore.set('dropbox_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      })
    }

    // Redirect to success page
    const successUrl = new URL('/auth/success', request.url)
    successUrl.searchParams.set('has_tokens', 'true')
    if (tokens.refresh_token) {
      successUrl.searchParams.set('has_refresh', 'true')
    }
    successUrl.searchParams.set('access_token', tokens.access_token)
    successUrl.searchParams.set('expiry', (Date.now() + tokens.expires_in * 1000).toString())

    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error('Error in Dropbox callback:', error)
    return NextResponse.json(
      { error: 'Failed to complete OAuth flow' },
      { status: 500 }
    )
  }
} 