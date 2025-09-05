'use client'

import { useState } from 'react'
import { NavigationBar } from '@/components/organisms/NavigationBar'
import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { useSearchParams } from 'next/navigation'

// Toggle Component
const Toggle = ({ checked, onChange, disabled = false }: { 
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean 
}) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
      ${disabled 
        ? 'bg-gray-200 cursor-not-allowed' 
        : checked 
        ? 'bg-blue-600 hover:bg-blue-700' 
        : 'bg-gray-300 hover:bg-gray-400'
      }
    `}
    disabled={disabled}
  >
    <span
      className={`
        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
        ${checked ? 'translate-x-6' : 'translate-x-1'}
      `}
    />
  </button>
)

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'jefe_terreno'
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      projectUpdates: true,
      qualityAlerts: true,
      materialAlerts: false,
      teamNotifications: true,
      emailDigest: false,
      pushNotifications: true
    },
    appearance: {
      darkMode: false,
      compactView: false,
      language: 'es'
    },
    privacy: {
      locationSharing: true,
      automaticBackup: true,
      analyticsData: false,
      crashReports: true
    }
  })

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

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
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuración</h1>
          
          <div className="space-y-6">
            {/* Notificaciones */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notificaciones</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Actualizaciones de proyectos</span>
                    <p className="text-xs text-gray-600">Recibe notificaciones cuando hay cambios en tus proyectos</p>
                  </div>
                  <Toggle 
                    checked={settings.notifications.projectUpdates} 
                    onChange={(checked) => updateSetting('notifications', 'projectUpdates', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Alertas de calidad</span>
                    <p className="text-xs text-gray-600">Notificaciones sobre inspecciones y problemas de calidad</p>
                  </div>
                  <Toggle 
                    checked={settings.notifications.qualityAlerts} 
                    onChange={(checked) => updateSetting('notifications', 'qualityAlerts', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Alertas de materiales</span>
                    <p className="text-xs text-gray-600">Stock bajo, entregas pendientes y disponibilidad</p>
                  </div>
                  <Toggle 
                    checked={settings.notifications.materialAlerts} 
                    onChange={(checked) => updateSetting('notifications', 'materialAlerts', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Notificaciones de equipo</span>
                    <p className="text-xs text-gray-600">Asignaciones de tareas y actualizaciones del equipo</p>
                  </div>
                  <Toggle 
                    checked={settings.notifications.teamNotifications} 
                    onChange={(checked) => updateSetting('notifications', 'teamNotifications', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Resumen por email</span>
                    <p className="text-xs text-gray-600">Recibe un resumen diario de actividades por email</p>
                  </div>
                  <Toggle 
                    checked={settings.notifications.emailDigest} 
                    onChange={(checked) => updateSetting('notifications', 'emailDigest', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Notificaciones push</span>
                    <p className="text-xs text-gray-600">Recibe notificaciones instantáneas en el navegador</p>
                  </div>
                  <Toggle 
                    checked={settings.notifications.pushNotifications} 
                    onChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)} 
                  />
                </div>
              </div>
            </div>
            
            {/* Apariencia */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Apariencia e Interfaz</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Modo oscuro</span>
                    <p className="text-xs text-gray-600">Cambiar el tema de la interfaz a colores oscuros</p>
                  </div>
                  <Toggle 
                    checked={settings.appearance.darkMode} 
                    onChange={(checked) => updateSetting('appearance', 'darkMode', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Vista compacta</span>
                    <p className="text-xs text-gray-600">Mostrar más información en menos espacio</p>
                  </div>
                  <Toggle 
                    checked={settings.appearance.compactView} 
                    onChange={(checked) => updateSetting('appearance', 'compactView', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Idioma</span>
                    <p className="text-xs text-gray-600">Seleccionar idioma de la interfaz</p>
                  </div>
                  <select 
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                    value={settings.appearance.language}
                    onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
                  >
                    <option value="es">Español (Chile)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacidad y Datos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacidad y Datos</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Compartir ubicación</span>
                    <p className="text-xs text-gray-600">Permitir que la app acceda a tu ubicación para inspecciones</p>
                  </div>
                  <Toggle 
                    checked={settings.privacy.locationSharing} 
                    onChange={(checked) => updateSetting('privacy', 'locationSharing', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Backup automático</span>
                    <p className="text-xs text-gray-600">Respaldar automáticamente tus datos y configuraciones</p>
                  </div>
                  <Toggle 
                    checked={settings.privacy.automaticBackup} 
                    onChange={(checked) => updateSetting('privacy', 'automaticBackup', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Datos de análisis</span>
                    <p className="text-xs text-gray-600">Compartir datos anónimos para mejorar la aplicación</p>
                  </div>
                  <Toggle 
                    checked={settings.privacy.analyticsData} 
                    onChange={(checked) => updateSetting('privacy', 'analyticsData', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Reportes de errores</span>
                    <p className="text-xs text-gray-600">Enviar automáticamente reportes de errores para correcciones</p>
                  </div>
                  <Toggle 
                    checked={settings.privacy.crashReports} 
                    onChange={(checked) => updateSetting('privacy', 'crashReports', checked)} 
                  />
                </div>
              </div>
            </div>

            {/* Zona horaria y Región */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración Regional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zona horaria</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="America/Santiago">Santiago, Chile (GMT-3)</option>
                    <option value="America/Buenos_Aires">Buenos Aires, Argentina (GMT-3)</option>
                    <option value="America/Lima">Lima, Perú (GMT-5)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Formato de fecha</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="dd/mm/yyyy">DD/MM/AAAA</option>
                    <option value="mm/dd/yyyy">MM/DD/AAAA</option>
                    <option value="yyyy-mm-dd">AAAA-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Cuenta y Datos</h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="primary">
                    Guardar Configuración
                  </Button>
                  <Button variant="secondary">
                    Exportar Datos
                  </Button>
                  <Button variant="destructive">
                    Restablecer Configuración
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Los cambios se guardan automáticamente. La configuración se sincroniza entre dispositivos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}