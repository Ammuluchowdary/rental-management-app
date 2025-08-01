"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataStore } from "@/lib/data-store"
import { useRouter } from "next/navigation"

export default function AddTenantForm() {
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    emergency_contact: "",
    emergency_phone: "",
    id_number: "",
    occupation: "",
  })
  const router = useRouter()
  const { addTenant } = useDataStore()

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      addTenant(formData)
      alert("Tenant added successfully!")
      router.push("/tenants")
    } catch (error) {
      console.error("Error adding tenant:", error)
      alert("Error adding tenant. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return null
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Tenant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required suppressHydrationWarning />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} suppressHydrationWarning />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} suppressHydrationWarning />
            </div>

            <div>
              <Label htmlFor="id_number">ID Number</Label>
              <Input id="id_number" name="id_number" value={formData.id_number} onChange={handleChange} suppressHydrationWarning />
            </div>

            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} suppressHydrationWarning />
            </div>

            <div>
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                suppressHydrationWarning
              />
            </div>

            <div>
              <Label htmlFor="emergency_phone">Emergency Phone</Label>
              <Input
                id="emergency_phone"
                name="emergency_phone"
                value={formData.emergency_phone}
                onChange={handleChange}
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} suppressHydrationWarning>
              {loading ? "Adding..." : "Add Tenant"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/tenants")} suppressHydrationWarning>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
