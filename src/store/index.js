import Vue from 'vue'
import Vuex from 'vuex'
import createPresistedState from 'vuex-persistedstate'
Vue.use(Vuex)
export default new Vuex.Store({
  plugins: [
    createPresistedState({
      key: 'HEIMA_TOUTIAO',
      reducer({ tokenObj }) {
        return { tokenObj }
      }
    })
  ],
  state: {
    tokenObj: {}
  },
  getters: {
    isLogin(state) {
      return !!state.tokenObj.token
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.tokenObj = token
    }
  }
})
