
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 建立token的快捷访问
  name: state => state.user.userInfo.username, // 建立对用户名的快捷访问
  userId: state => state.user.userInfo.userId, // 建立用户Id的快捷访问
  staffPhoto: state => state.user.userInfo.staffPhoto // 用户头像
}
export default getters
