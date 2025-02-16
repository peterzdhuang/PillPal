'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlusCircle, Pill, AlertCircle, Edit, Save, 
  Trash2, CheckCircle2, RefreshCcw, Calendar,
  Info, BellRing, X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { useGlobalContext } from "@/app/layout";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Medication {
  id: number;
  user: number | string;
  pillName: string;
  pharmacyName: string | null;
  pharmacyAddress: string | null;
  date: string | null;
  numberOfPills: number | null;
  frequency: string | null;
  directions: string | null;
  refills: number;
}

export default function DashboardPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRedirect, setShowRedirect] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<Partial<Medication>>({});
  
  const user = useGlobalContext();

  // Fetch medications
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
          pharmacyName: serverMed.pharmacy_name,
          pharmacyAddress: serverMed.pharmacy_address,
          date: serverMed.date_prescribed,
          numberOfPills: serverMed.quantity,
          frequency: serverMed.frequency,
          directions: serverMed.directions,
          refills: serverMed.refills_remaining ?? 0,
        }));

        setMedications(transformed);
      } catch (err) {
        console.error("Error fetching medications:", err);
        setError("Failed to fetch medications. Please try again.");
        setShowRedirect(true);
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
                numberOfPills: editFields.numberOfPills !== undefined
                  ? Number(editFields.numberOfPills)
                  : m.numberOfPills,
                refills: editFields.refills !== undefined
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

  // Take medication
  const handleTakeMedication = async (med: Medication) => {
    if (!user || !user.user) return;

    try {
      const currentQty = Number(med.numberOfPills) || 0;
      const updatedQty = Math.max(currentQty - 1, 0);

      await axios.patch(
        `http://localhost:8000/api/medications/${user.user}/${med.id}/`,
        { quantity: updatedQty }
      );

      setMedications((prev) =>
        prev.map((m) =>
          m.id === med.id
            ? { ...m, numberOfPills: updatedQty }
            : m
        )
      );
      alert(`Medication ${med.pillName} taken!`);
    } catch (err) {
      console.error("Error taking medication:", err);
      alert("Failed to take medication.");
    }
  };

  // Refill medication
  const handleRefillMedication = async (med: Medication) => {
    if (!user || !user.user) return;
    if (med.refills === 0) return;

    try {
      const newQuantity = 30;
      const newRefills = med.refills - 1;

      await axios.patch(
        `http://localhost:8000/api/medications/${user.user}/${med.id}/`,
        {
          quantity: newQuantity,
          refills_remaining: newRefills,
        }
      );

      setMedications((prev) =>
        prev.map((m) =>
          m.id === med.id
            ? {
                ...m,
                numberOfPills: newQuantity,
                refills: newRefills,
              }
            : m
        )
      );
      alert(`Medication ${med.pillName} refilled!`);
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
          <p className="text-xl font-medium text-gray-600">Loading your medications...</p>
          <p className="text-sm text-gray-400">Please wait while we fetch your data</p>
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
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            {showRedirect && (
              <Link href={`/dashboard/scan/${user.user}`}>
                <Button className="w-full" size="lg">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add Your First Medication
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const scheduleData = medications.map((m) => {
    if (!m.date) return { ...m, daysUntilDue: null };
    const today = new Date();
    const medDate = new Date(m.date);
    const diffTime = medDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { ...m, daysUntilDue: diffDays };
  });

  const totalPills = medications.reduce((sum, m) => sum + (Number(m.numberOfPills) || 0), 0);
  const lowStock = medications.filter(m => (m.numberOfPills || 0) < 10);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-primary/90 to-primary p-8 rounded-xl shadow-lg text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="space-y-2">
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

        {/* Quick Stats Grid */}
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
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        item.daysUntilDue !== null && item.daysUntilDue <= 3
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      )}>
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
                      <Badge variant={
                        item.daysUntilDue === null
                          ? "outline"
                          : item.daysUntilDue <= 3
                          ? "destructive"
                          : "default"
                      }>
                        {item.daysUntilDue === null
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
                          onClick={() => handleRefillMedication(item)}
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
                  <th className="text-left text-sm font-medium text-gray-400 p-2">Medication</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-2">Quantity</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-2">Frequency</th>
                  <th className="text-left text-sm font-medium text-gray-400 p-2">Refills</th>
                  <th className="text-right text-sm font-medium text-gray-400 p-2">Actions</th>
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
                          onChange={(e) => setEditFields({ ...editFields, pillName: e.target.value })}
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
                          value={editFields.numberOfPills ?? ''}
                          onChange={(e) => setEditFields({ ...editFields, numberOfPills: Number(e.target.value) })}
                        />
                      ) : (
                        <p>{med.numberOfPills} pills</p>
                      )}
                    </td>
                    <td className="p-2">
                      {editingId === med.id ? (
                        <Input
                          id="frequency"
                          value={editFields.frequency ?? ''}
                          onChange={(e) => setEditFields({ ...editFields, frequency: e.target.value })}
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
                          onChange={(e) => setEditFields({ ...editFields, refills: Number(e.target.value) })}
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
    </div>
  );
}