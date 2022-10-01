import Vue from 'vue'
import Router from 'vue-router'
// 引入多个模块的规则
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login', // 一级路由
    component: () => import('@/views/login/index'),
    hidden: true // 控制该路由在菜单是否展示的。true代表隐藏
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  { // 一级路由的布局页面
    path: '/',
    component: Layout,
    redirect: '/dashboard', // 代表的路由地址空的时候重定向到首页
    children: [{
      path: 'dashboard',
      name: '管理员',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/import',
    component: Layout,
    hidden: true, // 隐藏在左侧菜单中
    children: [{
      path: '', // 二级路由path什么都不写 表示二级默认路由
      component: () => import('@/views/import')
    }]
  },
  // 这个配置放到后面是指当所有的路由地址都不匹配的时候，就重定向到404页面
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
// 定义一个动态路由变量 代表的是一个数组里面有很多个对象，每一个对象就是一个模块路由规则

// 这里导出这个变量，后面做权限的时候会用到
export const asyncRoutes = [
  approvalsRouter,
  departmentsRouter,
  employeesRouter,
  permissionRouter,
  attendancesRouter,
  salarysRouter,
  settingRouter,
  socialRouter
]
const createRouter = () => new Router({
  // 管理页面的滚动行为，是路由中的一个方法
  scrollBehavior: () => ({ y: 0 }),
  // 通过展开运算符合并数组
  routes: [...constantRoutes, ...asyncRoutes] // 静态路由和动态路由的临时合并
})

const router = createRouter() // 实例化一个路由
// const router = new Router

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
