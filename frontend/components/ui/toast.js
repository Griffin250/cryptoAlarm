'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

let toastCount = 0
let toastCallbacks = []

export const toast = {
  success: (message) => {
    toastCallbacks.forEach(callback => callback({
      id: ++toastCount,
      type: 'success',
      message,
      timestamp: Date.now()
    }))
  },
  error: (message) => {
    toastCallbacks.forEach(callback => callback({
      id: ++toastCount,
      type: 'error',
      message,
      timestamp: Date.now()
    }))
  },
  info: (message) => {
    toastCallbacks.forEach(callback => callback({
      id: ++toastCount,
      type: 'info',
      message,
      timestamp: Date.now()
    }))
  }
}

function Toast({ toast: toastItem, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toastItem.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [toastItem.id, onRemove])

  const getToastStyles = () => {
    switch (toastItem.type) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'info':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-800 text-white'
    }
  }

  return (
    <div className={`${getToastStyles()} p-4 rounded-md shadow-lg flex items-center justify-between min-w-80 animate-slide-in`}>
      <span className="text-sm font-medium">{toastItem.message}</span>
      <button
        onClick={() => onRemove(toastItem.id)}
        className="ml-4 p-1 hover:bg-black hover:bg-opacity-20 rounded"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleNewToast = (newToast) => {
      setToasts(prev => [...prev, newToast])
    }

    toastCallbacks.push(handleNewToast)

    return () => {
      toastCallbacks = toastCallbacks.filter(callback => callback !== handleNewToast)
    }
  }, [])

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toastItem => (
          <Toast key={toastItem.id} toast={toastItem} onRemove={removeToast} />
        ))}
      </div>
    </>
  )
}