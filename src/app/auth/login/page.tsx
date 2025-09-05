import { Metadata } from 'next'
import { LoginForm } from '@/components/organisms/LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar Sesión - ConstructorPro',
  description: 'Inicia sesión en tu cuenta de ConstructorPro PWA para gestionar tus proyectos de construcción',
}

export default function LoginPage() {
  return <LoginForm />
}