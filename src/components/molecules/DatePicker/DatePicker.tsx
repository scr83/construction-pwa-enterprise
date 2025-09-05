'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Typography } from '@/components/atoms/Typography'
import { Badge } from '@/components/atoms/Badge'

const datePickerVariants = cva(
  'relative inline-block',
  {
    variants: {
      variant: {
        default: '',
        range: '',
        construction: '',
        mobile: 'w-full',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// Date range interface
export interface DateRange {
  start: Date | null
  end: Date | null
}

// Construction-specific date preset
export interface DatePreset {
  id: string
  label: string
  value: Date | DateRange
  icon?: string
  description?: string
  
  // Construction-specific metadata
  workDays?: boolean
  excludeWeekends?: boolean
  excludeHolidays?: boolean
}

// Construction calendar event
export interface ConstructionEvent {
  id: string
  date: Date
  type: 'HOLIDAY' | 'NON_WORKING' | 'WEATHER' | 'MILESTONE' | 'INSPECTION' | 'DEADLINE'
  title: string
  description?: string
  impact: 'NONE' | 'PARTIAL' | 'FULL' // Impact on work schedule
}

export interface DatePickerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof datePickerVariants> {
  // Date value(s)
  value?: Date | DateRange
  defaultValue?: Date | DateRange
  onValueChange?: (value: Date | DateRange | null) => void
  
  // Range selection
  selectRange?: boolean
  
  // Display configuration
  placeholder?: string
  dateFormat?: string
  showTime?: boolean
  timeFormat?: '12h' | '24h'
  
  // Calendar behavior
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  closeOnSelect?: boolean
  
  // Validation
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  disabledDaysOfWeek?: number[] // 0 = Sunday, 1 = Monday, etc.
  
  // Construction-specific features
  workingDaysOnly?: boolean
  excludeWeekends?: boolean
  excludeHolidays?: boolean
  constructionEvents?: ConstructionEvent[]
  
  // Quick presets
  presets?: DatePreset[]
  showPresets?: boolean
  
  // Localization
  locale?: 'es-ES' | 'en-US'
  weekStartsOn?: 0 | 1 // 0 = Sunday, 1 = Monday
  
  // Input styling
  inputSize?: 'sm' | 'default' | 'lg'
  error?: string
  required?: boolean
  disabled?: boolean
  
  // Construction calendar features
  showWorkDays?: boolean
  showWeather?: boolean
  showMilestones?: boolean
  highlightToday?: boolean
  
  // Mobile optimization
  mobileView?: 'calendar' | 'native'
  
  // Loading states
  isLoading?: boolean
  
  // Callbacks
  onDateHover?: (date: Date) => void
  onMonthChange?: (month: Date) => void
  onYearChange?: (year: number) => void
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      className,
      variant,
      size,
      value,
      defaultValue,
      onValueChange,
      selectRange = false,
      placeholder,
      dateFormat = 'dd/MM/yyyy',
      showTime = false,
      timeFormat = '24h',
      isOpen,
      onOpenChange,
      closeOnSelect = true,
      minDate,
      maxDate,
      disabledDates = [],
      disabledDaysOfWeek = [],
      workingDaysOnly = false,
      excludeWeekends = false,
      excludeHolidays = false,
      constructionEvents = [],
      presets = [],
      showPresets = true,
      locale = 'es-ES',
      weekStartsOn = 1,
      inputSize = 'default',
      error,
      required = false,
      disabled = false,
      showWorkDays = false,
      showWeather = false,
      showMilestones = false,
      highlightToday = true,
      mobileView = 'calendar',
      isLoading = false,
      onDateHover,
      onMonthChange,
      onYearChange,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const [currentMonth, setCurrentMonth] = React.useState(new Date())
    const [internalValue, setInternalValue] = React.useState<Date | DateRange | null>(defaultValue || null)
    const [hoverDate, setHoverDate] = React.useState<Date | null>(null)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    
    const open = isOpen !== undefined ? isOpen : internalOpen
    const currentValue = value !== undefined ? value : internalValue
    
    // Handle dropdown toggle
    const handleToggle = () => {
      if (disabled) return
      const newOpen = !open
      setInternalOpen(newOpen)
      if (onOpenChange) onOpenChange(newOpen)
    }
    
    // Format date for display
    const formatDate = (date: Date): string => {
      return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...(showTime && {
          hour: '2-digit',
          minute: '2-digit',
          hour12: timeFormat === '12h',
        }),
      }).format(date)
    }
    
    // Format date range for display
    const formatDateRange = (range: DateRange): string => {
      if (!range.start && !range.end) return ''
      if (range.start && !range.end) return formatDate(range.start)
      if (!range.start && range.end) return formatDate(range.end)
      if (range.start && range.end) {
        return `${formatDate(range.start)} - ${formatDate(range.end)}`
      }
      return ''
    }
    
    // Get display value
    const getDisplayValue = (): string => {
      if (!currentValue) return placeholder || 'Seleccionar fecha'
      
      if (selectRange && typeof currentValue === 'object' && 'start' in currentValue) {
        return formatDateRange(currentValue as DateRange)
      }
      
      if (currentValue instanceof Date) {
        return formatDate(currentValue)
      }
      
      return placeholder || 'Seleccionar fecha'
    }
    
    // Check if date is disabled
    const isDateDisabled = (date: Date): boolean => {
      // Check min/max dates
      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true
      
      // Check disabled dates
      if (disabledDates.some(d => d.toDateString() === date.toDateString())) return true
      
      // Check disabled days of week
      if (disabledDaysOfWeek.includes(date.getDay())) return true
      
      // Check weekends if excluded
      if (excludeWeekends && (date.getDay() === 0 || date.getDay() === 6)) return true
      
      // Check working days only
      if (workingDaysOnly) {
        const isWeekend = date.getDay() === 0 || date.getDay() === 6
        const isHoliday = constructionEvents.some(event => 
          event.date.toDateString() === date.toDateString() && 
          event.type === 'HOLIDAY'
        )
        if (isWeekend || isHoliday) return true
      }
      
      return false
    }
    
    // Get date classes for styling
    const getDateClasses = (date: Date): string => {
      const classes: string[] = []
      
      // Check if selected
      if (currentValue instanceof Date && date.toDateString() === currentValue.toDateString()) {
        classes.push('bg-primary-600 text-white')
      }
      
      // Check if in range (for range selection)
      if (selectRange && currentValue && typeof currentValue === 'object' && 'start' in currentValue) {
        const range = currentValue as DateRange
        if (range.start && range.end) {
          if (date >= range.start && date <= range.end) {
            classes.push('bg-primary-100')
          }
          if (date.toDateString() === range.start.toDateString() || date.toDateString() === range.end.toDateString()) {
            classes.push('bg-primary-600 text-white')
          }
        } else if (range.start && date.toDateString() === range.start.toDateString()) {
          classes.push('bg-primary-600 text-white')
        }
      }
      
      // Today highlight
      if (highlightToday && date.toDateString() === new Date().toDateString()) {
        classes.push('ring-2 ring-primary-500')
      }
      
      // Construction events
      const event = constructionEvents.find(e => e.date.toDateString() === date.toDateString())
      if (event) {
        switch (event.type) {
          case 'HOLIDAY':
            classes.push('bg-red-100 text-red-700')
            break
          case 'NON_WORKING':
            classes.push('bg-gray-100 text-gray-500')
            break
          case 'WEATHER':
            classes.push('bg-yellow-100 text-yellow-700')
            break
          case 'MILESTONE':
            classes.push('bg-blue-100 text-blue-700 ring-1 ring-blue-500')
            break
          case 'INSPECTION':
            classes.push('bg-purple-100 text-purple-700')
            break
          case 'DEADLINE':
            classes.push('bg-orange-100 text-orange-700 ring-1 ring-orange-500')
            break
        }
      }
      
      // Disabled state
      if (isDateDisabled(date)) {
        classes.push('opacity-50 cursor-not-allowed')
      } else {
        classes.push('hover:bg-primary-100 cursor-pointer')
      }
      
      return classes.join(' ')
    }
    
    // Handle date selection
    const handleDateSelect = (date: Date) => {
      if (isDateDisabled(date)) return
      
      let newValue: Date | DateRange | null = date
      
      if (selectRange) {
        if (!currentValue || !(typeof currentValue === 'object' && 'start' in currentValue)) {
          newValue = { start: date, end: null }
        } else {
          const range = currentValue as DateRange
          if (!range.start) {
            newValue = { start: date, end: null }
          } else if (!range.end) {
            if (date >= range.start) {
              newValue = { start: range.start, end: date }
            } else {
              newValue = { start: date, end: range.start }
            }
          } else {
            newValue = { start: date, end: null }
          }
        }
      }
      
      setInternalValue(newValue)
      if (onValueChange) onValueChange(newValue)
      
      // Close on select for single date selection or when range is complete
      if (closeOnSelect && (!selectRange || (selectRange && typeof newValue === 'object' && 'end' in newValue && newValue.end))) {
        setInternalOpen(false)
        if (onOpenChange) onOpenChange(false)
      }
    }
    
    // Handle preset selection
    const handlePresetSelect = (preset: DatePreset) => {
      setInternalValue(preset.value)
      if (onValueChange) onValueChange(preset.value)
      
      if (closeOnSelect) {
        setInternalOpen(false)
        if (onOpenChange) onOpenChange(false)
      }
    }
    
    // Generate calendar days for current month
    const getCalendarDays = (): Date[] => {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const startDate = new Date(firstDay)
      const endDate = new Date(lastDay)
      
      // Adjust for week start
      const startDayOfWeek = firstDay.getDay()
      const adjustedStart = weekStartsOn === 1 ? (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1) : startDayOfWeek
      startDate.setDate(startDate.getDate() - adjustedStart)
      
      // Fill to complete week
      const endDayOfWeek = lastDay.getDay()
      const adjustedEnd = weekStartsOn === 1 ? (endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek) : 6 - endDayOfWeek
      endDate.setDate(endDate.getDate() + adjustedEnd)
      
      const days: Date[] = []
      const current = new Date(startDate)
      
      while (current <= endDate) {
        days.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
      
      return days
    }
    
    // Get default construction presets
    const getDefaultPresets = (): DatePreset[] => {
      if (presets.length > 0) return presets
      
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      
      const thisWeekStart = new Date(today)
      thisWeekStart.setDate(today.getDate() - today.getDay() + (weekStartsOn === 1 ? 1 : 0))
      const thisWeekEnd = new Date(thisWeekStart)
      thisWeekEnd.setDate(thisWeekStart.getDate() + 6)
      
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      
      const defaultPresets: DatePreset[] = [
        {
          id: 'today',
          label: 'Hoy',
          value: today,
          icon: 'calendar-days',
        },
        {
          id: 'tomorrow',
          label: 'Mañana',
          value: tomorrow,
          icon: 'calendar-plus',
        },
      ]
      
      if (selectRange) {
        defaultPresets.push(
          {
            id: 'this-week',
            label: 'Esta Semana',
            value: { start: thisWeekStart, end: thisWeekEnd },
            icon: 'calendar-week',
            workDays: true,
          },
          {
            id: 'this-month',
            label: 'Este Mes',
            value: { start: thisMonthStart, end: thisMonthEnd },
            icon: 'calendar-month',
            workDays: true,
          }
        )
      }
      
      return defaultPresets
    }
    
    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setInternalOpen(false)
          if (onOpenChange) onOpenChange(false)
        }
      }
      
      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [open, onOpenChange])
    
    const calendarDays = getCalendarDays()
    const defaultPresets = getDefaultPresets()
    const weekDays = weekStartsOn === 1 
      ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'] 
      : ['D', 'L', 'M', 'X', 'J', 'V', 'S']

    return (
      <div
        ref={ref}
        className={cn(datePickerVariants({ variant, size }), className)}
        {...props}
      >
        {/* Input Trigger */}
        <Input
          ref={dropdownRef}
          value={getDisplayValue()}
          placeholder={placeholder}
          onClick={handleToggle}
          readOnly
          size={inputSize}
          error={error}
          required={required}
          disabled={disabled || isLoading}
          leftIcon={<Icon name="calendar" size="sm" />}
          rightIcon={
            isLoading ? (
              <Icon name="loader-2" size="sm" className="animate-spin" />
            ) : (
              <Icon name={open ? 'chevron-up' : 'chevron-down'} size="sm" />
            )
          }
          className={cn('cursor-pointer', disabled && 'cursor-not-allowed')}
        />
        
        {/* Calendar Dropdown */}
        {open && !isLoading && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-secondary-200 rounded-lg shadow-lg z-50 p-4 min-w-80">
            {/* Presets */}
            {showPresets && defaultPresets.length > 0 && (
              <div className="mb-4 pb-4 border-b border-secondary-100">
                <Typography variant="label-small" color="muted" className="mb-2">
                  Fechas Rápidas
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {defaultPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetSelect(preset)}
                      leftIcon={preset.icon ? <Icon name={preset.icon as any} size="xs" /> : undefined}
                    >
                      {preset.label}
                      {preset.workDays && (
                        <Badge size="xs" variant="info" className="ml-1">
                          Laborales
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newMonth = new Date(currentMonth)
                  newMonth.setMonth(newMonth.getMonth() - 1)
                  setCurrentMonth(newMonth)
                  if (onMonthChange) onMonthChange(newMonth)
                }}
              >
                <Icon name="chevron-left" size="sm" />
              </Button>
              
              <div className="flex items-center gap-2">
                <Typography variant="body-default" className="font-semibold">
                  {currentMonth.toLocaleDateString(locale, { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </Typography>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newMonth = new Date(currentMonth)
                  newMonth.setMonth(newMonth.getMonth() + 1)
                  setCurrentMonth(newMonth)
                  if (onMonthChange) onMonthChange(newMonth)
                }}
              >
                <Icon name="chevron-right" size="sm" />
              </Button>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {/* Week day headers */}
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-xs font-medium text-secondary-600"
                >
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                const event = constructionEvents.find(e => 
                  e.date.toDateString() === date.toDateString()
                )
                
                return (
                  <div
                    key={index}
                    className={cn(
                      'p-2 text-center text-sm rounded transition-colors relative',
                      isCurrentMonth ? 'text-secondary-900' : 'text-secondary-400',
                      getDateClasses(date)
                    )}
                    onClick={() => handleDateSelect(date)}
                    onMouseEnter={() => {
                      setHoverDate(date)
                      if (onDateHover) onDateHover(date)
                    }}
                    onMouseLeave={() => setHoverDate(null)}
                  >
                    <span className="relative z-10">
                      {date.getDate()}
                    </span>
                    
                    {/* Event indicator */}
                    {event && (
                      <div 
                        className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                        title={event.title}
                        style={{
                          backgroundColor: 
                            event.type === 'HOLIDAY' ? '#ef4444' :
                            event.type === 'MILESTONE' ? '#3b82f6' :
                            event.type === 'INSPECTION' ? '#8b5cf6' :
                            event.type === 'DEADLINE' ? '#f97316' :
                            event.type === 'WEATHER' ? '#eab308' :
                            '#6b7280'
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Construction Events Legend */}
            {constructionEvents.length > 0 && (showWorkDays || showWeather || showMilestones) && (
              <div className="pt-4 border-t border-secondary-100">
                <Typography variant="caption" color="muted" className="mb-2">
                  Leyenda
                </Typography>
                <div className="flex flex-wrap gap-3 text-xs">
                  {showMilestones && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Hitos</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>Feriados</span>
                  </div>
                  {showWeather && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span>Clima</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>Inspecciones</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span>Plazos</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Today button */}
            <div className="pt-4 border-t border-secondary-100 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const today = new Date()
                  setCurrentMonth(today)
                  handleDateSelect(today)
                }}
              >
                <Icon name="calendar-days" size="xs" className="mr-2" />
                Hoy
              </Button>
              
              {selectRange && currentValue && typeof currentValue === 'object' && 'start' in currentValue && (currentValue as DateRange).start && !(currentValue as DateRange).end && (
                <Typography variant="caption" color="muted">
                  Selecciona la fecha de fin
                </Typography>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

export { DatePicker, datePickerVariants }
export type { DateRange, DatePreset, ConstructionEvent }