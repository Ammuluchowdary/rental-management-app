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
import ApartmentForm from "@/components/ApartmentForm"
import { Building, MapPin, Phone, Mail, DollarSign, Users, Plus, Edit, Trash2, Search, Filter, TrendingUp, Home, AlertTriangle } from "lucide-react"

export default function ApartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingApartment, setEditingApartment] = useState<any>(null)
  const { apartments, deleteApartment, getApartmentStats } = useDataStore()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Home className="h-4 w-4" />
      case 'inactive':
        return <AlertTriangle className="h-4 w-4" />
      case 'maintenance':
        return <Building className="h-4 w-4" />
      default:
        return <Home className="h-4 w-4" />
    }
  }

  const filteredApartments = apartments.filter(apartment => {
    const matchesSearch = apartment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apartment.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apartment.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || apartment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalApartments = apartments.length
  const activeApartments = apartments.filter(a => a.status === 'active').length
  const totalRevenue = apartments.reduce((sum, apt) => sum + apt.monthly_revenue, 0)
  const totalFlats = apartments.reduce((sum, apt) => sum + apt.total_flats, 0)

  const handleEdit = (apartment: any) => {
    setEditingApartment(apartment)
  }

  const handleDelete = (apartmentId: string) => {
    deleteApartment(apartmentId)
  }

  const handleFormClose = () => {
    setShowAddForm(false)
    setEditingApartment(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Apartment Management</h1>
            <p className="text-lg text-muted-foreground">
              Manage all your apartment properties and their performance
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Apartment
          </Button>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Enterprise Mode:</strong> Manage multiple apartment complexes with detailed analytics, 
            occupancy tracking, and comprehensive property management features.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Apartments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApartments}</div>
            <p className="text-xs text-muted-foreground">
              {activeApartments} active properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flats</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFlats}</div>
            <p className="text-xs text-muted-foreground">
              Across all properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Combined monthly income
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalFlats > 0 
                ? Math.round((apartments.reduce((sum, apt) => sum + apt.occupied_flats, 0) / totalFlats) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all properties
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-64">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search apartments by name, address, or city..." 
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
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Apartments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Apartment Properties ({filteredApartments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Flats</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApartments.map((apartment) => {
                const stats = getApartmentStats(apartment.id)
                return (
                  <TableRow key={apartment.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{apartment.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {apartment.amenities?.slice(0, 3).join(', ')}
                          {apartment.amenities?.length > 3 && '...'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{apartment.city}, {apartment.state}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {apartment.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{apartment.total_flats} total</div>
                        <div className="text-xs text-muted-foreground">
                          {apartment.occupied_flats} occupied • {apartment.vacant_flats} vacant
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">${apartment.monthly_revenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          ${apartment.yearly_revenue.toLocaleString()}/year
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{apartment.property_manager}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {apartment.contact_phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(apartment.status)}
                        <Badge className={getStatusColor(apartment.status)}>
                          {apartment.status.charAt(0).toUpperCase() + apartment.status.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(apartment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Apartment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{apartment.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(apartment.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
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

      {/* Forms */}
      {showAddForm && (
        <ApartmentForm onClose={handleFormClose} onSuccess={handleFormClose} />
      )}
      {editingApartment && (
        <ApartmentForm 
          apartment={editingApartment} 
          onClose={handleFormClose} 
          onSuccess={handleFormClose} 
        />
      )}
    </div>
  )
} 