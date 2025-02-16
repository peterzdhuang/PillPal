'use client'
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import type { Worker } from 'tesseract.js';
import { Camera, X } from 'lucide-react';
import { convertJsonToMedicationFields } from './JsonToMed';

export interface MedicationFields {
  pharmacyName: string;
  pharmacyAddress: string;
  pillName: string;
  date: string;
  numberOfPills: string;
  frequency: string;
  directions: string;
  refills: string;
}

interface TextScannerProps {
  onClose: () => void;
  onTextExtracted: (fields: MedicationFields) => void;
}

export default function TextScanner({ onClose, onTextExtracted }: TextScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isScanning && extractedText) {
      const processText = async () => {
        try {
          // Wait for the backend to respond
          const json = await sendTextToBackend(extractedText);
          console.log("Raw JSON:", json);
  
          // Convert the JSON to your MedicationFields object (if needed, await if it's async)
          const converted = convertJsonToMedicationFields(json);
          console.log("Converted MedicationFields:", converted);
  
          // Pass the converted data to the parent component
          onTextExtracted(converted);
        } catch (error) {
          console.error("Error processing text:", error);
        }
      };
  
      processText();
    }
  }, [extractedText, isScanning]);
  
  
  // Initialize camera and OCR worker
  useEffect(() => {
    const initialize = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise(resolve => {
            videoRef.current!.onloadedmetadata = resolve;
          });
        }

        workerRef.current = await createWorker();
        await workerRef.current.loadLanguage('eng');
        await workerRef.current.initialize('eng');
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Initialization failed');
        setLoading(false);
      }
    };

    initialize();

    return () => {
      workerRef.current?.terminate();
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, []);

  // Send raw OCR text to backend and use the JSON response to auto-fill form fields
  const sendTextToBackend = async (text: string) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/scan/',
        { text },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log("Response data:", response.data);
      return response["data"];
    } catch (err) {
      setError('Failed to send data to backend');
    }
  };

  const captureAndOCR = async () => {
    if (!videoRef.current || !canvasRef.current || !workerRef.current) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0);

      // Enhance image quality before OCR
      ctx!.filter = 'contrast(150%) grayscale(100%) brightness(110%)';
      ctx?.drawImage(video, 0, 0);

      const { data: { text } } = await workerRef.current.recognize(canvas);
      setExtractedText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR failed');
    }
  };

  const toggleScanning = async () => {
    if (!isScanning) {
      setIsScanning(true);
      captureAndOCR();
    } else {
      setIsScanning(false);
    }
  };

  return (
    <div className="relative h-full w-full">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="h-full w-full object-cover"
      />
      
      <canvas ref={canvasRef} hidden />
  
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-2 rounded-full bg-background/50 hover:bg-background transition-colors z-15"
      >
        <X />
      </button>
  
      {/* Scan Button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={toggleScanning}
          disabled={loading || !!error}
          className={`flex items-center gap-2 px-6 py-3 rounded-full ${
            isScanning 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-primary hover:bg-primary/90'
          } text-primary-foreground font-medium transition-colors`}
        >
          {loading ? 'Initializing...' : isScanning ? 'Stop Scan' : 'Start Scan'}
        </button>
      </div>
  
      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg z-10">
          Error: {error}
        </div>
      )}
    </div>
  );
}
