export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
  created_at: string
}

export interface Apartment {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  total_flats: number
  occupied_flats: number
  vacant_flats: number
  maintenance_flats: number
  monthly_revenue: number
  yearly_revenue: number
  amenities: string[]
  property_manager: string
  contact_phone: string
  contact_email: string
  status: 'active' | 'inactive' | 'maintenance'
  created_at: string
  updated_at: string
}

export interface Flat {
  id: string
  apartment_id: string
  flat_number: string
  floor: number
  bedrooms: number
  bathrooms: number
  area_sqft: number
  monthly_rent: number
  security_deposit: number
  status: 'vacant' | 'occupied' | 'maintenance' | 'reserved'
  description: string
  amenities: string[]
  features: string[]
  images: string[]
  last_maintenance_date: string
  next_maintenance_date: string
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  full_name: string
  email: string
  phone: string
  emergency_contact: string
  emergency_phone: string
  id_number: string
  occupation: string
  date_of_birth: string
  address: string
  previous_address: string
  employer: string
  monthly_income: number
  credit_score: number
  rental_history: string
  references: string[]
  documents: string[]
  status: 'active' | 'inactive' | 'evicted' | 'pending'
  created_at: string
  updated_at: string
}

export interface Lease {
  id: string
  flat_id: string
  tenant_id: string
  apartment_id: string
  lease_number: string
  start_date: string
  end_date: string
  monthly_rent: number
  security_deposit: number
  late_fee: number
  utilities_included: boolean
  pet_deposit: number
  parking_spaces: number
  status: 'active' | 'expired' | 'terminated' | 'pending'
  renewal_date: string
  termination_reason: string
  notes: string
  created_at: string
  updated_at: string
}

export interface RentPayment {
  id: string
  lease_id: string
  flat_id: string
  tenant_id: string
  apartment_id: string
  amount: number
  payment_date: string
  due_date: string
  payment_method: 'bank_transfer' | 'cash' | 'check' | 'online' | 'credit_card'
  status: 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled'
  late_fee: number
  receipt_number: string
  transaction_id: string
  notes: string
  created_at: string
  updated_at: string
}

export interface Maintenance {
  id: string
  flat_id: string
  apartment_id: string
  tenant_id: string
  title: string
  description: string
  category: 'repair' | 'cleaning' | 'inspection' | 'emergency' | 'preventive'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  assigned_to: string
  estimated_cost: number
  actual_cost: number
  scheduled_date: string
  completed_date: string
  images: string[]
  notes: string
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total_apartments: number
  total_flats: number
  total_tenants: number
  total_leases: number
  total_revenue: number
  monthly_revenue: number
  occupancy_rate: number
  average_rent: number
  pending_payments: number
  overdue_payments: number
  maintenance_requests: number
  expiring_leases: number
}

export interface FinancialReport {
  id: string
  period: string
  total_revenue: number
  total_expenses: number
  net_profit: number
  rent_collected: number
  late_fees: number
  maintenance_costs: number
  utilities_revenue: number
  other_income: number
  occupancy_rate: number
  average_rent: number
  created_at: string
}

export interface Notification {
  id: string
  type: 'payment' | 'maintenance' | 'lease' | 'system' | 'alert'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'unread' | 'read' | 'archived'
  related_id: string
  created_at: string
}
