<template>
  <v-container>
    <!-- Header -->
    <v-row class="mb-8">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-4">Privacy Policy</h1>
        <p class="text-h6 text-medium-emphasis">
          Last updated: {{ lastUpdated }}
        </p>
      </v-col>
    </v-row>

    <!-- Table of Contents -->
    <v-row class="mb-8">
      <v-col cols="12" md="3">
        <v-card class="toc-card pa-4">
          <h3 class="text-h6 font-weight-bold mb-4">Table of Contents</h3>
          <v-list class="bg-transparent pa-0">
            <v-list-item
              v-for="section in sections"
              :key="section.id"
              class="px-0"
              @click="scrollToSection(section.id)"
            >
              <v-list-item-title class="text-body-2">
                {{ section.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Content -->
      <v-col cols="12" md="9">
        <!-- Introduction -->
        <v-card class="mb-6 pa-6">
          <h2 id="introduction" class="text-h5 font-weight-bold mb-4">Introduction</h2>
          <p class="text-body-1 mb-4">
            At NearBuy, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
            platform and services.
          </p>
          <p class="text-body-1">
            By using NearBuy, you agree to the collection and use of information in accordance with this policy. 
            If you do not agree with our policies and practices, please do not use our service.
          </p>
        </v-card>

        <!-- Information We Collect -->
        <v-card class="mb-6 pa-6">
          <h2 id="information-collected" class="text-h5 font-weight-bold mb-4">Information We Collect</h2>
          
          <h3 class="text-h6 font-weight-bold mb-3">Personal Information</h3>
          <p class="text-body-1 mb-4">
            We collect personal information that you provide directly to us, including:
          </p>
          <v-list class="bg-transparent pa-0 mb-4">
            <v-list-item
              v-for="item in personalInfoItems"
              :key="item"
              class="px-0"
            >
              <template v-slot:prepend>
                <v-icon size="small" class="mr-2">mdi-check</v-icon>
              </template>
              <v-list-item-title class="text-body-1">{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <h3 class="text-h6 font-weight-bold mb-3">Automatically Collected Information</h3>
          <p class="text-body-1 mb-4">
            When you use our platform, we automatically collect certain information, including:
          </p>
          <v-list class="bg-transparent pa-0 mb-4">
            <v-list-item
              v-for="item in autoCollectedItems"
              :key="item"
              class="px-0"
            >
              <template v-slot:prepend>
                <v-icon size="small" class="mr-2">mdi-check</v-icon>
              </template>
              <v-list-item-title class="text-body-1">{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <h3 class="text-h6 font-weight-bold mb-3">Information from Third Parties</h3>
          <p class="text-body-1">
            We may receive information about you from third-party sources, such as social media platforms, 
            payment processors, and business partners, when you choose to connect your accounts or use 
            their services in conjunction with ours.
          </p>
        </v-card>

        <!-- How We Use Information -->
        <v-card class="mb-6 pa-6">
          <h2 id="information-use" class="text-h5 font-weight-bold mb-4">How We Use Your Information</h2>
          <p class="text-body-1 mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <v-row>
            <v-col
              v-for="use in informationUses"
              :key="use.title"
              cols="12"
              md="6"
            >
              <v-card variant="outlined" class="pa-4 h-100">
                <div class="d-flex align-center mb-3">
                  <v-icon
                    :icon="use.icon"
                    color="primary"
                    class="mr-3"
                  />
                  <h4 class="text-h6 font-weight-bold">{{ use.title }}</h4>
                </div>
                <p class="text-body-2 text-medium-emphasis">
                  {{ use.description }}
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- Information Sharing -->
        <v-card class="mb-6 pa-6">
          <h2 id="information-sharing" class="text-h5 font-weight-bold mb-4">Information Sharing and Disclosure</h2>
          <p class="text-body-1 mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties without 
            your consent, except in the following circumstances:
          </p>
          
          <v-expansion-panels variant="accordion">
            <v-expansion-panel
              v-for="sharing in sharingCircumstances"
              :key="sharing.title"
            >
              <v-expansion-panel-title>
                {{ sharing.title }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <p class="text-body-2">{{ sharing.description }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>

        <!-- Data Security -->
        <v-card class="mb-6 pa-6">
          <h2 id="data-security" class="text-h5 font-weight-bold mb-4">Data Security</h2>
          <p class="text-body-1 mb-4">
            We implement appropriate technical and organizational security measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <v-row>
            <v-col
              v-for="security in securityMeasures"
              :key="security.title"
              cols="12"
              md="6"
            >
              <div class="d-flex align-start mb-3">
                <v-icon
                  :icon="security.icon"
                  color="success"
                  class="mr-3 mt-1"
                />
                <div>
                  <h4 class="text-h6 font-weight-bold">{{ security.title }}</h4>
                  <p class="text-body-2 text-medium-emphasis">
                    {{ security.description }}
                  </p>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Your Rights -->
        <v-card class="mb-6 pa-6">
          <h2 id="your-rights" class="text-h5 font-weight-bold mb-4">Your Rights and Choices</h2>
          <p class="text-body-1 mb-4">
            You have certain rights regarding your personal information, including:
          </p>
          
          <v-list class="bg-transparent pa-0">
            <v-list-item
              v-for="right in userRights"
              :key="right.title"
              class="px-0 mb-3"
            >
              <template v-slot:prepend>
                <v-icon
                  :icon="right.icon"
                  color="primary"
                  class="mr-3"
                />
              </template>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold mb-1">
                  {{ right.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2">
                  {{ right.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Cookies and Tracking -->
        <v-card class="mb-6 pa-6">
          <h2 id="cookies-tracking" class="text-h5 font-weight-bold mb-4">Cookies and Tracking Technologies</h2>
          <p class="text-body-1 mb-4">
            We use cookies and similar tracking technologies to enhance your experience on our platform.
          </p>
          
          <v-table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="cookie in cookieTypes"
                :key="cookie.type"
              >
                <td class="font-weight-bold">{{ cookie.type }}</td>
                <td>{{ cookie.purpose }}</td>
                <td>{{ cookie.duration }}</td>
              </tr>
            </tbody>
          </v-table>
          
          <div class="mt-4">
            <v-btn
              color="primary"
              variant="outlined"
              @click="manageCookies"
            >
              Manage Cookie Preferences
            </v-btn>
          </div>
        </v-card>

        <!-- Children's Privacy -->
        <v-card class="mb-6 pa-6">
          <h2 id="children-privacy" class="text-h5 font-weight-bold mb-4">Children's Privacy</h2>
          <p class="text-body-1 mb-4">
            Our service is not intended for children under the age of 13. We do not knowingly collect 
            personal information from children under 13. If you are a parent or guardian and believe 
            that your child has provided us with personal information, please contact us immediately.
          </p>
        </v-card>

        <!-- International Transfers -->
        <v-card class="mb-6 pa-6">
          <h2 id="international-transfers" class="text-h5 font-weight-bold mb-4">International Data Transfers</h2>
          <p class="text-body-1 mb-4">
            Your information may be transferred to and processed in countries other than your own. 
            We ensure that such transfers comply with applicable data protection laws and implement 
            appropriate safeguards to protect your information.
          </p>
        </v-card>

        <!-- Changes to Policy -->
        <v-card class="mb-6 pa-6">
          <h2 id="policy-changes" class="text-h5 font-weight-bold mb-4">Changes to This Privacy Policy</h2>
          <p class="text-body-1 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by:
          </p>
          <v-list class="bg-transparent pa-0 mb-4">
            <v-list-item
              v-for="notification in policyNotifications"
              :key="notification"
              class="px-0"
            >
              <template v-slot:prepend>
                <v-icon size="small" class="mr-2">mdi-bell</v-icon>
              </template>
              <v-list-item-title class="text-body-1">{{ notification }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Contact Information -->
        <v-card class="pa-6">
          <h2 id="contact" class="text-h5 font-weight-bold mb-4">Contact Us</h2>
          <p class="text-body-1 mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          
          <v-row>
            <v-col cols="12" md="6">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-3">mdi-email</v-icon>
                <div>
                  <div class="font-weight-bold">Email</div>
                  <div class="text-body-2">privacy@nearbuy.com</div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-3">mdi-phone</v-icon>
                <div>
                  <div class="font-weight-bold">Phone</div>
                  <div class="text-body-2">+1 (555) 123-4567</div>
                </div>
              </div>
            </v-col>
          </v-row>
          
          <div class="mt-4">
            <v-btn
              color="primary"
              @click="$router.push('/contact')"
            >
              Contact Support
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'PrivacyPage',
  setup() {
    const store = useStore()
    const lastUpdated = ref('December 15, 2023')

    const sections = [
      { id: 'introduction', title: 'Introduction' },
      { id: 'information-collected', title: 'Information We Collect' },
      { id: 'information-use', title: 'How We Use Your Information' },
      { id: 'information-sharing', title: 'Information Sharing' },
      { id: 'data-security', title: 'Data Security' },
      { id: 'your-rights', title: 'Your Rights and Choices' },
      { id: 'cookies-tracking', title: 'Cookies and Tracking' },
      { id: 'children-privacy', title: "Children's Privacy" },
      { id: 'international-transfers', title: 'International Transfers' },
      { id: 'policy-changes', title: 'Changes to Policy' },
      { id: 'contact', title: 'Contact Us' }
    ]

    const personalInfoItems = [
      'Name and contact information (email, phone number, address)',
      'Account credentials and profile information',
      'Payment and billing information',
      'Order history and preferences',
      'Communication preferences and marketing preferences'
    ]

    const autoCollectedItems = [
      'Device information (IP address, browser type, operating system)',
      'Usage data (pages visited, time spent, interactions)',
      'Location information (if you enable location services)',
      'Cookies and similar tracking technologies',
      'Log files and analytics data'
    ]

    const informationUses = [
      {
        title: 'Service Provision',
        icon: 'mdi-cog',
        description: 'To provide, maintain, and improve our services, process transactions, and fulfill orders.'
      },
      {
        title: 'Communication',
        icon: 'mdi-message',
        description: 'To communicate with you about your account, orders, and important updates.'
      },
      {
        title: 'Personalization',
        icon: 'mdi-account-cog',
        description: 'To personalize your experience and provide relevant content and recommendations.'
      },
      {
        title: 'Security',
        icon: 'mdi-shield',
        description: 'To protect against fraud, unauthorized access, and ensure platform security.'
      },
      {
        title: 'Analytics',
        icon: 'mdi-chart-line',
        description: 'To analyze usage patterns and improve our platform performance and user experience.'
      },
      {
        title: 'Legal Compliance',
        icon: 'mdi-gavel',
        description: 'To comply with legal obligations and enforce our terms of service.'
      }
    ]

    const sharingCircumstances = [
      {
        title: 'Service Providers',
        description: 'We may share information with trusted third-party service providers who assist us in operating our platform, such as payment processors, shipping partners, and analytics providers.'
      },
      {
        title: 'Legal Requirements',
        description: 'We may disclose information when required by law, court order, or government request, or to protect our rights, property, or safety.'
      },
      {
        title: 'Business Transfers',
        description: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.'
      },
      {
        title: 'Consent',
        description: 'We may share information with third parties when you have given us explicit consent to do so.'
      }
    ]

    const securityMeasures = [
      {
        title: 'Encryption',
        icon: 'mdi-lock',
        description: 'We use industry-standard encryption to protect your data in transit and at rest.'
      },
      {
        title: 'Access Controls',
        icon: 'mdi-account-key',
        description: 'We implement strict access controls and authentication measures to protect your information.'
      },
      {
        title: 'Regular Audits',
        icon: 'mdi-shield-check',
        description: 'We conduct regular security audits and assessments to identify and address potential vulnerabilities.'
      },
      {
        title: 'Employee Training',
        icon: 'mdi-school',
        description: 'Our employees receive regular training on data protection and privacy best practices.'
      }
    ]

    const userRights = [
      {
        title: 'Access',
        icon: 'mdi-eye',
        description: 'You have the right to access and review your personal information that we hold.'
      },
      {
        title: 'Correction',
        icon: 'mdi-pencil',
        description: 'You can request corrections to inaccurate or incomplete personal information.'
      },
      {
        title: 'Deletion',
        icon: 'mdi-delete',
        description: 'You may request deletion of your personal information, subject to certain legal obligations.'
      },
      {
        title: 'Portability',
        icon: 'mdi-download',
        description: 'You can request a copy of your personal information in a portable format.'
      },
      {
        title: 'Objection',
        icon: 'mdi-hand',
        description: 'You have the right to object to certain processing of your personal information.'
      },
      {
        title: 'Withdrawal',
        icon: 'mdi-undo',
        description: 'You can withdraw consent for processing where consent was the legal basis.'
      }
    ]

    const cookieTypes = [
      {
        type: 'Essential',
        purpose: 'Required for basic platform functionality',
        duration: 'Session'
      },
      {
        type: 'Analytics',
        purpose: 'Help us understand how users interact with our platform',
        duration: '2 years'
      },
      {
        type: 'Marketing',
        purpose: 'Used for advertising and marketing purposes',
        duration: '1 year'
      },
      {
        type: 'Preferences',
        purpose: 'Remember your settings and preferences',
        duration: '1 year'
      }
    ]

    const policyNotifications = [
      'Posting the updated policy on our platform',
      'Sending email notifications to registered users',
      'Displaying prominent notices on our website',
      'Updating the "Last Updated" date at the top of this policy'
    ]

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    const manageCookies = () => {
      store.dispatch('showNotification', {
        type: 'info',
        message: 'Cookie management feature coming soon!'
      })
    }

    return {
      lastUpdated,
      sections,
      personalInfoItems,
      autoCollectedItems,
      informationUses,
      sharingCircumstances,
      securityMeasures,
      userRights,
      cookieTypes,
      policyNotifications,
      scrollToSection,
      manageCookies
    }
  }
}
</script>

<style scoped>
.toc-card {
  position: sticky;
  top: 20px;
}

.v-table {
  background: transparent;
}
</style> 