'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const typographyVariants = cva('', {
  variants: {
    variant: {
      // Display headings for main titles
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-900',
      h2: 'scroll-m-20 text-3xl font-bold tracking-tight text-primary-900',
      h3: 'scroll-m-20 text-2xl font-bold tracking-tight text-primary-800',
      h4: 'scroll-m-20 text-xl font-bold tracking-tight text-primary-800',
      h5: 'scroll-m-20 text-lg font-bold tracking-tight text-primary-700',
      h6: 'scroll-m-20 text-base font-bold tracking-tight text-primary-700',
      
      // Body text variants optimized for readability
      'body-large': 'text-lg leading-7 text-secondary-800 font-medium',
      'body-default': 'text-base leading-6 text-secondary-800',
      'body-small': 'text-sm leading-5 text-secondary-700',
      
      // High contrast variants for outdoor visibility
      'high-contrast-large': 'text-lg leading-7 text-neutral-900 font-bold contrast-more:text-black',
      'high-contrast': 'text-base leading-6 text-neutral-900 font-semibold contrast-more:text-black',
      'high-contrast-small': 'text-sm leading-5 text-neutral-800 font-semibold contrast-more:text-black',
      
      // Status text variants with semantic colors
      'status-success': 'text-success-700 font-medium',
      'status-warning': 'text-warning-700 font-medium',
      'status-danger': 'text-danger-700 font-medium',
      'status-info': 'text-primary-700 font-medium',
      
      // Field labels optimized for forms
      'label-large': 'text-base font-semibold text-secondary-800 leading-none',
      'label-default': 'text-sm font-semibold text-secondary-800 leading-none',
      'label-small': 'text-xs font-semibold text-secondary-700 leading-none uppercase tracking-wide',
      
      // Help text and captions
      caption: 'text-xs text-secondary-600 leading-4',
      'help-text': 'text-sm text-secondary-600 leading-5',
      
      // Code and monospace for technical data
      code: 'relative rounded bg-secondary-100 px-2 py-1 font-mono text-sm text-secondary-900',
      
      // Lead text for important descriptions
      lead: 'text-xl text-secondary-700 leading-8 font-medium',
      
      // Muted text for secondary information
      muted: 'text-sm text-secondary-500',
      
      // Links with construction theme
      link: 'text-primary-600 hover:text-primary-800 underline underline-offset-4 font-medium',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    color: {
      default: 'text-secondary-800',
      muted: 'text-secondary-500',
      primary: 'text-primary-700',
      success: 'text-success-700',
      warning: 'text-warning-700',
      danger: 'text-danger-700',
      white: 'text-white',
      black: 'text-black',
    },
    truncate: {
      true: 'truncate',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'body-default',
    align: 'left',
    color: 'default',
    truncate: false,
  },
})

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label' | 'code' | 'pre' | 'a'
  children: React.ReactNode
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant,
      size,
      weight,
      align,
      color,
      truncate,
      as,
      children,
      ...props
    },
    ref
  ) => {
    // Determine the default HTML element based on variant
    const getDefaultElement = (variant: string | null | undefined): keyof JSX.IntrinsicElements => {
      if (!variant) return 'p'
      
      if (variant.startsWith('h') && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant)) {
        return variant as keyof JSX.IntrinsicElements
      }
      
      if (variant.startsWith('label')) return 'label'
      if (variant === 'code') return 'code'
      if (variant === 'link') return 'a'
      
      return 'p'
    }

    const Component = (as || getDefaultElement(variant)) as keyof JSX.IntrinsicElements

    return React.createElement(
      Component,
      {
        className: cn(
          typographyVariants({ variant, size, weight, align, color, truncate }),
          className
        ),
        ref,
        ...props,
      },
      children
    )
  }
)
Typography.displayName = 'Typography'

export { Typography, typographyVariants }