import { VNodeFlags, ChildrenFlags } from './flags.js'
import { patchData } from './patchData'

export function render(vnode, container) {
  const prevVNode = container.vnode;
  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode，只有新的 VNode。使用 `mount` 函数挂载全新的 VNode
      mount(vnode, container)
      // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，也有新的 VNode。则调用 `patch` 函数打补丁
      patch(prevVNode, vnode, container)
      // 更新 container.vnode
      container.vnode = vnode
    } else {
      // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM，在浏览器中可以使用 removeChild 函数。
      container.removeChild(prevVNode.el)
      container.vnode = null
    }
  }
}

// -----------  挂载相关函数  ----------- //

/**
 * 挂载虚拟节点
 * @param {*} vnode 
 * @param {*} container 
 * @param {*} isSVG 
 */
function mount(vnode, container, isSVG, refNode) {
  const { flags } = vnode
  if (flags & VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container, isSVG, refNode)
  } else if (flags & VNodeFlags.COMPONENT) {

    // 挂载组件
    mountComponent(vnode, container, isSVG)
  } else if (flags & VNodeFlags.TEXT) {

    // 挂载纯文本
    mountText(vnode, container, isSVG)
  } else if (flags & VNodeFlags.FRAGMENT) {
    // 挂载 Fragment
    mountFragment(vnode, container, isSVG)
  } else if (flags & VNodeFlags.PORTAL) {
    // 挂载 Portal
    mountPortal(vnode, container, isSVG)
  }
}

const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/
// 挂载普通标签
function mountElement(vnode, container, isSVG, refNode) {
  // const el = document.createElement(vnode.tag);
  isSVG = vnode.flags & VNodeFlags.ELEMENT_SVG
  const el = isSVG
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
    : document.createElement(vnode.tag)
  vnode.el = el; // 引用真实DOM元素

  // --- 处理VNodeData --- //

  // 拿到VNodeData
  const data = vnode.data;
  if (data) {
    // 如果VNodeData 存在，则遍历之
    for (let key in data) {
      // key 可能是 class、style、on等
      switch (key) {
        case 'style':
          // 如果key是style，说明是内联样式
          for (let k in data.style) {
            el.style[k] = data.style[k]
          }
          break;
        case 'class':
          if (isSVG) {
            el.setAttribute("class", data[key]);
          } else {
            el.className = data[key];
          }
          break
        default:
          if (/^on/.test(key)) {
            // 事件
            el.addEventListener(key.slice(2), data[key])
          } else if (domPropsRE.test(key)) {
            // 当作 DOM Prop 处理
            el[key] = data[key]
          } else {
            // 当作 Attr 处理
            el.setAttribute(key, data[key])
          }
          break
      }
    }
  }

  // --- 继续挂载子节点 --- //

  // 拿到 children 和 childFlags
  const { childFlags, children } = vnode
  // 检测如果没有子节点则无需递归挂载
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      // 如果是单个子节点则调用 mount 函数挂载
      mount(children, el, isSVG)
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      // 如果是单多个子节点则遍历并调用 mount 函数挂载
      for (let i = 0; i < children.length; i++) {
        mount(children[i], el, isSVG)
      }
    }
  }

  // container.appendChild(el);
  refNode ? container.insertBefore(el, refNode) : container.appendChild(el)
}

// 挂载组件
function mountComponent(vnode, container, isSVG) {
  if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
    mountStatefulComponent(vnode, container, isSVG)
  } else {
    mountFunctionalComponent(vnode, container, isSVG)
  }
}

// 挂载状态组件
function mountStatefulComponent(vnode, container, isSVG) {
  // children 属性引用组件的实例，以便能够通过 VNode 访问组件实例对象
  const instance = (vnode.children = new vnode.tag)
  // 初始化 props
  instance.$props = vnode.data
  instance._update = function () {
    if (instance._mounted) {
      // 更新
      // 1、拿到旧的 VNode
      const prevVNode = instance.$vnode
      // 2、重渲染新的 VNode
      const nextVNode = (instance.$vnode = instance.render())
      // 3、patch 更新
      patch(prevVNode, nextVNode, prevVNode.el.parentNode)
      // 4、更新 vnode.el 和 $el
      instance.$el = vnode.el = instance.$vnode.el
    } else {
      // 1、渲染VNode
      instance.$vnode = instance.render()
      // 2、挂载
      mount(instance.$vnode, container, isSVG)
      // 3、组件已挂载的标识
      instance._mounted = true
      // 4、el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
      instance.$el = vnode.el = instance.$vnode.el
      // 5、调用 mounted 钩子
      instance.mounted && instance.mounted()
    }
  }
  instance._update()
}

