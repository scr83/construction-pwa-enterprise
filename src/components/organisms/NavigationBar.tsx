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
  currentUser?: CurrentUser
}

export function NavigationBar({ currentUser }: NavigationBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()

  // Guard against undefined currentUser
  if (!currentUser) {
    return null
  }

  // Map authentication roles to internal roles
  const normalizedRole = normalizeRole(currentUser.role)

  // Comprehensive navigation items for construction management
  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'layout-dashboard'
    },
    {
      label: 'Proyectos', 
      href: '/proyectos',
      icon: 'building-2'
    },
    {
      label: 'Partidas',
      href: '/tasks',
      icon: 'clipboard-list',
      roles: ['admin', 'gerencia', 'jefe_terreno', 'site_manager', 'oficina_tecnica']
    },
    {
      label: 'Materiales',
      href: '/materials',
      icon: 'package',
      roles: ['admin', 'gerencia', 'bodega', 'jefe_terreno', 'site_manager']
    },
    {
      label: 'Equipo',
      href: '/team',
      icon: 'users',
      roles: ['admin', 'gerencia', 'jefe_terreno', 'site_manager']
    },
    {
      label: 'Calidad',
      href: '/quality',
      icon: 'shield-check',
      roles: ['admin', 'gerencia', 'control_calidad', 'quality_control', 'oficina_tecnica']
    },
    {
      label: 'Reportes',
      href: '/reports',
      icon: 'file-text'
    }
  ]

  // User menu items - always visible
  const userMenuItems = [
    {
      label: 'Mi Perfil',
      href: '/profile',
      icon: 'user'
    },
    {
      label: 'Notificaciones',
      href: '/notifications',
      icon: 'bell'
    },
    {
      label: 'Configuración',
      href: '/settings',
      icon: 'settings'
    },
    // Admin-only menu items
    ...(normalizedRole === 'admin' || currentUser.role === 'ADMIN' ? [
      {
        label: 'Gestión de Usuarios',
        href: '/admin/users',
        icon: 'shield'
      },
      {
        label: 'Crear Proyecto',
        href: '/admin/projects/new',
        icon: 'plus-circle'
      }
    ] : [])
  ]

  // Filter navigation items based on user role (more permissive)
  const visibleItems = navigationItems.filter(item => {
    if (!item.roles) return true // Show items without role restrictions
    
    // Check both original and normalized roles
    return item.roles.includes(normalizedRole) || 
           item.roles.includes(currentUser.role.toLowerCase())
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
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
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

          {/* Desktop user menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Typography variant="caption" className="font-semibold text-gray-700">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </Typography>
                </div>
                <div className="flex flex-col items-start">
                  <Typography variant="body-small" className="font-medium text-gray-900">
                    {currentUser.name}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500 uppercase">
                    {getRoleLabel(currentUser.role)}
                  </Typography>
                </div>
                <Icon name="chevron-down" size="xs" className="text-gray-400" />
              </Button>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Icon name={item.icon} size="xs" className="mr-3 text-gray-400" />
                        {item.label}
                      </Link>
                    ))}
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        handleLogout()
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Icon name="log-out" size="xs" className="mr-3 text-gray-400" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
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
          <div className="lg:hidden border-t border-gray-200">
            {/* Navigation items */}
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
              {/* User info */}
              <div className="flex items-center px-5 mb-3">
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

              {/* User menu items */}
              <div className="space-y-1 px-2">
                {userMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon name={item.icon} size="sm" className="mr-3" />
                    {item.label}
                  </Link>
                ))}
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleLogout()
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Icon name="log-out" size="sm" className="mr-3" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside handler for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  )
}

// Helper function to normalize different role formats
function normalizeRole(role: string): string {
  const roleMap: Record<string, string> = {
    'SITE_MANAGER': 'jefe_terreno',
    'QUALITY_CONTROL': 'control_calidad',
    'WAREHOUSE': 'bodega',
    'EXECUTIVE': 'gerencia',
    'ADMIN': 'admin',
    'TECHNICAL': 'oficina_tecnica'
  }
  
  return roleMap[role.toUpperCase()] || role.toLowerCase()
}

// Helper function to get role labels in Spanish
function getRoleLabel(role: string): string {
  const roleLabels: Record<string, string> = {
    'SITE_MANAGER': 'Jefe de Terreno',
    'QUALITY_CONTROL': 'Inspector de Calidad',
    'WAREHOUSE': 'Bodega',
    'EXECUTIVE': 'Gerencia', 
    'ADMIN': 'Administrador',
    'TECHNICAL': 'Oficina Técnica',
    'gerencia': 'Gerencia',
    'jefe_terreno': 'Jefe de Terreno',
    'bodega': 'Bodega',
    'oficina_tecnica': 'Oficina Técnica',
    'control_calidad': 'Inspector de Calidad',
    'admin': 'Administrador'
  }
  
  return roleLabels[role] || role
}