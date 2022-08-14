export default () => {
  return {
    name: 'test',
    buildStart(inputOptions) {
      console.log(inputOptions)
    },
    resolveId(importee, importer) {
      console.log(importee, importer)
    },
    transform(code, filename) {
      console.log(code, filename)
      code += '\nconsole.log("test")'
      return code
    }
  }
}