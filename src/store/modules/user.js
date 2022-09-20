// 按需引入token方法
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
// 引入登录接口
import { login, getUserInfo, getUserDetailById } from '@/api/user.js'
const state = {
  // token: null //  在用户模块的state中定义存储token的变量
  token: getToken(), // 页面一打开首先从cookie里获取token
  userInfo: {} // 定义一个存储用户信息的变量，是一个空对象，不要写成null，会对建立用户名的快捷访问有影响
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
  },
  // result是后台返回的数据
  setUserInfo(state, result) {
    state.userInfo = result // 响应式的修改数据方式1
    // 响应式的修改数据方式2： state.userInfo={...resullt}
    // 响应式的修改数据方式3: Vue.set('目标对象’，key,value)
    // 响应式的修改数据方式4: object.assign{(),state,userOnfo}
    // 什么不是响应式修改数据？
    // state.userInfo.name = '志雄'
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
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

    setTimeStamp() // 调用存储时间戳的方法 拿到token 时间戳存进去
    // if (result.data.success) {
    //   // 如果为true 表示登录成功
    //   result.data.data // 拿到用户token
    //   // 把请求回来的数据通过mutations更新到state当中的，顺便缓存
    //   context.commit('setToken', result.data.data)
    // }
  },

  // 获取用户资料的方法
  async getUserInfo(context) {
    const result = await getUserInfo() // 调用接口，获取用户资料信息
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将获取用户资料返回的数据和获取用户头像两个接口结果合并到一个对象里
    // context.commit('setUserInfo', result)
    // 此时已经获取到了用户的基本资料 迫不得已 为了头像再次调用一个接口
    context.commit('setUserInfo', baseResult) // 提交mutations
    // 将后台返回的数据更新到state中的userInfo变量里面
    return result
  },

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

  // 封装一个退出登录得方法
  logout(context) {
    // 退出登录得逻辑就是将用户信息和token清空
    // 调用mouiations里面的方法
    context.commit('removeToken') // 清空token
    context.commit('removeUserInfo') // 清空用户信息得方法
  }
}
export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
}

