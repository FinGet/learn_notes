/*
  既然 VNode 有类别之分，我们就有必要使用一个唯一的标识，
  来标明某一个 VNode 属于哪一类。
  同时给 VNode 添加 flags 也是 Virtual DOM 算法的优化手段之一。

  这样在挂载或 patch 阶段通过 flags 可以直接避免掉很多消耗性能的判断

  if (flags & VNodeFlags.ELEMENT) {
    // VNode 是普通标签
    mountElement()
  } else if (flags & VNodeFlags.COMPONENT) {
    // VNode 是组件
    mountComponent()
  } else if (flags & VNodeFlags.TEXT) {
    // VNode 是纯文本
    mountText()
  }

 */

// 标记虚拟节点的类型
const VNodeFlags = {
  // html 标签
  ELEMENT_HTML: 1,
  // SVG 标签
  ELEMENT_SVG: 1 << 1,

  // 普通有状态组件
  COMPONENT_STATEFUL_NORMAL: 1 << 2,
  // 需要被keepAlive的有状态组件
  COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
  // 已经被keepAlive的有状态组件
  COMPONENT_STATEFUL_KEPT_ALIVE: 1 << 4,
  // 函数式组件
  COMPONENT_FUNCTIONAL: 1 << 5,

  // 纯文本
  TEXT: 1 << 6,
  // Fragment
  FRAGMENT: 1 << 7,
  // Portal
  PORTAL: 1 << 8
}

// html 和 svg 都是标签元素，可以用 ELEMENT 表示
VNodeFlags.ELEMENT = VNodeFlags.ELEMENT_HTML | VNodeFlags.ELEMENT_SVG
// 普通有状态组件、需要被keepAlive的有状态组件、已经被keepAlice的有状态组件 都是“有状态组件”，统一用 COMPONENT_STATEFUL 表示
VNodeFlags.COMPONENT_STATEFUL =
  VNodeFlags.COMPONENT_STATEFUL_NORMAL |
  VNodeFlags.COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE |
  VNodeFlags.COMPONENT_STATEFUL_KEPT_ALIVE
// 有状态组件 和  函数式组件都是“组件”，用 COMPONENT 表示
VNodeFlags.COMPONENT = VNodeFlags.COMPONENT_STATEFUL | VNodeFlags.COMPONENT_FUNCTIONAL


// 标记子节点的类型
const ChildrenFlags = {
  // 未知的 children 类型
  UNKNOWN_CHILDREN: 0,
  // 没有 children
  NO_CHILDREN: 1,
  // children 是单个 VNode
  SINGLE_VNODE: 1 << 1,

  // children 是多个拥有 key 的 VNode
  KEYED_VNODES: 1 << 2,
  // children 是多个没有 key 的 VNode
  NONE_KEYED_VNODES: 1 << 3
}
// 多节点标识
ChildrenFlags.MULTIPLE_VNODES = ChildrenFlags.KEYED_VNODES | ChildrenFlags.NONE_KEYED_VNODES

export { VNodeFlags, ChildrenFlags }
/**
 * 
// html 元素节点
const htmlVnode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: 'div',
  data: null
}

// svg 元素节点
const svgVnode = {
  flags: VNodeFlags.ELEMENT_SVG,
  tag: 'svg',
  data: null
}

// 函数式组件
const functionalComponentVnode = {
  flags: VNodeFlags.COMPONENT_FUNCTIONAL,
  tag: MyFunctionalComponent
}

// 普通的有状态组件
const normalComponentVnode = {
  flags: VNodeFlags.COMPONENT_STATEFUL_NORMAL,
  tag: MyStatefulComponent
}

// Fragment
const fragmentVnode = {
  flags: VNodeFlags.FRAGMENT,
  // 注意，由于 flags 的存在，我们已经不需要使用 tag 属性来存储唯一标识
  tag: null
}

// Portal
const portalVnode = {
  flags: VNodeFlags.PORTAL,
  // 注意，由于 flags 的存在，我们已经不需要使用 tag 属性来存储唯一标识，tag 属性用来存储 Portal 的 target
  tag: target
}



// 拥有多个使用了key的 li 标签作为子节点的 ul 标签
const elementVNode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: 'ul',
  data: null,
  childFlags: ChildrenFlags.KEYED_VNODES,
  children: [
    {
      tag: 'li',
      data: null,
      key: 0
    },
    {
      tag: 'li',
      data: null,
      key: 1
    }
  ]
}

// 只有一个子节点的 Fragment
const elementVNode = {
  flags: VNodeFlags.FRAGMENT,
  tag: null,
  data: null,
  childFlags: ChildrenFlags.SINGLE_VNODE,
  children: {
    tag: 'p',
    data: null
  }
}
 */
