import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockApartments, mockFlats, mockTenants, mockLeases, mockPayments, mockMaintenance, mockDashboardStats } from './mock-data'
import type { Apartment, Flat, Tenant, Lease, RentPayment, Maintenance, DashboardStats } from './types'

interface DataStore {
  // Data
  apartments: Apartment[]
  flats: Flat[]
  tenants: Tenant[]
  leases: Lease[]
  payments: RentPayment[]
  maintenance: Maintenance[]
  
  // UI State
  isLoading: boolean
  error: string | null

  // Apartment CRUD
  addApartment: (apartment: Omit<Apartment, 'id' | 'created_at' | 'updated_at'>) => void
  updateApartment: (id: string, updates: Partial<Apartment>) => void
  deleteApartment: (id: string) => void
  getApartment: (id: string) => Apartment | undefined
  getApartments: () => Apartment[]

  // Flat CRUD
  addFlat: (flat: Omit<Flat, 'id' | 'created_at' | 'updated_at'>) => void
  updateFlat: (id: string, updates: Partial<Flat>) => void
  deleteFlat: (id: string) => void
  getFlat: (id: string) => Flat | undefined
  getFlats: () => Flat[]
  getFlatsByApartment: (apartmentId: string) => Flat[]
  getFlatsByStatus: (status: string) => Flat[]

