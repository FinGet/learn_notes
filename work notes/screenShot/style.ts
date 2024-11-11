const style =`
  .arvin-screen-shot-toolbar {
    position: absolute;
    z-index: 1;
    user-select: none;
  }
  .arvin-screen-shot-tools {
    box-sizing: border-box;
    background: #fff;
    display: flex;
    align-items: center;
    border-radius: 8px;
    gap: 8px;
    padding: 6px 14px;
    height: 40px;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
  }
  .arvin-screen-shot-tool-btn {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px;
    border-radius: 8px;
    transition: background 0.2s;
    width: 28px;
    height: 28px;
    color: #444658;
    border: none;
    background: none;
  }
  .arvin-screen-shot-action .tool-icon,
  .arvin-screen-shot-tool-btn span,
  .arvin-screen-shot-tool-btn .tool-icon {
    display: inline-block;
    width: 16px !important;
    height: 16px !important;
  }
  .arvin-screen-shot-tool-btn:hover,
  .arvin-screen-shot-tool-btn.active {
    color: #6165F6;
    background: #F3F3FF;
  }
  .arvin-screen-shot-tool-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .divide-line {
    width: 1px;
    height: 18px;
    background: #D2D5E3;
  }
  .arvin-screen-shot-action {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #DFE0FF;
    padding: 5px 7px;
    height: 28px;
    color: #6165F6;
    font-weight: 500;
    font-size: 12px;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .arvin-screen-shot-action:hover {
    background: #F3F3FF;
  }
  .arvin-screen-setting-panel {
    position: relative;
    width: 100%;
  }
  .setting-panel-arrow {
    top: -8px;
    left: 8px;
    width: 0;
    height: 0;
    z-index: 1;
    position: absolute;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #fff;
  }
  .setting-panel-inner {
    display: flex;
    position: relative;
    margin-top: 8px;
  }
  .setting-panel-inner>div {
    box-sizing: border-box;
    height: 40px;
    display: inline-flex;
    padding: 10px 12px;
    background: #fff;
    align-items: center;
    border-radius: 8px;
    gap: 8px;
  }

  .size-btn {
    background: #B7B9C9;
    cursor: pointer;
  }
  .size-btn.active {
    background: #6165F6;
  }
  .color-btn {
    cursor: pointer;
    color: #ffffff;
    width: 18px;
    height: 18px;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    border-radius: 2px;
    justify-content: center;
  }
  .color-btn.white-btn {
    border: 1px solid #D2D5E3;
    color: #212B36;
  }
  .action-btn {
    width: 28px;
    cursor: pointer;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .action-btn svg {
    width: 12px;
    height: 12px;
  }
  .font-size-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 78px;
    height: 28px;
    border-radius: 8px;
    box-sizing: border-box;
    border: 1px solid #D2D5E3;
    padding: 0 11px;
  }
  .font-size-select.active,
  .font-size-select:hover {
    border-color: #6165F6;
  }
  .arvin-font-size-select {
    border-radius: 8px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1) !important;
    overflow: hidden;
  }
  .arvin-font-size-select .el-popper__arrow {
		display: none;
	}
  .font-size-select-wrapper {
    width: 78px;
    padding: 6px;
    background: #FFFFFF;
  }
  .font-size-select-item {
    height: 29px;
    border-radius: 4px;
    color: #444658;
    line-height: 29px;
    cursor: pointer;
    padding: 0 6px;
  }
  .font-size-select-item:hover {
    background: #EBEDF3;
  }
  .font-size-select-item.active {
    background: #F3F3FF;
    color: #6165F6;
    font-weight: 600;
  }

  .rect-tips {
    color: #444658;
    display: flex;
    padding: 4px 8px;
    position: absolute;
    font-size: 14px;
    background: #fff;
    align-items: center;
    font-family: sans-serif;
    white-space: nowrap;
    border-radius: 6px;
    pointer-events: none;
    justify-content: center;
  }
`;

export default style;
