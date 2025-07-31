import FlatGrid from "@/components/FlatGrid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { isSupabaseConfigured, createServerClient } from "@/lib/supabase"
import { mockFlats } from "@/lib/mock-data"
import { Plus, Building, Eye, Users } from "lucide-react"
import Link from "next/link"

async function getFlats() {
  // Always return mock data if Supabase is not properly configured
  if (!isSupabaseConfigured()) {
    console.log("Using mock flats data - Supabase not configured")
    return mockFlats
  }

  try {
    const supabase = createServerClient()

    // Test connection first
    const { data: testData, error: testError } = await supabase.from("flats").select("id").limit(1)

    if (testError) {
      console.log("Database connection failed, using mock data:", testError.message)
      return mockFlats
    }

    // First, get all flats
    const { data: allFlats, error: flatsError } = await supabase.from("flats").select("*").order("flat_number")

    if (flatsError) {
      console.error("Error fetching flats:", flatsError)
      return mockFlats
    }

    // Then get active leases with tenant information
    const { data: activeLeases, error: leasesError } = await supabase
      .from("leases")
      .select(`
        flat_id,
        tenants!inner(full_name)
      `)
      .eq("status", "active")

    if (leasesError) {
      console.error("Error fetching leases:", leasesError)
      // Continue without lease data but don't fail completely
    }

    // Combine the data
    const flatsWithLeases =
      allFlats?.map((flat) => {
        const activeLease = activeLeases?.find((lease) => lease.flat_id === flat.id)
        return {
          ...flat,
          current_lease: activeLease
            ? {
                tenant: {
                  full_name: activeLease.tenants.full_name,
                },
              }
            : undefined,
        }
      }) || []

    return flatsWithLeases
  } catch (error) {
    console.error("Error fetching flats:", error)
    // Always return mock data as fallback
    return mockFlats
  }
}

export default async function FlatsPage() {
  const flats = await getFlats()

  const occupiedFlats = flats.filter((f: any) => f.status === "occupied")
  const vacantFlats = flats.filter((f: any) => f.status === "vacant")
  const maintenanceFlats = flats.filter((f: any) => f.status === "maintenance")

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flats Management</h1>
          <p className="text-muted-foreground">Manage all flats in your building</p>
        </div>
        <Link href="/flats/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Flat
          </Button>
        </Link>
      </div>

      {/* Demo Mode Warning */}
      {!isSupabaseConfigured() && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> Showing sample data. Configure Supabase to connect to your database.
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flats</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flats.length}</div>
            <p className="text-xs text-muted-foreground">All units in building</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{occupiedFlats.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((occupiedFlats.length / flats.length) * 100)}% occupancy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacant</CardTitle>
            <Eye className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{vacantFlats.length}</div>
            <p className="text-xs text-muted-foreground">Available for rent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Building className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{maintenanceFlats.length}</div>
            <p className="text-xs text-muted-foreground">Under repair</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Occupied ({occupiedFlats.length})
        </Badge>
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Vacant ({vacantFlats.length})
        </Badge>
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Maintenance ({maintenanceFlats.length})
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
    </div>
  )
}
