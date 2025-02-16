// components/Layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { PillIcon as Pills, Bell, Calendar, Users } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 md:py-12">
        <div className="container flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-12">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Pills className="h-8 w-8 text-primary" />
            <span className="font-semibold text-xl">Pillpal</span>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12 text-sm">
            <Link href="/privacy" className="text-white hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-white hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-6">
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
              <Bell className="h-6 w-6 text-white hover:text-primary transition-colors" />
            </Link>
            <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
              <Calendar className="h-6 w-6 text-white hover:text-primary transition-colors" />
            </Link>
            <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
              <Users className="h-6 w-6 text-white hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-white/80">
          <p>© 2025 Pillpal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
