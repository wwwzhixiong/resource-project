import axios from 'axios' // 引入axios
const service = axios.create() // 创建了一个新的axios实例
// 配置拦截器
service.interceptors.request.use() // 请求拦截器主要处理 token的**`统一注入问题`**
service.interceptors.response.use() // 响应拦截器 主要处理 返回的**`数据异常`** 和**`数据结构`**问题
export default service // 暴漏 axios 实例
