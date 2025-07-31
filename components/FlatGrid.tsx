import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Flat, Lease } from "@/lib/types"
import { Bed, Bath, Square, User, DollarSign, Edit, Eye } from "lucide-react"

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
        <Card key={flat.id} className="hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">{getStatusIcon(flat.status)}</span>
                Flat {flat.flat_number}
              </CardTitle>
              <Badge className={`${getStatusColor(flat.status)} font-medium`}>{flat.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Floor {flat.floor} • {flat.bedrooms}BHK
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Property Details */}
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-1 bg-blue-50 p-2 rounded-md">
                <Bed className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{flat.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 p-2 rounded-md">
                <Bath className="h-4 w-4 text-green-600" />
                <span className="font-medium">{flat.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1 bg-purple-50 p-2 rounded-md">
                <Square className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-xs">{flat.area_sqft}</span>
              </div>
            </div>

            {/* Rent */}
            <div className="flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
              <DollarSign className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-xl font-bold text-green-700">${flat.monthly_rent.toLocaleString()}</span>
              <span className="text-sm text-green-600 ml-1">/month</span>
            </div>

            {/* Tenant Info */}
            {flat.current_lease?.tenant ? (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Current Tenant</p>
                    <p className="text-sm text-blue-700">{flat.current_lease.tenant.full_name}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  {flat.status === "vacant" ? "Available for rent" : "No tenant assigned"}
                </p>
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded-md">
              {flat.description || "No description available"}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
