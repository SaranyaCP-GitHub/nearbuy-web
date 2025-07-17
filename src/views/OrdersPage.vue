<template>
  <v-container class="py-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="32" color="primary" class="mr-3">mdi-package-variant</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold">My Orders</h1>
              <p class="text-body-1 text-grey-darken-1 mt-1">
                Track your orders and view order history
              </p>
            </div>
          </div>
          <v-btn
            color="primary"
            @click="$router.push('/shop')"
            prepend-icon="mdi-shopping"
          >
            Continue Shopping
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Filters and Search -->
    <v-card class="mb-6" variant="outlined">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filters.status"
              :items="statusOptions"
              label="Order Status"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filters.timeRange"
              :items="timeRangeOptions"
              label="Time Range"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="filters.search"
              label="Search Orders"
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-magnify"
              placeholder="Order number, product name..."
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3" class="text-right">
            <v-btn
              variant="outlined"
              @click="clearFilters"
              prepend-icon="mdi-filter-remove"
            >
              Clear Filters
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Orders List -->
    <div v-if="filteredOrders.length > 0">
      <v-card
        v-for="order in paginatedOrders"
        :key="order.id"
        class="mb-4"
        variant="outlined"
      >
        <!-- Order Header -->
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <h3 class="text-h6">{{ order.orderNumber }}</h3>
            <p class="text-caption text-grey-darken-1 mt-1">
              Placed on {{ formatDate(order.orderDate) }}
            </p>
          </div>
          <div class="text-right">
            <div class="text-h6 font-weight-bold primary--text">
              ${{ order.totalAmount }}
            </div>
            <v-chip
              :color="getStatusColor(order.status)"
              size="small"
              variant="tonal"
              class="mt-1"
            >
              {{ order.status }}
            </v-chip>
          </div>
        </v-card-title>

        <!-- Order Items -->
        <v-card-text class="pt-0">
          <v-list>
            <v-list-item
              v-for="item in order.items"
              :key="item.id"
              class="px-0"
            >
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

        <!-- Order Actions -->
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="viewOrderDetails(order.id)"
            prepend-icon="mdi-eye"
          >
            View Details
          </v-btn>
          <v-btn
            v-if="order.status === 'Delivered'"
            variant="outlined"
            @click="writeReview(order.id)"
            prepend-icon="mdi-star"
          >
            Write Review
          </v-btn>
          <v-btn
            v-if="order.status === 'Shipped'"
            variant="outlined"
            @click="trackOrder(order.trackingNumber)"
            prepend-icon="mdi-truck-delivery"
          >
            Track Order
          </v-btn>
          <v-btn
            v-if="canReorder(order)"
            color="primary"
            @click="reorder(order)"
            prepend-icon="mdi-cart-plus"
          >
            Reorder
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Pagination -->
      <v-row v-if="totalPages > 1" justify="center" class="mt-6">
        <v-col cols="12" class="text-center">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            @update:model-value="handlePageChange"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>

    <!-- Empty State -->
    <v-row v-else justify="center">
      <v-col cols="12" md="6" class="text-center">
        <v-card class="pa-8" variant="outlined">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-package-variant-closed</v-icon>
          <h2 class="text-h5 mb-3">No orders found</h2>
          <p class="text-body-1 text-grey-darken-1 mb-6">
            {{ filters.status !== 'all' || filters.search 
              ? 'No orders match your current filters. Try adjusting your search criteria.'
              : 'You haven\'t placed any orders yet. Start shopping to see your order history here.' }}
          </p>
          <v-btn
            color="primary"
            size="large"
            @click="$router.push('/shop')"
            prepend-icon="mdi-shopping"
          >
            Start Shopping
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading" justify="center">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-body-1 mt-4">Loading orders...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'OrdersPage',
  data() {
    return {
      loading: false,
      currentPage: 1,
      itemsPerPage: 10,
      filters: {
        status: 'all',
        timeRange: 'all',
        search: ''
      },
      statusOptions: [
        { title: 'All Orders', value: 'all' },
        { title: 'Pending', value: 'pending' },
        { title: 'Processing', value: 'processing' },
        { title: 'Shipped', value: 'shipped' },
        { title: 'Delivered', value: 'delivered' },
        { title: 'Cancelled', value: 'cancelled' }
      ],
      timeRangeOptions: [
        { title: 'All Time', value: 'all' },
        { title: 'Last 30 Days', value: '30' },
        { title: 'Last 3 Months', value: '90' },
        { title: 'Last 6 Months', value: '180' },
        { title: 'Last Year', value: '365' }
      ],
      orders: [
        {
          id: 1,
          orderNumber: 'ORD-12345',
          orderDate: '2024-01-15',
          totalAmount: 299.99,
          status: 'Delivered',
          trackingNumber: 'TRK-123456789',
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
        },
        {
          id: 2,
          orderNumber: 'ORD-12344',
          orderDate: '2024-01-10',
          totalAmount: 149.99,
          status: 'Shipped',
          trackingNumber: 'TRK-987654321',
          items: [
            {
              id: 4,
              name: 'Laptop Stand',
              price: 49.99,
              quantity: 1,
              image: 'https://via.placeholder.com/60x60/9C27B0/FFFFFF?text=L'
            },
            {
              id: 5,
              name: 'Wireless Mouse',
              price: 29.99,
              quantity: 2,
              image: 'https://via.placeholder.com/60x60/607D8B/FFFFFF?text=M'
            }
          ]
        },
        {
          id: 3,
          orderNumber: 'ORD-12343',
          orderDate: '2024-01-05',
          totalAmount: 89.99,
          status: 'Processing',
          trackingNumber: null,
          items: [
            {
              id: 6,
              name: 'Mechanical Keyboard',
              price: 89.99,
              quantity: 1,
              image: 'https://via.placeholder.com/60x60/795548/FFFFFF?text=K'
            }
          ]
        }
      ]
    }
  },
  
  computed: {
    ...mapGetters(['getUser']),
    
    filteredOrders() {
      let filtered = [...this.orders]
      
      // Filter by status
      if (this.filters.status !== 'all') {
        filtered = filtered.filter(order => 
          order.status.toLowerCase() === this.filters.status
        )
      }
      
      // Filter by time range
      if (this.filters.timeRange !== 'all') {
        const days = parseInt(this.filters.timeRange)
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)
        
        filtered = filtered.filter(order => 
          new Date(order.orderDate) >= cutoffDate
        )
      }
      
      // Filter by search
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase()
        filtered = filtered.filter(order =>
          order.orderNumber.toLowerCase().includes(searchTerm) ||
          order.items.some(item => 
            item.name.toLowerCase().includes(searchTerm)
          )
        )
      }
      
      return filtered
    },
    
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredOrders.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage)
    }
  },
  
  mounted() {
    this.loadOrders()
  },
  
  methods: {
    ...mapActions(['addToCart', 'showNotification']),
    
    async loadOrders() {
      this.loading = true
      
      try {
        // In a real app, this would load orders from the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Orders are already loaded in data for demo
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to load orders'
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
    
    viewOrderDetails(orderId) {
      this.$router.push(`/orders/${orderId}`)
    },
    
    writeReview(orderId) {
      this.$router.push(`/orders/${orderId}/review`)
    },
    
    trackOrder(trackingNumber) {
      if (trackingNumber) {
        // In a real app, this would open tracking in a new window
        window.open(`https://tracking.example.com/${trackingNumber}`, '_blank')
      } else {
        this.showNotification({
          type: 'info',
          message: 'Tracking information not available yet'
        })
      }
    },
    
    canReorder(order) {
      // Can reorder if order is delivered or cancelled
      return ['Delivered', 'Cancelled'].includes(order.status)
    },
    
    async reorder(order) {
      try {
        // Add all items from the order to cart
        for (const item of order.items) {
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
    
    clearFilters() {
      this.filters = {
        status: 'all',
        timeRange: 'all',
        search: ''
      }
      this.currentPage = 1
    },
    
    handlePageChange(page) {
      this.currentPage = page
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' })
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