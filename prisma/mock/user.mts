// user.ts
import { faker } from '@faker-js/faker';
import { HOMock } from './helpers.mts';

interface UserModel {
  id: string;
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
  userId: string;
}

export const _mockUser = {
  id: faker.database.mongodbObjectId(),
  name: '{ ∅ }',
  email: 'varsnothing@gmail.com',
  image: 'https://avatars.githubusercontent.com/u/54047316?v=4',
  emailVerified: false,
  userId: '66315b93521b49388fe71aa8',
};

export const createMockUser = ({ name, firstName, lastName, location, email, avatar }: any) => {
  const data = {
    id: faker.database.mongodbObjectId(),
    name: name || faker.person.fullName(),
    email: email || faker.internet.email(),
    image: avatar || faker.image.avatar(),
    firstName: firstName || 'DreamPip',
    lastName: lastName || 'Superuser',
    birthday: new Date(),
    location: location || {
      name: 'Nowhere',
    },
  };

  return data;
};

export const mockUser = createMockUser({});
export const mockUser2 = createMockUser({});
export const mockUser3 = createMockUser({});
