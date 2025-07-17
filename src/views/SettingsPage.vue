<template>
  <v-container class="py-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-icon size="32" color="primary" class="mr-3">mdi-cog</v-icon>
          <div>
            <h1 class="text-h4 font-weight-bold">Settings</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              Manage your account preferences and settings
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <!-- Settings Navigation -->
      <v-col cols="12" md="3">
        <v-card variant="outlined" class="mb-6">
          <v-list>
            <v-list-item
              v-for="section in settingsSections"
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

      <!-- Settings Content -->
      <v-col cols="12" md="9">
        <!-- Account Settings -->
        <v-card v-if="activeSection === 'account'" variant="outlined" class="mb-6">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-account</v-icon>
            Account Settings
          </v-card-title>
          <v-card-text>
            <v-form ref="accountForm" v-model="accountFormValid">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="accountForm.firstName"
                    label="First Name"
                    variant="outlined"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="accountForm.lastName"
                    label="Last Name"
                    variant="outlined"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="accountForm.email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="accountForm.phone"
                    label="Phone Number"
                    variant="outlined"
                    :rules="[rules.phone]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="accountForm.bio"
                    label="Bio"
                    variant="outlined"
                    rows="3"
                    placeholder="Tell us about yourself..."
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-btn
                color="primary"
                @click="updateAccount"
                :loading="saving"
                :disabled="!accountFormValid"
              >
                Update Account
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Security Settings -->
        <v-card v-if="activeSection === 'security'" variant="outlined" class="mb-6">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-shield</v-icon>
            Security Settings
          </v-card-title>
          <v-card-text>
            <!-- Change Password -->
            <div class="mb-6">
              <h3 class="text-h6 mb-3">Change Password</h3>
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
                  :loading="saving"
                  :disabled="!passwordFormValid"
                >
                  Change Password
                </v-btn>
              </v-form>
            </div>

            <!-- Two-Factor Authentication -->
            <div class="mb-6">
              <h3 class="text-h6 mb-3">Two-Factor Authentication</h3>
              <div class="d-flex align-center justify-space-between">
                <div>
                  <p class="text-body-2 mb-1">
                    Add an extra layer of security to your account
                  </p>
                  <p class="text-caption text-grey-darken-1">
                    {{ user.twoFactorEnabled ? 'Currently enabled' : 'Currently disabled' }}
                  </p>
                </div>
                <v-btn
                  :color="user.twoFactorEnabled ? 'error' : 'primary'"
                  @click="toggleTwoFactor"
                  :loading="saving"
                >
                  {{ user.twoFactorEnabled ? 'Disable' : 'Enable' }} 2FA
                </v-btn>
              </div>
            </div>

            <!-- Login History -->
            <div>
              <h3 class="text-h6 mb-3">Recent Login Activity</h3>
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
            </div>
          </v-card-text>
        </v-card>

        <!-- Notification Settings -->
        <v-card v-if="activeSection === 'notifications'" variant="outlined" class="mb-6">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-bell</v-icon>
            Notification Preferences
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-email</v-icon>
                </template>
                <v-list-item-title>Email Notifications</v-list-item-title>
                <template v-slot:append>
                  <v-switch v-model="notifications.email"></v-switch>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-phone</v-icon>
                </template>
                <v-list-item-title>SMS Notifications</v-list-item-title>
                <template v-slot:append>
                  <v-switch v-model="notifications.sms"></v-switch>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-bell-ring</v-icon>
                </template>
                <v-list-item-title>Push Notifications</v-list-item-title>
                <template v-slot:append>
                  <v-switch v-model="notifications.push"></v-switch>
                </template>
              </v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>

            <h3 class="text-h6 mb-3">Notification Types</h3>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-shopping</v-icon>
                </template>
                <v-list-item-title>Order Updates</v-list-item-title>
                <template v-slot:append>
                  <v-switch v-model="notifications.orderUpdates"></v-switch>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-tag</v-icon>
                </template>
                <v-list-item-title>Promotions & Deals</v-list-item-title>
                <template v-slot:append>
                  <v-switch v-model="notifications.promotions"></v-switch>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-star</v-icon>
                </template>
                <v-list-item-title>Product Reviews</v-list-item-title>
                <template v-slot:append>
                  <v-switch v-model="notifications.reviews"></v-switch>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-heart</v-icon>
                </template>
                <v-list-item-title>Wishlist Updates</v-list-item-title>
                <template v-slot:append>
                  <v-switch v-model="notifications.wishlist"></v-switch>
                </template>
              </v-list-item>
            </v-list>

            <v-btn
              color="primary"
              @click="updateNotifications"
              :loading="saving"
              class="mt-4"
            >
              Save Notification Settings
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Privacy Settings -->
        <v-card v-if="activeSection === 'privacy'" variant="outlined" class="mb-6">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-eye-off</v-icon>
            Privacy Settings
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-account-search</v-icon>
                </template>
                <v-list-item-title>Profile Visibility</v-list-item-title>
                <template v-slot:append>
                  <v-select
                    v-model="privacy.profileVisibility"
                    :items="visibilityOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="width: 150px"
                  ></v-select>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-map-marker</v-icon>
                </template>
                <v-list-item-title>Location Sharing</v-list-item-title>
                <template v-slot:append>
                  <v-switch v-model="privacy.locationSharing"></v-switch>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-cookie</v-icon>
                </template>
                <v-list-item-title>Cookie Preferences</v-list-item-title>
                <template v-slot:append>
                  <v-btn
                    variant="outlined"
                    size="small"
                    @click="manageCookies"
                  >
                    Manage
                  </v-btn>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-delete</v-icon>
                </template>
                <v-list-item-title>Data Deletion</v-list-item-title>
                <template v-slot:append>
                  <v-btn
                    variant="outlined"
                    color="error"
                    size="small"
                    @click="requestDataDeletion"
                  >
                    Request
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>

            <v-btn
              color="primary"
              @click="updatePrivacy"
              :loading="saving"
              class="mt-4"
            >
              Save Privacy Settings
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Appearance Settings -->
        <v-card v-if="activeSection === 'appearance'" variant="outlined" class="mb-6">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-palette</v-icon>
            Appearance Settings
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-theme-light-dark</v-icon>
                </template>
                <v-list-item-title>Theme</v-list-item-title>
                <template v-slot:append>
                  <v-select
                    v-model="appearance.theme"
                    :items="themeOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="width: 120px"
                  ></v-select>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-translate</v-icon>
                </template>
                <v-list-item-title>Language</v-list-item-title>
                <template v-slot:append>
                  <v-select
                    v-model="appearance.language"
                    :items="languageOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="width: 120px"
                  ></v-select>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-currency-usd</v-icon>
                </template>
                <v-list-item-title>Currency</v-list-item-title>
                <template v-slot:append>
                  <v-select
                    v-model="appearance.currency"
                    :items="currencyOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="width: 120px"
                  ></v-select>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-format-font-size-increase</v-icon>
                </template>
                <v-list-item-title>Font Size</v-list-item-title>
                <template v-slot:append>
                  <v-select
                    v-model="appearance.fontSize"
                    :items="fontSizeOptions"
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
              @click="updateAppearance"
              :loading="saving"
              class="mt-4"
            >
              Save Appearance Settings
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Account Actions -->
        <v-card v-if="activeSection === 'actions'" variant="outlined" class="mb-6">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-account-cog</v-icon>
            Account Actions
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-download</v-icon>
                </template>
                <v-list-item-title>Export Data</v-list-item-title>
                <v-list-item-subtitle>Download all your data</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    variant="outlined"
                    size="small"
                    @click="exportData"
                  >
                    Export
                  </v-btn>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-delete-forever</v-icon>
                </template>
                <v-list-item-title>Delete Account</v-list-item-title>
                <v-list-item-subtitle>Permanently delete your account and all data</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    variant="outlined"
                    color="error"
                    size="small"
                    @click="deleteAccount"
                  >
                    Delete
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'SettingsPage',
  data() {
    return {
      activeSection: 'account',
      saving: false,
      
      // Form validation
      accountFormValid: false,
      passwordFormValid: false,
      
      // Settings sections
      settingsSections: [
        { id: 'account', title: 'Account', icon: 'mdi-account' },
        { id: 'security', title: 'Security', icon: 'mdi-shield' },
        { id: 'notifications', title: 'Notifications', icon: 'mdi-bell' },
        { id: 'privacy', title: 'Privacy', icon: 'mdi-eye-off' },
        { id: 'appearance', title: 'Appearance', icon: 'mdi-palette' },
        { id: 'actions', title: 'Account Actions', icon: 'mdi-account-cog' }
      ],
      
      // Account form
      accountForm: {
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
      
      // Validation rules
      rules: {
        required: v => !!v || 'This field is required',
        email: v => /.+@.+\..+/.test(v) || 'Please enter a valid email',
        phone: v => !v || /^[\+]?[1-9][\d]{0,15}$/.test(v) || 'Please enter a valid phone number',
        password: v => v.length >= 8 || 'Password must be at least 8 characters'
      },
      
      // Notification settings
      notifications: {
        email: true,
        sms: false,
        push: true,
        orderUpdates: true,
        promotions: true,
        reviews: true,
        wishlist: false
      },
      
      // Privacy settings
      privacy: {
        profileVisibility: 'public',
        locationSharing: false
      },
      
      // Appearance settings
      appearance: {
        theme: 'auto',
        language: 'en',
        currency: 'USD',
        fontSize: 'medium'
      },
      
      // Options
      visibilityOptions: [
        { title: 'Public', value: 'public' },
        { title: 'Friends Only', value: 'friends' },
        { title: 'Private', value: 'private' }
      ],
      themeOptions: [
        { title: 'Light', value: 'light' },
        { title: 'Dark', value: 'dark' },
        { title: 'Auto', value: 'auto' }
      ],
      languageOptions: [
        { title: 'English', value: 'en' },
        { title: 'Spanish', value: 'es' },
        { title: 'French', value: 'fr' },
        { title: 'German', value: 'de' }
      ],
      currencyOptions: [
        { title: 'USD ($)', value: 'USD' },
        { title: 'EUR (€)', value: 'EUR' },
        { title: 'GBP (£)', value: 'GBP' },
        { title: 'CAD (C$)', value: 'CAD' }
      ],
      fontSizeOptions: [
        { title: 'Small', value: 'small' },
        { title: 'Medium', value: 'medium' },
        { title: 'Large', value: 'large' }
      ],
      
      // Mock data
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
      this.accountForm = {
        firstName: this.user.name.split(' ')[0] || '',
        lastName: this.user.name.split(' ').slice(1).join(' ') || '',
        email: this.user.email || '',
        phone: this.user.phone || '',
        bio: this.user.bio || ''
      }
    },
    
    async updateAccount() {
      this.saving = true
      
      try {
        await this.updateUserProfile(this.accountForm)
        this.showNotification({
          type: 'success',
          message: 'Account updated successfully!'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update account'
        })
      } finally {
        this.saving = false
      }
    },
    
    async changePassword() {
      this.saving = true
      
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
        this.saving = false
      }
    },
    
    async toggleTwoFactor() {
      this.saving = true
      
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
      } finally {
        this.saving = false
      }
    },
    
    async updateNotifications() {
      this.saving = true
      
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showNotification({
          type: 'success',
          message: 'Notification settings updated successfully!'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update notification settings'
        })
      } finally {
        this.saving = false
      }
    },
    
    async updatePrivacy() {
      this.saving = true
      
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showNotification({
          type: 'success',
          message: 'Privacy settings updated successfully!'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update privacy settings'
        })
      } finally {
        this.saving = false
      }
    },
    
    async updateAppearance() {
      this.saving = true
      
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showNotification({
          type: 'success',
          message: 'Appearance settings updated successfully!'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update appearance settings'
        })
      } finally {
        this.saving = false
      }
    },
    
    async exportData() {
      try {
        // In a real app, this would generate and download a data export
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        this.showNotification({
          type: 'success',
          message: 'Data export completed! Check your email for the download link.'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to export data'
        })
      }
    },
    
    async deleteAccount() {
      try {
        const confirmed = await this.$confirm(
          'Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.',
          'Delete Account',
          {
            confirmText: 'Delete Account',
            cancelText: 'Cancel',
            type: 'warning'
          }
        )
        
        if (confirmed) {
          // In a real app, this would call the API to delete the account
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          this.showNotification({
            type: 'success',
            message: 'Account deletion request submitted. You will receive a confirmation email.'
          })
        }
      } catch (error) {
        // User cancelled
      }
    },
    
    manageCookies() {
      // In a real app, this would open a cookie management modal
      this.showNotification({
        type: 'info',
        message: 'Cookie management panel will open'
      })
    },
    
    requestDataDeletion() {
      // In a real app, this would open a data deletion request form
      this.showNotification({
        type: 'info',
        message: 'Data deletion request form will open'
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