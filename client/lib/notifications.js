import { Toast } from 'sonner';

export const notify = {
  success: (message) => {
    Toast({
      title: 'Success',
      description: message,
      duration: 4000,
      status: 'success',
    });
  },
  error: (message) => {
    Toast({
      title: 'Error',
      description: message,
      duration: 4000,
      status: 'error',
    });
  },
  warning: (message) => {
    Toast({
      title: 'Warning',
      description: message,
      duration: 4000,
      status: 'warning',
    });
  },
  info: (message) => {
    Toast({
      title: 'Info',
      description: message,
      duration: 4000,
      status: 'info',
    });
  },
};