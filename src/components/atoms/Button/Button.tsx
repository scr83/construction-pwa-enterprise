'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px] touch-manipulation',
  {
    variants: {
      variant: {
        // Primary construction action
        primary:
          'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-md',
        // Secondary construction action
        secondary:
          'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300 border border-secondary-300',
        // Destructive actions (delete, cancel work)
        destructive:
          'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 shadow-md',
        // Success actions (approve, complete)
        success:
          'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 shadow-md',
        // Warning actions (pending review)
        warning:
          'bg-warning-500 text-warning-900 hover:bg-warning-600 active:bg-warning-700 shadow-md',
        // Outline for secondary actions
        outline:
          'border border-primary-300 bg-background hover:bg-primary-50 text-primary-700 active:bg-primary-100',
        // Ghost for subtle actions
        ghost:
          'hover:bg-secondary-100 text-secondary-700 active:bg-secondary-200',
        // Link style for navigation
        link: 'text-primary-600 underline-offset-4 hover:underline active:text-primary-800',
      },
      size: {
        // Extra small for dense interfaces (desktop only, still touch-friendly)
        xs: 'h-10 px-3 text-xs md:h-8',
        // Small for secondary actions
        sm: 'h-10 px-4 text-sm md:h-9',
        // Default size optimized for mobile touch
        default: 'h-11 px-6 text-sm',
        // Large for primary actions on mobile
        lg: 'h-12 px-8 text-base',
        // Extra large for important field actions
        xl: 'h-14 px-10 text-lg',
        // Icon only sizes (always touch-friendly)
        icon: 'h-11 w-11',
        'icon-sm': 'h-10 w-10 md:h-9 md:w-9',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span className={cn('flex-1', { 'sr-only': loading && !children })}>
          {children}
        </span>
        {!loading && rightIcon && <span className="flex-shrink-0 ml-1">{rightIcon}</span>}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }