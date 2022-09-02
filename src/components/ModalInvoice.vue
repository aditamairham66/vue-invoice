<template>
    <div @click="checkClick" class="invoice-wrap flex flex-column" ref="modalInvoiceRef">
        <form @submit.prevent="submitForm" class="invoice-content">
            <LoadingVue v-show="loading"/>

            <h1 v-if="!editInvoice">New Invoice</h1>
            <h1 v-if="editInvoice">Edit Invoice</h1>

            <div class="bill-from flex flex-column">
                <h4>Bill Form</h4>
                <div class="input flex flex-column">
                    <label for="billerStreetAddress">Street Address</label>
                    <input type="text" name="street_address" id="billerStreetAddress" required 
                        v-model="billerStreetAddress">
                </div>

                <div class="location-details flex">
                    <div class="input flex flex-column">
                        <label for="billerCity">City</label>
                        <input type="text" name="city" id="billerCity" required 
                            v-model="billerCity">
                    </div>

                    <div class="input flex flex-column">
                        <label for="billerZipCode">Zip Code</label>
                        <input type="text" name="post_code" id="billerZipCode" required 
                            v-model="billerZipCode">
                    </div>

                    <div class="input flex flex-column">
                        <label for="billerCountry">Country</label>
                        <input type="text" name="country" id="billerCountry" required 
                            v-model="billerCountry">
                    </div>
                </div>
            </div>

            <div class="bill-to flex flex-column">
                <h4>Bill To</h4>
                <div class="input flex flex-column">
                    <label for="clientName">Client Name</label>
                    <input type="text" name="client_name" id="clientName" required 
                        v-model="clientName">
                </div>

                <div class="input flex flex-column">
                    <label for="clientEmail">Client Email</label>
                    <input type="email" name="client_email" id="clientEmail" required 
                        v-model="clientEmail">
                </div>

                <div class="input flex flex-column">
                    <label for="clientStreetAddress">Client Address</label>
                    <input type="text" name="street_address" id="clientStreetAddress" required 
                        v-model="clientStreetAddress">
                </div>

                <div class="location-details flex">
                    <div class="input flex flex-column">
                        <label for="clientCity">City</label>
                        <input type="text" name="client_city" id="clientCity" required 
                            v-model="clientCity">
                    </div>

                    <div class="input flex flex-column">
                        <label for="clientZipCode">Zip Code</label>
                        <input type="text" name="client_post_code" id="clientZipCode" required 
                            v-model="clientZipCode">
                    </div>

                    <div class="input flex flex-column">
                        <label for="clientCountry">Country</label>
                        <input type="text" name="client_country" id="clientCountry" required 
                            v-model="clientCountry">
                    </div>
                </div>
            </div>

            <div class="invoice-work flex flex-column">
                <div class="payment flex">
                    <div class="input flex flex-column">
                        <label for="invoiceDate">Invoice Date</label>
                        <input type="text" name="invoice_date" id="invoiceDate" disabled 
                            v-model="invoiceDate">
                    </div>
                    <div class="input flex flex-column">
                        <label for="paymentDueDate">Payment Due Date</label>
                        <input type="text" name="payment_due_date" id="paymentDueDate" disabled 
                            v-model="paymentDueDate">
                    </div>
                </div>


                <div class="input flex flex-column">
                    <label for="paymentTerms">Payment Terms</label>
                    <select name="payment_term" id="paymentTerms" v-model="paymentTerms">
                        <option value="30">Next 30 Days</option>
                        <option value="60">Next 60 Days</option>
                    </select>
                </div>

                <div class="input flex flex-column">
                    <label for="productDescription">Product Description</label>
                    <input type="text" name="product_desc" id="productDescription" required 
                        v-model="productDescription">
                </div>

                <div class="work-items">
                    <h3>Item List</h3>

                    <table class="item-list">
                        <tr class="table-heading flex">
                            <th class="item-name">Item Name</th>
                            <th class="qty">Qty</th>
                            <th class="price">Price</th>
                            <th class="total">Total</th>
                        </tr>

                        <tr class="table-items flex" v-for="(row, i) in invoiceItemList" :key="i">
                            <td class="item-name">
                                <input type="text" v-model="row.itemName">
                            </td>
                            <td class="qty">
                                <input type="text" v-model="row.qty">
                            </td>
                            <td class="price">
                                <input type="text" v-model="row.price">
                            </td>
                            <td class="total flex">
                                ${{ (row.total = row.qty*row.price) }}
                            </td>

                            <img src="@/assets/icon-delete.svg" alt="" 
                                @click="deleteProduct(row.id)">
                        </tr>
                    </table>

                    <div class="flex button" @click="addProduct">
                        <img src="@/assets/icon-plus.svg" alt="">
                        Add new item
                    </div>

                </div>
            </div>

            <div class="save flex">
                <div class="left">
                    <button type="button" class="red" @click="closeModal">Cancel</button>
                </div>
                <div class="right flex">
                    <button type="submit" class="dark-purple" v-if="!editInvoice" 
                        @click="saveDraftInvoice">Save Draft</button>
                    <button type="submit" class="purple" v-if="!editInvoice" 
                        @click="saveInvoice">Create Invoice</button>
                    <button type="submit" class="purple" v-if="editInvoice" 
                        @click="saveInvoice">Update Invoice</button>
                </div>
            </div>

        </form>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { uid } from 'uid';
import { db } from "@/firebase/firebaseSetting";
import { addDoc, collection, doc, updateDoc } from '@firebase/firestore';
import LoadingVue from './Loading.vue';

export default {
    name: 'modalInvoice',
    components: {
        LoadingVue
    },
    data() {
        return {
            OptionDate: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            loading: null,
            docId: null,
            billerStreetAddress: null,
            billerCity: null,
            billerZipCode: null,
            billerCountry: null,
            clientName: null,
            clientEmail: null,
            clientStreetAddress: null,
            clientCity: null,
            clientZipCode: null,
            clientCountry: null,
            invoiceDateUnix: null,
            invoiceDate: null,
            paymentTerms: null,
            paymentDueDateUnix: null,
            paymentDueDate: null,
            productDescription: null,
            invoicePending: null,
            invoiceDraft: null,
            invoiceItemList: [],
            invoiceTotal: 0,
        }
    },
    methods: {
        ...mapMutations(['mutationShowModalInvoice', 'mutationShowModalConfirmAlert', 'mutationSetEditInvoice']),

        ...mapActions(['actionUpdateInvoice']),

        checkClick(e) {
            if (e.target === this.$refs.modalInvoiceRef) {
                this.mutationShowModalConfirmAlert();
            }
        },

        closeModal() {
            this.mutationShowModalInvoice()

            if (this.editInvoice) {
                this.mutationSetEditInvoice()
            }
        },

        addProduct() {
            this.invoiceItemList.push({
                id: uid(),
                itemName: "",
                qty: "",
                price: 0,
                total: 0,
            })
        },
        
        deleteProduct(id) {
            this.invoiceItemList = this.invoiceItemList.filter((row) => row.id !== id)
        },

        saveDraftInvoice() {
            this.invoiceDraft = true
        },

        saveInvoice() {
            this.invoicePending = true
        },

        sumTotalAll() {
            this.invoiceTotal = 0
            this.invoiceItemList.forEach(row => {
                this.invoiceTotal += row.total
            })
        },

        async addInvoice() {
            if (this.invoiceItemList.length <= 0) {
                this.$swal("Attention", "Product is empty", "warning")
                return
            }

            // show loading
            this.loading = true

            // sum total price product
            this.sumTotalAll()

            await addDoc(
                collection(db, "invoices"), 
                {
                    invoiceId: uid(6),
                    billerStreetAddress: this.billerStreetAddress,
                    billerCity: this.billerCity,
                    billerZipCode: this.billerZipCode,
                    billerCountry: this.billerCountry,
                    clientName: this.clientName,
                    clientEmail: this.clientEmail,
                    clientStreetAddress: this.clientStreetAddress,
                    clientCity: this.clientCity,
                    clientZipCode: this.clientZipCode,
                    clientCountry: this.clientCountry,
                    invoiceDateUnix: this.invoiceDateUnix,
                    invoiceDate: this.invoiceDate,
                    paymentTerms: this.paymentTerms,
                    paymentDueDateUnix: this.paymentDueDateUnix,
                    paymentDueDate: this.paymentDueDate,
                    productDescription: this.productDescription,
                    invoicePending: this.invoicePending,
                    invoiceDraft: this.invoiceDraft,
                    invoiceItemList: this.invoiceItemList,
                    invoiceTotal: this.invoiceTotal,
                }
            )

            // hide loading
            this.loading = false

            this.mutationShowModalInvoice()
        },

        async updateInvoice() {
            if (this.invoiceItemList.length <= 0) {
                this.$swal("Attention", "Product is empty", "warning")
                return
            }

            // show loading
            this.loading = true

            // sum total price product
            this.sumTotalAll()

            await updateDoc(
                doc(db, "invoices", this.docId), 
                {
                    billerStreetAddress: this.billerStreetAddress,
                    billerCity: this.billerCity,
                    billerZipCode: this.billerZipCode,
                    billerCountry: this.billerCountry,
                    clientName: this.clientName,
                    clientEmail: this.clientEmail,
                    clientStreetAddress: this.clientStreetAddress,
                    clientCity: this.clientCity,
                    clientZipCode: this.clientZipCode,
                    clientCountry: this.clientCountry,
                    invoiceDateUnix: this.invoiceDateUnix,
                    invoiceDate: this.invoiceDate,
                    paymentTerms: this.paymentTerms,
                    paymentDueDateUnix: this.paymentDueDateUnix,
                    paymentDueDate: this.paymentDueDate,
                    productDescription: this.productDescription,
                    invoicePending: this.invoicePending,
                    invoiceDraft: this.invoiceDraft,
                    invoiceItemList: this.invoiceItemList,
                    invoiceTotal: this.invoiceTotal,
                }
            )

            // hide loading
            this.loading = false

            this.actionUpdateInvoice({
                docId: this.docId,
                routeId: this.$route.params.invoiceId,
            })
        },

        submitForm() {
            if (this.editInvoice) {
                this.updateInvoice()
                return
            }

            this.addInvoice()
        },
    },
    created() {
        if (!this.editInvoice) {
            this.invoiceDateUnix = Date.now()
            this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString('en-US', this.OptionDate)
        }

        if (this.editInvoice) {
            const data = this.invoiceArray[0]
            this.docId = data.docId
            this.invoiceId = data.invoiceId
            this.billerStreetAddress = data.billerStreetAddress
            this.billerCity = data.billerCity
            this.billerZipCode = data.billerZipCode
            this.billerCountry = data.billerCountry
            this.clientName = data.clientName
            this.clientEmail = data.clientEmail
            this.clientStreetAddress = data.clientStreetAddress
            this.clientCity = data.clientCity
            this.clientZipCode = data.clientZipCode
            this.clientCountry = data.clientCountry
            this.invoiceDateUnix = data.invoiceDateUnix
            this.invoiceDate = data.invoiceDate
            this.paymentTerms = data.paymentTerms
            this.paymentDueDateUnix = data.paymentDueDateUnix
            this.paymentDueDate = data.paymentDueDate
            this.productDescription = data.productDescription
            this.invoicePending = data.invoicePending
            this.invoiceDraft = data.invoiceDraft
            this.invoiceItemList = data.invoiceItemList
            this.invoiceTotal = data.invoiceTotal
        }
    },
    computed: {
        ...mapState(['editInvoice', 'invoiceArray'])
    },
    watch: {
        paymentTerms() {
            const dateNow = new Date();
            this.paymentDueDateUnix = dateNow.setDate(dateNow.getDate() + parseInt(this.paymentTerms))
            this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleDateString('en-US', this.OptionDate)
        }
    }
}
</script>

