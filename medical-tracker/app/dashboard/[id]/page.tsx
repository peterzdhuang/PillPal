"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Calendar, PlusCircle, Pill, RefreshCcw, Clock, TrendingUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGlobalContext } from "@/app/layout"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Medication {
  id?: number
  user: string
  pharmacyName: string
  pharmacyAddress: string
  pillName: string
  date: string
  numberOfPills: number
  frequency: string
  directions: string
  refills: number
}

export default function DashboardPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const user = useGlobalContext()
  const [error, setError] = useState("")
  const [showRedirect, setShowRedirect] = useState(false)

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/medications/${user.user}`)
        setMedications(response.data)
      } catch (err) {
        setError("Failed to fetch medications")
        setShowRedirect(true)
      } finally {
        setLoading(false)
      }
    }

    fetchMedications()
  }, [user.user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-lg text-muted-foreground">Loading your medications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Alert variant="destructive" className="mb-6 max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        {showRedirect && (
          <Link href={`/dashboard/scan/${user.user}`}>
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Your First Medication
            </Button>
          </Link>
        )}
      </div>
    )
  }

  const todayMedications = medications.filter((med) => {
    const medDate = new Date(med.date)
    const today = new Date()
    return medDate.toDateString() === today.toDateString()
  })

  const pillCountData = medications.map((med) => ({
    name: med.pillName,
    pills: med.numberOfPills,
  }))

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Medication Dashboard</h1>
            <p className="text-muted-foreground">Track and manage your medications in one place</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Set Reminder
            </Button>
            <Link href={`/dashboard/scan/${user.user}`}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{todayMedications.length}</div>
              <p className="text-sm text-blue-600/80">Medications today</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Medications</CardTitle>
              <Pill className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{medications.length}</div>
              <p className="text-sm text-green-600/80">Active prescriptions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Adherence Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{Math.floor((todayMedications.length / medications.length) * 100) || 100}%</div>
              <p className="text-sm text-purple-600/80">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Medication Overview Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Medication Stock</CardTitle>
              <CardDescription>Current pill count per medication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pillCountData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="pills" 
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>
                    {todayMedications.length} medications scheduled for today
                  </CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayMedications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No medications scheduled for today</p>
                  </div>
                ) : (
                  todayMedications.map((med, index) => (
                    <div
                      key={med.id || index}
                      className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Pill className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{med.pillName}</p>
                          <p className="text-sm text-muted-foreground">{med.frequency}</p>
                        </div>
                      </div>
                      <Button size="sm" className="shadow-sm">Take Now</Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medication Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Medication Details</CardTitle>
                <CardDescription>Manage your current prescriptions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="space-y-4">
                {medications.map((med, index) => (
                  <div
                    key={med.id || index}
                    className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Pill className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{med.pillName}</p>
                        <p className="text-sm text-muted-foreground">{med.pharmacyName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-right">
                        <p className="font-medium">{med.numberOfPills} pills left</p>
                        <p className="text-muted-foreground">{med.refills} refills remaining</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={med.refills > 0 ? 'hover:bg-green-50 hover:text-green-600 hover:border-green-200' : 'opacity-50 cursor-not-allowed'}
                        disabled={med.refills === 0}
                      >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Refill
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="grid" className="grid gap-6 md:grid-cols-2">
                {medications.map((med, index) => (
                  <Card key={med.id || index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Pill className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{med.pillName}</CardTitle>
                          <CardDescription>{med.pharmacyName}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pills remaining:</span>
                            <span className="font-medium">{med.numberOfPills}</span>
                          </div>
                          <Progress 
                            value={(med.numberOfPills / 30) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge 
                            variant={med.refills > 0 ? "secondary" : "destructive"}
                            className="rounded-lg"
                          >
                            {med.refills} refill{med.refills !== 1 && "s"}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={med.refills > 0 ? 'hover:bg-green-50 hover:text-green-600 hover:border-green-200' : 'opacity-50 cursor-not-allowed'}
                            disabled={med.refills === 0}
                          >
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Refill
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}