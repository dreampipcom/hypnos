// @interfaces/middleware/authorization.ts
import { getSession } from '@auth';
import { GetPrivateAbilities } from '@controller';
export const canI = async ({ name }: any) => {
  try {
    const ability = await GetPrivateAbilities(name);
    const session = (await getSession()) as any;
    // to-do add authorization/validation checks
    const yes = session?.user?.abilitiesIds?.includes(ability[0]?.id);
    // return the capacity
    return yes;
  } catch (e) {
    throw new Error(`Code 003: Missing results: ${e}`);
  }
};
export const whoAmI = async () => {
  try {
    const session = await getSession();
    // to-do add authorization/validation checks
    return session?.user;
  } catch (e) {
    throw new Error(`Code 003: Missing results: ${e}`);
  }
};
