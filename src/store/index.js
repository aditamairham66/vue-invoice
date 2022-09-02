import { createStore } from 'vuex'
import { db } from "@/firebase/firebaseSetting";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    modalInvoice: null,
    modalConfirmAlert: null,

    invoiceData: [],
    invoiceLoading: null,
    invoiceArray: [],

    editInvoice: null,
  },
  getters: {
    invoiceDetail(state) {
      return state.invoiceArray
    }
  },
  mutations: {
    mutationShowModalInvoice(state) {
      state.modalInvoice = !state.modalInvoice
    },

    mutationShowModalConfirmAlert(state) {
      state.modalConfirmAlert = !state.modalConfirmAlert
    },

    mutationSetInvoice(state, payload) {
      state.invoiceData.push(payload)
    },

    mutationSetLoadingInvoice(state) {
      state.invoiceLoading = true
    },

    mutationSetInvoiceArray(state, payload) {
      state.invoiceArray = state.invoiceData.filter(row => {
        return row.invoiceId === payload
      })
    },

    mutationSetEditInvoice(state) {
      state.editInvoice = !state.editInvoice
    },

    mutationDeleteInvoice(state, payload) {
      state.invoiceData = state.invoiceData.filter(row => row.docId !== payload)
    },

    mutationUpdateToPaid(state, payload) {
      state.invoiceData.forEach(row => {
        if (row.docId === payload) {
          row.invoicePaid = true
          row.invoicePending = false
        }
      })
    },

    mutationUpdateToPending(state, payload) {
      state.invoiceData.forEach(row => {
        if (row.docId === payload) {
          row.invoicePaid = false
          row.invoicePending = true
          row.invoiceDraft = false
        }
      })
    },
    
  },
  actions: {
    actionGetInvoiceAll({commit, state}) {
      onSnapshot(
        collection(db, "invoices"), (snap) => snap.docs.map((row) => {
          if (!state.invoiceData.some((invoice) => invoice.docId === row.id)) {
            console.log()
            const data = {
              docId: row.id,
              invoiceId: row.data().invoiceId,
              billerStreetAddress: row.data().billerStreetAddress,
              billerCity: row.data().billerCity,
              billerZipCode: row.data().billerZipCode,
              billerCountry: row.data().billerCountry,
              clientName: row.data().clientName,
              clientEmail: row.data().clientEmail,
              clientStreetAddress: row.data().clientStreetAddress,
              clientCity: row.data().clientCity,
              clientZipCode: row.data().clientZipCode,
              clientCountry: row.data().clientCountry,
              invoiceDateUnix: row.data().invoiceDateUnix,
              invoiceDate: row.data().invoiceDate,
              paymentTerms: row.data().paymentTerms,
              paymentDueDateUnix: row.data().paymentDueDateUnix,
              paymentDueDate: row.data().paymentDueDate,
              productDescription: row.data().productDescription,
              invoiceItemList: row.data().invoiceItemList,
              invoiceTotal: row.data().invoiceTotal,
              invoicePending: row.data().invoicePending,
              invoiceDraft: row.data().invoiceDraft,
              invoicePaid: row.data().invoicePaid,
            } 

            commit('mutationSetInvoice', data)
          }
        })
      )

      commit('mutationSetLoadingInvoice')
    },

    async actionUpdateInvoice({commit, dispatch}, {docId, routeId}) {
      commit('mutationDeleteInvoice', docId)

      await dispatch('actionGetInvoiceAll')

      commit('mutationSetInvoiceArray', routeId)
      commit('mutationShowModalInvoice')
      commit('mutationSetEditInvoice')
    },

    async actionDeleteInvoice({commit}, {docId}) {
      await deleteDoc(
        doc(db, 'invoices', docId)
      )

      commit('mutationDeleteInvoice', docId)
    },

    async actionUpdateToPaid({commit}, {docId}) {
      await updateDoc(
        doc(db, 'invoices', docId), {
          invoicePaid: true,
          invoicePending: false,
          invoiceDraft: false,
        }
      )

      commit('mutationUpdateToPaid', docId)
    },

    async actionUpdateToPending({commit}, {docId}) {
      await updateDoc(
        doc(db, 'invoices', docId), {
          invoicePaid: false,
          invoicePending: true,
          invoiceDraft: false,
        }
      )

      commit('mutationUpdateToPending', docId)
    },

  },
  modules: {
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
})
