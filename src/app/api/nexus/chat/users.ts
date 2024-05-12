// users.ts
import type { IChatOperation, IChatConnection } from '@types';

interface IUserSet extends Set<string> {
  addUser: (value: IChatConnection) => IChatOperation;
  removeUser: (value: IChatConnection) => IChatOperation;
  findUser: (value: IChatConnection) => IChatOperation;
  getRoom: (value: IChatConnection) => IChatOperation;
}

const UserSet = new Set([]) as unknown as IUserSet;
const User: IChatConnection[] = [] as IChatConnection[];

UserSet.addUser = ({ id, room, username }: IChatConnection): IChatOperation => {
  const response: IChatOperation = { error: undefined, ans: [] };
  try {
    if (!!username && !UserSet.has(username)) {
      const userToAdd = {
        username,
        id,
        room,
      };
      UserSet.add(username);
      User.push(userToAdd);
      response.ans = [userToAdd];
    } else {
      response.error = 'User already in the list';
    }
  } catch (e) {
    throw new Error(`Generic: couldn't add ans: ${e}`);
  }
  return response;
};

UserSet.removeUser = ({ username }: IChatConnection): IChatOperation => {
  const response: IChatOperation = { error: undefined, ans: [] };
  try {
    if (!!username && !UserSet.has(username)) {
      const uIndex = User.findIndex((user) => {
        return user.username === username;
      });
      const userToDelete = User[uIndex];
      response.ans = [userToDelete];
      UserSet.delete(username);
      if (uIndex >= 0) User.splice(uIndex, 1);
    } else {
      response.error = 'User not in the chat';
    }
  } catch (e) {
    throw new Error(`Generic: couldn't delete ans: ${e}`);
  }

  return response;
};

UserSet.findUser = ({ username }: IChatConnection): IChatOperation => {
  const response: IChatOperation = { error: undefined, ans: [] };
  try {
    if (!!username && !UserSet.has(username)) {
      const uIndex = User.findIndex((user) => {
        return user.username === username;
      });
      const foundUser = User[uIndex];

      response.ans = [foundUser];
    } else {
      response.error = 'User not found';
    }
  } catch (e) {
    throw new Error(`Generic: couldn't find ans: ${e}`);
  }

  return response;
};

UserSet.getRoom = ({ room }: IChatConnection): IChatOperation => {
  const response: IChatOperation = { error: undefined, ans: [] };
  try {
    if (room) {
      const roomList = User.filter((user) => {
        return user.room === room;
      });
      response.ans = roomList;
    } else {
      response.error = 'No room specified';
    }
  } catch (e) {
    throw new Error(`Generic: couldn't find room list: ${e}`);
  }
  return response;
};

const addUser = ({ id, username, room }: IChatConnection): IChatOperation => {
  try {
    if (!id) throw new Error('Socket error');
    if (!room) throw new Error('Room Name is required');
    if (!username) throw new Error('Username is required!');
    if (UserSet.has(username)) throw new Error('Username already in use');

    const opResult: IChatOperation = UserSet.addUser({ id, room, username });

    return { error: opResult.error, ans: opResult.ans };
  } catch (e) {
    if (!e) return { error: "exit 1: generic error: couldn't add user to the room", ans: [] };
    else return { error: `Generic error, couldn't search ans: ${e}`, ans: [] };
  }
};

const removeUser = ({ id, username }: IChatConnection): IChatOperation => {
  try {
    if (!id) throw new Error('Socket error');
    if (!username) throw new Error('Need to specify an user to delete.');

    const opResult: IChatOperation = UserSet.removeUser({ username });

    return { error: opResult.error, ans: opResult.ans };
  } catch (e) {
    return { error: `Generic error, couldn't search ans: ${e}`, ans: [] };
  }
};

const getUser = ({ username }: IChatConnection): IChatOperation => {
  console.log('init get user');
  try {
    const opRes: IChatOperation = UserSet.findUser({ username });
    return {
      ans: opRes.ans,
      error: opRes.error,
    };
  } catch (e) {
    return {
      error: `Generic error, couldn't search ans: ${e}`,
      ans: [],
    };
  }
};

const getUsersInRoom = ({ room }: IChatConnection): IChatOperation => {
  try {
    const opRes: IChatOperation = UserSet.getRoom({ room });
    return {
      ans: opRes.ans,
      error: opRes.error,
    };
  } catch (e) {
    return {
      error: `Generic error, couldn't search ans: ${e}`,
      ans: [],
    };
  }
};

export { addUser, removeUser, getUser, getUsersInRoom };
