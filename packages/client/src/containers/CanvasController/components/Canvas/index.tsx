import React, { useCallback, useEffect, useRef } from 'react';
import { DrawingData, Point } from 'shared/@types';

interface Props {
  onDraw: (draw: DrawingData) => void;
  drawingData?: DrawingData;
  color: string;
}

enum ScaleOption {
  ScaleUp,
  ScaleDown,
}

const Canvas: React.FC<Props> = ({ onDraw, drawingData, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef<boolean>(false);
  const position = useRef<Point>({x: 0, y: 0});

  const drawLine = useCallback((data: DrawingData, shouldSend: boolean) => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.beginPath();
        context.moveTo(data.startPoint.x, data.startPoint.y);
        context.lineTo(data.endPoint.x, data.endPoint.y);
        context.strokeStyle = data.color;
        context.lineWidth = 2;
        context.stroke();
        context.closePath();
      }
  
      if(shouldSend){
        const scaledDrawingData: DrawingData = {
          ...data,
          startPoint: scalePoint(data.startPoint, canvasRef.current, ScaleOption.ScaleUp),
          endPoint: scalePoint(data.endPoint, canvasRef.current, ScaleOption.ScaleUp),
        }
        onDraw(scaledDrawingData);
      }
    }
  }, [onDraw, canvasRef]);

  useEffect(() => {
    if (canvasRef.current && drawingData) {
      const scaledDrawingData: DrawingData = {
        ...drawingData,
        startPoint: scalePoint(drawingData.startPoint, canvasRef.current, ScaleOption.ScaleUp),
        endPoint: scalePoint(drawingData.endPoint, canvasRef.current, ScaleOption.ScaleUp),
      }
      drawLine(scaledDrawingData, false);
    }
  }, [drawLine, drawingData]);

  const onMouseDown = useCallback((e : MouseEvent | TouchEvent): void => {
    isDrawing.current = true;
    position.current = getClientPoint(e);
  }, []);

  const onMouseMove = useCallback((e : MouseEvent | TouchEvent): void => {
    if (isDrawing.current) {
      const startPoint = position.current;
      const endPoint = getClientPoint(e);
      const drawingData: DrawingData = { startPoint, endPoint, color}
      drawLine(drawingData, true);
      position.current = endPoint;
    }
  }, [color, drawLine]);

  const onMouseUp = useCallback((e : MouseEvent | TouchEvent): void => {
    if (isDrawing.current) {
      isDrawing.current = false;
    }
  }, [isDrawing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {

      canvas.addEventListener('mousedown', onMouseDown, false);
      canvas.addEventListener('mouseup', onMouseUp, false);
      canvas.addEventListener('mouseout', onMouseUp, false);
      canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

      return () => {
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('mouseout', onMouseUp);
        canvas.removeEventListener('mousemove', onMouseMove);
      }
    }

  }, [canvasRef, onMouseDown, onMouseMove, onMouseUp]);

  return <canvas ref={canvasRef} />
}

const scalePoint = (point: Point, { height, width }: HTMLCanvasElement, scaleOption: ScaleOption) => ({
  x: scaleOption === ScaleOption.ScaleUp ? point.x * width : point.x / width,
  y: scaleOption === ScaleOption.ScaleUp ? point.y * height : point.y / height,
})

const getClientPoint = (e : MouseEvent | TouchEvent): Point => {
  const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  return { x, y }
}

// limit the number of events per second
const throttle = (callback: Function, delay: number)  => {
  let previousCall = new Date().getTime();
  return function() {
    const time = new Date().getTime();

    if ((time - previousCall) >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
}

export default Canvas