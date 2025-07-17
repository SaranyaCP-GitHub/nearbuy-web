<template>
  <div class="notification-container">
    <v-snackbar
      v-for="notification in notifications"
      :key="notification.id"
      :model-value="true"
      :color="getNotificationColor(notification.type)"
      :timeout="5000"
      location="top right"
      class="notification-snackbar"
    >
      <div class="d-flex align-center">
        <v-icon
          :icon="getNotificationIcon(notification.type)"
          class="mr-2"
        />
        <span>{{ notification.message }}</span>
      </div>
      
      <template v-slot:actions>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="removeNotification(notification.id)"
        />
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'NotificationSystem',
  setup() {
    const store = useStore()
    
    const notifications = computed(() => store.getters.notifications)
    
    const getNotificationColor = (type) => {
      switch (type) {
        case 'success':
          return 'success'
        case 'error':
          return 'error'
        case 'warning':
          return 'warning'
        case 'info':
          return 'info'
        default:
          return 'primary'
      }
    }
    
    const getNotificationIcon = (type) => {
      switch (type) {
        case 'success':
          return 'mdi-check-circle'
        case 'error':
          return 'mdi-alert-circle'
        case 'warning':
          return 'mdi-alert'
        case 'info':
          return 'mdi-information'
        default:
          return 'mdi-bell'
      }
    }
    
    const removeNotification = (id) => {
      store.dispatch('removeNotification', id)
    }
    
    return {
      notifications,
      getNotificationColor,
      getNotificationIcon,
      removeNotification
    }
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.notification-snackbar {
  margin-bottom: 10px;
}
</style> 