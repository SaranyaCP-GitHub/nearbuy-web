<template>
  <div class="product-detail-page">
    <div v-if="loading" class="loading-container">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
      <p>Loading product details...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <v-icon icon="mdi-alert-circle" size="64" color="error" />
      <h2>Product Not Found</h2>
      <p>{{ error }}</p>
      <v-btn
        color="primary"
        @click="$router.push('/shop')"
        prepend-icon="mdi-arrow-left"
      >
        Back to Shop
      </v-btn>
    </div>
    
    <ProductDetail
      v-else-if="product"
      :product="product"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { productService } from '@/services/productService';
import ProductDetail from '@/components/ProductDetail.vue';

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchProduct = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const productId = parseInt(route.params.id);
    if (isNaN(productId)) {
      throw new Error('Invalid product ID');
    }
    
    const productData = await productService.getProduct(productId);
    product.value = productData;
  } catch (err) {
    console.error('Error fetching product:', err);
    error.value = err.message || 'Failed to load product details';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProduct();
});
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  gap: 16px;
}

.loading-container p,
.error-container p {
  color: #7f8c8d;
  font-size: 16px;
}

.error-container h2 {
  color: #2c3e50;
  margin: 0;
}
</style> 