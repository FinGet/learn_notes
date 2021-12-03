import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 我们也需要给每个请求一个新的 router 实例
export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
     	{ path: '/item/:id', component: () => import('./components/item.vue') }
    ]
  })
}