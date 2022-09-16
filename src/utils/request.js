import axios from 'axios' // 引入axios
import { Message } from 'element-ui'
// 引入element消息提示组件
// 创建了一个新的axios实例

const service = axios.create({
  // 设置开发环境基础地址
  baseURL: process.env.VUE_APP_BASE_API,
  // 当执行npm run dev的时候会读取开发环境文件。env.development里面的变量，变量的值为/aoi，
  // 当发起请求的时候就会触发代理机制
  timeout: 5000
  // 设置接口请求超时的时间5秒
})
// 配置拦截器
service.interceptors.request.use() // 请求拦截器主要处理 token的**`统一注入问题`**
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
// 2：当接口响应失败后，会走到error这个回调
  Message.error(error.message) // 错误消息提示
  return Promise.reject(error) // 这段代码最终会通过catch进行捕获
})
export default service // 暴漏 axios 实例
