import Konva from 'konva';
import isHotkey from 'is-hotkey';
import { createApp } from 'vue';
import { Vector2d } from 'konva/lib/types';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { Stage } from 'konva/lib/Stage';
import { Shape, ShapeConfig } from 'konva/lib/Shape';



import Toolbar from './toolbar.vue';
import Tips from './tips.vue';
import { ActionType, RectInfo, ScreenShotOptions, ToolConfig, ToolType } from './type';
import { tools, defaultColor, defaultConfig, strokeColor } from './config';
import style from './style';
import { ImageTool } from './tools';
import { ArrowCreator, CircleCreator, MosaicCreator, PenCreator, RectCreator, TextCreator } from './shape';

import { EventEmitter, KeyEventListener } from '~public/utils/eventEmitter';
import { reportEvent } from '~public/composables/useSentry';
import InjectCss from '~public/utils/injectCss';
import { downloadFile, getFileName } from '~public/utils';
import i18n from '~public/plugins/i18n';

const injectCss = new InjectCss('screen-shot');
const imageTool = new ImageTool;

interface DrawingBoardOptions {
  ctx: Konva.Stage;
  backgroundImage: HTMLImageElement | CanvasImageSource;
  controller: any;
  rootNode: HTMLDivElement | null;
}

interface MaskLayerOptions {
  ctx: Konva.Stage;
  backgroundImage: HTMLImageElement | CanvasImageSource;
}


const ToolController = class {
  highlightAreaDragging = false;
  selectedRune: any = null;
  activeTool: ToolType | null = null;
  activeToolConfigs = {
    rect: {
      ...defaultConfig
    },
    text: {
      size: 24,
      color: defaultColor
    },
    arrow: {
      ...defaultConfig
    },
    pen: {
      ...defaultConfig
    },
    circle: {
      ...defaultConfig
    },
    mosaic: {
      size: 4,
      color: ''
    }
  };
  canUndo = false;
  get currentTool() {
    return this.selectedRune ? this.selectedRune.type : this.activeTool;
  }
  get currentToolConfig() {
    return this.selectedRune ? this.selectedRune.toolConfig : this.activeTool ? this.activeToolConfigs[this.activeTool] : null;
  }

  setSelectedRune(rune: any) {
    this.selectedRune = rune;
  }
  setToolConfig(config: ToolConfig) {
    if (this.selectedRune) {
      this.selectedRune.setToolConfig(config);
    }
    if (this.activeTool) {
      this.activeToolConfigs[this.activeTool] = config;
    }
  }
  setActiveTool(tool: ToolType) {
    this.activeTool = tool;
  }
};

