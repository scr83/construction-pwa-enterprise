'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Typography } from '@/components/atoms/Typography'

interface NavigationItem {
  label: string
  href: string
  icon: string
  roles?: string[]
}

interface CurrentUser {
  id: string
  name: string
  email: string
  role: string
}

interface NavigationBarProps {
  currentUser: CurrentUser
}

export function NavigationBar({ currentUser }: NavigationBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Navigation items based on construction workflows
  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'home'
    },
    {
      label: 'Proyectos',
      href: '/projects',
      icon: 'folder'
    },
    {
      label: 'Tareas',
      href: '/tasks',
      icon: 'check-square',
      roles: ['gerencia', 'jefe_terreno', 'oficina_tecnica']
    },
    {
      label: 'Materiales',
      href: '/materials',
      icon: 'package',
      roles: ['gerencia', 'bodega', 'jefe_terreno']
    },
    {
      label: 'Equipo',
      href: '/team',
      icon: 'users',
      roles: ['gerencia', 'jefe_terreno']
    },
    {
      label: 'Calidad',
      href: '/quality',
      icon: 'shield-check',
      roles: ['gerencia', 'control_calidad', 'oficina_tecnica']
    },
    {
      label: 'Reportes',
      href: '/reports',
      icon: 'bar-chart-3'
    }
  ]

  // Filter navigation items based on user role
  const visibleItems = navigationItems.filter(item => {
    if (!item.roles) return true // Show items without role restrictions
    return item.roles.includes(currentUser.role)
  })

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon name="hard-hat" size="sm" className="text-white" />
              </div>
              <Typography variant="h6" className="font-bold text-gray-900">
                ConstructorApp
              </Typography>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name={item.icon} size="xs" />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* User menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Typography variant="caption" className="font-semibold text-gray-700">
                  {currentUser.name.charAt(0).toUpperCase()}
                </Typography>
              </div>
              <div className="flex flex-col">
                <Typography variant="body-small" className="font-medium text-gray-900">
                  {currentUser.name}
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  {getRoleLabel(currentUser.role)}
                </Typography>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              leftIcon={<Icon name="log-out" size="xs" />}
            >
              Cerrar Sesión
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Icon name={isMenuOpen ? 'x' : 'menu'} size="sm" />
            </Button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {visibleItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActiveLink(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={item.icon} size="sm" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Mobile user section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Typography variant="body-default" className="font-semibold text-gray-700">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </Typography>
                </div>
                <div className="ml-3">
                  <Typography variant="body-default" className="font-medium text-gray-900">
                    {currentUser.name}
                  </Typography>
                  <Typography variant="body-small" className="text-gray-500">
                    {getRoleLabel(currentUser.role)}
                  </Typography>
                </div>
              </div>
              <div className="mt-3 px-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<Icon name="log-out" size="xs" />}
                  className="w-full justify-start"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Helper function to get role labels in Spanish
function getRoleLabel(role: string): string {
  const roleLabels: Record<string, string> = {
    gerencia: 'Gerencia',
    jefe_terreno: 'Jefe de Terreno',
    bodega: 'Bodega',
    oficina_tecnica: 'Oficina Técnica',
    control_calidad: 'Inspector de Calidad',
    admin: 'Administrador'
  }
  
  return roleLabels[role] || role
}