'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function DropboxAuthPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const startAuth = async () => {
    try {
      setLoading(true)
      setError(null)
      setDebugInfo(null)
      
      console.log('Starting auth request...')
      const baseUrl = window.location.origin
      const response = await fetch(`${baseUrl}/api/dropbox/auth`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      const responseText = await response.text()
      console.log('Raw response:', responseText)
      
      let data
      try {
        data = JSON.parse(responseText)
        console.log('Parsed response:', data)
      } catch (parseError) {
        console.error('Failed to parse response:', parseError)
        setDebugInfo({
          rawResponse: responseText,
          parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        })
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`)
      }
      
      if (data.error) {
        setDebugInfo(data)
        throw new Error(data.error)
      }
      
      if (data.authUrl) {
        console.log('Redirecting to:', data.authUrl)
        window.location.href = data.authUrl
      } else {
        setDebugInfo(data)
        throw new Error('No auth URL received')
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(err instanceof Error ? err.message : 'Failed to start auth flow')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Dropbox Authentication
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {debugInfo && (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded mb-4 text-left">
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
        
        <Button
          onClick={startAuth}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Starting...' : 'Connect Dropbox'}
        </Button>
      </div>
    </div>
  )
} 