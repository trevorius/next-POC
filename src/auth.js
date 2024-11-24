import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Simple credentials check against environment variables
        const isValid =
          credentials?.username === process.env.AUTH_USERNAME &&
          credentials?.password === process.env.AUTH_PASSWORD;

        if (isValid) {
          return {
            id: '1',
            name: credentials.username,
            email: `${credentials.username}@example.com`,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
});
