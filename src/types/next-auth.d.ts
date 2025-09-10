import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"
import { UserRole } from "@/lib/auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      company?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: UserRole
    company?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: UserRole
    company?: string
  }
}