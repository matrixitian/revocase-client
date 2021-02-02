import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    currentView: 'Cases'
  },
  mutations: {
    changeView(state, payload) {
      state.currentView = payload.view
    },
    setUser(state, payload) {
      state.user = payload.user
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
