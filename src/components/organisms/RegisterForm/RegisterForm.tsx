'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { z } from 'zod'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'
import { registerSchema, getRoleLabel, hashPassword, type UserRole } from '@/lib/auth'

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  className?: string
  onSuccess?: () => void
}

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: 'EXECUTIVE', label: 'Ejecutivo', description: 'Director, Gerente General' },
  { value: 'SITE_MANAGER', label: 'Jefe de Terreno', description: 'Responsable de obra' },
  { value: 'SUPERVISOR', label: 'Supervisor', description: 'Coordinador de equipos' },
  { value: 'QUALITY_INSPECTOR', label: 'Inspector de Calidad', description: 'Control técnico' },
  { value: 'QUALITY_CONTROL', label: 'Control de Calidad', description: 'Auditoría y certificación' },
  { value: 'WORKER', label: 'Operario', description: 'Técnico especializado' },
]

export function RegisterForm({ className, onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    if (isLoading) return
    
    setIsLoading(true)
    setError(null)

    try {
      // Crear usuario via API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          company: data.company,
          phone: data.phone,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear cuenta')
      }

      setSuccess(true)
      
      if (onSuccess) {
        onSuccess()
      }

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/auth/login?message=account-created')
      }, 2000)

    } catch (err: any) {
      console.error('Error durante registro:', err)
      setError(err.message || 'Error inesperado. Inténtalo más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className={className}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check" size="lg" className="text-green-600" />
          </div>
          <Typography variant="h4" className="font-bold text-gray-900 mb-2">
            ¡Cuenta Creada!
          </Typography>
          <Typography variant="body-default" color="muted" className="mb-4">
            Tu cuenta ha sido creada exitosamente. Serás redirigido al login en unos segundos.
          </Typography>
          <Button
            variant="primary"
            onClick={() => router.push('/auth/login')}
            leftIcon={<Icon name="arrow-right" size="sm" />}
          >
            Ir al Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-900 mb-2">
          Crear Cuenta
        </Typography>
        <Typography variant="body-default" color="muted">
          Únete a la plataforma de construcción más avanzada
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
            Nombre Completo
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            {...register('name')}
            type="text"
            placeholder="Juan Pérez García"
            disabled={isLoading}
            autoComplete="name"
            error={errors.name?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email Corporativo
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            {...register('email')}
            type="email"
            placeholder="juan.perez@empresa.cl"
            disabled={isLoading}
            autoComplete="email"
            error={errors.email?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Rol en la Empresa
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            {...register('role')}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Selecciona tu rol</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
          {errors.role?.message && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <Icon name="x-circle" size="xs" />
              {errors.role.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Empresa (Opcional)
            </label>
            <Input
              {...register('company')}
              type="text"
              placeholder="Constructora ABC Ltda."
              disabled={isLoading}
              autoComplete="organization"
              error={errors.company?.message}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Teléfono (Opcional)
            </label>
            <Input
              {...register('phone')}
              type="tel"
              placeholder="+56 9 1234 5678"
              disabled={isLoading}
              autoComplete="tel"
              error={errors.phone?.message}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            {...register('password')}
            type="password"
            placeholder="Mínimo 6 caracteres"
            disabled={isLoading}
            autoComplete="new-password"
            error={errors.password?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            {...register('confirmPassword')}
            type="password"
            placeholder="Repite tu contraseña"
            disabled={isLoading}
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
          />
        </div>

        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            Acepto los{' '}
            <Link href="/legal/terms" className="text-blue-600 hover:text-blue-700 font-medium">
              términos y condiciones
            </Link>{' '}
            y la{' '}
            <Link href="/legal/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
              política de privacidad
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="default"
          className="w-full"
          disabled={isLoading || !isValid}
          leftIcon={isLoading ? 
            <Icon name="loader-2" size="sm" className="animate-spin" /> : 
            <Icon name="user-plus" size="sm" />
          }
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Typography variant="body-small" color="muted">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Inicia sesión aquí
          </Link>
        </Typography>
      </div>

      {/* Información de seguridad */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Typography variant="caption" color="muted" className="text-center block mb-2">
          Registro empresarial seguro
        </Typography>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Icon name="shield" size="xs" />
            <span>Datos Encriptados</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="check-circle" size="xs" />
            <span>Verificación Email</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="users" size="xs" />
            <span>Multi-empresa</span>
          </div>
        </div>
      </div>
    </div>
  )
}