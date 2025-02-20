import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import cn from '@/lib/utils/cn';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export default function Button({
  children,
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}>
      {children}
    </button>
  );
}

const buttonVariants = cva('border', {
  variants: {
    variant: {
      primary:
        'rounded-lg border-primary bg-primary px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary hover:bg-primary focus:ring focus:ring-primary-200 disabled:cursor-not-allowed hover:cursor-pointer dark:disabled:border-1 disabled:border-cod-gray-600 disabled:bg-cod-gray-600 disabled:opacity-50',
      secondary:
        'rounded-lg border-secondary bg-secondary px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:bg-picton-blue-500 focus:ring focus:ring-gray-100 disabled:cursor-not-allowed dark:disabled:border-1 disabled:border-cod-gray-600 disabled:bg-cod-gray-600 disabled:opacity-50 disabled:text-gray-400 hover:cursor-pointer',
      ghost:
        'rounded-lg border-primary bg-transparent px-5 py-2.5 text-center text-sm font-medium text-primary shadow-none transition-all hover:bg-primary hover:text-white disabled:bg-transparent disabled:text-gray-400 hover:cursor-pointer',
      error:
        'rounded-lg border-red-500 bg-red-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300 hover:cursor-pointer',
      success:
        'rounded-lg border border-green-500 bg-green-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-green-700 hover:bg-green-700 focus:ring focus:ring-green-200 disabled:cursor-not-allowed disabled:border-green-300 disabled:bg-green-300',
    },
    size: {
      sm: 'px-3 py-1.5 text-center text-xs font-small',
      md: 'px-5 py-2.5 text-center text-base font-medium',
      lg: 'px-8 py-4 text-center text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
