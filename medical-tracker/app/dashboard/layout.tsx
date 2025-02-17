"use client";
import type React from "react";
import Link from "next/link";
import {
  PillIcon,
  Users,
  SettingsIcon,
  MessageCircle,
  HeartPulse,
  FileHeart,
  MessageSquareHeartIcon,
  HouseIcon,
  FileIcon,
  LogOutIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/app/layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

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
      {/* Header */}


      {/* Main Content with Sidebar */}
      <div className="flex flex-1">



      
        {/* Sidebar */}
        
        <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-gray-100 p-4">

          <nav className="space-y-2">
            <Link href={`/dashboard/${user}`} className="flex items-center gap-x-2 p-2 rounded hover:bg-primary">
              <PillIcon className="h-6 w-6" />
              <span className="font-bold">PillPal</span>
            </Link>
            {caretaker ? (
              <>
                <Link href={`/dashboard/users`} className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200">
                  <HouseIcon className="h-5 w-5" />
                  <span>CareBoard</span>
                </Link>
                <Link href={`/dashboard/logs`} className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200">
                  <FileIcon className="h-5 w-5" />
                  <span>Logs</span>
                </Link>
                <Link href={`/dashboard/medication`} className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200">
                  <FileHeart className="h-5 w-5" />
                  <span>Learn more</span>
                </Link>
              </>
            ) : (
              <>
                <Link href={`/dashboard/${user}`} className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200">
                  <HouseIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link href={`/dashboard/health`} className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200">
                  <HeartPulse className="h-5 w-5" />
                  <span>Health Tracker</span>
                </Link>
                <Link href={`/dashboard/forum`} className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200">
                  <MessageSquareHeartIcon className="h-5 w-5" />
                  <span>Community</span>
                </Link>
              </>
            )}
            <Link href={`/dashboard/profile/${user}`} className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200">
              <SettingsIcon className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <Link href={`/`} className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200">
              <LogOutIcon className="h-5 w-5" />
              <span>Logout</span>
            </Link>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}