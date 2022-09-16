import Cookies from 'js-cookie'
// js-cookie是一个插件

const TokenKey = 'hrsaas-ihrm-token' // 要存储的token的名称
// 获取token的方法
export function getToken() {
  return Cookies.get(TokenKey)
}
// 存储token的方法
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 删除token的方法
export function removeToken() {
  return Cookies.remove(TokenKey)
}
