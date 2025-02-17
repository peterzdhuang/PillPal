"use client";
import type React from "react";
import Link from "next/link";
import { Pill, Users, Settings, MessageCircle, Activity, FileText, BarChart2, LayoutDashboard, LogOutIcon, MessageSquareHeartIcon, HeartPulse, HouseIcon, FileHeart, FileIcon, PillIcon } from 'lucide-react'

import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/app/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLanguageContext  } from '@/app/layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
const { changeLanguage } = useLanguageContext();
  // Caretaker data & caretaker email input
  const [caretaker, setCaretaker] = useState<any>(null)
  const [caretakerEmail, setCaretakerEmail] = useState<string>("")

  // Grab the currently logged-in user ID from context
  const { user } = useGlobalContext()

  // Fetch caretaker data via GET /api/caretaker/<user_id>/
  useEffect(() => {
    if (!user) return

    axios
      .get(`http://localhost:8000/api/caretaker/${user}/`)
      .then((response) => {
        console.log("Fetched caretaker data:", response.data)
        // If caretaker exists, store it
        setCaretaker(response.data)
        // Also set caretakerEmail to the caretaker's email
        if (response.data && response.data.email) {
          setCaretakerEmail(response.data.email)
        }
      })
      .catch((error) => {
        // If there's no caretaker assigned, your API might return 404 or a custom response
        console.error("Error fetching caretaker data:", error)
      })
  }, [user])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r text-gray-600 flex h-fullbg-white p-4 shadow-md">
            <nav className="space-y-2 flex-grow">
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-14 items-center justify-between">
                        <Link href={`/`} className="flex items-center space-x-2">
                            <PillIcon className="h-7 w-7 text-[#21b4a5]" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#21b4a5] to-[#21b4a5]/70">PillPal</span>
                        </Link>
                    </div>
                </header>
                {caretaker ? (
                <>
                    <SidebarLink href={`/dashboard/users`} icon={HouseIcon} label="CareBoard" />                      
                    <SidebarLink href={`/dashboard/logs`} icon={FileIcon} label="Logs" />  
                    <SidebarLink href={`/dashboard/forum`} icon={MessageSquareHeartIcon} label="Community" />
                    <SidebarLink href={`/dashboard/medication`} icon={FileHeart} label="Learn More" />                    
                </>
                ) : (
                <>
                    <SidebarLink href={`/dashboard/${user}`} icon={HouseIcon} label="Dashboard" />                    
                    <SidebarLink href={`/dashboard/health`} icon={HeartPulse} label="Health Tracker" />
                    <SidebarLink href={`/dashboard/forum`} icon={MessageSquareHeartIcon} label="Community" />
                </>
                )}
                <SidebarLink href={`/dashboard/profile/${user}`} icon={Settings} label="Settings" />
                <SidebarLink href={`/`} icon={LogOutIcon} label="Logout" />

            </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-y-auto h-screen flex flex-col bg-white">  
            <div className="flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
    return (
      <Link href={href} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200">
        <Icon className="w-5 h-5 text-[#21b4a5]" />
        <span className="text-gray-700 flex-grow">{label}</span>
      </Link>
    )
  }