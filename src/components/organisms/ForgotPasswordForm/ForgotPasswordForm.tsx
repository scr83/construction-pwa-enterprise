'use client'

import * as React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { z } from 'zod'
import { Button } from '@/components/atoms/Button'
import { SimpleInput } from '@/components/atoms/SimpleInput'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'

// Schema de validación para email
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Formato de email inválido'
    )
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordFormProps {
  className?: string
  onSuccess?: () => void
}

export function ForgotPasswordForm({ className, onSuccess }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    if (isLoading) return
    
    setIsLoading(true)
    setError(null)

    try {
      // Mock de envío de email de recuperación
      // En producción, aquí se llamaría al API de backend
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simula API call
      
      console.log('Enviando email de recuperación a:', data.email)
      
      setIsSuccess(true)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error('Error durante recuperación:', err)
      setError('Error al enviar el enlace. Inténtalo más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  // Estado de éxito
  if (isSuccess) {
    return (
      <div className={className}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check" size="lg" className="text-green-600" />
          </div>
          
          <Typography variant="h4" className="font-bold text-gray-900 mb-2">
            Enlace Enviado
          </Typography>
          
          <Typography variant="body-default" color="muted" className="mb-6">
            Hemos enviado un enlace de recuperación a tu correo electrónico.
            Revisa tu bandeja de entrada y sigue las instrucciones.
          </Typography>
          
          <div className="space-y-3">
            <Typography variant="body-small" color="muted">
              ¿No recibiste el correo? Revisa tu carpeta de spam o inténtalo nuevamente en unos minutos.
            </Typography>
            
            <Link
              href="/auth/login"
              className="inline-block"
            >
              <Button
                variant="primary"
                size="default"
                className="w-full"
                leftIcon={<Icon name="arrow-left" size="sm" />}
              >
                Volver al Inicio de Sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Formulario de recuperación
  return (
    <div className={className}>
      <div className="text-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-900 mb-2">
          Recuperar Contraseña
        </Typography>
        <Typography variant="body-default" color="muted">
          Ingresa tu email corporativo para recibir un enlace de recuperación
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
            autoFocus
          />
          {errors.email && (
            <Typography variant="body-small" className="text-red-600">
              {errors.email.message}
            </Typography>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="default"
          className="w-full"
          disabled={isLoading || !isValid}
          leftIcon={isLoading ? 
            <Icon name="loader-2" size="sm" className="animate-spin" /> : 
            <Icon name="mail" size="sm" />
          }
        >
          {isLoading ? 'Enviando enlace...' : 'Enviar Enlace de Recuperación'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Typography variant="body-small" color="muted">
          ¿Recordaste tu contraseña?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Iniciar sesión aquí
          </Link>
        </Typography>
      </div>

      {/* Información de seguridad */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Typography variant="caption" color="muted" className="text-center block mb-2">
          Proceso seguro de recuperación
        </Typography>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Icon name="shield-check" size="xs" />
            <span>Verificado</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="clock" size="xs" />
            <span>Válido por 1 hora</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="lock" size="xs" />
            <span>Encriptado</span>
          </div>
        </div>
      </div>
    </div>
  )
}