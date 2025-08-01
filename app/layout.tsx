import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/Sidebar"
import ErrorBoundary from "@/components/ErrorBoundary"
import AuthGuard from "@/components/AuthGuard"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rental Management Pro",
  description: "Professional rental property management system",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <AuthGuard>
            <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                <div className="p-6">{children}</div>
              </main>
            </div>
          </AuthGuard>
        </ErrorBoundary>
      </body>
    </html>
  )
}
