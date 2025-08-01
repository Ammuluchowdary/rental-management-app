'use client'

import { useState } from "react"
import DashboardStats from "@/components/DashboardStats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataStore } from "@/lib/data-store"
import FlatGrid from "@/components/FlatGrid"
import { Building, Users, DollarSign, AlertTriangle, TrendingUp, Home, Eye, Settings } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { flats, getDashboardStats, getFlatsByStatus } = useDataStore()
  const stats = getDashboardStats()
  
  const occupiedFlats = getFlatsByStatus('occupied')
  const vacantFlats = getFlatsByStatus('vacant')
  const maintenanceFlats = getFlatsByStatus('maintenance')

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-lg text-muted-foreground">Overview of your rental property management</p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Dynamic Mode:</strong> All changes are saved locally and persist between sessions.
          </p>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flats</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalFlats}</div>
            <p className="text-xs text-muted-foreground">All units in building</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.occupiedFlats}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalFlats > 0 ? Math.round((stats.occupiedFlats / stats.totalFlats) * 100) : 0}% occupancy
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${stats.totalRentCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total collected this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">${stats.totalRentPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingPayments} payments pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/flats">
              <Button className="w-full justify-start" variant="outline">
                <Building className="h-4 w-4 mr-2" />
                Manage Flats
              </Button>
            </Link>
            <Link href="/tenants">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Tenants
              </Button>
            </Link>
            <Link href="/payments">
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                View Payments
              </Button>
            </Link>
            <Link href="/leases">
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Manage Leases
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Status Overview */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Occupied Flats</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {stats.occupiedFlats}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Vacant Flats</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {stats.vacantFlats}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Under Maintenance</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {stats.maintenanceFlats}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overdue Payments</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {stats.overduePayments}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p className="font-medium text-green-600">+{stats.occupiedFlats} Active Leases</p>
              <p className="text-muted-foreground">Currently occupied units</p>
            </div>
            <div className="text-sm">
              <p className="font-medium text-blue-600">${stats.totalRentCollected.toLocaleString()}</p>
              <p className="text-muted-foreground">Total revenue collected</p>
            </div>
            <div className="text-sm">
              <p className="font-medium text-yellow-600">{stats.pendingPayments} Pending</p>
              <p className="text-muted-foreground">Payments awaiting collection</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flats Overview with Tabs */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Flats Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({flats.length})</TabsTrigger>
              <TabsTrigger value="occupied">Occupied ({occupiedFlats.length})</TabsTrigger>
              <TabsTrigger value="vacant">Vacant ({vacantFlats.length})</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance ({maintenanceFlats.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <FlatGrid flats={flats} />
            </TabsContent>
            
            <TabsContent value="occupied" className="mt-6">
              <FlatGrid flats={occupiedFlats} />
            </TabsContent>
            
            <TabsContent value="vacant" className="mt-6">
              <FlatGrid flats={vacantFlats} />
            </TabsContent>
            
            <TabsContent value="maintenance" className="mt-6">
              <FlatGrid flats={maintenanceFlats} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
