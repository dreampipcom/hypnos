// constants.ts TS-Doc?
import type { NextAuthConfig } from 'next-auth';
import type { PrismaClient } from '@prisma/client';
import { PrivatePrisma } from '@model';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import {
  UpdatePrivateUserServices,
  GetPrivateCommonServices,
  UpdatePrivateUserAbilities,
  GetPrivateCommonAbilities,
} from '@controller';

// schema sanitizer
const allUsersSideEffects = async ({ user }: any) => {
  const services = await GetPrivateCommonServices({});
  const abilities = await GetPrivateCommonAbilities({});
  const commonServices = services.map((service) => service?.id).map((el) => el);
  const commonAbilities = abilities.map((ability) => ability?.id).map((el) => el);

  console.log({ services, abilities, user });
  await UpdatePrivateUserServices({ user, services: [...commonServices, ...user.servicesIds], upsert: false });
  await UpdatePrivateUserAbilities({ user, abilities: [...commonAbilities, ...user.abilitiesIds], upsert: false });
};

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
  adapter: PrismaAdapter(PrivatePrisma as unknown as PrismaClient),
  // session: {
  //   strategy: 'jwt',
  // },
  events: {
    async signIn(props) {
      const { user, isNewUser } = props;
      console.log({ isNewUser, props });
      try {
        if (isNewUser) {
          await allUsersSideEffects({ user });
        }
      } catch (e) {
        console.warn(
          `Code 005: Sign-up side-effects failed. New user entry probably has inconsistent data and might experience problems: ${e}`,
        );
      }
    },
  },
  callbacks: {
    async signIn(props) {
      const { user } = props;
      try {
        await allUsersSideEffects({ user });
      } catch (e) {
        console.warn(`Code 004: Log-in side-effects failed. If it's a new user, plese ignore: ${e}`);
      }

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
    async session({ session, user }: any) {
      const facadedUser = {
        id: user.id,
        email: user.email,
        image: user.image,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        preferences: user.preferencesIds,
        roles: user.rolesIds,
        services: user.servicesIds,
        abilities: user.abilitiesIds,
        favorites: user.favoritesIds,
      };
      session.user = facadedUser;
      // if (token?.user) {
      //   // Note that this if condition is needed
      //   session.user = token.user;
      // }
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
