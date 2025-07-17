<template>
  <div class="layout-wrapper">
    <!-- App Bar -->
    <v-app-bar
      color="white"
      elevation="1"
      class="px-4"
    >
      <!-- Logo -->
      <div class="logo" @click="$router.push('/home')">
        <span class="logo-blue">Near</span><span class="logo-black">Buy</span>
      </div>

      <!-- Navigation Links (Desktop) -->
      <v-tabs
        v-model="activeTab"
        class="ml-8"
        hide-slider
      >
        <v-tab
          value="shop"
          @click="$router.push('/shop')"
        >
          Shop
        </v-tab>
        <v-tab
          value="favorites"
          @click="$router.push('/favorites')"
        >
          Favorites
        </v-tab>
        <v-tab
          value="about"
          @click="$router.push('/about')"
        >
          About
        </v-tab>
        <v-tab
          value="contact"
          @click="$router.push('/contact')"
        >
          Contact
        </v-tab>
      </v-tabs>

      <v-spacer />

      <!-- Search Bar -->
      <div class="search-container">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search products..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 300px"
          @keyup.enter="performSearch"
          @update:model-value="handleSearchInput"
        >
          <template v-slot:append v-if="searchQuery">
            <v-btn
              icon="mdi-close"
              size="small"
              variant="text"
              @click="clearSearch"
            />
          </template>
        </v-text-field>
        
        <!-- Search Suggestions -->
        <v-card
          v-if="showSearchSuggestions && searchSuggestions.length > 0"
          class="search-suggestions"
          elevation="4"
        >
          <v-list>
            <v-list-item
              v-for="suggestion in searchSuggestions"
              :key="suggestion.id"
              @click="selectSuggestion(suggestion)"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-magnify" size="small" />
              </template>
              <v-list-item-title>{{ suggestion.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </div>

      <!-- User Actions -->
      <div class="d-flex align-center ml-4">
        <!-- Cart -->
        <v-badge
          :content="cartItemCount"
          :model-value="cartItemCount > 0"
          color="error"
          class="mr-2"
        >
          <v-btn
            icon="mdi-cart-outline"
            variant="text"
            size="large"
            color="primary"
            @click="$router.push('/cart')"
          />
        </v-badge>

        <!-- User Menu -->
        <div v-if="isAuthenticated">
          <v-menu
            v-model="showUserMenu"
            :close-on-content-click="false"
            location="bottom end"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-account-circle"
                variant="text"
                size="large"
                color="primary"
              />
            </template>
            
            <v-card min-width="250">
              <v-list>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">
                    {{ currentUser?.name || 'User' }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ currentUser?.email }}
                  </v-list-item-subtitle>
                </v-list-item>
                
                <v-divider />
                
                <v-list-item
                  @click="$router.push('/profile')"
                  prepend-icon="mdi-account"
                >
                  <v-list-item-title>Profile</v-list-item-title>
                </v-list-item>
                
                <v-list-item
                  @click="$router.push('/orders')"
                  prepend-icon="mdi-package-variant"
                >
                  <v-list-item-title>My Orders</v-list-item-title>
                </v-list-item>
                
                <v-list-item
                  @click="$router.push('/favorites')"
                  prepend-icon="mdi-heart"
                >
                  <v-list-item-title>Favorites</v-list-item-title>
                </v-list-item>
                
                <v-list-item
                  @click="$router.push('/settings')"
                  prepend-icon="mdi-cog"
                >
                  <v-list-item-title>Settings</v-list-item-title>
                </v-list-item>
                
                <v-divider />
                
                <v-list-item
                  @click="logout"
                  prepend-icon="mdi-logout"
                  color="error"
                >
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </div>

        <!-- Login/Signup Buttons -->
        <div v-else class="d-flex gap-2">
          <v-btn
            variant="text"
            @click="$router.push('/log-in')"
            color="primary"
          >
            Login
          </v-btn>
          <v-btn
            color="primary"
            @click="$router.push('/sign-up')"
            variant="elevated"
          >
            Sign Up
          </v-btn>
        </div>

        <!-- Mobile Menu Button -->
        <v-btn
          class="ml-2 d-md-none"
          icon="mdi-menu"
          variant="text"
          @click="showMobileMenu = !showMobileMenu"
        />
      </div>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="showMobileMenu"
      location="right"
      temporary
      width="300"
    >
      <v-list>
        <v-list-item
          v-for="item in mobileMenuItems"
          :key="item.title"
          @click="handleMobileMenuClick(item)"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" />
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <slot />
    </v-main>

    <!-- Footer -->
    <v-footer class="bg-grey-lighten-4">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <h3 class="text-h6 font-weight-bold mb-3">NearBuy</h3>
            <p class="text-body-2 text-medium-emphasis">
              Connecting local businesses with customers in your neighborhood.
            </p>
          </v-col>
          <v-col cols="12" md="2">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Quick Links</h4>
            <v-list class="bg-transparent pa-0">
              <v-list-item
                v-for="link in footerLinks.quick"
                :key="link.title"
                :to="link.route"
                class="px-0"
                density="compact"
              >
                <v-list-item-title class="text-body-2">{{ link.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="2">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Support</h4>
            <v-list class="bg-transparent pa-0">
              <v-list-item
                v-for="link in footerLinks.support"
                :key="link.title"
                :to="link.route"
                class="px-0"
                density="compact"
              >
                <v-list-item-title class="text-body-2">{{ link.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="2">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Legal</h4>
            <v-list class="bg-transparent pa-0">
              <v-list-item
                v-for="link in footerLinks.legal"
                :key="link.title"
                :to="link.route"
                class="px-0"
                density="compact"
              >
                <v-list-item-title class="text-body-2">{{ link.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="2">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Follow Us</h4>
            <div class="d-flex gap-2">
              <v-btn
                v-for="social in socialLinks"
                :key="social.platform"
                :icon="social.icon"
                variant="text"
                size="small"
                :href="social.url"
                target="_blank"
              />
            </div>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <div class="text-center text-body-2 text-medium-emphasis">
          © {{ new Date().getFullYear() }} NearBuy. All rights reserved.
        </div>
      </v-container>
    </v-footer>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'DefaultLayout',
  setup() {
    const store = useStore()
    const router = useRouter()

    const searchQuery = ref('')
    const showSearchSuggestions = ref(false)
    const searchSuggestions = ref([])
    const showUserMenu = ref(false)
    const showMobileMenu = ref(false)
    const activeTab = ref('shop')

    // Computed properties
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const currentUser = computed(() => store.getters.currentUser)
    const cartItemCount = computed(() => store.getters.cartItemCount)

    // Mobile menu items
    const mobileMenuItems = [
      { title: 'Shop', icon: 'mdi-store', route: '/shop' },
      { title: 'Favorites', icon: 'mdi-heart', route: '/favorites' },
      { title: 'About', icon: 'mdi-information', route: '/about' },
      { title: 'Contact', icon: 'mdi-email', route: '/contact' },
      { title: 'Help', icon: 'mdi-help-circle', route: '/help' }
    ]

    // Footer links
    const footerLinks = {
      quick: [
        { title: 'Shop', route: '/shop' },
        { title: 'Categories', route: '/category/electronics' },
        { title: 'Deals', route: '/shop' },
        { title: 'New Arrivals', route: '/shop' }
      ],
      support: [
        { title: 'Help Center', route: '/help' },
        { title: 'Contact Us', route: '/contact' },
        { title: 'Shipping Info', route: '/help' },
        { title: 'Returns', route: '/help' }
      ],
      legal: [
        { title: 'Privacy Policy', route: '/privacy' },
        { title: 'Terms of Service', route: '/terms' },
        { title: 'Cookie Policy', route: '/privacy' }
      ]
    }

    const socialLinks = [
      { platform: 'facebook', icon: 'mdi-facebook', url: '#' },
      { platform: 'twitter', icon: 'mdi-twitter', url: '#' },
      { platform: 'instagram', icon: 'mdi-instagram', url: '#' },
      { platform: 'linkedin', icon: 'mdi-linkedin', url: '#' }
    ]

    // Methods
    const performSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          path: '/search',
          query: { q: searchQuery.value }
        })
        clearSearch()
      }
    }

    const handleSearchInput = () => {
      // Implement search suggestions logic here
      if (searchQuery.value.length > 2) {
        searchSuggestions.value = [
          { id: 1, title: 'Wireless Headphones' },
          { id: 2, title: 'Smart Watch' },
          { id: 3, title: 'Laptop' }
        ]
        showSearchSuggestions.value = true
      } else {
        showSearchSuggestions.value = false
      }
    }

    const clearSearch = () => {
      searchQuery.value = ''
      showSearchSuggestions.value = false
    }

    const selectSuggestion = (suggestion) => {
      searchQuery.value = suggestion.title
      performSearch()
    }

    const logout = () => {
      store.dispatch('logout')
      showUserMenu.value = false
      router.push('/home')
    }

    const handleMobileMenuClick = (item) => {
      router.push(item.route)
      showMobileMenu.value = false
    }

    // Lifecycle
    onMounted(() => {
      // Close search suggestions when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
          showSearchSuggestions.value = false
        }
      })
    })

    onUnmounted(() => {
      document.removeEventListener('click', () => {})
    })

    return {
      searchQuery,
      showSearchSuggestions,
      searchSuggestions,
      showUserMenu,
      showMobileMenu,
      activeTab,
      isAuthenticated,
      currentUser,
      cartItemCount,
      mobileMenuItems,
      footerLinks,
      socialLinks,
      performSearch,
      handleSearchInput,
      clearSearch,
      selectSuggestion,
      logout,
      handleMobileMenuClick
    }
  }
}
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
}

.logo-blue {
  color: #1976d2;
}

.logo-black {
  color: #333;
}

.search-container {
  position: relative;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.v-navigation-drawer {
  z-index: 1001;
}

.v-main {
  flex: 1;
}
</style>
