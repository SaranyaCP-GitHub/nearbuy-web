<template>
  <div class="shop-page">
    <!-- Hero Banner -->
    <section class="shop-hero">
      <div class="shop-hero-content">
        <h1 class="shop-hero-title">Gift for your skin</h1>
        <p class="shop-hero-desc">
          Aliquip fugiat ipsum nostrud ex et eu incididunt quis minim dolore
          exceptuer voluptate
        </p>
      </div>
      <div class="shop-hero-bg"></div>
    </section>

    <!-- Category Tabs -->
    <div class="shop-category-tabs">
      <button
        v-for="cat in categoryTabs"
        :key="cat.key"
        class="category-tab"
        :class="{ active: selectedCategory === cat.key }"
        @click="selectCategory(cat.key)"
      >
        {{ cat.label }}
      </button>
      <div class="shop-search-sort">
        <input
          class="shop-search"
          type="text"
          v-model="search"
          placeholder="Search product..."
        />
        <select class="shop-sort" v-model="sort">
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="new">Newest</option>
        </select>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="shop-product-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @click="viewProduct"
        @add-to-cart="handleAddToCart"
      />
      <div class="shop-product-grid-empty" v-if="filteredProducts.length === 0">
        <v-icon icon="mdi-package-variant-off" size="64" color="#ccc" />
        <h3>No products found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    </div>

    <!-- Recommended for you (unchanged)
    <div class="recommended-section">
      <div class="recommended-header">
        <span>Recommended for you</span>
        <a href="#" class="view-all">View all</a>
      </div>
      <div class="recommended-grid">
        <div v-for="prod in recommended" :key="prod.id" class="recommended-card">
          <img class="recommended-img" :src="prod.thumbnail" :alt="prod.title" />
          <div class="recommended-title">{{ prod.title }}</div>
          <div class="recommended-rating">
            <span class="star">★</span> {{ prod.rating }}
          </div>
          <div class="recommended-price">${{ prod.price }}</div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { productService } from "../services/productService";
import ProductCard from "@/components/ProductCard.vue";

const router = useRouter();
const store = useStore();

const search = ref("");
const sort = ref("");
const recommended = ref([]);
const loading = ref(false);

const categoryTabs = [
  { key: "clothing-fashion", label: "Clothing and Fashion" },
  { key: "electronics-technology", label: "Electronics and Technology" },
  { key: "food-beverage", label: "Food and Beverage" },
  { key: "personal-care-beauty", label: "Personal Care and Beauty" },
  { key: "home-goods", label: "Home Goods" },
  { key: "diy-hardware", label: "DIY and Hardware" },
];
const selectedCategory = ref(categoryTabs[0].key);

const categoryApiMap = {
  "clothing-fashion": "clothing",
  "electronics-technology": "electronics",
  "food-beverage": "food",
  "personal-care-beauty": "beauty",
  "home-goods": "home",
  "diy-hardware": "sports",
};

const products = ref([]);

function selectCategory(key) {
  selectedCategory.value = key;
  fetchProducts();
}

