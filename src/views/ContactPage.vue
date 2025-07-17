<template>
  <v-container>
    <!-- Header -->
    <v-row class="mb-8">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-4">Contact Us</h1>
        <p class="text-h6 text-medium-emphasis">
          We'd love to hear from you. Get in touch with our team.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <!-- Contact Form -->
      <v-col cols="12" lg="8">
        <v-card class="pa-6">
          <h2 class="text-h5 font-weight-bold mb-4">Send us a Message</h2>
          
          <v-form @submit.prevent="submitForm" ref="form">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.firstName"
                  label="First Name"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.lastName"
                  label="Last Name"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  :rules="[rules.required, rules.email]"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.phone"
                  label="Phone Number"
                  variant="outlined"
                  :rules="[rules.phone]"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="formData.subject"
                  :items="subjectOptions"
                  label="Subject"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.message"
                  label="Message"
                  variant="outlined"
                  rows="6"
                  :rules="[rules.required, rules.minLength]"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-checkbox
                  v-model="formData.newsletter"
                  label="Subscribe to our newsletter for updates and special offers"
                  hide-details
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  :loading="loading"
                  block
                >
                  Send Message
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>

      <!-- Contact Information -->
      <v-col cols="12" lg="4">
        <v-card class="pa-6 h-100">
          <h2 class="text-h5 font-weight-bold mb-4">Get in Touch</h2>
          
          <!-- Contact Methods -->
          <div class="mb-6">
            <div
              v-for="method in contactMethods"
              :key="method.title"
              class="d-flex align-center mb-4"
            >
              <v-icon
                :icon="method.icon"
                color="primary"
                size="24"
                class="mr-3"
              />
              <div>
                <div class="font-weight-medium">{{ method.title }}</div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ method.value }}
                </div>
              </div>
            </div>
          </div>

          <!-- Office Hours -->
          <div class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-3">Office Hours</h3>
            <div
              v-for="(hours, day) in officeHours"
              :key="day"
              class="d-flex justify-space-between mb-2"
            >
              <span class="font-weight-medium">{{ day }}</span>
              <span class="text-medium-emphasis">{{ hours }}</span>
            </div>
          </div>

          <!-- Social Media -->
          <div>
            <h3 class="text-h6 font-weight-bold mb-3">Follow Us</h3>
            <div class="d-flex gap-2">
              <v-btn
                v-for="social in socialMedia"
                :key="social.platform"
                :icon="social.icon"
                variant="outlined"
                :href="social.url"
                target="_blank"
              />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Support Options -->
    <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-center mb-6">Need Help?</h2>
        <v-row>
          <v-col
            v-for="option in supportOptions"
            :key="option.title"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="support-card text-center pa-6 h-100">
              <v-icon
                :icon="option.icon"
                size="48"
                color="primary"
                class="mb-4"
              />
              <h3 class="text-h6 font-weight-bold mb-3">{{ option.title }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                {{ option.description }}
              </p>
              <v-btn
                :color="option.buttonColor"
                variant="flat"
                @click="handleSupportOption(option)"
              >
                {{ option.buttonText }}
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- FAQ Section -->
    <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-center mb-6">Frequently Asked Questions</h2>
        <v-expansion-panels variant="accordion">
          <v-expansion-panel
            v-for="faq in faqs"
            :key="faq.question"
          >
            <v-expansion-panel-title>
              {{ faq.question }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              {{ faq.answer }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- Map Section -->
    <v-row class="mt-8">
      <v-col cols="12">
        <v-card class="pa-6">
          <h2 class="text-h4 font-weight-bold text-center mb-6">Visit Our Office</h2>
          <v-row>
            <v-col cols="12" md="6">
              <div class="map-placeholder d-flex align-center justify-center" style="height: 300px;">
                <div class="text-center">
                  <v-icon size="64" color="grey-lighten-1" class="mb-4">
                    mdi-map-marker
                  </v-icon>
                  <h3 class="text-h6 mb-2">Interactive Map</h3>
                  <p class="text-body-2 text-medium-emphasis">
                    Map integration would go here
                  </p>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <h3 class="text-h6 font-weight-bold mb-3">NearBuy Headquarters</h3>
              <p class="text-body-1 mb-4">
                123 Commerce Street<br>
                Suite 456<br>
                San Francisco, CA 94105<br>
                United States
              </p>
              <v-btn
                color="primary"
                variant="outlined"
                @click="getDirections"
              >
                Get Directions
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ContactPage',
  setup() {
    const store = useStore()
    const form = ref(null)
    const loading = ref(false)

    const formData = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      newsletter: false
    })

    const rules = {
      required: v => !!v || 'This field is required',
      email: v => /.+@.+\..+/.test(v) || 'Please enter a valid email',
      phone: v => !v || /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/\s/g, '')) || 'Please enter a valid phone number',
      minLength: v => v.length >= 10 || 'Message must be at least 10 characters'
    }

    const subjectOptions = [
      'General Inquiry',
      'Technical Support',
      'Business Partnership',
      'Billing Question',
      'Feature Request',
      'Bug Report',
      'Other'
    ]

    const contactMethods = [
      {
        title: 'Email',
        value: 'support@nearbuy.com',
        icon: 'mdi-email'
      },
      {
        title: 'Phone',
        value: '+1 (555) 123-4567',
        icon: 'mdi-phone'
      },
      {
        title: 'Live Chat',
        value: 'Available 24/7',
        icon: 'mdi-chat'
      }
    ]

    const officeHours = {
      'Monday - Friday': '9:00 AM - 6:00 PM PST',
      'Saturday': '10:00 AM - 4:00 PM PST',
      'Sunday': 'Closed'
    }

    const socialMedia = [
      { platform: 'facebook', icon: 'mdi-facebook', url: '#' },
      { platform: 'twitter', icon: 'mdi-twitter', url: '#' },
      { platform: 'linkedin', icon: 'mdi-linkedin', url: '#' },
      { platform: 'instagram', icon: 'mdi-instagram', url: '#' }
    ]

    const supportOptions = [
      {
        title: 'Help Center',
        description: 'Find answers to common questions and learn how to use our platform.',
        icon: 'mdi-help-circle',
        buttonText: 'Browse Articles',
        buttonColor: 'primary'
      },
      {
        title: 'Live Chat',
        description: 'Chat with our support team in real-time for immediate assistance.',
        icon: 'mdi-chat',
        buttonText: 'Start Chat',
        buttonColor: 'success'
      },
      {
        title: 'Email Support',
        description: 'Send us a detailed message and we\'ll get back to you within 24 hours.',
        icon: 'mdi-email',
        buttonText: 'Send Email',
        buttonColor: 'info'
      }
    ]

    const faqs = [
      {
        question: 'How do I create an account?',
        answer: 'You can create an account by clicking the "Sign Up" button in the top navigation. You\'ll need to provide your email address, create a password, and fill in some basic information.'
      },
      {
        question: 'How do I list my business on NearBuy?',
        answer: 'To list your business, you\'ll need to create a store owner account and complete our verification process. Contact our business development team for more information.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. We also support local payment methods in select regions.'
      },
      {
        question: 'How do I track my order?',
        answer: 'You can track your order by logging into your account and visiting the "Orders" section. You\'ll receive email updates and can view real-time tracking information.'
      },
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for most items. Some products may have different return terms. Please check the product page for specific return information.'
      },
      {
        question: 'How do I contact customer support?',
        answer: 'You can contact our customer support team through live chat, email, or phone. Our support team is available 24/7 to help you with any questions or issues.'
      }
    ]

    const submitForm = async () => {
      const { valid } = await form.value.validate()
      
      if (!valid) return

      loading.value = true

      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Show success message
      store.dispatch('showNotification', {
        type: 'success',
        message: 'Thank you for your message! We\'ll get back to you soon.'
      })

      // Reset form
      Object.keys(formData).forEach(key => {
        formData[key] = key === 'newsletter' ? false : ''
      })

      loading.value = false
    }

    const handleSupportOption = (option) => {
      switch (option.title) {
        case 'Help Center':
          // Navigate to help page
          break
        case 'Live Chat':
          // Open live chat
          store.dispatch('showNotification', {
            type: 'info',
            message: 'Live chat feature coming soon!'
          })
          break
        case 'Email Support':
          // Scroll to contact form
          window.scrollTo({ top: 0, behavior: 'smooth' })
          break
      }
    }

    const getDirections = () => {
      // Open maps with directions
      const address = encodeURIComponent('123 Commerce Street, San Francisco, CA 94105')
      window.open(`https://maps.google.com/?q=${address}`, '_blank')
    }

    return {
      form,
      formData,
      loading,
      rules,
      subjectOptions,
      contactMethods,
      officeHours,
      socialMedia,
      supportOptions,
      faqs,
      submitForm,
      handleSupportOption,
      getDirections
    }
  }
}
</script>

<style scoped>
.support-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.support-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.map-placeholder {
  background-color: #f5f5f5;
  border-radius: 8px;
}
</style> 