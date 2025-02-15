import { Camera, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ScanPage() {
  return (
    <div className="container max-w-xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan Medication Label</CardTitle>
          <CardDescription>Point your camera at the medication label or enter details manually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="absolute inset-0 border-2 border-dashed border-muted-foreground/25" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medication">Medication Name</Label>
              <Input id="medication" placeholder="Enter medication name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" placeholder="e.g. 500mg" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Once daily</SelectItem>
                  <SelectItem value="2">Twice daily</SelectItem>
                  <SelectItem value="3">Three times daily</SelectItem>
                  <SelectItem value="4">Four times daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Times</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time1">First Dose</Label>
                  <Input id="time1" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time2">Second Dose</Label>
                  <Input id="time2" type="time" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="Number of pills" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="lg">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button size="lg">
            <Check className="mr-2 h-4 w-4" />
            Save Medication
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

