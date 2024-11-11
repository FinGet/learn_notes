import Konva from 'konva';
import { Vector2d } from 'konva/lib/types';
import { KonvaEventObject } from 'konva/lib/Node';



import { strokeColor } from './config';
import { handleGenericMove, createRectanglePath } from './tools';

import { EventEmitter } from '~public/utils/eventEmitter';
import { randomUUID } from '~public/utils';

type KonvaEvent = KonvaEventObject<MouseEvent>
const CreatorMouseEvent = class {
  useCommonCreator(options: {
    deviation?: number;
    trigger?: 'click' | 'drag';
    create: (r: any) => any;
    handleUpdate?: (r: any, n: Vector2d, i: Vector2d) => void;
  }) {
    let oldPos = { x: 0, y: 0 };
    let isDragging = false;
    let createdObject: any = null;
    const { deviation = 5, trigger = 'drag', create, handleUpdate } = options;

    return {
      onmousedown: (event: KonvaEvent) => {
        oldPos = {
          x: event.evt.clientX,
          y: event.evt.clientY
        };

        if (trigger === 'click' && !createdObject) {
          create(oldPos);
        }
      },
      onmousemove: (event: KonvaEvent) => {
        let currentPosition = {
          x: event.evt.clientX,
          y: event.evt.clientY
        };
        if (!isDragging && (Math.abs(oldPos.x - currentPosition.x) > deviation || Math.abs(oldPos.y - currentPosition.y) > deviation)) {
          isDragging = true;
        }

        if (isDragging && trigger === 'drag') {
          if (!createdObject) {
            createdObject = create(oldPos);
          }
          handleUpdate?.(createdObject, oldPos, currentPosition);
          createdObject.draw();
        }
      },
      onmouseup: (event: KonvaEvent) => {
        createdObject?.emit('changed', null);
      }
    };
  }
};

export const RectCreator = class extends CreatorMouseEvent {
  getCreator(e: any) {
    return this.useCommonCreator({
      create: r => {
        let n = e.controller.activeToolConfigs.rect;
        const shape = new ReactShape(e.runeManager, r.x, r.y, 0, 0, n.color, n.size);
        e.runeManager.addRune(shape);
        return shape;
      },
      handleUpdate: (r, n, i) => {
        r.x = Math.min(n.x, i.x),
          r.y = Math.min(n.y, i.y),
          r.w = Math.abs(n.x - i.x),
          r.h = Math.abs(n.y - i.y),
          r.draw();
      }
    });
  }
};

export const CircleCreator = class extends CreatorMouseEvent {
  getCreator(e: any) {
    return this.useCommonCreator({
      create: r => {
        let n = e.controller.activeToolConfigs.circle;
        const shape = new CircleShape(e.runeManager, r.x, r.y, 0, 0, n.color, n.size);
        e.runeManager.addRune(shape);
        return shape;
      },
      handleUpdate: (r, n, i) => {
        r.x = Math.min(n.x, i.x),
          r.y = Math.min(n.y, i.y),
          r.w = Math.abs(n.x - i.x),
          r.h = Math.abs(n.y - i.y),
          r.draw();
      }
    });
  }
};

export const ArrowCreator = class extends CreatorMouseEvent {
  getCreator(e: any) {
    return this.useCommonCreator({
      create: r => {
        let n = e.controller.activeToolConfigs.arrow;
        const shape = new ArrowShape(e.runeManager, r.x, r.y, r.x, r.y, n.color, n.size);
        e.runeManager.addRune(shape);
        return shape;
      }
      ,
      handleUpdate: (r, n, i) => {
        r.ax = n.x,
          r.ay = n.y,
          r.bx = i.x,
          r.by = i.y,
          r.draw();
      }
    });
  }
};
export const TextCreator = class extends CreatorMouseEvent {
  getCreator(e: any) {
    return this.useCommonCreator({
      trigger: 'click',
      create: r => {
        let n = e.controller.activeToolConfigs.text;
        const shape = new TextShape(e, r.x, r.y, 0, 0, '', n.size, n.color);
        shape.createEditableNode();
        return shape;
      }
    });
  }
};

