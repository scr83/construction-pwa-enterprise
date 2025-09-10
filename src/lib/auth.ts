import { NextAuthOptions, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Definir los roles disponibles para la construcción
export type UserRole = 
  | 'ADMIN'
  | 'EXECUTIVE'
  | 'SITE_MANAGER' 
  | 'SUPERVISOR'
  | 'QUALITY_INSPECTOR'
  | 'QUALITY_CONTROL'
  | 'WORKER'

// Esquema de validación para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email es requerido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
})

// Esquema de validación para registro
export const registerSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['ADMIN', 'EXECUTIVE', 'SITE_MANAGER', 'SUPERVISOR', 'QUALITY_INSPECTOR', 'QUALITY_CONTROL', 'WORKER']),
  company: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

// Función para hashear contraseñas
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

// Función para verificar contraseñas
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

// Configuración de NextAuth
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credenciales',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email',
          placeholder: 'tu@empresa.com' 
        },
        password: { 
          label: 'Contraseña', 
          type: 'password' 
        }
      },
      async authorize(credentials) {
        try {
          console.log('🔐 [AUTH] Starting authorization for:', credentials?.email)
          
          if (!credentials?.email || !credentials?.password) {
            console.log('❌ [AUTH] Missing credentials')
            throw new Error('Email y contraseña son requeridos')
          }

          // Validar entrada
          const validatedFields = loginSchema.safeParse({
            email: credentials.email,
            password: credentials.password,
          })

          if (!validatedFields.success) {
            console.log('❌ [AUTH] Validation failed:', validatedFields.error)
            throw new Error('Credenciales inválidas')
          }

          console.log('🔍 [AUTH] Searching for user in database:', credentials.email)
          
          // Buscar usuario en base de datos
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true,
              company: true,
              image: true,
              isActive: true,
              emailVerified: true,
            }
          })

          if (!user) {
            console.log('❌ [AUTH] User not found:', credentials.email)
            throw new Error('Usuario no encontrado')
          }

          if (!user.password) {
            console.log('❌ [AUTH] User has no password:', credentials.email)
            throw new Error('Usuario no encontrado')
          }

          console.log('✅ [AUTH] User found:', { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            isActive: user.isActive 
          })

          // Verificar contraseña
          console.log('🔐 [AUTH] Verifying password...')
          const isPasswordValid = await verifyPassword(credentials.password, user.password)
          
          if (!isPasswordValid) {
            console.log('❌ [AUTH] Password verification failed for:', credentials.email)
            throw new Error('Contraseña incorrecta')
          }

          console.log('✅ [AUTH] Password verified successfully')

          // Verificar que el usuario esté activo
          if (user.isActive === false) {
            console.log('❌ [AUTH] User is inactive:', credentials.email)
            throw new Error('Usuario inactivo')
          }

          console.log('✅ [AUTH] Authorization successful for:', credentials.email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
            company: user.company,
            image: user.image,
          }
        } catch (error) {
          console.error('🚨 [AUTH] Authorization error:', error)
          throw error
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.role = user.role
        token.company = user.company
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.company = token.company as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Temporarily enable debug in production
}

// Función helper para obtener rol en español
export const getRoleLabel = (role: UserRole): string => {
  const roleLabels = {
    ADMIN: 'Administrador',
    EXECUTIVE: 'Ejecutivo',
    SITE_MANAGER: 'Jefe de Terreno',
    SUPERVISOR: 'Supervisor',
    QUALITY_INSPECTOR: 'Inspector de Calidad',
    QUALITY_CONTROL: 'Control de Calidad',
    WORKER: 'Operario',
  }
  return roleLabels[role] || role
}

// Función helper para verificar permisos
export const hasPermission = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole)
}

// Roles con jerarquía (mayor número = más permisos)
const roleHierarchy = {
  WORKER: 1,
  QUALITY_INSPECTOR: 2,
  QUALITY_CONTROL: 2,
  SUPERVISOR: 3,
  SITE_MANAGER: 4,
  EXECUTIVE: 5,
  ADMIN: 6,
}

export const hasMinimumRole = (userRole: UserRole, minimumRole: UserRole): boolean => {
  return roleHierarchy[userRole] >= roleHierarchy[minimumRole]
}