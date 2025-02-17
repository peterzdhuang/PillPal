"use client";
import React, { useState, useEffect } from "react";

// Utility function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function HealthInformationPage() {
  // Initial medications value for demonstration.
  const [medications, setMedications] = useState(
    "Aspirin, Ibuprofen, Paracetamol, Metformin, Lisinopril"
  );

  // Mock data arrays.
  const allInteractions = [
    {
      drugs: ["Aspirin", "Ibuprofen"],
      description:
        "Taking Aspirin and Ibuprofen together may increase the risk of gastrointestinal bleeding.",
      severity: "Severe",
    },
    {
      drugs: ["Paracetamol", "Codeine"],
      description:
        "Combining Paracetamol and Codeine can cause drowsiness. Use caution when driving.",
      severity: "Moderate",
    },
    {
      drugs: ["Warfarin", "Aspirin"],
      description:
        "Warfarin and Aspirin may significantly increase bleeding risk. Regular monitoring is essential.",
      severity: "Severe",
    },
    {
      drugs: ["Metformin", "Cimetidine"],
      description:
        "Cimetidine may increase blood levels of Metformin, potentially raising side effects.",
      severity: "Moderate",
    },
    {
      drugs: ["Lisinopril", "Potassium supplements"],
      description:
        "High potassium levels may occur when combining Lisinopril with potassium supplements.",
      severity: "Mild",
    },
    {
      drugs: ["Atorvastatin", "Grapefruit"],
      description:
        "Grapefruit juice may increase the blood levels of Atorvastatin, raising the risk of side effects.",
      severity: "Moderate",
    },
    {
      drugs: ["Amoxicillin", "Oral contraceptives"],
      description:
        "Amoxicillin may decrease the effectiveness of oral contraceptives in some women.",
      severity: "Mild",
    },
    {
      drugs: ["Simvastatin", "Cyclosporine"],
      description:
        "Concomitant use of Simvastatin and Cyclosporine may increase the risk of muscle toxicity.",
      severity: "Severe",
    },
    {
      drugs: ["Digoxin", "Verapamil"],
      description:
        "Verapamil can increase digoxin levels, leading to potential toxicity.",
      severity: "Severe",
    },
    {
      drugs: ["Levothyroxine", "Calcium supplements"],
      description:
        "Calcium supplements may interfere with the absorption of Levothyroxine.",
      severity: "Mild",
    },
  ];

  const allWarnings = [
    {
      message:
        "Avoid alcohol while taking Ibuprofen to reduce the risk of stomach bleeding.",
    },
    {
      message: "Do not exceed 4g of Paracetamol in 24 hours.",
    },
    {
      message: "Monitor potassium intake if you are on Lisinopril.",
    },
    {
      message:
        "Always consult your doctor before combining supplements with prescription drugs.",
    },
    {
      message: "Ensure you stay well hydrated when taking diuretics.",
    },
    {
      message: "Grapefruit juice should be avoided with Atorvastatin.",
    },
    {
      message:
        "Some antibiotics like Amoxicillin might reduce the effectiveness of oral contraceptives. Use an alternative method if needed.",
    },
    {
      message:
        "Do not take calcium supplements within 4 hours of Levothyroxine.",
    },
  ];

  const allHealthTips = [
    {
      title: "Stay Hydrated",
      tip: "Drink at least 8 cups of water daily to maintain energy, support digestion, and promote healthy skin.",
    },
    {
      title: "Exercise Regularly",
      tip: "Aim for at least 30 minutes of moderate exercise most days to boost fitness and reduce stress.",
    },
    {
      title: "Get Enough Sleep",
      tip: "Aim for 7-9 hours of sleep per night to support cognitive function and overall well-being.",
    },
    {
      title: "Eat a Balanced Diet",
      tip: "Include a variety of fruits, vegetables, lean proteins, and whole grains in your meals to sustain energy.",
    },
    {
      title: "Manage Stress",
      tip: "Practice mindfulness, meditation, or deep-breathing exercises daily to improve mental clarity.",
    },
    {
      title: "Take Regular Breaks",
      tip: "Short breaks during work can boost productivity and reduce fatigue.",
    },
    {
      title: "Practice Good Hygiene",
      tip: "Regular handwashing can prevent illness and contribute to overall health.",
    },
    {
      title: "Stay Active",
      tip: "Even light activities like walking can improve your mood and cardiovascular health.",
    },
    {
      title: "Regular Health Check-ups",
      tip: "Schedule regular appointments with your healthcare provider to catch potential issues early.",
    },
  ];

  const allNews = [
    {
      title: "Breakthrough in Mental Health Research",
      news: "Recent studies show that mindfulness meditation can significantly lower anxiety levels.",
    },
    {
      title: "Exercise and Longevity",
      news: "Regular aerobic exercise has been linked to improved cognitive function in older adults.",
    },
    {
      title: "Heart Health Nutrition",
      news: "A new plant-based diet is recommended to reduce the risk of heart disease.",
    },
    {
      title: "Sleep and Immunity",
      news: "Research confirms that 7-9 hours of sleep per night can enhance immune function.",
    },
    {
      title: "COVID-19 Vaccine Update",
      news: "Updated vaccine formulations have shown increased efficacy against emerging variants.",
    },
    {
      title: "Advancements in Diabetes Management",
      news: "New technologies offer real-time glucose monitoring for improved diabetes control.",
    },
    {
      title: "New Cholesterol Guidelines",
      news: "Updated guidelines now recommend earlier screening for cholesterol levels.",
    },
    {
      title: "Innovations in Telemedicine",
      news: "Telemedicine is rapidly expanding access to healthcare services, especially in rural areas.",
    },
  ];

  // State for displayed data.
  const [interactions, setInteractions] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [healthTips, setHealthTips] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Returns a random subset of the given data.
  const randomSubset = (data: any[], count: number) => {
    const shuffled = shuffleArray(data);
    return shuffled.slice(0, count);
  };

  const fetchMockData = async () => {
    if (!medications) return;
    setLoading(true);
    setError("");
    try {
      // Simulate network delay.
      await new Promise((res) => setTimeout(res, 500));
      // Randomly select subsets from our mock data.
      setInteractions(randomSubset(allInteractions, 3));
      setWarnings(randomSubset(allWarnings, 3));
      setHealthTips(randomSubset(allHealthTips, 4));
      setNews(randomSubset(allNews, 3));
    } catch (err) {
      console.error("Error fetching mock data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (medications) {
      fetchMockData();
    }
  }, [medications]);

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Widget 1: Drug Interactions */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Drug Interactions</h2>
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            placeholder="Enter medications (comma-separated)"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 bg-gray-100 p-2 text-gray-900 placeholder-gray-500"
          />
          <button
            onClick={fetchMockData}
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check Medications"}
          </button>
        </div>
        {error && (
          <p className="text-red-600 mt-2 flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </p>
        )}
        {interactions.length > 0 && (
          <div className="mt-4 space-y-4">
            {interactions.map((interaction, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900">
                  {interaction.drugs.join(" + ")}
                </h3>
                <p className="text-sm text-gray-700">
                  {interaction.description}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                    interaction.severity === "Severe"
                      ? "bg-red-200 text-red-800"
                      : interaction.severity === "Moderate"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {interaction.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Widget 2: Medication Warnings */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Medication Warnings</h2>
        <div className="mt-4">
          {warnings.length > 0 ? (
            warnings.map((warning, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border mt-4">
                <p className="text-sm text-gray-700">{warning.message}</p>
                <span className="mt-2 inline-block rounded-full bg-red-200 px-3 py-1 text-sm font-medium text-red-800">
                  Warning
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-600">
              No warnings found for the given medications.
            </p>
          )}
        </div>
      </div>

      {/* Widget 3: Health Tips */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Health Tips</h2>
        <ul className="mt-4 space-y-4">
          {healthTips.length > 0 ? (
            healthTips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-blue-600 text-lg">✓</span>
                </div>
                <div className="text-sm text-gray-800">
                  <strong>{tip.title}:</strong> {tip.tip}
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No health tips available.</p>
          )}
        </ul>
      </div>

      {/* Widget 4: Latest Health News */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Latest Health News</h2>
        <ul className="mt-4 space-y-4">
          {news.length > 0 ? (
            news.map((item, index) => (
              <li key={index} className="flex items-start space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <div className="text-sm text-gray-800">
                  <strong>{item.title}:</strong> {item.news}
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No health news available.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