export const PenCreator = class extends CreatorMouseEvent {
  getCreator(e: any) {
    return this.useCommonCreator({
      create: r => {
        let n = e.controller.activeToolConfigs.pen;
        const shape = new PenShape(e.runeManager, r.x, r.y, [], n.color, n.size);
        e.runeManager.addRune(shape);
        return shape;
      }
      ,
      handleUpdate: (r, n, i) => {
        r.addPoint(i.x - n.x, i.y - n.y),
          r.draw();
      }
    });
  }
};

export const MosaicCreator = class extends CreatorMouseEvent {
  getCreator(e: any) {
    return this.useCommonCreator({
      create: r => {
        let n = e.controller.activeToolConfigs.mosaic;
        let i = e.runeManager.getMosaicRune();
        if (i) {
          i.addNewPath(n.size, [r.x, r.y]);
          return i;
        }
        let o = new MosaicShape(e, [{
          size: n.size,
          points: [r.x, r.y]
        }]);
        e.runeManager.addRune(o);
        return o;
      },
      handleUpdate: (r, n, i) => {
        r.addPathPoint(i.x, i.y),
        e.runeManager.drawRunes();
      }
    });
  }
};

const ShapeAction = class extends EventEmitter {
  id;
  handlers = [];
  selected = false;
  manager;
  toolConfig;
  constructor(e) {
    super();
    this.id = randomUUID();
    this.manager = e;
    this.toolConfig = {
      size: 4,
      color: ''
    };
  }
  getShapes() {
    return [this.shape, ...this.handlers.map(e => e.shape)];
  }
  handleSelect() {
    this.selected = true;
    this.handlers.forEach(e => {
      e.show();
    });
    this.moveToTop();
  }
  moveToTop() {
    this.shape.moveToTop();
    this.handlers.forEach(e => {
      e.shape.moveToTop();
    });
  }
  handleUnselect() {
    this.selected = false;
    this.handlers.forEach(e => {
      e.hide();
    });
  }
  draw() {
    this.shape.draw();
    this.handlers.forEach(e => {
      e.draw();
    });
  }
  setToolConfig(e) {
    this.applyToolConfig(e);
    this.draw();
    this.markToolConfigChange();
    this.emit('changed', null);
  }
  markToolConfigChange() {
    let e = this.getToolConfig();
    this.toolConfig = e;
  }
};

