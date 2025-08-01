'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/auth-store"
import { LogOut, User, Settings, Shield } from "lucide-react"

export default function UserMenu() {
  const { user, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600'
      case 'manager':
        return 'text-blue-600'
      default:
        return 'text-green-600'
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

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <div className="flex items-center space-x-1 mt-1">
              {getRoleIcon(user.role)}
              <span className={`text-xs font-medium ${getRoleColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 