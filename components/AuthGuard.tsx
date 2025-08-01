'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from "@/lib/auth-store"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isAuthenticated && pathname !== '/auth') {
      router.push('/auth')
    }
  }, [isAuthenticated, isMounted, router, pathname])

  if (!isMounted) {
    return null
  }

  // Don't render children if not authenticated and not on auth page
  if (!isAuthenticated && pathname !== '/auth') {
    return null
  }

  return <>{children}</>
} 