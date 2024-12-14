import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { sanitizeUser, verifyPassword } from './lib/auth.utils';

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials?.username },
          });

          if (!user) {
            console.log('User not found:', credentials?.username);
            return null;
          }

          const isValidPassword = verifyPassword(
            credentials?.password as string,
            user.password,
            user.salt
          );

          if (!isValidPassword) {
            console.log('Invalid password for user:', credentials?.username);
            return null;
          }

          return sanitizeUser(user);
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isSuperAdmin = user.isSuperAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isSuperAdmin = token.isSuperAdmin as boolean;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
});
