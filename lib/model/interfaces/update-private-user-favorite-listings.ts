/* eslint-disable no-constant-condition */
// @controller/update-private-user-favorite-listings.ts
import { whoAmI, canI } from '@controller';
import { PrivatePrisma } from '@model';

const updatePrivateUserFavoriteListings = async ({ upsert = true, user, listings = [] }: any) => {
  try {
    if (listings?.length === 0) return new Error('Code 002: Missing data (listings)');

    const loggedUser = user || (await whoAmI());

    if (await canI({ name: 'Ability 1' })) {
      const payload = upsert
        ? {
            favoritesIds: [...loggedUser.favorites, ...listings],
          }
        : {
            favoritesIds: listings,
          };
      const adaptQuery: any = {
        where: {
          email: loggedUser.email,
        },
        data: payload,
      };

      const response = await PrivatePrisma.user.update(adaptQuery);
      return response;
    } else {
      throw new Error(`403: Not authorized.`);
    }
  } catch (e) {
    throw new Error(`Code 003: Missing results: ${e}`);
  }
};

export default updatePrivateUserFavoriteListings;
