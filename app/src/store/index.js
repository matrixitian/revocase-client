import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    myCoins: 0,
    currentView: 'Cases',
    selectedCase: 'clutch',
    currentDrop: {condition: "MW",
    grade: "exceedingly_rare",
    longhand: "usp-s_cortex",
    name: "Cortex"
  }
  },
  mutations: {
    setCurrentDrop(state, payload) {
      state.currentDrop = payload.drop
    },
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
    },
    selectCase(state, payload) {
      state.selectedCase = payload.caseName
    }
  },
  getters: {
    getCurrentDrop(state) {
      return state.currentDrop
    },
    getUser(state) {
      return state.user
    },
    getSelectedCase(state) {
      return state.selectedCase
    },
    getCoins(state) {
      return state.myCoins
    }
  },
  actions: {
  },
  modules: {
  }
})
