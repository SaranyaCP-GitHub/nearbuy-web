# NearBuy - Shop Nearby

A comprehensive e-commerce platform built with Vue 3, Vuetify, and Vuex that connects local sellers with customers for a seamless shopping experience.

## 🚀 Features

### User Authentication & Account Management
- **User Registration**: Email/password and OAuth support
- **Secure Login**: JWT-based authentication with session management
- **Account Management**: Profile updates, password changes, and account deletion
- **Role-based Access**: Customer, Store Owner, Admin, and Delivery personnel roles

### Product Browsing & Searching
- **Product Catalog**: Comprehensive product listings with categories
- **Advanced Search**: Real-time search with suggestions and filters
- **Product Details**: Rich product pages with images, reviews, and specifications
- **Pagination**: Efficient product loading with infinite scroll support

### Shopping Cart & Checkout
- **Shopping Cart**: Add, remove, and update quantities
- **Checkout Process**: Multi-step checkout with shipping and payment options
- **Order Management**: Track orders and view order history
- **Payment Integration**: Support for credit cards and PayPal

### User Experience Features
- **Favorites/Wishlist**: Save products for later
- **Reviews & Ratings**: Product reviews and rating system
- **Offline Support**: Cache products and cart for offline browsing
- **Responsive Design**: Mobile-first design with PWA capabilities

### Admin & Store Owner Features
- **Admin Panel**: User management, product oversight, and analytics
- **Store Owner Dashboard**: Product management and order fulfillment
- **Delivery Management**: Order tracking and status updates

## 🛠️ Technology Stack

- **Frontend**: Vue 3 with Composition API
- **UI Framework**: Vuetify 3
- **State Management**: Vuex 4 with persistence
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: SCSS with Vuetify theming

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nearbuy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
nearbuy/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── ProductCard.vue
│   │   ├── ShoppingCart.vue
│   │   └── ProductDetail.vue
│   ├── views/               # Page components
│   │   ├── HomePage.vue
│   │   ├── ShopPage.vue
│   │   ├── CheckoutPage.vue
│   │   └── ...
│   ├── services/            # API and business logic
│   │   ├── apiService.js
│   │   ├── productService.js
│   │   └── cartService.js
│   ├── store/               # Vuex store modules
│   │   └── auth.js
│   ├── layouts/             # Layout components
│   │   ├── DefaultLayout.vue
│   │   └── AuthLayout.vue
│   ├── router/              # Vue Router configuration
│   │   └── index.js
│   └── plugins/             # Vue plugins
│       └── vuetify.js
├── public/                  # Static assets
└── package.json
```

## 🎯 User Stories Implementation

### ✅ Completed Features

1. **User Authentication**
   - User registration with email validation
   - Secure login with JWT tokens
   - Password reset functionality
   - Session persistence

2. **Product Management**
   - Product listing with pagination
   - Advanced search and filtering
   - Product details with images and reviews
   - Category-based browsing

3. **Shopping Experience**
   - Add to cart functionality
   - Shopping cart management
   - Multi-step checkout process
   - Order tracking

4. **User Interface**
   - Responsive design for all devices
   - Modern UI with Vuetify components
   - Loading states and error handling
   - Accessibility features

### 🚧 In Progress Features

1. **Admin Panel**
   - User management interface
   - Product oversight tools
   - Analytics dashboard

2. **Store Owner Features**
   - Product management dashboard
   - Order fulfillment tools
   - Inventory management

3. **Advanced Features**
   - Real-time notifications
   - Advanced search algorithms
   - Payment gateway integration

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.nearbuy.com
VITE_APP_NAME=NearBuy
VITE_APP_VERSION=1.0.0
```

### API Configuration
The application uses the DummyJSON API for demonstration purposes. Replace with your actual API endpoints in the service files.

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices with:
- Touch-friendly interfaces
- Swipe gestures for cart management
- Offline caching capabilities
- Progressive Web App features

## 🔒 Security Features

- JWT token-based authentication
- Secure password hashing
- CSRF protection
- Input validation and sanitization
- Role-based access control

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run linting
npm run lint
```

## 📊 Performance Optimization

- Lazy loading of components
- Image optimization and caching
- Code splitting for better load times
- Service worker for offline functionality
- Efficient state management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic e-commerce functionality
- ✅ User authentication
- ✅ Product browsing and search
- ✅ Shopping cart and checkout

### Phase 2 (Next)
- 🔄 Admin panel development
- 🔄 Store owner features
- 🔄 Advanced analytics
- 🔄 Payment gateway integration

### Phase 3 (Future)
- 📋 Real-time notifications
- 📋 Advanced AI-powered recommendations
- 📋 Multi-language support
- 📋 Advanced inventory management

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Vuetify team for the beautiful UI components
- DummyJSON for the mock API data
- All contributors and supporters

---

**NearBuy** - Connecting local sellers with customers, one purchase at a time. 🛍️
