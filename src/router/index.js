import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import HomePage from "@/views/HomePage.vue";
import SignUpPage from "@/views/SignUpPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import ShopPage from "@/views/ShopPage.vue";
import CheckoutPage from "@/views/CheckoutPage.vue";
import store from "@/store/auth";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            redirect: "/home"
        },
        {
            path: "/home",
            component: HomePage,
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/sign-up",
            component: SignUpPage,
            meta: {
                layout: AuthLayout
            }
        },
        {
            path: "/log-in",
            component: LoginPage,
            meta: {
                layout: AuthLayout
            }
        },
        {
            path: "/shop",
            component: ShopPage,
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/product/:id",
            component: () => import("@/views/ProductDetailPage.vue"),
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/cart",
            component: () => import("@/views/CartPage.vue"),
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/checkout",
            component: CheckoutPage,
            meta: {
                layout: DefaultLayout,
                requiresAuth: true
            }
        },
        {
            path: "/order-confirmation/:orderId",
            component: () => import("@/views/OrderConfirmationPage.vue"),
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/favorites",
            component: () => import("@/views/FavoritesPage.vue"),
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/profile",
            component: () => import("@/views/ProfilePage.vue"),
            meta: {
                layout: DefaultLayout,
                requiresAuth: true
            }
        },
        {
            path: "/orders",
            component: () => import("@/views/OrdersPage.vue"),
            meta: {
                layout: DefaultLayout,
                requiresAuth: true
            }
        },
        {
            path: "/order/:orderId",
            component: () => import("@/views/OrderDetailPage.vue"),
            meta: {
                layout: DefaultLayout,
                requiresAuth: true
            }
        },
        {
            path: "/settings",
            component: () => import("@/views/SettingsPage.vue"),
            meta: {
                layout: DefaultLayout,
                requiresAuth: true
            }
        },
        {
            path: "/admin",
            component: () => import("@/views/AdminPage.vue"),
            meta: {
                layout: DefaultLayout,
                requiresAuth: true,
                requiresAdmin: true
            }
        },
        {
            path: "/store-owner",
            component: () => import("@/views/StoreOwnerPage.vue"),
            meta: {
                layout: DefaultLayout,
                requiresAuth: true,
                requiresStoreOwner: true
            }
        },
        {
            path: "/delivery",
            component: () => import("@/views/DeliveryPage.vue"),
            meta: {
                layout: DefaultLayout,
                requiresAuth: true,
                requiresDelivery: true
            }
        },
        {
            path: "/search",
            component: () => import("@/views/SearchPage.vue"),
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/category/:category",
            component: () => import("@/views/CategoryPage.vue"),
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/about",
            component: () => import("@/views/AboutPage.vue"),
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/contact",
            component: () => import("@/views/ContactPage.vue"),
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/help",
            component: () => import("@/views/HelpPage.vue"),
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/privacy",
            component: () => import("@/views/PrivacyPage.vue"),
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/terms",
            component: () => import("@/views/TermsPage.vue"),
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/404",
            component: () => import("@/views/NotFoundPage.vue"),
            meta: {
                layout: DefaultLayout
            }
        },
        {
            path: "/:pathMatch(.*)*",
            redirect: "/404"
        }
    ]
});

// Navigation guards
router.beforeEach((to, from, next) => {
    // Check if route requires authentication
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
        next('/log-in?redirect=' + encodeURIComponent(to.fullPath));
        return;
    }
    
    // Check if route requires admin privileges
    if (to.meta.requiresAdmin && store.getters.currentUser && store.getters.currentUser.role !== 'admin') {
        next('/404');
        return;
    }
    
    // Check if route requires store owner privileges
    if (to.meta.requiresStoreOwner && store.getters.currentUser && store.getters.currentUser.role !== 'store_owner') {
        next('/404');
        return;
    }
    
    // Check if route requires delivery privileges
    if (to.meta.requiresDelivery && store.getters.currentUser && store.getters.currentUser.role !== 'delivery') {
        next('/404');
        return;
    }
    
    next();
});

export default router;
