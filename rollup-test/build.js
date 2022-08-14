const esbuild = require('esbuild');

let examplePlugin = {
  name: 'examplePlugin',
  setup(build) {
    let fs = require('fs');
    console.log(build.initialOptions)

    build.initialOptions.outdir = 'lib' // 动态修改配置

    build.onResolve({filter: /\.txt$/}, async (args) => {
      return {
        path: args.path,
        namespace: 'txt',
      }
    })

    // build.onLoad({filter: /\.txt$/}, async (args) => {
    build.onLoad({ filter: /\./, namespace: 'txt'}, async (args) => {
      let text = await fs.promises.readFile(args.path, 'utf8');
      return {
        contents: JSON.stringify(text.split(/\s+/)),
        loader: 'json'
      }
    })
  }
}

esbuild.build({
  entryPoints: ['./index.js'],
  bundle: true,
  // outfile: './esbuild.dist.js',
  loader: {
    '.png': 'dataurl'
  },
  plugins: [examplePlugin]
})