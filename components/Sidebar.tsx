"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building, Users, CreditCard, FileText, Settings, LogOut, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Flats", href: "/flats", icon: Building },
  { name: "Tenants", href: "/tenants", icon: Users },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Leases", href: "/leases", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

const quickActions = [
  { name: "Add Flat", href: "/flats/add", icon: Plus },
  { name: "Add Tenant", href: "/tenants/add", icon: Plus },
]

export default function Sidebar() {
  const pathname = usePathname()

    return (
    <div className="flex flex-col w-64 bg-gray-900 text-white" suppressHydrationWarning>
      <div className="flex items-center justify-center h-16 bg-gray-800">
        <h1 className="text-xl font-bold">Rental Manager</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}

        <div className="pt-4 mt-4 border-t border-gray-700">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</p>
          <div className="mt-2 space-y-1">
            {quickActions.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
