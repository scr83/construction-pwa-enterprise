'use client'

import { ProtectedLayout } from "@/components/layouts/ProtectedLayout"
import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { useSearchParams } from 'next/navigation'

export default function NewInspectionPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'jefe_terreno'

  return (
    <ProtectedLayout>
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8">
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Inspección</h1>
            <p className="text-gray-600 mb-8">Crea una nueva inspección de calidad o seguridad</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center text-blue-600 mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Sistema de Inspecciones</h2>
              <p className="text-blue-700 mb-4">
                El formulario de creación de inspecciones está siendo desarrollado.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-left mb-8">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-green-900">Calidad</h3>
                  <Badge variant="success" size="sm">Disponible</Badge>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Inspección de materiales</li>
                  <li>• Control de acabados</li>
                  <li>• Verificación técnica</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-orange-900">Seguridad</h3>
                  <Badge variant="warning" size="sm">Próximamente</Badge>
                </div>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Evaluación de riesgos</li>
                  <li>• Check EPP</li>
                  <li>• Condiciones del sitio</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-900">Estructural</h3>
                  <Badge variant="primary" size="sm">En desarrollo</Badge>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Resistencia de materiales</li>
                  <li>• Alineación y nivelación</li>
                  <li>• Cargas y tensiones</li>
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
    </ProtectedLayout>
  )
}