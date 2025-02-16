"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Calendar, PlusCircle, Pill, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGlobalContext } from "@/app/layout"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"

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

  const [error, setError] = useState("");
  const [showRedirect, setShowRedirect] = useState(false);
  
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/medications/${user.user}`);
        setMedications(response.data);
      } catch (err) {
        setError("Failed to fetch medications");
        setShowRedirect(true);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMedications();
  }, [user.user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    )
    if (error) {
        return (
          <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-red-500 mb-4">{error}</p>
            {showRedirect && (
              <Link href={`/dashboard/scan/${user.user}`}>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
                </Button>
              </Link>
            )}
          </div>
        );
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
    
    <div className="container mx-auto px-4 py-10">
        
      {/* Dashboard Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Medication Dashboard</h1>
        <Link href={`/dashboard/scan/${user.user}`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Medication Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Medication Overview</CardTitle>
              <CardDescription>Your current medication status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pillCountData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pills" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Today's Schedule Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayMedications.length} Medications</div>
              <p className="text-xs text-muted-foreground">
                {todayMedications.length === 0 ? "No medications scheduled for today" : "Scheduled for today"}
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Schedule Card */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-blue-500" />
                <CardTitle>Upcoming Schedule</CardTitle>
              </div>
              <CardDescription>Today's medications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayMedications.length === 0 ? (
                <p className="text-muted-foreground">No scheduled medications for today.</p>
              ) : (
                todayMedications.map((med, index) => (
                  <div
                    key={med.id || index}
                    className="flex items-center justify-between space-x-4 rounded-md border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{med.pillName}</p>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-muted-foreground">{med.date}</div>
                      <Button size="sm">Take Now</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div>
          {/* Medication Details Card */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pill className="h-6 w-6 text-green-500" />
                <CardTitle>Medication Details</CardTitle>
              </div>
              <CardDescription>Your current prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>
                <TabsContent value="list" className="space-y-4">
                  {medications.map((med, index) => (
                    <div
                      key={med.id || index}
                      className="flex items-center justify-between space-x-4 rounded-md border p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{med.pillName}</p>
                        <p className="text-sm text-muted-foreground">{med.pharmacyName}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <p>{med.numberOfPills} pills</p>
                          <p>{med.refills} refills</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Refill
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="grid" className="grid gap-4 md:grid-cols-2">
                  {medications.map((med, index) => (
                    <Card key={med.id || index}>
                      <CardHeader>
                        <CardTitle>{med.pillName}</CardTitle>
                        <CardDescription>{med.pharmacyName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Pills remaining:</span>
                            <span>{med.numberOfPills}</span>
                          </div>
                          <Progress value={(med.numberOfPills / 30) * 100} className="h-2" />
                          <div className="flex justify-between items-center">
                            <Badge variant={med.refills > 0 ? "secondary" : "destructive"}>
                              {med.refills} refill{med.refills !== 1 && "s"}
                            </Badge>
                            <Button variant="outline" size="sm">
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
    </div>
  )
}

