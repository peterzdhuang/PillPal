'use client'
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Cookies from "js-cookie";
import { createContext, useContext, useState, useEffect } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
// Create a Context for global state
const GlobalContext = createContext<any>(null);

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  // Load user data from cookies on mount
  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Function to update user state and persist in cookies
  const updateUser = (newUser: string) => {
    setUser(newUser);
    Cookies.set("user", newUser, { expires: 7 }); // Expires in 7 days
  };

  return (
    <GlobalContext.Provider value={{ user, updateUser }}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </GlobalContext.Provider>
  );
}
