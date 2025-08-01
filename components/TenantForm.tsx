'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDataStore } from '@/lib/data-store'
import type { Tenant } from '@/lib/types'
import { User, Save, X, Mail, Phone, UserCheck } from 'lucide-react'

const tenantSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  emergency_contact: z.string().min(2, 'Emergency contact name is required'),
  emergency_phone: z.string().min(10, 'Emergency phone must be at least 10 digits'),
  id_number: z.string().min(1, 'ID number is required'),
  occupation: z.string().min(1, 'Occupation is required'),
})

type TenantFormData = z.infer<typeof tenantSchema>

interface TenantFormProps {
  tenant?: Tenant
  onClose: () => void
  onSuccess?: () => void
}

export default function TenantForm({ tenant, onClose, onSuccess }: TenantFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addTenant, updateTenant } = useDataStore()
  
  const isEditing = !!tenant

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: tenant ? {
      full_name: tenant.full_name,
      email: tenant.email,
      phone: tenant.phone,
      emergency_contact: tenant.emergency_contact,
      emergency_phone: tenant.emergency_phone,
      id_number: tenant.id_number,
      occupation: tenant.occupation,
    } : {
      full_name: '',
      email: '',
      phone: '',
      emergency_contact: '',
      emergency_phone: '',
      id_number: '',
      occupation: '',
    },
  })

  const onSubmit = async (data: TenantFormData) => {
    setIsLoading(true)
    try {
      if (isEditing && tenant) {
        updateTenant(tenant.id, data)
      } else {
        addTenant(data)
      }
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error saving tenant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {isEditing ? 'Edit Tenant' : 'Add New Tenant'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    {...register('full_name')}
                    placeholder="Enter full name"
                  />
                  {errors.full_name && (
                    <p className="text-sm text-red-600">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation *</Label>
                  <Input
                    id="occupation"
                    {...register('occupation')}
                    placeholder="e.g., Software Engineer, Teacher"
                  />
                  {errors.occupation && (
                    <p className="text-sm text-red-600">{errors.occupation.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_number">ID Number *</Label>
                <Input
                  id="id_number"
                  {...register('id_number')}
                  placeholder="Passport, Driver's License, etc."
                />
                {errors.id_number && (
                  <p className="text-sm text-red-600">{errors.id_number.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="tenant@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+1234567890"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Emergency Contact
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Emergency Contact Name *</Label>
                  <Input
                    id="emergency_contact"
                    {...register('emergency_contact')}
                    placeholder="Spouse, parent, or friend"
                  />
                  {errors.emergency_contact && (
                    <p className="text-sm text-red-600">{errors.emergency_contact.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_phone">Emergency Phone *</Label>
                  <Input
                    id="emergency_phone"
                    {...register('emergency_phone')}
                    placeholder="+1234567890"
                  />
                  {errors.emergency_phone && (
                    <p className="text-sm text-red-600">{errors.emergency_phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : isEditing ? 'Update Tenant' : 'Add Tenant'}
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