<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section id="hero-section" class="hero-section mb-12">
      <div class="hero-content">
        <h1>Everything for Your Home, Delivered</h1>
        <p>
          Discover top deals on home essentials, decor, kitchenware, and
          more.<br />
          Fast delivery, great prices, and quality you can trust.
        </p>
        <button class="hero-btn" @click="navigateTo('/shop')">Shop Now</button>
      </div>
    </section>

    <!-- Our Products -->
    <section id="products-section" class="products-section mb-12">
      <h2 class="section-title">Our Products</h2>
      <div class="product-filters">
        <button
          class="filter-btn"
          :class="{ active: selectedButton === 'best-sellers' }"
          @click="selectFilter('best-sellers')"
        >
          Best-sellers
        </button>
        <button
          class="filter-btn"
          :class="{ active: selectedButton === 'new-products' }"
          @click="selectFilter('new-products')"
        >
          New products
        </button>
      </div>
      <div class="product-list">
        <div v-if="loadingProducts" class="product-loading">
          Loading products...
        </div>
        <div v-else-if="products.length === 0" class="product-loading">
          No products found.
        </div>
        <div
          v-else
          v-for="product in products"
          :key="product.id"
          class="product-card"
        >
          <img
            class="product-img"
            :src="product.thumbnail"
            :alt="product.title"
          />
          <div class="product-title">{{ product.title }}</div>
          <div class="product-desc">{{ product.description }}</div>
          <div class="product-pricing">
            <span class="product-price">${{ product.price }}</span>
            <span v-if="product.discountPercentage" class="product-old-price">
              ${ ( product.price / (1 - product.discountPercentage / 100)
              ).toFixed(2) }
            </span>
          </div>
          <div class="product-actions">
            <button class="icon-btn" title="Add to wishlist">&#9825;</button>
            <button class="icon-btn" title="Add to cart">&#128722;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Event Promotion -->
    <!-- <section class="event-section">
      <h2 class="section-title">Event promotion</h2>
      <div class="event-list">
        <div class="event-card">
          <img
            class="event-img"
            src="https://via.placeholder.com/300x120?text=Event+1"
            alt="Event 1"
          />
          <div class="event-title">Relaxing & Pampering</div>
          <div class="event-desc">Pariatur ad nisi ex tempor ea</div>
          <button class="event-btn">Explore</button>
        </div>
        <div class="event-card">
          <img
            class="event-img"
            src="https://via.placeholder.com/300x120?text=Event+2"
            alt="Event 2"
          />
          <div class="event-title">Smooth & Bright Skin</div>
          <div class="event-desc">Excepteur ad nisi ex tempor ea</div>
          <button class="event-btn">Explore</button>
        </div>
      </div>
    </section> -->

    <!-- Our Story -->
    <section id="our-story-section" class="story-section mt-12">
      <h2 class="section-title mb-6">Our Story</h2>
      <div class="story-media-wrap">
        <div class="story-media-container">
          <template v-if="!showVideo">
            <img
              class="story-media-img"
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80"
              alt="Our Story"
            />
            <button class="story-media-btn" @click="playVideo">
              <span class="play-icon">&#9654;</span> Watch video
            </button>
          </template>
          <template v-else>
            <div class="story-media-video">
              <iframe
                ref="youtubeIframe"
                width="100%"
                height="100%"
                :src="youtubeEmbedUrl"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
          </template>
        </div>
      </div>
      <div class="story-text">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          euismod, nisi eu consectetur.
        </p>
      </div>
    </section>

    <!-- Read What's New -->
    <section id="blog-section" class="news-section mt-12">
      <h2 class="section-title">Read What's New</h2>
      <div class="news-list">
        <div v-for="i in 2" :key="i" class="news-card">
          <img
            class="news-img"
            src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
            alt="Blog"
          />
          <span class="news-tag">Blog</span>
          <div class="news-title">Anim sint Lorem exceptuer commodo</div>
          <div class="news-date">Oct 10, 2022</div>
          <div class="news-desc">Short blog description goes here.</div>
        </div>
      </div>
    </section>

    <!-- Instagram Gallery -->
    <section class="instagram-section mb-12">
      <h2 class="section-title mb-8">Instagram</h2>
      <div class="instagram-gallery">
        <img
          v-for="(img, idx) in instagramImages"
          :key="idx"
          class="instagram-img"
          :src="img"
          alt="Instagram"
        />
      </div>
      <div class="instagram-handle mt-4">@near_buy_official</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { getRequest } from "../services/apiService";
import { useRouter } from "vue-router";

const products = ref([]);
const loadingProducts = ref(true);
const selectedButton = ref("best-sellers");

const showVideo = ref(false);
const youtubeIframe = ref(null);
const youtubeEmbedUrl =
  "https://www.youtube.com/embed/bITkBVT6kqs?autoplay=1&rel=0&enablejsapi=1";
let ytPlayer = null;

const instagramImages = ref([]);

const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};

const selectFilter = (filter) => {
  selectedButton.value = filter;
  const el = document.getElementById("products-section");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

function playVideo() {
  showVideo.value = true;
  nextTick(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    } else {
      createPlayer();
    }
  });
}

window.onYouTubeIframeAPIReady = () => {
  createPlayer();
};

function createPlayer() {
  if (ytPlayer || !youtubeIframe.value) return;
  ytPlayer = new window.YT.Player(youtubeIframe.value, {
    events: {
      onStateChange: (event) => {
        if (event.data === 0) {
          showVideo.value = false;
          ytPlayer = null;
        }
      },
    },
  });
}

