<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <!-- 404 Illustration -->
        <div class="mb-8">
          <v-icon
            size="120"
            color="grey-lighten-1"
            class="mb-4"
          >
            mdi-map-marker-question
          </v-icon>
          <h1 class="text-h1 font-weight-bold text-grey-lighten-1 mb-2">404</h1>
          <h2 class="text-h4 font-weight-bold mb-4">Page Not Found</h2>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, 
            or you entered the wrong URL.
          </p>
        </div>

        <!-- Search Bar -->
        <v-card class="mb-6 pa-4">
          <h3 class="text-h6 font-weight-bold mb-4">Looking for something specific?</h3>
          <v-text-field
            v-model="searchQuery"
            placeholder="Search for products, categories, or help articles..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            @keyup.enter="performSearch"
          >
            <template v-slot:append>
              <v-btn
                color="primary"
                @click="performSearch"
                :loading="searching"
              >
                Search
              </v-btn>
            </template>
          </v-text-field>
        </v-card>

        <!-- Quick Actions -->
        <v-card class="mb-6 pa-6">
          <h3 class="text-h6 font-weight-bold mb-4">Quick Actions</h3>
          <v-row>
            <v-col
              v-for="action in quickActions"
              :key="action.title"
              cols="12"
              sm="6"
            >
              <v-btn
                :color="action.color"
                variant="outlined"
                block
                size="large"
                class="mb-3"
                @click="handleQuickAction(action)"
              >
                <v-icon start>{{ action.icon }}</v-icon>
                {{ action.title }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Popular Pages -->
        <v-card class="mb-6 pa-6">
          <h3 class="text-h6 font-weight-bold mb-4">Popular Pages</h3>
          <v-row>
            <v-col
              v-for="page in popularPages"
              :key="page.title"
              cols="12"
              sm="6"
              md="4"
            >
              <v-btn
                variant="text"
                block
                class="mb-2"
                @click="$router.push(page.route)"
              >
                <v-icon start size="small">{{ page.icon }}</v-icon>
                {{ page.title }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Help Section -->
        <v-card class="pa-6">
          <h3 class="text-h6 font-weight-bold mb-4">Need Help?</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            If you're having trouble finding what you're looking for, our support team is here to help.
          </p>
          <div class="d-flex gap-3 justify-center flex-wrap">
            <v-btn
              color="primary"
              @click="$router.push('/contact')"
            >
              Contact Support
            </v-btn>
            <v-btn
              variant="outlined"
              @click="$router.push('/help')"
            >
              Help Center
            </v-btn>
            <v-btn
              variant="text"
              @click="goBack"
            >
              Go Back
            </v-btn>
          </div>
        </v-card>

        <!-- Error Details (for debugging) -->
        <v-expand-transition>
          <v-card v-if="showErrorDetails" class="mt-6 pa-4">
            <h4 class="text-h6 font-weight-bold mb-3">Error Details</h4>
            <div class="text-body-2 text-medium-emphasis">
              <p><strong>Requested URL:</strong> {{ currentPath }}</p>
              <p><strong>Timestamp:</strong> {{ errorTimestamp }}</p>
              <p><strong>User Agent:</strong> {{ userAgent }}</p>
            </div>
            <v-btn
              variant="text"
              size="small"
              @click="copyErrorDetails"
              class="mt-3"
            >
              Copy Error Details
            </v-btn>
          </v-card>
        </v-expand-transition>

        <!-- Debug Toggle -->
        <div class="mt-4">
          <v-btn
            variant="text"
            size="small"
            @click="showErrorDetails = !showErrorDetails"
          >
            {{ showErrorDetails ? 'Hide' : 'Show' }} Error Details
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'NotFoundPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const searchQuery = ref('')
    const searching = ref(false)
    const showErrorDetails = ref(false)

    const currentPath = computed(() => route.fullPath)
    const errorTimestamp = computed(() => new Date().toISOString())
    const userAgent = computed(() => navigator.userAgent)

    const quickActions = [
      {
        title: 'Go Home',
        icon: 'mdi-home',
        color: 'primary',
        action: 'home'
      },
      {
        title: 'Browse Shop',
        icon: 'mdi-store',
        color: 'success',
        action: 'shop'
      },
      {
        title: 'View Cart',
        icon: 'mdi-cart',
        color: 'info',
        action: 'cart'
      },
      {
        title: 'My Account',
        icon: 'mdi-account',
        color: 'warning',
        action: 'account'
      }
    ]

    const popularPages = [
      {
        title: 'Home',
        route: '/home',
        icon: 'mdi-home'
      },
      {
        title: 'Shop',
        route: '/shop',
        icon: 'mdi-store'
      },
      {
        title: 'Categories',
        route: '/category/electronics',
        icon: 'mdi-view-grid'
      },
      {
        title: 'About Us',
        route: '/about',
        icon: 'mdi-information'
      },
      {
        title: 'Contact',
        route: '/contact',
        icon: 'mdi-email'
      },
      {
        title: 'Help',
        route: '/help',
        icon: 'mdi-help-circle'
      }
    ]

    const performSearch = async () => {
      if (!searchQuery.value.trim()) return

      searching.value = true

      // Simulate search
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Navigate to search page with query
      router.push({
        path: '/search',
        query: { q: searchQuery.value }
      })

      searching.value = false
    }

    const handleQuickAction = (action) => {
      switch (action.action) {
        case 'home':
          router.push('/home')
          break
        case 'shop':
          router.push('/shop')
          break
        case 'cart':
          router.push('/cart')
          break
        case 'account':
          if (store.getters.isAuthenticated) {
            router.push('/profile')
          } else {
            router.push('/log-in')
          }
          break
      }
    }

    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push('/home')
      }
    }

    const copyErrorDetails = async () => {
      const errorInfo = `
Error Details:
Requested URL: ${currentPath.value}
Timestamp: ${errorTimestamp.value}
User Agent: ${userAgent.value}
      `.trim()

      try {
        await navigator.clipboard.writeText(errorInfo)
        store.dispatch('showNotification', {
          type: 'success',
          message: 'Error details copied to clipboard'
        })
      } catch (err) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'Failed to copy error details'
        })
      }
    }

    // Lifecycle
    onMounted(() => {
      // Log 404 error for analytics
      console.warn(`404 Error: ${currentPath.value}`)
      
      // You could send this to your analytics service
      // analytics.track('404_error', {
      //   path: currentPath.value,
      //   referrer: document.referrer,
      //   userAgent: userAgent.value
      // })
    })

    return {
      searchQuery,
      searching,
      showErrorDetails,
      currentPath,
      errorTimestamp,
      userAgent,
      quickActions,
      popularPages,
      performSearch,
      handleQuickAction,
      goBack,
      copyErrorDetails
    }
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 80vh;
}
</style> 