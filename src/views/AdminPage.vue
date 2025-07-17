<template>
  <v-container class="py-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="32" color="primary" class="mr-3">mdi-shield-crown</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold">Admin Dashboard</h1>
              <p class="text-body-1 text-grey-darken-1 mt-1">
                Manage your e-commerce platform
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

    <!-- Quick Stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" color="primary" dark>
          <v-icon size="48" class="mb-3">mdi-account-group</v-icon>
          <h2 class="text-h4 font-weight-bold">{{ stats.totalUsers }}</h2>
          <p class="text-body-1">Total Users</p>
          <div class="text-caption mt-2">
            <v-icon size="16" class="mr-1">mdi-trending-up</v-icon>
            +{{ stats.userGrowth }}% this month
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" color="success" dark>
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
        <v-card class="text-center pa-4" color="info" dark>
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
        <v-card class="text-center pa-4" color="warning" dark>
          <v-icon size="48" class="mb-3">mdi-store</v-icon>
          <h2 class="text-h4 font-weight-bold">{{ stats.totalProducts }}</h2>
          <p class="text-body-1">Total Products</p>
          <div class="text-caption mt-2">
            <v-icon size="16" class="mr-1">mdi-trending-up</v-icon>
            +{{ stats.productGrowth }}% this month
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Admin Navigation -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card variant="outlined" class="mb-6">
          <v-list>
            <v-list-item
              v-for="section in adminSections"
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

      <!-- Admin Content -->
      <v-col cols="12" md="9">
        <!-- Users Management -->
        <v-card v-if="activeSection === 'users'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-account-group</v-icon>
              <span class="text-h5">Users Management</span>
            </div>
            <v-btn
              color="primary"
              @click="showAddUserDialog = true"
              prepend-icon="mdi-plus"
            >
              Add User
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="userHeaders"
              :items="users"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.avatar="{ item }">
                <v-avatar size="32">
                  <v-img :src="item.avatar" :alt="item.name"></v-img>
                </v-avatar>
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
              <template v-slot:item.role="{ item }">
                <v-chip
                  :color="getRoleColor(item.role)"
                  size="small"
                  variant="tonal"
                >
                  {{ item.role }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editUser(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteUser(item.id)"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

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
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <!-- Analytics -->
        <v-card v-if="activeSection === 'analytics'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            <span class="text-h5">Analytics</span>
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

        <!-- System Settings -->
        <v-card v-if="activeSection === 'settings'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-cog</v-icon>
            <span class="text-h5">System Settings</span>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-store-settings</v-icon>
                </template>
                <v-list-item-title>Store Settings</v-list-item-title>
                <template v-slot:append>
                  <v-btn
                    variant="outlined"
                    size="small"
                    @click="editStoreSettings"
                  >
                    Edit
                  </v-btn>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-email-settings</v-icon>
                </template>
                <v-list-item-title>Email Settings</v-list-item-title>
                <template v-slot:append>
                  <v-btn
                    variant="outlined"
                    size="small"
                    @click="editEmailSettings"
                  >
                    Edit
                  </v-btn>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-payment-settings</v-icon>
                </template>
                <v-list-item-title>Payment Settings</v-list-item-title>
                <template v-slot:append>
                  <v-btn
                    variant="outlined"
                    size="small"
                    @click="editPaymentSettings"
                  >
                    Edit
                  </v-btn>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-backup-restore</v-icon>
                </template>
                <v-list-item-title>Backup & Restore</v-list-item-title>
                <template v-slot:append>
                  <v-btn
                    variant="outlined"
                    size="small"
                    @click="backupData"
                  >
                    Backup
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add User Dialog -->
    <v-dialog v-model="showAddUserDialog" max-width="500">
      <v-card>
        <v-card-title>Add New User</v-card-title>
        <v-card-text>
          <v-form ref="userForm" v-model="userFormValid">
            <v-text-field
              v-model="userForm.name"
              label="Full Name"
              variant="outlined"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="userForm.email"
              label="Email"
              type="email"
              variant="outlined"
              :rules="[rules.required, rules.email]"
            ></v-text-field>
            <v-select
              v-model="userForm.role"
              :items="roleOptions"
              label="Role"
              variant="outlined"
              :rules="[rules.required]"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showAddUserDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="addUser"
            :loading="saving"
            :disabled="!userFormValid"
          >
            Add User
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  name: 'AdminPage',
  data() {
    return {
      loading: false,
      saving: false,
      activeSection: 'users',
      showAddUserDialog: false,
      showAddProductDialog: false,
      
      // Form validation
      userFormValid: false,
      productFormValid: false,
      
      // Admin sections
      adminSections: [
        { id: 'users', title: 'Users', icon: 'mdi-account-group' },
        { id: 'products', title: 'Products', icon: 'mdi-store' },
        { id: 'orders', title: 'Orders', icon: 'mdi-package-variant' },
        { id: 'analytics', title: 'Analytics', icon: 'mdi-chart-line' },
        { id: 'settings', title: 'Settings', icon: 'mdi-cog' }
      ],
      
      // Stats
      stats: {
        totalUsers: 1250,
        userGrowth: 12,
        totalRevenue: '45,230',
        revenueGrowth: 8,
        totalOrders: 890,
        orderGrowth: 15,
        totalProducts: 156,
        productGrowth: 5
      },
      
      // Table headers
      userHeaders: [
        { title: 'Avatar', key: 'avatar', sortable: false },
        { title: 'Name', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Role', key: 'role' },
        { title: 'Status', key: 'status' },
        { title: 'Joined', key: 'joined' },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
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
      users: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          status: 'active',
          joined: '2024-01-01',
          avatar: 'https://via.placeholder.com/32x32/2196F3/FFFFFF?text=J'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'user',
          status: 'active',
          joined: '2024-01-15',
          avatar: 'https://via.placeholder.com/32x32/4CAF50/FFFFFF?text=J'
        }
      ],
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
          status: 'Delivered',
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
        monthlySales: '12,450',
        topProducts: [
          {
            id: 1,
            name: 'Wireless Headphones',
            sales: 45,
            image: 'https://via.placeholder.com/40x40/2196F3/FFFFFF?text=H'
          },
          {
            id: 2,
            name: 'Smartphone Case',
            sales: 32,
            image: 'https://via.placeholder.com/40x40/4CAF50/FFFFFF?text=C'
          }
        ]
      },
      
      // Forms
      userForm: {
        name: '',
        email: '',
        role: ''
      },
      productForm: {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: ''
      },
      
      // Options
      roleOptions: [
        { title: 'Admin', value: 'admin' },
        { title: 'User', value: 'user' },
        { title: 'Moderator', value: 'moderator' }
      ],
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
    
    getRoleColor(role) {
      const colors = {
        'admin': 'error',
        'moderator': 'warning',
        'user': 'primary'
      }
      return colors[role] || 'grey'
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
    
    editUser(user) {
      // In a real app, this would open an edit dialog
      console.log('Edit user:', user)
    },
    
    async deleteUser(userId) {
      try {
        const confirmed = await this.$confirm(
          'Are you sure you want to delete this user?',
          'Delete User',
          {
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'warning'
          }
        )
        
        if (confirmed) {
          // In a real app, this would call the API
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          this.users = this.users.filter(user => user.id !== userId)
          
          this.showNotification({
            type: 'success',
            message: 'User deleted successfully'
          })
        }
      } catch (error) {
        // User cancelled
      }
    },
    
    async addUser() {
      this.saving = true
      
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newUser = {
          id: Date.now(),
          name: this.userForm.name,
          email: this.userForm.email,
          role: this.userForm.role,
          status: 'active',
          joined: new Date().toISOString().split('T')[0],
          avatar: `https://via.placeholder.com/32x32/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${this.userForm.name.charAt(0)}`
        }
        
        this.users.push(newUser)
        
        this.showNotification({
          type: 'success',
          message: 'User added successfully'
        })
        
        this.showAddUserDialog = false
        this.userForm = { name: '', email: '', role: '' }
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to add user'
        })
      } finally {
        this.saving = false
      }
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
        this.productForm = { name: '', description: '', price: '', stock: '', category: '' }
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
      this.$router.push(`/admin/orders/${orderId}`)
    },
    
    editOrder(order) {
      // In a real app, this would open an edit dialog
      console.log('Edit order:', order)
    },
    
    editStoreSettings() {
      // In a real app, this would open store settings
      this.showNotification({
        type: 'info',
        message: 'Store settings panel will open'
      })
    },
    
    editEmailSettings() {
      // In a real app, this would open email settings
      this.showNotification({
        type: 'info',
        message: 'Email settings panel will open'
      })
    },
    
    editPaymentSettings() {
      // In a real app, this would open payment settings
      this.showNotification({
        type: 'info',
        message: 'Payment settings panel will open'
      })
    },
    
    async backupData() {
      try {
        // In a real app, this would create a backup
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        this.showNotification({
          type: 'success',
          message: 'Backup completed successfully'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to create backup'
        })
      }
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