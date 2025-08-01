'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/auth-store"
import { User, Mail, Shield, Calendar, Settings as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)

  if (!user) return null

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'manager':
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Full Name</Label>
                <p className="text-sm text-muted-foreground">{user.name}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>

            <div>
              <Label className="text-sm font-medium">Email Address</Label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Role</Label>
              <div className="flex items-center gap-2 mt-1">
                {getRoleIcon(user.role)}
                <Badge className={getRoleColor(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Member Since</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>

            {isEditing && (
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                <Button className="w-full">Save Changes</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Change Password</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Update your account password
              </p>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>

            <div>
              <Label className="text-sm font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>

            <div>
              <Label className="text-sm font-medium">Notification Preferences</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Manage your email and push notifications
              </p>
              <Button variant="outline" size="sm">
                Configure Notifications
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Application Version</Label>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Last Login</Label>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleString()}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Account Status</Label>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Export Data</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Download your rental data as CSV or PDF
              </p>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>

            <div>
              <Label className="text-sm font-medium">Backup Settings</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Create a backup of your current settings
              </p>
              <Button variant="outline" size="sm">
                Create Backup
              </Button>
            </div>

            <div>
              <Label className="text-sm font-medium text-red-600">Danger Zone</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Permanently delete your account and all data
              </p>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
