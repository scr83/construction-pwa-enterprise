'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Input, type InputProps } from '@/components/atoms/Input'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'

const formFieldVariants = cva('w-full space-y-2', {
  variants: {
    variant: {
      default: '',
      compact: 'space-y-1',
      spaced: 'space-y-3',
    },
    orientation: {
      vertical: '',
      horizontal: 'flex items-center space-y-0 space-x-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    orientation: 'vertical',
  },
})

export interface FormFieldProps
  extends Omit<InputProps, 'label' | 'helperText' | 'errorMessage' | 'successMessage' | 'onChange'>,
    VariantProps<typeof formFieldVariants> {
  // Enhanced label options
  label: string
  labelDescription?: string // Additional context for the label
  required?: boolean
  optional?: boolean
  
  // Help and validation messages
  helperText?: string
  errorMessage?: string | string[] // Support for multiple error messages
  successMessage?: string
  warningMessage?: string
  
  // Construction-specific features
  constructionContext?: 'measurement' | 'quantity' | 'date' | 'notes' | 'code' | 'general'
  fieldCode?: string // Internal field code for tracking
  
  // Validation state override
  validationState?: 'valid' | 'invalid' | 'warning' | 'neutral'
  
  // Layout and styling
  labelWidth?: string // For horizontal layouts
  showAsterisk?: boolean // Show asterisk for required fields
  
  // Additional elements
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  tooltip?: string
  
  // Form integration
  name: string
  onValidation?: (isValid: boolean, fieldName: string) => void
  
  // Support both event and value onChange patterns
  onChange?: ((value: string) => void) | ((event: React.ChangeEvent<HTMLInputElement>) => void)
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      className,
      variant,
      orientation,
      label,
      labelDescription,
      required = false,
      optional = false,
      helperText,
      errorMessage,
      successMessage,
      warningMessage,
      constructionContext = 'general',
      fieldCode,
      validationState,
      labelWidth,
      showAsterisk = true,
      prefix,
      suffix,
      tooltip,
      name,
      onValidation,
      onChange,
      ...inputProps
    },
    ref
  ) => {
    const [internalValidation, setInternalValidation] = React.useState<'valid' | 'invalid' | 'warning' | 'neutral'>('neutral')
    // ✅ FIX #2: Track if field has been touched to prevent premature validation
    const [touched, setTouched] = React.useState(false)
    const inputId = React.useId()
    
    // Determine current validation state
    // ✅ FIX #2: Only show validation errors after field has been touched
    const currentValidationState = validationState || (() => {
      // Don't show validation errors until user has interacted with the field
      if (!touched) return 'neutral'
      
      if (errorMessage) return 'invalid'
      if (warningMessage) return 'warning'
      if (successMessage) return 'valid'
      return internalValidation
    })()
    
    // Get construction context icon
    const getContextIcon = () => {
      switch (constructionContext) {
        case 'measurement':
          return <Icon name="ruler" size="xs" variant="muted" />
        case 'quantity':
          return <Icon name="calculator" size="xs" variant="muted" />
        case 'date':
          return <Icon name="calendar" size="xs" variant="muted" />
        case 'notes':
          return <Icon name="edit" size="xs" variant="muted" />
        case 'code':
          return <Icon name="tag" size="xs" variant="muted" />
        default:
          return null
      }
    }
    
    // Get validation icon
    const getValidationIcon = () => {
      switch (currentValidationState) {
        case 'valid':
          return <Icon name="check-circle" size="xs" variant="success" />
        case 'invalid':
          return <Icon name="x-circle" size="xs" variant="danger" />
        case 'warning':
          return <Icon name="alert-triangle" size="xs" variant="warning" />
        default:
          return null
      }
    }
    
    // ✅ FIX #2: Handle blur event to mark field as touched
    const handleBlur = React.useCallback(() => {
      setTouched(true)
    }, [])
    
    // Handle input validation
    const handleValidation = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      // ✅ FIX #2: Mark as touched on first change
      if (!touched) {
        setTouched(true)
      }
      
      const value = e.target.value
      let isValid = true
      
      // FIXED: Proper validation logic
      if (required && !value.trim()) {
        // Empty required field = INVALID
        isValid = false
        setInternalValidation('invalid')
      } else if (inputProps.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        // Invalid email format = INVALID
        isValid = false
        setInternalValidation('invalid')
      } else if (inputProps.type === 'number' && value && isNaN(Number(value))) {
        // Invalid number = INVALID
        isValid = false
        setInternalValidation('invalid')
      } else if (value.trim()) {
        // HAS VALUE and passed validation = VALID (GREEN)
        isValid = true
        setInternalValidation('valid')
      } else {
        // Empty optional field = NEUTRAL (WHITE)
        isValid = true
        setInternalValidation('neutral')
      }
      
      // Notify parent component
      if (onValidation) {
        onValidation(isValid, name)
      }
      
      // Call original onChange if provided - support both patterns
      if (onChange) {
        // Try to determine if onChange expects value or event
        try {
          onChange(e.target.value)
        } catch (error) {
          // Fallback to event if value doesn't work
          onChange(e as any)
        }
      }
    }, [required, inputProps.type, onChange, onValidation, name, touched])
    
    // Format error messages
    const formatErrorMessages = (errors: string | string[]) => {
      if (Array.isArray(errors)) {
        return errors.map((error, index) => (
          <div key={index} className="flex items-center gap-1">
            <Icon name="x-circle" size="xs" variant="danger" />
            <Typography variant="body-small" color="danger">
              {error}
            </Typography>
          </div>
        ))
      }
      return (
        <div className="flex items-center gap-1">
          <Icon name="x-circle" size="xs" variant="danger" />
          <Typography variant="body-small" color="danger">
            {errors}
          </Typography>
        </div>
      )
    }
    
    const labelElement = (
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-1">
          {getContextIcon()}
          <div className="flex items-center gap-1">
            <Typography
              variant="label-default"
              as="label"
              htmlFor={inputId}
              className={cn(
                'cursor-pointer',
                currentValidationState === 'invalid' && 'text-danger-700'
              )}
            >
              {label}
              {required && showAsterisk && (
                <span className="text-danger-500 ml-1">*</span>
              )}
              {optional && (
                <span className="text-secondary-500 ml-1 text-xs">(opcional)</span>
              )}
            </Typography>
            
            {tooltip && (
              <div className="group relative">
                <Icon name="help-circle" size="xs" variant="muted" className="cursor-help" />
                <div className="absolute left-0 top-6 bg-neutral-900 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-48">
                  {tooltip}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {fieldCode && (
          <Typography variant="caption" color="muted" className="font-mono">
            {fieldCode}
          </Typography>
        )}
      </div>
    )
    
    const inputElement = (
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">
            {prefix}
          </div>
        )}
        
        <Input
          id={inputId}
          ref={ref}
          name={name}
          required={required}
          variant={
            currentValidationState === 'invalid' ? 'error' :
            currentValidationState === 'warning' ? 'warning' :
            currentValidationState === 'valid' ? 'success' :
            'default'
          }
          className={cn(
            prefix && 'pl-10',
            suffix && 'pr-10'
          )}
          aria-describedby={
            [
              helperText && `${inputId}-helper`,
              errorMessage && `${inputId}-error`,
              successMessage && `${inputId}-success`,
              warningMessage && `${inputId}-warning`,
            ].filter(Boolean).join(' ') || undefined
          }
          aria-invalid={currentValidationState === 'invalid'}
          onChange={handleValidation}
          onBlur={handleBlur}
          {...inputProps}
        />
        
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-500">
            {suffix}
          </div>
        )}
        
        {/* Validation icon */}
        {!suffix && currentValidationState !== 'neutral' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getValidationIcon()}
          </div>
        )}
      </div>
    )
    
    const messageElement = (
      <div className="space-y-1">
        {/* Helper text */}
        {helperText && !errorMessage && !warningMessage && (
          <Typography
            id={`${inputId}-helper`}
            variant="body-small"
            color="muted"
          >
            {helperText}
          </Typography>
        )}
        
        {/* Error messages */}
        {errorMessage && (
          <div id={`${inputId}-error`} className="space-y-1">
            {formatErrorMessages(errorMessage)}
          </div>
        )}
        
        {/* Warning message */}
        {warningMessage && !errorMessage && (
          <div id={`${inputId}-warning`} className="flex items-center gap-1">
            <Icon name="alert-triangle" size="xs" variant="warning" />
            <Typography variant="body-small" color="warning">
              {warningMessage}
            </Typography>
          </div>
        )}
        
        {/* Success message */}
        {successMessage && !errorMessage && !warningMessage && (
          <div id={`${inputId}-success`} className="flex items-center gap-1">
            <Icon name="check-circle" size="xs" variant="success" />
            <Typography variant="body-small" color="success">
              {successMessage}
            </Typography>
          </div>
        )}
      </div>
    )
    
    if (orientation === 'horizontal') {
      return (
        <div className={cn(formFieldVariants({ variant, orientation }), className)}>
          <div
            className={cn(
              'flex-shrink-0',
              labelWidth && `w-${labelWidth}`
            )}
          >
            {labelElement}
            {labelDescription && (
              <Typography variant="caption" color="muted" className="mt-1">
                {labelDescription}
              </Typography>
            )}
          </div>
          <div className="flex-1">
            {inputElement}
            {messageElement}
          </div>
        </div>
      )
    }
    
    return (
      <div className={cn(formFieldVariants({ variant, orientation }), className)}>
        {labelElement}
        {labelDescription && (
          <Typography variant="body-small" color="muted">
            {labelDescription}
          </Typography>
        )}
        {inputElement}
        {messageElement}
      </div>
    )
  }
)
FormField.displayName = 'FormField'

export { FormField, formFieldVariants }