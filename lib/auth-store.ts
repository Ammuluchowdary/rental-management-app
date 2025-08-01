import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
  created_at: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

// Mock users for demo (in real app, this would be in a database)
const mockUsers = [
  {
    id: '1',
    email: 'admin@rental.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'manager@rental.com',
    password: 'manager123',
    name: 'Property Manager',
    role: 'manager' as const,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'user@rental.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user' as const,
    created_at: '2024-01-01T00:00:00Z'
  }
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const user = mockUsers.find(u => u.email === email && u.password === password)
          
          if (user) {
            const { password: _, ...userWithoutPassword } = user
            set({
              user: userWithoutPassword,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
            return true
          } else {
            set({
              isLoading: false,
              error: 'Invalid email or password'
            })
            return false
          }
        } catch (error) {
          set({
            isLoading: false,
            error: 'Login failed. Please try again.'
          })
          return false
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Check if user already exists
          const existingUser = mockUsers.find(u => u.email === email)
          if (existingUser) {
            set({
              isLoading: false,
              error: 'User with this email already exists'
            })
            return false
          }
          
          // Create new user
          const newUser = {
            id: Date.now().toString(),
            email,
            password,
            name,
            role: 'user' as const,
            created_at: new Date().toISOString()
          }
          
          // In a real app, you'd save to database
          mockUsers.push(newUser)
          
          const { password: _, ...userWithoutPassword } = newUser
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
          return true
        } catch (error) {
          set({
            isLoading: false,
            error: 'Signup failed. Please try again.'
          })
          return false
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null
        })
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'rental-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        // This runs after rehydration
        if (state) {
          console.log('Auth store rehydrated:', state)
          state.isLoading = false
        }
      }
    }
  )
) 