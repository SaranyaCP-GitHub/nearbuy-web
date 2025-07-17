<template>
  <v-container class="py-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-icon size="32" color="primary" class="mr-3">mdi-cart</v-icon>
          <div>
            <h1 class="text-h4 font-weight-bold">Shopping Cart</h1>
            <p class="text-body-1 text-grey-darken-1 mt-1">
              {{ cartItemCount }} item{{ cartItemCount !== 1 ? 's' : '' }} in your cart
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Empty Cart State -->
    <v-row v-if="cartItemCount === 0" justify="center">
      <v-col cols="12" md="6" class="text-center">
        <v-card class="pa-8" variant="outlined">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-cart-outline</v-icon>
          <h2 class="text-h5 mb-3">Your cart is empty</h2>
          <p class="text-body-1 text-grey-darken-1 mb-6">
            Looks like you haven't added any items to your cart yet. Start shopping to see items here.
          </p>
          <v-btn
            color="primary"
            size="large"
            @click="$router.push('/shop')"
            prepend-icon="mdi-shopping"
          >
            Start Shopping
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cart Content -->
    <v-row v-else>
      <!-- Cart Items -->
      <v-col cols="12" lg="8">
        <v-card variant="outlined" class="mb-6">
          <v-card-title class="text-h6">
            Cart Items ({{ cartItemCount }})
          </v-card-title>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item
                v-for="item in cartItems"
                :key="item.id"
                class="cart-item"
              >
                <!-- Product Image -->
                <template v-slot:prepend>
                  <v-img
                    :src="item.image"
                    :alt="item.name"
                    width="80"
                    height="80"
                    cover
                    class="rounded"
                  />
                </template>

                <!-- Product Info -->
                <v-list-item-title class="text-h6 font-weight-medium">
                  {{ item.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2 text-grey-darken-1">
                  {{ item.category }}
                </v-list-item-subtitle>

                <!-- Price Info -->
                <template v-slot:append>
                  <div class="d-flex flex-column align-end">
                    <div class="d-flex align-center mb-2">
                      <span v-if="item.discount" class="text-decoration-line-through text-grey-darken-1 mr-2">
                        ${{ item.originalPrice }}
                      </span>
                      <span class="text-h6 font-weight-bold primary--text">
                        ${{ item.price }}
                      </span>
                    </div>

                    <!-- Quantity Controls -->
                    <div class="d-flex align-center">
                      <v-btn
                        icon="mdi-minus"
                        size="small"
                        variant="outlined"
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                      />
                      <v-text-field
                        v-model="item.quantity"
                        type="number"
                        min="1"
                        max="99"
                        variant="outlined"
                        density="compact"
                        class="mx-2"
                        style="max-width: 60px"
                        hide-details
                        @update:model-value="updateQuantity(item.id, $event)"
                      />
                      <v-btn
                        icon="mdi-plus"
                        size="small"
                        variant="outlined"
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        :disabled="item.quantity >= 99"
                      />
                    </div>

                    <!-- Remove Button -->
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      class="mt-2"
                      @click="removeFromCart(item.id)"
                    />
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Continue Shopping -->
        <v-btn
          variant="outlined"
          prepend-icon="mdi-arrow-left"
          @click="$router.push('/shop')"
        >
          Continue Shopping
        </v-btn>
      </v-col>

      <!-- Order Summary -->
      <v-col cols="12" lg="4">
        <v-card variant="outlined" class="sticky-top">
          <v-card-title class="text-h6">
            Order Summary
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-space-between mb-2">
              <span>Subtotal ({{ cartItemCount }} items)</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Shipping</span>
              <span>{{ shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}` }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Tax</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <v-divider class="my-3" />
            <div class="d-flex justify-space-between text-h6 font-weight-bold">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-btn
              block
              color="primary"
              size="large"
              @click="proceedToCheckout"
              :disabled="cartItemCount === 0"
              prepend-icon="mdi-credit-card"
            >
              Proceed to Checkout
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Promo Code -->
        <v-card variant="outlined" class="mt-4">
          <v-card-title class="text-h6">
            Promo Code
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="promoCode"
              label="Enter promo code"
              variant="outlined"
              density="compact"
              hide-details
              @keyup.enter="applyPromoCode"
            />
            <v-btn
              block
              variant="outlined"
              class="mt-3"
              @click="applyPromoCode"
              :disabled="!promoCode"
            >
              Apply
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'ShoppingCart',
  setup() {
    const store = useStore()
    const router = useRouter()
    const promoCode = ref('')

    const cartItems = computed(() => store.getters.cartItems)
    const cartItemCount = computed(() => store.getters.cartItemCount)
    const subtotal = computed(() => store.getters.cartTotal)
    
    const shippingCost = computed(() => {
      // Free shipping for orders over $50
      return subtotal.value >= 50 ? 0 : 5.99
    })
    
    const tax = computed(() => {
      // 8.5% tax rate
      return subtotal.value * 0.085
    })
    
    const total = computed(() => {
      return subtotal.value + shippingCost.value + tax.value
    })

    const updateQuantity = (productId, quantity) => {
      if (quantity > 0 && quantity <= 99) {
        store.dispatch('updateCartItem', { productId, quantity })
      }
    }

    const removeFromCart = (productId) => {
      store.dispatch('removeFromCart', productId)
      store.dispatch('showNotification', {
        type: 'success',
        message: 'Item removed from cart'
      })
    }

    const proceedToCheckout = () => {
      if (cartItemCount.value > 0) {
        router.push('/checkout')
      }
    }

    const applyPromoCode = () => {
      // Mock promo code validation
      const validCodes = ['SAVE10', 'FREESHIP', 'WELCOME20']
      
      if (validCodes.includes(promoCode.value.toUpperCase())) {
        store.dispatch('showNotification', {
          type: 'success',
          message: 'Promo code applied successfully!'
        })
        promoCode.value = ''
      } else {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'Invalid promo code'
        })
      }
    }

    return {
      cartItems,
      cartItemCount,
      subtotal,
      shippingCost,
      tax,
      total,
      promoCode,
      updateQuantity,
      removeFromCart,
      proceedToCheckout,
      applyPromoCode
    }
  }
}
</script>

<style scoped>
.cart-item {
  border-bottom: 1px solid #e0e0e0;
}

.cart-item:last-child {
  border-bottom: none;
}

.sticky-top {
  position: sticky;
  top: 20px;
}
</style> 