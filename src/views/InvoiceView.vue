<template>
  <div v-if="detail" class="invoice-view container">
    
    <router-link class="nav-link flex" :to="{ name: 'home' }">
      <img src="@/assets/icon-arrow-left.svg" alt="" /> Go Back
    </router-link>

    <div class="header flex">
      <div class="left flex">
        <span>Status</span>
        <div class="status-button flex" :class="{ paid: detail.invoicePaid, draft: detail.invoiceDraft, pending: detail.invoicePending }">
          <span v-if="detail.invoicePaid">Paid</span>
          <span v-if="detail.invoiceDraft">Draft</span>
          <span v-if="detail.invoicePending">Pending</span>
        </div>
      </div>
      <div class="right flex">
        <button class="dark-purple" @click="updateInvoice">Edit</button>
        <button class="red" @click="deleteInvoice(detail.docId)">Delete</button>
        <button class="green" @click="updateToPaid(detail.docId)" 
          v-if="detail.invoicePending">Mark as Paid</button>
        <button class="orange" @click="updateToPending(detail.docId)" 
          v-if="detail.invoiceDraft || detail.invoicePaid">Mark as Pending</button>
      </div>
    </div>

    <div class="invoice-details flex flex-column">
      
      <div class="top flex">
        <div class="left flex flex-column">
          <p>
            <span>#</span>{{ detail.invoiceId }}
          </p>
          <p>{{ detail.productDescription }}</p>
        </div>
        <div class="right flex flex-column">
          <p>{{ detail.billerStreetAddress }}</p>
          <p>{{ detail.billerCity }}</p>
          <p>{{ detail.billerZipCode }}</p>
          <p>{{ detail.billerCountry }}</p>
        </div>
      </div>

      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Invoice Date</h4>
          <p>{{ detail.invoiceDate }}</p>

          <h4>Payment Date</h4>
          <p>{{ detail.paymentDueDate }}</p>
        </div>
        <div class="bill flex flex-column">
          <h4>Bill To</h4>
          <p>{{ detail.clientName }}</p>
          <p>{{ detail.clientStreetAddress }}</p>
          <p>{{ detail.clientCity }}</p>
          <p>{{ detail.clientZipCode }}</p>
          <p>{{ detail.clientCountry }}</p>
        </div>
        <div class="send-to flex flex-column">
          <h4>Sent To</h4>
          <p>{{ detail.clientEmail }}</p>
        </div>
      </div>

      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Item Name</p>
            <p>QTY</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          <div v-for="(row, i) in detail.invoiceItemList" :key="i" class="item flex">
            <p>{{ row.itemName }}</p>
            <p>{{ row.qty }}</p>
            <p>{{ row.price }}</p>
            <p>{{ row.total }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Amount Due</p>
          <p>{{ detail.invoiceTotal }}</p>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'InvoiceView',
  data() {
    return {
      detail: null,
    }
  },
  created() {
    this.getInvoiceId()
  },
  methods: {
    ...mapMutations(['mutationSetInvoiceArray', 'mutationSetEditInvoice', 'mutationShowModalInvoice']),

    ...mapActions(['actionDeleteInvoice', 'actionUpdateToPaid', 'actionUpdateToPending']),

    getInvoiceId() {
      this.mutationSetInvoiceArray(this.$route.params.invoiceId)
      this.detail = this.invoiceDetail[0]
    },

    updateInvoice() {
      this.mutationSetEditInvoice()
      this.mutationShowModalInvoice()
    },

    async deleteInvoice(docId) {
      await this.actionDeleteInvoice({
        docId: docId
      })
      this.$router.push({ name: 'home' })
    },

    async updateToPaid(docId) {
      await this.actionUpdateToPaid({
        docId: docId
      })
    },

    async updateToPending(docId) {
      await this.actionUpdateToPending({
        docId: docId
      })
    },

  },
  computed: {
    ...mapState(['invoiceArray', 'editInvoice']),
    ...mapGetters(['invoiceDetail'])
  },
  watch: {
    editInvoice() {
      if (!this.editInvoice) {
        this.detail = this.invoiceDetail[0]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.invoice-view {
  .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: #fff;
    font-size: 12px;

    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }

  .header, 
  .invoice-details {
    background-color: #1e2139;
    border-radius: 20px;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;

    .left {
      align-items: center;
    
      span {
        color: #dfe3fa;
        margin-right: 16px;
      }
    }
    
    .right {
      flex: 1;
      justify-content: flex-end;
    
      button {
        color: #fff;
      }
    }
  }

  .invoice-details {
    padding: 48px;
    margin-top: 24px;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 12px;

        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #888eb0;
        }
      }

      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }

    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;

      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill, 
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }

        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 12px;
        }
      }

      .send-to {
        flex: 2;
      }

    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;

        .heading {
          color: #dfe3fa;
          font-size: 12px;
          margin-bottom: 32px;
         
          p:first-child {
            flex: 3;
            text-align: left;
          }
         
          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;

          &:last-child {
            margin-bottom: 0;
          }
          
          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }
    }

    .total {
      color: #fff;
      padding: 32px;
      background-color: rgba(12, 14, 22, 0.7);
      align-items: center;
      border-radius: 0 0 20px 20px;

      p {
        flex: 1;
        font-size: 12px;
      }

      p:nth-child(2) {
        font-size: 28px;
        text-align: right;
      }
    }
  }

}
</style>