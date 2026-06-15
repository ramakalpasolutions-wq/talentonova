// src/auth.js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'

const authPrisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

// ✅ Web Crypto API - works in Edge + Node.js
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const email = String(credentials?.email ?? '').trim()
          const password = String(credentials?.password ?? '')

          if (!email || !password) return null

          console.log('🔍 Login:', email)

          const user = await authPrisma.user.findUnique({
            where: { email },
          })

          if (!user?.password) {
            console.log('❌ User not found')
            return null
          }

          const inputHash = await hashPassword(password)
          if (inputHash !== user.password) {
            console.log('❌ Password mismatch')
            return null
          }

          console.log('✅ Login success:', email)

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (err) {
          console.error('💥 Auth error:', err.message)
          return null
        }
      },
    }),
  ],
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
})