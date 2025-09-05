'use client'

import { useRequireAuth } from '@/hooks/useAuth'
import { NavigationBar } from '@/components/organisms/NavigationBar'
import type { UserRole } from '@/lib/auth'

interface ProtectedLayoutProps {
  children: React.ReactNode
  requiredRole?: UserRole
  minimumRole?: UserRole
  className?: string
}

export function ProtectedLayout({ 
  children, 
  requiredRole, 
  minimumRole,
  className = "min-h-screen bg-gray-50"
}: ProtectedLayoutProps) {
  const { user, loading, authenticated } = useRequireAuth({
    requiredRole,
    minimumRole
  })

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Cargando...</p>
          <p className="text-gray-500 text-sm mt-2">Verificando sesión</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will be redirected)
  if (!authenticated || !user) {
    return null
  }

  return (
    <div className={className}>
      <NavigationBar 
        currentUser={{
          id: user.id,
          name: user.name || 'Usuario',
          role: user.role,
          isOnline: true
        }}
      />
      {children}
    </div>
  )
}