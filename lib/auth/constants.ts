// constants.ts TS-Doc?
/* eslint @typescript-eslint/consistent-type-assertions:0 */
import _ from 'lodash';
import type { NextAuthConfig } from 'next-auth';
import { v4 as uuid } from 'uuid';
import type { PrismaClient } from '@prisma/client';
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
  GetPrivateAbilities,
} from '@controller';
import { PrivatePrisma } from '@model';

export const GetSession = async ({ cookies = '' }) => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/auth/session`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: cookies,
      },
      next: { revalidate: 0 },
    });
    const session = await response.json();
    return session;
  } catch (e) {
    console.error(e);
  }
};

// to-do: admin sanitizer

// schema sanitizer
const allUsersSideEffects = async ({ user }: any) => {
  if (!user) return;
  const userServices = user.servicesIds || [];
  const userAbilities = user.abilitiesIds || [];
  const services = await GetPrivateCommonServices({});
  const abilities = await GetPrivateCommonAbilities({});
  const commonServices = services.map((service: any) => service?.id).map((el: any) => el);
  const commonAbilities = abilities.map((ability: any) => ability?.id).map((el: any) => el);

  const [dpcpAbility] = await GetPrivateAbilities({ type: 'R', target: 'dpcp-vibemodulator', action: 'view-listings' });

  const nextAbilities = _.uniq([...commonAbilities, ...userAbilities, dpcpAbility?.id]);
  const nextServices = _.uniq([...commonServices, ...userServices]);

  await UpdatePrivateUserServices({ user, services: nextServices, upsert: false });
  await UpdatePrivateUserAbilities({
    user,
    abilities: nextAbilities,
    upsert: false,
  });
};

export const providers: any[] = [
  EmailProvider({
    server: process.env.EMAIL_SERVER as string,
    from: process.env.EMAIL_FROM as string,
    // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
  }),
  GithubProvider({
    clientId: process.env.AUTH_GITHUB_ID as string,
    clientSecret: process.env.AUTH_GITHUB_SECRET as string,
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  }),
  AppleProvider({
    clientId: process.env.APPLE_CLIENT_ID as string,
    clientSecret: process.env.APPLE_CLIENT_SECRET as string,
    checks: ['pkce'],
    token: {
      url: `https://appleid.apple.com/auth/token`,
    },
    client: {
      token_endpoint_auth_method: 'client_secret_post',
    },
    authorization: {
      params: {
        response_mode: 'form_post',
        response_type: 'code',
        scope: 'name email',
        state: uuid(),
      },
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: '',
      };
    },
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
      try {
        if (isNewUser) {
          // [DPCP-125] https://www.notion.so/angeloreale/Hypnos-Feature-use-lib-log-for-server-console-logs-67993255fc4e4010a08fee263089f9b7?pvs=4
          console.log('dp::hypnos::Running sign-up side-effects');
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
        if (user) {
          // [DPCP-125] https://www.notion.so/angeloreale/Hypnos-Feature-use-lib-log-for-server-console-logs-67993255fc4e4010a08fee263089f9b7?pvs=4
          console.log('dp::hypnos::Callback: Running sign-in side-effects');
          await allUsersSideEffects({ user });
        }
      } catch (e) {
        console.warn(`Code 004: Log-in side-effects failed. If it's a new user, plese ignore: ${e}`);
      }

      return true;
    },
    async redirect() {
      return `${process.env.MAIN_URL}/dash/signin`;
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
        favoritesStrings: user.favoritesStrings,
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
    callbackUrl: {
      name: `__Secure-authjs.callback-url`,
      options: {
        httpOnly: false,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: `authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
    pkceCodeVerifier: {
      name: 'authjs.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
  trustHost: true,
  pages: {
    signIn: '/dash/signin',
    signOut: '/dash/signin',
    error: '/dash/error', // Error code passed in query string as ?error=
    verifyRequest: '/dash/verify', // (used for check email message)
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
