import { PrismaClient } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { AuthUser, sanitizeUser, verifyPassword } from './lib/auth.utils';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      isSuperAdmin: boolean;
    };
  }
}

const prisma = new PrismaClient();

interface LoginCredentials {
  username: string;
  password: string;
}

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
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const { username, password } = credentials as LoginCredentials;

        try {
          const user = await prisma.user.findUnique({
            where: { email: username },
          });

          if (!user) {
            throw new Error('Invalid credentials');
          }

          const isValidPassword = verifyPassword(
            password,
            user.password,
            user.salt
          );

          if (!isValidPassword) {
            throw new Error('Invalid credentials');
          }

          return sanitizeUser(user);
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isSuperAdmin = (user as AuthUser).isSuperAdmin;
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
