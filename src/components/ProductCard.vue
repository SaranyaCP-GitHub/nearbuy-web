<template>
  <div class="product-card" :class="{ 'out-of-stock': product.stock === 0 }">
    <!-- Product Badge -->
    <div v-if="product.discountPercentage > 0" class="product-badge discount">
      -{{ Math.round(product.discountPercentage) }}%
    </div>
    <div v-else-if="product.isBestSeller" class="product-badge best-seller">
      Best Seller
    </div>
    <div v-else-if="product.isNew" class="product-badge new">
      New
    </div>

    <!-- Product Image -->
    <div class="product-image-container">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="product-image"
        @click="$emit('click', product)"
        loading="lazy"
      />
      <div class="product-overlay">
        <button
          class="overlay-btn favorite-btn"
          :class="{ 'is-favorite': isFavorite }"
          @click.stop="toggleFavorite"
          :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          <v-icon :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'" />
        </button>
        <button
          class="overlay-btn quick-view-btn"
          @click.stop="$emit('quick-view', product)"
          title="Quick view"
        >
          <v-icon icon="mdi-eye" />
        </button>
      </div>
    </div>

    <!-- Product Info -->
    <div class="product-info">
      <h3 class="product-title" @click="$emit('click', product)">
        {{ product.title }}
      </h3>
      
      <div class="product-category">
        {{ getCategoryName(product.category) }}
      </div>

      <!-- Rating -->
      <div class="product-rating" v-if="product.rating">
        <div class="stars">
          <v-icon
            v-for="star in 5"
            :key="star"
            :icon="star <= product.rating ? 'mdi-star' : 'mdi-star-outline'"
            size="small"
            color="#FFD700"
          />
        </div>
        <span class="rating-text">({{ product.rating.toFixed(1) }})</span>
      </div>

      <!-- Price -->
      <div class="product-pricing">
        <span class="current-price">
          {{ formatPrice(getDiscountedPrice(product.price, product.discountPercentage)) }}
        </span>
        <span v-if="product.discountPercentage > 0" class="original-price">
          {{ formatPrice(product.originalPrice) }}
        </span>
      </div>

      <!-- Stock Status -->
      <div class="stock-status" :class="getStockStatusClass(product.stock)">
        {{ getStockStatus(product.stock) }}
      </div>

      <!-- Actions -->
      <div class="product-actions">
        <button
          v-if="product.stock > 0"
          class="add-to-cart-btn"
          @click.stop="addToCart"
          :disabled="loading"
        >
          <v-icon v-if="loading" icon="mdi-loading" class="loading-icon" />
          <span v-else>Add to Cart</span>
        </button>
        <button
          v-else
          class="out-of-stock-btn"
          disabled
        >
          Out of Stock
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { formatPrice, calculateDiscountedPrice } from '../services/productService';

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['click', 'quick-view', 'add-to-cart']);

const store = useStore();
const loading = ref(false);

// Computed properties
const isFavorite = computed(() => {
  return store.getters.isFavorite(props.product.id);
});

// Methods
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

const getDiscountedPrice = (price, discountPercentage) => {
  return calculateDiscountedPrice(price, discountPercentage);
};

const getStockStatus = (stock) => {
  if (stock === 0) return 'Out of Stock';
  if (stock < 5) return 'Low Stock';
  return 'In Stock';
};

const getStockStatusClass = (stock) => {
  if (stock === 0) return 'out-of-stock';
  if (stock < 5) return 'low-stock';
  return 'in-stock';
};

const toggleFavorite = () => {
  store.dispatch('toggleFavorite', props.product);
};

const addToCart = async () => {
  loading.value = true;
  try {
    emit('add-to-cart', props.product);
  } catch (error) {
    console.error('Error adding to cart:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-card.out-of-stock {
  opacity: 0.7;
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  z-index: 2;
}

.product-badge.discount {
  background: #ff4757;
  color: white;
}

.product-badge.best-seller {
  background: #ffa502;
  color: white;
}

.product-badge.new {
  background: #2ed573;
  color: white;
}

.product-image-container {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  border-radius: 12px;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.overlay-btn {
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.overlay-btn:hover {
  transform: scale(1.1);
}

.favorite-btn.is-favorite {
  background: #ff4757;
  color: white;
}

.product-info {
  padding: 16px;
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #2c3e50;
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.2s ease;
}

.product-title:hover {
  color: #1976d2;
}

.product-category {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 8px;
  text-transform: capitalize;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.rating-text {
  font-size: 12px;
  color: #7f8c8d;
}

.product-pricing {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.original-price {
  font-size: 14px;
  color: #7f8c8d;
  text-decoration: line-through;
}

.stock-status {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 16px;
}

.stock-status.in-stock {
  color: #2ed573;
}

.stock-status.low-stock {
  color: #ffa502;
}

.stock-status.out-of-stock {
  color: #ff4757;
}

.product-actions {
  display: flex;
  gap: 8px;
}

.add-to-cart-btn,
.out-of-stock-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-to-cart-btn {
  background: #1976d2;
  color: white;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #1565c0;
  transform: translateY(-1px);
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.out-of-stock-btn {
  background: #ecf0f1;
  color: #7f8c8d;
  cursor: not-allowed;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-info {
    padding: 12px;
  }
  
  .product-title {
    font-size: 14px;
  }
  
  .current-price {
    font-size: 16px;
  }
  
  .add-to-cart-btn,
  .out-of-stock-btn {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style> 