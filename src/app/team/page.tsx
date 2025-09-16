'use client'

import { TeamManagement } from '@/components/pages/TeamManagement'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { ErrorBoundary } from '@/components/atoms/ErrorBoundary'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

// Mock data removed - now using real API integration

export default function TeamPage() {
  console.log('🔍 TEAM PAGE LOADING:', {
    component: 'TeamPage',
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server-side'
  })

  const { data: session } = useSession()
  const searchParams = useSearchParams()
  
  // Get project ID from URL params or use default
  const projectId = searchParams.get('projectId') || undefined
  
  console.log('🔍 TEAM PAGE SESSION & PROJECT:', {
    session: session ? 'Present' : 'Missing',
    sessionUser: session?.user ? 'Present' : 'Missing',
    projectId: projectId || 'Using all projects',
    searchParamsProjectId: searchParams.get('projectId'),
    sessionRole: session?.user?.role
  })
  
  console.log('🔍 TEAM PAGE USING REAL API:', {
    component: 'TeamManagement',
    apiMode: 'Real API Integration',
    projectId: projectId || 'All Projects',
    mockDataRemoved: true
  })

  try {
    return (
      <ProtectedLayout>
        <ErrorBoundary>
          <TeamManagement 
            projectId={projectId}
          />
        </ErrorBoundary>
      </ProtectedLayout>
    )
  } catch (error) {
    console.error('💥 TEAM PAGE RENDER ERROR:', {
      error: error.message,
      stack: error.stack,
      component: 'TeamPage',
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server-side'
    })
    throw error
  }
}