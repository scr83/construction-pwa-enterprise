'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { UserRole } from '@/lib/auth'

interface UseAuthOptions {
  redirectTo?: string
  requiredRole?: UserRole
  minimumRole?: UserRole
}

export function useAuth(options: UseAuthOptions = {}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const {
    redirectTo = '/auth/login',
    requiredRole,
    minimumRole
  } = options

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (status === 'unauthenticated') {
      router.push(redirectTo)
      return
    }

    // Check role permissions
    if (session?.user && requiredRole) {
      if (session.user.role !== requiredRole) {
        router.push('/dashboard?error=insufficient-permissions')
        return
      }
    }

    // Check minimum role level
    if (session?.user && minimumRole) {
      const roleHierarchy = {
        WORKER: 1,
        QUALITY_INSPECTOR: 2,
        SUPERVISOR: 3,
        SITE_MANAGER: 4,
        EXECUTIVE: 5,
      }

      const userLevel = roleHierarchy[session.user.role]
      const minimumLevel = roleHierarchy[minimumRole]

      if (userLevel < minimumLevel) {
        router.push('/dashboard?error=insufficient-permissions')
        return
      }
    }
  }, [status, session, router, redirectTo, requiredRole, minimumRole])

  return {
    user: session?.user,
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}

// Hook específico para páginas que requieren autenticación
export function useRequireAuth(options: UseAuthOptions = {}) {
  const auth = useAuth(options)
  
  if (auth.status === 'loading') {
    return { ...auth, loading: true }
  }

  if (auth.status === 'unauthenticated') {
    return { ...auth, loading: false, authenticated: false }
  }

  return { ...auth, loading: false, authenticated: true }
}