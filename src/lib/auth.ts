import { NextAuthOptions, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
// import { PrismaAdapter } from "@next-auth/prisma-adapter" // Not needed for credentials
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
  console.log('🔐 VERIFY_PASSWORD: Starting password verification')
  console.log('🔐 VERIFY_PASSWORD: Plain password length:', password.length)
  console.log('🔐 VERIFY_PASSWORD: Hash length:', hashedPassword.length)
  console.log('🔐 VERIFY_PASSWORD: Hash format check - starts with $2:', hashedPassword.startsWith('$2'))
  
  try {
    const result = await bcrypt.compare(password, hashedPassword)
    console.log('🔐 VERIFY_PASSWORD: Comparison result:', result)
    return result
  } catch (error) {
    console.error('🚨 VERIFY_PASSWORD: bcrypt.compare error:', error)
    throw error
  }
}

// Configuración de NextAuth
export const authOptions: NextAuthOptions = {
  // CRITICAL FIX: Remove PrismaAdapter when using CredentialsProvider
  // adapter: PrismaAdapter(prisma), // This conflicts with credentials auth
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
        console.log('🔐 AUTHORIZE: ====== FUNCTION ENTRY ======')
        console.log('🔐 AUTHORIZE: Starting authentication for:', credentials?.email)
        console.log('🔐 AUTHORIZE: Credentials object:', { 
          hasEmail: !!credentials?.email, 
          hasPassword: !!credentials?.password,
          emailLength: credentials?.email?.length || 0
        })
        
        try {
          // Step 1: Basic validation
          console.log('🔐 AUTHORIZE: Step 1 - Validating credentials...')
          if (!credentials?.email || !credentials?.password) {
            console.log('❌ AUTHORIZE: Missing credentials - email:', !!credentials?.email, 'password:', !!credentials?.password)
            return null // Return null instead of throwing for NextAuth
          }

          // Step 2: Schema validation
          console.log('🔐 AUTHORIZE: Step 2 - Schema validation...')
          const validatedFields = loginSchema.safeParse({
            email: credentials.email,
            password: credentials.password,
          })

          if (!validatedFields.success) {
            console.log('❌ AUTHORIZE: Schema validation failed:', validatedFields.error.errors)
            return null
          }
          console.log('✅ AUTHORIZE: Schema validation passed')

          // Step 3: Test database connection
          console.log('🔐 AUTHORIZE: Step 3 - Testing database connection...')
          try {
            await prisma.$connect()
            console.log('✅ AUTHORIZE: Database connection successful')
          } catch (dbError) {
            console.error('❌ AUTHORIZE: Database connection failed:', dbError)
            return null
          }

          // Step 4: Query user
          console.log('🔐 AUTHORIZE: Step 4 - Querying database for user:', credentials.email)
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

          console.log('🔐 AUTHORIZE: Database query completed. User found:', !!user)
          if (user) {
            console.log('🔐 AUTHORIZE: User details:', { 
              id: user.id, 
              email: user.email, 
              role: user.role,
              isActive: user.isActive,
              hasPassword: !!user.password
            })
          }

          if (!user) {
            console.log('❌ AUTHORIZE: User not found in database for email:', credentials.email)
            return null
          }

          if (!user.password) {
            console.log('❌ AUTHORIZE: User exists but has no password field')
            return null
          }

          // Step 5: Password verification
          console.log('🔐 AUTHORIZE: Step 5 - Starting password verification...')
          console.log('🔐 AUTHORIZE: Provided password length:', credentials.password.length)
          console.log('🔐 AUTHORIZE: Stored hash length:', user.password.length)
          console.log('🔐 AUTHORIZE: Hash starts with:', user.password.substring(0, 7))
          
          let isPasswordValid = false
          try {
            isPasswordValid = await bcrypt.compare(credentials.password, user.password)
            console.log('🔐 AUTHORIZE: bcrypt.compare result:', isPasswordValid)
          } catch (bcryptError) {
            console.error('❌ AUTHORIZE: bcrypt.compare error:', bcryptError)
            return null
          }
          
          if (!isPasswordValid) {
            console.log('❌ AUTHORIZE: Password verification failed')
            return null
          }
          console.log('✅ AUTHORIZE: Password verification successful')

          // Step 6: Check user status
          console.log('🔐 AUTHORIZE: Step 6 - Checking user status...')
          if (user.isActive === false) {
            console.log('❌ AUTHORIZE: User account is inactive')
            return null
          }
          console.log('✅ AUTHORIZE: User is active')

          // Step 7: Construct return object
          console.log('🔐 AUTHORIZE: Step 7 - Constructing user object...')
          const authUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
            company: user.company || null,
            image: user.image || null,
          }

          console.log('🔐 AUTHORIZE: Final user object:', authUser)
          console.log('🔐 AUTHORIZE: ====== RETURNING USER OBJECT ======')
          return authUser
          
        } catch (error) {
          console.error('🚨 AUTHORIZE: Unexpected error occurred:', error)
          console.error('🚨 AUTHORIZE: Error stack:', error.stack)
          console.log('🔐 AUTHORIZE: ====== RETURNING NULL DUE TO ERROR ======')
          return null
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
      console.log('🎫 [JWT] JWT callback called', { hasUser: !!user, tokenSub: token.sub })
      
      // First time JWT is created (when user signs in)
      if (user) {
        console.log('🎫 [JWT] Adding user data to token:', { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        })
        token.id = user.id
        token.role = user.role
        token.company = user.company
        token.email = user.email
        token.name = user.name
      }
      
      console.log('🎫 [JWT] Final token:', { 
        id: token.id, 
        role: token.role, 
        email: token.email 
      })
      return token
    },
    async session({ session, token }) {
      console.log('👤 [SESSION] Session callback called', { 
        hasToken: !!token, 
        tokenId: token.id,
        sessionUserEmail: session.user?.email 
      })
      
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.company = token.company as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        
        console.log('👤 [SESSION] Final session user:', {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role
        })
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // Only debug in development mode
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