// 挂载函数组件
function mountFunctionalComponent(vnode, container, isSVG) {
  // 与有状态组件不同，函数式组件没有组件实例，所以我们没办法封装类似 instance._update 这样的函数，
  // 那应该怎么办呢？很简单，我们把 update 函数定义在函数式组件的 VNode 上就可以了
  vnode.handle = {
    prev: null,
    next: vnode,
    container,
    update: () => {
      if (vnode.handle.prev) {
        // 更新
        // prevVNode 是旧的组件VNode，nextVNode 是新的组件VNode
        const prevVNode = vnode.handle.prev
        const nextVNode = vnode.handle.next
        // prevTree 是组件产出的旧的 VNode
        const prevTree = prevVNode.children
        // 更新 props 数据
        const props = nextVNode.data
        // nextTree 是组件产出的新的 VNode
        const nextTree = (nextVNode.children = nextVNode.tag(props))
        // 调用 patch 函数更新
        patch(prevTree, nextTree, vnode.handle.container)
      } else {
        // 获取 props
        const props = vnode.data
        // 获取VNode
        const $vnode = (vnode.children = vnode.tag(props))
        // 挂载
        mount($vnode, container, isSVG)
        // 引用该组件的根元素
        vnode.el = $vnode.el
      }
    }
  }
  // 立即调用 vnode.handle.update 完成初次挂载
  vnode.handle.update()
}

// 挂载存文本
function mountText(vnode, container) {
  const el = document.createTextNode(vnode.children)
  vnode.el = el
  container.appendChild(el)
}

// 挂载fragment
function mountFragment(vnode, container, isSVG) {
  // 拿到 children 和 childFlags
  const { childFlags, children } = vnode
  switch (childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      // 如果是单个子节点，直接mount
      mount(children, container, isSVG)
      vnode.el = children.el
      break;
    case ChildrenFlags.NO_CHILDREN:
      // 如果没有子节点，等价于挂载空片段，会创建一个空的文本节点占位
      const placeholder = document.createTextNode('')
      mountText(placeholder, container)
      vnode.el = placeholder.el
      break;
    default:
      // 多个子节点，遍历挂载
      for (let i = 0; i < children.length; i++) {
        mount(children[i], container, isSVG)
      }
      // 多个子节点，指向第一个子节点
      vnode.el = children[0].el
  }
}

// 挂载portal
function mountPortal(vnode, container) {
  const { tag, children, childFlags } = vnode
  // 获取挂载点
  const target = typeof tag === 'string' ? document.querySelector(tag) : tag
  if (childFlags & ChildrenFlags.SINGLE_VNODE) {
    // 将 children 挂载到 target 上，而非container
    mount(children, target)
  } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
    for (let i = 0; i < children.length; i++) {
      // 将 children 挂载到 target 上，而非container
      mount(children[i], target)
    }
  }
  /**
   * 虽然 Portal 的内容可以被渲染到任意位置，
   * 但它的行为仍然像普通的DOM元素一样，
   * 如事件的捕获/冒泡机制仍然按照代码所编写的DOM结构实施。
   */
  // 占位的空文本节点
  const placeholder = document.createTextNode('')
  // 将该节点挂载到 container 中
  mountText(placeholder, container, null)
  // el 属性引用该节点
  vnode.el = placeholder.el
}


// -----------  patch相关函数  ----------------- //

/**
 * 新老vnode 对比 更新
 * @param {*} prevVNode 老节点
 * @param {*} vnode 新节点
 * @param {*} container 容器
 */
