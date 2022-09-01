import { createStore } from 'vuex'

export default createStore({
  state: {
    modalInvoice: null
  },
  getters: {
  },
  mutations: {
    mutationShowModalInvoice(state) {
      state.modalInvoice = !state.modalInvoice
    }
  },
  actions: {
  },
  modules: {
  }
})
