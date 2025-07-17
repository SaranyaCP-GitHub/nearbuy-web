<template>
  <v-container fluid class="pa-0">
    <!-- Category Header -->
    <v-card flat class="category-header mb-4">
      <v-container>
        <v-row align="center">
          <v-col cols="12">
            <div class="d-flex align-center mb-2">
              <v-icon size="32" class="mr-3">{{ categoryIcon }}</v-icon>
              <div>
                <h1 class="text-h4 font-weight-bold">{{ categoryName }}</h1>
                <p class="text-body-1 text-medium-emphasis">
                  {{ categoryDescription }}
                </p>
              </div>
            </div>
            
            <!-- Breadcrumb -->
            <v-breadcrumbs :items="breadcrumbs" class="pa-0">
              <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>
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
              <!-- Subcategories -->
              <v-expansion-panels variant="accordion">
                <v-expansion-panel>
                  <v-expansion-panel-title>Subcategories</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-checkbox
                      v-for="subcategory in subcategories"
                      :key="subcategory"
                      v-model="selectedFilters.subcategory"
                      :label="subcategory"
                      :value="subcategory"
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
                      :max="maxPrice"
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
                      v-for="brand in availableBrands"
                      :key="brand"
                      v-model="selectedFilters.brand"
                      :label="brand"
                      :value="brand"
                      hide-details
                      density="compact"
                    />
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Features -->
                <v-expansion-panel>
                  <v-expansion-panel-title>Features</v-expansion-panel-title>
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
                    <v-checkbox
                      v-model="selectedFilters.onSale"
                      label="On Sale"
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

        <!-- Products Grid -->
        <v-col cols="12" md="9">
          <!-- Results Header -->
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <h2 class="text-h5 mb-1">{{ categoryName }}</h2>
              <p class="text-body-2 text-medium-emphasis">
                {{ filteredProducts.length }} products found
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
          <v-card v-else-if="filteredProducts.length === 0" class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">
              mdi-package-variant-closed
            </v-icon>
            <h3 class="text-h6 mb-2">No products found</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Try adjusting your filters or browse other categories
            </p>
            <v-btn
              color="primary"
              @click="clearFilters"
            >
              Clear Filters
            </v-btn>
          </v-card>

          <!-- Products Grid -->
          <v-row v-else>
            <v-col
              v-for="product in paginatedProducts"
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
                  
                  <!-- Sale Badge -->
                  <template v-slot:overlay>
                    <v-chip
                      v-if="product.discount > 0"
                      color="error"
                      size="small"
                      class="ma-2"
                    >
                      -{{ product.discount }}%
                    </v-chip>
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
                    <div>
                      <span class="text-h6 font-weight-bold text-primary">
                        ${{ product.price }}
                      </span>
                      <span
                        v-if="product.originalPrice > product.price"
                        class="text-body-2 text-decoration-line-through text-medium-emphasis ml-2"
                      >
                        ${{ product.originalPrice }}
                      </span>
                    </div>
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
                      :disabled="!product.inStock"
                    >
                      {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
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
  name: 'CategoryPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    // Reactive data
    const loading = ref(false)
    const currentPage = ref(1)
    const sortBy = ref('relevance')
    const priceRange = ref([0, 1000])

    const selectedFilters = reactive({
      subcategory: [],
      rating: [],
      brand: [],
      inStock: false,
      freeShipping: false,
      onSale: false
    })

    // Category data
    const categoryData = {
      electronics: {
        name: 'Electronics',
        icon: 'mdi-laptop',
        description: 'Discover the latest in technology and gadgets',
        subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Audio', 'Cameras', 'Gaming'],
        brands: ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Asus', 'Lenovo']
      },
      clothing: {
        name: 'Clothing',
        icon: 'mdi-tshirt-crew',
        description: 'Fashion for every style and occasion',
        subcategories: ['Men', 'Women', 'Kids', 'Shoes', 'Accessories', 'Sportswear'],
        brands: ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Levi\'s', 'Gap', 'Puma']
      },
      home: {
        name: 'Home & Garden',
        icon: 'mdi-home',
        description: 'Everything you need for your perfect home',
        subcategories: ['Furniture', 'Kitchen', 'Bathroom', 'Garden', 'Decor', 'Lighting'],
        brands: ['IKEA', 'Target', 'Wayfair', 'Home Depot', 'Lowe\'s', 'Williams-Sonoma']
      },
      sports: {
        name: 'Sports & Outdoors',
        icon: 'mdi-basketball',
        description: 'Equipment and gear for active lifestyles',
        subcategories: ['Fitness', 'Running', 'Cycling', 'Swimming', 'Team Sports', 'Camping'],
        brands: ['Nike', 'Adidas', 'Under Armour', 'Puma', 'Reebok', 'Columbia']
      }
    }

    // Mock products data
    const products = ref([
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
        category: 'electronics',
        subcategory: 'Audio',
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
        category: 'electronics',
        subcategory: 'Smartphones',
        brand: 'Apple',
        inStock: true,
        freeShipping: true,
        isFavorite: true
      },
      {
        id: 3,
        name: 'Gaming Laptop',
        description: 'High-performance gaming laptop with RTX graphics and fast SSD storage.',
        price: 1299.99,
        originalPrice: 1499.99,
        discount: 13,
        rating: 4.6,
        reviewCount: 234,
        image: 'https://picsum.photos/300/200?random=3',
        category: 'electronics',
        subcategory: 'Laptops',
        brand: 'Dell',
        inStock: false,
        freeShipping: true,
        isFavorite: false
      },
      {
        id: 4,
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
        price: 39.99,
        originalPrice: 59.99,
        discount: 33,
        rating: 4.2,
        reviewCount: 678,
        image: 'https://picsum.photos/300/200?random=4',
        category: 'electronics',
        subcategory: 'Smartphones',
        brand: 'Samsung',
        inStock: true,
        freeShipping: true,
        isFavorite: false
      },
      {
        id: 5,
        name: 'Organic Cotton T-Shirt',
        description: 'Comfortable and eco-friendly cotton t-shirt available in multiple colors.',
        price: 24.99,
        originalPrice: 24.99,
        discount: 0,
        rating: 4.7,
        reviewCount: 456,
        image: 'https://picsum.photos/300/200?random=5',
        category: 'clothing',
        subcategory: 'Men',
        brand: 'Nike',
        inStock: true,
        freeShipping: false,
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
        category: 'sports',
        subcategory: 'Running',
        brand: 'Adidas',
        inStock: true,
        freeShipping: true,
        isFavorite: false
      }
    ])

    const sortOptions = [
      { title: 'Relevance', value: 'relevance' },
      { title: 'Price: Low to High', value: 'price_asc' },
      { title: 'Price: High to Low', value: 'price_desc' },
      { title: 'Rating', value: 'rating' },
      { title: 'Newest', value: 'newest' },
      { title: 'Most Popular', value: 'popular' }
    ]

    // Computed properties
    const category = computed(() => route.params.category)
    const categoryInfo = computed(() => categoryData[category.value] || categoryData.electronics)
    const categoryName = computed(() => categoryInfo.value.name)
    const categoryIcon = computed(() => categoryInfo.value.icon)
    const categoryDescription = computed(() => categoryInfo.value.description)
    const subcategories = computed(() => categoryInfo.value.subcategories)
    const availableBrands = computed(() => categoryInfo.value.brands)

    const breadcrumbs = computed(() => [
      { title: 'Home', to: '/home' },
      { title: 'Shop', to: '/shop' },
      { title: categoryName.value, disabled: true }
    ])

    const maxPrice = computed(() => {
      const categoryProducts = products.value.filter(p => p.category === category.value)
      return Math.max(...categoryProducts.map(p => p.price), 1000)
    })

    const filteredProducts = computed(() => {
      let filtered = products.value.filter(product => product.category === category.value)

      // Apply filters
      if (selectedFilters.subcategory.length > 0) {
        filtered = filtered.filter(product => 
          selectedFilters.subcategory.includes(product.subcategory)
        )
      }

      if (selectedFilters.brand.length > 0) {
        filtered = filtered.filter(product => 
          selectedFilters.brand.includes(product.brand)
        )
      }

      if (selectedFilters.rating.length > 0) {
        filtered = filtered.filter(product => 
          selectedFilters.rating.some(rating => product.rating >= rating)
        )
      }

      if (selectedFilters.inStock) {
        filtered = filtered.filter(product => product.inStock)
      }

      if (selectedFilters.freeShipping) {
        filtered = filtered.filter(product => product.freeShipping)
      }

      if (selectedFilters.onSale) {
        filtered = filtered.filter(product => product.discount > 0)
      }

      // Price range filter
      filtered = filtered.filter(product => 
        product.price >= priceRange.value[0] && product.price <= priceRange.value[1]
      )

      // Sort products
      switch (sortBy.value) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          filtered.sort((a, b) => b.id - a.id)
          break
        case 'popular':
          filtered.sort((a, b) => b.reviewCount - a.reviewCount)
          break
        default:
          // Relevance - keep original order
          break
      }

      return filtered
    })

    const totalPages = computed(() => Math.ceil(filteredProducts.value.length / 12))
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * 12
      const end = start + 12
      return filteredProducts.value.slice(start, end)
    })

    // Methods
    const clearFilters = () => {
      selectedFilters.subcategory = []
      selectedFilters.rating = []
      selectedFilters.brand = []
      selectedFilters.inStock = false
      selectedFilters.freeShipping = false
      selectedFilters.onSale = false
      priceRange.value = [0, maxPrice.value]
      currentPage.value = 1
    }

    const handlePageChange = (page) => {
      currentPage.value = page
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
      loading.value = true
      
      // Simulate loading
      setTimeout(() => {
        loading.value = false
      }, 500)
    })

    // Watchers
    watch([selectedFilters, priceRange, sortBy], () => {
      currentPage.value = 1
    }, { deep: true })

    watch(category, () => {
      priceRange.value = [0, maxPrice.value]
      clearFilters()
    })

    return {
      loading,
      currentPage,
      sortBy,
      priceRange,
      selectedFilters,
      categoryName,
      categoryIcon,
      categoryDescription,
      subcategories,
      availableBrands,
      breadcrumbs,
      maxPrice,
      sortOptions,
      filteredProducts,
      paginatedProducts,
      totalPages,
      clearFilters,
      handlePageChange,
      viewProduct,
      addToCart,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.category-header {
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
</style> 