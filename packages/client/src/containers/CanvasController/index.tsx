import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DrawingData } from 'shared/@types';
import { RoomNames } from 'shared/constants';
import { SocketContext } from '../../context/socket';
import Canvas from './components/Canvas';

const CanvasController: React.VFC = () => {
  const [drawingData, setDrawingData] = useState<DrawingData>();
  const io = useContext(SocketContext);

  useEffect(() => {
    io.on(RoomNames.Drawing, (data: DrawingData) => {
      setDrawingData(data);
    })
  }, [io]);

  const handleDraw = useCallback((data: DrawingData) => {
    io.emit(RoomNames.Drawing, data)
  }, [io]);

  return (
    <Canvas color={'black'} drawingData={drawingData} onDraw={handleDraw}/>
  )
};

export default CanvasController;
