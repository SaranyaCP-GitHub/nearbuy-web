<template>
  <v-container class="py-6">
    <!-- Loading State -->
    <v-row v-if="loading" justify="center">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-body-1 mt-4">Loading order details...</p>
      </v-col>
    </v-row>

    <!-- Order Details -->
    <div v-else-if="order">
      <!-- Page Header -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-btn
                icon
                variant="text"
                @click="$router.go(-1)"
                class="mr-3"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <div>
                <h1 class="text-h4 font-weight-bold">Order Details</h1>
                <p class="text-body-1 text-grey-darken-1 mt-1">
                  Order #{{ order.orderNumber }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <v-chip
                :color="getStatusColor(order.status)"
                size="large"
                variant="tonal"
              >
                {{ order.status }}
              </v-chip>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <!-- Main Content -->
        <v-col cols="12" lg="8">
          <!-- Order Items -->
          <v-card class="mb-6" variant="outlined">
            <v-card-title class="text-h5">
              <v-icon class="mr-2">mdi-package-variant</v-icon>
              Order Items
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="item in order.items"
                  :key="item.id"
                  class="px-0"
                >
                  <template v-slot:prepend>
                    <v-avatar size="80" class="mr-4">
                      <v-img :src="item.image" :alt="item.name"></v-img>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-h6 font-weight-medium mb-2">
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 mb-2">
                    SKU: {{ item.sku || 'N/A' }}
                  </v-list-item-subtitle>
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <span class="text-body-1">Quantity: {{ item.quantity }}</span>
                      <span class="text-body-1 ml-4">Price: ${{ item.price }}</span>
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ${{ (item.quantity * item.price).toFixed(2) }}
                    </div>
                  </div>
                  <template v-slot:append>
                    <v-btn
                      variant="outlined"
                      size="small"
                      @click="viewProduct(item.productId)"
                    >
                      View Product
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- Order Timeline -->
          <v-card class="mb-6" variant="outlined">
            <v-card-title class="text-h5">
              <v-icon class="mr-2">mdi-timeline</v-icon>
              Order Timeline
            </v-card-title>
            <v-card-text>
              <v-timeline density="compact" align="start">
                <v-timeline-item
                  v-for="(event, index) in order.timeline"
                  :key="index"
                  :dot-color="getTimelineColor(event.status)"
                  size="small"
                >
                  <div class="d-flex justify-space-between align-start">
                    <div>
                      <h4 class="text-body-1 font-weight-medium">{{ event.title }}</h4>
                      <p class="text-caption text-grey-darken-1">{{ event.description }}</p>
                    </div>
                    <span class="text-caption text-grey-darken-1">{{ formatDateTime(event.timestamp) }}</span>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>

          <!-- Shipping Information -->
          <v-card class="mb-6" variant="outlined">
            <v-card-title class="text-h5">
              <v-icon class="mr-2">mdi-truck-delivery</v-icon>
              Shipping Information
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <h4 class="text-body-1 font-weight-medium mb-2">Shipping Address</h4>
                  <div class="text-body-2">
                    <p>{{ order.shippingAddress.name }}</p>
                    <p>{{ order.shippingAddress.street }}</p>
                    <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}</p>
                    <p>{{ order.shippingAddress.country }}</p>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <h4 class="text-body-1 font-weight-medium mb-2">Shipping Method</h4>
                  <p class="text-body-2">{{ order.shippingMethod }}</p>
                  <p class="text-body-2">Estimated Delivery: {{ order.estimatedDelivery }}</p>
                  <div v-if="order.trackingNumber" class="mt-3">
                    <h4 class="text-body-1 font-weight-medium mb-2">Tracking Number</h4>
                    <div class="d-flex align-center">
                      <v-text-field
                        :model-value="order.trackingNumber"
                        readonly
                        variant="outlined"
                        density="compact"
                        class="mr-2"
                      ></v-text-field>
                      <v-btn
                        color="primary"
                        @click="trackOrder(order.trackingNumber)"
                        prepend-icon="mdi-truck-delivery"
                      >
                        Track
                      </v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" lg="4">
          <!-- Order Summary -->
          <v-card class="mb-6" variant="outlined">
            <v-card-title class="text-h5">
              <v-icon class="mr-2">mdi-receipt</v-icon>
              Order Summary
            </v-card-title>
            <v-card-text>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">Order Number</span>
                <span class="text-body-1 font-weight-medium">{{ order.orderNumber }}</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">Order Date</span>
                <span class="text-body-1">{{ formatDate(order.orderDate) }}</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">Payment Method</span>
                <span class="text-body-1">{{ order.paymentMethod }}</span>
              </div>
              <v-divider class="my-3"></v-divider>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">Subtotal</span>
                <span class="text-body-1">${{ order.subtotal }}</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">Shipping</span>
                <span class="text-body-1">${{ order.shippingCost }}</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">Tax</span>
                <span class="text-body-1">${{ order.tax }}</span>
              </div>
              <v-divider class="my-3"></v-divider>
              <div class="d-flex justify-space-between">
                <span class="text-h6 font-weight-bold">Total</span>
                <span class="text-h6 font-weight-bold primary--text">${{ order.totalAmount }}</span>
              </div>
            </v-card-text>
          </v-card>

          <!-- Action Buttons -->
          <v-card class="mb-6" variant="outlined">
            <v-card-text>
              <v-btn
                block
                color="primary"
                @click="downloadInvoice"
                prepend-icon="mdi-download"
                class="mb-3"
              >
                Download Invoice
              </v-btn>
              <v-btn
                v-if="order.status === 'Delivered'"
                block
                variant="outlined"
                @click="writeReview"
                prepend-icon="mdi-star"
                class="mb-3"
              >
                Write Review
              </v-btn>
              <v-btn
                v-if="canReorder"
                block
                variant="outlined"
                @click="reorder"
                prepend-icon="mdi-cart-plus"
                class="mb-3"
              >
                Reorder
              </v-btn>
              <v-btn
                v-if="order.status === 'Pending'"
                block
                variant="outlined"
                color="error"
                @click="cancelOrder"
                prepend-icon="mdi-close"
              >
                Cancel Order
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Customer Support -->
          <v-card variant="outlined">
            <v-card-title class="text-h5">
              <v-icon class="mr-2">mdi-help-circle</v-icon>
              Need Help?
            </v-card-title>
            <v-card-text>
              <p class="text-body-2 mb-3">
                Questions about your order? Our customer support team is here to help.
              </p>
              <v-btn
                block
                variant="outlined"
                @click="contactSupport"
                prepend-icon="mdi-message"
                class="mb-2"
              >
                Contact Support
              </v-btn>
              <v-btn
                block
                variant="text"
                @click="viewFAQ"
                prepend-icon="mdi-help"
              >
                View FAQ
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Error State -->
    <v-row v-else-if="error" justify="center">
      <v-col cols="12" md="6" class="text-center">
        <v-card class="pa-8" variant="outlined">
          <v-icon size="80" color="error" class="mb-4">mdi-alert-circle</v-icon>
          <h2 class="text-h5 mb-3">Order Not Found</h2>
          <p class="text-body-1 text-grey-darken-1 mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <v-btn
            color="primary"
            @click="$router.push('/orders')"
            prepend-icon="mdi-arrow-left"
          >
            Back to Orders
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'OrderDetailPage',
  data() {
    return {
      loading: true,
      error: false,
      order: null
    }
  },
  
  computed: {
    canReorder() {
      return ['Delivered', 'Cancelled'].includes(this.order?.status)
    }
  },
  
  mounted() {
    this.loadOrderDetails()
  },
  
  methods: {
    ...mapActions(['addToCart', 'showNotification']),
    
    async loadOrderDetails() {
      this.loading = true
      this.error = false
      
      try {
        const orderId = this.$route.params.orderId
        
        // In a real app, this would fetch order details from API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock order data
        this.order = {
          id: orderId,
          orderNumber: `ORD-${orderId}`,
          orderDate: '2024-01-15',
          status: 'Shipped',
          totalAmount: 299.99,
          subtotal: 279.99,
          shippingCost: 15.00,
          tax: 5.00,
          paymentMethod: 'Credit Card (**** **** **** 1234)',
          shippingMethod: 'Express Shipping',
          estimatedDelivery: 'January 18, 2024',
          trackingNumber: 'TRK-123456789',
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          items: [
            {
              id: 1,
              productId: 1,
              name: 'Wireless Bluetooth Headphones',
              sku: 'WH-001',
              price: 89.99,
              quantity: 2,
              image: 'https://via.placeholder.com/80x80/2196F3/FFFFFF?text=H'
            },
            {
              id: 2,
              productId: 2,
              name: 'Smartphone Case',
              sku: 'SC-002',
              price: 19.99,
              quantity: 1,
              image: 'https://via.placeholder.com/80x80/4CAF50/FFFFFF?text=C'
            },
            {
              id: 3,
              productId: 3,
              name: 'USB-C Charging Cable',
              sku: 'UC-003',
              price: 12.99,
              quantity: 3,
              image: 'https://via.placeholder.com/80x80/FF9800/FFFFFF?text=U'
            }
          ],
          timeline: [
            {
              title: 'Order Placed',
              description: 'Your order has been successfully placed',
              status: 'completed',
              timestamp: '2024-01-15T10:30:00Z'
            },
            {
              title: 'Order Confirmed',
              description: 'We have confirmed your order and are preparing it for shipment',
              status: 'completed',
              timestamp: '2024-01-15T11:00:00Z'
            },
            {
              title: 'Order Shipped',
              description: 'Your order has been shipped and is on its way',
              status: 'completed',
              timestamp: '2024-01-16T14:30:00Z'
            },
            {
              title: 'Out for Delivery',
              description: 'Your package is out for delivery',
              status: 'current',
              timestamp: '2024-01-17T08:00:00Z'
            }
          ]
        }
      } catch (error) {
        this.error = true
        this.showNotification({
          type: 'error',
          message: 'Failed to load order details'
        })
      } finally {
        this.loading = false
      }
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    formatDateTime(dateString) {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    getStatusColor(status) {
      const colors = {
        'Pending': 'warning',
        'Processing': 'info',
        'Shipped': 'primary',
        'Delivered': 'success',
        'Cancelled': 'error'
      }
      return colors[status] || 'grey'
    },
    
    getTimelineColor(status) {
      const colors = {
        'completed': 'success',
        'current': 'primary',
        'pending': 'grey'
      }
      return colors[status] || 'grey'
    },
    
    viewProduct(productId) {
      this.$router.push(`/product/${productId}`)
    },
    
    trackOrder(trackingNumber) {
      if (trackingNumber) {
        window.open(`https://tracking.example.com/${trackingNumber}`, '_blank')
      } else {
        this.showNotification({
          type: 'info',
          message: 'Tracking information not available yet'
        })
      }
    },
    
    async downloadInvoice() {
      try {
        // In a real app, this would generate and download a PDF invoice
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showNotification({
          type: 'success',
          message: 'Invoice downloaded successfully!'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to download invoice'
        })
      }
    },
    
    writeReview() {
      this.$router.push(`/orders/${this.order.id}/review`)
    },
    
    async reorder() {
      try {
        // Add all items from the order to cart
        for (const item of this.order.items) {
          await this.addToCart({
            ...item,
            id: item.id // Ensure unique ID for cart
          })
        }
        
        this.showNotification({
          type: 'success',
          message: 'Items added to cart successfully!'
        })
        
        // Navigate to cart
        this.$router.push('/cart')
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to add items to cart'
        })
      }
    },
    
    async cancelOrder() {
      try {
        const confirmed = await this.$confirm(
          'Are you sure you want to cancel this order? This action cannot be undone.',
          'Cancel Order',
          {
            confirmText: 'Cancel Order',
            cancelText: 'Keep Order',
            type: 'warning'
          }
        )
        
        if (confirmed) {
          // In a real app, this would call the API to cancel the order
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          this.order.status = 'Cancelled'
          
          this.showNotification({
            type: 'success',
            message: 'Order cancelled successfully'
          })
        }
      } catch (error) {
        // User cancelled
      }
    },
    
    contactSupport() {
      // In a real app, this would open a support chat or contact form
      this.showNotification({
        type: 'info',
        message: 'Support chat will open in a new window'
      })
    },
    
    viewFAQ() {
      this.$router.push('/faq')
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