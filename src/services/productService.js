// Mock product data (old API structure)
const mockProducts = [
  {
    id: 1,
    title: "Wireless Bluetooth Headphones",
    price: 89.99,
    originalPrice: 129.99,
    discountPercentage: 31,
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "electronics",
    rating: 4.5,
    reviewCount: 128,
    stock: 12,
    description: "High-quality wireless headphones with noise cancellation and long battery life. Perfect for music lovers and professionals alike.",
    sku: "WH-001",
    weight: "250g"
  },
  {
    id: 2,
    title: "Organic Cotton T-Shirt",
    price: 24.99,
    originalPrice: 24.99,
    discountPercentage: 0,
    thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "clothing",
    rating: 4.2,
    reviewCount: 89,
    stock: 30,
    description: "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes.",
    sku: "TS-002",
    weight: "150g"
  },
  {
    id: 3,
    title: "Smart Home Assistant",
    price: 149.99,
    originalPrice: 199.99,
    discountPercentage: 25,
    thumbnail: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400",
    category: "electronics",
    rating: 4.7,
    reviewCount: 256,
    stock: 0,
    description: "Voice-controlled smart home assistant with AI capabilities. Control your home with simple voice commands.",
    sku: "SHA-003",
    weight: "500g"
  },
  {
    id: 4,
    title: "Wireless Earbuds",
    price: 79.99,
    originalPrice: 99.99,
    discountPercentage: 20,
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "electronics",
    rating: 4.3,
    reviewCount: 156,
    stock: 18,
    description: "True wireless earbuds with premium sound quality and active noise cancellation.",
    sku: "WE-004",
    weight: "10g"
  },
  {
    id: 5,
    title: "Smart Watch",
    price: 199.99,
    originalPrice: 249.99,
    discountPercentage: 20,
    thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "electronics",
    rating: 4.6,
    reviewCount: 203,
    stock: 10,
    description: "Feature-rich smartwatch with health monitoring, GPS, and long battery life.",
    sku: "SW-005",
    weight: "45g"
  },
  {
    id: 6,
    title: "Laptop Stand",
    price: 49.99,
    originalPrice: 49.99,
    discountPercentage: 0,
    thumbnail: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400",
    category: "electronics",
    rating: 4.1,
    reviewCount: 78,
    stock: 22,
    description: "Adjustable laptop stand for better ergonomics and improved posture.",
    sku: "LS-006",
    weight: "800g"
  },
  {
    id: 7,
    title: "USB-C Cable",
    price: 19.99,
    originalPrice: 29.99,
    discountPercentage: 33,
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "electronics",
    rating: 4.0,
    reviewCount: 92,
    stock: 50,
    description: "High-speed USB-C cable with fast charging and data transfer capabilities.",
    sku: "UC-007",
    weight: "50g"
  },
  {
    id: 8,
    title: "Denim Jeans",
    price: 59.99,
    originalPrice: 79.99,
    discountPercentage: 25,
    thumbnail: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    category: "clothing",
    rating: 4.4,
    reviewCount: 167,
    stock: 15,
    description: "Classic denim jeans with perfect fit and durability. Available in various washes and sizes.",
    sku: "DJ-008",
    weight: "400g"
  },
  {
    id: 9,
    title: "Running Shoes",
    price: 89.99,
    originalPrice: 119.99,
    discountPercentage: 25,
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "sports",
    rating: 4.6,
    reviewCount: 234,
    stock: 20,
    description: "Professional running shoes with superior comfort and performance technology.",
    sku: "RS-009",
    weight: "300g"
  },
  {
    id: 10,
    title: "Organic Coffee Beans",
    price: 14.99,
    originalPrice: 14.99,
    discountPercentage: 0,
    thumbnail: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    category: "food",
    rating: 4.8,
    reviewCount: 89,
    stock: 40,
    description: "Premium organic coffee beans sourced from sustainable farms. Rich flavor and aroma.",
    sku: "CB-010",
    weight: "500g"
  },
  {
    id: 11,
    title: "Facial Moisturizer",
    price: 34.99,
    originalPrice: 44.99,
    discountPercentage: 22,
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    category: "beauty",
    rating: 4.3,
    reviewCount: 156,
    stock: 25,
    description: "Hydrating facial moisturizer with natural ingredients for all skin types.",
    sku: "FM-011",
    weight: "100g"
  },
  {
    id: 12,
    title: "Table Lamp",
    price: 39.99,
    originalPrice: 39.99,
    discountPercentage: 0,
    thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
    category: "home",
    rating: 4.2,
    reviewCount: 78,
    stock: 12,
    description: "Modern table lamp with adjustable brightness and elegant design.",
    sku: "TL-012",
    weight: "1.2kg"
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  // Get a single product by ID
  async getProduct(id) {
    await delay(500); // Simulate network delay
    
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  },

  // Get all products with optional filtering
  async getProducts(filters = {}) {
    await delay(300);
    
    let products = [...mockProducts];
    
    // Apply filters
    if (filters.category && filters.category !== 'all') {
      products = products.filter(p => p.category === filters.category);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }
    
    if (filters.minPrice) {
      products = products.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.inStock !== undefined) {
      products = products.filter(p => p.stock > 0 === filters.inStock);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          products.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name-desc':
          products.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          products.sort((a, b) => b.id - a.id);
          break;
        case 'oldest':
          products.sort((a, b) => a.id - b.id);
          break;
      }
    }
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      total: products.length,
      page,
      limit,
      totalPages: Math.ceil(products.length / limit)
    };
  },

  // Get related products
  async getRelatedProducts(productId, limit = 4) {
    await delay(200);
    
    const product = mockProducts.find(p => p.id === parseInt(productId));
    if (!product) {
      return [];
    }
    
    // Get products from the same category, excluding the current product
    const related = mockProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
    
    return related;
  },

  // Search products
  async searchProducts(query, filters = {}) {
    await delay(400);
    
    const searchFilters = {
      ...filters,
      search: query
    };
    
    return this.getProducts(searchFilters);
  },

  // Get product categories
  async getCategories() {
    await delay(100);
    
    const categories = [...new Set(mockProducts.map(p => p.category))];
    return categories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: mockProducts.filter(p => p.category === category).length
    }));
  },

  // Add product review (mock implementation)
  async addProductReview(productId, review) {
    await delay(1000);
    
    // In a real app, this would save to the backend
    console.log('Adding review for product:', productId, review);
    
    return {
      id: Date.now(),
      productId,
      ...review,
      date: new Date().toISOString()
    };
  },

  // Get product reviews (mock implementation)
  async getProductReviews(productId) {
    await delay(300);
    
    // Mock reviews
    const mockReviews = [
      {
        id: 1,
        productId: parseInt(productId),
        reviewerName: "John Doe",
        rating: 5,
        comment: "Excellent product! Highly recommended.",
        date: "2024-01-15T10:30:00Z"
      },
      {
        id: 2,
        productId: parseInt(productId),
        reviewerName: "Jane Smith",
        rating: 4,
        comment: "Great quality and fast delivery.",
        date: "2024-01-10T14:20:00Z"
      },
      {
        id: 3,
        productId: parseInt(productId),
        reviewerName: "Mike Johnson",
        rating: 5,
        comment: "Perfect for my needs. Will buy again!",
        date: "2024-01-05T09:15:00Z"
      }
    ];
    
    return mockReviews;
  }
};

// Utility functions
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  return originalPrice * (1 - discountPercentage / 100);
}; 