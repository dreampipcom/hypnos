// constants.ts
<<<<<<< HEAD
let nexusDatabase = "test";
let orgsDatabase = "";
let usersDatabase = "";
let DATABASE_USERS_STRING = "";
let DATABASE_ORGS_STRING = "";

/* lean */
if (process.env.NEXUS_MODE !== "full") {
  console.log("DEFAULT DB IS", process.env.MONGODB_DATABASE);
=======
let nexusDatabase = 'test';
let orgsDatabase = '';
let usersDatabase = '';
let defaultOrg = '';
let DATABASE_USERS_STRING = '';
let DATABASE_ORGS_STRING = '';
let DEFAULT_ORG = 'demo';

/* lean */
if (process.env.NEXUS_MODE !== 'full') {
>>>>>>> a855969635f37653011d0cc6da7c07e74b8a9db3
  nexusDatabase = process.env.MONGODB_DATABASE || nexusDatabase;
} else {
  /* full-model */
  if (process.env.MONGODB_ORGS_DATABASE) {
    orgsDatabase = process.env.MONGODB_ORGS_DATABASE;
  }

  /* users-override (optional) */
  if (process.env.MONGODB_USERS_DATABASE) {
    usersDatabase = process.env.MONGODB_USERS_DATABASE;
  }

<<<<<<< HEAD
=======
  if (process.env.MONGODB_DEFAULT_ORG) {
    defaultOrg = process.env.MONGODB_DEFAULT_ORG;
  }

>>>>>>> a855969635f37653011d0cc6da7c07e74b8a9db3
  // if (process.env.MONGODB_BILLING_DATABASE) {
  //   billingDatabase = process.env.MONGODB_BILLING_DATABASE;
  // }

  // if (process.env.MONGODB_KRN_DATABASE) {
  //   krnDatabase = process.env.MONGODB_KRN_DATABASE;
  // }
}

/* __backwards-compatible: should fallback to nexus */
DATABASE_USERS_STRING = usersDatabase || nexusDatabase;
DATABASE_ORGS_STRING = orgsDatabase || nexusDatabase;
<<<<<<< HEAD
=======
DEFAULT_ORG = defaultOrg || 'demo';
>>>>>>> a855969635f37653011d0cc6da7c07e74b8a9db3

export {
  /* __default__ */
  nexusDatabase as DATABASE_STRING,
  /* __backwards-compatible */
  DATABASE_USERS_STRING,
  DATABASE_ORGS_STRING,
<<<<<<< HEAD
=======
  DEFAULT_ORG,
>>>>>>> a855969635f37653011d0cc6da7c07e74b8a9db3
};
