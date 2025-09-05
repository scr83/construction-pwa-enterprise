'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/atoms/Icon'

const checkboxVariants = cva(
  'inline-flex items-center justify-center border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5', 
        lg: 'h-6 w-6',
      },
      variant: {
        default: 'border-secondary-300 bg-white hover:border-primary-400 focus:ring-primary-500 checked:bg-primary-600 checked:border-primary-600',
        success: 'border-secondary-300 bg-white hover:border-green-400 focus:ring-green-500 checked:bg-green-600 checked:border-green-600',
        warning: 'border-secondary-300 bg-white hover:border-orange-400 focus:ring-orange-500 checked:bg-orange-600 checked:border-orange-600',
        danger: 'border-secondary-300 bg-white hover:border-red-400 focus:ring-red-500 checked:bg-red-600 checked:border-red-600',
        
        // Construction-specific variants
        quality: 'border-secondary-300 bg-white hover:border-purple-400 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600',
        safety: 'border-secondary-300 bg-white hover:border-yellow-400 focus:ring-yellow-500 checked:bg-yellow-600 checked:border-yellow-600',
      },
      shape: {
        square: 'rounded-md',
        rounded: 'rounded-lg',
        circle: 'rounded-full',
      },
      state: {
        default: '',
        indeterminate: 'bg-primary-600 border-primary-600',
        error: 'border-red-500 bg-red-50',
        disabled: 'opacity-50 cursor-not-allowed bg-secondary-50',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
      shape: 'square',
      state: 'default',
    },
  }
)

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  // Label and description
  label?: string
  description?: string
  
  // State management
  checked?: boolean
  indeterminate?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  
  // Validation
  required?: boolean
  error?: string
  
  // Construction-specific
  checklistItem?: boolean
  mandatory?: boolean
  
  // Visual customization
  icon?: string
  checkedIcon?: string
  indeterminateIcon?: string
  
  // Layout
  labelPosition?: 'right' | 'left'
  reverse?: boolean
  
  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      size,
      variant,
      shape,
      state,
      label,
      description,
      checked,
      indeterminate = false,
      defaultChecked,
      onCheckedChange,
      onChange,
      required = false,
      error,
      checklistItem = false,
      mandatory = false,
      icon,
      checkedIcon = 'check',
      indeterminateIcon = 'minus',
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
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false)
    const checkboxRef = React.useRef<HTMLInputElement>(null)
    const generatedId = React.useId()
    const checkboxId = id || generatedId
    
    // Use controlled or uncontrolled state
    const isChecked = checked !== undefined ? checked : internalChecked
    const finalState = error ? 'error' : disabled ? 'disabled' : indeterminate ? 'indeterminate' : state
    
    // Handle checkbox change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return
      
      const newChecked = event.target.checked
      
      if (checked === undefined) {
        setInternalChecked(newChecked)
      }
      
      if (onCheckedChange) {
        onCheckedChange(newChecked)
      }
      
      if (onChange) {
        onChange(event)
      }
    }
    
    // Set indeterminate state on the DOM element
    React.useEffect(() => {
      const checkbox = ref || checkboxRef
      if (checkbox && 'current' in checkbox && checkbox.current) {
        checkbox.current.indeterminate = indeterminate
      }
    }, [indeterminate, ref])
    
    // Get the appropriate icon
    const getIcon = () => {
      if (indeterminate) return indeterminateIcon
      if (isChecked) return checkedIcon
      return icon
    }
    
    const displayIcon = getIcon()

    const checkboxElement = (
      <div className="relative inline-flex items-center">
        <input
          ref={ref || checkboxRef}
          type="checkbox"
          id={checkboxId}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="sr-only peer"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          {...props}
        />
        
        <div
          className={cn(
            checkboxVariants({ size, variant, shape, state: finalState }),
            isChecked && 'text-white',
            indeterminate && 'text-white',
            className
          )}
        >
          {displayIcon && (isChecked || indeterminate) && (
            <Icon 
              name={displayIcon as any} 
              size={size === 'sm' ? 'xs' : size === 'lg' ? 'sm' : 'xs'}
              className="stroke-[3]"
            />
          )}
        </div>
        
        {/* Mandatory indicator */}
        {mandatory && (
          <span className="absolute -top-1 -right-1 text-red-500 text-xs">*</span>
        )}
      </div>
    )

    const labelElement = label && (
      <div className={cn('select-none', disabled && 'opacity-50')}>
        <label 
          htmlFor={checkboxId}
          className={cn(
            'text-sm font-medium cursor-pointer',
            checklistItem && 'font-normal',
            error ? 'text-red-700' : 'text-secondary-900'
          )}
        >
          {label}
          {required && !mandatory && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {description && (
          <p className={cn(
            'text-xs mt-1',
            error ? 'text-red-600' : 'text-secondary-600'
          )}>
            {description}
          </p>
        )}
        
        {error && (
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <Icon name="alert-triangle" size="xs" />
            {error}
          </p>
        )}
      </div>
    )

    if (!label) {
      return checkboxElement
    }

    const content = reverse 
      ? [labelElement, checkboxElement]
      : labelPosition === 'left' 
        ? [labelElement, checkboxElement]
        : [checkboxElement, labelElement]

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

Checkbox.displayName = 'Checkbox'

export { Checkbox, checkboxVariants }