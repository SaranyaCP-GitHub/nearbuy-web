<template>
  <v-container class="py-6">
    <v-row>
      <!-- Product Images -->
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="pa-4">
          <v-img
            :src="product.thumbnail"
            :alt="product.title"
            height="400"
            cover
            class="rounded-lg"
          />
          
          <!-- Thumbnail Gallery -->
          <!-- <div class="d-flex gap-2 mt-4">
            <v-img
              v-for="(image, index) in productImages"
              :key="index"
              :src="image"
              :alt="`${product.title} - Image ${index + 1}`"
              width="80"
              height="80"
              cover
              class="rounded cursor-pointer"
              @click="selectedImage = image"
            />
          </div> -->
        </v-card>
      </v-col>

      <!-- Product Info -->
      <v-col cols="12" md="6">
        <div class="product-info">
          <!-- Product Title -->
          <h1 class="text-h4 font-weight-bold mb-2">{{ product.title }}</h1>
          
          <!-- Rating -->
          <div class="d-flex align-center mb-3">
            <v-rating
              :model-value="product.rating"
              readonly
              density="compact"
              color="amber"
            />
            <span class="text-body-1 text-grey-darken-1 ml-2">
              {{ product.rating }} ({{ product.reviewCount }} reviews)
            </span>
          </div>

          <!-- Price -->
          <div class="price-section mb-4">
            <div class="d-flex align-center">
                              <span v-if="product.discountPercentage > 0" class="text-decoration-line-through text-grey-darken-1 text-h5 mr-3">
                  ${{ product.originalPrice || product.price }}
                </span>
              <span class="text-h3 font-weight-bold primary--text">
                ${{ product.price }}
              </span>
              <v-chip
                v-if="product.discountPercentage > 0"
                color="error"
                class="ml-3"
              >
                -{{ Math.round(product.discountPercentage) }}% OFF
              </v-chip>
            </div>
          </div>

          <!-- Stock Status -->
          <div class="stock-status mb-4">
            <v-chip
              :color="product.stock > 0 ? 'success' : 'error'"
              variant="tonal"
              size="large"
            >
              <v-icon
                :icon="product.stock > 0 ? 'mdi-check-circle' : 'mdi-close-circle'"
                class="mr-2"
              />
              {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </v-chip>
          </div>

          <!-- Description -->
          <div class="description mb-6">
            <h3 class="text-h6 font-weight-medium mb-2">Description</h3>
            <p class="text-body-1 text-grey-darken-2">
              {{ product.description || 'No description available for this product.' }}
            </p>
          </div>

          <!-- Quantity Selector -->
          <div class="quantity-section mb-4">
            <h3 class="text-h6 font-weight-medium mb-2">Quantity</h3>
            <div class="d-flex align-center">
              <v-btn
                icon="mdi-minus"
                variant="outlined"
                size="small"
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
              />
              <v-text-field
                v-model="quantity"
                type="number"
                min="1"
                :max="product.stock"
                variant="outlined"
                density="compact"
                class="mx-2"
                style="max-width: 80px"
                hide-details
              />
              <v-btn
                icon="mdi-plus"
                variant="outlined"
                size="small"
                @click="increaseQuantity"
                :disabled="quantity >= product.stock || quantity >= 99"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons mb-6">
            <v-row>
              <v-col cols="12" sm="6">
                <v-btn
                  block
                  color="primary"
                  size="large"
                  @click="addToCart"
                  :disabled="product.stock <= 0"
                  prepend-icon="mdi-cart-plus"
                >
                  Add to Cart
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  block
                  variant="outlined"
                  size="large"
                  @click="toggleFavorite"
                  :color="isFavorite ? 'red' : 'primary'"
                  :prepend-icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
                >
                  {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <!-- Product Details -->
          <v-expansion-panels variant="accordion" class="mb-4">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon icon="mdi-information" class="mr-2" />
                Product Details
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Category</v-list-item-title>
                    <v-list-item-subtitle>{{ getCategoryName(product.category) }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>SKU</v-list-item-title>
                    <v-list-item-subtitle>{{ product.sku || 'N/A' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Weight</v-list-item-title>
                    <v-list-item-subtitle>{{ product.weight || 'N/A' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Stock</v-list-item-title>
                    <v-list-item-subtitle>{{ product.stock }} units</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-col>
    </v-row>

    <!-- Related Products -->
    <!-- <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Related Products</h2>
        <v-row>
          <v-col
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card variant="outlined" class="h-100">
              <v-img
                :src="relatedProduct.thumbnail"
                :alt="relatedProduct.title"
                height="200"
                cover
              />
              <v-card-text>
                <h3 class="text-h6 font-weight-medium mb-2">{{ relatedProduct.title }}</h3>
                <div class="d-flex align-center justify-space-between">
                  <span class="text-h6 font-weight-bold primary--text">
                    ${{ relatedProduct.price }}
                  </span>
                  <v-rating
                    :model-value="relatedProduct.rating"
                    readonly
                    density="compact"
                    size="small"
                    color="amber"
                  />
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  block
                  variant="outlined"
                  @click="$router.push(`/product/${relatedProduct.id}`)"
                >
                  View Details
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ProductDetail',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const quantity = ref(1)
    const selectedImage = ref(props.product.thumbnail)

    // Mock product images
    const productImages = computed(() => [
      props.product.thumbnail,
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400'
    ])

    // Mock related products
    const relatedProducts = ref([
      {
        id: 4,
        title: "Wireless Earbuds",
        price: 79.99,
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        rating: 4.3
      },
      {
        id: 5,
        title: "Smart Watch",
        price: 199.99,
        thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        rating: 4.6
      },
      {
        id: 6,
        title: "Laptop Stand",
        price: 49.99,
        thumbnail: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400",
        rating: 4.1
      },
      {
        id: 7,
        title: "USB-C Cable",
        price: 19.99,
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        rating: 4.0
      }
    ])

    const isFavorite = computed(() => {
      return store.getters.isFavorite(props.product.id)
    })

    const getCategoryName = (category) => {
      const categoryMap = {
        'beauty': 'Beauty & Personal Care',
        'electronics': 'Electronics & Technology',
        'clothing': 'Clothing & Fashion',
        'home': 'Home & Garden',
        'food': 'Food & Beverage',
        'sports': 'Sports & Outdoors',
        'books': 'Books & Media',
        'automotive': 'Automotive',
        'health': 'Health & Wellness',
        'toys': 'Toys & Games'
      };
      return categoryMap[category] || category;
    };

    const increaseQuantity = () => {
      if (quantity.value < Math.min(99, props.product.stock)) {
        quantity.value++
      }
    }

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const addToCart = () => {
      store.dispatch('addToCart', {
        ...props.product,
        quantity: quantity.value
      })
      store.dispatch('showNotification', {
        type: 'success',
        message: `${quantity.value} ${quantity.value === 1 ? 'item' : 'items'} added to cart`
      })
    }

    const toggleFavorite = () => {
      store.dispatch('toggleFavorite', props.product)
      store.dispatch('showNotification', {
        type: 'success',
        message: isFavorite.value ? 'Removed from favorites' : 'Added to favorites'
      })
    }

    return {
      quantity,
      selectedImage,
      productImages,
      relatedProducts,
      isFavorite,
      getCategoryName,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.product-info {
  height: 100%;
}

.price-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.stock-status {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.description {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.quantity-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.action-buttons {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.cursor-pointer {
  cursor: pointer;
}
</style> 