const CircleShape = class extends ShapeAction {
  x;
  y;
  w;
  h;
  color;
  strokeWidth;
  anchors = [];
  boundary;
  type = 'circle';
  shape;
  constructor(e, r, n, i, o, a, l) {
    super(e),
      this.x = r,
      this.y = n,
      this.w = i,
      this.h = o,
      this.color = a,
      this.strokeWidth = l,
      this.shape = new Konva.Ellipse({
        x: r + i / 2,
        y: n + o / 2,
        radiusX: i / 2,
        radiusY: o / 2,
        stroke: a,
        strokeWidth: l,
        listening: false
      }),
      this.createHandlers(),
      this.markToolConfigChange();
  }
  draw() {
    let { x: e, y: r, w: n, h: i, color: o, strokeWidth: a } = this;
    this.shape.setAttrs({
      x: e + n / 2,
      y: r + i / 2,
      radiusX: Math.abs(n / 2),
      radiusY: Math.abs(i / 2),
      strokeWidth: a,
      stroke: o
    }),
      this.boundary.shape.setAttrs({
        x: e + n / 2,
        y: r + i / 2,
        points: this.sampleEllipsePoints(0, 0, n / 2, i / 2)
      }),
      this.anchors[0].setPos(e, r),
      this.anchors[1].setPos(e + n, r),
      this.anchors[2].setPos(e, r + i),
      this.anchors[3].setPos(e + n, r + i),
      super.draw();
  }
  clone() {
    return new CircleShape(this.manager, this.x, this.y, this.w, this.h, this.color, this.strokeWidth);
  }
  applyToolConfig(e) {
    this.color = e.color,
      this.strokeWidth = e.size;
  }
  getToolConfig() {
    return {
      color: this.color,
      size: this.strokeWidth
    };
  }
  createHandlers() {
    this.createBoundaryHandler();
    this.createAnchors();
    this.handlers.forEach(e => {
      e.on('dragEnd', () => {
        this.normalize();
        this.emit('changed', null);
      });
    });
  }
  createBoundaryHandler() {
    let e = new Konva.Line({
      x: 0,
      y: 0,
      points: [],
      stroke: strokeColor,
      strokeWidth: 2,
      opacity: 0,
      hitStrokeWidth: 16,
      draggable: true
    });
    this.boundary = new Boundary(this, e, 'move'),
      this.boundary.on('drag', r => {
        this.x = r.x - this.w / 2,
          this.y = r.y - this.h / 2,
          this.draw();
      }
      ),
      this.handlers.push(this.boundary);
  }
  normalize() {
    let { x: e, y: r, w: n, h: i } = this;
    this.x = Math.min(e, e + n),
      this.y = Math.min(r, r + i),
      this.w = Math.abs(n),
      this.h = Math.abs(i),
      this.draw();
  }
  createAnchors() {
    let e = new Anchors(this, 0, 0, 'nwse-resize');
    e.on('drag', o => {
      let a = o.x - this.x
        , l = o.y - this.y;
      this.x = o.x,
        this.y = o.y,
        this.w -= a,
        this.h -= l,
        this.draw();
    });
    let r = new Anchors(this, this.w, 0, 'nesw-resize');
    r.on('drag', o => {
      let a = o.x - (this.x + this.w)
        , l = o.y - this.y;
      this.y = o.y,
        this.w += a,
        this.h -= l,
        this.draw();
    });
    let n = new Anchors(this, 0, this.h, 'nesw-resize');
    n.on('drag', o => {
      let a = o.x - this.x
        , l = o.y - (this.y + this.h);
      this.x = o.x,
        this.w -= a,
        this.h += l,
        this.draw();
    }
    );
    let i = new Anchors(this, this.w, this.h, 'nwse-resize');
    i.on('drag', o => {
      let a = o.x - (this.x + this.w)
        , l = o.y - (this.y + this.h);
      this.w += a,
        this.h += l,
        this.draw();
    }
    ),
      this.anchors = [e, r, n, i],
      this.handlers.push(e, r, n, i);
  }
  sampleEllipsePoints(e, r, n, i, o = 64) {
    let a = [];
    for (let l = 0; l < o; l++) {
      let c = 2 * Math.PI * l / o
        , d = e + n * Math.cos(c)
        , p = r + i * Math.sin(c);
      a.push(d, p);
    }
    return a.push(a[0], a[1]),
      a;
  }
};

