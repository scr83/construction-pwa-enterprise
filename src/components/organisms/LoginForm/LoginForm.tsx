'use client'

import * as React from 'react'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { z } from 'zod'
import { Button } from '@/components/atoms/Button'
import { SimpleInput } from '@/components/atoms/SimpleInput'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'
import { loginSchema } from '@/lib/auth'

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  className?: string
  onSuccess?: () => void
}

export function LoginForm({ className, onSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: LoginFormData) => {
    if (isLoading) return
    
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        // Mapear errores a mensajes en español
        switch (result.error) {
          case 'CredentialsSignin':
            setError('Email o contraseña incorrectos')
            break
          default:
            setError('Error al iniciar sesión. Inténtalo nuevamente.')
        }
      } else if (result?.ok) {
        if (onSuccess) {
          onSuccess()
        }
        
        // Redirigir al callback URL o dashboard
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      console.error('Error durante login:', err)
      setError('Error inesperado. Inténtalo más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-900 mb-2">
          Iniciar Sesión
        </Typography>
        <Typography variant="body-default" color="muted">
          Accede a tu cuenta para gestionar tus proyectos
        </Typography>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <Icon name="alert-circle" size="sm" className="text-red-600 flex-shrink-0" />
          <Typography variant="body-small" className="text-red-700">
            {error}
          </Typography>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email Corporativo
            <span className="text-red-500 ml-1">*</span>
          </label>
          <SimpleInput
            {...register('email')}
            type="email"
            placeholder="tu@empresa.cl"
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
            <span className="text-red-500 ml-1">*</span>
          </label>
          <SimpleInput
            {...register('password')}
            type="password"
            placeholder="Tu contraseña segura"
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-600">Recordarme</span>
          </label>
          
          <Link
            href="/auth/forgot-password"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="default"
          className="w-full"
          disabled={isLoading || !isValid}
          leftIcon={isLoading ? 
            <Icon name="loader-2" size="sm" className="animate-spin" /> : 
            <Icon name="log-in" size="sm" />
          }
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Typography variant="body-small" color="muted">
          ¿No tienes cuenta?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Registrarse aquí
          </Link>
        </Typography>
      </div>

      {/* Información adicional */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Typography variant="caption" color="muted" className="text-center block mb-2">
          Acceso empresarial seguro
        </Typography>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Icon name="shield-check" size="xs" />
            <span>SSL Encriptado</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="server" size="xs" />
            <span>ISO 27001</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="clock" size="xs" />
            <span>24/7 Disponible</span>
          </div>
        </div>
      </div>
    </div>
  )
}