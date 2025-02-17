"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface SuccessAlertProps {
  title: string
  message: string
  onClose: () => void
  duration?: number
}

export function SuccessAlert({ title, message, onClose, duration = 5000 }: SuccessAlertProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const entranceTimer = setTimeout(() => setIsVisible(true), 100)
    const exitTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 500) // Wait for exit animation before calling onClose
    }, duration)

    return () => {
      clearTimeout(entranceTimer)
      clearTimeout(exitTimer)
    }
  }, [duration, onClose])

  return (
    <div
        role="alert"
        className={`fixed top-[50px] right-4 flex items-start p-6 mb-4 text-white rounded-lg bg-[#20a3b4] max-w-md shadow-lg transition-all duration-500 ease-in-out transform 
        ${isVisible ? "translate-x-0" : "translate-x-full"}
        overflow-hidden`}
        style={{
        boxShadow: "0 10px 15px -3px rgba(32, 163, 180, 0.3), 0 4px 6px -2px rgba(32, 163, 180, 0.2)",
        }}
    >
      <div className="relative z-10 flex items-start">
        <div className="flex-shrink-0 w-8 h-8 mr-3">
          <svg className="w-full h-full" viewBox="0 0 24 24">
            <circle className="text-[#1c8f9e] fill-current" cx="12" cy="12" r="10" />
            <path
              className="text-white fill-current"
              d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"
            >
              <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.6s" fill="freeze" begin="0.2s" />
            </path>
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm">{message}</p>
        </div>
        <button
          type="button"
          className="flex-shrink-0 ml-auto -mr-2 -mt-2 text-white rounded-full focus:ring-2 focus:ring-white p-1.5 inline-flex h-8 w-8 hover:bg-[#1c8f9e] transition-colors duration-200"
          aria-label="Close"
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 500)
          }}
        >
          <span className="sr-only">Close</span>
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