  // Tenant CRUD
  addTenant: (tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => void
  updateTenant: (id: string, updates: Partial<Tenant>) => void
  deleteTenant: (id: string) => void
  getTenant: (id: string) => Tenant | undefined
  getTenants: () => Tenant[]
  getTenantsByApartment: (apartmentId: string) => Tenant[]
  getTenantsByStatus: (status: string) => Tenant[]

  // Lease CRUD
  addLease: (lease: Omit<Lease, 'id' | 'created_at' | 'updated_at'>) => void
  updateLease: (id: string, updates: Partial<Lease>) => void
  deleteLease: (id: string) => void
  getLease: (id: string) => Lease | undefined
  getLeases: () => Lease[]
  getLeasesByApartment: (apartmentId: string) => Lease[]
  getLeasesByStatus: (status: string) => Lease[]
  getLeaseByFlat: (flatId: string) => Lease | undefined

  // Payment CRUD
  addPayment: (payment: Omit<RentPayment, 'id' | 'created_at' | 'updated_at'>) => void
  updatePayment: (id: string, updates: Partial<RentPayment>) => void
  deletePayment: (id: string) => void
  getPayment: (id: string) => RentPayment | undefined
  getPayments: () => RentPayment[]
  getPaymentsByLease: (leaseId: string) => RentPayment[]
  getPaymentsByApartment: (apartmentId: string) => RentPayment[]
  getPaymentsByStatus: (status: string) => RentPayment[]

  // Maintenance CRUD
  addMaintenance: (maintenance: Omit<Maintenance, 'id' | 'created_at' | 'updated_at'>) => void
  updateMaintenance: (id: string, updates: Partial<Maintenance>) => void
  deleteMaintenance: (id: string) => void
  getMaintenance: (id: string) => Maintenance | undefined
  getMaintenanceByApartment: (apartmentId: string) => Maintenance[]
  getMaintenanceByFlat: (flatId: string) => Maintenance[]
  getMaintenanceByStatus: (status: string) => Maintenance[]
  getMaintenanceByPriority: (priority: string) => Maintenance[]

  // Computed Values
  getDashboardStats: () => DashboardStats
  getApartmentStats: (apartmentId: string) => {
    total_flats: number
    occupied_flats: number
    vacant_flats: number
    maintenance_flats: number
    monthly_revenue: number
    occupancy_rate: number
  }

  // Utility Functions
  resetData: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // Initial state
      apartments: mockApartments || [],
      flats: mockFlats || [],
      tenants: mockTenants || [],
      leases: mockLeases || [],
      payments: mockPayments || [],
      maintenance: mockMaintenance || [],
      isLoading: false,
      error: null,

      // Apartment CRUD Operations
      addApartment: (apartmentData) => {
        try {
          const newApartment: Apartment = {
            id: `apt-${Date.now()}`,
            ...apartmentData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          set((state) => ({
            apartments: [...state.apartments, newApartment],
            error: null
          }))
        } catch (error) {
          console.error('Error adding apartment:', error)
          set((state) => ({ error: 'Failed to add apartment' }))
        }
      },

      updateApartment: (id, updates) => {
        try {
          set((state) => ({
            apartments: state.apartments.map((apartment) =>
              apartment.id === id
                ? { ...apartment, ...updates, updated_at: new Date().toISOString() }
                : apartment
            ),
            error: null
          }))
        } catch (error) {
          console.error('Error updating apartment:', error)
          set((state) => ({ error: 'Failed to update apartment' }))
        }
      },

      deleteApartment: (id) => {
        try {
          set((state) => ({
            apartments: state.apartments.filter((apartment) => apartment.id !== id),
            error: null
          }))
        } catch (error) {
          console.error('Error deleting apartment:', error)
          set((state) => ({ error: 'Failed to delete apartment' }))
        }
      },

      getApartment: (id) => {
        try {
          return get().apartments.find((apartment) => apartment.id === id)
        } catch (error) {
          console.error('Error getting apartment:', error)
          return undefined
        }
      },

      getApartments: () => {
        try {
          return get().apartments
        } catch (error) {
          console.error('Error getting apartments:', error)
          return []
        }
      },

      // Flat CRUD Operations
      addFlat: (flatData) => {
        try {
          const newFlat: Flat = {
            id: `flat-${Date.now()}`,
            ...flatData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          set((state) => ({
            flats: [...state.flats, newFlat],
            error: null
          }))
        } catch (error) {
          console.error('Error adding flat:', error)
          set((state) => ({ error: 'Failed to add flat' }))
        }
      },

      updateFlat: (id, updates) => {
        try {
          set((state) => ({
            flats: state.flats.map((flat) =>
              flat.id === id
                ? { ...flat, ...updates, updated_at: new Date().toISOString() }
                : flat
            ),
            error: null
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
            error: null
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

      getFlats: () => {
        try {
          return get().flats
        } catch (error) {
          console.error('Error getting flats:', error)
          return []
        }
      },

      getFlatsByApartment: (apartmentId) => {
        try {
          return get().flats.filter((flat) => flat.apartment_id === apartmentId)
        } catch (error) {
          console.error('Error getting flats by apartment:', error)
          return []
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

      // Tenant CRUD Operations
      addTenant: (tenantData) => {
        try {
          const newTenant: Tenant = {
            id: `tenant-${Date.now()}`,
            ...tenantData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          set((state) => ({
            tenants: [...state.tenants, newTenant],
            error: null
          }))
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
              tenant.id === id
                ? { ...tenant, ...updates, updated_at: new Date().toISOString() }
                : tenant
            ),
            error: null
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
            error: null
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

      getTenants: () => {
        try {
          return get().tenants
        } catch (error) {
          console.error('Error getting tenants:', error)
          return []
        }
      },

      getTenantsByApartment: (apartmentId) => {
        try {
          const flats = get().flats.filter((flat) => flat.apartment_id === apartmentId)
          const flatIds = flats.map((flat) => flat.id)
          const leases = get().leases.filter((lease) => flatIds.includes(lease.flat_id))
          const tenantIds = leases.map((lease) => lease.tenant_id)
          return get().tenants.filter((tenant) => tenantIds.includes(tenant.id))
        } catch (error) {
          console.error('Error getting tenants by apartment:', error)
          return []
        }
      },

      getTenantsByStatus: (status) => {
        try {
          return get().tenants.filter((tenant) => tenant.status === status)
        } catch (error) {
          console.error('Error getting tenants by status:', error)
          return []
        }
      },

      // Lease CRUD Operations
      addLease: (leaseData) => {
        try {
          const newLease: Lease = {
            id: `lease-${Date.now()}`,
            ...leaseData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          set((state) => ({
            leases: [...state.leases, newLease],
            error: null
          }))
        } catch (error) {
          console.error('Error adding lease:', error)
          set((state) => ({ error: 'Failed to add lease' }))
        }
      },

      updateLease: (id, updates) => {
        try {
          set((state) => ({
            leases: state.leases.map((lease) =>
              lease.id === id
                ? { ...lease, ...updates, updated_at: new Date().toISOString() }
                : lease
            ),
            error: null
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
            error: null
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

      getLeases: () => {
        try {
          return get().leases
        } catch (error) {
          console.error('Error getting leases:', error)
          return []
        }
      },

      getLeasesByApartment: (apartmentId) => {
        try {
          return get().leases.filter((lease) => lease.apartment_id === apartmentId)
        } catch (error) {
          console.error('Error getting leases by apartment:', error)
          return []
        }
      },

      getLeasesByStatus: (status) => {
        try {
          return get().leases.filter((lease) => lease.status === status)
        } catch (error) {
          console.error('Error getting leases by status:', error)
          return []
        }
      },

      getLeaseByFlat: (flatId) => {
        try {
          return get().leases.find((lease) => lease.flat_id === flatId && lease.status === 'active')
        } catch (error) {
          console.error('Error getting lease by flat:', error)
          return undefined
        }
      },

      // Payment CRUD Operations
      addPayment: (paymentData) => {
        try {
          const newPayment: RentPayment = {
            id: `payment-${Date.now()}`,
            ...paymentData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          set((state) => ({
            payments: [...state.payments, newPayment],
            error: null
          }))
        } catch (error) {
          console.error('Error adding payment:', error)
          set((state) => ({ error: 'Failed to add payment' }))
        }
      },

      updatePayment: (id, updates) => {
        try {
          set((state) => ({
            payments: state.payments.map((payment) =>
              payment.id === id
                ? { ...payment, ...updates, updated_at: new Date().toISOString() }
                : payment
            ),
            error: null
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
            error: null
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

      getPayments: () => {
        try {
          return get().payments
        } catch (error) {
          console.error('Error getting payments:', error)
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

      getPaymentsByApartment: (apartmentId) => {
        try {
          return get().payments.filter((payment) => payment.apartment_id === apartmentId)
        } catch (error) {
          console.error('Error getting payments by apartment:', error)
          return []
        }
      },

      getPaymentsByStatus: (status) => {
        try {
          return get().payments.filter((payment) => payment.status === status)
        } catch (error) {
          console.error('Error getting payments by status:', error)
          return []
        }
      },

      // Maintenance CRUD Operations
      addMaintenance: (maintenanceData) => {
        try {
          const newMaintenance: Maintenance = {
            id: `maint-${Date.now()}`,
            ...maintenanceData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          set((state) => ({
            maintenance: [...state.maintenance, newMaintenance],
            error: null
          }))
        } catch (error) {
          console.error('Error adding maintenance:', error)
          set((state) => ({ error: 'Failed to add maintenance' }))
        }
      },

      updateMaintenance: (id, updates) => {
        try {
          set((state) => ({
            maintenance: state.maintenance.map((maintenance) =>
              maintenance.id === id
                ? { ...maintenance, ...updates, updated_at: new Date().toISOString() }
                : maintenance
            ),
            error: null
          }))
        } catch (error) {
          console.error('Error updating maintenance:', error)
          set((state) => ({ error: 'Failed to update maintenance' }))
        }
      },

      deleteMaintenance: (id) => {
        try {
          set((state) => ({
            maintenance: state.maintenance.filter((maintenance) => maintenance.id !== id),
            error: null
          }))
        } catch (error) {
          console.error('Error deleting maintenance:', error)
          set((state) => ({ error: 'Failed to delete maintenance' }))
        }
      },

      getMaintenance: (id) => {
        try {
          return get().maintenance.find((maintenance) => maintenance.id === id)
        } catch (error) {
          console.error('Error getting maintenance:', error)
          return undefined
        }
      },

      getMaintenanceByApartment: (apartmentId) => {
        try {
          return get().maintenance.filter((maintenance) => maintenance.apartment_id === apartmentId)
        } catch (error) {
          console.error('Error getting maintenance by apartment:', error)
          return []
        }
      },

      getMaintenanceByFlat: (flatId) => {
        try {
          return get().maintenance.filter((maintenance) => maintenance.flat_id === flatId)
        } catch (error) {
          console.error('Error getting maintenance by flat:', error)
          return []
        }
      },

      getMaintenanceByStatus: (status) => {
        try {
          return get().maintenance.filter((maintenance) => maintenance.status === status)
        } catch (error) {
          console.error('Error getting maintenance by status:', error)
          return []
        }
      },

      getMaintenanceByPriority: (priority) => {
        try {
          return get().maintenance.filter((maintenance) => maintenance.priority === priority)
        } catch (error) {
          console.error('Error getting maintenance by priority:', error)
          return []
        }
      },

      // Computed Values
      getDashboardStats: () => {
        try {
          const state = get()
          const total_apartments = state.apartments.length
          const total_flats = state.flats.length
          const total_tenants = state.tenants.length
          const total_leases = state.leases.length
          const total_revenue = state.payments
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0)
          const monthly_revenue = state.payments
            .filter(p => p.status === 'paid' && new Date(p.payment_date).getMonth() === new Date().getMonth())
            .reduce((sum, p) => sum + p.amount, 0)
          const occupied_flats = state.flats.filter(f => f.status === 'occupied').length
          const occupancy_rate = total_flats > 0 ? (occupied_flats / total_flats) * 100 : 0
          const average_rent = total_flats > 0 ? state.flats.reduce((sum, f) => sum + f.monthly_rent, 0) / total_flats : 0
          const pending_payments = state.payments.filter(p => p.status === 'pending').length
          const overdue_payments = state.payments.filter(p => p.status === 'overdue').length
          const maintenance_requests = state.maintenance.filter(m => m.status === 'pending').length
          const expiring_leases = state.leases.filter(l => {
            const endDate = new Date(l.end_date)
            const now = new Date()
            const diffTime = endDate.getTime() - now.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays <= 30 && l.status === 'active'
          }).length

          return {
            total_apartments,
            total_flats,
            total_tenants,
            total_leases,
            total_revenue,
            monthly_revenue,
            occupancy_rate,
            average_rent,
            pending_payments,
            overdue_payments,
            maintenance_requests,
            expiring_leases
          }
        } catch (error) {
          console.error('Error computing dashboard stats:', error)
          return mockDashboardStats
        }
      },

      getApartmentStats: (apartmentId) => {
        try {
          const state = get()
          const apartmentFlats = state.flats.filter(f => f.apartment_id === apartmentId)
          const total_flats = apartmentFlats.length
          const occupied_flats = apartmentFlats.filter(f => f.status === 'occupied').length
          const vacant_flats = apartmentFlats.filter(f => f.status === 'vacant').length
          const maintenance_flats = apartmentFlats.filter(f => f.status === 'maintenance').length
          const monthly_revenue = state.payments
            .filter(p => p.apartment_id === apartmentId && p.status === 'paid' && 
              new Date(p.payment_date).getMonth() === new Date().getMonth())
            .reduce((sum, p) => sum + p.amount, 0)
          const occupancy_rate = total_flats > 0 ? (occupied_flats / total_flats) * 100 : 0

          return {
            total_flats,
            occupied_flats,
            vacant_flats,
            maintenance_flats,
            monthly_revenue,
            occupancy_rate
          }
        } catch (error) {
          console.error('Error computing apartment stats:', error)
          return {
            total_flats: 0,
            occupied_flats: 0,
            vacant_flats: 0,
            maintenance_flats: 0,
            monthly_revenue: 0,
            occupancy_rate: 0
          }
        }
      },

      // Utility Functions
      resetData: () => {
        try {
          set({
            apartments: mockApartments,
            flats: mockFlats,
            tenants: mockTenants,
            leases: mockLeases,
            payments: mockPayments,
            maintenance: mockMaintenance,
            error: null
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
        apartments: state.apartments,
        flats: state.flats,
        tenants: state.tenants,
        leases: state.leases,
        payments: state.payments,
        maintenance: state.maintenance,
      }),
    }
  )
) 