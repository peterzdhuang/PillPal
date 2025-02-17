"use client"

import type React from "react"
import Link from "next/link"
import {
  PillIcon,
  Users,
  SettingsIcon,
  MessageCircle,
  HeartPulse,
  FileHeart,
  Weight,
  LayoutDashboard,
} from "lucide-react"

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
    { href: "/dashboard/health", icon: HeartPulse, label: "Health Tracker" },
    { href: "/dashboard/logs", icon: PillIcon, label: "Logs" },
    { href: "/dashboard/medication", icon: FileHeart, label: "Learn More" },
    { href: "/dashboard/lifehabit", icon: Weight, label: "Life Habit" },
    { href: "/dashboard/users", icon: Users, label: "Users" },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Fixed */}
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col fixed h-full justify-between">
        <div>
          <h1 className="text-xl font-bold mb-4">PillPal</h1>
          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <SidebarLink key={link.href} {...link} />
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <SidebarLink href={`/dashboard/profile/${user}`} icon={SettingsIcon} label="Settings" />
        </div>
      </aside>

      {/* Main Content - Scrollable */}
      <main className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  )
}

function SidebarLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link href={href} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800">
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  )
}