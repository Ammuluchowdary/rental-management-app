'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useDataStore } from "@/lib/data-store"
import { Building, MapPin, Phone, Mail, DollarSign, Users, Home } from "lucide-react"

const apartmentSchema = z.object({
  name: z.string().min(2, "Apartment name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip_code: z.string().min(5, "ZIP code must be at least 5 characters"),
  total_flats: z.number().min(1, "Total flats must be at least 1"),
  property_manager: z.string().min(2, "Property manager is required"),
  contact_phone: z.string().min(10, "Phone number must be at least 10 characters"),
  contact_email: z.string().email("Please enter a valid email address"),
  status: z.enum(["active", "inactive", "maintenance"]),
  amenities: z.array(z.string()).optional(),
})

type ApartmentFormData = z.infer<typeof apartmentSchema>

interface ApartmentFormProps {
  apartment?: any
  onClose: () => void
  onSuccess: () => void
}

const commonAmenities = [
  "Swimming Pool", "Gym", "Parking", "Security", "Garden", "Elevator",
  "Storage", "Balcony", "Air Conditioning", "Dishwasher", "Hardwood Floors",
  "Fireplace", "Walk-in Closet", "Ocean View", "City View", "Rooftop Deck",
  "Business Center", "Concierge", "Fitness Center", "Laundry", "Pet Friendly"
]

export default function ApartmentForm({ apartment, onClose, onSuccess }: ApartmentFormProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(apartment?.amenities || [])
  const { addApartment, updateApartment } = useDataStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentSchema),
    defaultValues: apartment ? {
      name: apartment.name,
      address: apartment.address,
      city: apartment.city,
      state: apartment.state,
      zip_code: apartment.zip_code,
      total_flats: apartment.total_flats,
      property_manager: apartment.property_manager,
      contact_phone: apartment.contact_phone,
      contact_email: apartment.contact_email,
      status: apartment.status,
    } : {
      total_flats: 0,
      status: "active",
    }
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onSubmit = async (data: ApartmentFormData) => {
    try {
      const apartmentData = {
        ...data,
        amenities: selectedAmenities,
        occupied_flats: apartment?.occupied_flats || 0,
        vacant_flats: apartment?.vacant_flats || data.total_flats,
        maintenance_flats: apartment?.maintenance_flats || 0,
        monthly_revenue: apartment?.monthly_revenue || 0,
        yearly_revenue: apartment?.yearly_revenue || 0,
      }

      if (apartment) {
        updateApartment(apartment.id, apartmentData)
      } else {
        addApartment(apartmentData)
      }
      
      onSuccess()
    } catch (error) {
      console.error('Error saving apartment:', error)
    }
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {apartment ? 'Edit Apartment' : 'Add New Apartment'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Apartment Name *</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter apartment name"
                    className="pl-10"
                    {...register('name')}
                    suppressHydrationWarning
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_flats">Total Flats *</Label>
                <Input
                  id="total_flats"
                  type="number"
                  placeholder="Enter total number of flats"
                  {...register('total_flats', { valueAsNumber: true })}
                  suppressHydrationWarning
                />
                {errors.total_flats && (
                  <p className="text-sm text-red-600">{errors.total_flats.message}</p>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="Enter full address"
                    className="pl-10"
                    {...register('address')}
                    suppressHydrationWarning
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    {...register('city')}
                    suppressHydrationWarning
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="Enter state"
                    {...register('state')}
                    suppressHydrationWarning
                  />
                  {errors.state && (
                    <p className="text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip_code">ZIP Code *</Label>
                  <Input
                    id="zip_code"
                    placeholder="Enter ZIP code"
                    {...register('zip_code')}
                    suppressHydrationWarning
                  />
                  {errors.zip_code && (
                    <p className="text-sm text-red-600">{errors.zip_code.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="property_manager">Property Manager *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="property_manager"
                    placeholder="Enter property manager name"
                    className="pl-10"
                    {...register('property_manager')}
                    suppressHydrationWarning
                  />
                </div>
                {errors.property_manager && (
                  <p className="text-sm text-red-600">{errors.property_manager.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_phone"
                    placeholder="Enter contact phone number"
                    className="pl-10"
                    {...register('contact_phone')}
                    suppressHydrationWarning
                  />
                </div>
                {errors.contact_phone && (
                  <p className="text-sm text-red-600">{errors.contact_phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder="Enter contact email"
                    className="pl-10"
                    {...register('contact_email')}
                    suppressHydrationWarning
                  />
                </div>
                {errors.contact_email && (
                  <p className="text-sm text-red-600">{errors.contact_email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) => setValue('status', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {commonAmenities.map((amenity) => (
                  <Button
                    key={amenity}
                    type="button"
                    variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAmenity(amenity)}
                    className="justify-start"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    {amenity}
                  </Button>
                ))}
              </div>
              {selectedAmenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Selected:</span>
                  {selectedAmenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                {apartment ? 'Update Apartment' : 'Create Apartment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 