const TextShape = class extends ShapeAction {
  board;
  x;
  y;
  w;
  h;
  size;
  color;
  text = '';
  type = 'text';
  shape;
  boundary;
  editableNode = null;
  constructor(e, r, n, i = 0, o = 0, a, l, c) {
    super(e.runeManager),
    this.board = e,
    this.x = r,
    this.y = n,
    this.w = i,
    this.h = o,
    this.text = a,
    this.size = l,
    this.color = c,
    this.shape = new Konva.Text({
      x: r,
      y: n,
      width: 0,
      height: 0,
      text: a,
      fontSize: l,
      fontFamily: 'sans-serif',
      fill: c,
      draggable: false,
      padding: 6
    }),
    this.shape.on('mousedown', d => {
      d.cancelBubble = true;
    }
    ),
    this.shape.on('mouseup', d => {
      d.cancelBubble = true;
    }
    ),
    this.shape.on('mouseenter', d => {
      d.cancelBubble = true,
        this.board.runeManager.setCursor('move');
    }
    ),
    this.shape.on('mouseleave', d => {
      d.cancelBubble = true,
        this.board.runeManager.setCursor('crosshair');
    }
    ),
    this.shape.on('dragmove', d => {
      d.cancelBubble = true;
      let { x: p, y: h } = d.target.getPosition();
      this.x = p,
        this.y = h,
        this.draw();
    }
    ),
    this.createHandlers(),
    this.markToolConfigChange();
  }
  draw() {
    let { x: e, y: r, w: n, h: i, text: o, size: a, color: l } = this;
    this.shape.setAttrs({
      x: e,
      y: r,
      width: n,
      height: i,
      fontSize: a,
      text: o,
      fill: l
    });
    this.boundary.shape.setAttrs({
      x: e,
      y: r,
      width: n,
      height: i
    });
    super.draw();
  }
  clone() {
    return new TextShape(this.board, this.x, this.y, this.w, this.h, this.text, this.size, this.color);
  }
  createEditableNode() {
    let { x: e, y: r, text: n, size: i, color: o } = this
      , a = document.createElement('div');
    this.addCommonStyles(a, {
      left: e,
      top: r,
      fontSize: i,
      color: o
    }),
    a.contentEditable = 'true',
    a.innerText = n,
    a.addEventListener('click', c => {
      c.stopPropagation();
    });
    let l = document.createElement('div');
    l.style.position = 'absolute',
      l.style.left = '0',
      l.style.right = '0',
      l.style.top = '0',
      l.style.bottom = '0',
      l.style.background = 'transparent',
      l.style.zIndex = '1000',
      l.addEventListener('click', c => {
        if (c.stopPropagation(),
          !a)
          return;
        let d = a.innerText;
        if (d === '') {
          a.remove(),
            l.remove(),
            this.editableNode = null;
          return;
        }
        this.manager.addRune(this);
        let p = a.getBoundingClientRect();
        this.w = p.width;
        this.h = p.height;
        this.text = d;
        this.draw();
        a.remove();
        l.remove();
        this.editableNode = null;
        this.emit('changed');
      }),
      l.addEventListener('keydown', c => {
        c.stopPropagation();
      }),
      l.appendChild(a),
      this.editableNode = a,
      this.board.rootNode.appendChild(l),
      setTimeout(() => {
        let c = document.createRange();
        c.selectNodeContents(a);
        c.collapse(false);
        let d = window.getSelection();
        d?.removeAllRanges();
        d?.addRange(c);
        a.focus();
      }, 10);
  }
  applyToolConfig(e) {
    this.color = e.color,
      this.size = e.size;
    let r = this.getTextBoxRect();
    this.w = r.width,
      this.h = r.height;
  }
  getToolConfig() {
    return {
      color: this.color,
      size: this.size
    };
  }
  createHandlers() {
    this.createBoundaryHandler(),
    this.handlers.forEach(e => {
      e.on('dragEnd', () => {
        this.emit('changed', null);
      });
    });
    this.boundary.shape.on('dblclick', () => {
      this.w = 0;
      this.h = 0;
      this.draw();
      this.createEditableNode();
    });
  }
  createBoundaryHandler() {
    let e = new Konva.Rect({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      stroke: strokeColor,
      strokeWidth: 2,
      cornerRadius: 4,
      draggable: true,
      opacity: 0
    });
    this.boundary = new TextBoundary(this, e, 'move');
    this.boundary.on('drag', r => {
      this.x = r.x;
      this.y = r.y;
      this.draw();
    });
    this.handlers.push(this.boundary);
  }
  getTextBoxRect() {
    let e = document.createElement('div');
    this.addCommonStyles(e, {
      left: -999,
      top: -999,
      fontSize: this.size,
      color: this.color,
      visibility: 'hidden'
    }),
      e.innerText = this.text,
      this.board.rootNode.appendChild(e);
    let r = e.getBoundingClientRect();
    return e.remove(),
      r;
  }
  addCommonStyles(e, { left: r, top: n, fontSize: i, color: o, visibility: a = 'visible' }) {
    let l = {
      position: 'absolute',
      left: `${r}px`,
      top: `${n}px`,
      border: '2px solid #5C97F7',
      borderRadius: '4px',
      boxSizing: 'border-box',
      padding: '4px',
      lineHeight: '1',
      color: o,
      caretColor: o,
      outline: 'none',
      fontSize: `${i}px`,
      fontFamily: 'sans-serif',
      visibility: a
    };
    Object.keys(l).forEach(c => {
      e.style[c] = l[c];
    });
  }
};

