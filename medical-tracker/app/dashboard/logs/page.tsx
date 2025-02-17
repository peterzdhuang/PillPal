"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/app/layout";

// A simple delete icon component (you can replace with any icon library)
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function PatientUpdatePage() {
  const [patientEmail, setPatientEmail] = useState("");
  const [description, setDescription] = useState("");
  const [caretakerEmail, setCaretakerEmail] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  // Update the usersMap to store caretaker_email as well.
  const [usersMap, setUsersMap] = useState<{
    [email: string]: {
      first_name: string;
      last_name: string;
      caretaker_email?: string;
    };
  }>({});
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState("");
  const [logsError, setLogsError] = useState("");
  const [success, setSuccess] = useState("");

  // Grab the currently logged-in user ID from context
  const { user } = useGlobalContext();

  // Fetch caretaker details
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:8000/api/user/${user}/`)
        .then((response) => {
          // Assuming the API returns an object with an "email" field
          setCaretakerEmail(response.data.email);
        })
        .catch((err) => {
          console.error("Error fetching caretaker details:", err);
          setError("Error fetching user details. Please try again.");
        });
    }
  }, [user]);

  // Fetch all users and build a map keyed by email
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users/")
      .then((response) => {
        // Assuming response.data is an array of user objects with email, first_name, last_name,
        // and caretaker_email fields
        const map: {
          [email: string]: {
            first_name: string;
            last_name: string;
            caretaker_email?: string;
          };
        } = {};
        response.data.forEach((user: any) => {
          if (user.email) {
            map[user.email] = {
              first_name: user.first_name,
              last_name: user.last_name,
              caretaker_email: user.caretaker_email,
            };
          }
        });
        setUsersMap(map);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  // Fetch logs when caretakerEmail is available or after a successful update
  const fetchLogs = () => {
    if (caretakerEmail) {
      setLogsLoading(true);
      axios
        .get("http://localhost:8000/api/patient-logs/", {
          params: { caretaker_email: caretakerEmail },
        })
        .then((response) => {
          // Sort logs in descending order by datetime (newest at the top)
          const sortedLogs = response.data.sort(
            (a: any, b: any) =>
              new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
          );
          setLogs(sortedLogs);
          setLogsError("");
        })
        .catch((err) => {
          console.error("Error fetching logs:", err);
          setLogsError("Error fetching patient logs. Please try again.");
        })
        .finally(() => {
          setLogsLoading(false);
        });
    }
  };

  // When caretakerEmail changes, fetch the logs
  useEffect(() => {
    fetchLogs();
  }, [caretakerEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate the fields
    if (!patientEmail.trim() || !description.trim()) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    // Check if the patient exists and belongs to the caretaker
    const patient = usersMap[patientEmail];
    if (!patient || patient.caretaker_email !== caretakerEmail) {   
      setError("No matching patient found or the patient is not under your care.");
      setLoading(false);
      return;
    }

    // Get the current date and time in ISO format
    const now = new Date().toISOString();

    try {
      await axios.post("http://localhost:8000/api/patient-logs/", {
        patient_email: patientEmail,
        caretaker_email: caretakerEmail, // taken from the current user's details
        description: description,
        datetime: now, // sending the current date and time
      });
      setSuccess("Patient update submitted successfully!");
      setPatientEmail("");
      setDescription("");
      // Refresh the logs after a successful submission
      fetchLogs();
    } catch (err) {
      console.error("Error submitting update:", err);
      setError("Error submitting update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (logId: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/patient-logs/${logId}/`);
      // Optionally, display a success message
      setSuccess("Log deleted successfully!");
      // Refresh the logs after deletion
      fetchLogs();
    } catch (err) {
      console.error("Error deleting log:", err);
      setLogsError("Error deleting log. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Patient Update Form</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 text-red-600">{error}</div>}
            {success && <div className="mb-4 text-green-600">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="patientEmail" className="mb-1 text-sm text-gray-600">
                  Patient Email
                </label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="Enter Patient Email"
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

        <Card>
          <CardHeader>
            <CardTitle>My Patient Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {logsError && <div className="mb-4 text-red-600">{logsError}</div>}
            {logsLoading ? (
              <p>Loading logs...</p>
            ) : logs.length > 0 ? (
              <ul className="space-y-4">
                {logs.map((log) => {
                  // Look up the patient details based on the email
                  const patient = usersMap[log.patient_email];
                  const patientName = patient
                    ? `${patient.first_name} ${patient.last_name}`
                    : log.patient_email;
                  return (
                    <li key={log.id} className="relative border p-4 rounded">
                      {/* Delete Icon at the top right */}
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        title="Delete Log"
                      >
                        <DeleteIcon />
                      </button>
                      <p>
                        <strong>Patient Name:</strong> {patientName}
                      </p>
                      <p>
                        <strong>Description:</strong> {log.description}
                      </p>
                      <p>
                        <strong>Date & Time:</strong>{" "}
                        {new Date(log.datetime).toLocaleString()}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No patient logs found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
