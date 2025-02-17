"use client"

import type React from "react"
import Link from "next/link"
import { Pill, Users, Settings, MessageCircle, Activity, FileText, BarChart2, LayoutDashboard } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { useGlobalContext } from "@/app/layout"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useGlobalContext()

  if (!user) {
    return <div>No user logged in</div>
  }

  const sidebarLinks = [
    { href: `/dashboard/${user}`, icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/health", icon: Activity, label: "Health Tracker" },
    { href: "/dashboard/logs", icon: Pill, label: "Logs" },
    { href: "/dashboard/medication", icon: FileText, label: "Learn More" },
    { href: "/dashboard/lifehabit", icon: BarChart2, label: "Life Habit" },
    { href: "/dashboard/users", icon: Users, label: "Users" },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Fixed */}
      <aside className="w-64 bg-white text-gray-600 p-4 flex flex-col fixed h-full justify-between shadow-md">
        <div>
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Pill className="h-7 w-7 text-[#21b4a5]" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#21b4a5] to-[#21b4a5]/70">
              PillPal
            </span>
          </Link>
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <SidebarLink key={link.href} {...link} />
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <SidebarLink href={`/dashboard/profile/${user}`} icon={Settings} label="Settings" />
        </div>
      </aside>

      {/* Main Content - Scrollable */}
      <main className="flex-1 ml-64 p-6 overflow-y-auto h-screen flex flex-col bg-gray-50">  
        <div className="flex-1">{children}</div>
      </main>
    </div>
  )
}

function SidebarLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link href={href} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200">
      <Icon className="w-5 h-5 text-[#21b4a5]" />
      <span className="text-gray-700">{label}</span>
    </Link>
  )
}