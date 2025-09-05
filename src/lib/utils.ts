import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'CLP'): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObject = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObject)
}

export function formatRelativeTime(date: Date | string): string {
  const dateObject = typeof date === 'string' ? new Date(date) : date
  const rtf = new Intl.RelativeTimeFormat('es-CL', { numeric: 'auto' })
  const diff = dateObject.getTime() - Date.now()
  const diffInDays = Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (Math.abs(diffInDays) < 1) {
    const diffInHours = Math.ceil(diff / (1000 * 60 * 60))
    if (Math.abs(diffInHours) < 1) {
      const diffInMinutes = Math.ceil(diff / (1000 * 60))
      return rtf.format(diffInMinutes, 'minute')
    }
    return rtf.format(diffInHours, 'hour')
  }

  if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, 'day')
  }

  const diffInMonths = Math.ceil(diffInDays / 30)
  return rtf.format(diffInMonths, 'month')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}