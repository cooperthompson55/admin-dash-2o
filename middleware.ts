import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { TokenManager } from './lib/auth' // Comment out if not used elsewhere or handle potential errors
// import { Ratelimit } from '@upstash/ratelimit' // Comment out Upstash
// import { Redis } from '@upstash/redis' // Comment out Upstash

// Create a new ratelimiter that allows 10 requests per 10 seconds
// const ratelimit = new Ratelimit({ // Comment out Upstash
//   redis: Redis.fromEnv(), // Comment out Upstash
//   limiter: Ratelimit.slidingWindow(10, '10 s'), // Comment out Upstash
//   analytics: true, // Comment out Upstash
// }) // Comment out Upstash

export async function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self' https://*.supabase.co https://*.supabase.in; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.supabase.co;"
  )

  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Get the IP address
    // const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1' // Comment out Upstash related
    
    // Check rate limit
    // const { success, limit, reset, remaining } = await ratelimit.limit(ip) // Comment out Upstash
    
    // if (!success) { // Comment out Upstash
    //   return new NextResponse('Too Many Requests', { // Comment out Upstash
    //     status: 429, // Comment out Upstash
    //     headers: { // Comment out Upstash
    //       'X-RateLimit-Limit': limit.toString(), // Comment out Upstash
    //       'X-RateLimit-Remaining': remaining.toString(), // Comment out Upstash
    //       'X-RateLimit-Reset': reset.toString(), // Comment out Upstash
    //     }, // Comment out Upstash
    //   }) // Comment out Upstash
    // } // Comment out Upstash

    // Get the token manager instance
    // const tokenManager = TokenManager.getInstance() // Comment out if not used elsewhere or handle potential errors
    
    // Check if token needs refresh
    // if (await tokenManager.needsRefresh()) { // Comment out if not used elsewhere or handle potential errors
    //   const tokens = await tokenManager.getTokens() // Comment out if not used elsewhere or handle potential errors
    //   const refreshToken = tokens?.refreshToken // Comment out if not used elsewhere or handle potential errors
      
    //   if (!refreshToken) { // Comment out if not used elsewhere or handle potential errors
    //     return new NextResponse('Unauthorized', { status: 401 }) // Comment out if not used elsewhere or handle potential errors
    //   }

    //   try { // Comment out if not used elsewhere or handle potential errors
    //     // Refresh the token
    //     const response = await fetch('/api/auth/refresh', { // Comment out if not used elsewhere or handle potential errors
    //       method: 'POST', // Comment out if not used elsewhere or handle potential errors
    //       headers: { // Comment out if not used elsewhere or handle potential errors
    //         'Content-Type': 'application/json', // Comment out if not used elsewhere or handle potential errors
    //       }, // Comment out if not used elsewhere or handle potential errors
    //       body: JSON.stringify({ refreshToken }), // Comment out if not used elsewhere or handle potential errors
    //     }) // Comment out if not used elsewhere or handle potential errors

    //     if (!response.ok) { // Comment out if not used elsewhere or handle potential errors
    //       return new NextResponse('Unauthorized', { status: 401 }) // Comment out if not used elsewhere or handle potential errors
    //     }

    //     const { accessToken, newRefreshToken, expiry } = await response.json() // Comment out if not used elsewhere or handle potential errors
    //     await tokenManager.storeTokens(accessToken, newRefreshToken, expiry) // Comment out if not used elsewhere or handle potential errors
    //   } catch (error) { // Comment out if not used elsewhere or handle potential errors
    //     console.error('Error refreshing token:', error) // Comment out if not used elsewhere or handle potential errors
    //     return new NextResponse('Unauthorized', { status: 401 }) // Comment out if not used elsewhere or handle potential errors
    //   }
    // } // Comment out if not used elsewhere or handle potential errors
  }

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 