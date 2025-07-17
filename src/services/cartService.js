import { postRequest, getRequest, putRequest } from './apiService';

class CartService {
    constructor() {
        this.baseUrl = 'https://dummyjson.com'; // Replace with actual API
    }

    // Calculate cart totals
    calculateCartTotals(cartItems) {
        const subtotal = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
        const total = subtotal + tax + shipping;

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            shipping: parseFloat(shipping.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        };
    }

    // Validate cart items
    validateCartItems(cartItems) {
        const errors = [];

        if (!cartItems || cartItems.length === 0) {
            errors.push('Cart is empty');
            return errors;
        }

        cartItems.forEach((item, index) => {
            if (!item.id) {
                errors.push(`Item ${index + 1}: Missing product ID`);
            }
            if (!item.title) {
                errors.push(`Item ${index + 1}: Missing product title`);
            }
            if (item.price < 0) {
                errors.push(`Item ${index + 1}: Invalid price`);
            }
            if (item.quantity <= 0) {
                errors.push(`Item ${index + 1}: Invalid quantity`);
            }
            if (item.stock !== undefined && item.quantity > item.stock) {
                errors.push(`Item ${index + 1}: Quantity exceeds available stock`);
            }
        });

        return errors;
    }

    // Process checkout
    async processCheckout(checkoutData) {
        try {
            const {
                cartItems,
                shippingAddress,
                billingAddress,
                paymentMethod,
                deliveryOption,
                customerInfo
            } = checkoutData;

            // Validate cart items
            const validationErrors = this.validateCartItems(cartItems);
            if (validationErrors.length > 0) {
                throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
            }

            // Calculate totals
            const totals = this.calculateCartTotals(cartItems);

            // Create order object
            const order = {
                id: Date.now(),
                items: cartItems,
                totals,
                shippingAddress,
                billingAddress,
                paymentMethod,
                deliveryOption,
                customerInfo,
                status: 'pending',
                createdAt: new Date().toISOString(),
                estimatedDelivery: this.calculateEstimatedDelivery(deliveryOption)
            };

            // Simulate API call - replace with actual checkout endpoint
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        orderId: order.id,
                        order: order,
                        message: 'Order placed successfully'
                    });
                }, 2000);
            });

            return response;
        } catch (error) {
            console.error('Checkout error:', error);
            throw new Error(error.message || 'Checkout failed');
        }
    }

    // Calculate estimated delivery
    calculateEstimatedDelivery(deliveryOption) {
        const now = new Date();
        let deliveryDate = new Date(now);

        switch (deliveryOption) {
            case 'same-day-pickup':
                deliveryDate.setHours(now.getHours() + 2);
                return deliveryDate.toISOString();
            case 'next-day-delivery':
                deliveryDate.setDate(now.getDate() + 1);
                return deliveryDate.toISOString();
            case 'standard-delivery':
                deliveryDate.setDate(now.getDate() + 3);
                return deliveryDate.toISOString();
            case 'express-delivery':
                deliveryDate.setDate(now.getDate() + 1);
                deliveryDate.setHours(12, 0, 0, 0);
                return deliveryDate.toISOString();
            default:
                deliveryDate.setDate(now.getDate() + 3);
                return deliveryDate.toISOString();
        }
    }

    // Get order status
    async getOrderStatus(orderId) {
        try {
            // Simulate API call - replace with actual endpoint
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
                    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    
                    resolve({
                        orderId,
                        status: randomStatus,
                        lastUpdated: new Date().toISOString(),
                        trackingNumber: randomStatus === 'shipped' ? `TRK${Date.now()}` : null
                    });
                }, 1000);
            });

            return response;
        } catch (error) {
            console.error('Error fetching order status:', error);
            throw new Error('Failed to fetch order status');
        }
    }

    // Get order history
    async getOrderHistory(userId, options = {}) {
        try {
            const { page = 1, limit = 10, status = null } = options;

            // Simulate API call - replace with actual endpoint
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    const orders = Array.from({ length: 15 }, (_, i) => ({
                        id: Date.now() - i * 86400000, // Different dates
                        items: [
                            {
                                id: i + 1,
                                title: `Product ${i + 1}`,
                                price: Math.floor(Math.random() * 100) + 10,
                                quantity: Math.floor(Math.random() * 3) + 1,
                                thumbnail: `https://picsum.photos/100/100?random=${i}`
                            }
                        ],
                        totals: {
                            subtotal: Math.floor(Math.random() * 200) + 50,
                            tax: 10,
                            shipping: 5.99,
                            total: Math.floor(Math.random() * 200) + 65
                        },
                        status: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 5)],
                        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
                        estimatedDelivery: new Date(Date.now() - i * 86400000 + 3 * 86400000).toISOString()
                    }));

                    // Filter by status if provided
                    const filteredOrders = status ? orders.filter(order => order.status === status) : orders;

                    // Apply pagination
                    const startIndex = (page - 1) * limit;
                    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);

                    resolve({
                        orders: paginatedOrders,
                        total: filteredOrders.length,
                        page,
                        limit,
                        totalPages: Math.ceil(filteredOrders.length / limit)
                    });
                }, 1500);
            });

            return response;
        } catch (error) {
            console.error('Error fetching order history:', error);
            throw new Error('Failed to fetch order history');
        }
    }

    // Cancel order
    async cancelOrder(orderId, reason) {
        try {
            // Simulate API call - replace with actual endpoint
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        orderId,
                        status: 'cancelled',
                        cancelledAt: new Date().toISOString(),
                        reason,
                        message: 'Order cancelled successfully'
                    });
                }, 1000);
            });

            return response;
        } catch (error) {
            console.error('Error cancelling order:', error);
            throw new Error('Failed to cancel order');
        }
    }

    // Track order
    async trackOrder(trackingNumber) {
        try {
            // Simulate API call - replace with actual tracking endpoint
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    const trackingEvents = [
                        {
                            status: 'Order Placed',
                            location: 'Online Store',
                            timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
                            description: 'Order has been placed successfully'
                        },
                        {
                            status: 'Order Confirmed',
                            location: 'Warehouse',
                            timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
                            description: 'Order has been confirmed and is being processed'
                        },
                        {
                            status: 'Processing',
                            location: 'Warehouse',
                            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
                            description: 'Items are being prepared for shipment'
                        },
                        {
                            status: 'Shipped',
                            location: 'Distribution Center',
                            timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
                            description: 'Package has been shipped'
                        }
                    ];

                    resolve({
                        trackingNumber,
                        events: trackingEvents,
                        estimatedDelivery: new Date(Date.now() + 2 * 86400000).toISOString(),
                        currentStatus: 'Shipped'
                    });
                }, 1000);
            });

            return response;
        } catch (error) {
            console.error('Error tracking order:', error);
            throw new Error('Failed to track order');
        }
    }

    // Save shipping address
    async saveShippingAddress(userId, address) {
        try {
            // Validate address
            const requiredFields = ['firstName', 'lastName', 'street', 'city', 'state', 'zipCode', 'country'];
            const missingFields = requiredFields.filter(field => !address[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Simulate API call - replace with actual endpoint
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        addressId: Date.now(),
                        address: {
                            ...address,
                            id: Date.now(),
                            isDefault: true
                        },
                        message: 'Address saved successfully'
                    });
                }, 1000);
            });

            return response;
        } catch (error) {
            console.error('Error saving address:', error);
            throw new Error(error.message || 'Failed to save address');
        }
    }

    // Get saved addresses
    async getSavedAddresses(userId) {
        try {
            // Simulate API call - replace with actual endpoint
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    const addresses = [
                        {
                            id: 1,
                            firstName: 'John',
                            lastName: 'Doe',
                            street: '123 Main St',
                            apartment: 'Apt 4B',
                            city: 'New York',
                            state: 'NY',
                            zipCode: '10001',
                            country: 'USA',
                            phone: '+1-555-0123',
                            isDefault: true
                        },
                        {
                            id: 2,
                            firstName: 'John',
                            lastName: 'Doe',
                            street: '456 Oak Ave',
                            apartment: '',
                            city: 'Los Angeles',
                            state: 'CA',
                            zipCode: '90210',
                            country: 'USA',
                            phone: '+1-555-0456',
                            isDefault: false
                        }
                    ];

                    resolve(addresses);
                }, 800);
            });

            return response;
        } catch (error) {
            console.error('Error fetching addresses:', error);
            throw new Error('Failed to fetch saved addresses');
        }
    }

    // Validate payment method
    validatePaymentMethod(paymentMethod) {
        const errors = [];

        if (!paymentMethod.type) {
            errors.push('Payment method type is required');
        }

        if (paymentMethod.type === 'card') {
            if (!paymentMethod.cardNumber || paymentMethod.cardNumber.length < 13) {
                errors.push('Valid card number is required');
            }
            if (!paymentMethod.expiryMonth || !paymentMethod.expiryYear) {
                errors.push('Card expiry date is required');
            }
            if (!paymentMethod.cvv || paymentMethod.cvv.length < 3) {
                errors.push('Valid CVV is required');
            }
        }

        if (paymentMethod.type === 'paypal' && !paymentMethod.email) {
            errors.push('PayPal email is required');
        }

        return errors;
    }
}

// Export singleton instance
export const cartService = new CartService();

// Export utility functions
export const {
    calculateCartTotals,
    validateCartItems,
    validatePaymentMethod
} = cartService; 