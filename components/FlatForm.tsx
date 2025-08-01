'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDataStore } from '@/lib/data-store'
import type { Flat } from '@/lib/types'
import { Building, Save, X } from 'lucide-react'

const flatSchema = z.object({
  flat_number: z.string().min(1, 'Flat number is required'),
  floor: z.number().min(1, 'Floor must be at least 1'),
  bedrooms: z.number().min(1, 'Must have at least 1 bedroom'),
  bathrooms: z.number().min(1, 'Must have at least 1 bathroom'),
  area_sqft: z.number().min(100, 'Area must be at least 100 sq ft'),
  monthly_rent: z.number().min(0, 'Rent must be positive'),
  status: z.enum(['vacant', 'occupied', 'maintenance']),
  description: z.string().min(1, 'Description is required'),
})

type FlatFormData = z.infer<typeof flatSchema>

interface FlatFormProps {
  flat?: Flat
  onClose: () => void
  onSuccess?: () => void
}

export default function FlatForm({ flat, onClose, onSuccess }: FlatFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { addFlat, updateFlat } = useDataStore()
  
  const isEditing = !!flat

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FlatFormData>({
    resolver: zodResolver(flatSchema),
    defaultValues: flat ? {
      flat_number: flat.flat_number,
      floor: flat.floor,
      bedrooms: flat.bedrooms,
      bathrooms: flat.bathrooms,
      area_sqft: flat.area_sqft,
      monthly_rent: flat.monthly_rent,
      status: flat.status,
      description: flat.description,
    } : {
      flat_number: '',
      floor: 1,
      bedrooms: 1,
      bathrooms: 1,
      area_sqft: 500,
      monthly_rent: 1000,
      status: 'vacant',
      description: '',
    },
  })

  const onSubmit = async (data: FlatFormData) => {
    setIsLoading(true)
    try {
      if (isEditing && flat) {
        updateFlat(flat.id, data)
      } else {
        addFlat(data)
      }
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error saving flat:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {isEditing ? 'Edit Flat' : 'Add New Flat'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flat_number">Flat Number *</Label>
                <Input
                  id="flat_number"
                  {...register('flat_number')}
                  placeholder="e.g., 101, A-1"
                />
                {errors.flat_number && (
                  <p className="text-sm text-red-600">{errors.flat_number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Floor *</Label>
                <Input
                  id="floor"
                  type="number"
                  {...register('floor', { valueAsNumber: true })}
                  min="1"
                />
                {errors.floor && (
                  <p className="text-sm text-red-600">{errors.floor.message}</p>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  {...register('bedrooms', { valueAsNumber: true })}
                  min="1"
                />
                {errors.bedrooms && (
                  <p className="text-sm text-red-600">{errors.bedrooms.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  {...register('bathrooms', { valueAsNumber: true })}
                  min="1"
                />
                {errors.bathrooms && (
                  <p className="text-sm text-red-600">{errors.bathrooms.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area_sqft">Area (sq ft) *</Label>
                <Input
                  id="area_sqft"
                  type="number"
                  {...register('area_sqft', { valueAsNumber: true })}
                  min="100"
                />
                {errors.area_sqft && (
                  <p className="text-sm text-red-600">{errors.area_sqft.message}</p>
                )}
              </div>
            </div>

            {/* Rent and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly_rent">Monthly Rent ($) *</Label>
                <Input
                  id="monthly_rent"
                  type="number"
                  {...register('monthly_rent', { valueAsNumber: true })}
                  min="0"
                  step="0.01"
                />
                {errors.monthly_rent && (
                  <p className="text-sm text-red-600">{errors.monthly_rent.message}</p>
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
                    <SelectItem value="vacant">Vacant</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe the flat, amenities, view, etc."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : isEditing ? 'Update Flat' : 'Add Flat'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 