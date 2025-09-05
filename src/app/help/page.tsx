'use client'

import { NavigationBar } from '@/components/organisms/NavigationBar'
import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { useSearchParams } from 'next/navigation'

export default function HelpPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'jefe_terreno'

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar 
        currentUser={{
          id: 'user-1',
          name: 'Juan Pérez',
          role: role === 'gerencia' ? 'EXECUTIVE' : 'SITE_MANAGER',
          isOnline: true
        }}
      />
      
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8">
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-4">
              <span className="text-4xl">❓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Ayuda</h1>
            <p className="text-gray-600 mb-8">Encuentra respuestas a tus preguntas y aprende a usar ConstructorPro</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center text-blue-600 mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Centro de Ayuda</h2>
              <p className="text-blue-700 mb-4">
                El sistema de ayuda y documentación está en desarrollo activo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-left mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Guías Básicas</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Primeros pasos</li>
                  <li>• Navegación por roles</li>
                  <li>• Gestión de proyectos</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Funcionalidades</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Control de calidad</li>
                  <li>• Gestión de inventarios</li>
                  <li>• Reportes y análisis</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Soporte Técnico</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Contactar soporte</li>
                  <li>• Reportar problemas</li>
                  <li>• Solicitar funciones</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <Button onClick={() => window.history.back()}>
                ← Volver al Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}