const PenShape = class extends ShapeAction {
  x;
  y;
  points;
  color;
  size;
  boundary;
  type = 'pen';
  shape;
  constructor(e, r, n, i, o, a) {
    super(e),
      this.x = r,
      this.y = n,
      this.points = i,
      this.color = o,
      this.size = a,
      this.shape = new Konva.Line({
        x: r,
        y: n,
        points: i,
        stroke: o,
        strokeWidth: a,
        lineJoin: 'round',
        lineCap: 'round',
        listening: false
      }),
      this.createHandlers(),
      this.markToolConfigChange();
  }
  draw() {
    let { x: e, y: r, points: n, color: i, size: o } = this;
    this.shape.setAttrs({
      x: e,
      y: r,
      points: n,
      strokeWidth: o,
      stroke: i
    }),
      this.boundary.shape.setAttrs({
        x: e,
        y: r,
        points: n
      }),
      super.draw();
  }
  clone() {
    return new PenShape(this.manager, this.x, this.y, JSON.parse(JSON.stringify(this.points)), this.color, this.size);
  }
  addPoint(e, r) {
    this.points.push(e, r);
  }
  applyToolConfig(e) {
    this.color = e.color,
      this.size = e.size;
  }
  getToolConfig() {
    return {
      color: this.color,
      size: this.size
    };
  }
  createHandlers() {
    this.createBoundaryHandler(),
      this.handlers.forEach(e => {
        e.on('dragEnd', () => {
          this.emit('changed', null);
        });
      });
  }
  createBoundaryHandler() {
    let e = new Konva.Line({
      x: 0,
      y: 0,
      points: [],
      stroke: strokeColor,
      strokeWidth: 2,
      opacity: 0,
      hitStrokeWidth: 4,
      draggable: true
    });
    this.boundary = new Boundary(this, e, 'move');
    this.boundary.on('drag', r => {
      this.x = r.x,
        this.y = r.y,
        this.draw();
    });
    this.handlers.push(this.boundary);
  }
};
const ShapeEvent = class extends EventEmitter {
  type;
  shape;
  draw() {
    this.shape.draw();
  }
  show() {
    this.shape.opacity(1);
    this.draw();
  }
  hide() {
    this.shape.opacity(0);
    this.draw();
  }
  init(e, r) {
    this.shape.on('mousedown', n=>{
      n.cancelBubble = !0,
      e.manager.selectRune(e);
    }),
    this.shape.on('mouseenter', ()=>{
      e.manager.setCursor(r);
    }),
    this.shape.on('mouseleave', ()=>{
      e.manager.restoreCursor();
    }),
    handleGenericMove({
      shape: this.shape,
      getStartPos: ()=>({
        x: this.shape.x(),
        y: this.shape.y()
      }),
      onDrag: n=>{
        this.emit('drag', {
          x: n.x,
          y: n.y
        });
      }
    }),
    this.shape.on('dragend', ()=>{
      this.emit('dragEnd', null);
    });
  }
};

const Boundary = class extends ShapeEvent {
  type = 'custom';
  constructor(e, r, n = 'move') {
    super(),
    this.shape = r,
    this.init(e, n);
  }
};

const Anchors = class extends ShapeEvent {
  type = 'anchor';
  constructor(e, r, n, i = 'move') {
    super(),
      this.shape = new Konva.Circle({
        x: r,
        y: n,
        radius: 5,
        fill: '#fff',
        stroke: strokeColor,
        strokeWidth: 2,
        draggable: true,
        opacity: 0
      }),
      this.init(e, i);
  }
  setPos(e, r) {
    this.shape.setAttrs({
      x: e,
      y: r
    });
  }
};

const TextBoundary = class extends ShapeEvent {
  type = 'custom';
  constructor(e, r, n = 'move') {
    super(),
      this.shape = r,
      this.init(e, n);
  }
  show() {
    this.shape.opacity(.8),
      this.draw();
  }
};

