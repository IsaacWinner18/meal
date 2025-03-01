"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { CheckCircle } from "lucide-react";

// Create a context to manage toast state
const ToastContext = createContext({
  showToast: (message) => {},
});

// Toast provider component
export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: "", visible: false });

  // Function to show toast with a message
  const showToast = (message) => {
    setToast({ message, visible: true });
  };

  // Hide toast after 3 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast component */}
      <div
        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-md bg-green-100 px-4 py-4 text-sm font-medium text-green-800 shadow-md transition-all duration-300 dark:bg-green-900 dark:text-green-100 ${
          toast.visible ? "translate-y-20 opacity-100" : "translate-y-[140px] opacity-0 pointer-events-none"
        }`}
      >
        <CheckCircle className="h-4 w-4" />
        <span>{toast.message}</span>
      </div>
    </ToastContext.Provider>
  );
}

// Hook to use the toast
export function useToast() {
  return useContext(ToastContext);
}

// Example usage component
export function CopyButton({ text, children }) {
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
    >
      {children}
    </button>
  );
}
