"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AddFlatForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    flat_number: "",
    floor: "",
    bedrooms: "",
    bathrooms: "",
    area_sqft: "",
    monthly_rent: "",
    status: "vacant",
    description: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const flatData = {
        ...formData,
        floor: Number.parseInt(formData.floor),
        bedrooms: Number.parseInt(formData.bedrooms),
        bathrooms: Number.parseInt(formData.bathrooms),
        area_sqft: Number.parseInt(formData.area_sqft),
        monthly_rent: Number.parseFloat(formData.monthly_rent),
      }

      const { data, error } = await supabase.from("flats").insert([flatData]).select()

      if (error) throw error

      alert("Flat added successfully!")
      router.push("/flats")
      router.refresh()
    } catch (error) {
      console.error("Error adding flat:", error)
      alert("Error adding flat. Please try again.")
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Flat</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="flat_number">Flat Number *</Label>
              <Input
                id="flat_number"
                name="flat_number"
                value={formData.flat_number}
                onChange={handleChange}
                placeholder="e.g., 101, 202"
                required
              />
            </div>

            <div>
              <Label htmlFor="floor">Floor *</Label>
              <Input
                id="floor"
                name="floor"
                type="number"
                min="1"
                value={formData.floor}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="area_sqft">Area (sq ft)</Label>
              <Input
                id="area_sqft"
                name="area_sqft"
                type="number"
                min="1"
                value={formData.area_sqft}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="monthly_rent">Monthly Rent ($) *</Label>
              <Input
                id="monthly_rent"
                name="monthly_rent"
                type="number"
                step="0.01"
                min="0"
                value={formData.monthly_rent}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacant">Vacant</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., 2BHK with balcony and garden view"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Flat"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/flats")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
