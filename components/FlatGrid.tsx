'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import type { Flat, Lease } from "@/lib/types"
import { Bed, Bath, Square, User, DollarSign, Edit, Eye, Trash2, Building } from "lucide-react"
import { useDataStore } from "@/lib/data-store"
import FlatForm from "./FlatForm"

interface FlatWithLease extends Flat {
  current_lease?: Lease & {
    tenant?: {
      full_name: string
    }
  }
}

interface FlatGridProps {
  flats: FlatWithLease[]
}

export default function FlatGrid({ flats }: FlatGridProps) {
  const [editingFlat, setEditingFlat] = useState<Flat | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const { deleteFlat } = useDataStore()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-green-100 text-green-800 border-green-200"
      case "vacant":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "maintenance":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "occupied":
        return "🏠"
      case "vacant":
        return "🔓"
      case "maintenance":
        return "🔧"
      default:
        return "🏢"
    }
  }

  const handleEdit = (flat: Flat) => {
    setEditingFlat(flat)
    setShowEditForm(true)
  }

  const handleDelete = (flatId: string) => {
    deleteFlat(flatId)
  }

  const handleFormClose = () => {
    setShowEditForm(false)
    setEditingFlat(null)
  }

  if (flats.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No flats found in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {flats.map((flat) => (
        <Card key={flat.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">{getStatusIcon(flat.status)}</span>
                Flat {flat.flat_number}
              </CardTitle>
              <Badge className={`${getStatusColor(flat.status)} font-medium shadow-sm`}>{flat.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Floor {flat.floor} • {flat.bedrooms}BHK
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Property Details */}
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                <Bed className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-blue-800">{flat.bedrooms}</span>
                <span className="text-xs text-blue-600">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                <Bath className="h-5 w-5 text-green-600" />
                <span className="font-bold text-green-800">{flat.bathrooms}</span>
                <span className="text-xs text-green-600">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                <Square className="h-5 w-5 text-purple-600" />
                <span className="font-bold text-purple-800">{flat.area_sqft}</span>
                <span className="text-xs text-purple-600">sq ft</span>
              </div>
            </div>

            {/* Rent */}
            <div className="flex items-center justify-center bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 p-4 rounded-xl border-2 border-green-200 shadow-sm">
              <DollarSign className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-green-700">${flat.monthly_rent.toLocaleString()}</span>
              <span className="text-sm text-green-600 ml-2 font-medium">/month</span>
            </div>

            {/* Tenant Info */}
            {flat.current_lease?.tenant ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-900">Current Tenant</p>
                    <p className="text-sm text-blue-700 font-medium">{flat.current_lease.tenant.full_name}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border-2 border-gray-200 shadow-sm">
                <div className="text-center">
                  <div className="bg-gray-100 p-2 rounded-full w-fit mx-auto mb-2">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {flat.status === "vacant" ? "Available for rent" : "No tenant assigned"}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 font-medium">
                {flat.description || "No description available"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200" 
                onClick={() => handleEdit(flat)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-white hover:bg-red-50 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Flat</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete Flat {flat.flat_number}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(flat.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Edit Form Modal */}
      {showEditForm && editingFlat && (
        <FlatForm
          flat={editingFlat}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}
    </div>
  )
}
