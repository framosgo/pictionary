import { Socket } from 'socket.io';
import { RoomNames } from 'shared/constants'
import { DrawingData } from 'shared/@types'

export const onDrawing = (socket: Socket) => {
  socket.on(RoomNames.Drawing, (data: DrawingData) => {
    socket.broadcast.emit(RoomNames.Drawing, data);
  });
}