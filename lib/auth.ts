import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Token storage keys
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  EXPIRY: 'token_expiry'
}

// Token expiry buffer (5 minutes)
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000

export class TokenManager {
  private static instance: TokenManager
  private supabase: any

  private constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  // Store tokens securely
  public async storeTokens(accessToken: string, refreshToken: string, expiry: number) {
    try {
      const cookieStore = await cookies();
      cookieStore.set(TOKEN_KEYS.ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: Math.floor((expiry - Date.now()) / 1000)
      })

      cookieStore.set(TOKEN_KEYS.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      })

      cookieStore.set(TOKEN_KEYS.EXPIRY, expiry.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: Math.floor((expiry - Date.now()) / 1000)
      })
    } catch (error) {
      console.error('Error storing tokens:', error)
      throw new Error('Failed to store tokens')
    }
  }

  // Get stored tokens
  public async getTokens() {
    try {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get(TOKEN_KEYS.ACCESS_TOKEN)?.value
      const refreshToken = cookieStore.get(TOKEN_KEYS.REFRESH_TOKEN)?.value
      const expiry = cookieStore.get(TOKEN_KEYS.EXPIRY)?.value

      return {
        accessToken,
        refreshToken,
        expiry: expiry ? parseInt(expiry) : null
      }
    } catch (error) {
      console.error('Error getting tokens:', error)
      return null
    }
  }

  // Check if token needs refresh
  public async needsRefresh(): Promise<boolean> {
    const tokens = await this.getTokens()
    if (!tokens) return true
    const expiry = tokens.expiry
    if (!expiry) return true
    return Date.now() + TOKEN_EXPIRY_BUFFER >= expiry
  }

  // Clear tokens
  public async clearTokens() {
    try {
      const cookieStore = await cookies();
      cookieStore.delete(TOKEN_KEYS.ACCESS_TOKEN)
      cookieStore.delete(TOKEN_KEYS.REFRESH_TOKEN)
      cookieStore.delete(TOKEN_KEYS.EXPIRY)
    } catch (error) {
      console.error('Error clearing tokens:', error)
    }
  }
} 