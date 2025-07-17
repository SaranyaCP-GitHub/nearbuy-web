<template>
  <v-container class="py-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="32" color="primary" class="mr-3">mdi-truck-delivery</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold">Delivery Dashboard</h1>
              <p class="text-body-1 text-grey-darken-1 mt-1">
                Manage deliveries and track packages
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

    <!-- Delivery Stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" color="primary" dark>
          <v-icon size="48" class="mb-3">mdi-package-variant</v-icon>
          <h2 class="text-h4 font-weight-bold">{{ stats.totalDeliveries }}</h2>
          <p class="text-body-1">Total Deliveries</p>
          <div class="text-caption mt-2">
            <v-icon size="16" class="mr-1">mdi-trending-up</v-icon>
            +{{ stats.deliveryGrowth }}% this week
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" color="success" dark>
          <v-icon size="48" class="mb-3">mdi-check-circle</v-icon>
          <h2 class="text-h4 font-weight-bold">{{ stats.completedDeliveries }}</h2>
          <p class="text-body-1">Completed</p>
          <div class="text-caption mt-2">
            <v-icon size="16" class="mr-1">mdi-trending-up</v-icon>
            {{ stats.completionRate }}% success rate
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" color="warning" dark>
          <v-icon size="48" class="mb-3">mdi-clock</v-icon>
          <h2 class="text-h4 font-weight-bold">{{ stats.pendingDeliveries }}</h2>
          <p class="text-body-1">Pending</p>
          <div class="text-caption mt-2">
            <v-icon size="16" class="mr-1">mdi-alert</v-icon>
            {{ stats.avgDeliveryTime }}h avg time
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" color="info" dark>
          <v-icon size="48" class="mb-3">mdi-map-marker</v-icon>
          <h2 class="text-h4 font-weight-bold">{{ stats.activeRoutes }}</h2>
          <p class="text-body-1">Active Routes</p>
          <div class="text-caption mt-2">
            <v-icon size="16" class="mr-1">mdi-route</v-icon>
            {{ stats.totalDistance }}km today
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delivery Navigation -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card variant="outlined" class="mb-6">
          <v-list>
            <v-list-item
              v-for="section in deliverySections"
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

      <!-- Delivery Content -->
      <v-col cols="12" md="9">
        <!-- Active Deliveries -->
        <v-card v-if="activeSection === 'active'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-truck-delivery</v-icon>
            <span class="text-h5">Active Deliveries</span>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="deliveryHeaders"
              :items="activeDeliveries"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getDeliveryStatusColor(item.status)"
                  size="small"
                  variant="tonal"
                >
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:item.priority="{ item }">
                <v-chip
                  :color="getPriorityColor(item.priority)"
                  size="small"
                  variant="tonal"
                >
                  {{ item.priority }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewDelivery(item.id)"
                ></v-btn>
                <v-btn
                  icon="mdi-map-marker"
                  size="small"
                  variant="text"
                  @click="trackDelivery(item.id)"
                ></v-btn>
                <v-btn
                  v-if="item.status === 'Out for Delivery'"
                  icon="mdi-check"
                  size="small"
                  variant="text"
                  color="success"
                  @click="completeDelivery(item.id)"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <!-- Delivery History -->
        <v-card v-if="activeSection === 'history'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-history</v-icon>
            <span class="text-h5">Delivery History</span>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="historyHeaders"
              :items="deliveryHistory"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getDeliveryStatusColor(item.status)"
                  size="small"
                  variant="tonal"
                >
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:item.deliveryTime="{ item }">
                {{ item.deliveryTime }}h
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewDelivery(item.id)"
                ></v-btn>
                <v-btn
                  icon="mdi-file-document"
                  size="small"
                  variant="text"
                  @click="downloadReceipt(item.id)"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <!-- Route Planning -->
        <v-card v-if="activeSection === 'routes'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-route</v-icon>
              <span class="text-h5">Route Planning</span>
            </div>
            <v-btn
              color="primary"
              @click="optimizeRoutes"
              :loading="optimizing"
              prepend-icon="mdi-route"
            >
              Optimize Routes
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="text-h6 mb-3">Today's Routes</h3>
                <v-list>
                  <v-list-item
                    v-for="route in todaysRoutes"
                    :key="route.id"
                    class="mb-2"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary" size="40">
                        <v-icon color="white">mdi-route</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ route.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ route.deliveries }} deliveries • {{ route.distance }}km
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <v-chip
                        :color="route.status === 'Active' ? 'success' : 'warning'"
                        size="small"
                        variant="tonal"
                      >
                        {{ route.status }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <h3 class="text-h6 mb-3">Route Statistics</h3>
                <v-card variant="outlined" class="pa-4">
                  <div class="d-flex justify-space-between mb-3">
                    <span class="text-body-2">Total Distance</span>
                    <span class="text-body-1 font-weight-medium">{{ routeStats.totalDistance }}km</span>
                  </div>
                  <div class="d-flex justify-space-between mb-3">
                    <span class="text-body-2">Average Time</span>
                    <span class="text-body-1 font-weight-medium">{{ routeStats.avgTime }}h</span>
                  </div>
                  <div class="d-flex justify-space-between mb-3">
                    <span class="text-body-2">Fuel Efficiency</span>
                    <span class="text-body-1 font-weight-medium">{{ routeStats.fuelEfficiency }}km/L</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2">Carbon Footprint</span>
                    <span class="text-body-1 font-weight-medium">{{ routeStats.carbonFootprint }}kg CO2</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Delivery Analytics -->
        <v-card v-if="activeSection === 'analytics'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            <span class="text-h5">Delivery Analytics</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="text-h6 mb-3">Performance Overview</h3>
                <v-card variant="outlined" class="pa-4">
                  <div class="text-center">
                    <v-icon size="48" color="success" class="mb-3">mdi-chart-line</v-icon>
                    <h2 class="text-h4 font-weight-bold">{{ analytics.onTimeDelivery }}%</h2>
                    <p class="text-body-1">On-Time Delivery Rate</p>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <h3 class="text-h6 mb-3">Top Delivery Areas</h3>
                <v-list>
                  <v-list-item
                    v-for="area in analytics.topAreas"
                    :key="area.id"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary" size="40">
                        <v-icon color="white">mdi-map-marker</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ area.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ area.deliveries }} deliveries</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Delivery Settings -->
        <v-card v-if="activeSection === 'settings'" variant="outlined" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-cog</v-icon>
            <span class="text-h5">Delivery Settings</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="settingsForm" v-model="settingsFormValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="settings.maxDeliveriesPerDay"
                    label="Max Deliveries Per Day"
                    type="number"
                    variant="outlined"
                    :rules="[rules.required, rules.positive]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="settings.maxDistancePerDay"
                    label="Max Distance Per Day (km)"
                    type="number"
                    variant="outlined"
                    :rules="[rules.required, rules.positive]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="settings.deliveryTimeWindow"
                    label="Delivery Time Window (hours)"
                    type="number"
                    variant="outlined"
                    :rules="[rules.required, rules.positive]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="settings.vehicleType"
                    :items="vehicleOptions"
                    label="Vehicle Type"
                    variant="outlined"
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="settings.deliveryNotes"
                    label="Delivery Notes Template"
                    variant="outlined"
                    rows="3"
                    placeholder="Default notes for deliveries..."
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-btn
                color="primary"
                @click="updateSettings"
                :loading="saving"
                :disabled="!settingsFormValid"
              >
                Update Settings
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DeliveryPage',
  data() {
    return {
      loading: false,
      saving: false,
      optimizing: false,
      activeSection: 'active',
      
      // Form validation
      settingsFormValid: false,
      
      // Delivery sections
      deliverySections: [
        { id: 'active', title: 'Active Deliveries', icon: 'mdi-truck-delivery' },
        { id: 'history', title: 'Delivery History', icon: 'mdi-history' },
        { id: 'routes', title: 'Route Planning', icon: 'mdi-route' },
        { id: 'analytics', title: 'Analytics', icon: 'mdi-chart-line' },
        { id: 'settings', title: 'Settings', icon: 'mdi-cog' }
      ],
      
      // Stats
      stats: {
        totalDeliveries: 156,
        deliveryGrowth: 12,
        completedDeliveries: 142,
        completionRate: 91,
        pendingDeliveries: 14,
        avgDeliveryTime: 2.5,
        activeRoutes: 8,
        totalDistance: 245
      },
      
      // Table headers
      deliveryHeaders: [
        { title: 'Order ID', key: 'orderId' },
        { title: 'Customer', key: 'customer' },
        { title: 'Address', key: 'address' },
        { title: 'Status', key: 'status' },
        { title: 'Priority', key: 'priority' },
        { title: 'ETA', key: 'eta' },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      historyHeaders: [
        { title: 'Order ID', key: 'orderId' },
        { title: 'Customer', key: 'customer' },
        { title: 'Status', key: 'status' },
        { title: 'Delivery Time', key: 'deliveryTime' },
        { title: 'Date', key: 'date' },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      
      // Mock data
      activeDeliveries: [
        {
          id: 1,
          orderId: 'ORD-12345',
          customer: 'John Doe',
          address: '123 Main St, New York, NY',
          status: 'Out for Delivery',
          priority: 'High',
          eta: '2:30 PM'
        },
        {
          id: 2,
          orderId: 'ORD-12344',
          customer: 'Jane Smith',
          address: '456 Oak Ave, Brooklyn, NY',
          status: 'In Transit',
          priority: 'Medium',
          eta: '4:15 PM'
        }
      ],
      deliveryHistory: [
        {
          id: 1,
          orderId: 'ORD-12343',
          customer: 'Mike Johnson',
          status: 'Delivered',
          deliveryTime: 2.5,
          date: '2024-01-15'
        },
        {
          id: 2,
          orderId: 'ORD-12342',
          customer: 'Sarah Wilson',
          status: 'Delivered',
          deliveryTime: 1.8,
          date: '2024-01-14'
        }
      ],
      todaysRoutes: [
        {
          id: 1,
          name: 'Downtown Route',
          deliveries: 12,
          distance: 45,
          status: 'Active'
        },
        {
          id: 2,
          name: 'Brooklyn Route',
          deliveries: 8,
          distance: 32,
          status: 'Active'
        }
      ],
      routeStats: {
        totalDistance: 245,
        avgTime: 2.5,
        fuelEfficiency: 12.5,
        carbonFootprint: 45.2
      },
      analytics: {
        onTimeDelivery: 94,
        topAreas: [
          {
            id: 1,
            name: 'Downtown Manhattan',
            deliveries: 45
          },
          {
            id: 2,
            name: 'Brooklyn Heights',
            deliveries: 32
          }
        ]
      },
      settings: {
        maxDeliveriesPerDay: 25,
        maxDistancePerDay: 300,
        deliveryTimeWindow: 4,
        vehicleType: 'van',
        deliveryNotes: 'Please call customer 15 minutes before arrival. Leave package at front door if no answer.'
      },
      
      // Options
      vehicleOptions: [
        { title: 'Van', value: 'van' },
        { title: 'Truck', value: 'truck' },
        { title: 'Motorcycle', value: 'motorcycle' },
        { title: 'Bicycle', value: 'bicycle' }
      ],
      
      // Validation rules
      rules: {
        required: v => !!v || 'This field is required',
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
    
    getDeliveryStatusColor(status) {
      const colors = {
        'Pending': 'warning',
        'In Transit': 'info',
        'Out for Delivery': 'primary',
        'Delivered': 'success',
        'Failed': 'error'
      }
      return colors[status] || 'grey'
    },
    
    getPriorityColor(priority) {
      const colors = {
        'High': 'error',
        'Medium': 'warning',
        'Low': 'success'
      }
      return colors[priority] || 'grey'
    },
    
    viewDelivery(deliveryId) {
      this.$router.push(`/delivery/${deliveryId}`)
    },
    
    trackDelivery(deliveryId) {
      // In a real app, this would open tracking in a new window
      window.open(`https://tracking.example.com/${deliveryId}`, '_blank')
    },
    
    async completeDelivery(deliveryId) {
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const delivery = this.activeDeliveries.find(d => d.id === deliveryId)
        if (delivery) {
          delivery.status = 'Delivered'
        }
        
        this.showNotification({
          type: 'success',
          message: 'Delivery completed successfully'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to complete delivery'
        })
      }
    },
    
    downloadReceipt(deliveryId) {
      // In a real app, this would generate and download a receipt
      this.showNotification({
        type: 'success',
        message: 'Receipt downloaded successfully'
      })
    },
    
    async optimizeRoutes() {
      this.optimizing = true
      
      try {
        // In a real app, this would call route optimization API
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        this.showNotification({
          type: 'success',
          message: 'Routes optimized successfully'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to optimize routes'
        })
      } finally {
        this.optimizing = false
      }
    },
    
    async updateSettings() {
      this.saving = true
      
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showNotification({
          type: 'success',
          message: 'Settings updated successfully'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update settings'
        })
      } finally {
        this.saving = false
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