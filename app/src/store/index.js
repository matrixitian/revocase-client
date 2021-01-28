import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload.user

      console.log(state.user)
    }
  },
  getters: {
    getUser(state) {
      return state.user
    }
  },
  actions: {
  },
  modules: {
  }
})
