import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Partial<Record<'username' | 'password', unknown>>
      ) {
        // Simple credentials check against environment variables
        const isValid =
          credentials?.username === process.env.AUTH_USERNAME &&
          credentials?.password === process.env.AUTH_PASSWORD;

        if (isValid) {
          return {
            id: '1',
            name: credentials?.username as string,
            email: `${credentials?.username as string}@example.com`,
          };
        }

        return null;
      },
    }),
  ],

  secret: process.env.AUTH_SECRET || 'your-development-secret-key',
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
});
