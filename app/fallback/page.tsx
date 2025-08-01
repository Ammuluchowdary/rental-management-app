'use client'

import { useState } from "react"

export default function FallbackDashboard() {
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  })

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {greeting}, Guest! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome to your rental management dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm">
              Guest
            </span>
          </div>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Fallback Dashboard:</strong> This is a fallback page that doesn't use any stores.
          </p>
        </div>
      </div>

      {/* Simple Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold">Total Properties</h3>
          <p className="text-2xl font-bold text-blue-600">20</p>
          <p className="text-sm text-gray-600">All rental properties</p>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold">Occupied Units</h3>
          <p className="text-2xl font-bold text-green-600">10</p>
          <p className="text-sm text-gray-600">Currently rented</p>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-purple-600">$8,450</p>
          <p className="text-sm text-gray-600">Collected this month</p>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold">Pending Payments</h3>
          <p className="text-2xl font-bold text-orange-600">3</p>
          <p className="text-sm text-gray-600">Awaiting collection</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Troubleshooting</h3>
        <p className="text-yellow-700 mb-4">
          If you're seeing this fallback page, it means the main dashboard is having issues with data loading.
        </p>
        <div className="space-y-2 text-sm text-yellow-700">
          <p>• Try refreshing the page</p>
          <p>• Check the browser console for errors</p>
          <p>• Clear browser cache and localStorage</p>
          <p>• Try accessing the main dashboard at <a href="/" className="underline">/</a></p>
        </div>
      </div>
    </div>
  )
} 