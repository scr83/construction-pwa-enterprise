'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Importar componentes atómicos y moleculares
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { Card } from '@/components/atoms/Card'
import { NavigationBar } from '@/components/molecules/NavigationBar'
import { NotificationCenter } from '@/components/molecules/NotificationCenter'

// Definir variantes del componente
export const mobileTemplateVariants = cva(
  "min-h-screen bg-gray-50 font-sans",
  {
    variants: {
      orientation: {
        portrait: "max-w-sm mx-auto",
        landscape: "max-w-2xl mx-auto",
        responsive: "w-full"
      },
      density: {
        compact: "text-sm space-y-2",
        comfortable: "text-base space-y-4",
        spacious: "text-lg space-y-6"
      },
      theme: {
        light: "bg-white text-gray-900",
        dark: "bg-gray-900 text-white",
        auto: "bg-white text-gray-900 dark:bg-gray-900 dark:text-white",
        construction: "bg-orange-50 text-orange-900"
      },
      safeArea: {
        none: "",
        standard: "pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right",
        minimal: "pt-4 pb-4"
      }
    },
    defaultVariants: {
      orientation: "portrait",
      density: "comfortable",
      theme: "light",
      safeArea: "standard"
    }
  }
)

// Interfaces TypeScript
export interface PWAConfig {
  installable?: boolean
  standalone?: boolean
  enableNotifications?: boolean
  enableOffline?: boolean
  enableBackground?: boolean
  serviceWorkerUrl?: string
}

export interface GestureConfig {
  enableSwipe?: boolean
  enablePullToRefresh?: boolean
  enablePinchZoom?: boolean
  swipeThreshold?: number
  refreshThreshold?: number
}

export interface ResponsiveBreakpoint {
  mobile: number
  tablet: number
  desktop: number
}

export interface MobileNavigation {
  type: 'bottom' | 'drawer' | 'header' | 'floating'
  items: Array<{
    id: string
    label: string
    icon?: string
    badge?: number
    onClick: () => void
    active?: boolean
  }>
  position?: 'fixed' | 'sticky' | 'static'
}

export interface MobileNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  persistent?: boolean
  actions?: Array<{
    label: string
    action: () => void
  }>
  timestamp?: string
}

export interface OfflineCapability {
  enabled: boolean
  strategies: Array<'cache-first' | 'network-first' | 'stale-while-revalidate'>
  cachePaths?: string[]
  offlineMessage?: string
  syncOnReconnect?: boolean
}

export interface MobileTemplateProps extends VariantProps<typeof mobileTemplateVariants> {
  // Contenido principal
  children: React.ReactNode
  title?: string
  subtitle?: string
  
  // Configuración PWA
  pwaConfig?: PWAConfig
  installPrompt?: {
    title: string
    message: string
    installText: string
    dismissText: string
  }
  
  // Navegación móvil
  navigation?: MobileNavigation
  showBackButton?: boolean
  onBack?: () => void
  
  // Gestos y interacciones
  gestures?: GestureConfig
  hapticFeedback?: boolean
  
  // Responsive
  breakpoints?: ResponsiveBreakpoint
  hideOnDesktop?: boolean
  
  // Estados de conexión
  offline?: OfflineCapability
  connectionStatus?: 'online' | 'offline' | 'slow'
  
  // Notificaciones
  notifications?: MobileNotification[]
  onNotificationDismiss?: (id: string) => void
  
  // Layout y UI
  fullHeight?: boolean
  statusBarStyle?: 'default' | 'light-content' | 'dark-content'
  
  // Funcionalidades específicas
  cameraAccess?: boolean
  locationAccess?: boolean
  biometricAccess?: boolean
  
  // Callbacks
  onInstallPrompt?: () => void
  onOrientationChange?: (orientation: 'portrait' | 'landscape') => void
  onRefresh?: () => Promise<void>
  onOfflineAction?: () => void
  onCameraCapture?: (image: File) => void
  onLocationCapture?: (coords: GeolocationCoordinates) => void
  
  // Estados
  isLoading?: boolean
  isRefreshing?: boolean
  error?: string
  
  // Rol de usuario
  role?: 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
  
  // Personalización
  className?: string
  headerContent?: React.ReactNode
  footerContent?: React.ReactNode
}

