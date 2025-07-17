<template>
  <v-container class="py-6">
    <v-row>
      <!-- Profile Sidebar -->
      <v-col cols="12" md="4" lg="3">
        <v-card class="mb-6" variant="outlined">
          <v-card-text class="text-center pa-6">
            <v-avatar size="120" class="mb-4">
              <v-img
                :src="user.avatar || 'https://via.placeholder.com/120x120/2196F3/FFFFFF?text=U'"
                :alt="user.name"
              ></v-img>
            </v-avatar>
            <h2 class="text-h5 font-weight-bold mb-2">{{ user.name }}</h2>
            <p class="text-body-2 text-grey-darken-1 mb-4">{{ user.email }}</p>
            <v-chip
              :color="user.verified ? 'success' : 'warning'"
              size="small"
              variant="tonal"
            >
              {{ user.verified ? 'Verified' : 'Unverified' }}
            </v-chip>
          </v-card-text>
        </v-card>

        <!-- Quick Stats -->
        <v-card class="mb-6" variant="outlined">
          <v-card-title class="text-h6">Quick Stats</v-card-title>
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-3">
              <span class="text-body-2">Orders</span>
              <span class="text-h6 font-weight-bold">{{ stats.totalOrders }}</span>
            </div>
            <div class="d-flex justify-space-between align-center mb-3">
              <span class="text-body-2">Favorites</span>
              <span class="text-h6 font-weight-bold">{{ stats.totalFavorites }}</span>
            </div>
            <div class="d-flex justify-space-between align-center">
              <span class="text-body-2">Reviews</span>
              <span class="text-h6 font-weight-bold">{{ stats.totalReviews }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Main Content -->
      <v-col cols="12" md="8" lg="9">
        <!-- Tabs -->
        <v-card variant="outlined">
          <v-tabs v-model="activeTab" color="primary">
            <v-tab value="profile">Profile</v-tab>
            <v-tab value="orders">Orders</v-tab>
            <v-tab value="addresses">Addresses</v-tab>
            <v-tab value="preferences">Preferences</v-tab>
            <v-tab value="security">Security</v-tab>
          </v-tabs>

          <v-card-text class="pa-6">
            <!-- Profile Tab -->
            <v-window v-model="activeTab">
              <v-window-item value="profile">
                <div>
                  <h3 class="text-h5 mb-4">Personal Information</h3>
                  <v-form ref="profileForm" v-model="profileFormValid">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="profileForm.firstName"
                          label="First Name"
                          variant="outlined"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="profileForm.lastName"
                          label="Last Name"
                          variant="outlined"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="profileForm.email"
                          label="Email"
                          type="email"
                          variant="outlined"
                          :rules="[rules.required, rules.email]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="profileForm.phone"
                          label="Phone Number"
                          variant="outlined"
                          :rules="[rules.phone]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="profileForm.bio"
                          label="Bio"
                          variant="outlined"
                          rows="3"
                          placeholder="Tell us about yourself..."
                        ></v-textarea>
                      </v-col>
                    </v-row>
                    <v-btn
                      color="primary"
                      @click="updateProfile"
                      :loading="updating"
                      :disabled="!profileFormValid"
                    >
                      Update Profile
                    </v-btn>
                  </v-form>
                </div>
              </v-window-item>

              <!-- Orders Tab -->
              <v-window-item value="orders">
                <div>
                  <h3 class="text-h5 mb-4">Order History</h3>
                  <v-list v-if="recentOrders.length > 0">
                    <v-list-item
                      v-for="order in recentOrders"
                      :key="order.id"
                      :to="`/orders/${order.id}`"
                    >
                      <template v-slot:prepend>
                        <v-avatar color="primary" size="40">
                          <v-icon color="white">mdi-package-variant</v-icon>
                        </v-avatar>
                      </template>
                      <v-list-item-title>{{ order.orderNumber }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ order.date }} • ${{ order.total }}
                      </v-list-item-subtitle>
                      <template v-slot:append>
                        <v-chip
                          :color="getOrderStatusColor(order.status)"
                          size="small"
                          variant="tonal"
                        >
                          {{ order.status }}
                        </v-chip>
                      </template>
                    </v-list-item>
                  </v-list>
                  <v-alert
                    v-else
                    type="info"
                    variant="tonal"
                    class="mt-4"
                  >
                    No orders yet. Start shopping to see your order history here.
                  </v-alert>
                  <v-btn
                    variant="outlined"
                    @click="$router.push('/orders')"
                    class="mt-4"
                  >
                    View All Orders
                  </v-btn>
                </div>
              </v-window-item>

              <!-- Addresses Tab -->
              <v-window-item value="addresses">
                <div>
                  <div class="d-flex justify-space-between align-center mb-4">
                    <h3 class="text-h5">Shipping Addresses</h3>
                    <v-btn
                      color="primary"
                      @click="showAddAddressDialog = true"
                      prepend-icon="mdi-plus"
                    >
                      Add Address
                    </v-btn>
                  </div>
                  
                  <v-row>
                    <v-col
                      v-for="address in addresses"
                      :key="address.id"
                      cols="12"
                      md="6"
                    >
                      <v-card variant="outlined" class="h-100">
                        <v-card-text>
                          <div class="d-flex justify-space-between align-start mb-3">
                            <h4 class="text-h6">{{ address.name }}</h4>
                            <v-menu>
                              <template v-slot:activator="{ props }">
                                <v-btn
                                  icon="mdi-dots-vertical"
                                  variant="text"
                                  size="small"
                                  v-bind="props"
                                ></v-btn>
                              </template>
                              <v-list>
                                <v-list-item @click="editAddress(address)">
                                  <v-list-item-title>Edit</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="deleteAddress(address.id)" color="error">
                                  <v-list-item-title>Delete</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                          <p class="text-body-2 mb-2">{{ address.street }}</p>
                          <p class="text-body-2 mb-2">{{ address.city }}, {{ address.state }} {{ address.zipCode }}</p>
                          <p class="text-body-2 mb-3">{{ address.country }}</p>
                          <v-chip
                            v-if="address.isDefault"
                            color="primary"
                            size="small"
                            variant="tonal"
                          >
                            Default
                          </v-chip>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
              </v-window-item>

              <!-- Preferences Tab -->
              <v-window-item value="preferences">
                <div>
                  <h3 class="text-h5 mb-4">Preferences</h3>
                  <v-list>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon>mdi-bell</v-icon>
                      </template>
                      <v-list-item-title>Email Notifications</v-list-item-title>
                      <template v-slot:append>
                        <v-switch v-model="preferences.emailNotifications"></v-switch>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon>mdi-phone</v-icon>
                      </template>
                      <v-list-item-title>SMS Notifications</v-list-item-title>
                      <template v-slot:append>
                        <v-switch v-model="preferences.smsNotifications"></v-switch>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon>mdi-palette</v-icon>
                      </template>
                      <v-list-item-title>Dark Mode</v-list-item-title>
                      <template v-slot:append>
                        <v-switch v-model="preferences.darkMode"></v-switch>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon>mdi-translate</v-icon>
                      </template>
                      <v-list-item-title>Language</v-list-item-title>
                      <template v-slot:append>
                        <v-select
                          v-model="preferences.language"
                          :items="languageOptions"
                          variant="outlined"
                          density="compact"
                          hide-details
                          style="width: 120px"
                        ></v-select>
                      </template>
                    </v-list-item>
                  </v-list>
                  <v-btn
                    color="primary"
                    @click="updatePreferences"
                    :loading="updating"
                    class="mt-4"
                  >
                    Save Preferences
                  </v-btn>
                </div>
              </v-window-item>

              <!-- Security Tab -->
              <v-window-item value="security">
                <div>
                  <h3 class="text-h5 mb-4">Security Settings</h3>
                  
                  <!-- Change Password -->
                  <v-card class="mb-4" variant="outlined">
                    <v-card-title>Change Password</v-card-title>
                    <v-card-text>
                      <v-form ref="passwordForm" v-model="passwordFormValid">
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="passwordForm.currentPassword"
                              label="Current Password"
                              type="password"
                              variant="outlined"
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="passwordForm.newPassword"
                              label="New Password"
                              type="password"
                              variant="outlined"
                              :rules="[rules.required, rules.password]"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-btn
                          color="primary"
                          @click="changePassword"
                          :loading="updating"
                          :disabled="!passwordFormValid"
                        >
                          Change Password
                        </v-btn>
                      </v-form>
                    </v-card-text>
                  </v-card>

                  <!-- Two-Factor Authentication -->
                  <v-card class="mb-4" variant="outlined">
                    <v-card-title>Two-Factor Authentication</v-card-title>
                    <v-card-text>
                      <p class="text-body-2 mb-4">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <v-btn
                        :color="user.twoFactorEnabled ? 'error' : 'primary'"
                        @click="toggleTwoFactor"
                      >
                        {{ user.twoFactorEnabled ? 'Disable' : 'Enable' }} 2FA
                      </v-btn>
                    </v-card-text>
                  </v-card>

                  <!-- Login History -->
                  <v-card variant="outlined">
                    <v-card-title>Recent Login Activity</v-card-title>
                    <v-card-text>
                      <v-list>
                        <v-list-item
                          v-for="login in recentLogins"
                          :key="login.id"
                        >
                          <template v-slot:prepend>
                            <v-icon :color="login.success ? 'success' : 'error'">
                              {{ login.success ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                            </v-icon>
                          </template>
                          <v-list-item-title>{{ login.location }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ login.date }} • {{ login.device }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Address Dialog -->
    <v-dialog v-model="showAddAddressDialog" max-width="500">
      <v-card>
        <v-card-title>Add New Address</v-card-title>
        <v-card-text>
          <v-form ref="addressForm" v-model="addressFormValid">
            <v-text-field
              v-model="addressForm.name"
              label="Address Name"
              variant="outlined"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="addressForm.street"
              label="Street Address"
              variant="outlined"
              :rules="[rules.required]"
            ></v-text-field>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addressForm.city"
                  label="City"
                  variant="outlined"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addressForm.state"
                  label="State/Province"
                  variant="outlined"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addressForm.zipCode"
                  label="ZIP/Postal Code"
                  variant="outlined"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addressForm.country"
                  label="Country"
                  variant="outlined"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-checkbox
              v-model="addressForm.isDefault"
              label="Set as default address"
            ></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showAddAddressDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="addAddress"
            :loading="updating"
            :disabled="!addressFormValid"
          >
            Add Address
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProfilePage',
  data() {
    return {
      activeTab: 'profile',
      updating: false,
      showAddAddressDialog: false,
      
      // Form validation
      profileFormValid: false,
      passwordFormValid: false,
      addressFormValid: false,
      
      // Profile form
      profileForm: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bio: ''
      },
      
      // Password form
      passwordForm: {
        currentPassword: '',
        newPassword: ''
      },
      
      // Address form
      addressForm: {
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
      },
      
      // Validation rules
      rules: {
        required: v => !!v || 'This field is required',
        email: v => /.+@.+\..+/.test(v) || 'Please enter a valid email',
        phone: v => !v || /^[\+]?[1-9][\d]{0,15}$/.test(v) || 'Please enter a valid phone number',
        password: v => v.length >= 8 || 'Password must be at least 8 characters'
      },
      
      // Language options
      languageOptions: [
        { title: 'English', value: 'en' },
        { title: 'Spanish', value: 'es' },
        { title: 'French', value: 'fr' },
        { title: 'German', value: 'de' }
      ],
      
      // Mock data
      stats: {
        totalOrders: 12,
        totalFavorites: 8,
        totalReviews: 5
      },
      
      recentOrders: [
        {
          id: 1,
          orderNumber: 'ORD-12345',
          date: '2024-01-15',
          total: 299.99,
          status: 'Delivered'
        },
        {
          id: 2,
          orderNumber: 'ORD-12344',
          date: '2024-01-10',
          total: 149.99,
          status: 'Shipped'
        }
      ],
      
      addresses: [
        {
          id: 1,
          name: 'Home',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          isDefault: true
        },
        {
          id: 2,
          name: 'Work',
          street: '456 Business Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          country: 'USA',
          isDefault: false
        }
      ],
      
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        darkMode: false,
        language: 'en'
      },
      
      recentLogins: [
        {
          id: 1,
          location: 'New York, NY',
          date: '2024-01-15 10:30 AM',
          device: 'Chrome on Windows',
          success: true
        },
        {
          id: 2,
          location: 'Unknown',
          date: '2024-01-14 2:15 PM',
          device: 'Mobile Safari',
          success: false
        }
      ]
    }
  },
  
  computed: {
    ...mapGetters(['getUser']),
    
    user() {
      return this.getUser || {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: null,
        verified: true,
        twoFactorEnabled: false
      }
    }
  },
  
  mounted() {
    this.loadUserData()
  },
  
  methods: {
    ...mapActions(['updateUserProfile', 'showNotification']),
    
    loadUserData() {
      // Load user data from store or API
      this.profileForm = {
        firstName: this.user.name.split(' ')[0] || '',
        lastName: this.user.name.split(' ').slice(1).join(' ') || '',
        email: this.user.email || '',
        phone: this.user.phone || '',
        bio: this.user.bio || ''
      }
    },
    
    async updateProfile() {
      this.updating = true
      
      try {
        await this.updateUserProfile(this.profileForm)
        this.showNotification({
          type: 'success',
          message: 'Profile updated successfully!'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update profile'
        })
      } finally {
        this.updating = false
      }
    },
    
    async changePassword() {
      this.updating = true
      
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showNotification({
          type: 'success',
          message: 'Password changed successfully!'
        })
        
        // Reset form
        this.passwordForm = {
          currentPassword: '',
          newPassword: ''
        }
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to change password'
        })
      } finally {
        this.updating = false
      }
    },
    
    async toggleTwoFactor() {
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showNotification({
          type: 'success',
          message: `Two-factor authentication ${this.user.twoFactorEnabled ? 'disabled' : 'enabled'} successfully!`
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update two-factor authentication'
        })
      }
    },
    
    async addAddress() {
      this.updating = true
      
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newAddress = {
          id: Date.now(),
          ...this.addressForm
        }
        
        this.addresses.push(newAddress)
        
        this.showNotification({
          type: 'success',
          message: 'Address added successfully!'
        })
        
        this.showAddAddressDialog = false
        this.addressForm = {
          name: '',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          isDefault: false
        }
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to add address'
        })
      } finally {
        this.updating = false
      }
    },
    
    editAddress(address) {
      // In a real app, this would open an edit dialog
      console.log('Edit address:', address)
    },
    
    async deleteAddress(addressId) {
      try {
        const confirmed = await this.$confirm(
          'Are you sure you want to delete this address?',
          'Delete Address',
          {
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'warning'
          }
        )
        
        if (confirmed) {
          this.addresses = this.addresses.filter(addr => addr.id !== addressId)
          this.showNotification({
            type: 'success',
            message: 'Address deleted successfully!'
          })
        }
      } catch (error) {
        // User cancelled
      }
    },
    
    async updatePreferences() {
      this.updating = true
      
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showNotification({
          type: 'success',
          message: 'Preferences updated successfully!'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update preferences'
        })
      } finally {
        this.updating = false
      }
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
    }
  }
}
</script>

<style scoped>
.h-100 {
  height: 100%;
}
</style> 