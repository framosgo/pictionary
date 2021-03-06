import { Server, Socket } from 'socket.io';
import * as http from 'http';
import { onDrawing } from './rooms/drawing';

export const initSocket = (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.info('New user connected');

    onDrawing(socket);

    socket.on('disconnect', () => {
      console.info('User disconnected');
    });
  });
};
