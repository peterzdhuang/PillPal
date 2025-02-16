'use client'
import type React from "react"
import Link from "next/link"
import { PillIcon, Scan, Users, User } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useGlobalContext } from "@/app/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { user } = useGlobalContext();
  if (!user) {
    return <p>No user logged in</p>; 
  }
  else {
    console.log(user)
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href={`/dashboard/${user}`} className="flex items-center space-x-2">
            <PillIcon className="h-6 w-6" />
            <span className="font-bold">MedTrack</span>
          </Link>
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <Link href={`/dashboard/scan/${user}`}>
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <Scan className="h-4 w-4" />
                <span className="sr-only">Scan</span>
              </Button>
            </Link>
            <Link href={`/dashboard/forum/`}>
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <Users className="h-4 w-4" />
                <span className="sr-only">Forum</span>
              </Button>
            </Link>
            <Link href={`/dashboard/profile/${user}`}>
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <User className="h-4 w-4" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

