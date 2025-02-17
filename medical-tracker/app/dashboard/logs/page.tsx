"use client";
import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PatientUpdatePage() {
  const [patientId, setPatientId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate the fields
    if (!patientId || !description.trim()) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      // Post data to your Django API endpoint.
      // Adjust the URL as needed.
      await axios.post("http://localhost:8000/api/patient_updates/", {
        patient: patientId,
        description: description,
      });
      setSuccess("Patient update submitted successfully!");
      setPatientId("");
      setDescription("");
    } catch (err) {
      console.error("Error submitting update:", err);
      setError("Error submitting update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Patient Update Form</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 text-red-600">{error}</div>}
            {success && <div className="mb-4 text-green-600">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="patientId" className="mb-1 text-sm text-gray-600">
                  Patient ID
                </label>
                <Input
                  id="patientId"
                  type="number"
                  value={patientId}
                  onChange={(e) =>
                    setPatientId(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="Enter Patient ID"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="description" className="mb-1 text-sm text-gray-600">
                  Update Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter update description..."
                  className="border p-2 rounded w-full min-h-[150px]"
                  required
                ></textarea>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Update"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
