<template>
  <v-container fluid class="pa-0">
    <!-- Search Header -->
    <v-card flat class="search-header mb-4">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="8" lg="6">
            <v-text-field
              v-model="searchQuery"
              placeholder="Search for products..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              hide-details
              @keyup.enter="performSearch"
              @update:model-value="handleSearchInput"
            >
              <template v-slot:append>
                <v-btn
                  color="primary"
                  @click="performSearch"
                  :loading="loading"
                >
                  Search
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4" lg="6">
            <div class="d-flex align-center justify-end">
              <v-chip-group v-model="selectedFilters.category" multiple>
                <v-chip
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                  variant="outlined"
                  size="small"
                >
                  {{ category }}
                </v-chip>
              </v-chip-group>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-container>
      <v-row>
        <!-- Filters Sidebar -->
        <v-col cols="12" md="3">
          <v-card class="filters-card">
            <v-card-title class="text-h6">
              <v-icon start>mdi-filter</v-icon>
              Filters
            </v-card-title>
            
            <v-card-text>
              <!-- Category Filter -->
              <v-expansion-panels variant="accordion">
                <v-expansion-panel>
                  <v-expansion-panel-title>Category</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-checkbox
                      v-for="category in categories"
                      :key="category"
                      v-model="selectedFilters.category"
                      :label="category"
                      :value="category"
                      hide-details
                      density="compact"
                    />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Price Range -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Price Range</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-range-slider
                      v-model="priceRange"
                      :min="0"
                      :max="1000"
                      :step="10"
                      thumb-label
                      show-ticks
                    />
                    <div class="d-flex justify-space-between mt-2">
                      <span>${{ priceRange[0] }}</span>
                      <span>${{ priceRange[1] }}</span>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Rating Filter -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Rating</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-checkbox
                      v-for="rating in [4, 3, 2, 1]"
                      :key="rating"
                      v-model="selectedFilters.rating"
                      :label="`${rating}+ stars`"
                      :value="rating"
                      hide-details
                      density="compact"
                    />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Brand Filter -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Brand</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-checkbox
                      v-for="brand in brands"
                      :key="brand"
                      v-model="selectedFilters.brand"
                      :label="brand"
                      :value="brand"
                      hide-details
                      density="compact"
                    />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Availability -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Availability</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-checkbox
                      v-model="selectedFilters.inStock"
                      label="In Stock"
                      hide-details
                      density="compact"
                    />
                    <v-checkbox
                      v-model="selectedFilters.freeShipping"
                      label="Free Shipping"
                      hide-details
                      density="compact"
                    />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Clear Filters -->
              <v-btn
                block
                variant="outlined"
                color="error"
                class="mt-4"
                @click="clearFilters"
              >
                Clear All Filters
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Search Results -->
        <v-col cols="12" md="9">
          <!-- Results Header -->
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <h2 class="text-h5 mb-1">Search Results</h2>
              <p class="text-body-2 text-medium-emphasis">
                {{ totalResults }} results found for "{{ searchQuery }}"
              </p>
            </div>
            
            <!-- Sort Options -->
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Sort by"
              variant="outlined"
              density="compact"
              style="max-width: 200px"
              hide-details
            />
          </div>

          <!-- Loading State -->
          <v-row v-if="loading">
            <v-col
              v-for="n in 6"
              :key="n"
              cols="12"
              sm="6"
              md="4"
            >
              <v-skeleton-loader
                type="card"
                class="mx-auto"
              />
            </v-col>
          </v-row>

          <!-- No Results -->
          <v-card v-else-if="searchResults.length === 0" class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">
              mdi-magnify-close
            </v-icon>
            <h3 class="text-h6 mb-2">No results found</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Try adjusting your search terms or filters
            </p>
            <v-btn
              color="primary"
              @click="clearFilters"
            >
              Clear Filters
            </v-btn>
          </v-card>

          <!-- Search Results Grid -->
          <v-row v-else>
            <v-col
              v-for="product in searchResults"
              :key="product.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card
                class="product-card h-100"
                @click="viewProduct(product.id)"
              >
                <v-img
                  :src="product.image"
                  :alt="product.name"
                  height="200"
                  cover
                  class="bg-grey-lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey-lighten-4"
                      />
                    </v-row>
                  </template>
                </v-img>

                <v-card-text class="pa-4">
                  <h3 class="text-h6 mb-2 line-clamp-2">{{ product.name }}</h3>
                  
                  <div class="d-flex align-center mb-2">
                    <v-rating
                      :model-value="product.rating"
                      readonly
                      density="compact"
                      size="small"
                    />
                    <span class="text-caption ml-1">({{ product.reviewCount }})</span>
                  </div>

                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="text-h6 font-weight-bold text-primary">
                      ${{ product.price }}
                    </span>
                    <v-chip
                      v-if="product.discount"
                      color="error"
                      size="small"
                      variant="flat"
                    >
                      -{{ product.discount }}%
                    </v-chip>
                  </div>

                  <p class="text-body-2 text-medium-emphasis line-clamp-2 mb-3">
                    {{ product.description }}
                  </p>

                  <div class="d-flex gap-2">
                    <v-btn
                      block
                      color="primary"
                      variant="flat"
                      size="small"
                      @click.stop="addToCart(product)"
                    >
                      Add to Cart
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      @click.stop="toggleFavorite(product)"
                    >
                      <v-icon
                        :color="product.isFavorite ? 'red' : 'grey'"
                        :icon="product.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
                      />
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Pagination -->
          <div class="d-flex justify-center mt-6">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="7"
              @update:model-value="handlePageChange"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'SearchPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    // Reactive data
    const searchQuery = ref('')
    const loading = ref(false)
    const currentPage = ref(1)
    const sortBy = ref('relevance')
    const priceRange = ref([0, 1000])

    const selectedFilters = reactive({
      category: [],
      rating: [],
      brand: [],
      inStock: false,
      freeShipping: false
    })

    // Mock data
    const categories = [
      'Electronics',
      'Clothing',
      'Home & Garden',
      'Sports',
      'Books',
      'Toys',
      'Beauty',
      'Automotive'
    ]

    const brands = [
      'Apple',
      'Samsung',
      'Nike',
      'Adidas',
      'Sony',
      'LG',
      'Dell',
      'HP'
    ]

    const sortOptions = [
      { title: 'Relevance', value: 'relevance' },
      { title: 'Price: Low to High', value: 'price_asc' },
      { title: 'Price: High to Low', value: 'price_desc' },
      { title: 'Rating', value: 'rating' },
      { title: 'Newest', value: 'newest' },
      { title: 'Most Popular', value: 'popular' }
    ]

    // Mock search results
    const searchResults = ref([
      {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and long battery life.',
        price: 89.99,
        originalPrice: 129.99,
        discount: 31,
        rating: 4.5,
        reviewCount: 1247,
        image: 'https://picsum.photos/300/200?random=1',
        category: 'Electronics',
        brand: 'Sony',
        inStock: true,
        freeShipping: true,
        isFavorite: false
      },
      {
        id: 2,
        name: 'Smart Fitness Watch',
        description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.',
        price: 199.99,
        originalPrice: 249.99,
        discount: 20,
        rating: 4.3,
        reviewCount: 892,
        image: 'https://picsum.photos/300/200?random=2',
        category: 'Electronics',
        brand: 'Apple',
        inStock: true,
        freeShipping: true,
        isFavorite: true
      },
      {
        id: 3,
        name: 'Organic Cotton T-Shirt',
        description: 'Comfortable and eco-friendly cotton t-shirt available in multiple colors.',
        price: 24.99,
        originalPrice: 24.99,
        discount: 0,
        rating: 4.7,
        reviewCount: 456,
        image: 'https://picsum.photos/300/200?random=3',
        category: 'Clothing',
        brand: 'Nike',
        inStock: true,
        freeShipping: false,
        isFavorite: false
      },
      {
        id: 4,
        name: 'Gaming Laptop',
        description: 'High-performance gaming laptop with RTX graphics and fast SSD storage.',
        price: 1299.99,
        originalPrice: 1499.99,
        discount: 13,
        rating: 4.6,
        reviewCount: 234,
        image: 'https://picsum.photos/300/200?random=4',
        category: 'Electronics',
        brand: 'Dell',
        inStock: false,
        freeShipping: true,
        isFavorite: false
      },
      {
        id: 5,
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
        price: 39.99,
        originalPrice: 59.99,
        discount: 33,
        rating: 4.2,
        reviewCount: 678,
        image: 'https://picsum.photos/300/200?random=5',
        category: 'Electronics',
        brand: 'Samsung',
        inStock: true,
        freeShipping: true,
        isFavorite: false
      },
      {
        id: 6,
        name: 'Running Shoes',
        description: 'Lightweight running shoes with excellent cushioning and breathable mesh.',
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        rating: 4.4,
        reviewCount: 1123,
        image: 'https://picsum.photos/300/200?random=6',
        category: 'Sports',
        brand: 'Adidas',
        inStock: true,
        freeShipping: true,
        isFavorite: false
      }
    ])

    // Computed properties
    const totalResults = computed(() => searchResults.value.length)
    const totalPages = computed(() => Math.ceil(totalResults.value / 12))

    // Methods
    const performSearch = async () => {
      if (!searchQuery.value.trim()) return
      
      loading.value = true
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock search logic
      const query = searchQuery.value.toLowerCase()
      const filteredResults = searchResults.value.filter(product => {
        const matchesQuery = product.name.toLowerCase().includes(query) ||
                           product.description.toLowerCase().includes(query) ||
                           product.category.toLowerCase().includes(query) ||
                           product.brand.toLowerCase().includes(query)
        
        const matchesCategory = selectedFilters.category.length === 0 ||
                               selectedFilters.category.includes(product.category)
        
        const matchesBrand = selectedFilters.brand.length === 0 ||
                            selectedFilters.brand.includes(product.brand)
        
        const matchesRating = selectedFilters.rating.length === 0 ||
                             selectedFilters.rating.some(rating => product.rating >= rating)
        
        const matchesPrice = product.price >= priceRange.value[0] &&
                           product.price <= priceRange.value[1]
        
        const matchesStock = !selectedFilters.inStock || product.inStock
        const matchesShipping = !selectedFilters.freeShipping || product.freeShipping
        
        return matchesQuery && matchesCategory && matchesBrand && 
               matchesRating && matchesPrice && matchesStock && matchesShipping
      })
      
      searchResults.value = filteredResults
      loading.value = false
    }

    const handleSearchInput = () => {
      // Debounced search could be implemented here
    }

    const handlePageChange = (page) => {
      currentPage.value = page
      // Implement pagination logic
    }

    const clearFilters = () => {
      selectedFilters.category = []
      selectedFilters.rating = []
      selectedFilters.brand = []
      selectedFilters.inStock = false
      selectedFilters.freeShipping = false
      priceRange.value = [0, 1000]
      performSearch()
    }

    const viewProduct = (productId) => {
      router.push(`/product/${productId}`)
    }

    const addToCart = (product) => {
      store.dispatch('addToCart', {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      })
      
      store.dispatch('showNotification', {
        type: 'success',
        message: `${product.name} added to cart`
      })
    }

    const toggleFavorite = (product) => {
      product.isFavorite = !product.isFavorite
      
      if (product.isFavorite) {
        store.dispatch('addToFavorites', product)
        store.dispatch('showNotification', {
          type: 'success',
          message: `${product.name} added to favorites`
        })
      } else {
        store.dispatch('removeFromFavorites', product.id)
        store.dispatch('showNotification', {
          type: 'info',
          message: `${product.name} removed from favorites`
        })
      }
    }

    // Lifecycle
    onMounted(() => {
      // Get search query from route params if available
      if (route.query.q) {
        searchQuery.value = route.query.q
        performSearch()
      }
    })

    // Watchers
    watch([selectedFilters, priceRange, sortBy], () => {
      performSearch()
    }, { deep: true })

    return {
      searchQuery,
      loading,
      currentPage,
      sortBy,
      priceRange,
      selectedFilters,
      categories,
      brands,
      sortOptions,
      searchResults,
      totalResults,
      totalPages,
      performSearch,
      handleSearchInput,
      handlePageChange,
      clearFilters,
      viewProduct,
      addToCart,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.search-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.filters-card {
  position: sticky;
  top: 20px;
}

.product-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.v-chip-group {
  flex-wrap: wrap;
}
</style> 