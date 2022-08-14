export default (enforce?: 'pre' | 'post') => {
  return {
    name: 'testPlugin',
    enforce,
    buildStart() {
      console.log('testPlugin buildStart', enforce);
    },
    // resolveId() {
    //   console.log('testPlugin resolveId', enforce);
    // },
    load(){
      console.log('testPlugin load', enforce);
    }
  }
}