const ArrowShape = class extends ShapeAction {
  ax;
  ay;
  bx;
  by;
  color;
  size;
  anchors = [];
  boundary;
  type = 'arrow';
  shape;
  constructor(e, r, n, i, o, a, l) {
    super(e),
      this.ax = r,
      this.ay = n,
      this.bx = i,
      this.by = o,
      this.size = l,
      this.color = a,
      this.shape = new Konva.Line({
        x: r,
        y: n,
        points: [],
        fill: a,
        closed: true,
        listening: false
      }),
      this.createHandlers(),
      this.markToolConfigChange();
  }
  draw() {
    let { ax: e, ay: r, bx: n, by: i, color: o } = this
      , a = this.getPoints()
      , l = Math.atan2(i - r, n - e) * (180 / Math.PI);
    this.shape.setAttrs({
      x: e,
      y: r,
      points: a,
      rotation: l,
      fill: o
    }),
      this.boundary.shape.setAttrs({
        x: e,
        y: r,
        points: a,
        rotation: l
      }),
      this.anchors[0].setPos(this.ax, this.ay),
      this.anchors[1].setPos(this.bx, this.by),
      super.draw();
  }
  clone() {
    return new ArrowShape(this.manager, this.ax, this.ay, this.bx, this.by, this.color, this.size);
  }
  applyToolConfig(e) {
    this.color = e.color,
      this.size = e.size;
  }
  getToolConfig() {
    return {
      color: this.color,
      size: this.size
    };
  }
  createHandlers() {
    this.createBoundaryHandler();
    this.createAnchors();
    this.handlers.forEach(e => {
      e.on('dragEnd', () => {
        this.emit('changed', null);
      });
    });
  }
  createBoundaryHandler() {
    let e = new Konva.Line({
      x: 0,
      y: 0,
      points: [],
      stroke: strokeColor,
      strokeWidth: 1,
      opacity: 0,
      closed: true,
      draggable: true
    });
    this.boundary = new Boundary(this, e, 'move'),
      this.boundary.on('drag', r => {
        let n = this.bx - this.ax
          , i = this.by - this.ay;
        this.ax = r.x,
          this.ay = r.y,
          this.bx = r.x + n,
          this.by = r.y + i,
          this.draw();
      }),
      this.handlers.push(this.boundary);
  }
  createAnchors() {
    let e = new Anchors(this, this.ax, this.ay, 'default');
    e.on('drag', n => {
      this.ax = n.x,
        this.ay = n.y,
        this.draw();
    });
    let r = new Anchors(this, this.bx, this.by, 'default');
    r.on('drag', n => {
      this.bx = n.x,
        this.by = n.y,
        this.draw();
    });
    this.anchors = [e, r],
    this.handlers.push(e, r);
  }
  getPoints() {
    let { ax: e, ay: r, bx: n, by: i, size: o } = this
      , a = Math.sqrt((n - e) ** 2 + (i - r) ** 2)
      , l = 2
      , c = 8
      , d = 20
      , p = 24
      , h = 1;
    o === 8 ? (l = 4,
      c = 12,
      d = 28,
      p = 32) : o === 16 && (l = 8,
        c = 20,
        d = 40,
        p = 44);
    let f = p * 2;
    a < f && (h = a / f);
    let m = Math.max(a - p * h, 0);
    return [0, -l / 2 * h, m, -c / 2 * h, m, (-d / 2 + 1) * h, m + 1, -d / 2 * h, a, -1, a, 1, m + 1, d / 2 * h, m, (d / 2 - 1) * h, m, c / 2 * h, 0, l / 2 * h];
  }
};

const MosaicShape = class extends ShapeAction {
  type = 'mosaic';
  shape;
  paths;
  board;
  get lastPath() {
    return this.paths[this.paths.length - 1];
  }
  constructor(e, r) {
    super(e.runeManager),
      this.board = e,
      this.paths = r,
      this.shape = new Konva.Group({
        clipFunc: o => {
          this.paths.forEach(a => {
            if (a.points.length === 0)
              return;
            let l = a.points
              , c = a.size * 3
              , d = null;
            for (let p = 0; p < l.length; p += 2) {
              let h = l[p]
                , f = l[p + 1];
              if (d) {
                let m = createRectanglePath({
                  x: d[0],
                  y: d[1]
                }, {
                  x: h,
                  y: f
                }, c);
                o.moveTo(m[0], m[1]);
                for (let g = 2; g < m.length; g += 2)
                  o.lineTo(m[g], m[g + 1]);
              } else
                o.rect(h - c / 2, f - c / 2, c, c);
              d = [h, f];
            }
          });
        },
        listening: false
      });
    let n = 2
      , i = new Konva.Rect({
        x: e.state.x + n,
        y: e.state.y + n,
        width: e.state.width - n * 2,
        height: e.state.height - n * 2,
        ...e.getBgImageFillPattern()
      });
    i.cache(),
      i.filters([Konva.Filters.Pixelate]),
      i.pixelSize(20),
      this.shape.add(i),
      this.markToolConfigChange();
  }
  draw() {
    super.draw();
  }
  clone() {
    return new MosaicShape(this.board, JSON.parse(JSON.stringify(this.paths)));
  }
  addNewPath(e, r) {
    this.paths.push({
      size: e,
      points: r
    });
  }
  addPathPoint(e, r) {
    this.lastPath.points.push(e, r);
  }
  applyToolConfig(e) {
    if (this.lastPath.size !== e.size) {
      if (this.lastPath.points.length === 0) {
        this.lastPath.size = e.size;
        return;
      }
      this.paths.push({
        size: e.size,
        points: []
      });
    }
  }
  getToolConfig() {
    return {
      color: '',
      size: 0
    };
  }
};

