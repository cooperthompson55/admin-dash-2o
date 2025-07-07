import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'API is working',
    env: {
      hasDropboxToken: !!process.env.DROPBOX_ACCESS_TOKEN,
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasSupabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  })
} 