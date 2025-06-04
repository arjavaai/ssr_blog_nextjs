"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { LogOut, PenTool, Home } from "lucide-react"
import Link from "next/link"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/admin/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <PenTool className="h-6 w-6" />
                Blog Admin
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900">
                <Home size={16} />
                View Site
              </Link>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Welcome, {user.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-2 text-red-600 hover:text-red-800"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
