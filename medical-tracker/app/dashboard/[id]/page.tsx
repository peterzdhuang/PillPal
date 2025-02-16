"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlusCircle,
  Pill,
  AlertCircle,
  Edit,
  Save,
  Trash2,
  CheckCircle2,
  Calendar,
  BellRing,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGlobalContext } from "@/app/layout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Import Dialog components (or your own Modal components)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Updated Medication interface based on your backend serializer.
interface Medication {
  id: number;
  user: number | string;
  pillName: string; // from 'name'
  dosage: string | null; // from 'dosage'
  frequency: string | null;
  firstDose: string | null; // from 'first_dose'
  secondDose: string | null; // from 'second_dose'
  numberOfPills: number | null; // from 'quantity'
  lastTaken?: string; // from 'last_taken'
  refills: number; // from 'refills_remaining'
  directions: string | null;
  date: string | null; // from 'date_prescribed'
}

export default function DashboardPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<Partial<Medication>>({});

  // State for the refill modal
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [refillAmount, setRefillAmount] = useState<number | "">("");

  const user = useGlobalContext();

  // Fetch medications using updated mapping
  useEffect(() => {
    if (!user || !user.user) return;

    const fetchMedications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/medications/${user.user}`
        );

        const transformed = res.data.map((serverMed: any) => ({
          id: serverMed.id,
          user: serverMed.user,
          pillName: serverMed.name ?? "Unknown",
          dosage: serverMed.dosage,
          frequency: serverMed.frequency,
          firstDose: serverMed.first_dose,
          secondDose: serverMed.second_dose,
          numberOfPills: serverMed.quantity,
          lastTaken: serverMed.last_taken,
          refills: serverMed.refills_remaining ?? 0,
          directions: serverMed.directions,
          date: serverMed.date_prescribed,
        }));

        setMedications(transformed);
      } catch (err) {
        console.error("Error fetching medications:", err);
        setError("Failed to fetch medications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [user?.user]);

  // Delete medication
  const handleDeleteMedication = async (medId: number) => {
    if (!user || !user.user) return;
    if (!confirm("Are you sure you want to delete this medication?")) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/medications/${user.user}/${medId}/`
      );
      setMedications((prev) => prev.filter((m) => m.id !== medId));
      alert("Medication deleted successfully.");
    } catch (err) {
      console.error("Error deleting medication:", err);
      alert("Failed to delete medication.");
    }
  };

  // Edit medication
  const handleEditMedication = (med: Medication) => {
    setEditingId(med.id);
    setEditFields({
      pillName: med.pillName,
      frequency: med.frequency,
      numberOfPills: med.numberOfPills,
      refills: med.refills,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFields({});
  };

  const handleSaveEdit = async (medId: number) => {
    if (!user || !user.user) return;

    try {
      await axios.patch(
        `http://localhost:8000/api/medications/${user.user}/${medId}/`,
        {
          name: editFields.pillName,
          frequency: editFields.frequency,
          quantity: editFields.numberOfPills,
          refills_remaining: editFields.refills,
        }
      );

      setMedications((prev) =>
        prev.map((m) =>
          m.id === medId
            ? {
                ...m,
                pillName: editFields.pillName ?? m.pillName,
                frequency: editFields.frequency ?? m.frequency,
                numberOfPills:
                  editFields.numberOfPills !== undefined
                    ? Number(editFields.numberOfPills)
                    : m.numberOfPills,
                refills:
                  editFields.refills !== undefined
                    ? Number(editFields.refills)
                    : m.refills,
              }
            : m
        )
      );

      setEditingId(null);
      setEditFields({});
      alert("Medication updated successfully!");
    } catch (err) {
      console.error("Error updating medication:", err);
      alert("Failed to update medication.");
    }
  };

  // Take medication – POST to a dedicated endpoint that updates lastTaken and calculates the new next due date
  const handleTakeMedication = async (med: Medication) => {
    if (!user || !user.user) return;
    const currentQty = Number(med.numberOfPills) || 0;
    if (currentQty <= 0) {
      alert("No pills left to take.");
      return;
    }
    const updatedQty = currentQty - 1;

    // Set lastTaken to now and calculate next due date based solely on frequency
    const lastTakenDate = new Date();
    const nextDueDate = new Date(lastTakenDate);
    switch (med.frequency?.toLowerCase()) {
      case "daily":
        nextDueDate.setDate(nextDueDate.getDate() + 1);
        break;
      case "weekly":
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        break;
      case "monthly":
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        break;
      default:
        nextDueDate.setDate(nextDueDate.getDate() + 1);
    }

    try {
      await axios.post(
        `http://localhost:8000/api/medications/take/${user.user}/${med.id}/`,
        {
          quantity: updatedQty,
          date_prescribed: nextDueDate.toISOString(),
          last_taken: lastTakenDate.toISOString(),
        }
      );

      setMedications((prev) =>
        prev.map((m) =>
          m.id === med.id
            ? {
                ...m,
                numberOfPills: updatedQty,
                date: nextDueDate.toISOString(),
                lastTaken: lastTakenDate.toISOString(),
              }
            : m
        )
      );
      alert(
        `Medication ${med.pillName} taken! Next dose on ${nextDueDate.toLocaleDateString()}`
      );
    } catch (err) {
      console.error("Error taking medication:", err);
      alert("Failed to take medication.");
    }
  };

  // Open refill modal
  const openRefillModal = (med: Medication) => {
    setSelectedMedication(med);
    setRefillAmount("");
    setShowRefillModal(true);
  };

  // Confirm refill via modal input
  const handleConfirmRefill = async () => {
    if (!user || !user.user || !selectedMedication) return;
    if (!refillAmount || Number(refillAmount) <= 0) {
      alert("Please enter a valid number greater than 0");
      return;
    }
    try {
      const newQuantity = Number(refillAmount);
      const newRefills = selectedMedication.refills - 1;

      await axios.patch(
        `http://localhost:8000/api/medications/${user.user}/${selectedMedication.id}/`,
        {
          quantity: newQuantity,
          refills_remaining: newRefills,
        }
      );

      setMedications((prev) =>
        prev.map((m) =>
          m.id === selectedMedication.id
            ? {
                ...m,
                numberOfPills: newQuantity,
                refills: newRefills,
              }
            : m
        )
      );
      alert(
        `Medication ${selectedMedication.pillName} refilled with ${newQuantity} pills!`
      );
      setShowRefillModal(false);
      setSelectedMedication(null);
      setRefillAmount("");
    } catch (err) {
      console.error("Error refilling medication:", err);
      alert("Failed to refill medication.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <p className="text-xl font-medium text-gray-600">
            Loading your medications...
          </p>
          <p className="text-sm text-gray-400">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <span>Error Loading Medications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare schedule info.
  // If a medication was taken today (based on lastTaken), mark its status as "taken".
  // Otherwise, calculate daysUntilDue based on the next due date.
  const scheduleData = medications.map((m) => {
    const today = new Date();
    if (m.lastTaken) {
      const lastTakenDate = new Date(m.lastTaken);
      if (lastTakenDate.toDateString() === today.toDateString()) {
        return { ...m, status: "taken" };
      }
    }
    if (!m.date) return { ...m, daysUntilDue: null, status: "due" };
    const medDate = new Date(m.date);
    const diffTime = medDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { ...m, daysUntilDue: diffDays, status: "due" };
  });

  const totalPills = medications.reduce(
    (sum, m) => sum + (Number(m.numberOfPills) || 0),
    0
  );
  const lowStock = medications.filter((m) => (m.numberOfPills || 0) < 10);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/90 to-primary p-8 rounded-xl shadow-lg text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4">
            <div>
              <h1 className="text-4xl font-bold">Medication Dashboard</h1>
              <p className="text-white/80">
                Managing {medications.length} medications | {totalPills} pills in stock
              </p>
            </div>
            <Link href={`/dashboard/scan/${user.user}`}>
              <Button className="bg-white text-primary hover:bg-white/90">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Medication
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span>Total Medications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">{medications.length}</p>
              <p className="text-sm text-green-600">Active prescriptions</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <Pill className="h-5 w-5" />
                <span>Total Pills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-700">{totalPills}</p>
              <p className="text-sm text-blue-600">Pills in stock</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-700">
                <AlertCircle className="h-5 w-5" />
                <span>Low Stock Alert</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-700">{lowStock.length}</p>
              <p className="text-sm text-yellow-600">Medications below 10 pills</p>
            </CardContent>
          </Card>
        </div>

        {/* Medication Schedule */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Upcoming Schedule</span>
              </CardTitle>
              <Badge variant="outline" className="text-primary">
                Next 7 days
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {scheduleData.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No medications scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduleData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          item.status === "taken"
                            ? "bg-green-100 text-green-600"
                            : item.daysUntilDue !== null && item.daysUntilDue <= 3
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        )}
                      >
                        <BellRing className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{item.pillName}</p>
                        <p className="text-sm text-gray-500">
                          {item.frequency || "No frequency specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={
                          item.status === "taken"
                            ? "success"
                            : item.daysUntilDue === null
                            ? "outline"
                            : item.daysUntilDue <= 3
                            ? "destructive"
                            : "default"
                        }
                      >
                        {item.status === "taken"
                          ? "Taken"
                          : item.daysUntilDue === null
                          ? "No date"
                          : item.daysUntilDue < 0
                          ? `${Math.abs(item.daysUntilDue)}d overdue`
                          : `Due in ${item.daysUntilDue}d`}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTakeMedication(item)}
                        >
                          Take
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openRefillModal(item)}
                          disabled={item.refills === 0}
                        >
                          Refill
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medication List */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Medication List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-gray-400 p-2">
                    Medication
                  </th>
                  <th className="text-left text-sm font-medium text-gray-400 p-2">
                    Quantity
                  </th>
                  <th className="text-left text-sm font-medium text-gray-400 p-2">
                    Frequency
                  </th>
                  <th className="text-left text-sm font-medium text-gray-400 p-2">
                    Refills
                  </th>
                  <th className="text-right text-sm font-medium text-gray-400 p-2">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med) => (
                  <tr key={med.id} className="border-b last:border-b-0">
                    <td className="p-2">
                      {editingId === med.id ? (
                        <Input
                          id="pillName"
                          value={editFields.pillName}
                          onChange={(e) =>
                            setEditFields({ ...editFields, pillName: e.target.value })
                          }
                        />
                      ) : (
                        <p className="font-medium">{med.pillName}</p>
                      )}
                    </td>
                    <td className="p-2">
                      {editingId === med.id ? (
                        <Input
                          id="numberOfPills"
                          type="number"
                          value={editFields.numberOfPills ?? ""}
                          onChange={(e) =>
                            setEditFields({
                              ...editFields,
                              numberOfPills: Number(e.target.value),
                            })
                          }
                        />
                      ) : (
                        <p>{med.numberOfPills} pills</p>
                      )}
                    </td>
                    <td className="p-2">
                      {editingId === med.id ? (
                        <Input
                          id="frequency"
                          value={editFields.frequency ?? ""}
                          onChange={(e) =>
                            setEditFields({ ...editFields, frequency: e.target.value })
                          }
                        />
                      ) : (
                        <p>{med.frequency || "No frequency specified"}</p>
                      )}
                    </td>
                    <td className="p-2">
                      {editingId === med.id ? (
                        <Input
                          id="refills"
                          type="number"
                          value={editFields.refills}
                          onChange={(e) =>
                            setEditFields({ ...editFields, refills: Number(e.target.value) })
                          }
                        />
                      ) : (
                        <p>{med.refills} refills</p>
                      )}
                    </td>
                    <td className="p-2 text-right space-x-2">
                      {editingId === med.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveEdit(med.id)}
                          >
                            <Save className="h-5 w-5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditMedication(med)}
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteMedication(med.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Refill Modal */}
      <Dialog open={showRefillModal} onOpenChange={setShowRefillModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refill Medication</DialogTitle>
            <DialogDescription>
              Please enter the number of pills you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              value={refillAmount}
              onChange={(e) => setRefillAmount(Number(e.target.value))}
              placeholder="Enter refill amount"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowRefillModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRefill}>Refill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
