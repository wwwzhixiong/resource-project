import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // 语言切换

import '@/styles/index.scss' // 全局的css文件

import App from './App' // 引入根组件
import store from './store' // 引入vuex文件
import router from './router' // 引入路由
import Component from '@/components'
import '@/icons' // 引入图标文件
import '@/permission' // 引入权限配置文件
// 引入封装好的自定义指令文件
// import { imagerror } from '@/directives'
import * as directives from '@/directives' // 把文件中所有导出得常量命名为directives，
// 所有导出得数据在这个directives
import * as filters from '@/filters' // 引入工具类
// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
// console.log(directives) // 经过打印发现，他是一个对象，里面存的就是我们导出得数据
// 问题：如何拿到对象当中所有得属性？
// Object.keys()方法会返回一个由一个给定对象的自身可枚举属性组成的数组，
// 数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致。
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
// 注册自定义组件
Vue.use(Component)

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// 注册ElementUI
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
