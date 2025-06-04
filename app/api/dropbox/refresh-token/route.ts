import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fetch from 'node-fetch'

export async function POST(request: Request) {
  try {
    let refreshTokenFromBody;
    try {
      const body = await request.json();
      refreshTokenFromBody = body?.refreshToken;
    } catch (e) {
      // Ignore error if body is not JSON or not present
      console.warn('Could not parse refresh token from body or body not present', e);
    }

    const cookieStore = await cookies()
    const refreshTokenFromCookie = cookieStore.get('dropbox_refresh_token')?.value

    const refreshToken = refreshTokenFromBody || refreshTokenFromCookie;

    if (!refreshToken) {
      console.error('No refresh token found in body or cookies')
      return NextResponse.json(
        { error: 'No refresh token available' },
        { status: 401 }
      )
    }
    
    console.log(`Using refresh token (from ${refreshTokenFromBody ? 'body' : 'cookie'}) for Dropbox token refresh.`);

    if (!process.env.DROPBOX_CLIENT_ID || !process.env.DROPBOX_CLIENT_SECRET) {
      console.error('Missing Dropbox credentials')
      return NextResponse.json(
        { error: 'Missing Dropbox credentials' },
        { status: 500 }
      )
    }

    // Get a new access token using the refresh token
    const tokenResponse = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.DROPBOX_CLIENT_ID,
        client_secret: process.env.DROPBOX_CLIENT_SECRET,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token refresh failed:', errorText)
      throw new Error('Failed to refresh token')
    }

    const tokens = await tokenResponse.json()
    
    if (!tokens.access_token) {
      throw new Error('No access token received from refresh')
    }

    // Update the access token cookie
    cookieStore.set('dropbox_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
      path: '/' // Explicitly set path for broader cookie availability
    })

    return NextResponse.json({ 
      success: true,
      message: 'Token refreshed successfully',
      accessToken: tokens.access_token
    })
  } catch (error) {
    console.error('Error refreshing Dropbox token:', error)
    return NextResponse.json(
      { error: 'Failed to refresh Dropbox token', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 