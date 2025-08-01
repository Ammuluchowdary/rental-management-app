import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
  created_at: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  rememberMe: boolean
}

export interface AuthActions {
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
  clearError: () => void
  setRememberMe: (remember: boolean) => void
}

type AuthStore = AuthState & AuthActions

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@rental.com',
    name: 'Admin User',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'manager@rental.com',
    name: 'Property Manager',
    role: 'manager',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'user@rental.com',
    name: 'Regular User',
    role: 'user',
    created_at: '2024-01-01T00:00:00Z'
  }
]

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: false,

      // Actions
      login: async (email: string, password: string, rememberMe: boolean) => {
        set({ isLoading: true, error: null })

        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Mock authentication logic
          const user = mockUsers.find(u => u.email === email)
          
          if (!user) {
            set({ 
              isLoading: false, 
              error: 'Invalid email or password',
              isAuthenticated: false,
              user: null
            })
            return false
          }

          // In a real app, you would verify the password here
          // For demo purposes, we'll accept any password for existing users
          if (password.length < 6) {
            set({ 
              isLoading: false, 
              error: 'Password must be at least 6 characters',
              isAuthenticated: false,
              user: null
            })
            return false
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            rememberMe
          })

          return true
        } catch (error) {
          set({ 
            isLoading: false, 
            error: 'Login failed. Please try again.',
            isAuthenticated: false,
            user: null
          })
          return false
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          rememberMe: false
        })
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Check if user already exists
          const existingUser = mockUsers.find(u => u.email === email)
          if (existingUser) {
            set({ 
              isLoading: false, 
              error: 'User with this email already exists',
              isAuthenticated: false,
              user: null
            })
            return false
          }

          // Validate password
          if (password.length < 6) {
            set({ 
              isLoading: false, 
              error: 'Password must be at least 6 characters',
              isAuthenticated: false,
              user: null
            })
            return false
          }

          // Create new user
          const newUser: User = {
            id: Date.now().toString(),
            email,
            name,
            role: 'user', // Default role for new registrations
            created_at: new Date().toISOString()
          }

          // In a real app, you would save this to your database
          // For demo purposes, we'll just set the user as logged in
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })

          return true
        } catch (error) {
          set({ 
            isLoading: false, 
            error: 'Registration failed. Please try again.',
            isAuthenticated: false,
            user: null
          })
          return false
        }
      },

      clearError: () => {
        set({ error: null })
      },

      setRememberMe: (remember: boolean) => {
        set({ rememberMe: remember })
      }
    }),
    {
      name: 'rental-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe
      })
    }
  )
) 