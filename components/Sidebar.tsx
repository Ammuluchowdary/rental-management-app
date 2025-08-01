"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth-store"
import UserMenu from "./UserMenu"
import { 
  Home, 
  Building, 
  Users, 
  FileText, 
  DollarSign, 
  Settings,
  LogOut,
  Apartment
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Apartments", href: "/apartments", icon: Apartment },
  { name: "Flats", href: "/flats", icon: Building },
  { name: "Tenants", href: "/tenants", icon: Users },
  { name: "Leases", href: "/leases", icon: FileText },
  { name: "Payments", href: "/payments", icon: DollarSign },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  return (
    <div className="flex flex-col w-64 bg-gray-900 text-white" suppressHydrationWarning>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Building className="h-6 w-6 text-blue-400" />
          <span className="text-lg font-semibold">Rental Pro</span>
        </div>
        <UserMenu />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {user && (
              <div>
                <p className="font-medium text-gray-300">{user.name}</p>
                <p className="text-xs">{user.email}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
