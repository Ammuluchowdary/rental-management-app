'use client'

import { useState } from "react"
import DashboardStats from "@/components/DashboardStats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataStore } from "@/lib/data-store"
import FlatGrid from "@/components/FlatGrid"
import { 
  Building, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  Home, 
  Eye, 
  Settings,
  Apartment,
  Calendar,
  CheckCircle,
  Clock
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { apartments, flats, getDashboardStats, getFlatsByStatus } = useDataStore()
  const stats = getDashboardStats()
  const occupiedFlats = getFlatsByStatus('occupied')
  const vacantFlats = getFlatsByStatus('vacant')
  const maintenanceFlats = getFlatsByStatus('maintenance')

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your rental management dashboard. Monitor your properties, tenants, and financial performance.
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Enterprise Mode:</strong> Real-time data with comprehensive analytics, 
            occupancy tracking, and financial insights across all your properties.
          </p>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Apartments</CardTitle>
            <Apartment className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_apartments}</div>
            <p className="text-xs text-muted-foreground">
              Active properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flats</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_flats}</div>
            <p className="text-xs text-muted-foreground">
              {stats.occupancy_rate.toFixed(1)}% occupancy rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_tenants}</div>
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
            <div className="text-2xl font-bold">${stats.monthly_revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.total_revenue.toLocaleString()} total collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/apartments">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Apartment className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Manage Apartments</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/flats">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-green-600" />
                <span className="font-medium">View Flats</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/tenants">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Tenant Directory</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/payments">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Payment Center</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Status Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Occupied Flats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{occupiedFlats.length}</div>
            <p className="text-sm text-muted-foreground">
              Currently rented units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Vacant Flats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{vacantFlats.length}</div>
            <p className="text-sm text-muted-foreground">
              Available for rent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{maintenanceFlats.length}</div>
            <p className="text-sm text-muted-foreground">
              Under maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pending Payments</span>
              <Badge variant="outline" className="text-orange-600">
                {stats.pending_payments}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overdue Payments</span>
              <Badge variant="destructive">
                {stats.overdue_payments}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Rent</span>
              <span className="font-medium">${stats.average_rent.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Expiring Leases</span>
              <Badge variant="outline" className="text-blue-600">
                {stats.expiring_leases}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New tenant moved in</p>
                <p className="text-xs text-muted-foreground">Flat 101 - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Payment received</p>
                <p className="text-xs text-muted-foreground">Flat 203 - 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Maintenance request</p>
                <p className="text-xs text-muted-foreground">Flat 305 - 6 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Lease renewal</p>
                <p className="text-xs text-muted-foreground">Flat 401 - 1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Flats Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Flats ({flats.length})</TabsTrigger>
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
