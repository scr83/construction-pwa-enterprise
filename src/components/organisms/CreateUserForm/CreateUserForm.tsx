'use client'

import { useState } from 'react'

interface CreateUserFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'SITE_MANAGER',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tempPassword, setTempPassword] = useState<string | null>(null)

  const roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'EXECUTIVE', label: 'Gerencia' },
    { value: 'SITE_MANAGER', label: 'Jefe de Terreno' },
    { value: 'WAREHOUSE', label: 'Jefe de Bodega' },
    { value: 'TECHNICAL_OFFICE', label: 'Oficina Técnica' },
    { value: 'QUALITY_CONTROL', label: 'Control de Calidad' },
    { value: 'SUPERVISOR', label: 'Supervisor' },
    { value: 'QUALITY_INSPECTOR', label: 'Inspector de Calidad' },
    { value: 'WORKER', label: 'Trabajador' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear usuario')
      }

      setTempPassword(data.tempPassword)
      
      // Wait 3 seconds to show password, then close
      setTimeout(() => {
        onSuccess()
      }, 3000)

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (tempPassword) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
        <h3 className="text-xl font-bold text-green-800 mb-4">
          ✅ Usuario Creado Exitosamente
        </h3>
        <div className="bg-white rounded p-4 mb-4">
          <p className="text-sm text-gray-600 mb-2">Contraseña Temporal:</p>
          <p className="text-2xl font-mono font-bold text-gray-900 select-all">
            {tempPassword}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Copiar y enviar al usuario. Esta ventana se cerrará automáticamente.
          </p>
        </div>
        <button
          onClick={onSuccess}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Cerrar
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Usuario</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Juan Pérez"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="juan@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="+56912345678"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rol *
        </label>
        <select
          required
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  )
}
