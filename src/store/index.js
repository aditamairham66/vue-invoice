import { createStore } from 'vuex'
import { db } from "@/firebase/firebaseSetting";
import { collection, onSnapshot } from 'firebase/firestore';

export default createStore({
  state: {
    modalInvoice: null,
    modalConfirmAlert: null,

    invoiceData: [],
    invoiceLoading: null,
    invoiceArray: null,
  },
  getters: {
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
    
  },
  actions: {
    actionGetInvoiceAll({commit, state}) {
      onSnapshot(
        collection(db, "invoices"), (snap) => snap.docs.map((row) => {
          if (!state.invoiceData.some((invoice) => invoice.docId === row.id)) {
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
  },
  modules: {
  }
})
