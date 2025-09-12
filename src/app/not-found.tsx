'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/atoms/Button'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'

export default function NotFound() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Logo y construcción themed icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 bg-orange-100 rounded-2xl flex items-center justify-center">
            <Icon name="hard-hat" size="xl" className="text-orange-600" />
          </div>
        </div>

        {/* Título principal */}
        <div className="mb-8">
          <Typography variant="display" className="font-bold text-gray-900 mb-3">
            404
          </Typography>
          <Typography variant="h3" className="font-bold text-gray-900 mb-3">
            Página no encontrada
          </Typography>
          <Typography variant="body-default" color="muted" className="mb-2">
            La página que buscas no existe o fue movida.
          </Typography>
          <Typography variant="body-small" color="muted">
            Puede que hayas ingresado mal la dirección o la página ya no esté disponible.
          </Typography>
        </div>

        {/* Iconos de construcción decorativos */}
        <div className="flex items-center justify-center gap-6 mb-8 text-gray-300">
          <Icon name="hammer" size="lg" />
          <Icon name="wrench" size="lg" />
          <Icon name="settings" size="lg" />
        </div>

        {/* Acciones basadas en estado de autenticación */}
        <div className="space-y-4">
          {isAuthenticated ? (
            <>
              {/* Usuario autenticado - mostrar opciones internas */}
              <Link href="/dashboard" className="block">
                <Button
                  variant="primary"
                  size="default"
                  className="w-full"
                  leftIcon={<Icon name="layout-dashboard" size="sm" />}
                >
                  Ir al Dashboard
                </Button>
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <Link href="/projects">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    leftIcon={<Icon name="building-2" size="sm" />}
                  >
                    Proyectos
                  </Button>
                </Link>
                
                <Link href="/tasks">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    leftIcon={<Icon name="list-checks" size="sm" />}
                  >
                    Tareas
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Typography variant="body-small" color="muted" className="mb-2">
                  Hola, {session?.user?.name || 'Usuario'}
                </Typography>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Icon name="user" size="sm" />}
                  >
                    Ver mi perfil
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Usuario no autenticado - mostrar opciones públicas */}
              <Link href="/" className="block">
                <Button
                  variant="primary"
                  size="default"
                  className="w-full"
                  leftIcon={<Icon name="home" size="sm" />}
                >
                  Volver al Inicio
                </Button>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    leftIcon={<Icon name="user" size="sm" />}
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                
                <Link href="/auth/register">
                  <Button
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    leftIcon={<Icon name="plus" size="sm" />}
                  >
                    Registrarse
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Información de contacto y soporte */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Typography variant="body-small" color="muted" className="mb-3">
            ¿Necesitas ayuda? Contacta a nuestro soporte técnico
          </Typography>
          
          <div className="flex items-center justify-center gap-6 text-gray-500">
            {/* Email de soporte */}
            <a 
              href="mailto:soporte@constructorpro.cl" 
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <Icon name="mail" size="xs" />
              <Typography variant="caption">
                soporte@constructorpro.cl
              </Typography>
            </a>

            {/* Teléfono de soporte */}
            <a 
              href="tel:+56222334455" 
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <Icon name="phone" size="xs" />
              <Typography variant="caption">
                +56 2 2233 4455
              </Typography>
            </a>
          </div>

          {/* Horario de soporte */}
          <Typography variant="caption" color="muted" className="mt-3 block">
            Lunes a Viernes: 8:00 - 18:00 hrs | Sábados: 8:00 - 12:00 hrs
          </Typography>
        </div>

        {/* Footer de la aplicación */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon name="hard-hat" size="sm" className="text-blue-600" />
            <Typography variant="body-small" className="font-semibold text-gray-900">
              ConstructorPro PWA
            </Typography>
          </div>
          <Typography variant="caption" color="muted">
            © 2024 ConstructorPro PWA • de la Contru pa' la Contru
          </Typography>
        </div>
      </div>
    </div>
  )
}