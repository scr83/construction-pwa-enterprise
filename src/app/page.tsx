'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { HardHat } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // REDIRECT ELIMINADO - Usuarios autenticados pueden ver landing page

  // Si está cargando la sesión, mostrar loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Usuarios autenticados pueden ver la landing page

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <HardHat className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-3">
              ConstructorPro PWA
            </h1>
            <p className="text-gray-600 mb-8">
              Gestión de Construcción Empresarial
            </p>
            
            {/* Call to Action Buttons */}
            <div className="space-y-4">
              <Link
                href="/auth/login"
                className="w-full inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <HardHat size={20} />
                Iniciar Sesión
              </Link>
              
              <div className="text-center">
                <Link
                  href="/auth/register" 
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  ¿No tienes cuenta? Regístrate aquí
                </Link>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">📱</span>
                </div>
                <p className="text-xs text-gray-600">Mobile-First</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🇨🇱</span>
                </div>
                <p className="text-xs text-gray-600">100% Chileno</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">⚡</span>
                </div>
                <p className="text-xs text-gray-600">37 Módulos</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500">
            <p className="mb-1">© 2024 ConstructorPro PWA</p>
            <p>de la Contru pa' la Contru</p>
          </div>
        </div>
      </div>
    </main>
  )
}
