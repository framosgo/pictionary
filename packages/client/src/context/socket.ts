import {createContext} from 'react';
import socketIO from 'socket.io-client';

export const socket = socketIO.io('localhost:8080');
export const SocketContext = createContext(socket);