import React, { useState, useEffect, useCallback, useContext, createContext, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

const variantStyles: Record<ToastVariant, { bg: string; icon: ReactNode }> = {
  default: { bg: 'bg-background border', icon: null },
  success: { bg: 'bg-green-50 border-green-200', icon: <CheckCircle className="h-5 w-5 text-green-600" /> },
  error: { bg: 'bg-red-50 border-red-200', icon: <AlertCircle className="h-5 w-5 text-red-600" /> },
  warning: { bg: 'bg-yellow-50 border-yellow-200', icon: <AlertTriangle className="h-5 w-5 text-yellow-600" /> },
  info: { bg: 'bg-blue-50 border-blue-200', icon: <Info className="h-5 w-5 text-blue-600" /> }
};

function ToastContainer() {
  const context = React.useContext(ToastContext);
  if (!context) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {context.toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 p-4 rounded-xl shadow-lg border animate-in slide-in-from-right-full",
            variantStyles[toast.variant || 'default'].bg
          )}
        >
          {variantStyles[toast.variant || 'default'].icon}
          <div className="flex-1">
            {toast.title && <p className="font-semibold">{toast.title}</p>}
            {toast.description && <p className="text-sm text-muted-foreground">{toast.description}</p>}
          </div>
          <button onClick={() => context.removeToast(toast.id)} className="opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ToastProvider et ToastContainer sont déjà exportés ci-dessus
