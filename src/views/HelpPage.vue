<template>
  <v-container>
    <!-- Header -->
    <v-row class="mb-8">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-4">Help Center</h1>
        <p class="text-h6 text-medium-emphasis mb-6">
          Find answers to your questions and learn how to use NearBuy
        </p>
        
        <!-- Search Bar -->
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <v-text-field
              v-model="searchQuery"
              placeholder="Search for help articles..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              hide-details
              @keyup.enter="searchArticles"
              @update:model-value="handleSearchInput"
            >
              <template v-slot:append>
                <v-btn
                  color="primary"
                  @click="searchArticles"
                  :loading="searching"
                >
                  Search
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mb-8">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Quick Actions</h2>
        <v-row>
          <v-col
            v-for="action in quickActions"
            :key="action.title"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card
              class="action-card text-center pa-4 h-100"
              @click="handleQuickAction(action)"
            >
              <v-icon
                :icon="action.icon"
                size="48"
                color="primary"
                class="mb-3"
              />
              <h3 class="text-h6 font-weight-bold mb-2">{{ action.title }}</h3>
              <p class="text-body-2 text-medium-emphasis">
                {{ action.description }}
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Help Categories -->
    <v-row class="mb-8">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Help Categories</h2>
        <v-row>
          <v-col
            v-for="category in helpCategories"
            :key="category.title"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card class="category-card pa-6 h-100">
              <div class="d-flex align-center mb-4">
                <v-icon
                  :icon="category.icon"
                  size="32"
                  color="primary"
                  class="mr-3"
                />
                <h3 class="text-h6 font-weight-bold">{{ category.title }}</h3>
              </div>
              
              <p class="text-body-2 text-medium-emphasis mb-4">
                {{ category.description }}
              </p>
              
              <v-list class="bg-transparent pa-0">
                <v-list-item
                  v-for="article in category.articles"
                  :key="article.title"
                  class="px-0"
                  @click="viewArticle(article)"
                >
                  <template v-slot:prepend>
                    <v-icon size="small" class="mr-2">
                      mdi-file-document-outline
                    </v-icon>
                  </template>
                  <v-list-item-title class="text-body-2">
                    {{ article.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
              
              <v-btn
                variant="text"
                color="primary"
                class="mt-3"
                @click="viewCategory(category)"
              >
                View All {{ category.title }} Articles
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Popular Articles -->
    <v-row class="mb-8">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Popular Articles</h2>
        <v-expansion-panels variant="accordion">
          <v-expansion-panel
            v-for="article in popularArticles"
            :key="article.id"
          >
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <v-icon
                  :icon="article.icon"
                  color="primary"
                  class="mr-3"
                />
                {{ article.title }}
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div v-html="article.content"></div>
              <div class="d-flex align-center justify-space-between mt-4">
                <div class="d-flex align-center">
                  <v-icon size="small" class="mr-1">mdi-thumb-up</v-icon>
                  <span class="text-caption">{{ article.helpfulCount }} found this helpful</span>
                </div>
                <v-btn
                  variant="text"
                  size="small"
                  @click="markHelpful(article)"
                >
                  Was this helpful?
                </v-btn>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- Search Results -->
    <v-row v-if="searchResults.length > 0" class="mb-8">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">
          Search Results ({{ searchResults.length }})
        </h2>
        <v-card
          v-for="result in searchResults"
          :key="result.id"
          class="mb-3"
        >
          <v-card-text>
            <h3 class="text-h6 font-weight-bold mb-2">{{ result.title }}</h3>
            <p class="text-body-2 text-medium-emphasis mb-3">
              {{ result.excerpt }}
            </p>
            <div class="d-flex align-center justify-space-between">
              <v-chip
                :color="result.category.color"
                size="small"
                variant="flat"
              >
                {{ result.category.name }}
              </v-chip>
              <v-btn
                variant="text"
                size="small"
                @click="viewArticle(result)"
              >
                Read More
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Contact Support -->
    <v-row>
      <v-col cols="12">
        <v-card class="support-card text-center pa-8">
          <h2 class="text-h4 font-weight-bold mb-4">Still Need Help?</h2>
          <p class="text-body-1 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div class="d-flex gap-4 justify-center flex-wrap">
            <v-btn
              color="primary"
              size="large"
              @click="$router.push('/contact')"
            >
              Contact Support
            </v-btn>
            <v-btn
              variant="outlined"
              size="large"
              @click="openLiveChat"
            >
              Live Chat
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'HelpPage',
  setup() {
    const store = useStore()
    const searchQuery = ref('')
    const searching = ref(false)
    const searchResults = ref([])

    const quickActions = [
      {
        title: 'Track Order',
        description: 'Check the status of your recent orders',
        icon: 'mdi-package-variant',
        action: 'track-order'
      },
      {
        title: 'Return Item',
        description: 'Start a return for items you\'ve purchased',
        icon: 'mdi-undo',
        action: 'return-item'
      },
      {
        title: 'Update Account',
        description: 'Change your account settings and preferences',
        icon: 'mdi-account-cog',
        action: 'update-account'
      },
      {
        title: 'Report Issue',
        description: 'Report a problem with your order or account',
        icon: 'mdi-alert-circle',
        action: 'report-issue'
      }
    ]

    const helpCategories = [
      {
        title: 'Getting Started',
        icon: 'mdi-rocket-launch',
        description: 'Learn the basics of using NearBuy',
        articles: [
          { title: 'How to create an account', id: 'create-account' },
          { title: 'Setting up your profile', id: 'setup-profile' },
          { title: 'Understanding the interface', id: 'interface-guide' },
          { title: 'First-time shopping guide', id: 'first-shopping' }
        ]
      },
      {
        title: 'Shopping & Orders',
        icon: 'mdi-shopping',
        description: 'Everything about shopping and managing orders',
        articles: [
          { title: 'How to place an order', id: 'place-order' },
          { title: 'Tracking your order', id: 'track-order' },
          { title: 'Canceling an order', id: 'cancel-order' },
          { title: 'Understanding shipping', id: 'shipping-info' }
        ]
      },
      {
        title: 'Returns & Refunds',
        icon: 'mdi-undo',
        description: 'Information about returns and refunds',
        articles: [
          { title: 'Return policy overview', id: 'return-policy' },
          { title: 'How to start a return', id: 'start-return' },
          { title: 'Refund processing time', id: 'refund-time' },
          { title: 'Return shipping options', id: 'return-shipping' }
        ]
      },
      {
        title: 'Account & Security',
        icon: 'mdi-shield-account',
        description: 'Managing your account and security settings',
        articles: [
          { title: 'Updating account information', id: 'update-account' },
          { title: 'Password security', id: 'password-security' },
          { title: 'Two-factor authentication', id: '2fa-setup' },
          { title: 'Privacy settings', id: 'privacy-settings' }
        ]
      },
      {
        title: 'Payment & Billing',
        icon: 'mdi-credit-card',
        description: 'Payment methods and billing information',
        articles: [
          { title: 'Accepted payment methods', id: 'payment-methods' },
          { title: 'Adding payment information', id: 'add-payment' },
          { title: 'Billing and invoices', id: 'billing-invoices' },
          { title: 'Payment security', id: 'payment-security' }
        ]
      },
      {
        title: 'Business & Partnership',
        icon: 'mdi-store',
        description: 'Information for businesses and partners',
        articles: [
          { title: 'Becoming a seller', id: 'become-seller' },
          { title: 'Seller dashboard guide', id: 'seller-dashboard' },
          { title: 'Commission structure', id: 'commission-structure' },
          { title: 'Business partnership', id: 'business-partnership' }
        ]
      }
    ]

    const popularArticles = [
      {
        id: 'create-account',
        title: 'How to Create an Account',
        icon: 'mdi-account-plus',
        content: `
          <p>Creating an account on NearBuy is quick and easy:</p>
          <ol>
            <li>Click the "Sign Up" button in the top navigation</li>
            <li>Enter your email address and create a password</li>
            <li>Fill in your basic information (name, phone number)</li>
            <li>Verify your email address by clicking the link in your inbox</li>
            <li>Complete your profile by adding your address and preferences</li>
          </ol>
          <p><strong>Note:</strong> You can also sign up using your Google or Facebook account for faster registration.</p>
        `,
        helpfulCount: 1247
      },
      {
        id: 'track-order',
        title: 'How to Track Your Order',
        icon: 'mdi-package-variant',
        content: `
          <p>There are several ways to track your order:</p>
          <h4>Through Your Account:</h4>
          <ol>
            <li>Log into your NearBuy account</li>
            <li>Go to "Orders" in your profile</li>
            <li>Find the order you want to track</li>
            <li>Click "Track Order" to see detailed status</li>
          </ol>
          <h4>Via Email:</h4>
          <p>You'll receive email updates at each stage of your order's journey.</p>
          <h4>Tracking Number:</h4>
          <p>Use the tracking number provided in your order confirmation to track directly with the shipping carrier.</p>
        `,
        helpfulCount: 892
      },
      {
        id: 'return-policy',
        title: 'Return Policy Overview',
        icon: 'mdi-undo',
        content: `
          <p>Our return policy is designed to ensure your satisfaction:</p>
          <h4>Return Window:</h4>
          <ul>
            <li>Most items: 30 days from delivery</li>
            <li>Electronics: 14 days from delivery</li>
            <li>Custom items: Non-returnable</li>
          </ul>
          <h4>Return Conditions:</h4>
          <ul>
            <li>Item must be unused and in original packaging</li>
            <li>All original accessories must be included</li>
            <li>Item must not be damaged or modified</li>
          </ul>
          <h4>Refund Process:</h4>
          <p>Refunds are processed within 5-7 business days after we receive your return.</p>
        `,
        helpfulCount: 756
      }
    ]

    const searchArticles = async () => {
      if (!searchQuery.value.trim()) {
        searchResults.value = []
        return
      }

      searching.value = true

      // Simulate search
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock search results
      searchResults.value = [
        {
          id: 'search-1',
          title: 'How to reset your password',
          excerpt: 'Learn how to reset your password if you\'ve forgotten it or need to change it for security reasons.',
          category: { name: 'Account & Security', color: 'primary' }
        },
        {
          id: 'search-2',
          title: 'Understanding shipping costs',
          excerpt: 'Get information about shipping costs, delivery times, and shipping options available for your location.',
          category: { name: 'Shopping & Orders', color: 'success' }
        }
      ]

      searching.value = false
    }

    const handleSearchInput = () => {
      // Debounced search could be implemented here
    }

    const handleQuickAction = (action) => {
      switch (action.action) {
        case 'track-order':
          store.dispatch('showNotification', {
            type: 'info',
            message: 'Redirecting to order tracking...'
          })
          break
        case 'return-item':
          store.dispatch('showNotification', {
            type: 'info',
            message: 'Redirecting to returns page...'
          })
          break
        case 'update-account':
          store.dispatch('showNotification', {
            type: 'info',
            message: 'Redirecting to account settings...'
          })
          break
        case 'report-issue':
          store.dispatch('showNotification', {
            type: 'info',
            message: 'Redirecting to issue reporting...'
          })
          break
      }
    }

    const viewArticle = (article) => {
      // Navigate to article detail or expand in place
      store.dispatch('showNotification', {
        type: 'info',
        message: `Opening article: ${article.title}`
      })
    }

    const viewCategory = (category) => {
      store.dispatch('showNotification', {
        type: 'info',
        message: `Opening category: ${category.title}`
      })
    }

    const markHelpful = (article) => {
      article.helpfulCount++
      store.dispatch('showNotification', {
        type: 'success',
        message: 'Thank you for your feedback!'
      })
    }

    const openLiveChat = () => {
      store.dispatch('showNotification', {
        type: 'info',
        message: 'Live chat feature coming soon!'
      })
    }

    return {
      searchQuery,
      searching,
      searchResults,
      quickActions,
      helpCategories,
      popularArticles,
      searchArticles,
      handleSearchInput,
      handleQuickAction,
      viewArticle,
      viewCategory,
      markHelpful,
      openLiveChat
    }
  }
}
</script>

<style scoped>
.action-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.category-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.support-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style> 