import request from '@/utils/request'
// 登录接口的封装
export function login(data) {
  // 返回一个pormise对像
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {

}

export function logout() {

}
