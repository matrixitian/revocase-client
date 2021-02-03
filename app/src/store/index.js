import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    myCoins: 0,
    currentView: 'Cases'
  },
  mutations: {
    updateMyCoins(state, payload) {
      if (payload.type === 'set') {
        state.myCoins = payload.amount
      } else if (payload.type === 'add') {
        state.myCoins += payload.amount
      } else if (payload.type === 'subtract') {
        state.myCoins -= payload.amount
      }
    },
    changeView(state, payload) {
      state.currentView = payload.view
    },
    setUser(state, payload) {
      console.log('pay', payload)
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