function patch(prevVNode, vnode, container) {
  // 分别拿到新旧 VNode 的类型，即 flags
  const nextFlags = vnode.flags
  const prevFlags = prevVNode.flags

  // 检查新旧 VNode 的类型是否相同，如果类型不同，则直接调用 replaceVNode 函数替换 VNode
  // 如果新旧 VNode 的类型相同，则根据不同的类型调用不同的比对函数
  if (prevFlags !== nextFlags) {
    replaceVNode(prevVNode, vnode, container)
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, vnode, container)
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, vnode, container)
  } else if (nextFlags & VNodeFlags.TEXT) {
    patchText(prevVNode, vnode)
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, vnode, container)
  } else if (nextFlags & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, vnode)
  }
}

// 替换虚拟节点
function replaceVNode(prevVNode, vnode, container) {
  // 将旧的VNode 所渲染的DOM从容器中移除
  container.removeChild(prevVNode.el)
  // 如果将要被移除的 VNode 类型是组件，则需要调用该组件实例的 unmounted 钩子函数
  if (prevVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 类型为有状态组件的 VNode，其 children 属性被用来存储组件实例对象
    const instance = prevVNode.children
    instance.unmounted && instance.unmounted()
  }
  // 再把新的 VNode 挂载到容器中
  mount(vnode, container)
}

function patchElement(prevVNode, vnode, container) {
  // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== vnode.tag) {
    replaceVNode(prevVNode, vnode, container)
    return
  }

  // 拿到 el 元素， 注意这时要让 vnode.el 也引用该元素
  const el = (vnode.el = prevVNode.el)
  // 拿到新旧 VNodeData
  const prevData = prevVNode.data
  const nextData = vnode.data


  /**
   * 遍历新的 VNodeData，将旧值和新值都传递给 patchData 函数，
   * 并由 patchData 函数负责更新数据；同时也需要遍历旧的 VNodeData，
   * 将已经不存在于新的 VNodeData 中的数据从元素上移除，
   */

  // 新的VNodeData 存在时才有必要更新
  if (nextData) {
    // 遍历新的 VNodeData
    for (let key in nextData) {
      // 根据 key 拿到 新旧的值
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      patchData(el, key, prevValue, nextValue)
    }
  }
  if (prevData) {
    // 遍历旧的 VNodeData，将已经不存在于新的 VNodeData 中的数据移除
    for (let key in prevData) {
      const prevValue = prevData[key]
      if (prevValue && !nextData.hasOwnProperty(key)) {
        // 第四个参数为 null，代表移除数据
        patchData(el, key, prevValue, null)
      }
    }
  }

  // 调用 pathChildren 函数递归地更新子节点
  patchChildren(
    prevVNode.childFlags, // 旧的 VNode 子节点的类型
    vnode.childFlags,     // 新的 VNode 子节点的类型
    prevVNode.children,   // 旧的 VNode 子节点
    vnode.children,       // 新的 VNode 子节点
    el                    // 当前标签元素，即这些子节点的父节点
  )
}

