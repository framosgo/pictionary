import React from 'react';
import { DrawingData } from 'shared/@types';
import Canvas from './components/Canvas';

const CanvasController: React.VFC = () => {
  const handleDraw = (data: DrawingData) => {
    console.log(data);
  }

  return (
    <Canvas color={'black'} onDraw={handleDraw}/>
  )
};

export default CanvasController;
