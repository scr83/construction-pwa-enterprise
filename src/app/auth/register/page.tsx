import { Metadata } from 'next'
import { RegisterForm } from '@/components/organisms/RegisterForm'

export const metadata: Metadata = {
  title: 'Crear Cuenta - ConstructorPro',
  description: 'Crea tu cuenta en ConstructorPro PWA y únete a la plataforma de construcción más avanzada',
}

export default function RegisterPage() {
  return <RegisterForm />
}