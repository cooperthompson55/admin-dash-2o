import { createClient } from '@supabase/supabase-js'

// Create a function that returns the admin client, only checking env vars at runtime
export function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// For backward compatibility, export the admin client but make it lazy
export const supabaseAdmin = new Proxy({} as any, {
  get(target, prop) {
    if (!target._client) {
      target._client = getSupabaseAdmin()
    }
    return target._client[prop]
  }
}) 