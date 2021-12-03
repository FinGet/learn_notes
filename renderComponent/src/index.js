import { h,Fragment,Portal } from './h'
import { render } from './render'

// 事件回调函数
// function handler() {
//   alert('click me')
// }
// const elementVNode = h(
//   'div',
//   {
//     style: {
//       height: '100px',
//       width: '100px',
//       background: 'red'
//     },
//     // 点击事件
//     onclick: handler
//   },
//   h('div', {
//     style: {
//       height: '50px',
//       width: '50px',
//       background: 'green'
//     }
//   }, h(Portal, { target: '#portal-box' }, [
//     h('span', null, '我是标题1......'),
//     h('span', null, '我是标题2......')
//   ]))
// )
// console.log(elementVNode)
// render(elementVNode, document.getElementById('app'))


// ---------  测试patchElement ----------- //
// // 旧的 VNode
// const prevVNode = h(
//   'div',
//   null,
//   h('p', {
//     style: {
//       height: '100px',
//       width: '100px',
//       background: 'red'
//     }
//   })
// )

// // 新的 VNode
// const nextVNode = h(
//   'div',
//   null,
//   h('p', {
//     style: {
//       height: '100px',
//       width: '100px',
//       background: 'green'
//     }
//   })
// )

// render(prevVNode, document.getElementById('app'))

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode, document.getElementById('app'))
// }, 2000)

// ---------  测试删除 prevVNode ----------- //

// // 旧的 VNode
// const prevVNode = h(
//   'div',
//   null,
//   h('p', {
//     style: {
//       height: '100px',
//       width: '100px',
//       background: 'red'
//     }
//   })
// )

// // 新的 VNode
// const nextVNode = h('div')

// render(prevVNode, document.getElementById('app'))

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode, document.getElementById('app'))
// }, 2000)


// ---------  测试删除 prevVNode 循环新增节点 ----------- //

// // 旧的 VNode
// const prevVNode = h('div', null, h('p', null, '只有一个子节点'))

// // 新的 VNode
// const nextVNode = h('div', null, [
//   h('p', null, '子节点 1'),
//   h('p', null, '子节点 2')
// ])

// render(prevVNode, document.getElementById('app'))

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode, document.getElementById('app'))
// }, 2000)

// ---------  测试 更新文本节点 ----------- //

// // 旧的 VNode
// const prevVNode = h('p', null, '旧文本')

// // 新的 VNode
// const nextVNode = h('p', null, '新文本')

// render(prevVNode, document.getElementById('app'))

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode, document.getElementById('app'))
// }, 5000)


// ---------  测试 更新portal ----------- //

// // 旧的 VNode
// const prevVNode = h(
//   Portal,
//   { target: '#old-container' },
//   h('p', null, '旧的 Portal')
// )

// // 新的 VNode
// const nextVNode = h(
//   Portal,
//   { target: '#new-container' },
//   h('p', null, '新的 Portal')
// )

// render(prevVNode, document.getElementById('app'))

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode, document.getElementById('app'))
// }, 5000)

// ---------  测试 状态组件 主动更新 ----------- //

// // MyComponent 组件
// class MyComponent {
//   // 自身状态 or 本地状态
//   localState = 'one'

//   // mounted 钩子
//   mounted() {
//     // 两秒钟之后修改本地状态的值，并重新调用 _update() 函数更新组件
//     setTimeout(() => {
//       this.localState = 'two'
//       this._update()
//     }, 2000)
//   }

//   render() {
//     return h('div', null, this.localState)
//   }
// }

// // VNode
// const componentVnode = h(MyComponent)

// // 渲染
// render(componentVnode, document.getElementById('app'))


// ---------  测试 状态组件被动更新 ----------- //

// // 子组件类
// class ChildComponent {
//   render() {
//     // 子组件中访问外部状态：this.$props.text
//     return h('div', null, this.$props.text)
//   }
// }
// // 父组件类
// class ParentComponent {
//   localState = 'one'

//   mounted() {
//     // 两秒钟后将 localState 的值修改为 'two'
//     setTimeout(() => {
//       this.localState = 'two'
//       this._update()
//     }, 2000)
//   }

//   render() {
//     return h(ChildComponent, {
//       // 父组件向子组件传递的 props
//       text: this.localState
//     })
//   }
// }

// // 有状态组件 VNode
// const compVNode = h(ParentComponent)
// render(compVNode, document.getElementById('app'))


// ---------  测试 diff 初步优化 复用元素 ----------- //

// 旧的 VNode
const prevVNode = h('div', null, [
  h('p', { key: 'a' }, '节点1'),
  h('p', { key: 'b' }, '节点2'),
  h('p', { key: 'c' }, '节点3')
])

// 新的 VNode
const nextVNode = h('div', null, [
  h('p', { key: 'c' }, '节点3'),
  h('p', { key: 'a' }, '节点1'),
  h('p', { key: 'd' }, '节点4'),
  h('p', { key: 'b' }, '节点2')
])

render(prevVNode, document.getElementById('app'))

// 2秒后更新
setTimeout(() => {
  render(nextVNode, document.getElementById('app'))
}, 2000)