import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Flat, Tenant, Lease, RentPayment, DashboardStats } from './types'
import { mockFlats, mockTenants, mockLeases, mockPayments } from './mock-data'

interface DataStore {
  // Data
  flats: Flat[]
  tenants: Tenant[]
  leases: Lease[]
  payments: RentPayment[]
  
  // Loading states
  isLoading: boolean
  error: string | null
  
  // CRUD Operations for Flats
  addFlat: (flat: Omit<Flat, 'id' | 'created_at'>) => void
  updateFlat: (id: string, updates: Partial<Flat>) => void
  deleteFlat: (id: string) => void
  getFlat: (id: string) => Flat | undefined
  
  // CRUD Operations for Tenants
  addTenant: (tenant: Omit<Tenant, 'id' | 'created_at'>) => void
  updateTenant: (id: string, updates: Partial<Tenant>) => void
  deleteTenant: (id: string) => void
  getTenant: (id: string) => Tenant | undefined
  
  // CRUD Operations for Leases
  addLease: (lease: Omit<Lease, 'id' | 'created_at'>) => void
  updateLease: (id: string, updates: Partial<Lease>) => void
  deleteLease: (id: string) => void
  getLease: (id: string) => Lease | undefined
  
  // CRUD Operations for Payments
  addPayment: (payment: Omit<RentPayment, 'id' | 'created_at'>) => void
  updatePayment: (id: string, updates: Partial<RentPayment>) => void
  deletePayment: (id: string) => void
  getPayment: (id: string) => RentPayment | undefined
  
  // Computed values
  getDashboardStats: () => DashboardStats
  getFlatsByStatus: (status: Flat['status']) => Flat[]
  getTenantsByFlat: (flatId: string) => Tenant[]
  getPaymentsByLease: (leaseId: string) => RentPayment[]
  
  // Utility functions
  resetData: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // Initial data
      flats: mockFlats || [],
      tenants: mockTenants || [],
      leases: mockLeases || [],
      payments: mockPayments || [],
      isLoading: false,
      error: null,

      // Flat operations
      addFlat: (flatData) => {
        try {
          const newFlat: Flat = {
            ...flatData,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
          }
          set((state) => ({ flats: [...state.flats, newFlat] }))
        } catch (error) {
          console.error('Error adding flat:', error)
          set((state) => ({ error: 'Failed to add flat' }))
        }
      },

      updateFlat: (id, updates) => {
        try {
          set((state) => ({
            flats: state.flats.map((flat) =>
              flat.id === id ? { ...flat, ...updates } : flat
            ),
          }))
        } catch (error) {
          console.error('Error updating flat:', error)
          set((state) => ({ error: 'Failed to update flat' }))
        }
      },

      deleteFlat: (id) => {
        try {
          set((state) => ({
            flats: state.flats.filter((flat) => flat.id !== id),
          }))
        } catch (error) {
          console.error('Error deleting flat:', error)
          set((state) => ({ error: 'Failed to delete flat' }))
        }
      },

      getFlat: (id) => {
        try {
          return get().flats.find((flat) => flat.id === id)
        } catch (error) {
          console.error('Error getting flat:', error)
          return undefined
        }
      },

      // Tenant operations
      addTenant: (tenantData) => {
        try {
          const newTenant: Tenant = {
            ...tenantData,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
          }
          set((state) => ({ tenants: [...state.tenants, newTenant] }))
          console.log('Tenant added successfully:', newTenant)
        } catch (error) {
          console.error('Error adding tenant:', error)
          set((state) => ({ error: 'Failed to add tenant' }))
          throw error
        }
      },

      updateTenant: (id, updates) => {
        try {
          set((state) => ({
            tenants: state.tenants.map((tenant) =>
              tenant.id === id ? { ...tenant, ...updates } : tenant
            ),
          }))
        } catch (error) {
          console.error('Error updating tenant:', error)
          set((state) => ({ error: 'Failed to update tenant' }))
        }
      },

      deleteTenant: (id) => {
        try {
          set((state) => ({
            tenants: state.tenants.filter((tenant) => tenant.id !== id),
          }))
        } catch (error) {
          console.error('Error deleting tenant:', error)
          set((state) => ({ error: 'Failed to delete tenant' }))
        }
      },

      getTenant: (id) => {
        try {
          return get().tenants.find((tenant) => tenant.id === id)
        } catch (error) {
          console.error('Error getting tenant:', error)
          return undefined
        }
      },

      // Lease operations
      addLease: (leaseData) => {
        try {
          const newLease: Lease = {
            ...leaseData,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
          }
          set((state) => ({ leases: [...state.leases, newLease] }))
        } catch (error) {
          console.error('Error adding lease:', error)
          set((state) => ({ error: 'Failed to add lease' }))
        }
      },

      updateLease: (id, updates) => {
        try {
          set((state) => ({
            leases: state.leases.map((lease) =>
              lease.id === id ? { ...lease, ...updates } : lease
            ),
          }))
        } catch (error) {
          console.error('Error updating lease:', error)
          set((state) => ({ error: 'Failed to update lease' }))
        }
      },

