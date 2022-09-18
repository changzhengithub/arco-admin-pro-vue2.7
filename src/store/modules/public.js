

/**
 * @description 公共数据-状态管理器
 * @author changz
*/
const publicVuex = {
  state: {
    userId: '' // 用户id
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId
    }
  },
  getters: {},
  actions: {}
}
export default publicVuex