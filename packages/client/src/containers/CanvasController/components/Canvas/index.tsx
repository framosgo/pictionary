import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DrawingData, Point } from 'shared/@types';
import styles from "./styles.module.css";

interface Props {
  onDraw: (draw: DrawingData) => void;
  drawingData: DrawingData;
}

enum ScaleOption {
  ScaleUp,
  ScaleDown,
}

const Canvas: React.FC<Props> = ({ onDraw, drawingData }) => {
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
          startPoint: scalePoint(data.startPoint, canvasRef.current, ScaleOption.ScaleDown),
          endPoint: scalePoint(data.endPoint, canvasRef.current, ScaleOption.ScaleDown),
        }
        onDraw(scaledDrawingData);
      }
    }
  }, [onDraw, canvasRef]);

  useEffect(() => {
    if (canvasRef.current && drawingData) {
      const scaledDrawingData: DrawingData = {
        startPoint: scalePoint(drawingData.startPoint, canvasRef.current, ScaleOption.ScaleUp),
        endPoint: scalePoint(drawingData.endPoint, canvasRef.current, ScaleOption.ScaleUp),
        color: drawingData.color
      }
      drawLine(scaledDrawingData, false);
    }
  }, [drawLine, drawingData, canvasRef]);

  const onMouseDown = useCallback((e : MouseEvent | TouchEvent): void => {
    isDrawing.current = true;
    position.current = getClientPoint(e);
  }, []);

  const onMouseMove = useCallback((e : MouseEvent | TouchEvent): void => {
    if (isDrawing.current) {
      const startPoint = position.current;
      const endPoint = getClientPoint(e);
      const dataToDrawLine: DrawingData = { startPoint, endPoint, color: drawingData.color}
      drawLine(dataToDrawLine, true);
      position.current = endPoint;
    }
  }, [drawLine, drawingData.color])

  const onMouseUp = useCallback(() => {
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
      canvas.addEventListener('mousemove', onMouseMove, false);

      return () => {
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('mouseout', onMouseUp);
        canvas.removeEventListener('mousemove', onMouseMove);
      }
    }

  }, [canvasRef, onMouseDown, onMouseMove, onMouseUp]);

  const [dimensions, setDimensions] = useState({height: "100", width: "100"});

  useEffect(() => {
    if(canvasRef.current){
      const {width, height} = getComputedStyle(canvasRef.current);
      setDimensions({width, height})
    }

  }, [canvasRef]);

  return <canvas ref={canvasRef} className = {styles.canvas} width = {dimensions.width} height = {dimensions.height} />
}

const scalePoint = (point: Point, { height, width }: HTMLCanvasElement, scaleOption: ScaleOption) => ({
  x: scaleOption === ScaleOption.ScaleUp ? point.x * width : point.x / width,
  y: scaleOption === ScaleOption.ScaleUp ? point.y * height : point.y / height,
})

const getClientPoint = (e : MouseEvent | TouchEvent): Point => {
  const element = e instanceof MouseEvent ? e!.target as HTMLCanvasElement : e.touches[0].target as  HTMLCanvasElement;

  const rect = element.getBoundingClientRect();

  const x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left;
  const y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top;

  return { x, y }
}

export default Canvas