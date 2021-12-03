let virtualDom = createElement('ul', {calss: 'lists'}, [
	createElement('li', {calss: 'item'}, ['a']),
	createElement('li', {calss: 'item'}, ['b']),
	createElement('li', {calss: 'item'}, ['c']),
]);

let virtualDom1 = createElement('ul', {calss: 'lists-groups'}, [
	createElement('li', {calss: 'item'}, ['a1']),
	createElement('li', {calss: 'item'}, ['b']),
	createElement('div', {calss: 'div'}, ['c']),
]);

// console.log(virtualDom);

let el = render(virtualDom);

// console.log(el);

renderDom(el, document.getElementById('app'));


// dom diff 根据两个虚拟对象创建出补丁，将这个补丁用来更新dom

let patches = diff(virtualDom, virtualDom1);

let allPatches = [];
let Idx = 0;
// 给元素打补丁
function changeNodes() {
	patch(el, patches);
}


function patch(node, patches) {
	allPatches = patches;
	walkPatch(node)
}
function walkPatch(node) {
	let currentPatch = allPatches[Idx++];
	let childNodes = node.childNodes;

	childNodes.forEach(child => walkPatch(child))
	if(currentPatch) {
		doPatch(node, currentPatch)
	}
}
function doPatch(node, patches) {
	console.log(patches)
	patches.forEach(patch => {
		switch(patch.type) {
			case 'ATTRS':
				for(let key in patch.attrs) {
					let val = patch.attrs[key];
					if(val) {
						setAttr(node, key, val);
					} else {
						node.removeAttribute(key);
					}
				}
				break;
			case 'TEXT':
				node.textContent = patch.text;
				break;
			case 'REPLACE':
				let newTree = patch.newTree instanceof Element ? 
					render(patch.newTree): document.createTextNode(patch.newTree);

					node.parentNode.replaceChild(newTree, node);
				break;
			case 'REMOVE':
				node.parentNode.removeChild(node);
				break;
			default:
				break; 
		}
	})
}










