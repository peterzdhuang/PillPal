'use client'
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Cookies from "js-cookie";
import { createContext, useContext, useState, useEffect } from "react";
import "./globals.css";
import { useTranslation } from 'react-i18next';
import '@/lib/i18next.js';

const inter = Inter({ subsets: ["latin"] });


// Create a Context for global state
const GlobalContext = createContext<any>(null);

export function useGlobalContext() {
  return useContext(GlobalContext);
}

const LanguageContext = createContext<any>(null);

export function useLanguageContext() {
    return useContext(LanguageContext);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { i18n } = useTranslation();
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
    Cookies.set("user", newUser, { expires: 7 }); 
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang); 
  };
  return (
    <GlobalContext.Provider value={{ user, updateUser }}>
        <LanguageContext.Provider value={{ changeLanguage }}>
            <html lang={i18n.language}>
            <body className={inter.className}>
                {children}
                <script src="//code.tidio.co/r2n39wnqp7oy9fhwlmcsjfoldkvafkbo.js" async></script>
            </body>
            </html>
        </LanguageContext.Provider>
    </GlobalContext.Provider>
  );
}