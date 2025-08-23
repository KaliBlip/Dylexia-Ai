"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ApiStatusProps {
  onStatusChange?: (isConnected: boolean) => void
}

export function ApiStatus({ onStatusChange }: ApiStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error' | 'no-key'>('checking')
  const [errorMessage, setErrorMessage] = useState('')

  const checkApiStatus = async () => {
    setStatus('checking')
    setErrorMessage('')

    try {
      const response = await fetch('/api/gemma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Hello' }),
      })

      if (response.status === 500) {
        const errorData = await response.json()
        if (errorData.error?.includes('not configured')) {
          setStatus('no-key')
          setErrorMessage('API key not configured')
        } else {
          setStatus('error')
          setErrorMessage(errorData.error || 'Unknown error')
        }
      } else if (response.ok) {
        setStatus('connected')
      } else {
        setStatus('error')
        setErrorMessage(`HTTP ${response.status}`)
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Network error')
    }
  }

  useEffect(() => {
    checkApiStatus()
  }, [])

  useEffect(() => {
    onStatusChange?.(status === 'connected')
  }, [status, onStatusChange])

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-5 h-5 animate-spin" />
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'no-key':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking API connection...'
      case 'connected':
        return 'API Connected'
      case 'error':
        return 'API Error'
      case 'no-key':
        return 'API Key Missing'
    }
  }

  const getStatusDescription = () => {
    switch (status) {
      case 'checking':
        return 'Verifying connection to Hugging Face API...'
      case 'connected':
        return 'Successfully connected to Hugging Face API'
      case 'error':
        return errorMessage || 'Failed to connect to API'
      case 'no-key':
        return 'Please add HF_API_KEY to your .env.local file'
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          {getStatusText()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {getStatusDescription()}
        </p>
        {status === 'no-key' && (
          <div className="text-xs bg-yellow-50 dark:bg-yellow-950 p-3 rounded-md">
            <p className="font-medium mb-1">Setup Required:</p>
                         <ol className="list-decimal list-inside space-y-1 text-xs">
               <li>Get API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Hugging Face</a></li>
               <li>Create <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.env.local</code> file</li>
               <li>Add <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">HF_API_KEY=your_key_here</code></li>
               <li>Restart the development server</li>
             </ol>
          </div>
        )}
        <Button 
          onClick={checkApiStatus} 
          variant="outline" 
          size="sm"
          disabled={status === 'checking'}
        >
          {status === 'checking' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
