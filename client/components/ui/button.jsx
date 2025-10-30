'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white hover:bg-slate-700',
        ghost: 'hover:bg-slate-100 hover:text-slate-900',
        outline: 'border border-slate-200 hover:bg-slate-100',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 px-2 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className = '', variant, size, children, ...props }, ref) => {
  const cls = buttonVariants({ variant, size, className });
  return (
    <button ref={ref} className={cls} {...props}>
      {children}
    </button>
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
