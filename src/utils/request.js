// import { config } from '@vue/test-utils'
import axios from 'axios' // 引入axios
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from './auth'
import router from '@/router'
// 引入element消息提示组件
// 创建了一个新的axios实例
const TimeOut = 3600 // 设置token的过期事件为1小时
const service = axios.create({
  // 设置开发环境基础地址
  baseURL: process.env.VUE_APP_BASE_API,
  // 当执行npm run dev的时候会读取开发环境文件。env.development里面的变量，变量的值为/aoi，
  // 当发起请求的时候就会触发代理机制
  timeout: 5000
  // 设置接口请求超时的时间5秒
})
// day04: 配置拦截器
service.interceptors.request.use(config => {
  // 如果有token，那就给config配置对象添加一个authoraiztion属性值为token：
  // 注意按接口文档规则进行拼接
  if (store.getters.token) {
    // 再有token的情况下，我们才能判断token是否过时
    if (isCheckTimeOut()) {
      // 如果为true过期了 token没用了
      store.dispatch('user/logout')
      // 跳到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // config是请求得配置信息，必须return出去
}, error => {
  return Promise.reject(error)
}) // 请求拦截器主要处理 token的**`统一注入问题`**

// 响应拦截器 主要处理 返回的**`数据异常`** 和**`数据结构`**问题
service.interceptors.response.use(response => {
  // 1；当接口响应成功后，会走response这个回调，获取数据 分为两种情况：
  const { success, message, data } = response.data
  // 当success是true的时候
  if (success) {
    return data
    // 当success是false的时候,比如说用户名或者密码错误
  } else {
    Message.error(message) // 直接提示信息
    return Promise.reject(new Error(message))
  }
}, error => {
  // 根据后台响应码判断token是否过期
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    // 2：当接口响应失败后，会走到error这个回调
    Message.error(error.message) // 错误消息提示
  }
  return Promise.reject(error) // 这段代码最终会通过catch进行捕获
})

// 封装一个判断token是否过时的方法
function isCheckTimeOut() {
  const currentTime = Date.now() // 获取最新的时间戳
  const timeStamp = getTimeStamp() // 获取缓存时间戳
  // 最新-缓存>1小时，证明token过时
  return (currentTime - timeStamp) / 1000 > TimeOut // 如果返回true 代表token过期了
}
export default service // 暴漏 axios 实例
