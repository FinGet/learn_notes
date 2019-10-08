// app.js 是我们应用程序的「通用 entry」。

import Vue form 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createStore } from './store';
import { sync } from 'vuex-router-sync';

// 导出一个工厂函数，用于创建新的，每个页面都是新的vue 实例
// 应用程序、router 和 store 实例
export function createApp () {
	// 创建 router, store 实例
	const router = createRouter();
	const store = createStore();

 	// 同步路由状态(route state)到 store
  sync(store, router);

  const app = new Vue({
  	// 注入 router
  	router,
  	store,
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
  return { app, router, store}
}