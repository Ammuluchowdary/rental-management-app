'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDataStore } from "@/lib/data-store"
import LeaseForm from "@/components/LeaseForm"
import { Calendar, User, Building, DollarSign, TrendingUp, FileText, Edit, Trash2, Plus, CheckCircle, Clock, AlertTriangle, Filter } from "lucide-react"

export default function LeasesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLease, setEditingLease] = useState<any>(null)
  const { leases, flats, tenants, updateLease, deleteLease } = useDataStore()

  const getLeaseStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'terminated':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLeaseStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'terminated':
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getLeaseInfo = (leaseId: string) => {
    const lease = leases.find(l => l.id === leaseId)
    if (!lease) return { flat_number: 'N/A', tenant_name: 'N/A' }
    
    const flat = flats.find(f => f.id === lease.flat_id)
    const tenant = tenants.find(t => t.id === lease.tenant_id)
    
    return {
      flat_number: flat?.flat_number || 'N/A',
      tenant_name: tenant?.full_name || 'N/A',
      monthly_rent: lease.monthly_rent
    }
  }

  const filteredLeases = leases.filter(lease => {
    if (statusFilter === 'all') return true
    return lease.status === statusFilter
  })

  const activeLeases = leases.filter(l => l.status === 'active')
  const expiredLeases = leases.filter(l => l.status === 'expired')
  const totalRevenue = activeLeases.reduce((sum, lease) => sum + lease.monthly_rent, 0)

  const handleStatusChange = (leaseId: string, newStatus: string) => {
    updateLease(leaseId, { status: newStatus as any })
  }

  const handleDelete = (leaseId: string) => {
    deleteLease(leaseId)
  }

  const handleEdit = (lease: any) => {
    setEditingLease(lease)
  }

  const handleFormClose = () => {
    setShowAddForm(false)
    setEditingLease(null)
  }

  const isLeaseExpired = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Lease Management</h1>
            <p className="text-lg text-muted-foreground">Manage all lease agreements and contracts</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Lease
          </Button>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Real-time Mode:</strong> All lease data is managed locally with instant updates. 
            Lease status can be updated instantly.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leases</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leases.length}</div>
            <p className="text-xs text-muted-foreground">
              All lease agreements
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLeases.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Leases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredLeases.length}</div>
            <p className="text-xs text-muted-foreground">
              Past due date
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From active leases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by Status:</span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All leases" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leases</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lease Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flat/Tenant</TableHead>
                <TableHead>Lease Period</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Security Deposit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeases.map((lease) => {
                const info = getLeaseInfo(lease.id)
                const isExpired = isLeaseExpired(lease.end_date)
                return (
                  <TableRow key={lease.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">Flat {info.flat_number}</div>
                        <div className="text-sm text-muted-foreground">{info.tenant_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(lease.start_date).toLocaleDateString()} - {new Date(lease.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        {isExpired && (
                          <Badge variant="destructive" className="text-xs">
                            Expired
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${lease.monthly_rent.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">${lease.security_deposit.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={lease.status}
                          onValueChange={(value) => handleStatusChange(lease.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(lease)}
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
                              <AlertDialogTitle>Delete Lease</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this lease? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(lease.id)}>
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

      {/* Lease Forms */}
      {showAddForm && (
        <LeaseForm onClose={handleFormClose} onSuccess={handleFormClose} />
      )}
      {editingLease && (
        <LeaseForm 
          lease={editingLease} 
          onClose={handleFormClose} 
          onSuccess={handleFormClose} 
        />
      )}
    </div>
  )
}
