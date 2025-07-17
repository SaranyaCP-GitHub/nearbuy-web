import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
    state(){
        return{
            // Authentication
            user: null,
            token: null,
            isAuthenticated: false,
            
            // Cart management
            cart: [
                {
                    id: 1,
                    name: "Wireless Bluetooth Headphones",
                    price: 89.99,
                    originalPrice: 129.99,
                    discount: 31,
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                    category: "electronics",
                    quantity: 1,
                    addedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "Organic Cotton T-Shirt",
                    price: 24.99,
                    originalPrice: 24.99,
                    discount: 0,
                    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
                    category: "clothing",
                    quantity: 2,
                    addedAt: new Date().toISOString()
                }
            ],
            
            // Favorites/Wishlist
            favorites: [
                {
                    id: 1,
                    name: "Wireless Bluetooth Headphones",
                    price: 89.99,
                    originalPrice: 129.99,
                    discount: 31,
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                    category: "electronics",
                    rating: 4.5,
                    reviewCount: 128,
                    inStock: true,
                    addedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "Organic Cotton T-Shirt",
                    price: 24.99,
                    originalPrice: 24.99,
                    discount: 0,
                    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
                    category: "clothing",
                    rating: 4.2,
                    reviewCount: 89,
                    inStock: true,
                    addedAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Smart Home Assistant",
                    price: 149.99,
                    originalPrice: 199.99,
                    discount: 25,
                    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400",
                    category: "electronics",
                    rating: 4.7,
                    reviewCount: 256,
                    inStock: false,
                    addedAt: new Date().toISOString()
                }
            ],
            
            // User preferences
            userPreferences: {
                notifications: {
                    email: true,
                    sms: false,
                    push: true
                },
                language: 'en',
                theme: 'light'
            },
            
            // Offline data
            offlineData: {
                products: [],
                cart: [],
                favorites: []
            },
            
            // Loading states
            loading: {
                auth: false,
                products: false,
                cart: false
            },
            
            // Error states
            errors: {
                auth: null,
                products: null,
                cart: null
            },

            // Notifications
            notifications: []
        };
    },
    mutations:{
        // Authentication mutations
        setUser(state, user) {
            state.user = user;
            state.isAuthenticated = !!user;
        },
        setToken(state, token) {
            state.token = token;
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        },
        setAuthLoading(state, loading) {
            state.loading.auth = loading;
        },
        setAuthError(state, error) {
            state.errors.auth = error;
        },
        
        // Cart mutations
        addToCart(state, product) {
            const existingItem = state.cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += product.quantity || 1;
            } else {
                state.cart.push({
                    ...product,
                    quantity: product.quantity || 1,
                    addedAt: new Date().toISOString()
                });
            }
        },
        updateCartItem(state, { productId, quantity }) {
            const item = state.cart.find(item => item.id === productId);
            if (item) {
                if (quantity <= 0) {
                    state.cart = state.cart.filter(item => item.id !== productId);
                } else {
                    item.quantity = quantity;
                }
            }
        },
        removeFromCart(state, productId) {
            state.cart = state.cart.filter(item => item.id !== productId);
        },
        clearCart(state) {
            state.cart = [];
        },
        setCart(state, cart) {
            state.cart = cart;
        },
        
        // Favorites mutations
        addToFavorites(state, product) {
            if (!state.favorites.find(item => item.id === product.id)) {
                state.favorites.push({
                    ...product,
                    addedAt: new Date().toISOString()
                });
            }
        },
        removeFromFavorites(state, productId) {
            state.favorites = state.favorites.filter(item => item.id !== productId);
        },
        setFavorites(state, favorites) {
            state.favorites = favorites;
        },
        
        // User preferences mutations
        updateUserPreferences(state, preferences) {
            state.userPreferences = { ...state.userPreferences, ...preferences };
        },
        
        // Offline data mutations
        setOfflineData(state, { key, data }) {
            state.offlineData[key] = data;
        },
        
        // Loading mutations
        setLoading(state, { key, loading }) {
            state.loading[key] = loading;
        },
        
        // Error mutations
        setError(state, { key, error }) {
            state.errors[key] = error;
        },
        clearError(state, key) {
            state.errors[key] = null;
        },

        // Notification mutations
        addNotification(state, notification) {
            const id = Date.now() + Math.random();
            state.notifications.push({
                id,
                ...notification,
                timestamp: new Date().toISOString()
            });
        },
        removeNotification(state, id) {
            state.notifications = state.notifications.filter(n => n.id !== id);
        },
        clearNotifications(state) {
            state.notifications = [];
        }
    },
    actions:{
        // Authentication actions
        async login({ commit }, credentials) {
            commit('setAuthLoading', true);
            commit('clearError', 'auth');
            
            try {
                // Simulate API call - replace with actual authentication
                const response = await new Promise(resolve => {
                    setTimeout(() => {
                        resolve({
                            user: {
                                id: 1,
                                email: credentials.email,
                                name: 'John Doe',
                                role: 'customer'
                            },
                            token: 'mock-jwt-token-' + Date.now()
                        });
                    }, 1000);
                });
                
                commit('setUser', response.user);
                commit('setToken', response.token);
                return response;
            } catch (error) {
                commit('setAuthError', error.message || 'Login failed');
                throw error;
            } finally {
                commit('setAuthLoading', false);
            }
        },
        
        async register({ commit }, userData) {
            commit('setAuthLoading', true);
            commit('clearError', 'auth');
            
            try {
                // Simulate API call - replace with actual registration
                const response = await new Promise(resolve => {
                    setTimeout(() => {
                        resolve({
                            user: {
                                id: Date.now(),
                                email: userData.email,
                                name: userData.name,
                                role: 'customer'
                            },
                            token: 'mock-jwt-token-' + Date.now()
                        });
                    }, 1500);
                });
                
                commit('setUser', response.user);
                commit('setToken', response.token);
                return response;
            } catch (error) {
                commit('setAuthError', error.message || 'Registration failed');
                throw error;
            } finally {
                commit('setAuthLoading', false);
            }
        },
        
        logout({ commit }) {
            commit('setUser', null);
            commit('setToken', null);
            commit('clearCart');
            commit('setFavorites', []);
        },
        
        // Cart actions
        addToCart({ commit }, product) {
            commit('addToCart', product);
        },
        
        updateCartItem({ commit }, payload) {
            commit('updateCartItem', payload);
        },
        
        removeFromCart({ commit }, productId) {
            commit('removeFromCart', productId);
        },
        
        clearCart({ commit }) {
            commit('clearCart');
        },
        
        // Favorites actions
        toggleFavorite({ commit, state }, product) {
            const isFavorite = state.favorites.find(item => item.id === product.id);
            if (isFavorite) {
                commit('removeFromFavorites', product.id);
            } else {
                commit('addToFavorites', product);
            }
        },
        
        addToFavorites({ commit }, product) {
            commit('addToFavorites', product);
        },
        
        removeFromFavorites({ commit }, productId) {
            commit('removeFromFavorites', productId);
        },
        
        // User preferences actions
        updatePreferences({ commit }, preferences) {
            commit('updateUserPreferences', preferences);
        },
        
        // User profile actions
        async updateUserProfile({ commit }, profileData) {
            commit('setLoading', { key: 'auth', loading: true });
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Update user data
                const updatedUser = {
                    ...profileData,
                    id: Date.now() // In real app, this would come from the API
                };
                
                commit('setUser', updatedUser);
                return updatedUser;
            } catch (error) {
                commit('setError', { key: 'auth', error: error.message || 'Failed to update profile' });
                throw error;
            } finally {
                commit('setLoading', { key: 'auth', loading: false });
            }
        },
        
        // Offline sync actions
        syncOfflineData({ commit, state }) {
            // Sync cart
            if (state.offlineData.cart.length > 0) {
                commit('setCart', [...state.cart, ...state.offlineData.cart]);
                commit('setOfflineData', { key: 'cart', data: [] });
            }
            
            // Sync favorites
            if (state.offlineData.favorites.length > 0) {
                commit('setFavorites', [...state.favorites, ...state.offlineData.favorites]);
                commit('setOfflineData', { key: 'favorites', data: [] });
            }
        },

        // Notification actions
        showNotification({ commit }, notification) {
            commit('addNotification', notification);
            
            // Auto-remove notification after 5 seconds
            setTimeout(() => {
                commit('removeNotification', notification.id);
            }, 5000);
        },
        
        removeNotification({ commit }, id) {
            commit('removeNotification', id);
        },
        
        clearNotifications({ commit }) {
            commit('clearNotifications');
        }
    },
    getters: {
        // Authentication getters
        isAuthenticated: state => state.isAuthenticated,
        currentUser: state => state.user,
        authToken: state => state.token,
        
        // Cart getters
        cartItems: state => state.cart,
        cartItemCount: state => state.cart.reduce((total, item) => total + item.quantity, 0),
        cartTotal: state => state.cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        
        // Favorites getters
        favoriteItems: state => state.favorites,
        isFavorite: state => productId => state.favorites.find(item => item.id === productId),
        
        // Loading getters
        isLoading: state => key => state.loading[key],
        
        // Error getters
        getError: state => key => state.errors[key],
        
        // User preferences getters
        userPreferences: state => state.userPreferences,

        // Notification getters
        notifications: state => state.notifications
    },
    plugins: [
        createPersistedState({
            paths: ['user', 'token', 'isAuthenticated', 'cart', 'favorites', 'userPreferences', 'offlineData']
        })
    ]
})