// constants.ts TS-Doc?
import type { NextAuthConfig } from 'next-auth';
import { PrivatePrisma } from '@model';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const providers: any[] = [
  EmailProvider({
    server: process.env.EMAIL_SERVER as string,
    from: process.env.EMAIL_FROM as string,
    // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
  }),
  GithubProvider({
    clientId: process.env.GITHUB_ID as string,
    clientSecret: process.env.GITHUB_SECRET as string,
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  }),
  AppleProvider({
    clientId: process.env.APPLE_CLIENT_ID as string,
    clientSecret: process.env.APPLE_CLIENT_SECRET as string,
  }),
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID as string,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
  }),
];

// config.ts
export const authConfig = {
  providers,
  adapter: PrismaAdapter(PrivatePrisma),
  // session: {
  //   strategy: 'jwt',
  // },
  events: {},
  callbacks: {
    async signIn() {
      // extra sign-in checks
      return true;
    },
    async redirect() {
      return `${process.env.MAIN_URL}`;
    },
    // async jwt({ user, token }) {
    //   if (user) {
    //     // Note that this if condition is needed
    //     token.user = { ...user };
    //   }
    //   return token;
    // },
    // async session({ session, token }) {
    //   if (token?.user) {
    //     // Note that this if condition is needed
    //     session.user = token.user;
    //   }
    //   return session;
    // },
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
} satisfies NextAuthConfig;

export const providerMap = providers.map((provider: any) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
