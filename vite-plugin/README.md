## vite plugin

> vite 插件 是 受限制的 rollup 插件

### 命名

- rollup.plugin.xxx 支持 vite 和 rollup
- vite.plugin.xxx   仅支持vite

### hooks

- 服务启动时

  - options
  - buildStart

- 每个模块

  - resolveId
  - load
  - transform

- 服务关闭时

  - buildEnd
  - closeBundle

- 独有的

  - config
  - configResolved
  - configureServer
  - transformIndexHtml
  - handleHotUpdate

### 执行时机

- pre
- normal （vite核心插件执行之后，build执行前）
- post （vite build 之后）