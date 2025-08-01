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
import { useDataStore } from "@/lib/data-store"
import { Calendar, DollarSign, AlertTriangle } from "lucide-react"

const paymentSchema = z.object({
  lease_id: z.string().min(1, "Lease is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  due_date: z.string().min(1, "Due date is required"),
  payment_method: z.enum(["bank_transfer", "cash", "check", "online"]),
  status: z.enum(["pending", "paid", "overdue"]),
  notes: z.string().optional(),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentFormProps {
  payment?: any
  onClose: () => void
  onSuccess: () => void
}

export default function PaymentForm({ payment, onClose, onSuccess }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { addPayment, updatePayment, leases, flats, tenants } = useDataStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: payment ? {
      lease_id: payment.lease_id,
      amount: payment.amount,
      due_date: payment.due_date,
      payment_method: payment.payment_method,
      status: payment.status,
      notes: payment.notes || "",
    } : {
      amount: 0,
      payment_method: "bank_transfer",
      status: "pending",
      notes: "",
    }
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onSubmit = async (data: PaymentFormData) => {
    setIsLoading(true)
    try {
      if (payment) {
        updatePayment(payment.id, data)
      } else {
        addPayment(data)
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving payment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getLeaseInfo = (leaseId: string) => {
    const lease = leases.find(l => l.id === leaseId)
    if (!lease) return null
    
    const flat = flats.find(f => f.id === lease.flat_id)
    const tenant = tenants.find(t => t.id === lease.tenant_id)
    
    return {
      flat_number: flat?.flat_number || 'N/A',
      tenant_name: tenant?.full_name || 'N/A',
      monthly_rent: lease.monthly_rent
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {payment ? 'Edit Payment' : 'Add New Payment'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
            {/* Lease Selection */}
            <div>
              <Label htmlFor="lease_id">Lease *</Label>
              <Select 
                value={watch('lease_id')} 
                onValueChange={(value) => setValue('lease_id', value)}
              >
                <SelectTrigger suppressHydrationWarning>
                  <SelectValue placeholder="Select a lease" />
                </SelectTrigger>
                <SelectContent>
                  {leases.map((lease) => {
                    const info = getLeaseInfo(lease.id)
                    return (
                      <SelectItem key={lease.id} value={lease.id}>
                        {info ? `${info.flat_number} - ${info.tenant_name} ($${info.monthly_rent})` : lease.id}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.lease_id && (
                <p className="text-sm text-red-600 mt-1">{errors.lease_id.message}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                suppressHydrationWarning
              />
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                {...register('due_date')}
                suppressHydrationWarning
              />
              {errors.due_date && (
                <p className="text-sm text-red-600 mt-1">{errors.due_date.message}</p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <Label htmlFor="payment_method">Payment Method *</Label>
              <Select 
                value={watch('payment_method')} 
                onValueChange={(value) => setValue('payment_method', value as any)}
              >
                <SelectTrigger suppressHydrationWarning>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                </SelectContent>
              </Select>
              {errors.payment_method && (
                <p className="text-sm text-red-600 mt-1">{errors.payment_method.message}</p>
              )}
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                rows={3}
                placeholder="Additional notes about this payment..."
                suppressHydrationWarning
              />
              {errors.notes && (
                <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} suppressHydrationWarning>
                {isLoading ? "Saving..." : (payment ? "Update Payment" : "Add Payment")}
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