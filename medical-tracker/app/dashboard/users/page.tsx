"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGlobalContext } from "@/app/layout"
import { Users, User as IconUser, Loader2, AlertCircle } from "lucide-react"

interface User {
  id: number
  first_name: string
  last_name: string
}

export default function UserListPage() {
  const { user } = useGlobalContext()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:8000/api/caretaker/patients/${user}`)
        setUsers(response.data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch users. Please try again later.")
        console.error("Error fetching caretaker users:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Card className="bg-gradient-to-r from-primary/90 to-primary p-8 rounded-xl shadow-lg text-white">
          <CardHeader>
            <CardTitle className="text-4xl font-bold flex items-center gap-3">
              <Users className="h-10 w-10" /> User List
            </CardTitle>
            <p className="mt-2 text-lg opacity-90">
              Manage and view detailed information for your patients.
            </p>
          </CardHeader>
        </Card>

        {/* Users List */}
        <Card className="shadow-md overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-gray-600">Loading users...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 text-red-600">
                <AlertCircle className="h-8 w-8 mr-2" />
                <p>{error}</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {users.map((userItem) => (
                  <li
                    key={userItem.id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <IconUser className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-800">
                            {userItem.first_name} {userItem.last_name}
                          </p>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Link href={`/dashboard/profile/${userItem.id}`}>
                          <Button
                            variant="outline"
                            className="hover:bg-primary hover:text-white transition-colors"
                          >
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/dashboard/${userItem.id}`}>
                          <Button className="bg-primary text-white hover:bg-primary/90">
                            View Dashboard
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
