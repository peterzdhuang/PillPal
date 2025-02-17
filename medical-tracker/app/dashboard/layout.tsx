"use client";
import type React from "react";
import Link from "next/link";
import {
  PillIcon,
  Scan,
  Users,
  SettingsIcon,
  MessageCircle,
  HeartPulse,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/app/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useGlobalContext();
  if (!user) {
    return <p>No user logged in</p>;
  } else {
    console.log(user);
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href={`/dashboard/${user}`} className="flex items-center space-x-2">
            <PillIcon className="h-6 w-6" />
            <span className="font-bold">PillPal</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href={`/dashboard/forum/`}>
              <Button variant="ghost" size="sm" className="px-3 flex items-center gap-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Forum</span>
              </Button>
            </Link>
            <Link href={`/dashboard/profile/${user}`}>
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <SettingsIcon className="h-4 w-4" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-gray-100 p-4">
          <nav className="space-y-2">
            <Link
              href={`/dashboard/${user}`}
              className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200"
            >
              <PillIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href={`/dashboard/medications`}
              className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200"
            >
              <PillIcon className="h-5 w-5" />
              <span>Medications</span>
            </Link>
            <Link
              href={`/dashboard/health-tracker`}
              className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200"
            >
              <HeartPulse className="h-5 w-5" />
              <span>Health Tracker</span>
            </Link>
            <Link
              href={`/dashboard/scan`}
              className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200"
            >
              <Scan className="h-5 w-5" />
              <span>Scan</span>
            </Link>
            <Link
              href={`/dashboard/users`}
              className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200"
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
            <Link
              href={`/dashboard/settings`}
              className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200"
            >
              <SettingsIcon className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
