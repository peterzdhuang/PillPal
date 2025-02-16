'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { PillIcon as Pills, Bell, Calendar, Users, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur shadow-sm' : 'bg-transparent'
      }`}>
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Pills className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Pillpal
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="mr-2">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b p-4">
            <nav className="flex flex-col space-y-4">
              <Link href="#features" className="text-sm font-medium">
                Features
              </Link>
              <Link href="#community" className="text-sm font-medium">
                Community
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="w-full">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full">Get Started</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full min-h-screen flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background" />
          <div className="container relative px-4 md:px-6 pt-32">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Your <span className="text-primary">Smart</span> Medication Assistant
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Track your medications, set reminders, and connect with a supportive community. All in one place.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Now
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Everything you need to stay on track
              </h2>
              <p className="max-w-[700px] text-muted-foreground">
                Powerful features to help you manage your medications with ease
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard 
                icon={<Pills className="h-8 w-8" />}
                title="Smart Scanning"
                description="Scan medication labels to automatically set up tracking and reminders"
              />
              <FeatureCard 
                icon={<Bell className="h-8 w-8" />}
                title="Timely Reminders"
                description="Smart notification system for you and your caretakers"
              />
              <FeatureCard 
                icon={<Calendar className="h-8 w-8" />}
                title="Track Progress"
                description="Monitor adherence and get insights into your health journey"
              />
              <FeatureCard 
                icon={<Users className="h-8 w-8" />}
                title="Community Support"
                description="Connect with others and get support from our verified community"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Pills className="h-6 w-6 text-primary" />
              <span className="font-semibold">Pillpal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Pillpal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="group relative flex flex-col items-center p-6 rounded-2xl border bg-background/50 hover:bg-background transition-colors">
    <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-center">{description}</p>
  </div>
)