export const ScreenShot = class {
  opts: ScreenShotOptions;
  rootNode: HTMLDivElement | null = null;
  stageNode!: HTMLDivElement;
  toolbarReactNode!: HTMLDivElement;
  tipsReactNode!: HTMLDivElement;
  shortcutKeyManager!: KeyEventListener;
  stageCtx: Konva.Stage | null = null;
  pageState: { overflow: string; behavior: string } | null = null;
  maskIns: any = null;
  drawingBoard: any = null;
  toolbarInstance: any = null;
  controller = reactive(new ToolController());
  constructor(options: ScreenShotOptions) {
    this.opts = options;
    this.init();
  }

  async captureArea() {
    if (!this.stageNode) return;

    const { innerWidth, innerHeight } = window;
    const capture = await this.captureVisible();
    if (!capture) return;
    const img: CanvasImageSource = await new Promise(resolve => {
      let a = new Image;
      a.onload = () => { resolve(a); },
        a.src = capture;
    });
    this.stageCtx || (this.stageCtx = new Konva.Stage({
      container: this.stageNode,
      width: innerWidth,
      height: innerHeight
    }));
    this.maskIns = new MaskLayer({
      ctx: this.stageCtx,
      backgroundImage: img
    });
    this.drawingBoard = new DrawingBoard({
      ctx: this.stageCtx,
      backgroundImage: img,
      controller: this.controller,
      rootNode: this.rootNode
    }),
    this.drawingBoard?.on('transform', (rect: RectInfo) => {
      this.showToolbar(rect);
      this.showTips(rect);
    }),
    this.maskIns.on('dragStart', async (rect: RectInfo) => {
      if (this.drawingBoard?.getIsDisabled()) return;
      this.drawingBoard?.disable(true);
      this.hideToolbar();
      this.showTips(rect);
    }),
    this.maskIns.on('dragging', (rect: RectInfo) => {
      this.drawingBoard?.getIsDisabled() || (this.drawingBoard?.draw(rect),
        this.showTips(rect));
    }),
    this.maskIns.on('dragEnd', (rect: RectInfo) => {
      this.drawingBoard?.getIsDisabled() || (this.drawingBoard?.disable(false),
        this.showTips(rect),
        this.showToolbar(rect));
    }),
    this.maskIns.draw();
  }
  captureVisible(): Promise<string> {
    return new Promise(resolve => {
      setTimeout(async () => {
        const screenShot = await browser.default.runtime.sendMessage({
          type: 'capture',
        });
        resolve(screenShot);
      }, 50);
    });
  }
  init() {
    const { innerWidth, innerHeight } = window;
    const rootDiv = document.createElement('div');
    rootDiv.style.position = 'fixed';
    rootDiv.style.top = '0';
    rootDiv.style.left = '0';
    rootDiv.style.width = `${innerWidth}px`;
    rootDiv.style.height = `${innerHeight}px`;
    rootDiv.style.zIndex = '2147483647';
    rootDiv.style.fontFamily = 'Inter';

    document.body.appendChild(rootDiv);
    this.rootNode = rootDiv;
    const i = document.createElement('div');
    rootDiv.appendChild(i),
      this.stageNode = i;
    const o = document.createElement('div');
    rootDiv.appendChild(o),
      this.toolbarReactNode = o;
    const l = document.createElement('div');
    rootDiv.appendChild(l),
      this.tipsReactNode = l,
      this.shortcutKeyManager = new KeyEventListener(this.rootNode),
      this.shortcutKeyManager.on('enter', () => {
        this.copy();
      });
    this.shortcutKeyManager.on('keydown', (event: KeyboardEvent) => {
      if (isHotkey(['backspace', 'delete'], event)) {
        this.controller.selectedRune && this.drawingBoard?.deleteSelectedRune();
      } else if (isHotkey(['esc'], event)) {
        this.close();
      } else if (isHotkey(['mod+z'], event)) {
        this.drawingBoard.undo();
      }
    });
    this.shortcutKeyManager.on('contextmenu', (event: MouseEvent) => {
      event.preventDefault(),
        this.close();
    });
    window.addEventListener('resize', () => {
      if (this.rootNode) {
        this.close();
      }
    });
    this.injectCSS();
  }
  destroy() {
    this.toolbarInstance?.unmount();
    this.maskIns?.destroy();
    this.maskIns = null;
    this.drawingBoard?.destroy();
    this.drawingBoard = null;
    this.rootNode?.remove();
    this.rootNode = null;
    this.stageCtx?.destroy();
    this.stageCtx = null;
    this.shortcutKeyManager.destroy();
    this.opts.onClose?.();
    this.removeInjectCSS();
  }
  showToolbar(rect: RectInfo) {
    const toolbarInstance = createApp(Toolbar, {
      position: rect,
      scene: this.opts.scene,
      disabledTools: this.opts.disabledTools,
      controller: this.controller,
      onToolClick: async (tool: ToolType | ActionType, check: Boolean) => {
        if (this.drawingBoard) {
          if (tools.includes(tool)) {
            this.drawingBoard.selectTool(tool, check);
          }
          if (tool === 'chat' || tool === 'extract') {
            let i = await this.drawingBoard.toDataURL();
            if (!i) return;
            this.destroy();
            tool === 'chat' ? this.opts.onChatAction?.(i) : this.opts.onExtractAction?.(i);
            return;
          }
          if (tool === 'undo') {
            this.drawingBoard?.undo();
            return;
          }
          if (tool === 'close') {
            reportEvent('Suspension_Screenshot_Operation', {
              function_type: 'close'
            });
            this.close();
            return;
          }
          if (tool === 'download') {
            reportEvent('Suspension_Screenshot_Operation', {
              function_type: 'download'
            });
            await this.drawingBoard?.download(),
              this.destroy(),
              this.opts.onDownloadAction?.();
            return;
          }
          if (tool === 'copy') {
            reportEvent('Suspension_Screenshot_Operation', {
              function_type: 'copy'
            });
            this.copy();
            return;
          }
        }
      }
    });
    this.toolbarInstance = toolbarInstance;
    toolbarInstance.use(i18n); // use i18n
    toolbarInstance.mount(this.toolbarReactNode);
  }
  hideToolbar() {
    this.toolbarReactNode.innerHTML = '';
  }
  showTips(rect: RectInfo) {
    const tipsInstance = createApp(Tips, {
      position: rect,
    });
    tipsInstance.mount(this.tipsReactNode);
  }
  disablePageScroll() {
    const { overflow, overscrollBehavior } = document.body.style;
    this.pageState = {
      overflow,
      behavior: overscrollBehavior
    };
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
  }
  enablePageScroll() {
    const { overflow = 'auto', behavior = '' } = this.pageState || {};
    document.body.style.overflow = overflow,
      document.body.style.overscrollBehavior = behavior;
  }
  close = () => {
    this.destroy();
    this.opts.onCloseAction?.();
  };
  async copy() {
    let e = await this.drawingBoard?.copy();
    if (!e) return;
    this.destroy();
    this.opts.onCopyAction?.(e);
  }
  setAttr(e: HTMLElement | Element, r: string, n = 'n') {
    e.setAttribute(r, n);
  }
  injectCSS() {
    injectCss.inject(style);
  }
  removeInjectCSS() {
    injectCss.remove();
  }
};

