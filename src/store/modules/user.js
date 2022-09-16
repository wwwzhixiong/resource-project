// 按需引入token方法
import { getToken, setToken, removeToken } from '@/utils/auth'
// 引入登录接口
import { login } from '@/api/user.js'
const state = {
  // token: null //  在用户模块的state中定义存储token的变量
  token: getToken() // 页面一打开首先从cookie里获取token
}

const mutations = {
  // 定义修改 state中的 token的方法
  setToken(state, token) {
    state.token = token // 修改 state中的 token的方法
    setToken(token) // 调用存储token的方法，顺便在cookie里面存储一份，为了防止用户刷新页面token丢失
  },
  removeToken(state) {
    // 清除token的方法
    // 当用户点击注销时，清空token
    state.token = null// 删除vuex中国的token
    removeToken() // 清空缓存中的token
  }
}

// 封装调用接口的方法
const actions = {
  // 方式1：async 和 await (推荐)
  async login(context, data) {
    // 调用api接口 拿到token
    const result = await login(data) // result 是执行的结果
    // 由于在响应拦截器里已经对数据进行了结构，而且对success已经进行了判断所以这里不需要在进行判断
    context.commit('setToken', result) // 响应token

    // if (result.data.success) {
    //   // 如果为true 表示登录成功
    //   result.data.data // 拿到用户token
    //   // 把请求回来的数据通过mutations更新到state当中的，顺便缓存
    //   context.commit('setToken', result.data.data)
    // }
  }

  // 方式2： 通过.then的方式
  // login(context, data) {
  //   return new Promise(function (resolve) {
  //     login(data).then(result => {
  //       if (result.data.success) {
  //         context.commit('setToken', result.data.data) // 提交mutations设置token
  //         resolve()  // 表示执行成功了
  //       }
  //     })
  //   })
  // }
}
export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
}

