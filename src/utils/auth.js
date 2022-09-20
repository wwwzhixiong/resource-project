import Cookies from 'js-cookie'
// js-cookie是一个插件

const TokenKey = 'hrsaas-ihrm-token' // 要存储的token的名称
const timeKey = 'hrsaas-timestamp-key' // 设置一个独一无二的key
// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}

// 读取时间戳
export function setTimeStamp() {
  return Cookies.set(timeKey, Date.now()) // 通过Date.now()获取当前时间戳存到缓存里面
}

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
