function diff(oldTree, newTree) {
	let patches = {};
	let index = 0;
	// 递归树，比较后的结果放到补丁包中
	walk(oldTree, newTree, index, patches);
	return patches;
}
const ATTRS = 'ATTRS';
const TEXT = 'TEXT';
const REMOVE = "REMOVE";
const REPLACE = "REPLACE";

let Index = 0;
// 比较属性
function diffAttr(oldAttrs, newAttrs) {
	let patch = {};
	for(let key in oldAttrs) {
		if(oldAttrs[key] !== newAttrs[key]) {
			patch[key] = newAttrs[key];
		}
	}
	for(let key in newAttrs) {
		// 新增的属性
		if(!oldAttrs.hasOwnProperty(key)) {
			patch[key] = newAttrs[key];
		}
	}
	return patch;
}
/**
 * 比较子节点
 * @param  {[type]} oldChildren [description]
 * @param  {[type]} newChildren [description]
 * @param  {[type]} index       [没用]
 * @param  {[type]} patches     [description]
 * @return {[type]}             [description]
 */
function diffChildren(oldChildren, newChildren, index, patches) {
	oldChildren.forEach((child, idx) => {
		// 索引不应该是index
		// index 每次传给walk是递增的
		walk(child, newChildren[idx], ++Index, patches);
	})
}
function isString(node) {
	return Object.prototype.toString.call(node) === '[object String]';
}
function walk(oldTree, newTree, index, patches) {
	let currentPatch = [];
	if(!newTree) {
		currentPatch.push({type: REMOVE, index})
	}else if(isString(oldTree)&&isString(newTree)) { // 判断文本是否一致
		if(oldTree !== newTree) {
			currentPatch.push({type:TEXT, text: newTree })
		}
	}else if(oldTree.type === newTree.type) {
		// 比较属性是否有更改
		let attrs = diffAttr(oldTree.props, newTree.props);
		// console.log(attrs)
		if(Object.keys(attrs).length) {
			currentPatch.push({ type: ATTRS, attrs})
		}
		// 如果有children
		if(oldTree.children) {
			diffChildren(oldTree.children, newTree.children, index, patches)
		}
	} else {
		// 说明节点被替换了
		currentPatch.push({ type: REPLACE, newTree})
	}
	// 有补丁才放入补丁包
	if(currentPatch.length) patches[index] = currentPatch;
	// console.log(patches)
}









