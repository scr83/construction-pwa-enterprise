'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/atoms/Icon'

const radioButtonVariants = cva(
  'inline-flex items-center justify-center border-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      variant: {
        default: 'border-secondary-300 bg-white hover:border-primary-400 focus:ring-primary-500 checked:border-primary-600',
        success: 'border-secondary-300 bg-white hover:border-green-400 focus:ring-green-500 checked:border-green-600',
        warning: 'border-secondary-300 bg-white hover:border-orange-400 focus:ring-orange-500 checked:border-orange-600',
        danger: 'border-secondary-300 bg-white hover:border-red-400 focus:ring-red-500 checked:border-red-600',
        
        // Construction-specific variants
        quality: 'border-secondary-300 bg-white hover:border-purple-400 focus:ring-purple-500 checked:border-purple-600',
        safety: 'border-secondary-300 bg-white hover:border-yellow-400 focus:ring-yellow-500 checked:border-yellow-600',
      },
      state: {
        default: '',
        error: 'border-red-500 bg-red-50',
        disabled: 'opacity-50 cursor-not-allowed bg-secondary-50',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
      state: 'default',
    },
  }
)

export interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof radioButtonVariants> {
  // Label and description
  label?: string
  description?: string
  
  // State management
  checked?: boolean
  value: string
  name: string
  
  // Validation
  required?: boolean
  error?: string
  
  // Construction-specific
  inspectionOption?: boolean
  
  // Layout
  labelPosition?: 'right' | 'left'
  reverse?: boolean
  
  // Group context
  groupError?: string
  
  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
}

const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      className,
      size,
      variant,
      state,
      label,
      description,
      checked,
      value,
      name,
      onChange,
      required = false,
      error,
      groupError,
      inspectionOption = false,
      labelPosition = 'right',
      reverse = false,
      disabled,
      id,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const radioId = id || `${generatedId}-${value}`
    
    const finalState = (error || groupError) ? 'error' : disabled ? 'disabled' : state
    const finalError = error || groupError
    
    // Get the inner dot color based on variant
    const getInnerDotColor = () => {
      switch (variant) {
        case 'success':
          return 'bg-green-600'
        case 'warning':
          return 'bg-orange-600'
        case 'danger':
          return 'bg-red-600'
        case 'quality':
          return 'bg-purple-600'
        case 'safety':
          return 'bg-yellow-600'
        default:
          return 'bg-primary-600'
      }
    }

    const radioElement = (
      <div className="relative inline-flex items-center">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          value={value}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="sr-only peer"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          {...props}
        />
        
        <div
          className={cn(
            radioButtonVariants({ size, variant, state: finalState }),
            className
          )}
        >
          {/* Inner dot when checked */}
          {checked && (
            <div
              className={cn(
                'rounded-full transition-all duration-200',
                size === 'sm' ? 'h-1.5 w-1.5' : size === 'lg' ? 'h-2.5 w-2.5' : 'h-2 w-2',
                getInnerDotColor()
              )}
            />
          )}
        </div>
      </div>
    )

    const labelElement = label && (
      <div className={cn('select-none', disabled && 'opacity-50')}>
        <label 
          htmlFor={radioId}
          className={cn(
            'text-sm font-medium cursor-pointer',
            inspectionOption && 'font-normal',
            finalError ? 'text-red-700' : 'text-secondary-900'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {description && (
          <p className={cn(
            'text-xs mt-1',
            finalError ? 'text-red-600' : 'text-secondary-600'
          )}>
            {description}
          </p>
        )}
        
        {error && (
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <Icon name="alert-circle" size="xs" />
            {error}
          </p>
        )}
      </div>
    )

    if (!label) {
      return radioElement
    }

    const content = reverse 
      ? [labelElement, radioElement]
      : labelPosition === 'left' 
        ? [labelElement, radioElement]
        : [radioElement, labelElement]

    return (
      <div className={cn(
        'flex items-start gap-3',
        reverse && 'flex-row-reverse',
        labelPosition === 'left' && !reverse && 'flex-row-reverse'
      )}>
        {content[0]}
        {content[1]}
      </div>
    )
  }
)

RadioButton.displayName = 'RadioButton'

// Radio Group Component
export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  name: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  
  // Layout
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'default' | 'lg'
  
  // Validation
  required?: boolean
  error?: string
  
  // Label
  label?: string
  description?: string
  
  // Accessibility
  'aria-label'?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      children,
      name,
      value,
      defaultValue,
      onValueChange,
      orientation = 'vertical',
      spacing = 'default',
      required = false,
      error,
      label,
      description,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '')
    const currentValue = value !== undefined ? value : internalValue
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value
      
      if (value === undefined) {
        setInternalValue(newValue)
      }
      
      if (onValueChange) {
        onValueChange(newValue)
      }
    }
    
    const spacingClasses = {
      sm: 'gap-2',
      default: 'gap-3',
      lg: 'gap-4',
    }
    
    const orientationClasses = {
      horizontal: 'flex-row flex-wrap',
      vertical: 'flex-col',
    }

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel || label}
        aria-required={required}
        aria-invalid={!!error}
        className={cn('space-y-2', className)}
        {...props}
      >
        {/* Group Label */}
        {label && (
          <div>
            <div className={cn(
              'text-sm font-medium',
              error ? 'text-red-700' : 'text-secondary-900'
            )}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </div>
            
            {description && (
              <p className={cn(
                'text-xs mt-1',
                error ? 'text-red-600' : 'text-secondary-600'
              )}>
                {description}
              </p>
            )}
          </div>
        )}
        
        {/* Radio Options */}
        <div className={cn(
          'flex',
          orientationClasses[orientation],
          spacingClasses[spacing]
        )}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement<RadioButtonProps>(child) && child.type === RadioButton) {
              return React.cloneElement(child, {
                name,
                checked: child.props.value === currentValue,
                onChange: handleChange,
                groupError: error,
                ...child.props,
              })
            }
            return child
          })}
        </div>
        
        {/* Group Error */}
        {error && !label && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <Icon name="alert-circle" size="xs" />
            {error}
          </p>
        )}
      </div>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

export { RadioButton, RadioGroup, radioButtonVariants }