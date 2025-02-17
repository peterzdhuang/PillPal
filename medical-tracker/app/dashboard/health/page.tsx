"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Weight, Heart, Footprints } from 'lucide-react'

type HealthData = {
  date: string;
  bmi?: number;
  systolic?: number;
  diastolic?: number;
  weight?: number;
  steps?: number;
}

export default function Dashboard() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [steps, setSteps] = useState('')
  const [healthData, setHealthData] = useState<HealthData[]>([])

  useEffect(() => {
    const storedData = localStorage.getItem('healthData')
    if (storedData) {
      setHealthData(JSON.parse(storedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('healthData', JSON.stringify(healthData))
  }, [healthData])

  const addHealthData = () => {
    const newData: HealthData = { date: new Date().toLocaleDateString() }

    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100
      const weightInKg = parseFloat(weight)
      newData.bmi = parseFloat((weightInKg / (heightInMeters * heightInMeters)).toFixed(1))
      newData.weight = weightInKg
    }

    if (systolic && diastolic) {
      newData.systolic = parseFloat(systolic)
      newData.diastolic = parseFloat(diastolic)
    }

    if (steps) {
      newData.steps = parseFloat(steps)
    }

    setHealthData([...healthData, newData])
    setHeight('')
    setWeight('')
    setSystolic('')
    setDiastolic('')
    setSteps('')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Senior Health Tracker</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Enter Today's Health Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="height" className="text-lg">Height (cm)</Label>
              <Input 
                id="height" 
                type="number" 
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="weight" className="text-lg">Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="systolic" className="text-lg">Systolic BP</Label>
              <Input 
                id="systolic" 
                type="number" 
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="diastolic" className="text-lg">Diastolic BP</Label>
              <Input 
                id="diastolic" 
                type="number" 
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="steps" className="text-lg">Steps</Label>
              <Input 
                id="steps" 
                type="number" 
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>
          <Button onClick={addHealthData} className="w-full mt-4 text-lg">Save Today's Data</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">BMI</CardTitle>
            <Activity size={24} />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Blood Pressure</CardTitle>
            <Heart size={24} />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="systolic" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Weight</CardTitle>
            <Weight size={24} />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Step Count</CardTitle>
            <Footprints size={24} />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