onMounted(async () => {
  loadingProducts.value = true;
  try {
    const res = await getRequest(
      "https://dummyjson.com/products/category/skin-care"
    );
    products.value = res.products || [];
    products.value.push(res.products[0]);
  } catch (e) {
    products.value = [];
  }
  loadingProducts.value = false;

  // Fetch images for Instagram
  try {
    const smartRes = await getRequest(
      "https://dummyjson.com/products/category/kitchen-accessories"
    );
    // Flatten all images from all products
    instagramImages.value = (smartRes.products || [])
      .flatMap((p) => p.images)
      .slice(0, 12); // limit to 12 images
  } catch (e) {
    instagramImages.value = [];
  }
});
</script>

<style scoped>
.home-page {
  background: #fafbfc;
  color: #222;
}
.hero-section {
  display: flex;
  align-items: center;
  justify-content: left;
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  padding: 48px 24px 32px 24px;
  background: url("@/assets/homepage_cup_image.png") center center/cover
    no-repeat;
  border-radius: 0;
  position: relative;
  overflow: hidden;
  min-height: 340px;
}
.hero-section::before {
}
.hero-content {
  max-width: 540px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 18px;
}
.hero-content p {
  font-size: 1.15rem;
  margin-bottom: 28px;
  color: #444;
}
.hero-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  padding: 14px 38px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}
.hero-btn:hover {
  background: #1251a3;
}
.hero-img {
  width: 340px;
  height: 220px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.12);
  object-fit: cover;
  margin-left: 32px;
  background: #fff;
}
@media (max-width: 900px) {
  .hero-section {
    flex-direction: column;
    align-items: center;
    padding: 32px 8px 24px 8px;
  }
  .hero-img {
    margin-left: 0;
    margin-top: 24px;
    width: 100%;
    max-width: 340px;
    height: 180px;
  }
}
.section-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 48px 0 16px 0;
  text-align: center;
}
.product-filters {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.filter-btn {
  height: 44px;
  font-size: 16px;
  background: #e3eaf6;
  color: #1976d2;
  border: none;
  padding: 6px 18px;
  border-radius: 5px;
  margin-right: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.filter-btn.active,
.filter-btn:hover {
  background: #1976d2;
  color: #fff;
}
.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}
.product-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.06);
  width: 235px;
  padding: 18px 16px 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s;
}
.product-card:hover {
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.12);
}
.product-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}
.product-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}
.product-desc {
  color: #888;
  font-size: 14px;
  margin-bottom: 8px;
}
.product-pricing {
  margin-bottom: 8px;
}
.product-price {
  color: #1976d2;
  font-weight: 700;
  font-size: 14px;
  margin-right: 8px;
}
.product-old-price {
  color: #aaa;
  text-decoration: line-through;
  font-size: 14px;
}
.product-actions {
  display: flex;
  gap: 10px;
}
.icon-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: #1976d2;
  cursor: pointer;
  transition: color 0.2s;
}
.icon-btn:hover {
  color: #1251a3;
}
.event-section .event-list {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}
.event-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.06);
  width: 320px;
  padding: 18px 16px 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.event-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}
.event-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}
.event-desc {
  color: #888;
  font-size: 14px;
  margin-bottom: 8px;
}
.event-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  padding: 8px 22px;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.event-btn:hover {
  background: #1251a3;
}
.story-section {
  margin: 48px 0;
}
.story-section .section-title {
  text-align: center;
  margin-bottom: 18px;
}
.story-media-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.story-media-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/6;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.08);
  background: #000;
  margin: 0 auto;
}
.story-media-img,
.story-media-video iframe {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 18px;
}
.story-media-btn {
  position: absolute;
  bottom: 18px;
  right: 18px;
  background: rgba(34, 34, 34, 0.85);
  color: #fff;
  border: none;
  padding: 10px 22px 10px 18px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  z-index: 2;
}
.story-media-btn:hover {
  background: #1976d2;
}
.play-icon {
  font-size: 14px;
  margin-right: 4px;
}
.story-media-video {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.story-text {
  max-width: 700px;
  margin: 24px auto 0 auto;
  text-align: center;
  font-size: 14px;
  color: #444;
}
/* --- News Section --- */
.news-section {
  margin-top: 48px;
  margin-bottom: 48px;
  background: #fafbfc;
  padding: 0 0 32px 0;
}
.news-section .section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
}
.news-list {
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
}
.news-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(25, 118, 210, 0.08);
  width: 340px;
  padding: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  overflow: hidden;
}
.news-card:hover {
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.16);
  transform: translateY(-6px) scale(1.025);
}
.news-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 0 0 0 0;
  margin-bottom: 0;
  display: block;
}
.news-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #1976d2;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 12px;
  letter-spacing: 0.5px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}
.news-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 28px 0 8px 0;
  text-align: center;
  color: #222;
}
.news-date {
  color: #888;
  font-size: 14px;
  margin-bottom: 8px;
  text-align: center;
}
.news-desc {
  color: #444;
  font-size: 15px;
  text-align: center;
  margin: 0 18px;
}
@media (max-width: 900px) {
  .news-list {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  .news-card {
    width: 98vw;
    max-width: 400px;
  }
}
.instagram-section {
  margin: 48px 0 24px 0;
  text-align: center;
}
.instagram-gallery {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 120px;
  gap: 16px;
  justify-items: center;
  align-items: center;
  margin-bottom: 8px;
}
.instagram-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}
.instagram-img:hover {
  transform: scale(1.07);
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.18);
}
.instagram-handle {
  color: #1976d2;
  font-weight: 500;
  margin-bottom: 16px;
}

.story-img-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.story-btn-abs {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  background: #1976d2;
  color: #fff;
  border: none;
  padding: 10px 28px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.story-btn-abs:hover {
  background: #1251a3;
}
.story-video-wrap {
  width: 100%;
  max-width: 340px;
  height: 300px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.08);
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
