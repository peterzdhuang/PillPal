"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/app/layout";
import { Users } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  // Add any other fields as needed
}

export default function UserListPage() {
  const { user } = useGlobalContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Adjust URL to your Django API endpoint
        const response = await axios.get("http://localhost:8000/api/users/");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Error loading user list.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Card className="bg-gradient-to-r from-primary/90 to-primary p-8 rounded-xl shadow-lg text-white">
          <CardHeader>
            <CardTitle className="text-4xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" /> User List
            </CardTitle>
            <p className="mt-2 text-lg">
              Click on a user to view their profile and detailed data.
            </p>
          </CardHeader>
        </Card>

        {/* Users List */}
        <Card className="shadow-sm">
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-500">Loading users...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {users.map((userItem) => (
                  <li key={userItem.id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {userItem.username}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {userItem.email}
                      </p>
                    </div>
                    <Link href={`/dashboard/profile/${userItem.id}`}>
                      <Button className="bg-primary text-white hover:bg-primary/90">
                        View Profile
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
