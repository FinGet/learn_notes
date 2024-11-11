
export interface RectInfo {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface ToolConfig {
  size: number;
  color: string;
}

export type ToolType = 'rect' | 'text' | 'arrow' | 'pen' | 'circle' | 'mosaic';
export type ActionType = 'undo' | 'close' | 'download' | 'copy' | 'chat' | 'extract';
export interface ScreenShotOptions {
  scene: string;
  disabledTools?: ToolType[];
  onClose?: () => void;
  onCloseAction?: () => void;
  onDownloadAction?: () => void;
  onCopyAction?: (data: string) => void;
  onChatAction?: (data: string) => void;
  onExtractAction?: (data: string) => void;
}

export interface BoundRect {
  width: number;
  height: number;
  boxWidth: number;
  boxHeight: number;
}