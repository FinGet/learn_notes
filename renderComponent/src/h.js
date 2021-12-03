import { VNodeFlags,ChildrenFlags } from './flags.js'


// 唯一标识
// 对于 Fragment 类型的 VNode，它的 tag 属性值为 null，
// 但是纯文本类型的 VNode 其 tag 属性值也是 null，所以为了区分，我们可以增加一个唯一的标识
export const Fragment = Symbol()
export const Portal = Symbol()

export function h(tag, data = null, children = null) {
	let flags = null;
	if(typeof tag === 'string') {
		flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML;

		// 序列化 class
    if (data) {
      data.class = normalizeClass(data.class)
    }
	} else if(tag === Fragment) {
		flags = VNodeFlags.FRAGMENT;
	} else if(tag === Portal) {
		/**
		 	const portalVNode = {
			  tag: Portal,
			  data: {
			    target: '#app-root'
			  },
			  ...
			}
		 */
		flags = VNodeFlags.PORTAL;
		tag = data && data.target; // 实际tag是data.target
	} else {
		// 在 Vue2 中用一个对象作为组件的描述，而在 Vue3 中，有状态组件是一个继承了基类的类。
		// 兼容Vue2的对象式组件
		if(tag !== null && typeof tag === 'object') {
			flags = tag.functional
        ? VNodeFlags.COMPONENT_FUNCTIONAL       // 函数式组件
        : VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
		}else if (typeof tag === 'function') {
      // Vue3 的类组件
      flags = tag.prototype && tag.prototype.render
        ? VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
        : VNodeFlags.COMPONENT_FUNCTIONAL       // 函数式组件
    }
	}

	// 确定 childFlags
  let childFlags = null
  if(Array.isArray(children)) {
  	const {length} = children;
  	if(length === 0) {
  		// 没有 children
  		childFlags = ChildrenFlags.NO_CHILDREN 
  	}else if (length === 1) {
	    // 单个子节点
	    childFlags = ChildrenFlags.SINGLE_VNODE
	    children = children[0]
	  } else {
	    // 多个子节点，且子节点使用key
	    childFlags = ChildrenFlags.KEYED_VNODES
	    children = normalizeVNodes(children)
	  }
	} else if (children == null) {
    // 没有子节点
    childFlags = ChildrenFlags.NO_CHILDREN
  } else if (children._isVNode) {
    // 单个子节点
    childFlags = ChildrenFlags.SINGLE_VNODE
  } else {
    // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
    childFlags = ChildrenFlags.SINGLE_VNODE
    children = createTextVNode(children + '')
  }

  // 返回 VNode 对象
  return {
    _isVNode: true,
    flags,
    tag,
    data,
    key: data && data.key ? data.key : null,
    children,
    childFlags,
    el: null
  }
}

function normalizeVNodes(children) {
  const newChildren = []
  // 遍历 children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.key == null) {
      // 如果原来的 VNode 没有key，则使用竖线(|)与该VNode在数组中的索引拼接而成的字符串作为key
      child.key = '|' + i
    }
    newChildren.push(child)
  }
  // 返回新的children，此时 children 的类型就是 ChildrenFlags.KEYED_VNODES
  return newChildren
}

function normalizeClass(classValue) {
  // res 是最终要返回的类名字符串
  let res = ''
  if (typeof classValue === 'string') {
    res = classValue
  } else if (Array.isArray(classValue)) {
    for (let i = 0; i < classValue.length; i++) {
      res += normalizeClass(classValue[i]) + ' '
    }
  } else if (typeof classValue === 'object') {
    for (const name in classValue) {
      if (classValue[name]) {
        res += name + ' '
      }
    }
  }
  return res.trim()
}


// 纯文本节点
function createTextVNode(text) {
  return {
    _isVNode: true,
    // flags 是 VNodeFlags.TEXT
    flags: VNodeFlags.TEXT,
    tag: null,
    data: null,
    // 纯文本类型的 VNode，其 children 属性存储的是与之相符的文本内容
    children: text,
    // 文本节点没有子节点
    childFlags: ChildrenFlags.NO_CHILDREN,
    el: null
  }
}

