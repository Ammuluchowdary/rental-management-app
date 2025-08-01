-- Rental Management System Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable Row Level Security (RLS) for all tables
-- This is a Supabase best practice for security

-- Users table (for admin authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flats table
CREATE TABLE IF NOT EXISTS flats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flat_number TEXT UNIQUE NOT NULL,
  floor INTEGER NOT NULL CHECK (floor > 0),
  bedrooms INTEGER NOT NULL CHECK (bedrooms > 0),
  bathrooms INTEGER NOT NULL CHECK (bathrooms > 0),
  area_sqft INTEGER CHECK (area_sqft > 0),
  monthly_rent DECIMAL(10,2) NOT NULL CHECK (monthly_rent > 0),
  status TEXT DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'maintenance')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  id_number TEXT UNIQUE,
  occupation TEXT,
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leases table
CREATE TABLE IF NOT EXISTS leases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rent DECIMAL(10,2) NOT NULL CHECK (monthly_rent > 0),
  security_deposit DECIMAL(10,2) NOT NULL CHECK (security_deposit >= 0),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'terminated')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure end_date is after start_date
  CONSTRAINT valid_lease_period CHECK (end_date > start_date)
);

-- Rent payments table
CREATE TABLE IF NOT EXISTS rent_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  payment_date DATE,
  due_date DATE NOT NULL,
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank_transfer', 'check', 'online')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),
  notes TEXT,
  receipt_number TEXT,
  late_fee DECIMAL(10,2) DEFAULT 0 CHECK (late_fee >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flats_status ON flats(status);
CREATE INDEX IF NOT EXISTS idx_flats_floor ON flats(floor);
CREATE INDEX IF NOT EXISTS idx_leases_flat_id ON leases(flat_id);
CREATE INDEX IF NOT EXISTS idx_leases_tenant_id ON leases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leases_status ON leases(status);
CREATE INDEX IF NOT EXISTS idx_leases_dates ON leases(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_rent_payments_lease_id ON rent_payments(lease_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_status ON rent_payments(status);
CREATE INDEX IF NOT EXISTS idx_rent_payments_due_date ON rent_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(email);

-- Create updated_at triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flats_updated_at BEFORE UPDATE ON flats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leases_updated_at BEFORE UPDATE ON leases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rent_payments_updated_at BEFORE UPDATE ON rent_payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE flats ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - customize as needed)
-- Users policies
CREATE POLICY "Enable all operations for users" ON users FOR ALL USING (true);

-- Flats policies
CREATE POLICY "Enable all operations for flats" ON flats FOR ALL USING (true);

-- Tenants policies
CREATE POLICY "Enable all operations for tenants" ON tenants FOR ALL USING (true);

-- Leases policies
CREATE POLICY "Enable all operations for leases" ON leases FOR ALL USING (true);

-- Rent payments policies
CREATE POLICY "Enable all operations for rent_payments" ON rent_payments FOR ALL USING (true);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE 'Tables created: users, flats, tenants, leases, rent_payments';
    RAISE NOTICE 'Indexes and triggers applied';
    RAISE NOTICE 'Row Level Security enabled with permissive policies';
    RAISE NOTICE 'Ready for data seeding!';
END $$;





-- Insert sample flats (20 flats across 4 floors)
INSERT INTO flats (flat_number, floor, bedrooms, bathrooms, area_sqft, monthly_rent, status, description) VALUES
-- Floor 1
('101', 1, 2, 1, 800, 1200.00, 'occupied', '2BHK with balcony and garden view'),
('102', 1, 1, 1, 600, 900.00, 'vacant', '1BHK compact unit with modern fixtures'),
('103', 1, 3, 2, 1200, 1800.00, 'occupied', '3BHK family unit with spacious living room'),
('104', 1, 2, 1, 850, 1300.00, 'vacant', '2BHK with garden view and parking'),
('105', 1, 1, 1, 550, 850.00, 'occupied', '1BHK studio style with kitchenette'),

-- Floor 2
('201', 2, 2, 1, 800, 1250.00, 'occupied', '2BHK with city view and balcony'),
('202', 2, 1, 1, 600, 950.00, 'vacant', '1BHK modern unit with updated kitchen'),
('203', 2, 3, 2, 1200, 1850.00, 'occupied', '3BHK premium unit with master suite'),
('204', 2, 2, 1, 850, 1350.00, 'maintenance', '2BHK under renovation - new flooring'),
('205', 2, 1, 1, 550, 900.00, 'vacant', '1BHK with balcony and storage'),

-- Floor 3
('301', 3, 2, 1, 800, 1300.00, 'occupied', '2BHK corner unit with extra windows'),
('302', 3, 1, 1, 600, 1000.00, 'occupied', '1BHK with dedicated parking space'),
('303', 3, 3, 2, 1200, 1900.00, 'vacant', '3BHK luxury unit with walk-in closet'),
('304', 3, 2, 1, 850, 1400.00, 'occupied', '2BHK with private terrace access'),
('305', 3, 1, 1, 550, 950.00, 'vacant', '1BHK cozy unit with built-in storage'),

-- Floor 4 (Top Floor - Premium)
('401', 4, 2, 1, 800, 1350.00, 'occupied', '2BHK top floor with panoramic views'),
('402', 4, 1, 1, 600, 1050.00, 'vacant', '1BHK penthouse style with high ceilings'),
('403', 4, 3, 2, 1200, 2000.00, 'occupied', '3BHK penthouse with rooftop access'),
('404', 4, 2, 1, 850, 1450.00, 'vacant', '2BHK with roof access and city views'),
('405', 4, 1, 1, 550, 1000.00, 'occupied', '1BHK top floor unit with skylight');

-- Insert sample tenants
INSERT INTO tenants (full_name, email, phone, emergency_contact, emergency_phone, id_number, occupation) VALUES
('John Smith', 'john.smith@email.com', '+1-555-0101', 'Jane Smith', '+1-555-0102', 'ID001', 'Software Engineer'),
('Maria Garcia', 'maria.garcia@email.com', '+1-555-0103', 'Carlos Garcia', '+1-555-0104', 'ID002', 'High School Teacher'),
('David Johnson', 'david.johnson@email.com', '+1-555-0105', 'Sarah Johnson', '+1-555-0106', 'ID003', 'Emergency Room Doctor'),
('Lisa Chen', 'lisa.chen@email.com', '+1-555-0107', 'Michael Chen', '+1-555-0108', 'ID004', 'UX Designer'),
('Robert Wilson', 'robert.wilson@email.com', '+1-555-0109', 'Emma Wilson', '+1-555-0110', 'ID005', 'Project Manager'),
('Anna Rodriguez', 'anna.rodriguez@email.com', '+1-555-0111', 'Luis Rodriguez', '+1-555-0112', 'ID006', 'Registered Nurse'),
('James Brown', 'james.brown@email.com', '+1-555-0113', 'Mary Brown', '+1-555-0114', 'ID007', 'Senior Accountant'),
('Sophie Taylor', 'sophie.taylor@email.com', '+1-555-0115', 'Tom Taylor', '+1-555-0116', 'ID008', 'Corporate Lawyer'),
('Michael Davis', 'michael.davis@email.com', '+1-555-0117', 'Linda Davis', '+1-555-0118', 'ID009', 'Civil Engineer'),
('Emily White', 'emily.white@email.com', '+1-555-0119', 'John White', '+1-555-0120', 'ID010', 'Marketing Director');

-- Insert sample leases for occupied flats
INSERT INTO leases (flat_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status, notes) VALUES
((SELECT id FROM flats WHERE flat_number = '101'), (SELECT id FROM tenants WHERE full_name = 'John Smith'), '2024-01-01', '2024-12-31', 1200.00, 2400.00, 'active', 'Initial lease - excellent tenant'),
((SELECT id FROM flats WHERE flat_number = '103'), (SELECT id FROM tenants WHERE full_name = 'Maria Garcia'), '2024-02-01', '2025-01-31', 1800.00, 3600.00, 'active', 'Family with two children'),
((SELECT id FROM flats WHERE flat_number = '105'), (SELECT id FROM tenants WHERE full_name = 'David Johnson'), '2024-01-15', '2024-12-15', 850.00, 1700.00, 'active', 'Doctor - works night shifts'),
((SELECT id FROM flats WHERE flat_number = '201'), (SELECT id FROM tenants WHERE full_name = 'Lisa Chen'), '2024-03-01', '2025-02-28', 1250.00, 2500.00, 'active', 'Designer - works from home'),
((SELECT id FROM flats WHERE flat_number = '203'), (SELECT id FROM tenants WHERE full_name = 'Robert Wilson'), '2024-01-01', '2024-12-31', 1850.00, 3700.00, 'active', 'Project manager - travels frequently'),
((SELECT id FROM flats WHERE flat_number = '301'), (SELECT id FROM tenants WHERE full_name = 'Anna Rodriguez'), '2024-02-15', '2025-02-14', 1300.00, 2600.00, 'active', 'Nurse - very quiet tenant'),
((SELECT id FROM flats WHERE flat_number = '302'), (SELECT id FROM tenants WHERE full_name = 'James Brown'), '2024-01-01', '2024-12-31', 1000.00, 2000.00, 'active', 'Accountant - always pays early'),
((SELECT id FROM flats WHERE flat_number = '304'), (SELECT id FROM tenants WHERE full_name = 'Sophie Taylor'), '2024-03-01', '2025-02-28', 1400.00, 2800.00, 'active', 'Lawyer - professional tenant'),
((SELECT id FROM flats WHERE flat_number = '401'), (SELECT id FROM tenants WHERE full_name = 'Michael Davis'), '2024-01-01', '2024-12-31', 1350.00, 2700.00, 'active', 'Engineer - loves the top floor view'),
((SELECT id FROM flats WHERE flat_number = '403'), (SELECT id FROM tenants WHERE full_name = 'Emily White'), '2024-02-01', '2025-01-31', 2000.00, 4000.00, 'active', 'Marketing director - penthouse tenant');

-- Create some rent payments
INSERT INTO rent_payments (lease_id, amount, payment_date, due_date, status, payment_method, notes) 
SELECT 
  l.id,
  l.monthly_rent,
  CASE 
    WHEN random() > 0.3 THEN CURRENT_DATE - INTERVAL '5 days'
    ELSE NULL
  END as payment_date,
  CURRENT_DATE + INTERVAL '25 days' as due_date,
  CASE 
    WHEN random() > 0.3 THEN 'paid'
    ELSE 'pending'
  END as status,
  CASE 
    WHEN random() > 0.5 THEN 'bank_transfer'
    ELSE 'cash'
  END as payment_method,
  'Monthly rent payment'
FROM leases l
WHERE l.status = 'active';