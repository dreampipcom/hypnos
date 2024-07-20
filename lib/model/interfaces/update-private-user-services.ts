// @controller/update-private-user-services.ts
import { getSession } from '@auth';
import { PrivatePrisma } from '@model';

const updatePrivateUserServices = async ({ upsert = false, user, services }: any) => {
  try {
    // to-do: move this will be a middleware
    if (services?.length === 0) return new Error('Code 002: Missing data (services)');

    const authd = async () => {
      const session = await getSession();

      // to-do add authorization checks

      // return the user
      return session?.user;
    };

    const loggedUser = user || (await authd());

    const payload = upsert
      ? {
          servicesIds: [...loggedUser.servicesIds, ...services],
        }
      : {
          servicesIds: services,
        };

    const adaptQuery: any = {
      where: {
        email: loggedUser.email,
      },
      data: payload,
    };

    const response = await PrivatePrisma.user.update(adaptQuery);

    return response;
  } catch (e) {
    throw new Error(`Code 003: Missing results: ${e}`);
  }
};

export default updatePrivateUserServices;
