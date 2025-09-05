'use client'

import * as React from 'react'

export interface SimpleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Literally nothing extra
}

const SimpleInput = React.forwardRef<HTMLInputElement, SimpleInputProps>(
  ({ children, ...props }, ref) => {
    // Completely ignore children and pass only safe props
    return (
      <input
        ref={ref}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        {...props}
      />
    )
  }
)
SimpleInput.displayName = 'SimpleInput'

export { SimpleInput }