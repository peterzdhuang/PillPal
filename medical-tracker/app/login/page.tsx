'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useGlobalContext } from "@/app/layout";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const router = useRouter()
  const { updateUser } = useGlobalContext()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username: email,  // Assuming backend expects 'username'
        password: password,
      })

      if (response.status === 200) {
        const userId = response.data.id
        // Update global context with user data (you could update with response.data.user or any other field)
        updateUser(userId);
        router.push(`/dashboard/${userId}`)

      }
    } catch (error) {
      console.error("Login failed", error)
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
            <h2 className="mt-6 text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
          <div className="mt-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="mt-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email} // Bind email state here
                    onChange={(e) => setEmail(e.target.value)} // Handle change
                    className="block w-full"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-2">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password} // Bind password state here
                    onChange={(e) => setPassword(e.target.value)} // Handle change
                    className="block w-full"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/placeholder.svg?height=1080&width=1920"
          alt="Medical background"
        />
      </div>
    </div>
  )
}
