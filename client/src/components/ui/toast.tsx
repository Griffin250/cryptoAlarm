import { toast as sonnerToast } from "sonner";

// Re-export all sonner toast functions
export const toast = {
  success: (message: string, options?: any) => sonnerToast.success(message, options),
  error: (message: string, options?: any) => sonnerToast.error(message, options),
  info: (message: string, options?: any) => sonnerToast.info(message, options),
  warning: (message: string, options?: any) => sonnerToast.warning(message, options),
  loading: (message: string, options?: any) => sonnerToast.loading(message, options),
  message: (message: string, options?: any) => sonnerToast.message(message, options),
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
};

export { Toaster } from "sonner";