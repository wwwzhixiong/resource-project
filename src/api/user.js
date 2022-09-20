import request from '@/utils/request'
// 登录接口的封装
export function login(data) {
  // 返回一个pormise对像
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

// 封装获取用户资料的请求
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
    // 可以在单个接口中添加headers属性携带token，但是每个接口都得添加headers，比较麻烦，所以放在请求拦截中同意配置
  })
}
/** *
 *
 * 获取用户的基本信息  现在写它 完全是为了显示头像
 * **/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout() {

}
