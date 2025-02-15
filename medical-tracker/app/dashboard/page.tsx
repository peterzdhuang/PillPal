import { Bell, Calendar, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  return (
    <div className="container py-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Medication</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2:00 PM</div>
            <p className="text-xs text-muted-foreground">Metformin 500mg</p>
            <Button className="mt-4 w-full" size="sm">
              Mark as Taken
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <Progress value={67} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">4 of 6 medications taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refills Needed</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Medications running low</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Your medication schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "8:00 AM", name: "Aspirin", taken: true },
                { time: "2:00 PM", name: "Metformin", taken: false },
                { time: "8:00 PM", name: "Vitamin D", taken: false },
              ].map((med, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`h-2 w-2 rounded-full ${med.taken ? "bg-green-500" : "bg-gray-300"}`} />
                    <div>
                      <p className="font-medium">{med.time}</p>
                      <p className="text-sm text-muted-foreground">{med.name}</p>
                    </div>
                  </div>
                  {!med.taken && (
                    <Button variant="outline" size="sm">
                      Take Now
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medication List</CardTitle>
            <CardDescription>Your current medications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Metformin", dosage: "500mg", remaining: 45 },
                { name: "Aspirin", dosage: "81mg", remaining: 60 },
                { name: "Vitamin D", dosage: "2000 IU", remaining: 30 },
              ].map((med, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-muted-foreground">{med.dosage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{med.remaining} pills</p>
                    <p className="text-sm text-muted-foreground">remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

