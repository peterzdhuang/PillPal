"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Users,
  Mail,
  Phone,
  Shield,
  Bell,
  Image as ImageIcon,
  ClipboardList,
  AlertCircle,
  Badge,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Pill,
  Clock,
  Package,
  ClipboardIcon,
  Clipboard,
  Heart,
  Activity,
  Footprints,
  Weight,
} from "lucide-react"
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  is_caretaker: boolean
  password: string
  image: string | null
  notifications: number
  caretaker_email: string
}
const fakeUsers: User[] = [
  { id: 1, first_name: "John", last_name: "Doe", email: "john@example.com", phone: "123-456-7890", is_caretaker: true, password: "", image: null, notifications: 5, caretaker_email: "caretaker@example.com" },
  { id: 2, first_name: "Jane", last_name: "Smith", email: "jane@example.com", phone: "987-654-3210", is_caretaker: false, password: "", image: null, notifications: 2, caretaker_email: "caretaker@example.com" },
  { id: 3, first_name: "Michael", last_name: "Brown", email: "michael@example.com", phone: "555-123-4567", is_caretaker: false, password: "", image: null, notifications: 3, caretaker_email: "caretaker@example.com" },
  { id: 4, first_name: "Emily", last_name: "Davis", email: "emily@example.com", phone: "444-987-6543", is_caretaker: false, password: "", image: null, notifications: 4, caretaker_email: "caretaker@example.com" },
  { id: 5, first_name: "Robert", last_name: "Johnson", email: "robert@example.com", phone: "222-555-7777", is_caretaker: false, password: "", image: null, notifications: 1, caretaker_email: "caretaker@example.com" },
]
const healthData = [
  { date: "2024-02-01", bmi: 22.5, systolic: 120, diastolic: 80, weight: 70, steps: 8000 },
  { date: "2024-02-02", bmi: 22.7, systolic: 122, diastolic: 82, weight: 70.2, steps: 7500 },
  { date: "2024-02-03", bmi: 22.8, systolic: 118, diastolic: 78, weight: 70.4, steps: 8200 },
  { date: "2024-02-04", bmi: 22.6, systolic: 121, diastolic: 79, weight: 70.1, steps: 7800 },
  { date: "2024-02-05", bmi: 22.9, systolic: 125, diastolic: 85, weight: 70.6, steps: 8100 },
];

