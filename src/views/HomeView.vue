<template>
  <div class="home container">
    
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Invoices</h1>
        <span>There is {{ invoiceData.length }} invoice</span>
      </div>
      <div class="right flex">
        
        <div class="filter flex" @click="showFilterMenu">
          <span>
            Filter By Status <span v-if="filterStatus">: {{ filterStatus }}</span>
          </span>
          <img src="@/assets/icon-arrow-down.svg" alt="">

          <ul v-show="filterMenu" class="filter-menu">
            <li @click="filterByStatus">Draft</li>
            <li @click="filterByStatus">Pending</li>
            <li @click="filterByStatus">Paid</li>
            <li @click="filterByStatus">CLear Filter</li>
          </ul>
        </div>

        <div class="button flex" @click="addInvoice">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="" />
          </div>
          <span>New Invoice</span>
        </div>

      </div>
    </div>

    <div v-if="invoiceData.length > 0">
      <HomeInvoiceVue v-for="(row, i) in filterData" :invoice="row" :key="i"/>
    </div>

    <div v-else class="empty flex flex-column ">
      <img src="@/assets/illustration-empty.svg" alt="">
      <h3>There is nothing here</h3>
      <p>Create new invoice by clicking the New Invoice button and get started.</p>
    </div>

  </div>
</template>

<script>
import HomeInvoiceVue from '@/components/HomeInvoice.vue';
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'HomeView',
  components: {
    HomeInvoiceVue
  },
  data() {
    return {
      filterMenu: false,
      filterStatus: null
    }
  },
  methods: {
    ...mapMutations(['mutationShowModalInvoice']),

    addInvoice() {
      this.mutationShowModalInvoice()
    },

    showFilterMenu() {
      this.filterMenu = !this.filterMenu
    },

    filterByStatus(e) {
      if (e.target.innerText === "CLear Filter") {
        this.filterStatus = null
        return
      }

      this.filterStatus = e.target.innerText
    },

  },
  computed: {
    ...mapState(['invoiceData']),

    filterData() {
      return this.invoiceData.filter(row => {
        if (this.filterStatus == "Draft") {
          return row.invoiceDraft === true
        }
        if (this.filterStatus == "Pending") {
          return row.invoicePending === true
        }
        if (this.filterStatus == "Paid") {
          return row.invoicePaid === true
        }
        return row
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.home {
  color: #FFF;

  .header {
    margin-bottom: 65px;

    .left, 
    .right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      align-items: center;

      .button, 
      .filter {
        align-items: center;

        span {
          font-size: 12px;
        }
      }

      .filter {
        position: relative;
        margin-right: 40px;
        cursor: pointer;

        // span, 
        // img {
        //   pointer-events: none;
        // }

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1E2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1E2139;
              background-color: #fff;
            }
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #7C5DFA;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #FFF;

          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty {
    margin-top: 160px;
    align-items: center;

    img {
      width: 214px;
      height: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 40px;
    }

    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 16px;
    }
  }
}
</style>