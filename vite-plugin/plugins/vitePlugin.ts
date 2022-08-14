import {Plugin} from 'vite'
export default (enforce?: 'pre' | 'post'): Plugin => {
  return {
    name: 'vitePlugin',
    config(userConfig) {
      return {
        resolve: {
          alias: {
            '@': './src',
          }
        }
      }
    },
    configResolved(config) {
      console.log('configResolved', config.resolve);
    },
    configureServer(server) {
      // console.log('configureServer', server)
      server.middlewares.use((req, res, next) => {
        if(req.url === '/test') { // localhost:5173/test
          res.end('hello vite test')
        } else {
          next()
        }
      })
    },
    transformIndexHtml(html) {
      // console.log('transformIndexHtml', html)
      return html.replace('<div id="app"></div>','<div>Hello this is plugin transform Html</div><div id="app"></div>')
    },
    handleHotUpdate(ctx) {
      // console.log('handleHotUpdate', ctx)
      ctx.server.ws.send({
        type: 'custom',
        data: 'Hello this is plugin handleHotUpdate',
        event: 'test'
      })
    }
  }
}