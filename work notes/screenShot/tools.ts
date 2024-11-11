import { Vector2d } from 'konva/lib/types';
import Konva from 'konva';

import { BoundRect, RectInfo } from './type';

export const ImageTool = class {
  getBoundPosition(position: Vector2d, boundRect: BoundRect) {
    // Destructure position into x and y coordinates
    const { x, y } = position;
    // Destructure bounding rectangle dimensions and box dimensions
    const { width, height, boxWidth, boxHeight } = boundRect;
    // Initialize d (left boundary) and p (right boundary) for x-axis
    let d = 0;
    let p = boxWidth - width;
    // If the width is negative, adjust the boundaries
    if (width < 0) {
      d = -width;
      p = boxWidth;
    }
    // Initialize h (top boundary) and f (bottom boundary) for y-axis
    let h = 0;
    let f = boxHeight - height;
    // If the height is negative, adjust the boundaries
    if (height < 0) {
      h = -height;
      f = boxHeight;
    }
    // Ensure the x coordinate is within the horizontal boundaries (d to p)
    let m = Math.max(d, Math.min(p, x));
    // Ensure the y coordinate is within the vertical boundaries (h to f)
    let g = Math.max(h, Math.min(f, y));
    // Return the bounded position
    return {
      x: m,
      y: g
    };
  }
  cropImage(e: CanvasImageSource, r: RectInfo) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    canvas.width = r.width,
    canvas.height = r.height,
    ctx.drawImage(e, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
    return canvas.toDataURL();
  }
  dataUrlToBlob(e: string) {
    let r = e.split(',');
    const type = r[0].match(/:(.*?);/)?.[1];
    const i = atob(r[1]);
    let len = i.length;
    const result = new Uint8Array(len);
    while (len--) {
      result[len] = i.charCodeAt(len);
    }
    return new Blob([result],{
      type
    });
  }
};

export const createRectanglePath = (topLeftPoint: Vector2d, bottomRightPoint: Vector2d, strokeWidth: number) => {
  let halfStrokeWidth = strokeWidth / 2;

  // if topLeft === bottomRight, return a vertical line
  if (topLeftPoint.x === bottomRightPoint.x) {
    let topY = Math.min(topLeftPoint.y, bottomRightPoint.y);
    let bottomY = Math.max(topLeftPoint.y, bottomRightPoint.y);
    // return a vertical line
    return [
      topLeftPoint.x - halfStrokeWidth, topY - halfStrokeWidth,
      topLeftPoint.x + halfStrokeWidth, topY - halfStrokeWidth,
      bottomRightPoint.x + halfStrokeWidth, bottomY + halfStrokeWidth,
      bottomRightPoint.x - halfStrokeWidth, bottomY + halfStrokeWidth
    ];
  }

  // make sure left point is the top left corner and right point is the bottom right corner
  let leftPoint = topLeftPoint.x < bottomRightPoint.x ? topLeftPoint : bottomRightPoint;
  let rightPoint = topLeftPoint.x < bottomRightPoint.x ? bottomRightPoint : topLeftPoint;

  // if the bottom right point is above the top left point, form an "upward" oblong
  if (rightPoint.y < leftPoint.y) {
    return [
      leftPoint.x + halfStrokeWidth, leftPoint.y + halfStrokeWidth,
      leftPoint.x - halfStrokeWidth, leftPoint.y + halfStrokeWidth,
      leftPoint.x - halfStrokeWidth, leftPoint.y - halfStrokeWidth,
      rightPoint.x - halfStrokeWidth, rightPoint.y - halfStrokeWidth,
      rightPoint.x + halfStrokeWidth, rightPoint.y - halfStrokeWidth,
      rightPoint.x + halfStrokeWidth, rightPoint.y + halfStrokeWidth
    ];
  } else {
    // if the bottom right point is below the top left point, form a "downward" oblong
    return [
      leftPoint.x - halfStrokeWidth, leftPoint.y + halfStrokeWidth,
      leftPoint.x - halfStrokeWidth, leftPoint.y - halfStrokeWidth,
      leftPoint.x + halfStrokeWidth, leftPoint.y - halfStrokeWidth,
      rightPoint.x + halfStrokeWidth, rightPoint.y - halfStrokeWidth,
      rightPoint.x + halfStrokeWidth, rightPoint.y + halfStrokeWidth,
      rightPoint.x - halfStrokeWidth, rightPoint.y + halfStrokeWidth
    ];
  }
};

export const handleGenericMove = (options: {
  deviation?: number,
  shape: Konva.Shape,
  getStartPos: () => Vector2d,
  onDrag: (position: Vector2d) => void
}) => {
  const { deviation = 5, shape, getStartPos, onDrag } = options;
  let oldPos: Vector2d | null = null;
  let shapePos: Vector2d | null = null;
  let isDragging = false;
  shape.on('dragstart', ()=>{
    oldPos = getStartPos(),
    shapePos = {
      x: shape.x(),
      y: shape.y()
    };
  });
  shape.on('dragmove', ()=>{
    if (!oldPos || !shapePos) return;
    let curPos = {
      x: shape.x(),
      y: shape.y()
    };
    if (!isDragging && (Math.abs(oldPos.x - curPos.x) > deviation || Math.abs(oldPos.y - curPos.y) > deviation) ) {
      isDragging = true;
    }
    if (isDragging) {
      const nexX = oldPos.x + (curPos.x - shapePos.x);
      const nexY = oldPos.y + (curPos.y - shapePos.y);
      onDrag({
        x: nexX,
        y: nexY
      });
    }
  });
};
