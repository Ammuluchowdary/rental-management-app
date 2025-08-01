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
      flats: mockFlats,
      tenants: mockTenants,
      leases: mockLeases,
      payments: mockPayments,
      isLoading: false,
      error: null,

      // Flat operations
      addFlat: (flatData) => {
        const newFlat: Flat = {
          ...flatData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        }
        set((state) => ({ flats: [...state.flats, newFlat] }))
      },

      updateFlat: (id, updates) => {
        set((state) => ({
          flats: state.flats.map((flat) =>
            flat.id === id ? { ...flat, ...updates } : flat
          ),
        }))
      },

      deleteFlat: (id) => {
        set((state) => ({
          flats: state.flats.filter((flat) => flat.id !== id),
        }))
      },

      getFlat: (id) => {
        return get().flats.find((flat) => flat.id === id)
      },

      // Tenant operations
      addTenant: (tenantData) => {
        const newTenant: Tenant = {
          ...tenantData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        }
        set((state) => ({ tenants: [...state.tenants, newTenant] }))
      },

      updateTenant: (id, updates) => {
        set((state) => ({
          tenants: state.tenants.map((tenant) =>
            tenant.id === id ? { ...tenant, ...updates } : tenant
          ),
        }))
      },

      deleteTenant: (id) => {
        set((state) => ({
          tenants: state.tenants.filter((tenant) => tenant.id !== id),
        }))
      },

      getTenant: (id) => {
        return get().tenants.find((tenant) => tenant.id === id)
      },

      // Lease operations
      addLease: (leaseData) => {
        const newLease: Lease = {
          ...leaseData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        }
        set((state) => ({ leases: [...state.leases, newLease] }))
      },

      updateLease: (id, updates) => {
        set((state) => ({
          leases: state.leases.map((lease) =>
            lease.id === id ? { ...lease, ...updates } : lease
          ),
        }))
      },

      deleteLease: (id) => {
        set((state) => ({
          leases: state.leases.filter((lease) => lease.id !== id),
        }))
      },

      getLease: (id) => {
        return get().leases.find((lease) => lease.id === id)
      },

      // Payment operations
      addPayment: (paymentData) => {
        const newPayment: RentPayment = {
          ...paymentData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        }
        set((state) => ({ payments: [...state.payments, newPayment] }))
      },

      updatePayment: (id, updates) => {
        set((state) => ({
          payments: state.payments.map((payment) =>
            payment.id === id ? { ...payment, ...updates } : payment
          ),
        }))
      },

      deletePayment: (id) => {
        set((state) => ({
          payments: state.payments.filter((payment) => payment.id !== id),
        }))
      },

      getPayment: (id) => {
        return get().payments.find((payment) => payment.id === id)
      },

      // Computed values
      getDashboardStats: () => {
        const state = get()
        const occupiedFlats = state.flats.filter((f) => f.status === 'occupied')
        const vacantFlats = state.flats.filter((f) => f.status === 'vacant')
        const maintenanceFlats = state.flats.filter((f) => f.status === 'maintenance')
        const pendingPayments = state.payments.filter((p) => p.status === 'pending')
        const overduePayments = state.payments.filter((p) => p.status === 'overdue')
        const paidPayments = state.payments.filter((p) => p.status === 'paid')

        return {
          totalFlats: state.flats.length,
          occupiedFlats: occupiedFlats.length,
          vacantFlats: vacantFlats.length,
          maintenanceFlats: maintenanceFlats.length,
          pendingPayments: pendingPayments.length,
          overduePayments: overduePayments.length,
          totalRentCollected: paidPayments.reduce((sum, p) => sum + p.amount, 0),
          totalRentPending: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
        }
      },

      getFlatsByStatus: (status) => {
        return get().flats.filter((flat) => flat.status === status)
      },

      getTenantsByFlat: (flatId) => {
        const state = get()
        const flatLeases = state.leases.filter((lease) => lease.flat_id === flatId)
        const tenantIds = flatLeases.map((lease) => lease.tenant_id)
        return state.tenants.filter((tenant) => tenantIds.includes(tenant.id))
      },

      getPaymentsByLease: (leaseId) => {
        return get().payments.filter((payment) => payment.lease_id === leaseId)
      },

      // Utility functions
      resetData: () => {
        set({
          flats: mockFlats,
          tenants: mockTenants,
          leases: mockLeases,
          payments: mockPayments,
          error: null,
        })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      setError: (error) => {
        set({ error })
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
    }
  )
) 