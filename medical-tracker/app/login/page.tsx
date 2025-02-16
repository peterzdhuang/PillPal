"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer"; // Import Footer

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (formdata: FormData) => {
    const email = formdata.get("email");
    const password = formdata.get("password");
    console.log(email, password);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Login Form Section */}
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
              <form action={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <div className="mt-2">
                    <Input id="email" name="email" type="email" autoComplete="email" required className="block w-full" />
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

        {/* Sidebar Image Section */}
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            src="/images/f0104743-800px-wm.jpg"
            alt="Medical background"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </div>

      {/* Add Footer Here */}
      <Footer />
    </div>
  );
}