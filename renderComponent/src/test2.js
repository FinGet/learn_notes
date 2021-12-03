import { h, Fragment, Portal } from './h'
import { Component } from './component'
import { render } from './render'


const elementVNode = h('div', null, h('span'))
console.log(elementVNode)
/**
const elementVNode = {
  _isVNode: true,
  flags: 1, // VNodeFlags.ELEMENT_HTML
  tag: 'div',
  data: null,
  children: {
    _isVNode: true,
    flags: 1, // VNodeFlags.ELEMENT_HTML
    tag: 'span',
    data: null,
    children: null,
    childFlags: 1, // ChildrenFlags.NO_CHILDREN
    el: null
  },
  childFlags: 2, // ChildrenFlags.SINGLE_VNODE
  el: null
}
 */

const fragmentVNode = h(Fragment, null, [
  h('td'), h('td')
])

console.log(fragmentVNode)

const portalVNode = h(
  Portal,
  {
    target: '#box'
  },
  h('h1')
)
console.log(portalVNode)

// 一个函数式组件
function MyFunctionalComponent() {}
// 传递给 h 函数的第一个参数就是组件函数本身
const functionalComponentVNode = h(MyFunctionalComponent, null, h('div'))
console.log(functionalComponentVNode)

// 有状态组件
class MyStatefulComponent extends Component {}
const statefulComponentVNode = h(MyStatefulComponent, null, h('div'))
console.log(JSON.stringify(statefulComponentVNode))


render(elementVNode, document.getElementById('app'))