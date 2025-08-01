'use client'

import { useState } from 'react'
import FlatGrid from "@/components/FlatGrid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDataStore } from "@/lib/data-store"
import FlatForm from "@/components/FlatForm"
import { Plus, Building, Eye, Users } from "lucide-react"

export default function FlatsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const { flats, getFlatsByStatus, getDashboardStats } = useDataStore()
  
  const stats = getDashboardStats()
  const occupiedFlats = getFlatsByStatus('occupied')
  const vacantFlats = getFlatsByStatus('vacant')
  const maintenanceFlats = getFlatsByStatus('maintenance')

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flats Management</h1>
          <p className="text-muted-foreground">Manage all flats in your building</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4" />
          Add New Flat
        </Button>
      </div>

      {/* Dynamic Data Notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Dynamic Mode:</strong> All changes are saved locally and persist between sessions.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flats</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFlats}</div>
            <p className="text-xs text-muted-foreground">All units in building</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.occupiedFlats}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalFlats > 0 ? Math.round((stats.occupiedFlats / stats.totalFlats) * 100) : 0}% occupancy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacant</CardTitle>
            <Eye className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.vacantFlats}</div>
            <p className="text-xs text-muted-foreground">Available for rent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Building className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.maintenanceFlats}</div>
            <p className="text-xs text-muted-foreground">Under repair</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Occupied ({stats.occupiedFlats})
        </Badge>
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Vacant ({stats.vacantFlats})
        </Badge>
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Maintenance ({stats.maintenanceFlats})
        </Badge>
      </div>

      {/* Flats by Status */}
      <div className="space-y-8">
        {/* Occupied Flats */}
        {occupiedFlats.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Occupied Flats ({occupiedFlats.length})
            </h2>
            <FlatGrid flats={occupiedFlats} />
          </div>
        )}

        {/* Vacant Flats */}
        {vacantFlats.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vacant Flats ({vacantFlats.length})
            </h2>
            <FlatGrid flats={vacantFlats} />
          </div>
        )}

        {/* Maintenance Flats */}
        {maintenanceFlats.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
              <Building className="h-5 w-5" />
              Under Maintenance ({maintenanceFlats.length})
            </h2>
            <FlatGrid flats={maintenanceFlats} />
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <FlatForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}
