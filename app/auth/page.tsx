'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/LoginForm"
import RegisterForm from "@/components/RegisterForm"
import { Building, Shield, Users, TrendingUp, Home } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  if (!isMounted) {
    return null
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left Side - Auth Form */}
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLogin 
                  ? "Enter your credentials to access your rental management dashboard"
                  : "Sign up to start managing your rental properties"
                }
              </p>
            </div>

            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="hidden lg:block relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
          <div className="relative z-10 flex h-full flex-col justify-center px-8 py-12 text-white">
            <div className="flex items-center space-x-2 mb-8">
              <Building className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Rental Management Pro</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Home className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Property Management</h3>
                  <p className="text-blue-100">
                    Manage multiple properties, track occupancy rates, and monitor maintenance needs in real-time.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Tenant Management</h3>
                  <p className="text-blue-100">
                    Complete tenant profiles, lease tracking, and communication tools for seamless property management.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Financial Tracking</h3>
                  <p className="text-blue-100">
                    Track rent payments, generate financial reports, and monitor your rental income with detailed analytics.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Secure & Reliable</h3>
                  <p className="text-blue-100">
                    Your data is protected with enterprise-grade security and automatic backups for peace of mind.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <h4 className="font-semibold mb-2">Why Choose Rental Management Pro?</h4>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• Real-time property and tenant management</li>
                <li>• Automated rent collection and tracking</li>
                <li>• Comprehensive financial reporting</li>
                <li>• Mobile-friendly responsive design</li>
                <li>• 24/7 customer support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 