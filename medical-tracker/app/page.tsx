"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PillIcon as Pills,
  Bell,
  Calendar,
  Users,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur shadow-sm' : 'bg-transparent'}`}>
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Pills className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              PillPal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors" aria-label="Features">
              Features
            </Link>
            <Link href="/login" aria-label="Login">
              <Button variant="ghost" className="mr-2">Log in</Button>
            </Link>
            <Link href="/signup" aria-label="Sign Up">
              <Button>Get Started</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
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
              <Link href="#features" className="text-sm font-medium" aria-label="Mobile Features">Features</Link>
              <Link href="/login" aria-label="Mobile Login">
                <Button variant="ghost" className="w-full">Log in</Button>
              </Link>
              <Link href="/signup" aria-label="Mobile Sign Up">
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
                  Connect with{" "}
                  <span className="text-primary">Health Experts</span> &amp; Peers
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Whether you're pursuing your personal health goals or facing a
                  specific health challenge, join a community that supports you.
                  Connect with professionals, share your journey, and be inspired.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" aria-label="Start Now">
                  <Button size="lg" className="w-full sm:w-auto">
                    Join Now
                  </Button>
                </Link>
                <Link href="#features" aria-label="See How It Works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="relative w-full py-24 lg:py-32 bg-cover bg-center"
          style={{ backgroundImage: "url('/blue_banner.JPG')" }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-16 text-white">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Powerful Tools for Your Health Journey
              </h2>
              <p className="max-w-[700px] text-lg text-white/80">
                From smart medication tracking and timely reminders to personalized
                health insights—everything you need is here.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<Pills className="h-8 w-8" />}
                title="Smart Scanning"
                description="Quickly scan medication labels to set up tracking and reminders."
              />
              <FeatureCard
                icon={<Bell className="h-8 w-8" />}
                title="Timely Reminders"
                description="Never miss a dose with our smart notification system."
              />
              <FeatureCard
                icon={<Calendar className="h-8 w-8" />}
                title="Track Progress"
                description="Monitor adherence and gain insights into your health journey."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8" />}
                title="Community & Forum"
                description="Connect with professionals and peers who share your goals."
              />
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Join a Thriving Community
              </h2>
              <p className="max-w-[700px] text-lg text-gray-600">
                Connect with health professionals, share experiences, and support
                each other in our interactive forum. Learn, grow, and thrive together.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Link href="/dashboard/forum">
                <Button size="lg" className="w-full sm:w-auto">
                  Visit the Forum
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 md:py-12">
        <div className="container flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12">
          <div className="flex items-center justify-center width">
            <Pills className="h-8 w-8 text-primary" />
            <span className="font-semibold text-xl">Pillpal</span>
          </div>

        </div>
        <div className="mt-8 text-center text-sm text-white/80">
          <p>© 2025 Pillpal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="group relative flex flex-col items-center p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition-all">
    <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-white/80 text-center">{description}</p>
  </div>
);
