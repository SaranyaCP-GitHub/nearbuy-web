<template>
  <v-container class="py-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-icon size="32" color="primary" class="mr-3">mdi-heart</v-icon>
          <div>
            <h1 class="text-h4 font-weight-bold">My Favorites</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              {{ favorites.length }} item{{ favorites.length !== 1 ? 's' : '' }} in your wishlist
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-if="favorites.length === 0" justify="center">
      <v-col cols="12" md="6" class="text-center">
        <v-card class="pa-8" variant="outlined">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-heart-outline</v-icon>
          <h2 class="text-h5 mb-3">No favorites yet</h2>
          <p class="text-body-1 text-grey-darken-1 mb-6">
            Start adding items to your favorites by browsing our products and clicking the heart icon.
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

    <!-- Favorites Grid -->
    <v-row v-else>
      <v-col cols="12">
        <!-- Filters and Sort -->
        <v-card class="mb-6" variant="outlined">
          <v-card-text>
            <v-row align="center">
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="sortBy"
                  :items="sortOptions"
                  label="Sort by"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="filterCategory"
                  :items="categoryOptions"
                  label="Filter by category"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="4" class="text-right">
                <v-btn
                  variant="outlined"
                  color="error"
                  @click="clearAllFavorites"
                  prepend-icon="mdi-delete-sweep"
                  :disabled="favorites.length === 0"
                >
                  Clear All
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Products Grid -->
        <v-row>
          <v-col
            v-for="product in filteredAndSortedFavorites"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="h-100" variant="outlined">
              <!-- Product Image -->
              <v-img
                :src="product.image"
                :alt="product.name"
                height="200"
                cover
                class="position-relative"
              >
                <!-- Favorite Button -->
                <v-btn
                  icon
                  color="white"
                  size="small"
                  class="position-absolute top-0 right-0 ma-2"
                  @click="removeFromFavorites(product.id)"
                >
                  <v-icon color="red">mdi-heart</v-icon>
                </v-btn>
                
                <!-- Sale Badge -->
                <v-chip
                  v-if="product.discount"
                  color="error"
                  size="small"
                  class="position-absolute top-0 left-0 ma-2"
                >
                  -{{ product.discount }}%
                </v-chip>
              </v-img>

              <!-- Product Info -->
              <v-card-text class="pb-2">
                <h3 class="text-h6 font-weight-medium mb-2 line-clamp-2">
                  {{ product.name }}
                </h3>
                <div class="d-flex align-center mb-2">
                  <v-rating
                    :model-value="product.rating"
                    readonly
                    density="compact"
                    size="small"
                    color="amber"
                  ></v-rating>
                  <span class="text-caption text-grey-darken-1 ml-1">
                    ({{ product.reviewCount }})
                  </span>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <span v-if="product.discount" class="text-decoration-line-through text-grey-darken-1 mr-2">
                      ${{ product.originalPrice }}
                    </span>
                    <span class="text-h6 font-weight-bold primary--text">
                      ${{ product.price }}
                    </span>
                  </div>
                  <v-chip
                    :color="product.inStock ? 'success' : 'error'"
                    size="small"
                    variant="tonal"
                  >
                    {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                  </v-chip>
                </div>
              </v-card-text>

              <!-- Action Buttons -->
              <v-card-actions class="pt-0">
                <v-btn
                  block
                  color="primary"
                  @click="viewProduct(product.id)"
                  prepend-icon="mdi-eye"
                >
                  View Details
                </v-btn>
                <v-btn
                  block
                  variant="outlined"
                  @click="addToCart(product)"
                  :disabled="!product.inStock"
                  prepend-icon="mdi-cart-plus"
                  class="mt-2"
                >
                  Add to Cart
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Load More -->
        <v-row v-if="hasMoreFavorites" justify="center" class="mt-6">
          <v-col cols="12" class="text-center">
            <v-btn
              variant="outlined"
              size="large"
              @click="loadMoreFavorites"
              :loading="loading"
            >
              Load More Favorites
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'FavoritesPage',
  data() {
    return {
      sortBy: 'date-added',
      filterCategory: 'all',
      loading: false,
      sortOptions: [
        { title: 'Date Added', value: 'date-added' },
        { title: 'Price: Low to High', value: 'price-low' },
        { title: 'Price: High to Low', value: 'price-high' },
        { title: 'Name: A to Z', value: 'name-asc' },
        { title: 'Name: Z to A', value: 'name-desc' },
        { title: 'Rating: High to Low', value: 'rating' }
      ],
      categoryOptions: [
        { title: 'All Categories', value: 'all' },
        { title: 'Electronics', value: 'electronics' },
        { title: 'Clothing', value: 'clothing' },
        { title: 'Home & Garden', value: 'home' },
        { title: 'Books', value: 'books' },
        { title: 'Sports', value: 'sports' }
      ]
    }
  },
  computed: {
    ...mapGetters(['favoriteItems', 'currentUser']),
    
    favorites() {
      return this.favoriteItems || []
    },
    
    filteredAndSortedFavorites() {
      if (!this.favorites || !Array.isArray(this.favorites)) {
        return []
      }
      
      let filtered = [...this.favorites]
      
      // Filter by category
      if (this.filterCategory !== 'all') {
        filtered = filtered.filter(product => 
          product && product.category === this.filterCategory
        )
      }
      
      // Sort products
      switch (this.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name-desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name))
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'date-added':
        default:
          // Keep original order (most recent first)
          break
      }
      
      return filtered
    },
    
    hasMoreFavorites() {
      // In a real app, this would check if there are more favorites to load
      return false
    }
  },
  
  methods: {
    ...mapActions(['removeFromFavorites', 'addToCart', 'showNotification']),
    
    viewProduct(productId) {
      this.$router.push(`/product/${productId}`)
    },
    
    async clearAllFavorites() {
      try {
        const confirmed = await this.$confirm(
          'Are you sure you want to remove all items from your favorites?',
          'Clear All Favorites',
          {
            confirmText: 'Clear All',
            cancelText: 'Cancel',
            type: 'warning'
          }
        )
        
        if (confirmed) {
          // Remove all favorites
          this.favorites.forEach(product => {
            this.removeFromFavorites(product.id)
          })
          
          this.showNotification({
            type: 'success',
            message: 'All favorites have been removed'
          })
        }
      } catch (error) {
        // User cancelled
      }
    },
    
    async loadMoreFavorites() {
      this.loading = true
      
      try {
        // In a real app, this would load more favorites from the API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showNotification({
          type: 'info',
          message: 'No more favorites to load'
        })
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to load more favorites'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.h-100 {
  height: 100%;
}
</style> 