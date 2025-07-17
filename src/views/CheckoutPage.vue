<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <!-- Checkout Header -->
      <div class="checkout-header">
        <h1>Checkout</h1>
        <div class="checkout-steps">
          <div
            v-for="(step, index) in checkoutSteps"
            :key="step.id"
            class="step"
            :class="{ active: currentStep === index, completed: currentStep > index }"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-label">{{ step.label }}</div>
          </div>
        </div>
      </div>

      <!-- Checkout Content -->
      <div class="checkout-content">
        <!-- Left Column - Forms -->
        <div class="checkout-forms">
          <!-- Step 1: Shipping Information -->
          <div v-if="currentStep === 0" class="checkout-step">
            <h2>Shipping Information</h2>
            <v-form ref="shippingForm" v-model="shippingFormValid">
              <div class="form-row">
                <v-text-field
                  v-model="shippingInfo.firstName"
                  label="First Name"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
                <v-text-field
                  v-model="shippingInfo.lastName"
                  label="Last Name"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </div>
              
              <v-text-field
                v-model="shippingInfo.email"
                label="Email"
                type="email"
                variant="outlined"
                :rules="[rules.required, rules.email]"
                required
              />
              
              <v-text-field
                v-model="shippingInfo.phone"
                label="Phone Number"
                variant="outlined"
                :rules="[rules.required]"
                required
              />
              
              <v-text-field
                v-model="shippingInfo.street"
                label="Street Address"
                variant="outlined"
                :rules="[rules.required]"
                required
              />
              
              <v-text-field
                v-model="shippingInfo.apartment"
                label="Apartment, suite, etc. (optional)"
                variant="outlined"
              />
              
              <div class="form-row">
                <v-text-field
                  v-model="shippingInfo.city"
                  label="City"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
                <v-text-field
                  v-model="shippingInfo.state"
                  label="State/Province"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </div>
              
              <div class="form-row">
                <v-text-field
                  v-model="shippingInfo.zipCode"
                  label="ZIP/Postal Code"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
                <v-text-field
                  v-model="shippingInfo.country"
                  label="Country"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </div>
            </v-form>
          </div>

          <!-- Step 2: Delivery Options -->
          <div v-if="currentStep === 1" class="checkout-step">
            <h2>Delivery Options</h2>
            <div class="delivery-options">
              <div
                v-for="option in deliveryOptions"
                :key="option.id"
                class="delivery-option"
                :class="{ selected: selectedDelivery === option.id }"
                @click="selectDelivery(option.id)"
              >
                <div class="option-header">
                  <v-radio
                    :model-value="selectedDelivery === option.id"
                    @update:model-value="selectDelivery(option.id)"
                  />
                  <div class="option-info">
                    <h4>{{ option.name }}</h4>
                    <p>{{ option.description }}</p>
                  </div>
                  <div class="option-price">
                    {{ option.price === 0 ? 'Free' : formatPrice(option.price) }}
                  </div>
                </div>
                <div class="option-details">
                  <span class="delivery-time">{{ option.deliveryTime }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Payment Information -->
          <div v-if="currentStep === 2" class="checkout-step">
            <h2>Payment Information</h2>
            <v-form ref="paymentForm" v-model="paymentFormValid">
              <div class="payment-methods">
                <v-radio-group v-model="paymentMethod" class="mb-4">
                  <v-radio value="card" label="Credit/Debit Card" />
                  <v-radio value="paypal" label="PayPal" />
                </v-radio-group>
              </div>

              <!-- Credit Card Form -->
              <div v-if="paymentMethod === 'card'" class="card-form">
                <v-text-field
                  v-model="paymentInfo.cardNumber"
                  label="Card Number"
                  variant="outlined"
                  :rules="[rules.required, rules.cardNumber]"
                  required
                  mask="#### #### #### ####"
                />
                
                <div class="form-row">
                  <v-text-field
                    v-model="paymentInfo.expiryMonth"
                    label="MM"
                    variant="outlined"
                    :rules="[rules.required, rules.expiryMonth]"
                    required
                    mask="##"
                    maxlength="2"
                  />
                  <v-text-field
                    v-model="paymentInfo.expiryYear"
                    label="YY"
                    variant="outlined"
                    :rules="[rules.required, rules.expiryYear]"
                    required
                    mask="##"
                    maxlength="2"
                  />
                  <v-text-field
                    v-model="paymentInfo.cvv"
                    label="CVV"
                    variant="outlined"
                    :rules="[rules.required, rules.cvv]"
                    required
                    mask="###"
                    maxlength="3"
                  />
                </div>
                
                <v-text-field
                  v-model="paymentInfo.cardholderName"
                  label="Cardholder Name"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </div>

              <!-- PayPal Form -->
              <div v-if="paymentMethod === 'paypal'" class="paypal-form">
                <v-text-field
                  v-model="paymentInfo.paypalEmail"
                  label="PayPal Email"
                  type="email"
                  variant="outlined"
                  :rules="[rules.required, rules.email]"
                  required
                />
                <p class="paypal-note">
                  You will be redirected to PayPal to complete your payment.
                </p>
              </div>
            </v-form>
          </div>

          <!-- Step 4: Order Review -->
          <div v-if="currentStep === 3" class="checkout-step">
            <h2>Review Your Order</h2>
            <div class="order-review">
              <div class="review-section">
                <h3>Shipping Information</h3>
                <div class="review-info">
                  <p>{{ shippingInfo.firstName }} {{ shippingInfo.lastName }}</p>
                  <p>{{ shippingInfo.street }}</p>
                  <p v-if="shippingInfo.apartment">{{ shippingInfo.apartment }}</p>
                  <p>{{ shippingInfo.city }}, {{ shippingInfo.state }} {{ shippingInfo.zipCode }}</p>
                  <p>{{ shippingInfo.country }}</p>
                  <p>{{ shippingInfo.email }}</p>
                  <p>{{ shippingInfo.phone }}</p>
                </div>
              </div>

              <div class="review-section">
                <h3>Delivery Method</h3>
                <div class="review-info">
                  <p>{{ getSelectedDeliveryOption().name }}</p>
                  <p>{{ getSelectedDeliveryOption().deliveryTime }}</p>
                </div>
              </div>

              <div class="review-section">
                <h3>Payment Method</h3>
                <div class="review-info">
                  <p v-if="paymentMethod === 'card'">
                    Card ending in {{ paymentInfo.cardNumber.slice(-4) }}
                  </p>
                  <p v-else>
                    PayPal: {{ paymentInfo.paypalEmail }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Order Summary -->
        <div class="order-summary">
          <h3>Order Summary</h3>
          
          <!-- Cart Items -->
          <div class="summary-items">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="summary-item"
            >
              <img
                :src="item.thumbnail || item.images?.[0]"
                :alt="item.title"
                class="item-image"
              />
              <div class="item-details">
                <h4>{{ item.title }}</h4>
                <p class="item-price">{{ formatPrice(item.price) }} × {{ item.quantity }}</p>
              </div>
              <div class="item-total">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </div>

          <!-- Order Totals -->
          <div class="order-totals">
            <div class="total-row">
              <span>Subtotal ({{ cartItemCount }} items)</span>
              <span>{{ formatPrice(cartTotals.subtotal) }}</span>
            </div>
            <div class="total-row">
              <span>Shipping</span>
              <span>{{ getSelectedDeliveryOption().price === 0 ? 'Free' : formatPrice(getSelectedDeliveryOption().price) }}</span>
            </div>
            <div class="total-row">
              <span>Tax</span>
              <span>{{ formatPrice(cartTotals.tax) }}</span>
            </div>
            <v-divider class="my-3" />
            <div class="total-row final-total">
              <span>Total</span>
              <span>{{ formatPrice(finalTotal) }}</span>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="security-notice">
            <v-icon icon="mdi-shield-check" color="success" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="checkout-navigation">
        <v-btn
          v-if="currentStep > 0"
          variant="outlined"
          @click="previousStep"
        >
          Back
        </v-btn>
        
        <v-spacer />
        
        <v-btn
          v-if="currentStep < 3"
          color="primary"
          @click="nextStep"
          :disabled="!canProceed"
          :loading="loading"
        >
          Continue
        </v-btn>
        
        <v-btn
          v-if="currentStep === 3"
          color="success"
          size="large"
          @click="placeOrder"
          :loading="placingOrder"
          :disabled="!canPlaceOrder"
        >
          Place Order
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { formatPrice } from '../services/productService';
import { calculateCartTotals } from '../services/cartService';
import { cartService } from '../services/cartService';

const store = useStore();
const router = useRouter();

// Reactive data
const currentStep = ref(0);
const loading = ref(false);
const placingOrder = ref(false);
const shippingFormValid = ref(false);
const paymentFormValid = ref(false);
const selectedDelivery = ref('standard');

// Form data
const shippingInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
  country: ''
});

