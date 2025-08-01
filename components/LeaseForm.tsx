'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDataStore } from "@/lib/data-store"
import { Calendar, Building, User, DollarSign, FileText } from "lucide-react"

const leaseSchema = z.object({
  flat_id: z.string().min(1, "Flat is required"),
  tenant_id: z.string().min(1, "Tenant is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  monthly_rent: z.number().min(1, "Monthly rent must be greater than 0"),
  security_deposit: z.number().min(0, "Security deposit cannot be negative"),
  status: z.enum(["active", "expired", "terminated"]),
})

type LeaseFormData = z.infer<typeof leaseSchema>

interface LeaseFormProps {
  lease?: any
  onClose: () => void
  onSuccess: () => void
}

export default function LeaseForm({ lease, onClose, onSuccess }: LeaseFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { addLease, updateLease, flats, tenants } = useDataStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LeaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: lease ? {
      flat_id: lease.flat_id,
      tenant_id: lease.tenant_id,
      start_date: lease.start_date,
      end_date: lease.end_date,
      monthly_rent: lease.monthly_rent,
      security_deposit: lease.security_deposit,
      status: lease.status,
    } : {
      monthly_rent: 0,
      security_deposit: 0,
      status: "active",
    }
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onSubmit = async (data: LeaseFormData) => {
    setIsLoading(true)
    try {
      if (lease) {
        updateLease(lease.id, data)
      } else {
        addLease(data)
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving lease:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFlatInfo = (flatId: string) => {
    const flat = flats.find(f => f.id === flatId)
    return flat ? {
      flat_number: flat.flat_number,
      floor: flat.floor,
      bedrooms: flat.bedrooms,
      bathrooms: flat.bathrooms,
      monthly_rent: flat.monthly_rent
    } : null
  }

  const getTenantInfo = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    return tenant ? {
      full_name: tenant.full_name,
      email: tenant.email,
      phone: tenant.phone
    } : null
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {lease ? 'Edit Lease' : 'Add New Lease'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
            {/* Flat Selection */}
            <div>
              <Label htmlFor="flat_id">Flat *</Label>
              <Select 
                value={watch('flat_id')} 
                onValueChange={(value) => setValue('flat_id', value)}
              >
                <SelectTrigger suppressHydrationWarning>
                  <SelectValue placeholder="Select a flat" />
                </SelectTrigger>
                <SelectContent>
                  {flats.map((flat) => {
                    const info = getFlatInfo(flat.id)
                    return (
                      <SelectItem key={flat.id} value={flat.id}>
                        {info ? `Flat ${info.flat_number} (Floor ${info.floor}, ${info.bedrooms}BR, $${info.monthly_rent})` : flat.id}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.flat_id && (
                <p className="text-sm text-red-600 mt-1">{errors.flat_id.message}</p>
              )}
            </div>

            {/* Tenant Selection */}
            <div>
              <Label htmlFor="tenant_id">Tenant *</Label>
              <Select 
                value={watch('tenant_id')} 
                onValueChange={(value) => setValue('tenant_id', value)}
              >
                <SelectTrigger suppressHydrationWarning>
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => {
                    const info = getTenantInfo(tenant.id)
                    return (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {info ? `${info.full_name} (${info.email})` : tenant.id}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.tenant_id && (
                <p className="text-sm text-red-600 mt-1">{errors.tenant_id.message}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register('start_date')}
                  suppressHydrationWarning
                />
                {errors.start_date && (
                  <p className="text-sm text-red-600 mt-1">{errors.start_date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register('end_date')}
                  suppressHydrationWarning
                />
                {errors.end_date && (
                  <p className="text-sm text-red-600 mt-1">{errors.end_date.message}</p>
                )}
              </div>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthly_rent">Monthly Rent *</Label>
                <Input
                  id="monthly_rent"
                  type="number"
                  step="0.01"
                  {...register('monthly_rent', { valueAsNumber: true })}
                  suppressHydrationWarning
                />
                {errors.monthly_rent && (
                  <p className="text-sm text-red-600 mt-1">{errors.monthly_rent.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="security_deposit">Security Deposit</Label>
                <Input
                  id="security_deposit"
                  type="number"
                  step="0.01"
                  {...register('security_deposit', { valueAsNumber: true })}
                  suppressHydrationWarning
                />
                {errors.security_deposit && (
                  <p className="text-sm text-red-600 mt-1">{errors.security_deposit.message}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={watch('status')} 
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger suppressHydrationWarning>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} suppressHydrationWarning>
                {isLoading ? "Saving..." : (lease ? "Update Lease" : "Add Lease")}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} suppressHydrationWarning>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 