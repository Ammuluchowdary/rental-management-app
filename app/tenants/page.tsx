'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDataStore } from "@/lib/data-store"
import TenantForm from "@/components/TenantForm"
import { User, Phone, Mail, Building, Plus, Edit, Trash2, Search, Filter, Users, Calendar, AlertTriangle } from "lucide-react"

export default function TenantsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTenant, setEditingTenant] = useState<any>(null)
  const { tenants, flats, leases, deleteTenant } = useDataStore()

  const getTenantStatus = (tenantId: string) => {
    const activeLease = leases.find(lease => 
      lease.tenant_id === tenantId && lease.status === 'active'
    )
    return activeLease ? 'active' : 'inactive'
  }

  const getTenantFlat = (tenantId: string) => {
    const activeLease = leases.find(lease => 
      lease.tenant_id === tenantId && lease.status === 'active'
    )
    if (!activeLease) return null
    
    const flat = flats.find(f => f.id === activeLease.flat_id)
    return flat
  }

  const getTenantStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTenantStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Building className="h-4 w-4 text-green-600" />
      case 'inactive':
        return <Users className="h-4 w-4 text-gray-600" />
      default:
        return <Users className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.phone.includes(searchTerm) ||
                         tenant.id_number.toLowerCase().includes(searchTerm.toLowerCase())
    
    const status = getTenantStatus(tenant.id)
    const matchesStatus = statusFilter === 'all' || status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const activeTenants = tenants.filter(tenant => getTenantStatus(tenant.id) === 'active')
  const inactiveTenants = tenants.filter(tenant => getTenantStatus(tenant.id) === 'inactive')
  const totalRent = activeTenants.reduce((sum, tenant) => {
    const flat = getTenantFlat(tenant.id)
    return sum + (flat?.monthly_rent || 0)
  }, 0)

  const handleDelete = (tenantId: string) => {
    deleteTenant(tenantId)
  }

  const handleEdit = (tenant: any) => {
    setEditingTenant(tenant)
  }

  const handleFormClose = () => {
    setShowAddForm(false)
    setEditingTenant(null)
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
      <div>
            <h1 className="text-4xl font-bold tracking-tight">Tenant Management</h1>
            <p className="text-lg text-muted-foreground">Manage all tenant information and records</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Tenant
          </Button>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Real-time Mode:</strong> All tenant data is managed locally with instant updates. 
            Search and filter tenants in real-time.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
            <p className="text-xs text-muted-foreground">
              All registered tenants
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTenants.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently renting
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Tenants</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveTenants.length}</div>
            <p className="text-xs text-muted-foreground">
              No active lease
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From active tenants
            </p>
          </CardContent>
        </Card>
              </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-64">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenants by name, email, phone, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tenants</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
              </div>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Records ({filteredTenants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Current Flat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Emergency Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => {
                const status = getTenantStatus(tenant.id)
                const currentFlat = getTenantFlat(tenant.id)
                return (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tenant.full_name}</div>
                        <div className="text-sm text-muted-foreground">ID: {tenant.id_number}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{tenant.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{tenant.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {currentFlat ? (
                        <div>
                          <div className="font-medium">Flat {currentFlat.flat_number}</div>
                          <div className="text-sm text-muted-foreground">
                            ${currentFlat.monthly_rent}/month
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No active lease</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTenantStatusIcon(status)}
                        <Badge className={`${getTenantStatusColor(status)} font-medium`}>
                          {status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{tenant.occupation || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{tenant.emergency_contact || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">
                          {tenant.emergency_phone || 'N/A'}
              </div>
              </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(tenant)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this tenant? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(tenant.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
              </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
            </CardContent>
          </Card>

      {/* Tenant Forms */}
      {showAddForm && (
        <TenantForm onClose={handleFormClose} onSuccess={handleFormClose} />
      )}
      {editingTenant && (
        <TenantForm 
          tenant={editingTenant} 
          onClose={handleFormClose} 
          onSuccess={handleFormClose} 
        />
      )}
    </div>
  )
}
