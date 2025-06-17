import { NextResponse } from 'next/server'
import { Dropbox } from 'dropbox'
import fetch from 'node-fetch'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { cookies } from 'next/headers'

// Create Dropbox client with error handling
async function createDropboxClient(request: Request) {
  console.log('Creating Dropbox client...')
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('dropbox_access_token')?.value
  const refreshTokenPresent = !!cookieStore.get('dropbox_refresh_token')?.value
  
  console.log('Cookie store insight:', {
    hasAccessToken: !!accessToken,
    accessTokenSource: accessToken ? 'cookie' : 'not_found',
    hasRefreshToken: refreshTokenPresent,
    cookieNames: Array.from(cookieStore.getAll().map(c => c.name))
  })
  
  if (!accessToken) {
    console.error('No Dropbox access token found in cookies')
    throw new Error('Dropbox access token not available')
  }

  console.log('Access token found, creating client...')
  
  // Create a custom fetch function that ensures proper URL handling
  const customFetch = async (url: string, options: any) => {
    console.log('Custom fetch called with:', { url, options })
    try {
      const response = await fetch(url, options)
      console.log('Custom fetch response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })
      return response
    } catch (error) {
      console.error('Custom fetch error:', error)
      throw error
    }
  }

  let dbx = new Dropbox({ 
    accessToken,
    fetch: customFetch as any,
    clientId: process.env.DROPBOX_CLIENT_ID,
    clientSecret: process.env.DROPBOX_CLIENT_SECRET
  })
  
  // Test the client configuration
  console.log('Testing Dropbox client configuration...')
  try {
    // Use a more specific API call to test the client that doesn't rely on root folder access
    console.log(`Attempting usersGetCurrentAccount with token: ${accessToken ? accessToken.substring(0, 10) + '...' : 'N/A'}`)
    const testResponse = await dbx.usersGetCurrentAccount();
    console.log('Dropbox client configured successfully (usersGetCurrentAccount):', testResponse)
  } catch (error: any) {
    let errorDetails = 'Unknown error details'
    if (error && error.error && typeof error.error === 'string') {
        try {
            // If error.error is a JSON string, parse it
            const parsedError = JSON.parse(error.error);
            errorDetails = parsedError;
        } catch (e) {
            // If not a JSON string, use it as is
            errorDetails = error.error;
        }
    } else if (error && error.message) {
        errorDetails = error.message;
    }

    console.error('Dropbox client configuration test failed (usersGetCurrentAccount):', {
      status: error?.status,
      message: error?.message, // This is likely from customFetch
      dropboxErrorDetails: errorDetails, // Attempt to get more specific Dropbox error
      isAxiosError: error?.isAxiosError, // In case Dropbox SDK uses axios internally
      axiosResponseData: error?.response?.data,
      fullErrorObject: error, // Log the full error object for inspection
      requestUrl: error?.request?.url, // This might be populated by some HTTP clients
      requestHeaders: error?.request?.headers
    })
    
    if (error?.status === 401) {
      console.log('Token is invalid or expired, attempting to refresh...')
      // Explicitly get the refresh token value to send
      const refreshTokenValue = cookieStore.get('dropbox_refresh_token')?.value;

      if (!refreshTokenValue) {
        console.error('Cannot attempt refresh: dropbox_refresh_token cookie not found.');
        throw new Error('Refresh token not available, cannot refresh Dropbox token.');
      }

      try {
        // Use absolute URL for refresh token request
        const refreshUrl = new URL('/api/dropbox/refresh-token', request.url).toString()
        console.log('Making refresh request to:', refreshUrl);
        
        const refreshResponse = await fetch(refreshUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: refreshTokenValue }) // Send refresh token in body
        })

        console.log('Refresh response status:', refreshResponse.status)
        const refreshText = await refreshResponse.text()
        console.log('Refresh response text:', refreshText)

        if (!refreshResponse.ok) {
          console.error('Failed to refresh token:', refreshText)
          throw new Error('Failed to refresh Dropbox token')
        }

        const { accessToken: newAccessToken } = JSON.parse(refreshText)
        console.log('Token refreshed successfully')
        dbx = new Dropbox({ 
          accessToken: newAccessToken,
          fetch: customFetch as any,
          clientId: process.env.DROPBOX_CLIENT_ID,
          clientSecret: process.env.DROPBOX_CLIENT_SECRET
        })
        
        // Test the new client configuration
        console.log(`Attempting usersGetCurrentAccount with NEW token: ${newAccessToken ? newAccessToken.substring(0, 10) + '...' : 'N/A'}`)
        const testResponse = await dbx.usersGetCurrentAccount();
        console.log('New Dropbox client configured successfully (usersGetCurrentAccount):', testResponse)
      } catch (refreshError: any) {
        console.error('Error refreshing token:', {
          status: refreshError?.status,
          message: refreshError?.message,
          error: refreshError,
          stack: refreshError?.stack
        })
        throw new Error('Failed to refresh Dropbox token')
      }
    } else {
      throw error
    }
  }
  
  return dbx
}