// 更新子节点
function patchChildren(prevChildFlags, nextChildFlags, prevChildren, nextChildren, container) {
  switch (prevChildFlags) {
    // 旧的 children 是单子节点
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 也是单子节点
          // 此时 prevChildren 和 nextChildren 都是 VNode 对象
          patch(prevChildren, nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 没有子节点
          container.removeChild(prevChildren.el)
          break
        default:
          // 新的 children 有多个子节点
          // 移除旧的单个子节点
          container.removeChild(prevChildren.el)
          // 遍历新的多个子节点，逐个挂载到容器中
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
    // 旧的 children 没有子节点
    case ChildrenFlags.NO_CHILDREN:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 是单个子节点时
          // 使用mount将新的子节点挂载到容器中
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时
          // 什么都不做
          break
        default:
          // 新的 children 中有多个子节点时
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
    // 旧的 children 有多个子节点
    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 是单个子节点时
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          break
        default:
          // 新的 children 中有多个子节点时
          // 这里可以最暴力的方式 删除所有旧的节点，新增新的节点，
          // diff 算法的优化 就适于此处
          // 0.遍历旧的子节点，将其全部移除
          /*
            for (let i = 0; i < prevChildren.length; i++) {
              container.removeChild(prevChildren[i].el)
            }
            // 遍历新的子节点，将其全部添加
            for (let i = 0; i < nextChildren.length; i++) {
              mount(nextChildren[i], container)
            }
          */

          // 1.初步优化 复用相同的节点
          // 获取公共长度，取新旧children长度较小的那一个
          /*
            const prevLen = prevChildren.length
            const nextLen = nextChildren.length
            const commonLength = prevLen > nextLen ? nextLen : prevLen
            for (let i = 0; i < commonLength; i++) {
              patch(prevChildren[i], nextChildren[i], container)
            }
            // 如果 nextLen > prevLen，将多出来的元素添加
            if (nextLen > prevLen) {
              for (let i = commonLength; i < nextLen; i++) {
                mount(nextChildren[i], container)
              }
            } else if (prevLen > nextLen) {
              // 如果 prevLen > nextLen，将多出来的元素移除
              for (let i = commonLength; i < prevLen; i++) {
                container.removeChild(prevChildren[i].el)
              }
            }
          */

          // 2.通过key实现尽可能多的dom复用 a.找key复用，b.最大索引确定是否需要移动(索引递增说明是不需要移动的，一旦打破了递增，则说明需要移动)

          /**
           * 真实DOM元素   li-a     li-b     li-c
           * 旧Children   li-a     li-b     li-c
           * 新children   li-c     li-a     li-b
           * 
           * const refNode = nextChildren[i - 1].el.nextSibling
           * 移动dom 是操作的真实dom
           * 
           * 以 移动 li-a 为例，先找到li-a 在 新children的前一个 节点，也就是 li-c
           * 因为patchElement是引用了真实dom的(const el = (vnode.el = prevVNode.el))，
           * 所以我们可以拿到 li-c 的真实dom -> nextChildren[i - 1].el
           * 
           * 这时dom还没更新，所以 li-c 的真实dom 的下一位 
           * nextChildren[i - 1].el.nextSibling 是空的，
           * 
           * li-a 也正是需要插入(移动)到这个位置(li-c的下一位)
           * container.insertBefore(prevVNode.el, refNode)
           * prevVNode.el 就是 li-a 的真实dom
           */

          // 遍历新的 children
          // 用来存储寻找过程中遇到的最大索引值

          /**
           * 这段代码中有两层嵌套的 for 循环语句，外层循环用于遍历新 children，
           * 内层循环用于遍历旧 children，其目的是尝试寻找具有相同 key 值的两个节点，
           * 如果找到了，则认为新 children 中的节点可以复用旧 children 中已存在的节点，
           * 这时我们仍然需要调用 patch 函数对节点进行更新，如果新节点相对于旧节点的 VNodeData 
           * 和子节点都没有变化，则 patch 函数什么都不会做(这是优化的关键所在)，
           * 如果新节点相对于旧节点的 VNodeData 或子节点有变化，则 patch 函数保证了更新的正确性。
           */
          /*

          let lastIndex = 0
          for (let i = 0; i < nextChildren.length; i++) {
            const nextVNode = nextChildren[i]
            let j = 0,find = false
            // 遍历旧的 children
            for (j; j < prevChildren.length; j++) {
              const prevVNode = prevChildren[j]
              // 如果找到了具有相同 key 值的两个节点，则调用 `patch` 函数更新之
              if (nextVNode.key === prevVNode.key) {
                find = true
                patch(prevVNode, nextVNode, container)
                if (j < lastIndex) {
                  // 需要移动
                  // refNode 是为了下面调用 insertBefore 函数准备的
                  const refNode = nextChildren[i - 1].el.nextSibling
                  // 调用 insertBefore 函数移动 DOM
                  container.insertBefore(prevVNode.el, refNode)
                } else {
                  // 更新 lastIndex
                  lastIndex = j
                }
                break // 这里需要 break
              }
            }
            // 没找到的节点需要挂载
            // 之前mount都是appendChild 是不适用的，需要找到插入的点
            // if (!find) {
            //   // 挂载新节点
            //   mount(nextVNode, container, false)
            // }

            if (!find) {
              // 挂载新节点
              // 找到 refNode
              const refNode = 
                i - 1 < 0
                  ? prevChildFlags[0].el
                  : nextChildren[i - 1].el.nextSibling
              mount(nextVNode, container, false, refNode)
            }
          }


          // 移除已经不存在的节点
          // 遍历旧的节点
          for (let i = 0; i < prevChildren.length; i++) {
            const prevVNode = prevChildren[i]
            // 拿着旧 VNode 去新 children 中寻找相同的节点
            const has = nextChildren.find(
              nextVNode => nextVNode.key === prevVNode.key
            )
            if (!has) {
              // 如果没有找到相同的节点，则移除
              container.removeChild(prevVNode.el)
            }
          }
          */

          // 3. 双端比较 -> 上面的移动其实只需要一次就行，就是把 li-c 放到 li-a 的前面
          // 所谓双端比较，就是同时从新旧 children 的两端开始进行比较的一种方式，
          // 所以我们需要四个索引值，分别指向新旧 children 的两端

          /**
           * 旧Children   li-a     li-b     li-c       li-d
           *          oldStartIdx                    oldEndIdx
           * 
           * 新children   li-d     li-b     li-a       li-c
           *           newStartIdx                   newEndIdx
           * 
           *-  头和头比 （oldStartVnode，newStartVnode）
            -  尾和尾比 （oldEndVnode，newEndVnode）
            -  旧头和新尾 （oldStartVnode，newEndVnode ）
            -  旧尾和新头 （oldEndVnode，newStartVnode）
           */

          /**
           

            let oldStartIdx = 0
            let oldEndIdx = prevChildren.length - 1
            let newStartIdx = 0
            let newEndIdx = nextChildren.length - 1

            let oldStartVNode = prevChildren[oldStartIdx]
            let oldEndVNode = prevChildren[oldEndIdx]
            let newStartVNode = nextChildren[newStartIdx]
            let newEndVNode = nextChildren[newEndIdx]

            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
              // prevChildren[idxInOld] = undefined 可能会出现undefined
              if (!oldStartVNode) {
                oldStartVNode = prevChildren[++oldStartIdx]
              } else if (!oldEndVNode) {
                oldEndVNode = prevChildren[--oldEndIdx]
              } else if (oldStartVNode.key === newStartVNode.key) {
                // 步骤一：oldStartVNode 和 newStartVNode 比对
                // 调用 patch 函数更新
                patch(oldStartVNode, newStartVNode, container)
                // 更新索引，指向下一个位置
                oldStartVNode = prevChildren[++oldStartIdx]
                newStartVNode = nextChildren[++newStartIdx]
              } else if (oldEndVNode.key === newEndVNode.key) {
                // 步骤二：oldEndVNode 和 newEndVNode 比对
                // 调用 patch 函数更新
                patch(oldEndVNode, newEndVNode, container)
                // 更新索引，指向下一个位置
                oldEndVNode = prevChildren[--oldEndIdx]
                newEndVNode = nextChildren[--newEndIdx]
              } else if (oldStartVNode.key === newEndVNode.key) {
                // 步骤三：oldStartVNode 和 newEndVNode 比对
                // 调用 patch 函数更新
                patch(oldStartVNode, newEndVNode, container)
                // 将 oldStartVNode.el 移动到 oldEndVNode.el 的后面，也就是 oldEndVNode.el.nextSibling 的前面
                container.insertBefore(
                  oldStartVNode.el,
                  oldEndVNode.el.nextSibling
                )
                // 更新索引，指向下一个位置
                oldStartVNode = prevChildren[++oldStartIdx]
                newEndVNode = nextChildren[--newEndIdx]
              } else if (oldEndVNode.key === newStartVNode.key) {
                // 步骤四：oldEndVNode 和 newStartVNode 比对
                // 先调用 patch 函数完成更新
                patch(oldEndVNode, newStartVNode, container)
                // 更新完成后，将容器中最后一个子节点移动到最前面，使其成为第一个子节点
                container.insertBefore(oldEndVNode.el, oldStartVNode.el)
                // 更新索引，指向下一个位置
                oldEndVNode = prevChildren[--oldEndIdx]
                newStartVNode = nextChildren[++newStartIdx]
              } else {
                
                //  a b c d
                //  b d a c
                //这种情况 前面都不满足

                // 遍历旧 children，试图寻找与 newStartVNode 拥有相同 key 值的元素
                const idxInOld = prevChildren.findIndex(
                  node => node.key === newStartVNode.key
                )
                // 在旧的 children 中找到了与新 children 中第一个节点拥有相同 key 值的节点，
                // 意味着什么？这意味着：旧 children 中的这个节点所对应的真实 DOM 
                // 在新 children 的顺序中，已经变成了第一个节点。
                if(idxInOld >= 0) {
                  // vnodeToMove 就是在 旧 children 种找到的节点，该节点所对应的 真实 DOM 应该被移动到最前面
                  const vnodeToMove = prevChildren[idxInOld]
                  // 调用 patch 函数完成更新
                  patch(vnodeToMove, newStartVNode, container)
                  // 把 vnodeToMove.el 移动到最前面，即 oldStartVNode.el 的前面
                  container.insertBefore(vnodeToMove.el, oldStartVNode.el)
                  // 由于旧 children 中该位置的节点所对应的真实 DOM 已经被移动，所以将其设置为 undefined
                  prevChildren[idxInOld] = undefined
                } else {
                  // 第一个为新增节点的情况
                  // 使用 mount 函数挂载新节点
                  mount(newStartVNode, container, false, oldStartVNode.el)
                }
                // 将 newStartIdx 下移一位
                newStartVNode = nextChildren[++newStartIdx]
              }
            }
            // 旧的end 都 小于 旧的start 说明，新的节点还没有比较完，也就是还有新增的
            if (oldEndIdx < oldStartIdx) {
              // 添加新节点
              for (let i = newStartIdx; i <= newEndIdx; i++) {
                mount(nextChildren[i], container, false, oldStartVNode.el)
              }
            }  else if (newEndIdx < newStartIdx) { // 反之，旧的节点 有被删除的
              // 移除操作
              for (let i = oldStartIdx; i <= oldEndIdx; i++) {
                container.removeChild(prevChildren[i].el)
              }
            }
            */

          // 4.inferno 核心diff算法
          // 更新相同的前缀节点
          // j 为指向新旧 children 中第一个节点的索引
          let j = 0
          let prevVNode = prevChildren[j]
          let nextVNode = nextChildren[j]
          let prevEnd = prevChildren.length - 1
          let nextEnd = nextChildren.length - 1

          outer: {  // 标记语句可以和 break 或 continue 语句一起使用
            // while 循环向后遍历，直到遇到拥有不同 key 值的节点为止
            // 更新相同的前置节点
            while (prevVNode.key === nextVNode.key) {
              patch(prevVNode, nextVNode, container)
              j++
              if (j > prevEnd || j > nextEnd) {
                break outer
              }
              prevVNode = prevChildren[j]
              nextVNode = nextChildren[j]
            }

            // 从最后开始
            prevVNode = prevChildren[prevEnd]
            nextVNode = nextChildren[nextEnd]

            // 更新相同的后置节点
            // while 循环向前遍历，直到遇到拥有不同 key 值的节点为止
            while (prevVNode.key === nextVNode.key) {
              // 调用 patch 函数更新
              patch(prevVNode, nextVNode, container)
              prevEnd--
              nextEnd--
              if (j > prevEnd || j > nextEnd) {
                break outer
              }
              prevVNode = prevChildren[prevEnd]
              nextVNode = nextChildren[nextEnd]
            }
          }
          // 条件一 prevEnd < j 成立：说明在预处理过程中，所有旧子节点都处理完毕了。
          // 条件二 nextEnd >= j 成立：说明在预处理过后，在新的一组子节点中，
          // 仍然有未被处理的节点，而这些遗留的节点将被视作新增节点。
          // 如果条件一和条件二同时成立，说明在新的一组子节点中，存在遗留节点，
          // 且这些节点都是新增节点。因此我们需要将它们挂载到正确的位置
          if (j > prevEnd && j <= nextEnd) {
            // 说明 从 j -> nextEnd 之间的节点应作为新节点插入
            const nextPos = nextEnd + 1
            const refNode = nextPos < nextChildren.length ? nextChildren[nextPos].el : null
            while (j <= nextEnd) {
              mount(nextChildren[j++], container, false, refNode)
            }
          } else if (j > nextEnd) {
            // j -> prevEnd 之间的节点应该被移除
            while (j <= prevEnd) {
              container.removeChild(prevChildren[j++].el)
            }
          } else {
            // 构造 sources 数组 用于存储新节点在旧节点中的位置
            // li-a   li-b   li-c   li-d   li-f   li-e
            // li-a   li-c   li-d   li-b   li-g   li-e
            // sources [2       3      1      -1 ]
            const nextLeft = nextEnd - j + 1 // 新 children 中剩余未处理节点的数量
            const sources = new Array(nextLeft).fill(-1)
            // for (let i = 0; i < nextLeft; i++) {
            //   sources.push(-1)
            // }

            const prevStart = j
            const nextStart = j
            let moved = false // 是否需要移动节点
            let pos = 0 // 代表遍历旧的一组子节点的过程中遇到的最大索引值 

            // 双层循环时间复杂度 O(n^2)
            // for (let i = prevStart; i<=prevEnd; i++) {
            //   const prevVNode = prevChildren[i]
            //   // 遍历新 children
            //   for(let k = nextStart; k<=nextEnd; k++) {
            //     const nextVNode = nextChildren[k]
            //     if(prevVNode.key === nextVNode.key) {
            //       patch(prevVNode, nextVNode, container)
            //       sources[k-nextStart] = i //  k - nextStart 的值才是正确的位置索引， nextStart 不一定是从 0开始的
            //       // 判断是否需要移动
            //       if(k < pos) {
            //         moved = true
            //       } else {
            //         pos = k
            //       }
            //     }
            //   }
            // }

            // 优化：用空间换时间
            // 构建索引表
            const keyIndex = {} // {c: 1, d: 2, b: 3, g: 4}
            for (let i = nextStart; i <= nextEnd; i++) {
              keyIndex[nextChildren[i].key] = i
            }

            // 遍历旧 children 的剩余未处理节点
            let patched = 0
            for (let i = prevStart; i <= prevEnd; i++) {
              prevVNode = prevChildren[i]
              if(patched < nextLeft) {
                // 通过索引表快速找到新 children 中具有相同 key 的节点的位置
                const k = keyIndex[prevVNode.key]

                if (typeof k !== 'undefined') {
                  nextVNode = nextChildren[k]
                  // patch 更新
                  patch(prevVNode, nextVNode, container)
                  patched ++ 
                  // 更新 sources 数组
                  sources[k - nextStart] = i
                  // 判断是否需要移动
                  if (k < pos) {
                    moved = true
                  } else {
                    pos = k
                  }
                } else {
                  // 没找到 说明旧节点在新的 children 已经不存在了
                  container.removeChild(prevVNode.el)
                }
              } else {
                // 多余的节点，应该移除
                container.removeChild(prevVNode.el)
              }
            }


            if(moved) {
              // 如果 moved 为真，则需要移动dom
              // 计算最长递增子序列
              const seq = lis(sources)
              // j 指向最长递增子序列的最后一个值
              let j = seq.length - 1
              // 从后向前遍历新 children 中的剩余未处理节点
              for(let i = nextLeft-1; i>=0; i--) {
                if(sources[i] === -1) {
                  // 作为全新的节点挂载
                  // 该节点在 新 children 中的真实位置索引
                  const pos = i + nextStart
                  const nextVNode = nextChildren[pos]
                  // 该节点下一个节点的位置索引
                  const nextPos = pos + 1
                  // 挂载
                  mount(nextVNode, container, false, nextPos < nextChildren.length ? nextChildren[nextPos].el : null)
                } else if(i !== seq[j]) {
                  // 不存在 则说明该节点需要移动
                  
                  // 该节点 在新 children 中的真实位置索引
                  const pos = i + nextStart
                  const nextVNode = nextChildren[pos]

                  // 该节点下一个节点的位置索引
                  const nextPos = pos + 1
                  // 移动
                  container.insertBefore(
                    nextVNode.el,
                    nextPos < nextChildren.length
                      ? nextChildren[nextPos].el
                      : null
                  )
                  /**
                   * 其实这里的移动和挂载逻辑是类似的， 还是相对简单的，之前想的复杂了
                   * 当一个节点需要移动的时候：
                   * a. 找到当前节点在新节点中的位置和它的真实dom (pos = i + nextStart; nextVNode = nextChildren[pos])
                   *    pos 为啥不是 i，而需要 i + nextStart；因为 nextStart是 前置处理后 的位置，剩下的sources中的数量不是真正的nextChildren的长度
                   * b. 移动节点 是 通过 insertBefore 来实现的，这就需要知道当前节点需要移动到某一个节点前，也就是下一个节点
                   *    nextPos = pos + 1; 这个节点可能存在也可能没有
                   *    container.insertBefore(nextVNode, nextPos < nextChildren.length ? nextChildren[nextPos] : null)
                   */
                } else {
                  // 当 i === seq[j] 时，说明该位置的节点不需要移动
                  // 并让 j 指向下一个位置
                  j --
                }
              }
            }
          }

          break
      }
      break
  }
}

