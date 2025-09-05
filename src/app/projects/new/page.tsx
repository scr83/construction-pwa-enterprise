'use client'

import { NavigationBar } from '@/components/organisms/NavigationBar'
import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { useSearchParams } from 'next/navigation'

export default function NewProjectPage() {
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
              <span className="text-4xl">🏗️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuevo Proyecto</h1>
            <p className="text-gray-600 mb-8">Crea y configura un nuevo proyecto de construcción</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center text-blue-600 mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Creación de Proyectos</h2>
              <p className="text-blue-700 mb-4">
                El formulario de creación de proyectos está siendo implementado.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Información Básica</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Nombre del proyecto</li>
                  <li>• Ubicación y dirección</li>
                  <li>• Cliente y contactos</li>
                  <li>• Fechas de inicio y término</li>
                  <li>• Presupuesto estimado</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Configuración Técnica</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Tipo de construcción</li>
                  <li>• Fases del proyecto</li>
                  <li>• Equipo asignado</li>
                  <li>• Permisos y documentación</li>
                  <li>• Especificaciones técnicas</li>
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