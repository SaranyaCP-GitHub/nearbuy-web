<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <!-- Success Card -->
        <v-card class="text-center pa-6 mb-6" color="success" dark>
          <v-icon size="64" class="mb-4">mdi-check-circle</v-icon>
          <h1 class="text-h4 mb-2">Order Confirmed!</h1>
          <p class="text-body-1">Thank you for your purchase. Your order has been successfully placed.</p>
        </v-card>

        <!-- Order Details -->
        <v-card class="mb-6">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-receipt</v-icon>
            Order Details
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <div class="text-caption text-grey">Order Number</div>
                <div class="text-body-1 font-weight-medium">{{ orderNumber }}</div>
              </v-col>
              <v-col cols="6">
                <div class="text-caption text-grey">Order Date</div>
                <div class="text-body-1">{{ orderDate }}</div>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="6">
                <div class="text-caption text-grey">Total Amount</div>
                <div class="text-h6 font-weight-bold primary--text">${{ totalAmount }}</div>
              </v-col>
              <v-col cols="6">
                <div class="text-caption text-grey">Payment Method</div>
                <div class="text-body-1">{{ paymentMethod }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Shipping Information -->
        <v-card class="mb-6">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-truck-delivery</v-icon>
            Shipping Information
          </v-card-title>
          <v-card-text>
            <div class="mb-3">
              <div class="text-caption text-grey">Delivery Address</div>
              <div class="text-body-1">{{ shippingAddress }}</div>
            </div>
            <div class="mb-3">
              <div class="text-caption text-grey">Estimated Delivery</div>
              <div class="text-body-1">{{ estimatedDelivery }}</div>
            </div>
            <div>
              <div class="text-caption text-grey">Tracking Number</div>
              <div class="text-body-1 font-weight-medium">{{ trackingNumber }}</div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Order Items -->
        <v-card class="mb-6">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-package-variant</v-icon>
            Order Items
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="item in orderItems" :key="item.id" class="px-0">
                <template v-slot:prepend>
                  <v-avatar size="60" class="mr-3">
                    <v-img :src="item.image" :alt="item.name"></v-img>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-1 font-weight-medium">
                  {{ item.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  Quantity: {{ item.quantity }} × ${{ item.price }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <div class="text-body-1 font-weight-medium">
                    ${{ (item.quantity * item.price).toFixed(2) }}
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Action Buttons -->
        <v-card>
          <v-card-text class="text-center">
            <v-row>
              <v-col cols="12" sm="6">
                <v-btn
                  block
                  color="primary"
                  size="large"
                  @click="viewOrderDetails"
                  class="mb-3"
                >
                  <v-icon class="mr-2">mdi-eye</v-icon>
                  View Order Details
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  block
                  variant="outlined"
                  size="large"
                  @click="continueShopping"
                  class="mb-3"
                >
                  <v-icon class="mr-2">mdi-shopping</v-icon>
                  Continue Shopping
                </v-btn>
              </v-col>
            </v-row>
            <v-btn
              block
              variant="text"
              @click="downloadReceipt"
              class="mt-3"
            >
              <v-icon class="mr-2">mdi-download</v-icon>
              Download Receipt
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Additional Information -->
        <v-alert
          type="info"
          variant="tonal"
          class="mt-6"
        >
          <template v-slot:prepend>
            <v-icon>mdi-information</v-icon>
          </template>
          <div class="text-body-2">
            <strong>What's next?</strong><br>
            You'll receive an email confirmation with your order details. 
            We'll notify you when your order ships and provide tracking information.
          </div>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'OrderConfirmationPage',
  data() {
    return {
      orderNumber: '',
      orderDate: '',
      totalAmount: 0,
      paymentMethod: '',
      shippingAddress: '',
      estimatedDelivery: '',
      trackingNumber: '',
      orderItems: []
    }
  },
  computed: {
    ...mapGetters(['getLastOrder'])
  },
  mounted() {
    this.loadOrderDetails()
  },
  methods: {
    loadOrderDetails() {
      // Get order details from route params or store
      const orderId = this.$route.params.orderId
      
      if (orderId) {
        // Load order from store or API
        const order = this.getLastOrder || this.getMockOrderData()
        this.populateOrderData(order)
      } else {
        // Fallback to mock data
        this.populateOrderData(this.getMockOrderData())
      }
    },
    
    populateOrderData(order) {
      this.orderNumber = order.orderNumber
      this.orderDate = order.orderDate
      this.totalAmount = order.totalAmount
      this.paymentMethod = order.paymentMethod
      this.shippingAddress = order.shippingAddress
      this.estimatedDelivery = order.estimatedDelivery
      this.trackingNumber = order.trackingNumber
      this.orderItems = order.items
    },
    
    getMockOrderData() {
      return {
        orderNumber: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        orderDate: new Date().toLocaleDateString(),
        totalAmount: 299.99,
        paymentMethod: 'Credit Card (**** **** **** 1234)',
        shippingAddress: '123 Main St, Apt 4B, New York, NY 10001',
        estimatedDelivery: '3-5 business days',
        trackingNumber: 'TRK-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        items: [
          {
            id: 1,
            name: 'Wireless Bluetooth Headphones',
            price: 89.99,
            quantity: 2,
            image: 'https://via.placeholder.com/60x60/2196F3/FFFFFF?text=H'
          },
          {
            id: 2,
            name: 'Smartphone Case',
            price: 19.99,
            quantity: 1,
            image: 'https://via.placeholder.com/60x60/4CAF50/FFFFFF?text=C'
          },
          {
            id: 3,
            name: 'USB-C Charging Cable',
            price: 12.99,
            quantity: 3,
            image: 'https://via.placeholder.com/60x60/FF9800/FFFFFF?text=U'
          }
        ]
      }
    },
    
    viewOrderDetails() {
      this.$router.push(`/orders/${this.orderNumber}`)
    },
    
    continueShopping() {
      this.$router.push('/shop')
    },
    
    downloadReceipt() {
      // Generate and download receipt PDF
      const receiptData = {
        orderNumber: this.orderNumber,
        orderDate: this.orderDate,
        totalAmount: this.totalAmount,
        items: this.orderItems
      }
      
      // In a real app, this would generate a PDF
      console.log('Downloading receipt:', receiptData)
      
      // Show success message
      this.$store.dispatch('showNotification', {
        type: 'success',
        message: 'Receipt downloaded successfully!'
      })
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.v-btn {
  border-radius: 8px;
}
</style> 