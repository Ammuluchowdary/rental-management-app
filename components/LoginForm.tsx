'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, Building, AlertTriangle } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onSubmit = async (data: LoginFormData) => {
    clearError()
    const success = await login(data.email, data.password, rememberMe)
    if (success) {
      router.push('/')
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <Building className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <p className="text-center text-muted-foreground">
          Sign in to your rental management account
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                {...register('email')}
                suppressHydrationWarning
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                {...register('password')}
                suppressHydrationWarning
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>

          {/* Login Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            suppressHydrationWarning
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Demo Credentials:</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <div><strong>Admin:</strong> admin@rental.com / any password</div>
            <div><strong>Manager:</strong> manager@rental.com / any password</div>
            <div><strong>User:</strong> user@rental.com / any password</div>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={onSwitchToRegister}
            >
              Sign up
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 