// Create folder if it doesn't exist
async function createFolderIfNotExists(dbx: Dropbox, path: string) {
  console.log(`Attempting to create folder: ${path}`)
  try {
    await dbx.filesCreateFolderV2({ path })
    console.log(`Successfully created folder: ${path}`)
    return true
  } catch (error: any) {
    if (error?.status === 409) {
      console.log(`Folder already exists: ${path}`)
      return true
    }
    console.error(`Error creating folder ${path}:`, {
      status: error?.status,
      message: error?.message,
      error: error
    })
    throw error
  }
}

// Create shared link for a folder
async function createSharedLink(dbx: Dropbox, path: string) {
  console.log(`Creating shared link for: ${path}`)
  try {
    const response = await dbx.sharingCreateSharedLinkWithSettings({
      path,
      settings: {
        requested_visibility: { '.tag': 'public' },
        allow_download: true
      }
    })
    console.log(`Successfully created shared link for: ${path}`)
    return response.result.url
  } catch (error: any) {
    console.error(`Error creating shared link for ${path}:`, {
      status: error?.status,
      message: error?.message,
      error: error
    })
    throw error
  }
}

// Wrap the entire handler in a try-catch
export async function POST(request: Request) {
  // Set up response headers to ensure JSON response
  const headers = {
    'Content-Type': 'application/json',
  }

  try {
    console.log('Received request to create Dropbox folders')
    
    // Log environment variables (without sensitive values)
    console.log('Environment check:', {
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })

    let body;
    try {
      body = await request.json()
      console.log('Request body:', body)
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400, headers }
      )
    }

    const { bookingId, propertyAddress, agentName } = body

    if (!bookingId || !propertyAddress || !agentName) {
      console.error('Missing required fields:', { bookingId, propertyAddress, agentName })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers }
      )
    }

    // Validate propertyAddress structure and ensure street is a non-empty string
    if (
      typeof propertyAddress !== 'object' ||
      propertyAddress === null ||
      typeof propertyAddress.street !== 'string' ||
      propertyAddress.street.trim() === ''
    ) {
      console.error(
        'Invalid propertyAddress: must be an object with a non-empty street string.',
        propertyAddress
      )
      return NextResponse.json(
        { error: 'Invalid property address: street is missing or invalid.' },
        { status: 400, headers }
      )
    }
    
    const streetForFolderName = propertyAddress.street;
    // Example: "123 Main Street"
    // If propertyAddress.street2 exists and should be included, the logic would be:
    // const streetForFolderName = propertyAddress.street2 
    //   ? `${propertyAddress.street} ${propertyAddress.street2}` 
    //   : propertyAddress.street;
    // For now, sticking to the example which only uses the main street.
    
    const projectBaseFolder = '/Projects' // This remains as per existing code
    const mainProjectFolderName = `${streetForFolderName} - ${agentName}` // New format
    const mainProjectFolderPath = `${projectBaseFolder}/${mainProjectFolderName}`

    // Define subfolder names
    const rawPhotosFolderName = `Raw Photos`
    const editedMediaFolderName = `Edited Media` // Renamed from Final Edits
    const finalMediaFolderName = `Final Media`    // Renamed from Delivery Page

    console.log('Creating Dropbox client...')
    let dbx;
    try {
      dbx = await createDropboxClient(request)
    } catch (clientError: any) {
      console.error('Error creating Dropbox client:', clientError)
      return NextResponse.json(
        { error: 'Failed to create Dropbox client', details: clientError.message },
        { status: 500, headers }
      )
    }

    // Ensure the base project folder exists (optional, if you want to ensure /Project is there)
    // For now, we assume /Project already exists. If not, you might add:
    // await createFolderIfNotExists(dbx, projectBaseFolder);

    // Create main project folder (e.g., /Project/Address - Agent Name)
    console.log('Creating main project folder...')
    try {
      await createFolderIfNotExists(dbx, mainProjectFolderPath)
    } catch (folderError: any) {
      console.error('Error creating main project folder:', folderError)
      return NextResponse.json(
        { error: 'Failed to create main project folder', details: folderError.message },
        { status: 500, headers }
      )
    }

    // Define paths for subfolders (e.g., /Project/Address - Agent Name/Raw Photos)
    const rawPhotosFolderPath = `${mainProjectFolderPath}/${rawPhotosFolderName}`
    const editedMediaFolderPath = `${mainProjectFolderPath}/${editedMediaFolderName}`
    const finalMediaFolderPath = `${mainProjectFolderPath}/${finalMediaFolderName}`

    // Create subfolders
    console.log('Creating subfolders...')
    try {
      await createFolderIfNotExists(dbx, rawPhotosFolderPath)
      await createFolderIfNotExists(dbx, editedMediaFolderPath)
      await createFolderIfNotExists(dbx, finalMediaFolderPath)
    } catch (folderError: any) {
      console.error('Error creating subfolders:', folderError)
      return NextResponse.json(
        { error: 'Failed to create subfolders', details: folderError.message },
        { status: 500, headers }
      )
    }

    // Create shared links for subfolders
    console.log('Creating shared links for subfolders...')
    let rawPhotosLink, editedMediaLink, finalMediaLink;
    try {
      rawPhotosLink = await createSharedLink(dbx, rawPhotosFolderPath)
      editedMediaLink = await createSharedLink(dbx, editedMediaFolderPath)
      finalMediaLink = await createSharedLink(dbx, finalMediaFolderPath)
    } catch (linkError: any) {
      console.error('Error creating shared links for subfolders:', linkError)
      return NextResponse.json(
        { error: 'Failed to create shared links for subfolders', details: linkError.message },
        { status: 500, headers }
      )
    }

    // Update Supabase with the new links
    // Assuming Supabase columns are: raw_photos_link, final_edits_link (for editedMediaLink), delivery_page_link (for finalMediaLink)
    console.log('Updating Supabase with new links...')
    try {
      const supabase = getSupabaseAdmin()
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          raw_photos_link: rawPhotosLink,
          final_edits_link: editedMediaLink,      // Mapping Edited Media link to final_edits_link
          delivery_page_link: finalMediaLink,    // Mapping Final Media link to delivery_page_link
        })
        .eq('id', bookingId)

      if (updateError) {
        console.error('Error updating Supabase:', updateError)
        return NextResponse.json(
          { error: 'Failed to update booking with Dropbox links' },
          { status: 500, headers }
        )
      }
    } catch (supabaseError: any) {
      console.error('Error updating Supabase:', supabaseError)
      return NextResponse.json(
        { error: 'Failed to update booking with Dropbox links', details: supabaseError.message },
        { status: 500, headers }
      )
    }

    console.log('Successfully created folders and updated booking')
    return NextResponse.json({
      rawPhotosLink,
      editedMediaLink, // Corresponds to final_edits_link in Supabase
      finalMediaLink,  // Corresponds to delivery_page_link in Supabase
    }, { headers })
  } catch (error: any) {
    console.error('Error in create-folders route:', {
      status: error?.status,
      message: error?.message,
      stack: error?.stack,
      error: error
    })
    
    // Ensure we always return a JSON response
    return NextResponse.json(
      { 
        error: 'Failed to create Dropbox folders',
        details: error?.message || 'Unknown error'
      },
      { status: 500, headers }
    )
  }
} 