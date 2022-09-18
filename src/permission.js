// 权限拦截在路由跳转 ，导航首位
import router from '@/router'
import store from '@/store' // 引入store实例，和组件中的this.$store是一回事
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
// 定制白名单
const whiteList = ['/login', '/404']
// 前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start() // 开启进度条
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      next('/') // 跳到主页
    } else {
      next() // 如果有token但不是登录页面则直接放行
    }
  } else {
    // 没有token的情况下
    // 大于-1 ，代表的是在白名单里
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的位置在白名单
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  NProgress.done()// 有一种情况，在有token的时候，跳转登录页又会重定向到主页，相当于咋们的路由地址没行交化，保持原地不动，|
})
// 在路由后置守卫关闭进度条,代表页面跳转成功后执行的钩子函数，里面有两个参数，一个是to  ,from，没有next这个方法
// 常用来修改标题之类的
router.afterEach(() => {
  NProgress.done()
})
// 权限步骤：
// 1.由于权限拦截需要判断当前要跳转的路由地址，因此需要路由守卫的技术，引入路由
// 2，to 要跳转的目标地址，from 从哪里跳过来 ，next 是一个方法必须的执行，不然页面会卡死
// 3.由于要用到vuex存储的token，需要引入store
// 4.判断有没有token如果有还要判断是不是跳转登录页，如果是，直接跳转到主页
// 5.如果没有token ，先判断跳转的页面有没有在白名单里面，有就放行
// 6.如果没有token而且没有在白名单内，则需要强制跳转登录页面