async function fetchProducts() {
  try {
    loading.value = true;
    const apiCat = categoryApiMap[selectedCategory.value];
    if (!apiCat) return;
    
    const result = await productService.getProducts({
      category: apiCat,
      limit: 20
    });
    
    products.value = (result.products || []).map((p, idx) => ({
      ...p,
      isBestSeller: idx < 3, // Mark first 3 as best-seller for demo
      isNew: idx === 3, // Mark 4th as new for demo
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
  }
}

const filteredProducts = computed(() => {
  let list = products.value;
  if (search.value) {
    const s = search.value.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        (p.description && p.description.toLowerCase().includes(s))
    );
  }
  if (sort.value === "price-asc") {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (sort.value === "price-desc") {
    list = [...list].sort((a, b) => b.price - a.price);
  } else if (sort.value === "new") {
    list = [...list].sort((a, b) => b.id - a.id);
  }
  return list;
});

async function fetchRecommended() {
  try {
    const result = await productService.getProducts({ limit: 6 });
    recommended.value = result.products || [];
  } catch (error) {
    console.error('Error fetching recommended products:', error);
  }
}

const viewProduct = (product) => {
  console.log('viewProduct called with:', product);
  // alert(`Clicked on product: ${product.title}`);
  router.push(`/product/${product.id}`);
};

const handleAddToCart = (product) => {
  store.dispatch('addToCart', {
    ...product,
    quantity: 1
  });
};

onMounted(async () => {
  await fetchProducts();
  await fetchRecommended();
});
</script>

<style scoped>
.shop-page {
  background: linear-gradient(135deg, #f7faff 0%, #f9f6ff 100%);
  min-height: 100vh;
  padding-bottom: 48px;
  font-family: "Nunito", "Segoe UI", Arial, sans-serif;
}
.shop-hero {
  position: relative;
  background: #f7f3ef;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 48px 32px 32px 32px;
  border-radius: 0 0 32px 32px;
  overflow: hidden;
}
.shop-hero-content {
  z-index: 2;
  max-width: 540px;
}
.shop-hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 18px;
  color: #222;
}
.shop-hero-desc {
  font-size: 1.15rem;
  color: #444;
}
.shop-hero-bg {
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
  background: url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80")
    center center/cover no-repeat;
  opacity: 0.25;
  border-radius: 0 0 32px 0;
  z-index: 1;
}
.shop-category-tabs {
  margin-top: 80px;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 32px 32px 0 32px;
  background: #fafbfc;
  position: relative;
  min-height: 64px;
}
.category-tab {
  background: #e3eaf6;
  color: #1976d2;
  border: none;
  padding: 16px 36px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1.15rem;
  cursor: pointer;
  transition: background 0.25s, color 0.25s, box-shadow 0.25s, transform 0.18s;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
  margin-bottom: 0;
  outline: none;
  letter-spacing: 0.01em;
}
.category-tab.active {
  background: linear-gradient(90deg, #1976d2 60%, #5ee6b0 100%);
  color: #fff;
  font-weight: 800;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.16);
  transform: scale(1.06);
}
.category-tab:hover:not(.active) {
  background: #dbeafe;
  color: #1251a3;
  transform: translateY(-2px) scale(1.03);
}
.shop-search-sort {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
}
.shop-search,
.shop-sort {
  height: 48px;
  border: 1.5px solid #e3eaf6;
  border-radius: 16px;
  padding: 0 22px;
  font-size: 1.08rem;
  background: #fff;
  outline: none;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.04);
  transition: border 0.2s, box-shadow 0.2s;
}
.shop-search:focus,
.shop-sort:focus {
  border: 1.5px solid #1976d2;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.1);
}
.shop-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 32px;
  margin: 60px 32px 80px 32px;
}
.product-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(25, 118, 210, 0.1);
  padding: 32px 20px 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: box-shadow 0.2s, transform 0.2s;
  border: 1.5px solid #f0f2fa;
}
.product-card:hover {
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.18);
  transform: translateY(-6px) scale(1.025);
}
.product-badge {
  position: absolute;
  top: 22px;
  left: 22px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  font-weight: 700;
  padding: 5px 16px 5px 12px;
  border-radius: 16px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}
.product-badge.best-seller {
  background: linear-gradient(90deg, #ffe066 60%, #ffd700 100%);
  color: #b47a00;
}
.product-badge.best-seller::before {
  content: "★";
  color: #ffb300;
  font-size: 1.1em;
  margin-right: 4px;
}
.product-badge.new {
  background: linear-gradient(90deg, #b0e6ff 60%, #5ee6b0 100%);
  color: #007ab4;
}
.product-badge.new::before {
  content: "🆕";
  font-size: 1.1em;
  margin-right: 4px;
}
.product-img {
  width: 130px;
  height: 130px;
  object-fit: contain;
  border-radius: 16px;
  background: linear-gradient(135deg, #f7faff 60%, #f9f6ff 100%);
  margin-bottom: 18px;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}
.product-card:hover .product-img {
  transform: scale(1.07);
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.16);
}
.product-title {
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 6px;
  text-align: center;
  color: #222;
}
.product-desc {
  color: #666;
  font-size: 1.01rem;
  margin-bottom: 12px;
  text-align: center;
  min-height: 48px;
}
.product-pricing {
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.product-price {
  color: #1976d2;
  font-weight: 900;
  font-size: 1.25rem;
  margin-right: 8px;
}
.product-old-price {
  color: #b0b0b0;
  text-decoration: line-through;
  font-size: 1.1rem;
  font-weight: 500;
}
.product-cart-btn {
  background: linear-gradient(90deg, #1976d2 60%, #5ee6b0 100%);
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.15rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
}
.product-cart-btn::before {
  content: "🛒";
  font-size: 1.1em;
  margin-right: 4px;
}
.product-cart-btn:hover {
  background: linear-gradient(90deg, #1251a3 60%, #3ad29f 100%);
  color: #fff;
  transform: scale(1.07);
}
@media (max-width: 900px) {
  .shop-hero,
  .shop-category-tabs,
  .shop-product-grid,
  .recommended-section {
    padding-left: 8px;
    padding-right: 8px;
    margin-left: 0;
    margin-right: 0;
  }
  .shop-hero {
    flex-direction: column;
    align-items: flex-start;
    padding: 32px 8px 24px 8px;
  }
  .shop-hero-bg {
    display: none;
  }
}
.recommended-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 32px;
  margin: 32px 32px 0 32px;
}
</style>