export function MobileTemplate({
  children,
  title,
  subtitle,
  pwaConfig = {},
  installPrompt,
  navigation,
  showBackButton = false,
  onBack,
  gestures = { enablePullToRefresh: true },
  hapticFeedback = true,
  breakpoints = { mobile: 640, tablet: 768, desktop: 1024 },
  hideOnDesktop = false,
  offline = { enabled: true, strategies: ['cache-first'] },
  connectionStatus = 'online',
  notifications = [],
  onNotificationDismiss,
  fullHeight = true,
  statusBarStyle = 'default',
  cameraAccess = false,
  locationAccess = false,
  biometricAccess = false,
  onInstallPrompt,
  onOrientationChange,
  onRefresh,
  onOfflineAction,
  onCameraCapture,
  onLocationCapture,
  isLoading = false,
  isRefreshing = false,
  error,
  role = 'jefe_terreno',
  orientation,
  density,
  theme,
  safeArea,
  className,
  headerContent,
  footerContent,
  ...props
}: MobileTemplateProps) {
  // Estados locales
  const [deviceOrientation, setDeviceOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [isInstallable, setIsInstallable] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [currentNotifications, setCurrentNotifications] = useState(notifications)
  
  // Referencias
  const containerRef = useRef<HTMLDivElement>(null)
  const pullThreshold = gestures.refreshThreshold || 80
  const swipeThreshold = gestures.swipeThreshold || 50

  // Efectos
  useEffect(() => {
    // Detectar orientación del dispositivo
    const handleOrientationChange = () => {
      const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      setDeviceOrientation(newOrientation)
      onOrientationChange?.(newOrientation)
    }

    window.addEventListener('resize', handleOrientationChange)
    handleOrientationChange()

    return () => window.removeEventListener('resize', handleOrientationChange)
  }, [onOrientationChange])

  useEffect(() => {
    // Monitorear estado de conexión
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    // Configurar PWA
    if (pwaConfig.installable) {
      const handleBeforeInstallPrompt = (e: any) => {
        e.preventDefault()
        setIsInstallable(true)
        if (installPrompt) {
          setShowInstallPrompt(true)
        }
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [pwaConfig.installable, installPrompt])

  useEffect(() => {
    // Registrar Service Worker
    if (pwaConfig.enableOffline && pwaConfig.serviceWorkerUrl && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register(pwaConfig.serviceWorkerUrl)
        .then(registration => console.log('SW registrado:', registration))
        .catch(error => console.log('SW error:', error))
    }
  }, [pwaConfig.enableOffline, pwaConfig.serviceWorkerUrl])

  useEffect(() => {
    setCurrentNotifications(notifications)
  }, [notifications])

  // Handlers para gestos
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!gestures.enablePullToRefresh && !gestures.enableSwipe) return
    
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }, [gestures.enablePullToRefresh, gestures.enableSwipe])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.touches[0]
    const deltaY = touch.clientY - touchStart.y
    const deltaX = touch.clientX - touchStart.x

    // Pull to refresh
    if (gestures.enablePullToRefresh && deltaY > 0 && Math.abs(deltaX) < 50) {
      if (window.scrollY === 0) {
        setIsPulling(true)
        setPullDistance(Math.min(deltaY, pullThreshold * 1.5))
        
        if (deltaY > pullThreshold) {
          // Haptic feedback
          if (hapticFeedback && 'vibrate' in navigator) {
            navigator.vibrate(10)
          }
        }
      }
    }
  }, [touchStart, gestures.enablePullToRefresh, pullThreshold, hapticFeedback])

  const handleTouchEnd = useCallback(async () => {
    if (isPulling && pullDistance > pullThreshold) {
      setIsRefreshing(true)
      try {
        await onRefresh?.()
      } finally {
        setIsRefreshing(false)
      }
    }
    
    setIsPulling(false)
    setPullDistance(0)
    setTouchStart(null)
  }, [isPulling, pullDistance, pullThreshold, onRefresh])

  // Handler para instalar PWA
  const handleInstallPWA = useCallback(() => {
    onInstallPrompt?.()
    setShowInstallPrompt(false)
  }, [onInstallPrompt])

  // Handler para notificaciones
  const handleNotificationDismiss = useCallback((id: string) => {
    setCurrentNotifications(prev => prev.filter(n => n.id !== id))
    onNotificationDismiss?.(id)
  }, [onNotificationDismiss])

  // Handler para captura de cámara
  const handleCameraCapture = useCallback(async () => {
    if (!cameraAccess) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // Crear canvas para capturar imagen
      const video = document.createElement('video')
      video.srcObject = stream
      await video.play()
      
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
          onCameraCapture?.(file)
        }
      }, 'image/jpeg')
      
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      console.error('Error accediendo a la cámara:', error)
    }
  }, [cameraAccess, onCameraCapture])

  // Handler para captura de ubicación
  const handleLocationCapture = useCallback(() => {
    if (!locationAccess) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationCapture?.(position.coords)
        if (hapticFeedback && 'vibrate' in navigator) {
          navigator.vibrate(50)
        }
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error)
      },
      { enableHighAccuracy: true }
    )
  }, [locationAccess, onLocationCapture, hapticFeedback])

  // Renderizado condicional para desktop
  if (hideOnDesktop && window.innerWidth >= breakpoints.desktop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold mb-4">Vista Móvil</h2>
          <p className="text-gray-600 mb-6">
            Esta aplicación está optimizada para dispositivos móviles.
            Por favor, acceda desde un teléfono o tablet.
          </p>
          <Button onClick={() => window.location.reload()}>
            Recargar en Modo Móvil
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        mobileTemplateVariants({ orientation, density, theme, safeArea }),
        fullHeight && "min-h-screen",
        className
      )} 
      {...props}
    >
      {/* PWA Install Prompt */}
      {showInstallPrompt && installPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-sm bg-white p-6">
            <h3 className="font-semibold text-lg mb-2">{installPrompt.title}</h3>
            <p className="text-gray-600 mb-6">{installPrompt.message}</p>
            <div className="flex space-x-3">
              <Button 
                onClick={handleInstallPWA}
                className="flex-1"
              >
                {installPrompt.installText}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowInstallPrompt(false)}
                className="flex-1"
              >
                {installPrompt.dismissText}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Status bar offline */}
      {!isOnline && offline.enabled && (
        <div className="bg-red-600 text-white text-center py-2 text-sm">
          <span>Sin conexión - Modo offline activo</span>
          {onOfflineAction && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onOfflineAction}
              className="ml-2 text-white hover:bg-red-700"
            >
              Sincronizar
            </Button>
          )}
        </div>
      )}

      {/* Connection status */}
      {connectionStatus === 'slow' && (
        <div className="bg-yellow-500 text-white text-center py-1 text-xs">
          Conexión lenta detectada
        </div>
      )}

      {/* Pull to refresh indicator */}
      {isPulling && (
        <div 
          className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm transition-all duration-200 z-40"
          style={{ 
            transform: `translateY(${Math.max(-40, pullDistance - 80)}px)`,
            opacity: Math.min(1, pullDistance / pullThreshold)
          }}
        >
          {pullDistance > pullThreshold ? 'Suelta para actualizar' : 'Arrastra para actualizar'}
        </div>
      )}

      {/* Refresh spinner */}
      {isRefreshing && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm z-40">
          Actualizando...
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2"
              >
                ←
              </Button>
            )}
            <div>
              {title && (
                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Connection indicator */}
            <div 
              className={cn(
                "w-2 h-2 rounded-full",
                isOnline ? "bg-green-500" : "bg-red-500"
              )}
              title={isOnline ? "En línea" : "Sin conexión"}
            />

            {/* Camera access */}
            {cameraAccess && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCameraCapture}
                className="p-2"
                title="Tomar foto"
              >
                📷
              </Button>
            )}

            {/* Location access */}
            {locationAccess && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLocationCapture}
                className="p-2"
                title="Obtener ubicación"
              >
                📍
              </Button>
            )}
          </div>
        </div>

        {headerContent && (
          <div className="px-4 pb-4">
            {headerContent}
          </div>
        )}
      </div>

      {/* Notifications */}
      {currentNotifications.length > 0 && (
        <div className="p-4 space-y-2">
          {currentNotifications.map(notification => (
            <div 
              key={notification.id}
              className={cn(
                "p-3 rounded-lg shadow-sm",
                notification.type === 'success' && "bg-green-100 text-green-800 border border-green-200",
                notification.type === 'warning' && "bg-yellow-100 text-yellow-800 border border-yellow-200",
                notification.type === 'error' && "bg-red-100 text-red-800 border border-red-200",
                notification.type === 'info' && "bg-blue-100 text-blue-800 border border-blue-200"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm mt-1">{notification.message}</p>
                  {notification.timestamp && (
                    <p className="text-xs mt-2 opacity-75">
                      {new Date(notification.timestamp).toLocaleString('es-CL')}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNotificationDismiss(notification.id)}
                  className="p-1 ml-2"
                >
                  ×
                </Button>
              </div>
              
              {notification.actions && notification.actions.length > 0 && (
                <div className="flex space-x-2 mt-3">
                  {notification.actions.map((action, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={action.action}
                      className="text-xs"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div 
        ref={containerRef}
        className={cn(
          "flex-1 overflow-auto",
          fullHeight && "min-h-0"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <div className="text-red-600 text-xl mb-2">⚠️</div>
            <h3 className="font-medium mb-2">Error</h3>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <Button onClick={onRefresh} size="sm">
              Reintentar
            </Button>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Footer content */}
      {footerContent && (
        <div className="bg-white border-t border-gray-200 p-4">
          {footerContent}
        </div>
      )}

      {/* Bottom Navigation */}
      {navigation && navigation.type === 'bottom' && (
        <div className={cn(
          "bg-white border-t border-gray-200 px-2 py-1",
          navigation.position === 'fixed' && "fixed bottom-0 left-0 right-0 z-30"
        )}>
          <div className="flex justify-around">
            {navigation.items.map(item => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={item.onClick}
                className={cn(
                  "flex flex-col items-center py-2 px-3 min-w-0 relative",
                  item.active && "text-blue-600"
                )}
              >
                {item.icon && <span className="text-lg mb-1">{item.icon}</span>}
                <span className="text-xs truncate">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 min-w-5 h-5 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Navigation */}
      {navigation && navigation.type === 'floating' && (
        <div className="fixed bottom-6 right-6 z-30">
          <Button
            onClick={navigation.items[0]?.onClick}
            className="rounded-full w-14 h-14 shadow-lg"
          >
            {navigation.items[0]?.icon || '+'}
          </Button>
        </div>
      )}
    </div>
  )
}