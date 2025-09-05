import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autenticación - ConstructorPro',
  description: 'Accede a tu cuenta de ConstructorPro PWA',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">CP</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ConstructorPro
            </h1>
            <p className="text-gray-600 text-sm">
              Gestión de Construcción Empresarial
            </p>
          </div>
          
          {/* Contenido de las páginas de auth */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {children}
          </div>
          
          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>© 2024 ConstructorPro PWA</p>
            <p>de la Contru pa' la Contru</p>
          </div>
        </div>
      </div>
    </div>
  )
}