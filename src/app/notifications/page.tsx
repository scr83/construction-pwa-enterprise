'use client'

import { useState, useMemo } from 'react'
import { NavigationBar } from '@/components/organisms/NavigationBar'
import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { useSearchParams } from 'next/navigation'

type NotificationType = 'sistema' | 'proyecto' | 'calidad' | 'material' | 'equipo' | 'recordatorio'
type NotificationPriority = 'baja' | 'normal' | 'alta' | 'urgente'

interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  timestamp: string
  read: boolean
  projectName?: string
  actionRequired?: boolean
}

export default function NotificationsPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'jefe_terreno'
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all')
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all')

  // Mock notifications data based on role
  const getMockNotifications = (role: string): Notification[] => {
    const baseNotifications: Notification[] = [
      {
        id: '1',
        title: 'Inspección de calidad programada',
        message: 'Inspección estructural programada para mañana a las 09:00 hrs en Piso 5',
        type: 'calidad',
        priority: 'alta',
        timestamp: 'Hace 5 minutos',
        read: false,
        projectName: 'Edificio Las Condes',
        actionRequired: true
      },
      {
        id: '2',
        title: 'Material disponible en bodega',
        message: 'Ha llegado el pedido de hormigón H25. Disponible para retiro inmediato.',
        type: 'material',
        priority: 'normal',
        timestamp: 'Hace 15 minutos',
        read: false,
        projectName: 'Torre Central'
      },
      {
        id: '3',
        title: 'Reporte de avance completado',
        message: 'El reporte semanal de avance físico ha sido generado y está listo para revisión.',
        type: 'proyecto',
        priority: 'normal',
        timestamp: 'Hace 1 hora',
        read: true,
        projectName: 'Edificio Las Condes'
      },
      {
        id: '4',
        title: 'Asignación de equipo actualizada',
        message: 'Se ha reasignado el equipo de albañilería al sector norte del proyecto.',
        type: 'equipo',
        priority: 'normal',
        timestamp: 'Hace 2 horas',
        read: false,
        projectName: 'Complejo Residencial'
      },
      {
        id: '5',
        title: 'Recordatorio: Reunión de coordinación',
        message: 'Reunión de coordinación técnica programada para hoy a las 14:00 hrs.',
        type: 'recordatorio',
        priority: 'alta',
        timestamp: 'Hace 3 horas',
        read: false,
        actionRequired: true
      }
    ]

    if (role === 'gerencia') {
      return [
        ...baseNotifications,
        {
          id: '6',
          title: 'Presupuesto mensual disponible',
          message: 'El resumen financiero del mes está listo. Desviación del 2.3% bajo presupuesto.',
          type: 'sistema',
          priority: 'normal',
          timestamp: 'Hace 4 horas',
          read: true
        },
        {
          id: '7',
          title: 'Certificación ISO pendiente',
          message: 'La renovación de certificación ISO 9001 vence en 30 días.',
          type: 'sistema',
          priority: 'urgente',
          timestamp: 'Hace 6 horas',
          read: false,
          actionRequired: true
        }
      ]
    }

    return baseNotifications
  }

  const [notifications, setNotifications] = useState<Notification[]>(getMockNotifications(role))

  const filteredNotifications = useMemo(() => {
    let filtered = notifications

    // Apply read/unread filter
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read)
    } else if (filter === 'important') {
      filtered = filtered.filter(n => n.priority === 'alta' || n.priority === 'urgente')
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(n => n.type === selectedType)
    }

    return filtered.sort((a, b) => {
      // Sort by read status (unread first), then by priority
      if (a.read !== b.read) return a.read ? 1 : -1
      
      const priorityOrder = { urgente: 4, alta: 3, normal: 2, baja: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }, [notifications, filter, selectedType])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgente': return 'border-red-500 bg-red-50'
      case 'alta': return 'border-orange-500 bg-orange-50'
      case 'normal': return 'border-blue-500 bg-blue-50'
      case 'baja': return 'border-gray-500 bg-gray-50'
    }
  }

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'sistema': return '⚙️'
      case 'proyecto': return '🏗️'
      case 'calidad': return '🔍'
      case 'material': return '📦'
      case 'equipo': return '👥'
      case 'recordatorio': return '⏰'
    }
  }

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'sistema': return 'Sistema'
      case 'proyecto': return 'Proyecto'
      case 'calidad': return 'Calidad'
      case 'material': return 'Material'
      case 'equipo': return 'Equipo'
      case 'recordatorio': return 'Recordatorio'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : 'Todas las notificaciones están al día'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="secondary" size="sm" onClick={markAllAsRead}>
                Marcar todas como leídas
              </Button>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow mb-6">
            {/* Filter tabs */}
            <div className="border-b border-gray-200">
              <div className="p-6 pb-0">
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'all' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Todas ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'unread' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Sin leer ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilter('important')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'important' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Importantes
                  </button>
                </div>

                {/* Type filter */}
                <div className="flex flex-wrap gap-2 pb-4">
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as NotificationType | 'all')}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="sistema">Sistema</option>
                    <option value="proyecto">Proyecto</option>
                    <option value="calidad">Calidad</option>
                    <option value="material">Material</option>
                    <option value="equipo">Equipo</option>
                    <option value="recordatorio">Recordatorio</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Notifications list */}
            <div className="divide-y divide-gray-200">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-2">
                    <span className="text-4xl">📭</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
                  <p className="text-gray-600">No tienes notificaciones que coincidan con los filtros seleccionados.</p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'bg-blue-25' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">{getTypeIcon(notification.type)}</span>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={
                                notification.type === 'sistema' ? 'secondary' :
                                notification.type === 'proyecto' ? 'primary' :
                                notification.type === 'calidad' ? 'warning' :
                                notification.type === 'material' ? 'success' :
                                'secondary'
                              } 
                              size="sm"
                            >
                              {getTypeLabel(notification.type)}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            {notification.actionRequired && (
                              <Badge variant="warning" size="sm">Acción requerida</Badge>
                            )}
                          </div>
                        </div>
                        <h3 className={`text-sm font-medium mb-1 ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span>{notification.timestamp}</span>
                          {notification.projectName && (
                            <>
                              <span>•</span>
                              <span>{notification.projectName}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Marcar como leída
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notification settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Notificaciones</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="sm">
                Configurar Alertas
              </Button>
              <Button variant="secondary" size="sm">
                Pausar Notificaciones
              </Button>
              <Button variant="secondary" size="sm">
                Exportar Historial
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Puedes personalizar qué tipo de notificaciones recibir en la sección de configuración.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}