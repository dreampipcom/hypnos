// @interfaces/middleware/authorization.ts
import { getSession, GetSession } from '@auth';
import { GetPrivateAbilities } from '@controller';
import { cookies as nextCookies } from 'next/headers';
export const canI = async ({ type, target, action, user }: any) => {
  try {
    console.log({ type, target, action, user });
    const abilities = await GetPrivateAbilities({ type, target, action });
    // to-do add authorization/validation checks
    const yes = abilities?.some((ability) => user?.abilities.includes(ability.id));
    console.log({ abilities, userAbilities: user.abilities, yes });
    // return the capacity
    return yes;
  } catch (e) {
    throw new Error(`Code 008: User is not authorized ${e}`);
  }
};
export const whoAmI = async ({ cookies }: any) => {
  try {
    const cookieString = nextCookies().getAll().toString();
    const session = (await getSession()) || (await GetSession({ cookies: cookieString || cookies }));
    // to-do add authorization/validation checks
    console.log({ cookieString, session });
    return session?.user;
  } catch (e) {
    throw new Error(`Code 007: Can't identify user ${e}`);
  }
};