// 更新组件
function patchComponent(prevVNode, vnode, container) {
  // tag 属性的值是组件类，通过比较新旧组件类是否相等来判断是否是相同的组件
  if (nextVNode.tag !== prevVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 1. 获取组件实例
    const instance = (vnode.children = prevVNode.children)
    // 2. 更新props
    instance.$props = vnode.data
    // 3. 更新组件
    instance._update()
  } else {
    // 更新函数式组件
    // 通过 prevVNode.handle 拿到 handle 对象
    const handle = (vnode.handle = prevVNode.handle)
    // 更新 handle 对象
    handle.prev = prevVNode
    handle.next = vnode
    handle.container = container

    // 调用 update 函数完成更新
    handle.update()
  }
}

// 更新文本节点
function patchText(prevVNode, vnode) {
  // 拿到文本元素 el，同时让 vnode.el 指向该文本元素
  const el = (vnode.el = prevVNode.el)

  // 只有当新旧文本内容不一致时才有必要更新
  if (vnode.children !== prevVNode.children) {
    el.nodeValue = vnode.children
  }
}

function patchFragment(prevVNode, vnode, container) {
  // 直接调用 patchChildren 更新 新旧片段的子节点即可
  patchChildren(prevVNode.ChildrenFlags, vnode.ChildrenFlags, prevVNode.children, vnode.children, container)

  // 但是不要忘记更新 vnode.el 属性，
  // 就像我们当初实现 mountFragment 时一样，根据子节点的类型不同，VNode 所引用的元素也不同
  switch (vnode.childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      vnode.el = vnode.children.el
      break
    case ChildrenFlags.NO_CHILDREN:
      vnode.el = prevVNode.el
      break
    default:
      vnode.el = vnode.children[0].el
  }
}

