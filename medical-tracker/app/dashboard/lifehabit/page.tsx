"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Weight, Heart, Footprints } from 'lucide-react'
import {TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type HealthData = {
    date: string;
    bmi?: number;
    systolic?: number;
    diastolic?: number;
    weight?: number;
    steps?: number;
  }

export default function HealthTrackerPage() {
  // Form fields
  const [age, setAge] = useState<number | "">("");
  const [bmi, setBmi] = useState<number | "">("");
  const [bloodPressure, setBloodPressure] = useState(""); // e.g., "120/80"
  const [sleepHours, setSleepHours] = useState<number | "">("");
  const [dietQuality, setDietQuality] = useState<number | "">(""); // scale 1–5
  const [dailySteps, setDailySteps] = useState<number | "">("");
  const [mood, setMood] = useState<number | "">(""); // scale 1–10
  

  const [healthData, setHealthData] = useState<HealthData[]>([])
  useEffect(() => {
    const storedData = localStorage.getItem('healthData')
    if (storedData) {
      setHealthData(JSON.parse(storedData))
    } else {
      const generateFakeData = () => {
        const fakeData: HealthData[] = []
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 7) 
  
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate)
          date.setDate(startDate.getDate() + i)
          
          const weight = 70 + Math.random() * 4 - 2 // Random between 68-72kg
          const height = 170 // Average height in cm
          const bmi = parseFloat((weight / parseFloat(((height / 100) ** 2).toFixed(1))).toFixed(1));

          
          fakeData.push({
            date: date.toLocaleDateString(),
            bmi,
            weight: parseFloat(weight.toFixed(1)),
            systolic: 120 + Math.floor(Math.random() * 10), // 120-130
            diastolic: 80 + Math.floor(Math.random() * 5),  // 80-85
            steps: 3000 + Math.floor(Math.random() * 5000),  // 3000-8000 steps
          });
        }
        return fakeData
      }
  
      const initialData = generateFakeData()
      setHealthData(initialData)
      localStorage.setItem('healthData', JSON.stringify(initialData))
    }
  }, [])


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Card className="bg-gradient-to-r from-primary/90 to-primary shadow-lg text-white">
          <CardHeader>
            <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
              <span className="text-3xl font-bold">Health Tracker</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90">
              Enter your health metrics to see where you stand and set a goal.
            </p>
          </CardContent>
        </Card>

        {/* Input Form */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Your Health Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="age" className="text-sm text-gray-500">
                  Age
                </label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                  placeholder="e.g. 29"
                />
              </div>
              {/* BMI */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="bmi" className="text-sm text-gray-500">
                  Body Mass Index (BMI)
                </label>
                <Input
                  id="bmi"
                  type="number"
                  value={bmi}
                  onChange={(e) => setBmi(e.target.value ? Number(e.target.value) : "")}
                  placeholder="e.g. 22.5"
                />
              </div>
              {/* Blood Pressure */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="bloodPressure" className="text-sm text-gray-500">
                  Blood Pressure
                </label>
                <Input
                  id="bloodPressure"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder='e.g. "120/80"'
                />
              </div>
              {/* Sleep */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="sleepHours" className="text-sm text-gray-500">
                  Sleep (hours per night)
                </label>
                <Input
                  id="sleepHours"
                  type="number"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value ? Number(e.target.value) : "")}
                  placeholder="e.g. 7"
                />
              </div>
              {/* Daily Steps */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="dailySteps" className="text-sm text-gray-500">
                  Daily Steps
                </label>
                <Input
                  id="dailySteps"
                  type="number"
                  value={dailySteps}
                  onChange={(e) =>
                    setDailySteps(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="e.g. 8000"
                />
              </div>
              {/* Mood */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="mood" className="text-sm text-gray-500">
                  Mood (1–10)
                </label>
                <Input
                  id="mood"
                  type="number"
                  value={mood}
                  onChange={(e) => setMood(e.target.value ? Number(e.target.value) : "")}
                  placeholder="1 = unhappy, 10 = excellent mood"
                />
              </div>
            </div>

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
    </div>
  );
}