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
  return await bcrypt.hash(password, 12)
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos')
        }

        // Validar entrada
        const validatedFields = loginSchema.safeParse({
          email: credentials.email,
          password: credentials.password,
        })

        if (!validatedFields.success) {
          throw new Error('Credenciales inválidas')
        }

        // Buscar usuario en base de datos
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error('Usuario no encontrado')
        }

        // Verificar contraseña
        const isPasswordValid = await verifyPassword(credentials.password, user.password)
        
        if (!isPasswordValid) {
          throw new Error('Contraseña incorrecta')
        }

        // Verificar que el usuario esté activo
        if (!user.emailVerified) {
          // En producción podrías querer verificar email
          // Por ahora permitimos usuarios sin verificar
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          company: user.company,
          image: user.image,
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
  debug: process.env.NODE_ENV === 'development',
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