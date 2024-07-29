// @interfaces/middleware/authorization.ts
import { getSession, GetSession } from '@auth';
import { GetPrivateAbilities } from '@controller';
import { cookies } from 'next/headers';
export const canI = async ({ name, user }: any) => {
  try {
    const ability = await GetPrivateAbilities({ name });
    // to-do add authorization/validation checks
    const yes = user?.abilities?.includes(ability[0]?.id);
    // return the capacity
    return yes;
  } catch (e) {
    throw new Error(`Code 003: Missing results: ${e}`);
  }
};
export const whoAmI = async () => {
  try {
    const cookieString = cookies().getAll().toString();
    const session = (await getSession()) || (await GetSession({ cookies: cookieString }));
    // to-do add authorization/validation checks
    return session?.user;
  } catch (e) {
    throw new Error(`Code 003: Missing results: ${e}`);
  }
};
