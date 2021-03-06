import React, { useEffect, useRef, useState } from 'react';

type DrawingData = {x0: number, y0: number, x1: number, y1: number, color: string};

interface CanvasProps {
  emit: (draw: DrawingData) => void;
  toDraw: DrawingData
}

const Canvas: React.FC<CanvasProps> = ({ emit, toDraw }) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  let [context, setContext] = useState<CanvasRenderingContext2D | undefined>(undefined);
  let [drawing, setDrawing] = useState<boolean>(false); //Is drawing right now
  let [current, setCurrent] = useState<{x: number, y: number, color: string}>({x: 0, y: 0, color: "#ffffff"}); //Currently drawn line

  useEffect(() => {
    drawLine(toDraw, false);
  }, [drawLine, toDraw])

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d')!;
    setContext(context);

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

  }, []);

  function drawLine(draw: DrawingData, emitEvent: boolean){
    context!.beginPath();
    context!.moveTo(draw.x0, draw.y0);
    context!.lineTo(draw.x1, draw.y1);
    context!.strokeStyle = draw.color;
    context!.lineWidth = 2;
    context!.stroke();
    context!.closePath();

    if (!emit) { return; }
    var w = canvasRef!.current!.width;
    var h = canvasRef!.current!.height;

    if(emitEvent){
      emit({
        x0: draw.x0 / w,
        y0: draw.y0 / h,
        x1: draw.x1 / w,
        y1: draw.y1 / h,
        color: draw.color
      });
    }
  }

  function getClientX(e : MouseEvent | TouchEvent) : number{
    return e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  }

  function getClientY(e : MouseEvent | TouchEvent) : number{
    return e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  }

  function onMouseDown(e : MouseEvent | TouchEvent){
    setDrawing(true);
    setCurrent({x: getClientX(e), y: getClientY(e), color: current.color});
  }

  function onMouseUp(e : MouseEvent | TouchEvent){
    if (!drawing) { return; }
    drawing = false;
    drawLine({x0: current.x, y0: current.y, x1: getClientX(e), y1: getClientY(e), color: current.color}, true);
  }

  function onMouseMove(e : MouseEvent | TouchEvent){
    if (!drawing) { return; }
    drawLine({x0: current.x, y0: current.y, x1: getClientX(e), y1: getClientY(e), color: current.color}, true);
    setCurrent({x: getClientX(e), y: getClientY(e), color: current.color});
  }

  return <canvas ref={canvasRef} />
}

// limit the number of events per second
function throttle(callback: Function, delay: number) {
  var previousCall = new Date().getTime();
  return function() {
    var time = new Date().getTime();

    if ((time - previousCall) >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
}

export default Canvas