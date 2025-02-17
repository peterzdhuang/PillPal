"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HeartPulse,
  Smile,
  CloudMoon,
  Activity,
  AlertCircle,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function HealthTrackerPage() {
  // Form fields
  const [age, setAge] = useState<number | "">("");
  const [bmi, setBmi] = useState<number | "">("");
  const [bloodPressure, setBloodPressure] = useState(""); // e.g., "120/80"
  const [sleepHours, setSleepHours] = useState<number | "">("");
  const [dietQuality, setDietQuality] = useState<number | "">(""); // scale 1–5
  const [dailySteps, setDailySteps] = useState<number | "">("");
  const [mood, setMood] = useState<number | "">(""); // scale 1–10

  // Computed health score
  const [healthScore, setHealthScore] = useState<number>(0);
  const [healthMessage, setHealthMessage] = useState("");

  const calculateHealthScore = () => {
    let score = 0;
    if (typeof age === "number" && age > 0) {
      if (age <= 30) score += 15;
      else if (age <= 50) score += 10;
      else score += 5;
    }

    if (typeof bmi === "number" && bmi > 0) {
      if (bmi >= 18.5 && bmi <= 24.9) score += 15;
      else if (bmi < 18.5 || bmi > 30) score += 5; 
      else score += 10;
    }

    if (bloodPressure) {
      if (bloodPressure === "120/80") {
        score += 15;
      } else {
        score += 5;
      }
    }

    if (typeof sleepHours === "number" && sleepHours > 0) {
      if (sleepHours >= 7 && sleepHours <= 9) score += 15;
      else if (sleepHours < 5 || sleepHours > 10) score += 5;
      else score += 10;
    }

    if (typeof dietQuality === "number" && dietQuality > 0) {
      score += dietQuality * 3; // If 5 = 15 points
    }

    if (typeof dailySteps === "number" && dailySteps > 0) {
      if (dailySteps >= 10000) score += 15;
      else if (dailySteps >= 5000) score += 10;
      else score += 5;
    }

    if (typeof mood === "number" && mood > 0) {
      score += mood; // If mood=10 => +10
    }

    if (score > 100) score = 100;

    setHealthScore(score);
    
    if (score >= 80) {
      setHealthMessage("Excellent! You are on a great track.");
    } else if (score >= 60) {
      setHealthMessage("Good job! Keep working toward improvement.");
    } else if (score >= 40) {
      setHealthMessage("Fair. There’s room to grow in your daily habits!");
    } else {
      setHealthMessage("Below average. Let’s set new goals to get you healthier.");
    }
  };

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
              {/* Diet Quality */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="dietQuality" className="text-sm text-gray-500">
                  Diet Quality (1–5)
                </label>
                <Input
                  id="dietQuality"
                  type="number"
                  value={dietQuality}
                  onChange={(e) =>
                    setDietQuality(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="1 = poor, 5 = excellent"
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

            <div className="flex items-center justify-end">
              <Button onClick={calculateHealthScore}>Calculate Health Score</Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2 text-gray-700">
              <HeartPulse className="w-5 h-5" />
              <span>Your Health Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 mt-2">
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <Badge
                        variant="outline"
                        className="text-base text-primary px-4 py-2"
                      >
                        {healthScore}/100
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px]">
                    <p className="text-sm">
                      Score reflects an approximate measure based on your inputs.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="text-lg text-gray-600">{healthMessage}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-700 text-sm">
                    <Activity className="h-4 w-4" />
                    <span>Daily Steps</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-700">
                    {dailySteps || 0}
                  </p>
                  <p className="text-xs text-green-600">Walk more for a healthy heart!</p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-700 text-sm">
                    <CloudMoon className="h-4 w-4" />
                    <span>Sleep</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-700">
                    {sleepHours || 0} <span className="text-sm">hrs</span>
                  </p>
                  <p className="text-xs text-blue-600">Aim for 7–9 hours!</p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-yellow-700 text-sm">
                    <Smile className="h-4 w-4" />
                    <span>Mood</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-yellow-700">
                    {mood || 0}/10
                  </p>
                  <p className="text-xs text-yellow-600">Mental well-being matters!</p>
                </CardContent>
              </Card>
            </div>

            {/* Example: potential alerts or suggestions */}
            {healthScore < 40 && (
              <div className="flex items-center space-x-2 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <AlertCircle className="text-red-600 w-5 h-5" />
                <p className="text-sm text-red-600">
                  You’re scoring below average. Consider talking to a healthcare
                  professional or adjusting your daily habits to improve!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}