const paymentInfo = ref({
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  cardholderName: '',
  paypalEmail: ''
});

const paymentMethod = ref('card');

// Checkout steps
const checkoutSteps = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' }
];

// Delivery options
const deliveryOptions = [
  {
    id: 'same-day-pickup',
    name: 'Same Day Pickup',
    description: 'Pick up your order today',
    price: 0,
    deliveryTime: 'Available today'
  },
  {
    id: 'next-day-delivery',
    name: 'Next Day Delivery',
    description: 'Fast delivery to your door',
    price: 9.99,
    deliveryTime: 'Tomorrow by 8 PM'
  },
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Regular shipping',
    price: 5.99,
    deliveryTime: '3-5 business days'
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Priority shipping',
    price: 14.99,
    deliveryTime: '1-2 business days'
  }
];

// Form validation rules
const rules = {
  required: v => !!v || 'This field is required',
  email: v => /.+@.+\..+/.test(v) || 'Please enter a valid email',
  cardNumber: v => /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(v) || 'Please enter a valid card number',
  expiryMonth: v => /^(0[1-9]|1[0-2])$/.test(v) || 'Invalid month',
  expiryYear: v => /^\d{2}$/.test(v) || 'Invalid year',
  cvv: v => /^\d{3,4}$/.test(v) || 'Invalid CVV'
};

