> 自带tree shaking
 rollup -i index.js --file dist/bund.js --format umd



 `rollup.config.js` 默认使用`esm`的模块化方式，如果要用`cjs`规范，需要使用`.cjs`文件。

 - @rollup/plugin-json 把json文件导入，打包成js
 - @rollup/plugin-node-resolve 支持导入第三方库（node_modules）并打包
 - @rollup/plugin-commonjs 支持cjs规范的第三方库
 - rollup-plugin-terser 压缩代码

> commonjs 插件要 优先于 babel 执行

 build hooks:

 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc02b2782c294540909cc8fec45a7493~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

 output hooks: 

 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c532aab6d924b81ba87ab98ad912d33~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)


 ## esbuild

 ```
 pnpm i esbuild -D
 ```

 ```js
 npx esbuild index.js --outfile=dist.js --bundle --format=esm --loader:.png=dataurl
 // 默认输出 IIFE 格式
 // 图片引入，但是不用的话，也会被treeshaking
 ```

 --bundle              Bundle all dependencies into the output files
 --define:K=V          Substitute K with V while parsing
 --format=...          Output format (iife | cjs | esm, no default when not
                        bundling, otherwise default is iife when platform
                        is browser and cjs when platform is node)
 --loader:X=L          Use loader L to load file extension X, where L is
                        one of: js | jsx | ts | tsx | css | json | text |
                        base64 | file | dataurl | binary | copy
  --outdir=...          The output directory (for multiple entry points)
  --outfile=...         The output file (for one entry point)
  --platform=...        Platform target (browser | node | neutral,
                        default browser)
  --serve=...           Start a local HTTP server on this host:port for outputs
  --sourcemap           Emit a source map
  --splitting           Enable code splitting (currently only for esm)
  --target=...          Environment target (e.g. es2017, chrome58, firefox57,
                        safari11, edge16, node10, ie9, opera45, default esnext)
  --watch               Watch mode: rebuild on file system changes

  ### plugin
  

  ```js
  // build.onLoad({filter: /\.txt$/}, async (args) => {
  // build.onLoad({ filter: /\./, namespace: 'txt'}, async (args) => {
  // filter 和 namespace 都可以作为文件的筛选条件
  node build.js
  ```