const ReactShape = class extends ShapeAction {
  x;
  y;
  w;
  h;
  color;
  strokeWidth;
  anchors = [];
  boundary;
  type = 'rect';
  shape;
  constructor(e, r, n, i, o, a, l) {
    super(e),
      this.x = r,
      this.y = n,
      this.w = i,
      this.h = o,
      this.color = a,
      this.strokeWidth = l,
      this.shape = new Konva.Rect({
        x: r,
        y: n,
        width: i,
        height: o,
        stroke: a,
        strokeWidth: l,
        lineJoin: 'round',
        listening: false
      }),
      this.createHandlers(),
      this.markToolConfigChange();
  }
  draw() {
    let { x: e, y: r, w: n, h: i, color: o, strokeWidth: a } = this;
    this.shape.setAttrs({
      x: e,
      y: r,
      width: n,
      height: i,
      strokeWidth: a,
      stroke: o
    }),
      this.boundary.shape.setAttrs({
        x: e,
        y: r,
        points: [0, 0, n, 0, n, i, 0, i, 0, 0]
      }),
      this.anchors[0].setPos(e, r),
      this.anchors[1].setPos(e + n, r),
      this.anchors[2].setPos(e, r + i),
      this.anchors[3].setPos(e + n, r + i),
      super.draw();
  }
  clone() {
    return new ReactShape(this.manager, this.x, this.y, this.w, this.h, this.color, this.strokeWidth);
  }
  applyToolConfig(e) {
    this.color = e.color,
      this.strokeWidth = e.size;
  }
  getToolConfig() {
    return {
      color: this.color,
      size: this.strokeWidth
    };
  }
  createHandlers() {
    this.createBoundaryHandler(),
      this.createAnchors(),
      this.handlers.forEach(e => {
        e.on('dragEnd', () => {
          this.normalize(),
            this.emit('changed', null);
        });
      });
  }
  createBoundaryHandler() {
    let e = new Konva.Line({
      x: 0,
      y: 0,
      points: [],
      stroke: strokeColor,
      strokeWidth: 2,
      opacity: 0,
      hitStrokeWidth: 16,
      draggable: true
    });
    this.boundary = new Boundary(this, e, 'move');
    this.boundary.on('drag', r => {
      this.x = r.x,
        this.y = r.y,
        this.draw();
    });
    this.handlers.push(this.boundary);
  }
  normalize() {
    let { x: e, y: r, w: n, h: i } = this;
    this.x = Math.min(e, e + n),
      this.y = Math.min(r, r + i),
      this.w = Math.abs(n),
      this.h = Math.abs(i),
      this.draw();
  }
  createAnchors() {
    let e = new Anchors(this, 0, 0, 'nwse-resize');
    e.on('drag', o => {
      let a = o.x - this.x
        , l = o.y - this.y;
      this.x = o.x,
        this.y = o.y,
        this.w -= a,
        this.h -= l,
        this.draw();
    });
    let r = new Anchors(this, this.w, 0, 'nesw-resize');
    r.on('drag', o => {
      let a = o.x - (this.x + this.w)
        , l = o.y - this.y;
      this.y = o.y,
        this.w += a,
        this.h -= l,
        this.draw();
    });
    let n = new Anchors(this, 0, this.h, 'nesw-resize');
    n.on('drag', o => {
      let a = o.x - this.x
        , l = o.y - (this.y + this.h);
      this.x = o.x;
      this.w -= a;
      this.h += l;
      this.draw();
    });
    let i = new Anchors(this, this.w, this.h, 'nwse-resize');
    i.on('drag', o => {
      let a = o.x - (this.x + this.w)
        , l = o.y - (this.y + this.h);
      this.w += a;
      this.h += l;
      this.draw();
    });
    this.anchors = [e, r, n, i],
    this.handlers.push(e, r, n, i);
  }
};
