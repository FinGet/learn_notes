class Element {
	constructor(type, props, children) {
		this.type = type;
		this.props = props;
		this.children = children;
	}
}

function createElement(type, props, children) {
	return new Element(type, props, children)
}

/**
 * 渲染virtualdom -> dom
 * @param  {[type]} eleObj [description]
 * @return {[type]}        [description]
 */
function render(eleObj) {
	let el = document.createElement(eleObj.type);
	for(let key in eleObj.props) {
		// 设置属性的方法
		setAttr(el, key, eleObj.props[key]);
	}

	// 递归
	eleObj.children.forEach(child => {
		// 是elment就递归，不是就创建文本节点
		child = (child instanceof Element)? render(child): 
			document.createTextNode(child);

		el.appendChild(child);
	})
	return el;
}

/**
 * 绑定dom节点渲染
 * @param  {[type]} el     [dom]
 * @param  {[type]} target [el]
 * @return {[type]}        [description]
 */
function renderDom(el, target) {
	target.appendChild(el);
}


/**
 * 设置属性
 * @param {[type]} node  [节点el]
 * @param {[type]} key   [属性key]
 * @param {[type]} value [值]
 */
function setAttr(node, key, value) {
	switch (key) {
		case 'value': // node 是一个input或者textarea
			if(node.tagName.toUpperCase() === 'INPUT' || 
				node.tagName.toUpperCase() === 'TEXTAREA') {
				node.value = value;
			} else {
				node.setAttribute(key, value);
			}
			break;
		case 'style':
			node.style.cssText = value;
			break;
		default: 
			node.setAttribute(key, value);
			break;
	}
}












