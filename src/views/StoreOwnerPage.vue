<template>
  <v-container class="py-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="32" color="primary" class="mr-3">mdi-store</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold">Store Owner Dashboard</h1>
              <p class="text-body-1 text-grey-darken-1 mt-1">
                Manage your store and products
              </p>
            </div>
          </div>
          <v-btn
            color="primary"
            @click="refreshData"
            :loading="loading"
            prepend-icon="mdi-refresh"
          >
            Refresh Data
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Store Stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" color="primary" dark>
          <v-icon size="48" class="mb-3">mdi-currency-usd</v-icon>
          <h2 class="text-h4 font-weight-bold">${{ stats.totalRevenue }}</h2>
          <p class="text-body-1">Total Revenue</p>
          <div class="text-caption mt-2">
            <v-icon size="16" class="mr-1">mdi-trending-up</v-icon>
            +{{ stats.revenueGrowth }}% this month
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" color="success" dark>
          <v-icon size="48" class="mb-3">mdi-package-variant</v-icon>
          <h2 class="text-h4 font-weight-bold">{{ stats.totalOrders }}</h2>
          <p class="text-body-1">Total Orders</p>
          <div class="text-caption mt-2">
            <v-icon size="16" class="mr-1">mdi-trending-up</v-icon>
            +{{ stats.orderGrowth }}% this month
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" color="info" dark>
          <v-icon size="48" class="mb-3">mdi-store</v-icon>
          <h2 class="text-h4 font-weight-bold">{{ stats.totalProducts }}</h2>
          <p class="text-body-1">Active Products</p>
          <div class="text-caption mt-2">
            <v-icon size="16" class="mr-1">mdi-trending-up</v-icon>
            +{{ stats.productGrowth }}% this month
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" color="warning" dark>
          <v-icon size="48" class="mb-3">mdi-star</v-icon>
          <h2 class="text-h4 font-weight-bold">{{ stats.avgRating }}</h2>
          <p class="text-body-1">Average Rating</p>
          <div class="text-caption mt-2">
            <v-icon size="16" class="mr-1">mdi-star</v-icon>
            {{ stats.totalReviews }} reviews
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Store Owner Navigation -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card variant="outlined" class="mb-6">
          <v-list>
            <v-list-item
              v-for="section in storeSections"
              :key="section.id"
              :active="activeSection === section.id"
              @click="activeSection = section.id"
              :prepend-icon="section.icon"
            >
              <v-list-item-title>{{ section.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Store Content -->
      <v-col cols="12" md="9">
        <!-- Products Management -->
        <v-card v-if="activeSection === 'products'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-store</v-icon>
              <span class="text-h5">Products Management</span>
            </div>
            <v-btn
              color="primary"
              @click="showAddProductDialog = true"
              prepend-icon="mdi-plus"
            >
              Add Product
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="productHeaders"
              :items="products"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.image="{ item }">
                <v-avatar size="40">
                  <v-img :src="item.image" :alt="item.name"></v-img>
                </v-avatar>
              </template>
              <template v-slot:item.price="{ item }">
                ${{ item.price }}
              </template>
              <template v-slot:item.stock="{ item }">
                <v-chip
                  :color="item.stock > 10 ? 'success' : item.stock > 0 ? 'warning' : 'error'"
                  size="small"
                  variant="tonal"
                >
                  {{ item.stock }}
                </v-chip>
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="item.status === 'active' ? 'success' : 'error'"
                  size="small"
                  variant="tonal"
                >
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editProduct(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteProduct(item.id)"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <!-- Orders Management -->
        <v-card v-if="activeSection === 'orders'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-package-variant</v-icon>
            <span class="text-h5">Orders Management</span>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="orderHeaders"
              :items="orders"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.total="{ item }">
                ${{ item.total }}
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getOrderStatusColor(item.status)"
                  size="small"
                  variant="tonal"
                >
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewOrder(item.id)"
                ></v-btn>
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editOrder(item)"
                ></v-btn>
                <v-btn
                  v-if="item.status === 'Pending'"
                  icon="mdi-check"
                  size="small"
                  variant="text"
                  color="success"
                  @click="approveOrder(item.id)"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <!-- Store Analytics -->
        <v-card v-if="activeSection === 'analytics'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            <span class="text-h5">Store Analytics</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="text-h6 mb-3">Sales Overview</h3>
                <v-card variant="outlined" class="pa-4">
                  <div class="text-center">
                    <v-icon size="48" color="success" class="mb-3">mdi-chart-line</v-icon>
                    <h2 class="text-h4 font-weight-bold">${{ analytics.monthlySales }}</h2>
                    <p class="text-body-1">Monthly Sales</p>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <h3 class="text-h6 mb-3">Top Products</h3>
                <v-list>
                  <v-list-item
                    v-for="product in analytics.topProducts"
                    :key="product.id"
                  >
                    <template v-slot:prepend>
                      <v-avatar size="40">
                        <v-img :src="product.image" :alt="product.name"></v-img>
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ product.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ product.sales }} sales</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Store Settings -->
        <v-card v-if="activeSection === 'settings'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-store-settings</v-icon>
            <span class="text-h5">Store Settings</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="storeForm" v-model="storeFormValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="storeForm.name"
                    label="Store Name"
                    variant="outlined"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="storeForm.email"
                    label="Store Email"
                    type="email"
                    variant="outlined"
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="storeForm.description"
                    label="Store Description"
                    variant="outlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="storeForm.phone"
                    label="Store Phone"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="storeForm.website"
                    label="Store Website"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="storeForm.address"
                    label="Store Address"
                    variant="outlined"
                    rows="2"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-btn
                color="primary"
                @click="updateStoreSettings"
                :loading="saving"
                :disabled="!storeFormValid"
              >
                Update Store Settings
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Reviews Management -->
        <v-card v-if="activeSection === 'reviews'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-star</v-icon>
            <span class="text-h5">Reviews Management</span>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="review in reviews"
                :key="review.id"
                class="mb-4"
              >
                <template v-slot:prepend>
                  <v-avatar size="50">
                    <v-img :src="review.userAvatar" :alt="review.userName"></v-img>
                  </v-avatar>
                </template>
                <v-list-item-title class="d-flex align-center">
                  {{ review.userName }}
                  <v-rating
                    :model-value="review.rating"
                    readonly
                    density="compact"
                    size="small"
                    color="amber"
                    class="ml-2"
                  ></v-rating>
                </v-list-item-title>
                <v-list-item-subtitle class="mb-2">
                  {{ review.productName }} • {{ formatDate(review.date) }}
                </v-list-item-subtitle>
                <div class="text-body-2">{{ review.comment }}</div>
                <template v-slot:append>
                  <v-btn
                    v-if="!review.replied"
                    variant="outlined"
                    size="small"
                    @click="replyToReview(review.id)"
                  >
                    Reply
                  </v-btn>
                  <v-chip
                    v-else
                    color="success"
                    size="small"
                    variant="tonal"
                  >
                    Replied
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Product Dialog -->
    <v-dialog v-model="showAddProductDialog" max-width="600">
      <v-card>
        <v-card-title>Add New Product</v-card-title>
        <v-card-text>
          <v-form ref="productForm" v-model="productFormValid">
            <v-text-field
              v-model="productForm.name"
              label="Product Name"
              variant="outlined"
              :rules="[rules.required]"
            ></v-text-field>
            <v-textarea
              v-model="productForm.description"
              label="Description"
              variant="outlined"
              rows="3"
              :rules="[rules.required]"
            ></v-textarea>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="productForm.price"
                  label="Price"
                  type="number"
                  variant="outlined"
                  :rules="[rules.required, rules.positive]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="productForm.stock"
                  label="Stock"
                  type="number"
                  variant="outlined"
                  :rules="[rules.required, rules.positive]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-select
              v-model="productForm.category"
              :items="categoryOptions"
              label="Category"
              variant="outlined"
              :rules="[rules.required]"
            ></v-select>
            <v-file-input
              v-model="productForm.image"
              label="Product Image"
              variant="outlined"
              accept="image/*"
              prepend-icon="mdi-camera"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showAddProductDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="addProduct"
            :loading="saving"
            :disabled="!productFormValid"
          >
            Add Product
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'StoreOwnerPage',
  data() {
    return {
      loading: false,
      saving: false,
      activeSection: 'products',
      showAddProductDialog: false,
      
      // Form validation
      productFormValid: false,
      storeFormValid: false,
      
      // Store sections
      storeSections: [
        { id: 'products', title: 'Products', icon: 'mdi-store' },
        { id: 'orders', title: 'Orders', icon: 'mdi-package-variant' },
        { id: 'analytics', title: 'Analytics', icon: 'mdi-chart-line' },
        { id: 'settings', title: 'Store Settings', icon: 'mdi-store-settings' },
        { id: 'reviews', title: 'Reviews', icon: 'mdi-star' }
      ],
      
      // Stats
      stats: {
        totalRevenue: '12,450',
        revenueGrowth: 15,
        totalOrders: 234,
        orderGrowth: 8,
        totalProducts: 45,
        productGrowth: 12,
        avgRating: 4.2,
        totalReviews: 89
      },
      
      // Table headers
      productHeaders: [
        { title: 'Image', key: 'image', sortable: false },
        { title: 'Name', key: 'name' },
        { title: 'Category', key: 'category' },
        { title: 'Price', key: 'price' },
        { title: 'Stock', key: 'stock' },
        { title: 'Status', key: 'status' },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      orderHeaders: [
        { title: 'Order ID', key: 'id' },
        { title: 'Customer', key: 'customer' },
        { title: 'Total', key: 'total' },
        { title: 'Status', key: 'status' },
        { title: 'Date', key: 'date' },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      
      // Mock data
      products: [
        {
          id: 1,
          name: 'Wireless Headphones',
          category: 'Electronics',
          price: 89.99,
          stock: 25,
          status: 'active',
          image: 'https://via.placeholder.com/40x40/2196F3/FFFFFF?text=H'
        },
        {
          id: 2,
          name: 'Smartphone Case',
          category: 'Accessories',
          price: 19.99,
          stock: 50,
          status: 'active',
          image: 'https://via.placeholder.com/40x40/4CAF50/FFFFFF?text=C'
        }
      ],
      orders: [
        {
          id: 'ORD-12345',
          customer: 'John Doe',
          total: 299.99,
          status: 'Pending',
          date: '2024-01-15'
        },
        {
          id: 'ORD-12344',
          customer: 'Jane Smith',
          total: 149.99,
          status: 'Shipped',
          date: '2024-01-14'
        }
      ],
      analytics: {
        monthlySales: '8,230',
        topProducts: [
          {
            id: 1,
            name: 'Wireless Headphones',
            sales: 23,
            image: 'https://via.placeholder.com/40x40/2196F3/FFFFFF?text=H'
          },
          {
            id: 2,
            name: 'Smartphone Case',
            sales: 18,
            image: 'https://via.placeholder.com/40x40/4CAF50/FFFFFF?text=C'
          }
        ]
      },
      reviews: [
        {
          id: 1,
          userName: 'John Doe',
          userAvatar: 'https://via.placeholder.com/50x50/2196F3/FFFFFF?text=J',
          productName: 'Wireless Headphones',
          rating: 5,
          comment: 'Great quality headphones! Very comfortable and the sound is amazing.',
          date: '2024-01-15',
          replied: false
        },
        {
          id: 2,
          userName: 'Jane Smith',
          userAvatar: 'https://via.placeholder.com/50x50/4CAF50/FFFFFF?text=J',
          productName: 'Smartphone Case',
          rating: 4,
          comment: 'Good case, fits perfectly. Would recommend.',
          date: '2024-01-14',
          replied: true
        }
      ],
      
      // Forms
      productForm: {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image: null
      },
      storeForm: {
        name: 'My Awesome Store',
        email: 'store@example.com',
        description: 'A great store with amazing products',
        phone: '+1 (555) 123-4567',
        website: 'https://mystore.com',
        address: '123 Main St, New York, NY 10001'
      },
      
      // Options
      categoryOptions: [
        'Electronics',
        'Clothing',
        'Home & Garden',
        'Books',
        'Sports',
        'Accessories'
      ],
      
      // Validation rules
      rules: {
        required: v => !!v || 'This field is required',
        email: v => /.+@.+\..+/.test(v) || 'Please enter a valid email',
        positive: v => v > 0 || 'Value must be positive'
      }
    }
  },
  
  mounted() {
    this.loadData()
  },
  
  methods: {
    ...mapActions(['showNotification']),
    
    async loadData() {
      this.loading = true
      
      try {
        // In a real app, this would load data from API
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to load data'
        })
      } finally {
        this.loading = false
      }
    },
    
    async refreshData() {
      await this.loadData()
      this.showNotification({
        type: 'success',
        message: 'Data refreshed successfully'
      })
    },
    
    getOrderStatusColor(status) {
      const colors = {
        'Pending': 'warning',
        'Processing': 'info',
        'Shipped': 'primary',
        'Delivered': 'success',
        'Cancelled': 'error'
      }
      return colors[status] || 'grey'
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    editProduct(product) {
      // In a real app, this would open an edit dialog
      console.log('Edit product:', product)
    },
    
    async deleteProduct(productId) {
      try {
        const confirmed = await this.$confirm(
          'Are you sure you want to delete this product?',
          'Delete Product',
          {
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'warning'
          }
        )
        
        if (confirmed) {
          // In a real app, this would call the API
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          this.products = this.products.filter(product => product.id !== productId)
          
          this.showNotification({
            type: 'success',
            message: 'Product deleted successfully'
          })
        }
      } catch (error) {
        // User cancelled
      }
    },
    
    async addProduct() {
      this.saving = true
      
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newProduct = {
          id: Date.now(),
          name: this.productForm.name,
          category: this.productForm.category,
          price: parseFloat(this.productForm.price),
          stock: parseInt(this.productForm.stock),
          status: 'active',
          image: `https://via.placeholder.com/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${this.productForm.name.charAt(0)}`
        }
        
        this.products.push(newProduct)
        
        this.showNotification({
          type: 'success',
          message: 'Product added successfully'
        })
        
        this.showAddProductDialog = false
        this.productForm = { name: '', description: '', price: '', stock: '', category: '', image: null }
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to add product'
        })
      } finally {
        this.saving = false
      }
    },
    
    viewOrder(orderId) {
      this.$router.push(`/store-owner/orders/${orderId}`)
    },
    
    editOrder(order) {
      // In a real app, this would open an edit dialog
      console.log('Edit order:', order)
    },
    
    async approveOrder(orderId) {
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const order = this.orders.find(o => o.id === orderId)
        if (order) {
          order.status = 'Processing'
        }
        
        this.showNotification({
          type: 'success',
          message: 'Order approved successfully'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to approve order'
        })
      }
    },
    
    async updateStoreSettings() {
      this.saving = true
      
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showNotification({
          type: 'success',
          message: 'Store settings updated successfully'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update store settings'
        })
      } finally {
        this.saving = false
      }
    },
    
    replyToReview(reviewId) {
      // In a real app, this would open a reply dialog
      console.log('Reply to review:', reviewId)
      this.showNotification({
        type: 'info',
        message: 'Reply dialog will open'
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