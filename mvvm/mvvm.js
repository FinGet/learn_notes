class MVVM {
	constructor(options) {
		this.$el = options.el;
		this.$data = options.data;

		// 判断是否有需要编译的目标
		if(this.$el) {
			// 数据劫持 就是把对象的所有属性 改成get和set形式
			new Observe(this.$data);
			// 将data绑定在实例上， vm.message
			this.proxyData(this.$data);
			// 用数据和元素进行编译
			new Compile(this.$el, this);
		}
	}
	proxyData(data) {
		Object.keys(data).forEach(key => {
			Object.defineProperty(this, key, {
				get() {
					return data[key];
				},
				set(newVal) {
					data[key] = newVal;
				}
			})
		})
	}
}