'use client'
import Link from "next/link"
import { ArrowLeft, Bell, Calendar, Users} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PillIcon as Pills, Menu, X } from "lucide-react"

export default function SignUpPage() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isCaretaker, setIsCaretaker] = useState<boolean>(false);
  const [patientEmail, setPatientEmail] = useState<string>(""); 
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await axios.post("http://localhost:8000/api/signup/", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        confirm_password: confirmPassword,
        is_caretaker: isCaretaker,
        patient_email: patientEmail,
      });
      
      router.push("/login")
    } catch (error) {
      console.error("Error during sign up:", error)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to home</span>
            </Link>
          </div>
          <div className="mt-8">
            <h2 className="mt-6 text-2xl font-bold tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
          <div className="mt-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" name="first-name" required className="block w-full" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" name="last-name" required className="block w-full" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required className="block w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" autoComplete="new-password" required className="block w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required className="block w-full" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="caretaker"
                    checked={isCaretaker}
                    onCheckedChange={(checked) => setIsCaretaker(checked === true)}
                    aria-label="I am a caretaker"
                  />
                  <label htmlFor="caretaker" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I am a caretaker
                  </label>
                </div>
                {isCaretaker && (
                  <div className="space-y-2 rounded-lg border p-4">
                    <Label htmlFor="patient-email">Patient's Email Address</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="Enter your patient's email"
                      required={isCaretaker}
                      className="block w-full"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Your patient will receive an email to confirm this connection
                    </p>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required aria-label="Agree to terms" />
                  <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the{" "}
                    <div className="text-primary hover:underline inline-block">
                      terms and conditions
                    </div>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create account
              </Button>
            </form>
          </div>
        </div>
      </div>
      {/* Right-side Image */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img className="absolute inset-0 h-full w-full object-cover" src="/doctor.jpg" alt="Doctor assisting patient" />
      </div>
    </div>
  )
}