// Computed properties
const cartItems = computed(() => store.getters.cartItems);
const cartItemCount = computed(() => store.getters.cartItemCount);
const cartTotals = computed(() => calculateCartTotals(cartItems.value));

const finalTotal = computed(() => {
  const deliveryPrice = getSelectedDeliveryOption().price;
  return cartTotals.value.total + deliveryPrice;
});

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return shippingFormValid.value;
    case 1:
      return selectedDelivery.value;
    case 2:
      return paymentFormValid.value;
    default:
      return true;
  }
});

const canPlaceOrder = computed(() => {
  return currentStep.value === 3 && !placingOrder.value;
});

// Methods
const getSelectedDeliveryOption = () => {
  return deliveryOptions.find(option => option.id === selectedDelivery.value);
};

const selectDelivery = (optionId) => {
  selectedDelivery.value = optionId;
};

const nextStep = () => {
  if (canProceed.value) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const placeOrder = async () => {
  placingOrder.value = true;
  
  try {
    const orderData = {
      cartItems: cartItems.value,
      shippingAddress: shippingInfo.value,
      billingAddress: shippingInfo.value, // Using same as shipping for simplicity
      paymentMethod: {
        type: paymentMethod.value,
        ...paymentInfo.value
      },
      deliveryOption: selectedDelivery.value,
      customerInfo: {
        name: `${shippingInfo.value.firstName} ${shippingInfo.value.lastName}`,
        email: shippingInfo.value.email,
        phone: shippingInfo.value.phone
      }
    };

    const result = await cartService.processCheckout(orderData);
    
    // Clear cart after successful order
    store.dispatch('clearCart');
    
    // Redirect to order confirmation
    router.push(`/order-confirmation/${result.orderId}`);
    
  } catch (error) {
    console.error('Error placing order:', error);
    // Handle error (show error message)
  } finally {
    placingOrder.value = false;
  }
};

// Load saved addresses if user is logged in
onMounted(async () => {
  if (store.getters.isAuthenticated) {
    try {
      const addresses = await cartService.getSavedAddresses(store.getters.currentUser.id);
      if (addresses.length > 0) {
        const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
        shippingInfo.value = { ...defaultAddress };
      }
    } catch (error) {
      console.error('Error loading saved addresses:', error);
    }
  }
});
</script>

<style scoped>
.checkout-page {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 24px 0;
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.checkout-header {
  margin-bottom: 32px;
}

.checkout-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 24px 0;
}

.checkout-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.checkout-steps::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #e0e0e0;
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
  background: #f8f9fa;
  padding: 0 16px;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: #1976d2;
  color: white;
}

.step.completed .step-number {
  background: #2ed573;
  color: white;
}

.step-label {
  font-size: 14px;
  font-weight: 500;
  color: #7f8c8d;
  text-align: center;
}

.step.active .step-label {
  color: #1976d2;
  font-weight: 600;
}

.step.completed .step-label {
  color: #2ed573;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
}

.checkout-forms {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.checkout-step h2 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 24px 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.delivery-option {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delivery-option:hover {
  border-color: #1976d2;
}

.delivery-option.selected {
  border-color: #1976d2;
  background: #f0f8ff;
}

.option-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.option-info {
  flex: 1;
}

.option-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.option-info p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}

.option-price {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.option-details {
  margin-left: 40px;
}

.delivery-time {
  font-size: 14px;
  color: #2ed573;
  font-weight: 500;
}

.payment-methods {
  margin-bottom: 24px;
}

.card-form,
.paypal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.paypal-note {
  font-size: 14px;
  color: #7f8c8d;
  font-style: italic;
}

.order-review {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.review-info p {
  margin: 0 0 4px 0;
  color: #2c3e50;
  line-height: 1.5;
}

.order-summary {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 24px;
}

.order-summary h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
}

.item-price {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
}

.item-total {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.order-totals {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #2c3e50;
}

.final-total {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin-top: 8px;
}

.security-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px;
  background: #f0f8ff;
  border-radius: 8px;
  font-size: 12px;
  color: #1976d2;
}

.checkout-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .checkout-container {
    padding: 0 16px;
  }
  
  .checkout-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .checkout-forms {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .checkout-steps {
    flex-direction: column;
    gap: 16px;
  }
  
  .checkout-steps::before {
    display: none;
  }
  
  .order-summary {
    position: static;
  }
}
</style> 