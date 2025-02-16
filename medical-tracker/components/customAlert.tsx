"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface CustomAlertProps {
  message: string
  onClose: () => void
  duration?: number
}

export function CustomAlert({ message, onClose, duration = 5000 }: CustomAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade-out animation before calling onClose
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div
      role="alert"
      className="fixed top-4 right-4 flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 max-w-md shadow-lg transition-opacity duration-300 ease-in-out"
    >
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
        aria-label="Close"
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
      >
        <span className="sr-only">Close</span>
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

