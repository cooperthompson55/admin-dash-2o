import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Set up response headers to ensure JSON response
  const headers = {
    'Content-Type': 'application/json',
  }

  try {
    console.log('Starting Dropbox auth flow...')
    console.log('Request URL:', request.url)
    
    const clientId = process.env.DROPBOX_CLIENT_ID
    const redirectUri = process.env.DROPBOX_REDIRECT_URI

    console.log('Environment check:', {
      hasClientId: !!clientId,
      hasRedirectUri: !!redirectUri,
      redirectUri,
      clientId: clientId ? 'present' : 'missing'
    })

    if (!clientId || !redirectUri) {
      console.error('Missing Dropbox credentials:', {
        clientId: !!clientId,
        redirectUri: !!redirectUri
      })
      return NextResponse.json(
        { error: 'Missing Dropbox credentials' },
        { status: 500, headers }
      )
    }

    // Validate redirect URI format
    let validRedirectUri;
    try {
      validRedirectUri = new URL(redirectUri)
      console.log('Valid redirect URI:', validRedirectUri.toString())
    } catch (e) {
      console.error('Invalid redirect URI:', redirectUri, e)
      return NextResponse.json(
        { error: 'Invalid redirect URI format' },
        { status: 500, headers }
      )
    }

    // Construct the OAuth URL
    try {
      const authUrl = new URL('https://www.dropbox.com/oauth2/authorize')
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('client_id', clientId)
      authUrl.searchParams.append('redirect_uri', validRedirectUri.toString())
      authUrl.searchParams.append('token_access_type', 'offline')
      authUrl.searchParams.append('scope', 'account_info.read files.metadata.read files.metadata.write files.content.read files.content.write sharing.write')

      const finalUrl = authUrl.toString()
      console.log('Generated auth URL:', finalUrl)

      return NextResponse.json({ authUrl: finalUrl }, { headers })
    } catch (urlError) {
      console.error('Error constructing auth URL:', urlError)
      return NextResponse.json(
        { error: 'Failed to construct auth URL', details: urlError instanceof Error ? urlError.message : 'Unknown error' },
        { status: 500, headers }
      )
    }
  } catch (error) {
    console.error('Error initiating Dropbox auth:', error)
    return NextResponse.json(
      { 
        error: 'Failed to initiate Dropbox authentication',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers }
    )
  }
} 