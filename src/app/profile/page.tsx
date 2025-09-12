'use client'

import { ProtectedLayout } from "@/components/layouts/ProtectedLayout"
import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { Avatar } from '@/components/atoms/Avatar'
import { Badge } from '@/components/atoms/Badge'
import { useSearchParams } from 'next/navigation'

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'jefe_terreno'
  
  const getUserInfo = (role: string) => {
    if (role === 'gerencia') {
      return {
        name: 'Carlos Mendoza',
        email: 'carlos.mendoza@constructorpro.cl',
        roleName: 'Director Ejecutivo',
        department: 'Gerencia General',
        phone: '+56 9 8765 4321',
        location: 'Santiago, Chile',
        joinDate: 'Enero 2020'
      }
    } else {
      return {
        name: 'Juan Pérez',
        email: 'juan.perez@constructorpro.cl',
        roleName: 'Jefe de Terreno',
        department: 'Operaciones',
        phone: '+56 9 1234 5678',
        location: 'Las Condes, Santiago',
        joinDate: 'Marzo 2021'
      }
    }
  }
  
  const userInfo = getUserInfo(role)

  return (
    <ProtectedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información personal */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Personal</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{userInfo.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{userInfo.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{userInfo.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{userInfo.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <div className="flex items-center space-x-2">
                      <Badge variant={role === 'gerencia' ? 'primary' : 'success'} size="sm">
                        {userInfo.roleName}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{userInfo.department}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{userInfo.joinDate}</p>
                </div>

                <div className="pt-4">
                  <Button variant="primary" size="sm">
                    Editar Información
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Foto y estadísticas */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <Avatar 
                    size="xl"
                    name={userInfo.name}
                    className="mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-gray-900 text-lg">{userInfo.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{userInfo.roleName}</p>
                  <Button variant="secondary" size="sm">
                    Cambiar Foto
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r-lg">
                    <p className="text-sm font-medium text-blue-900">Inspección completada</p>
                    <p className="text-xs text-blue-700">Edificio Las Condes - Hace 2 horas</p>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded-r-lg">
                    <p className="text-sm font-medium text-green-900">Reporte generado</p>
                    <p className="text-xs text-green-700">Avance mensual - Ayer</p>
                  </div>
                  <div className="border-l-4 border-orange-500 bg-orange-50 p-3 rounded-r-lg">
                    <p className="text-sm font-medium text-orange-900">Material solicitado</p>
                    <p className="text-xs text-orange-700">Hormigón H25 - Hace 3 días</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Proyectos activos</span>
                    <span className="font-semibold text-gray-900">{role === 'gerencia' ? '8' : '3'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Inspecciones este mes</span>
                    <span className="font-semibold text-gray-900">{role === 'gerencia' ? '45' : '12'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reportes generados</span>
                    <span className="font-semibold text-gray-900">{role === 'gerencia' ? '23' : '8'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}