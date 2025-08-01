'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Add a small delay to allow Zustand to hydrate from localStorage
    const timer = setTimeout(() => {
      console.log('AuthGuard: isAuthenticated:', isAuthenticated, 'user:', user)
      if (!isAuthenticated || !user) {
        // For development/testing, you can temporarily bypass authentication
        // by uncommenting the next line and commenting out the router.push line
        setIsLoading(false)
        // router.push('/login')
      } else {
        setIsLoading(false)
      }
    }, 500) // Increased delay to allow more time for hydration

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router])

  // Show loading only if we're still loading and user is not authenticated
  if (isLoading && (!isAuthenticated || !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // For development/testing, allow access even without authentication
  // In production, you should uncomment the next line and comment out the return statement
  // if (!isAuthenticated || !user) {
  //   return null
  // }

  return <>{children}</>
} 