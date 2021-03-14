import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DrawingData } from 'shared/@types';
import { RoomNames } from 'shared/constants';
import { SocketContext } from '../../context/socket';
import Canvas from './components/Canvas';
import Palette from './components/Palette';
import { DEFAULT_DRAWING_DATA } from './constants/drawingData';
import styles from "./styles.module.css";

const CanvasController: React.VFC = () => {
  const [drawingData, setDrawingData] = useState<DrawingData>(DEFAULT_DRAWING_DATA);
  const io = useContext(SocketContext);
  const throttled = useRef(throttle((data: DrawingData) => {console.log(data); return io.emit(RoomNames.Drawing, data)}, 5))


  useEffect(() => {
    io.on(RoomNames.Drawing, (data: DrawingData) => {
      setDrawingData(data);
    })
  }, [io]);

  const handleDraw = useCallback((data: DrawingData) => {
    
    throttled.current(data);
    
  }, [throttled]);

  const handlePick = useCallback((color) => {
    setDrawingData({
      ...drawingData,
      color: color
    })
  }, [drawingData])

  return (
    <div className = {styles.canvasController} >
      <Palette onPick = {handlePick}/>
      <Canvas drawingData={drawingData} onDraw={handleDraw}/>
    </div>
    
  )
};

export default CanvasController;


// limit the number of events per second
const throttle = (callback: Function, delay: number)  => {
  let previousCall = new Date().getTime();
  return function(arg: DrawingData) {
    const time = new Date().getTime();

    if ((time - previousCall) >= delay) {
      previousCall = time;
      console.log("throttle", arg)
      callback.call(null, arg);
    }
  };
}