      deleteLease: (id) => {
        try {
          set((state) => ({
            leases: state.leases.filter((lease) => lease.id !== id),
          }))
        } catch (error) {
          console.error('Error deleting lease:', error)
          set((state) => ({ error: 'Failed to delete lease' }))
        }
      },

      getLease: (id) => {
        try {
          return get().leases.find((lease) => lease.id === id)
        } catch (error) {
          console.error('Error getting lease:', error)
          return undefined
        }
      },

      // Payment operations
      addPayment: (paymentData) => {
        try {
          const newPayment: RentPayment = {
            ...paymentData,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
          }
          set((state) => ({ payments: [...state.payments, newPayment] }))
        } catch (error) {
          console.error('Error adding payment:', error)
          set((state) => ({ error: 'Failed to add payment' }))
        }
      },

      updatePayment: (id, updates) => {
        try {
          set((state) => ({
            payments: state.payments.map((payment) =>
              payment.id === id ? { ...payment, ...updates } : payment
            ),
          }))
        } catch (error) {
          console.error('Error updating payment:', error)
          set((state) => ({ error: 'Failed to update payment' }))
        }
      },

      deletePayment: (id) => {
        try {
          set((state) => ({
            payments: state.payments.filter((payment) => payment.id !== id),
          }))
        } catch (error) {
          console.error('Error deleting payment:', error)
          set((state) => ({ error: 'Failed to delete payment' }))
        }
      },

      getPayment: (id) => {
        try {
          return get().payments.find((payment) => payment.id === id)
        } catch (error) {
          console.error('Error getting payment:', error)
          return undefined
        }
      },

      // Computed values
      getDashboardStats: () => {
        try {
          const state = get()
          const totalFlats = state.flats.length
          const occupiedFlats = state.flats.filter((flat) => flat.status === "occupied").length
          const vacantFlats = state.flats.filter((flat) => flat.status === "vacant").length
          const maintenanceFlats = state.flats.filter((flat) => flat.status === "maintenance").length
          const pendingPayments = state.payments.filter((payment) => payment.status === "pending").length
          const overduePayments = state.payments.filter((payment) => payment.status === "overdue").length
          const totalRentCollected = state.payments
            .filter((payment) => payment.status === "paid")
            .reduce((sum, payment) => sum + payment.amount, 0)
          const totalRentPending = state.payments
            .filter((payment) => payment.status === "pending")
            .reduce((sum, payment) => sum + payment.amount, 0)

          return {
            totalFlats,
            occupiedFlats,
            vacantFlats,
            maintenanceFlats,
            pendingPayments,
            overduePayments,
            totalRentCollected,
            totalRentPending,
          }
        } catch (error) {
          console.error('Error computing dashboard stats:', error)
          return {
            totalFlats: 0,
            occupiedFlats: 0,
            vacantFlats: 0,
            maintenanceFlats: 0,
            pendingPayments: 0,
            overduePayments: 0,
            totalRentCollected: 0,
            totalRentPending: 0,
          }
        }
      },

      getFlatsByStatus: (status) => {
        try {
          return get().flats.filter((flat) => flat.status === status)
        } catch (error) {
          console.error('Error getting flats by status:', error)
          return []
        }
      },

      getTenantsByFlat: (flatId) => {
        try {
          const state = get()
          const leases = state.leases.filter((lease) => lease.flat_id === flatId)
          const tenantIds = leases.map((lease) => lease.tenant_id)
          return state.tenants.filter((tenant) => tenantIds.includes(tenant.id))
        } catch (error) {
          console.error('Error getting tenants by flat:', error)
          return []
        }
      },

      getPaymentsByLease: (leaseId) => {
        try {
          return get().payments.filter((payment) => payment.lease_id === leaseId)
        } catch (error) {
          console.error('Error getting payments by lease:', error)
          return []
        }
      },

      // Utility functions
      resetData: () => {
        try {
          set({
            flats: mockFlats || [],
            tenants: mockTenants || [],
            leases: mockLeases || [],
            payments: mockPayments || [],
            error: null,
          })
        } catch (error) {
          console.error('Error resetting data:', error)
        }
      },

      setLoading: (loading) => {
        try {
          set({ isLoading: loading })
        } catch (error) {
          console.error('Error setting loading state:', error)
        }
      },

      setError: (error) => {
        try {
          set({ error })
        } catch (error) {
          console.error('Error setting error state:', error)
        }
      },
    }),
    {
      name: 'rental-management-data',
      partialize: (state) => ({
        flats: state.flats,
        tenants: state.tenants,
        leases: state.leases,
        payments: state.payments,
      }),
      onRehydrateStorage: () => (state) => {
        // This runs after rehydration
        if (state) {
          console.log('Data store rehydrated:', state)
          state.isLoading = false
        }
      }
    }
  )
) 