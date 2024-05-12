// nexus/chat/index.ts
import type { Server as ISocket } from 'socket.io';
import type { Socket as INetSocket } from 'net';
import type { Server as IHTTPServer } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  IChatMessage,
  IClientToServerEvents,
  IServerToClientEvents,
  IInterServerEvents,
  ISocketData,
} from '@types';
import { Server } from 'socket.io';
import { addUser, getUser, getUsersInRoom } from './users';

interface SocketServer extends IHTTPServer {
  io?: ISocket | undefined;
}

interface SocketWithIO extends INetSocket {
  server: SocketServer;
}

interface NextResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (req: NextApiRequest, res: NextResponseWithSocket) => {
  const io = new Server<IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData>(
    res.socket.server,
  );
  io.on('connection', (socket) => {
    if (!res.socket.server.io) {
      const sendAll = ({ room, username, text, id }: IChatMessage) => {
        const { ans: users } = getUsersInRoom({ room });
        if (users?.length) {
          const sockets = users?.map((user) => user.id);
          if (sockets?.length) {
            sockets.forEach(() => {
              try {
                io.emit('message', {
                  id,
                  room,
                  text,
                  username,
                  date: new Date().toISOString(),
                });
              } catch (e) {
                return;
              }
            });
          }
        }
      };

      socket.on('join', ({ username, room }, callback) => {
        const { error } = addUser({ id: socket.id, username, room });
        if (error) {
          return callback(error);
        }

        sendAll({ room, username, text: 'Dude joined.' });
      });

      socket.on('message', (data: IChatMessage) => {
        const { text, username } = data;
        const { ans } = getUser({ username });
        const room = ans[0].room;
        sendAll({ room, username, text });
      });

      res.socket.server.io = io;
    } else {
      console.log('socket.io already running');
    }
    res.end();
  });
};

export default handler;
