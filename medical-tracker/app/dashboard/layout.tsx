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
  FileHeart,
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useGlobalContext();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/patients/${user.user}`);
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error('Error fetching caretaker users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.user]);
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
              href={`/dashboard/health`}
              className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200"
            >
              <HeartPulse className="h-5 w-5" />
              <span>Health Tracker</span>
            </Link>
            <Link
              href={`/dashboard/logs`}
              className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200"
            >
              <PillIcon className="h-5 w-5" />
              <span>Logs</span>
            </Link>
            <Link
              href={`/dashboard/medication`}
              className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200"
            >
              <FileHeart className="h-5 w-5" />
              <span>Medication Details</span>
            </Link>
            <Link
              href={`/dashboard/users`}
              className="flex items-center gap-x-2 p-2 rounded hover:bg-gray-200"
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
            <Link
              href={`/dashboard/profile/${user}`}
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
