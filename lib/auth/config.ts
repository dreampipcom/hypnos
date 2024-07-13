// config.ts
export const authConfig = {
  providers,
  adapter: PrismaAdapter(PrivatePrisma),
  session: {
    strategy: 'jwt',
  },
  events: {},
  callbacks: {
    async signIn() {
      // extra sign-in checks
      return true;
    },
    async redirect() {
      return `${process.env.MAIN_URL}`;
    },
    async jwt({ user, token }) {
      if (user) {
        // Note that this if condition is needed
        token.user = { ...user };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        // Note that this if condition is needed
        session.user = token.user;
      }
      return session;
    },
  },
  cookies: {
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
  pages: {
    signIn: '/signin',
    signOut: '/',
    error: '/error', // Error code passed in query string as ?error=
    verifyRequest: '/verify', // (used for check email message)
    // newUser: '/' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};
