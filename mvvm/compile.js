class Compile{
	constructor(el, vm) {
		this.el = this.isElementNode(el)?el:document.querySelector(el); // #app document.queryselector

		 /* istanbul ignore if  vue源码的mounted会覆盖挂载的元素*/ 
		 if (el === document.body || el === document.documentElement) {
      warn(
        "Do not mount Vue to <html> or <body> - mount to normal elements instead."
      );
      return this
		}
		
		this.vm = vm;

		if(this.el) {
			// 如果元素存在才编译
			// console.log(this.el)
			// 1.先把这些真实的DOM移入到内存中 fragment
			let fragment = this.createFragment(this.el);
			// console.log(fragment);
			// 2.编译 => 提取想要的元素节点 v-model 和 文本节点 {{}}
			this.compile(fragment);
			// 3.把编译好的fragment放回页面
			this.el.appendChild(fragment);
		}

	}
	// 辅助方法
	
	/**
	 * 判断是否是元素节点
	 * @param  {[type]}  node [节点]
	 * @return {Boolean}      [是否是元素节点]
	 */
	isElementNode(node) {
		// node.nodeType === 1 表示 一个 元素 节点，例如 <p> 和 <div>。
		return node.nodeType === 1;
	}

	/**
	 * 判断是否是指令
	 * @param  {[type]}  name [属性名]
	 * @return {Boolean}      [description]
	 */
	isDirective(name) {
		return name.includes('v-');
	}


	// 核心方法
	
	/**
	 * 创建dom节点片段，放到内存中
	 * @param  {[type]} el [元素]
	 * @return {[type]}    [节点片段]
	 */
	createFragment(el) {
		let fragment = document.createDocumentFragment();
		let firstChild;

		while (firstChild = el.firstChild) {
			// console.log(el.firstChild)
			fragment.appendChild(firstChild)
		}

		return fragment;
	}

	/**
	 * 编译模版
	 * @param  {[type]} fragment [dom片段]
	 * @return {[type]}          [description]
	 */
	compile(fragment) {
		let childNodes = fragment.childNodes;
		// console.log(childNodes); 类数组结构
		Array.from(childNodes).forEach(node => {
			// 判断是否是元素节点
			if(this.isElementNode(node)) {
				// 编译元素
				this.compileElement(node);
				// 如果是元素节点，还需要递归
				this.compile(node);
			} else {
				// 文本节点
				// 编译文本
				this.compileText(node);
			}
		})
	}

	/**
	 * 编译元素
	 * @param  {[type]} node [节点]
	 * @return {[type]}      [description]
	 */
	compileElement(node) {
		let attrs = node.attributes;
		// console.log(attrs) NamedNodeMap {0: type, 1: v-model, type: type, v-model: v-model, length: 2}
		Array.from(attrs).forEach(attr => {
			// console.log(typeof attr); // type="text" v-model="message" => object{name: value}
			let attrName = attr.name;
			if(this.isDirective(attrName)) {
				// 取到对应的值，放到节点中
				// node vm.$data
				let expr = attr.value;
				let type = attr.name.slice(2); // model
				CompileUtil[type](node, this.vm, expr);
			}
		})
	}

	/**
	 * 编译文本
	 * @param  {[type]} node [节点]
	 * @return {[type]}      [description]
	 */
	compileText(node) {
		let expr = node.textContent; // 取文本内容
		let reg = /\{\{([^}]+)\}\}/g;

		if(reg.test(expr)) {
			// console.log(expr) // {{message}}

			CompileUtil['text'](node, this.vm, expr);
		}
	}
}

// 编译方法
CompileUtil = {
	text(node, vm, expr) { // 文本处理
		let updateFn = this.updater['textUpdater'];
		// expr => {{message}}
		expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
			new Watcher(vm, arguments[1], (oldVal, newVal) => {
				// 如果数据变化了，文本节点需要重新获取依赖的属性更新文本内容
				updateFn && updateFn(node, this.getVal(vm, expr, 'text'));
			})
		})
		
		updateFn && updateFn(node, this.getVal(vm, expr, 'text'));
	},
	model(node, vm, expr) { // 输入框处理
		let updateFn = this.updater['modelUpdater'];
		// 这里应该加一个监控，数据变了，应该调用watch
		new Watcher(vm, expr, (oldVal, newVal) => {
			updateFn && updateFn(node, newVal);
		})

		// v-model监听事件
		node.addEventListener('input', (e) => {
			let newVal = e.target.value;
			this.setVal(vm, expr, newVal);
		})
		updateFn && updateFn(node, this.getVal(vm, expr));
	},
	updater: {
		// 文本更新
		textUpdater(node, value) {
			node.textContent = value;
		},
		// 输入框更新
		modelUpdater(node, value) {
			node.value = value;
		}
	},
	setVal(vm, expr, val) {
		expr = expr.split('.');
		// 把上一级的结果返回给下一级
		return expr.reduce((prev, next, currentIndex) => {
			if(currentIndex === expr.length - 1) {
				return prev[next] = val;
			}
			return prev[next];
		}, vm.$data)
		// vm.$data 会作为第一个prev
	},
	// message.a.b.c
	getVal(vm, expr, type) {
		if (type == 'text') {
			return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
				return this.getVal(vm, arguments[1]);
			})
		} else {
			expr = expr.split('.');
			// 把上一级的结果返回给下一级
			return expr.reduce((prev, next) => {
				return prev[next];
			}, vm.$data)
			// vm.$data 会作为第一个prev
		}
	}
}