const MaskLayer = class extends EventEmitter {
  opts: MaskLayerOptions;
  ctx: Konva.Stage;
  maskLayer;
  cursor = 'crosshair';
  constructor(options: MaskLayerOptions) {
    super();
    this.opts = options;
    this.ctx = options.ctx,
      this.maskLayer = new Konva.Layer,
      this.ctx.add(this.maskLayer);
  }

  draw() {
    this.maskLayer.removeChildren(),
      this.ctx.container().style.cursor = this.cursor;
    const background = new Konva.Image({
      x: 0,
      y: 0,
      width: this.ctx.width(),
      height: this.ctx.height(),
      image: this.opts.backgroundImage
    });
    this.maskLayer.add(background);
    let grayLayer = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.ctx.width(),
      height: this.ctx.height(),
      fill: 'black',
      opacity: .3
    });
    const offset = 5;
    let oldPosition: Vector2d | null = null;
    let isDragging = false;
    grayLayer.on('mousedown', event => {
      oldPosition = {
        x: event.evt.clientX,
        y: event.evt.clientY
      };
    });
    grayLayer.on('mousemove', event => {
      if (oldPosition) {
        let u = {
          x: event.evt.clientX,
          y: event.evt.clientY
        };

        if (!isDragging && (Math.abs(oldPosition.x - u.x) > offset || Math.abs(oldPosition.y - u.y) > offset)) {
          isDragging = true;
          this.emit('dragStart', {
            ...oldPosition,
            width: 0,
            height: 0
          });
        }
        if (isDragging) {
          let x = Math.min(oldPosition.x, u.x)
            , y = Math.min(oldPosition.y, u.y)
            , w = Math.abs(oldPosition.x - u.x)
            , h = Math.abs(oldPosition.y - u.y);
          this.emit('dragging', {
            x,
            y,
            width: w,
            height: h
          });
        }
      }
    });
    grayLayer.on('mouseup', event => {
      let u = {
        x: event.evt.clientX,
        y: event.evt.clientY
      };
      if (oldPosition && isDragging) {
        let x = Math.min(oldPosition.x, u.x)
          , y = Math.min(oldPosition.y, u.y)
          , w = Math.abs(oldPosition.x - u.x)
          , h = Math.abs(oldPosition.y - u.y);
        this.emit('dragEnd', {
          x,
          y,
          width: w,
          height: h
        });
      }
      oldPosition = null,
        isDragging = false;
    });
    this.maskLayer.add(grayLayer);
  }
  setCursor(r = this.cursor) {
    this.cursor = r;
  }
  destroy() {
    this.maskLayer?.destroy();
  }
};

