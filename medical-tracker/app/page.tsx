import Link from "next/link";
import { PillIcon as Pills, Bell, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Pills className="h-6 w-6" />
            <span className="font-bold">Pillpal</span>
          </Link>
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <Link href="/login">
              <Button>Sign up</Button>
            </Link>
            <Link href="/login">
              <Button>Log in</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Your Smart Medication Assistant
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Track your medications, set reminders, and connect with a supportive community. All in one place.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Banner Background */}
        <section id="features" className="relative w-full py-12 md:py-24 lg:py-32">
          {/* Background Banner */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/Sarasota-Memorial-Laurel-Road-Acute-Care-Hospital-1501x600.jpg')" }}
          />
          {/* Dark Overlay for Readability */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Features Content */}
          <div className="relative container px-4 md:px-6 text-white">
            <h2 className="text-4xl font-bold text-center mb-8">Why Choose Pillpal?</h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Pills className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Smart Scanning</h3>
                <p className="text-gray-200">
                  Easily scan medication labels to automatically set up your tracking and reminders.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Timely Reminders</h3>
                <p className="text-gray-200">
                  Never miss a dose with our smart notification system for you and your caretakers.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Track Progress</h3>
                <p className="text-gray-200">
                  Monitor your medication adherence and get insights into your health journey.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Community Support</h3>
                <p className="text-gray-200">
                  Connect with others, share experiences, and get support from our verified community.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-black text-white py-6">
        <div className="container flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
          <p className="text-sm">© 2025 Pillpal. All rights reserved.</p>
          <div className="border-t border-gray-700 w-full md:w-auto" />
          <nav className="flex space-x-4">
            <Link href="/signup" className="text-sm hover:underline">Sign Up</Link>
            <Link href="/login" className="text-sm hover:underline">Log In</Link>
            <Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link>
          </nav>
          <div className="border-t border-gray-700 w-full md:w-auto" />
          <div className="flex space-x-4">
            <a href="#" className="text-sm hover:underline">Facebook</a>
            <a href="#" className="text-sm hover:underline">Twitter</a>
            <a href="#" className="text-sm hover:underline">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