interface Medication {
  id: number
  user: number | string
  pillName: string
  dosage: string | null
  frequency: string | null
  firstDose: string | null
  secondDose: string | null
  numberOfPills: number | null
  lastTaken?: string
  refills: number
  directions: string | null
  date: string | null
}
const fakeMedications: Medication[] = [
  { id: 1, user: 1, pillName: "Aspirin", dosage: "100mg", frequency: "Daily", firstDose: "08:00", secondDose: null, numberOfPills: 30, refills: 2, directions: "Take with water", date: "2025-02-01" },
  { id: 2, user: 2, pillName: "Lipitor", dosage: "20mg", frequency: "Daily", firstDose: "09:00", secondDose: null, numberOfPills: 30, refills: 1, directions: "After meal", date: "2025-02-02" },
  { id: 3, user: 3, pillName: "Metformin", dosage: "500mg", frequency: "Twice daily", firstDose: "07:00", secondDose: "19:00", numberOfPills: 60, refills: 3, directions: "Take with food", date: "2025-02-03" },
  { id: 4, user: 4, pillName: "Ibuprofen", dosage: "200mg", frequency: "Every 6 hours", firstDose: "10:00", secondDose: "16:00", numberOfPills: 20, refills: 2, directions: "Take with meal", date: "2025-02-04" },
  { id: 5, user: 5, pillName: "Paracetamol", dosage: "500mg", frequency: "Every 8 hours", firstDose: "07:00", secondDose: "15:00", numberOfPills: 40, refills: 1, directions: "Take after food", date: "2025-02-05" },
  { id: 1, user: 3, pillName: "Aspirin", dosage: "100mg", frequency: "Daily", firstDose: "08:00", secondDose: null, numberOfPills: 30, refills: 2, directions: "Take with water", date: "2025-02-01" },
  { id: 2, user: 1, pillName: "Lipitor", dosage: "20mg", frequency: "Daily", firstDose: "09:00", secondDose: null, numberOfPills: 30, refills: 1, directions: "After meal", date: "2025-02-02" },
  { id: 3, user: 1, pillName: "Metformin", dosage: "500mg", frequency: "Twice daily", firstDose: "07:00", secondDose: "19:00", numberOfPills: 60, refills: 3, directions: "Take with food", date: "2025-02-03" },
  { id: 4, user: 2, pillName: "Ibuprofen", dosage: "200mg", frequency: "Every 6 hours", firstDose: "10:00", secondDose: "16:00", numberOfPills: 20, refills: 2, directions: "Take with meal", date: "2025-02-04" },
  { id: 5, user: 2, pillName: "Paracetamol", dosage: "500mg", frequency: "Every 8 hours", firstDose: "07:00", secondDose: "15:00", numberOfPills: 40, refills: 1, directions: "Take after food", date: "2025-02-05" },
  
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function AnalyticsPage() {
  
  const [users, setUsers] = useState<User[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API calls for users and medications
    setLoading(true)
    setTimeout(() => {
      setUsers(fakeUsers)
      setMedications(fakeMedications)
      setLoading(false)
    }, 1000)
  }, [])
  const urgentNotifications = users.reduce((acc, user) => {
    const userMeds = medications.filter((med) => med.user === user.id)
  
    userMeds.forEach((med) => {
      // Check for low refills
      if (med.refills <= 1) {
        acc.push({
          id: `refill-${user.id}-${med.id}`,
          message: `${user.first_name} ${user.last_name} is running low on ${med.pillName} (${med.dosage}). Refill needed!`,
        })
      }
  
      // Check for missed doses (assuming lastTaken is required)
      if (!med.lastTaken) {
        if (med.firstDose) {
          acc.push({
            id: `missed-${user.id}-${med.id}-first`,
            message: `${user.first_name} ${user.last_name} missed the ${med.firstDose} ${med.pillName} (${med.dosage}) pill today.`,
          })
        }
        if (med.secondDose) {
          acc.push({
            id: `missed-${user.id}-${med.id}-second`,
            message: `${user.first_name} ${user.last_name} missed the ${med.secondDose} ${med.pillName} (${med.dosage}) pill today.`,
          })
        }
      }
    })
  
    return acc
  }, [] as { id: string; message: string }[])
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    )
  }
  // Summary calculations
  const caretakerCount = users.filter((user) => user.is_caretaker).length
  const notificationsData = users.map((user) => ({
    name: user.first_name,
    notifications: user.notifications,
  }))
  const medicationsPerUser = users.map((user) => ({
    name: user.first_name,
    count: medications.filter((med) => med.user === user.id).length,
  }))

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    )
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === users.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? users.length - 1 : prevIndex - 1
    );
  };

  const currentUser = users[currentIndex];
  const userNotifications = urgentNotifications.filter((notification) =>
    notification.id.includes(`-${currentUser.id}-`)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 md:p-8">
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
              <Card className="bg-gradient-to-r from-primary/90 to-primary shadow-lg">
                <CardHeader className="p-8">
                  <CardTitle className="text-4xl font-bold flex items-center gap-3 text-primary-foreground">
                    <Users className="h-10 w-10" /> Nursing Home Analytics
                  </CardTitle>
                  <p className="mt-2 text-lg text-primary-foreground/90">
                    Overview of patients, notifications, and medications
                  </p>
                </CardHeader>
              </Card>
              <Card className="shadow-md overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Patient Details</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevSlide}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} / {users.length}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextSlide}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-lg font-semibold">
                    {currentUser.first_name} {currentUser.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications:
                  </p>
                  {currentUser.image && (
                    <p className="text-sm text-muted-foreground flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Profile Picture Available
                    </p>
                  )}
                </div>

                {/* Urgent Notifications */}
                {userNotifications.length > 0 && (
                  <div className="space-y-3">
                    <ul className="space-y-2">
                      {userNotifications.map((notification) => (
                        <li
                          key={notification.id}
                          className="bg-destructive/10 text-destructive rounded-md p-3 text-sm"
                        >
                          {notification.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {medications.length > 0 && (
                  <div className="mt-4 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Medications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {medications.filter((med) => med.user === currentUser.id)
                      .map((med) => (
                        <Card key={med.id} className="border shadow-sm">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-semibold flex items-center">
                                <Pill className="h-5 w-5 mr-2 text-primary" />
                                {med.pillName}
                              </p>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-md ${
                                  med.refills <= 1
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {med.refills <= 1 ? "Low Refill" : "Sufficient Refills"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <ClipboardList className="inline h-4 w-4 mr-1" />
                              <strong> Dosage:</strong> {med.dosage || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <Clock className="inline h-4 w-4 mr-1" />
                              <strong> Frequency:</strong> {med.frequency || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <ClipboardIcon className="inline h-4 w-4 mr-1"/>
                              <strong> Directions:</strong> {med.directions || "No directions"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <Package className="inline h-4 w-4 mr-1" />
                              <strong> Quantity:</strong> {med.numberOfPills ?? "Unknown"}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
     
        </div>
        <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-2xl font-bold">Health Metrics</CardTitle>
    <Activity size={24} />
  </CardHeader>
  <CardContent>
    {healthData.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BMI Chart */}
        <div className="h-[300px]">
          <h3 className="text-xl font-semibold">BMI</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bmi" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Blood Pressure Chart */}
        <div className="h-[300px]">
          <h3 className="text-xl font-semibold">Blood Pressure</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="systolic" stroke="#ff7300" strokeWidth={2} />
              <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weight Chart */}
        <div className="h-[300px]">
          <h3 className="text-xl font-semibold">Weight</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Step Count Chart */}
        <div className="h-[300px]">
          <h3 className="text-xl font-semibold">Step Count</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="steps" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    ) : (
      <p>Loading chart data...</p>
    )}
  </CardContent>
</Card>



      </div>
    </div>
  )
}
