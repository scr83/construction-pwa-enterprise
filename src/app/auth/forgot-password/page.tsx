import { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/organisms/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Recuperar Contraseña - ConstructorPro',
  description: 'Recupera el acceso a tu cuenta de ConstructorPro PWA con un enlace seguro',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}