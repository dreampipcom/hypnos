// index.ts

/* mdb-ifaces */

/* const */

// default methods
export { NexusInterface } from './mdb-init-interface';

// read
export { getUserMeta } from './mdb-get-interface';

// write
export { commitUpdate, initSignUpUser } from './mdb-update-interface';

/* prisma-public-ifaces */
export { default as GetPublicListings } from './get-public-listings-iface';

/* rm */

// read
export { getCharacters as getRMCharacters } from './services/rickmorty/rm-connector';
