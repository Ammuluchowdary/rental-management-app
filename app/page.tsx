'use client'

import { useState } from "react"
import DashboardStats from "@/components/DashboardStats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataStore } from "@/lib/data-store"
import { useAuthStore } from "@/lib/auth-store"
import FlatGrid from "@/components/FlatGrid"
import { Building, Users, DollarSign, AlertTriangle, TrendingUp, Home, Eye, Settings, Calendar, BarChart3, FileText } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { flats, getDashboardStats, getFlatsByStatus } = useDataStore()
  const { user } = useAuthStore()
  const stats = getDashboardStats()
  const occupiedFlats = getFlatsByStatus('occupied')
  const vacantFlats = getFlatsByStatus('vacant')
  const maintenanceFlats = getFlatsByStatus('maintenance')

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome to your rental management dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {user?.role || 'User'}
            </Badge>
          </div>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Real-time Dashboard:</strong> All data is live and updates automatically. 
            Your session is active and secure.
          </p>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFlats}</div>
            <p className="text-xs text-muted-foreground">
              All rental properties
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied Units</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupiedFlats}</div>
            <p className="text-xs text-muted-foreground">
              Currently rented
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRentCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Collected this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting collection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/flats">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Manage Flats</h3>
                  <p className="text-sm text-muted-foreground">View and edit properties</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/tenants">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">Tenant Directory</h3>
                  <p className="text-sm text-muted-foreground">Manage tenant information</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/payments">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Payment Center</h3>
                  <p className="text-sm text-muted-foreground">Track rent payments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/leases">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-orange-600" />
                <div>
                  <h3 className="font-semibold">Lease Agreements</h3>
                  <p className="text-sm text-muted-foreground">Manage contracts</p>
                </div>
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
              <Badge className="bg-green-100 text-green-800 border-green-200">Occupied</Badge>
              <span className="text-lg">{stats.occupiedFlats} units</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Occupancy Rate</span>
                <span className="font-medium">
                  {stats.totalFlats > 0 ? Math.round((stats.occupiedFlats / stats.totalFlats) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${stats.totalFlats > 0 ? (stats.occupiedFlats / stats.totalFlats) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Vacant</Badge>
              <span className="text-lg">{stats.vacantFlats} units</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Available Units</span>
                <span className="font-medium">{stats.vacantFlats}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${stats.totalFlats > 0 ? (stats.vacantFlats / stats.totalFlats) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800 border-red-200">Maintenance</Badge>
              <span className="text-lg">{stats.maintenanceFlats} units</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Under Maintenance</span>
                <span className="font-medium">{stats.maintenanceFlats}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${stats.totalFlats > 0 ? (stats.maintenanceFlats / stats.totalFlats) * 100 : 0}%` 
                  }}
                ></div>
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
            Properties Overview
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
