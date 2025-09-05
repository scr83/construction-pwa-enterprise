import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/api/auth',
]

// Rutas que requieren autenticación
const protectedRoutes = [
  '/dashboard',
  '/projects', 
  '/quality',
  '/reports',
  '/profile',
  '/settings',
  '/notifications',
  '/help'
]

// Función para verificar si una ruta es pública
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route === '/api/auth') {
      return pathname.startsWith('/api/auth/')
    }
    return pathname === route || pathname.startsWith(`${route}/`)
  })
}

// Función para verificar si una ruta requiere autenticación
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Si es una ruta pública, permitir acceso
    if (isPublicRoute(pathname)) {
      return NextResponse.next()
    }

    // Si es una ruta protegida y no hay token, redirigir a login
    if (isProtectedRoute(pathname) && !token) {
      const loginUrl = new URL('/auth/login', req.url)
      loginUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Si el usuario está autenticado y trata de acceder a auth pages, redirigir al dashboard
    if (token && (pathname === '/auth/login' || pathname === '/auth/register')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }


    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Permitir acceso a rutas públicas sin token
        if (isPublicRoute(pathname)) {
          return true
        }

        // Para rutas protegidas, requiere token
        if (isProtectedRoute(pathname)) {
          return !!token
        }

        // Por defecto, permitir acceso
        return true
      },
    },
    pages: {
      signIn: '/auth/login',
      error: '/auth/error',
    }
  }
)

// Configurar qué rutas debe procesar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - public assets (images, icons, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}