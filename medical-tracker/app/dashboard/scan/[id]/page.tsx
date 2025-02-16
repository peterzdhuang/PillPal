'use client'
import { Camera, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import TextScanner, { MedicationFields } from "@/components/TextExtract";
import axios from "axios";

export default function ScanPage() {
 

  const [showScanner, setShowScanner] = useState(false);

  // State for each form field
  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [pillName, setPillName] = useState("");
  const [date, setDate] = useState("");
  const [numberOfPills, setNumberOfPills] = useState("");
  const [frequency, setFrequency] = useState("");
  const [directions, setDirections] = useState("");
  const [refills, setRefills] = useState("");
  const [csrfToken, setCsrfToken] = useState('');
  useEffect(() => {
    // Make sure axios sends cookies with requests
    axios.defaults.withCredentials = true;

    // Helper to get a cookie by name
    function getCookie(name : any) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        cookies.forEach(cookie => {
          const trimmed = cookie.trim();
          if (trimmed.startsWith(name + "=")) {
            cookieValue = decodeURIComponent(trimmed.substring(name.length + 1));
          }
        });
      }
      return cookieValue;
    }

    async function fetchCSRFToken() {
      try {
        await axios.get('http://127.0.0.1:8000/api/csrf_token/');
        const token = getCookie('csrftoken'); // Extract CSRF token from cookies
        if (token) {
          setCsrfToken(token);
          console.log('CSRF token retrieved:', token);
        } else {
          console.warn('CSRF token not found in cookies.');
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    }

    fetchCSRFToken();
  }, []);


  const handleSaveMedication = async () => {
    // Create medication data object
    const medicationData = {
      pharmacyName,
      pharmacyAddress,
      pillName,
      date,
      numberOfPills: parseInt(numberOfPills, 10),
      frequency,
      directions,
      refills: parseInt(refills, 10),
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/medications/', 
        medicationData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
          }
        }
      );
      console.log('Medication saved:', response.data);
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };
  // Callback to handle the fields returned from the backend
  const handleTextExtracted = (fields: MedicationFields) => {
    setPharmacyName(fields.pharmacyName || "");
    setPharmacyAddress(fields.pharmacyAddress || "");
    setPillName(fields.pillName || "");
    setDate(fields.date || "");
    setNumberOfPills(fields.numberOfPills || "");
    setFrequency(fields.frequency || "");
    setDirections(fields.directions || "");
    setRefills(fields.refills || "");
    // Optionally close the scanner after extraction
    setShowScanner(false);
  
    // Log everything
    console.log("Extracted fields object:", fields);
    console.log("Pharmacy Name:", fields.pharmacyName);
    console.log("Pharmacy Address:", fields.pharmacyAddress);
    console.log("Medication Name:", fields.pillName);
    console.log("Date:", fields.date);
    console.log("Quantity:", fields.numberOfPills);
    console.log("Frequency:", fields.frequency);
    console.log("Directions:", fields.directions);
    console.log("Refills:", fields.refills);
  };
  

  return (
    <div className="container max-w-xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan Medication Label</CardTitle>
          <CardDescription>
            Point your camera at the medication label or enter details manually
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div
            onClick={() => setShowScanner(true)}
            className="relative aspect-video overflow-hidden rounded-lg bg-muted"
          >
            {showScanner ? (
              <TextScanner
                onClose={() => setShowScanner(false)}
                onTextExtracted={handleTextExtracted}
              />
            ) : (
              <button
                onClick={() => setShowScanner(true)}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
              >
                <Camera className="h-12 w-12 text-muted-foreground hover:text-primary transition-colors" />
              </button>
            )}
            <div className="absolute inset-0 border-2 border-dashed border-muted-foreground/25" />
          </div>

          {/* Medication Details Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pharmacy_name">Pharmacy Name</Label>
              <Input
                id="pharmacy_name"
                placeholder="Enter pharmacy name"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Pharmacy Address</Label>
              <Input
                id="address"
                placeholder="Enter pharmacy address"
                value={pharmacyAddress}
                onChange={(e) => setPharmacyAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pill_name">Medication Name</Label>
              <Input
                id="pill_name"
                placeholder="Enter medication name"
                value={pillName}
                onChange={(e) => setPillName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number_of_pills">Quantity</Label>
              <Input
                id="number_of_pills"
                type="number"
                placeholder="Number of pills"
                value={numberOfPills}
                onChange={(e) => setNumberOfPills(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={frequency} onValueChange={(value) => setFrequency(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Once daily">Once daily</SelectItem>
                  <SelectItem value="Twice daily">Twice daily</SelectItem>
                  <SelectItem value="Three times daily">Three times daily</SelectItem>
                  <SelectItem value="Four times daily">Four times daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="directions">Directions</Label>
              <Input
                id="directions"
                placeholder="Enter directions for taking the pill"
                value={directions}
                onChange={(e) => setDirections(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="refills">Refills</Label>
              <Input
                id="refills"
                type="number"
                placeholder="Refills remaining"
                value={refills}
                onChange={(e) => setRefills(e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" size="lg">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button size="lg" onClick={handleSaveMedication}>
            <Check className="mr-2 h-4 w-4" />
            Save Medication
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}