function patchPortal(prevVNode, vnode) {
  patchChildren(prevVNode.childFlags,
    vnode.childFlags,
    prevVNode.children,
    vnode.children,
    prevVNode.tag // 注意容器元素是旧的 container
  )

  // 让 vnode.el 指向 prevVNode.el
  vnode.el = prevVNode.el

  // 如果新旧容器不同，才需要搬运
  // 我们知道当我们调用 appendChild 方法向 DOM 中添加元素时，
  // 如果被添加的元素已存在于页面上，那么就会移动该元素到目标容器元素下。
  if (vnode.tag !== prevVNode.tag) {
    // 获取新的容器元素
    const container =
      typeof vnode.tag === 'string'
        ? document.querySelector(vnode.tag)
        : vnode.tag

    switch (vnode.childFlags) {
      case ChildrenFlags.SINGLE_VNODE:
        // 如果新的 portal 是单个子节点，就把该节点搬运到新容器中
        container.appendChild(vnode.children.el)
        break
      case ChildrenFlags.NO_CHILDREN:
        // 新的 Portal 没有子节点
        break
      default:
        // 如果新的 Portal 是多个子节点，遍历逐个将他们搬运到新容器中
        for (let i = 0; i < vnode.children.length; i++) {
          container.appendChild(vnode.children[i].el)
        }
        break
    }
  }
}


// 最长子序列
function lis(seq) {
  const valueToMax = {}
  let len = seq.length
  for (let i = 0; i < len; i++) {
    valueToMax[seq[i]] = 1
  }

  let i = len - 1
  let last = seq[i]
  let prev = seq[i - 1]
  while (typeof prev !== 'undefined') {
    let j = i
    while (j < len) {
      last = seq[j]
      if (prev < last) {
        const currentMax = valueToMax[last] + 1
        valueToMax[prev] =
          valueToMax[prev] !== 1
            ? valueToMax[prev] > currentMax
              ? valueToMax[prev]
              : currentMax
            : currentMax
      }
      j++
    }
    i--
    last = seq[i]
    prev = seq[i - 1]
  }

  const lis = []
  i = 1
  while (--len >= 0) {
    const n = seq[len]
    if (valueToMax[n] === i) {
      i++
      lis.unshift(len)
    }
  }

  return lis
}