const DrawingBoard = class extends EventEmitter {
  opts: DrawingBoardOptions;
  runeManager;
  rootNode;
  state = {
    x: -1,
    y: -1,
    width: -1,
    height: -1
  };
  controller;
  ctx!: Konva.Stage;
  backgroundImage: HTMLImageElement | CanvasImageSource | null = null;
  boardLayer: Konva.Layer | null = null;
  factories = {
    rect: new RectCreator(),
    circle: new CircleCreator(),
    arrow: new ArrowCreator(),
    text: new TextCreator(),
    pen: new PenCreator(),
    mosaic: new MosaicCreator()
  };
  transformDisabled = false;
  activeTool: ToolType | null = null;
  constructor(options: DrawingBoardOptions) {
    super();
    this.opts = options;
    this.controller = options.controller;
    this.rootNode = options.rootNode;
    this.runeManager = new RuneManager(this.controller);
    this.runeManager.on('cursorChange', (cursor: string) => {
      this.setCursor(cursor);
    });
    this.runeManager.on('selectionChange', ({ selectedRune }) => {
      this.controller.setSelectedRune(selectedRune);
    });
    this.init();
  }
  get canUndo() {
    return this.runeManager.canUndo;
  }
  undo() {
    this.runeManager.undo();
  }
  deleteSelectedRune() {
    this.runeManager.deleteSelectedRune();
  }
  selectTool(tool: ToolType, check = true) {
    if (this.state) {
      if (this.controller.selectedRune && this.controller.selectedRune.type !== tool) {
        this.runeManager.clearSelection();
      }
      this.activeTool = check ? tool : null;
      this.controller.setActiveTool(this.activeTool);
      if (!this.activeTool) {
        this.setCursor('default');
      }
      this.draw({
        ...this.state,
        transformDisabled: check
      });
    }
  }
  async download() {
    let base64 = await this.toDataURL();
    if (base64) {
      downloadFile(base64, getFileName());
    }
  }
  async copy() {
    let base64 = await this.toDataURL();
    if (!base64) return '';
    let clipboard = [new ClipboardItem({
      ['image/png']: imageTool.dataUrlToBlob(base64)
    })];
    navigator.clipboard.write(clipboard);
    return base64;
  }
  async draw(options: {
    x: number;
    y: number;
    width: number;
    height: number;
    transformDisabled?: boolean;
    strokeDisabled?: boolean;
  }) {
    const layer = this.boardLayer;
    layer?.removeChildren();
    this.state = {
      ...this.state,
      ...options
    },
      options.transformDisabled && this.disableTransform();
    let i = this.createHighlightShape(options);
    layer?.add(i);
    if (!this.transformDisabled) {
      let o = new Konva.Transformer({
        rotateEnabled: false,
        borderEnabled: false,
        borderStroke: strokeColor,
        borderStrokeWidth: 2,
        borderDash: [3, 3],
        anchorSize: 10,
        anchorCornerRadius: 5,
        anchorStroke: '#ffffff',
        anchorStrokeWidth: 1,
        anchorFill: strokeColor,
        keepRatio: false,
        ignoreStroke: true
      });
      o.nodes([i]),
        layer?.add(o);
    }
    this.runeManager.setLayer(layer);
  }
  async toDataURL() {
    this.runeManager.clearSelection();
    this.draw({
      ...this.state,
      transformDisabled: true,
      strokeDisabled: true
    });
    if (!this.boardLayer) return '';
    const canvas = this.boardLayer.toCanvas();
    const base64 = imageTool.cropImage(canvas, this.state);
    this.draw({
      ...this.state,
      strokeDisabled: false
    });
    return base64;
  }
  getBoundingRect() {
    return this.state ? {
      x: this.state.x,
      y: this.state.y,
      width: this.state.width,
      height: this.state.height
    } : {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }
  disable(r = true) {
    this.boardLayer?.setAttr('listening', !r);
  }
  destroy() {
    this.boardLayer?.destroy();
  }
  getIsDisabled() {
    return this.transformDisabled;
  }
  getBgImageFillPattern() {
    let r = this.backgroundImage;
    const pr = 1 / devicePixelRatio;
    return {
      fillPatternImage: r as HTMLImageElement,
      fillPatternScaleX: pr,
      fillPatternScaleY: pr,
      fillPatternOffsetX: this.state.x / pr,
      fillPatternOffsetY: this.state.y / pr,
      fillPatternRepeat: 'no-repeat'
    };
  }
  async init() {
    this.ctx = this.opts.ctx,
      this.backgroundImage = this.opts.backgroundImage,
      this.boardLayer = new Konva.Layer,
      this.ctx.add(this.boardLayer);
    let r: any = null;
    this.ctx.on('mousedown', event => {
      this.runeManager.clearSelection();
      if (!this.activeTool) return;
      let factory = this.factories[this.activeTool];
      if (!factory) {
        throw new Error(`factory not found for tool: ${this.activeTool}`);
      }
      r = factory.getCreator(this);
      r.onmousedown(event);
      event.cancelBubble = true;
    });
    this.ctx.on('mousemove', event => {
      if (r) {
        r.onmousemove(event);
      }
      event.cancelBubble = true;
    });
    this.ctx.on('mouseup', event => {
      if (r) {
        r.onmouseup(event);
        r = null;
      }
      event.cancelBubble = true;
    });
  }
  disableTransform() {
    this.transformDisabled || (this.transformDisabled = true);
  }
  createHighlightShape(r: RectConfig) {
    const pr = 1 / devicePixelRatio;
    const i = this.getBgImageFillPattern();
    const rect: Konva.Rect = new Konva.Rect({
      ...r,
      ...i,
      strokeEnabled: !r.strokeDisabled,
      stroke: strokeColor,
      strokeWidth: 2,
      strokeScaleEnabled: false,
      dash: [3, 3],
      draggable: !this.transformDisabled,
      dragBoundFunc: l => {
        const { innerWidth, innerHeight } = window;
        const { width, height } = rect.size();
        const rotation = rect.rotation();
        let sX = rect.scaleX();
        let sY = rect.scaleY();
        if (rotation === 180 || rotation === -180) {
          sX *= -1,
            sY *= -1;
        }
        return imageTool.getBoundPosition(l, {
          boxWidth: innerWidth,
          boxHeight: innerHeight,
          width: width * sX,
          height: height * sY
        });
      }
    });
    rect.on('mouseenter', event => {
      event.cancelBubble = true;
      if (this.activeTool) {
        if (tools.includes(this.activeTool)) {
          this.setCursor('crosshair');
        }
      } else {
        this.transformDisabled ? this.setCursor('default') : this.setCursor('move');
      }
    });
    rect.on('mouseleave', event => {
      event.cancelBubble = true;
      this.transformDisabled && !this.activeTool ? this.setCursor('default') : this.setCursor('crosshair');
    });
    rect.on('dragmove', event => {
      event.cancelBubble = true;
      let shape = event.target;
      transform(shape);
    });
    rect.on('dragend', () => {
      this.controller.highlightAreaDragging = false;
    }),
      rect.on('transform', event => {
        event.cancelBubble = true;
        let shape = event.target;
        transform(shape);
      }),
      rect.on('transformend', () => {
        this.controller.highlightAreaDragging = false;
      });
    const transform = (shape: Shape<ShapeConfig> | Stage) => {
      let { x, y } = shape.position();
      let { width, height } = shape.size();
      let scaleX = shape.scaleX();
      let scaleY = shape.scaleY();
      let rotation = shape.rotation();

      if (rotation === 180 || rotation === -180) {
        scaleX *= -1;
        scaleY *= -1;
      }

      rect.setAttrs({
        fillPatternScaleX: pr / scaleX,
        fillPatternScaleY: pr / scaleY,
        fillPatternOffsetX: x / pr,
        fillPatternOffsetY: y / pr
      });
      rect.draw();

      let transformedShape = {
        x: x,
        y: y,
        width: width * scaleX,
        height: height * scaleY
      };
      if (transformedShape.width < 0) {
        transformedShape.x = x + transformedShape.width;
        transformedShape.width = -transformedShape.width;
      }
      if (transformedShape.height < 0) {
        transformedShape.y = y + transformedShape.height;
        transformedShape.height = -transformedShape.height;
      }
      this.state = {
        ...this.state,
        ...transformedShape
      };
      this.controller.highlightAreaDragging = true;
      this.emit('transform', transformedShape);
    };
    return rect;
  }
  setCursor(cursor: string) {
    this.ctx.container().style.cursor = cursor;
  }
};

const RuneManager = class extends EventEmitter {
  controller: any;
  runes: any = [];
  history: any = [];
  lastSnapshot: any = null;
  layer: Konva.Layer | null = null;
  lastCursor = '';
  currentCursor = '';
  constructor(controller: any) {
    super();
    this.controller = controller;
  }
  get canUndo() {
    return this.layer ? this.history.length > 0 || this.runes.length > 0 : false;
  }
  undo() {
    if (this.canUndo) {
      if (this.runes.forEach((r: any) => {
        r.getShapes().forEach((n: any) => n.remove());
      }),
        this.history.length === 0)
        this.runes = [];
      else {
        let r = this.history.pop();
        this.runes = r,
          this.runes.forEach((n: any) => {
            this.layer?.add(...n.getShapes());
          });
      }
      this.drawRunes(),
        this.lastSnapshot = this.runes.map((r: any) => r.clone()),
        this.controller.canUndo = this.canUndo;
    }
  }
  deleteSelectedRune() {
    this.runes = this.runes.filter((r: any) => {
      if (r.selected) {
        r.getShapes().forEach((n: any) => n.remove());
        return false; // Remove the rune by filtering it out
      } else {
        return true; // Keep the rune in the array
      }
    });
    this.snapshot();
    this.emit('selectionChange', {
      selectedRune: null
    });
  }
  setLayer(layer: Konva.Layer | null) {
    this.layer = layer;
    this.runes.forEach((n: any) => {
      layer?.add(...n.getShapes());
    });
    this.drawRunes();
  }
  setCursor(cursor: string) {
    if (this.currentCursor !== cursor) {
      this.lastCursor = this.currentCursor,
        this.currentCursor = cursor,
        this.emit('cursorChange', cursor);
    }
  }
  restoreCursor() {
    this.currentCursor = this.lastCursor;
  }
  addRune(r: any) {
    if (r.type === 'mosaic') {
      this.runes.unshift(r);
    } else {
      this.runes.push(r);
    }
    r.on('changed', () => {
      this.snapshot();
    });
    if (this.layer) {
      if (r.type === 'mosaic') {
        this.runes.forEach((n: any) => {
          n.getShapes().forEach((i: any) => i.remove());
        });
        this.runes.forEach((n: any) => {
          this.layer?.add(...n.getShapes());
        });
      } else {
        this.layer.add(...r.getShapes());
      }
      this.drawRunes();
    }
  }
  drawRunes() {
    this.runes.forEach((r: any) => {
      r.draw();
    });
  }
  snapshot() {
    if (this.lastSnapshot) {
      this.history.push(this.lastSnapshot);
    }
    this.lastSnapshot = this.runes.map((r: any) => r.clone());
    this.controller.canUndo = this.canUndo;
  }
  selectRune(r: any) {
    if (!r.selected) {
      this.runes.forEach((n: any) => {
        n !== r && n.selected && n.handleUnselect();
      });
      r.handleSelect();
      this.drawRunes();
      this.emit('selectionChange', {
        selectedRune: r
      });
    }
  }
  clearSelection() {
    this.runes.forEach((r: any) => {
      r.selected && r.handleUnselect();
    }),
      this.drawRunes(),
      this.emit('selectionChange', {
        selectedRune: null
      });
  }
  getMosaicRune() {
    return this.runes.filter((n: any) => n.type === 'mosaic')[0] || null;
  }
};

