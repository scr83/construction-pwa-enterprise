'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-9 px-3 py-2 text-sm',
        default: 'h-11 px-4 py-2 text-base', // Optimized for mobile touch
        lg: 'h-12 px-4 py-3 text-lg', // Better for field conditions
        xl: 'h-14 px-6 py-4 text-xl', // Maximum visibility outdoors
      },
      variant: {
        default: 'border-input',
        success: 'border-success-300 bg-success-50 focus-visible:ring-success-500',
        error: 'border-danger-300 bg-danger-50 focus-visible:ring-danger-500',
        warning: 'border-warning-300 bg-warning-50 focus-visible:ring-warning-500',
      },
      contrast: {
        default: '',
        high: 'bg-white border-2 border-neutral-400 text-neutral-900 placeholder:text-neutral-600 shadow-sm',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
      contrast: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  // Field optimization props
  label?: string
  helperText?: string
  errorMessage?: string
  successMessage?: string
  children?: React.ReactNode // Add children to prevent TypeScript errors, but they will be ignored
  
  // Icons and visual feedback
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
  loading?: boolean
  
  // Construction-specific features
  unitLabel?: string // For measurements (m², kg, etc.)
  gpsCoordinates?: boolean // Show GPS input mode
  weatherResistant?: boolean // High contrast mode for outdoor use
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      size,
      variant,
      contrast,
      label,
      helperText,
      errorMessage,
      successMessage,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      loading = false,
      unitLabel,
      gpsCoordinates = false,
      weatherResistant = false,
      disabled,
      children, // Destructure children to prevent it from being spread
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [inputType, setInputType] = React.useState(type)
    const inputId = React.useId()
    
    // Determine input variant based on state
    const getVariant = () => {
      if (errorMessage) return 'error'
      if (successMessage) return 'success'
      return variant || 'default'
    }
    
    // Apply high contrast for weather-resistant mode
    const getContrast = () => {
      if (weatherResistant) return 'high'
      return contrast || 'default'
    }

    React.useEffect(() => {
      if (showPasswordToggle && type === 'password') {
        setInputType(showPassword ? 'text' : 'password')
      }
    }, [showPassword, type, showPasswordToggle])

    const hasError = !!errorMessage
    const hasSuccess = !!successMessage && !hasError
    const hasHelperText = !!(helperText || errorMessage || successMessage)

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'mb-2 block text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              hasError ? 'text-danger-700' : 'text-secondary-800',
              weatherResistant && 'text-neutral-900 font-bold'
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          {/* Main input */}
          <input
            id={inputId}
            type={gpsCoordinates ? 'number' : inputType}
            step={gpsCoordinates ? '0.000001' : undefined}
            className={cn(
              inputVariants({ 
                size: weatherResistant ? 'lg' : size, 
                variant: getVariant(), 
                contrast: getContrast() 
              }),
              leftIcon && 'pl-10',
              (rightIcon || showPasswordToggle || loading || unitLabel) && 'pr-10',
              unitLabel && 'pr-16',
              className
            )}
            ref={ref}
            disabled={disabled || loading}
            aria-invalid={hasError}
            aria-describedby={
              hasHelperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          {/* Unit label for measurements */}
          {unitLabel && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {unitLabel}
            </div>
          )}
          
          {/* Right icon, password toggle, or loading */}
          {(rightIcon || showPasswordToggle || loading) && !unitLabel && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              
              {!loading && showPasswordToggle && type === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground focus:text-foreground"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
              
              {!loading && !showPasswordToggle && rightIcon && rightIcon}
            </div>
          )}
          
          {/* Status icon for success/error */}
          {(hasError || hasSuccess) && !loading && !rightIcon && !showPasswordToggle && !unitLabel && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {hasError && <AlertCircle className="h-4 w-4 text-danger-500" />}
              {hasSuccess && <Check className="h-4 w-4 text-success-500" />}
            </div>
          )}
        </div>
        
        {/* Helper text, error message, or success message */}
        {hasHelperText && (
          <div
            id={`${inputId}-helper`}
            className={cn(
              'mt-2 text-sm',
              hasError && 'text-danger-600',
              hasSuccess && 'text-success-600',
              !hasError && !hasSuccess && 'text-muted-foreground',
              weatherResistant && 'font-medium'
            )}
          >
            {errorMessage || successMessage || helperText}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }