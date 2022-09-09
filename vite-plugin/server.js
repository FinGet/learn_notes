import express from 'express'
import { createServer as createViteServer } from 'vite'

import fs from 'fs'

const app = express()
createViteServer({
  // 以中间件模式创建 Vite 应用，这将禁用 Vite 自身的 HTML 服务逻辑
  // 并让上级服务器接管控制
  server: { middlewareMode: true },
  appType: 'custom'
}).then(vite => {
  app.use(vite.middlewares)

  app.get('*', async (req, res) => {
    /*直接返回html
    res.set('Content-Type', 'text/html')
    res.send(fs.readFileSync('./index.html', 'utf8'))
    */
    const url = req.originalUrl
    let template = fs.readFileSync('./index.html', 'utf8')
    // 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
    //    同时也会从 Vite 插件应用 HTML 转换。
    //    例如：@vitejs/plugin-react 中的 global preambles
    template = await vite.transformIndexHtml(url, template)

    // 3. 加载服务器入口。vite.ssrLoadModule 将自动转换
    //    你的 ESM 源码使之可以在 Node.js 中运行！无需打包
    //    并提供类似 HMR 的根据情况随时失效。
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')

    // 4. 渲染应用的 HTML。这假设 entry-server.js 导出的 `render`
    //    函数调用了适当的 SSR 框架 API。
    //    例如 ReactDOMServer.renderToString()
    const appHtml = await render(url)

    // 5. 注入渲染后的应用程序 HTML 到模板中。
    const html = template.replace(`<!--ssr-outlet-->`, appHtml)

    // 6. 返回渲染后的 HTML。
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  })

  app.listen(4000);
})