<style lang="scss" scoped>
.invoice-wrap  {
    position: fixed;
    top: 0;
    left: 0;
    background-color: transparent;
    width: 100%;
    height: 100vh;
    overflow: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
    @media (min-width: 900px) {
        left: 90px;
    }

    .invoice-content {
        position: relative;
        padding: 56px;
        max-width: 700px;
        width: 100%;
        background-color: #141625;
        color: #FFF;
        box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

        .bill-from,
        .bill-to {
            margin-bottom: 48px;

            .location-details {
                gap: 16px;

                div {
                    flex: 1;
                }
            }
        }

        .invoice-work {
            .payment {
                gap: 24px;

                div {
                    flex: 1;
                }
            }
        }

        .work-items {
            .item-list {
                width: 100%;

                .table-heading, 
                .table-items {
                    gap: 16px;
                    font-size: 12px;

                    .item-name {
                        flex-basis: 50%;
                    }
                    .qty {
                        flex-basis: 10%;
                    }
                    .price {
                        flex-basis: 20%;
                    }
                    .total {
                        flex-basis: 20%;
                        align-self: center;
                    }
                }

                .table-heading {
                    margin-bottom: 16px;

                    th {
                        text-align: left;
                    }
                }

                .table-items {
                    position: relative;
                    margin-bottom: 24px;

                    img {
                        position: absolute;
                        top: 15px;
                        right: 0;
                        width: 12px;
                        height: 16px;
                    }
                }
            }

            .button {
                color: #FFF;
                background-color: #252945;
                align-items: center;
                justify-content: center;
                width: 100%;

                img {
                    margin-right: 4px;
                }
            }
        }

        .save {
            margin-top: 60px;
            
            div {
                flex: 1;
            }

            .right {
                justify-content: flex-end;
            }
        }
    }

    h1 {
        margin-bottom: 40px;
        color: #FFF;
    }

    h3 {
        margin-bottom: 16px;
        font-size: 18px;
        color: #777F98;
    }

    h4 {
        color: #7C5DFA;
        font-size: 12px;
        margin-bottom: 24px;
    }

    .input {
        margin-bottom: 24px;
    }

    label {
        font-size: 12px;
        margin-bottom: 10px;
    }

    input, 
    select {
        width: 100%;
        background-color: #1E2139;
        color: #FFF;
        border-radius: 10px;
        padding: 12px 4px;
        border: none;
        &:hover {
            outline: none;
        }
    }
}
</style>