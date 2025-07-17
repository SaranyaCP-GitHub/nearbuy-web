<template>
  <v-container>
    <!-- Header -->
    <v-row class="mb-8">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-4">Terms of Service</h1>
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
        <!-- Agreement -->
        <v-card class="mb-6 pa-6">
          <h2 id="agreement" class="text-h5 font-weight-bold mb-4">Agreement to Terms</h2>
          <p class="text-body-1 mb-4">
            These Terms of Service ("Terms") govern your use of the NearBuy platform and services. 
            By accessing or using our platform, you agree to be bound by these Terms and all 
            applicable laws and regulations.
          </p>
          <p class="text-body-1">
            If you do not agree with any of these terms, you are prohibited from using or 
            accessing this platform. The materials contained in this platform are protected by 
            applicable copyright and trademark law.
          </p>
        </v-card>

        <!-- Definitions -->
        <v-card class="mb-6 pa-6">
          <h2 id="definitions" class="text-h5 font-weight-bold mb-4">Definitions</h2>
          <v-list class="bg-transparent pa-0">
            <v-list-item
              v-for="definition in definitions"
              :key="definition.term"
              class="px-0 mb-3"
            >
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold mb-1">
                  {{ definition.term }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2">
                  {{ definition.meaning }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Use License -->
        <v-card class="mb-6 pa-6">
          <h2 id="use-license" class="text-h5 font-weight-bold mb-4">Use License</h2>
          <p class="text-body-1 mb-4">
            Permission is granted to temporarily download one copy of the materials (information or software) 
            on NearBuy's platform for personal, non-commercial transitory viewing only. This is the grant 
            of a license, not a transfer of title, and under this license you may not:
          </p>
          
          <v-list class="bg-transparent pa-0 mb-4">
            <v-list-item
              v-for="restriction in useRestrictions"
              :key="restriction"
              class="px-0"
            >
              <template v-slot:prepend>
                <v-icon size="small" color="error" class="mr-2">mdi-close</v-icon>
              </template>
              <v-list-item-title class="text-body-1">{{ restriction }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <p class="text-body-1">
            This license shall automatically terminate if you violate any of these restrictions and may be 
            terminated by NearBuy at any time. Upon terminating your viewing of these materials or upon 
            the termination of this license, you must destroy any downloaded materials in your possession 
            whether in electronic or printed format.
          </p>
        </v-card>

        <!-- User Accounts -->
        <v-card class="mb-6 pa-6">
          <h2 id="user-accounts" class="text-h5 font-weight-bold mb-4">User Accounts</h2>
          
          <h3 class="text-h6 font-weight-bold mb-3">Account Creation</h3>
          <p class="text-body-1 mb-4">
            To access certain features of our platform, you must create an account. You agree to:
          </p>
          <v-list class="bg-transparent pa-0 mb-4">
            <v-list-item
              v-for="requirement in accountRequirements"
              :key="requirement"
              class="px-0"
            >
              <template v-slot:prepend>
                <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
              </template>
              <v-list-item-title class="text-body-1">{{ requirement }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <h3 class="text-h6 font-weight-bold mb-3">Account Security</h3>
          <p class="text-body-1 mb-4">
            You are responsible for maintaining the confidentiality of your account credentials and for 
            all activities that occur under your account. You must:
          </p>
          <v-list class="bg-transparent pa-0">
            <v-list-item
              v-for="security in securityRequirements"
              :key="security"
              class="px-0"
            >
              <template v-slot:prepend>
                <v-icon size="small" color="warning" class="mr-2">mdi-shield</v-icon>
              </template>
              <v-list-item-title class="text-body-1">{{ security }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Acceptable Use -->
        <v-card class="mb-6 pa-6">
          <h2 id="acceptable-use" class="text-h5 font-weight-bold mb-4">Acceptable Use Policy</h2>
          <p class="text-body-1 mb-4">
            You agree to use our platform only for lawful purposes and in accordance with these Terms. 
            You agree not to use the platform:
          </p>
          
          <v-row>
            <v-col
              v-for="category in acceptableUseCategories"
              :key="category.title"
              cols="12"
              md="6"
            >
              <v-card variant="outlined" class="pa-4 h-100">
                <div class="d-flex align-center mb-3">
                  <v-icon
                    :icon="category.icon"
                    color="error"
                    class="mr-3"
                  />
                  <h4 class="text-h6 font-weight-bold">{{ category.title }}</h4>
                </div>
                <v-list class="bg-transparent pa-0">
                  <v-list-item
                    v-for="item in category.items"
                    :key="item"
                    class="px-0"
                  >
                    <template v-slot:prepend>
                      <v-icon size="small" color="error" class="mr-2">mdi-close</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">{{ item }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- Intellectual Property -->
        <v-card class="mb-6 pa-6">
          <h2 id="intellectual-property" class="text-h5 font-weight-bold mb-4">Intellectual Property Rights</h2>
          <p class="text-body-1 mb-4">
            The platform and its original content, features, and functionality are and will remain the 
            exclusive property of NearBuy and its licensors. The platform is protected by copyright, 
            trademark, and other laws.
          </p>
          
          <v-row>
            <v-col
              v-for="ip in intellectualProperty"
              :key="ip.title"
              cols="12"
              md="6"
            >
              <div class="d-flex align-start mb-3">
                <v-icon
                  :icon="ip.icon"
                  color="primary"
                  class="mr-3 mt-1"
                />
                <div>
                  <h4 class="text-h6 font-weight-bold">{{ ip.title }}</h4>
                  <p class="text-body-2 text-medium-emphasis">
                    {{ ip.description }}
                  </p>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Privacy -->
        <v-card class="mb-6 pa-6">
          <h2 id="privacy" class="text-h5 font-weight-bold mb-4">Privacy</h2>
          <p class="text-body-1 mb-4">
            Your privacy is important to us. Please review our Privacy Policy, which also governs your 
            use of the platform, to understand our practices.
          </p>
          <v-btn
            color="primary"
            variant="outlined"
            @click="$router.push('/privacy')"
          >
            View Privacy Policy
          </v-btn>
        </v-card>

        <!-- Disclaimers -->
        <v-card class="mb-6 pa-6">
          <h2 id="disclaimers" class="text-h5 font-weight-bold mb-4">Disclaimers</h2>
          
          <v-expansion-panels variant="accordion">
            <v-expansion-panel
              v-for="disclaimer in disclaimers"
              :key="disclaimer.title"
            >
              <v-expansion-panel-title>
                {{ disclaimer.title }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <p class="text-body-2">{{ disclaimer.content }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>

        <!-- Limitations -->
        <v-card class="mb-6 pa-6">
          <h2 id="limitations" class="text-h5 font-weight-bold mb-4">Limitations</h2>
          <p class="text-body-1 mb-4">
            In no event shall NearBuy or its suppliers be liable for any damages (including, without 
            limitation, damages for loss of data or profit, or due to business interruption) arising 
            out of the use or inability to use the materials on NearBuy's platform, even if NearBuy 
            or a NearBuy authorized representative has been notified orally or in writing of the 
            possibility of such damage.
          </p>
        </v-card>

        <!-- Revisions and Errata -->
        <v-card class="mb-6 pa-6">
          <h2 id="revisions" class="text-h5 font-weight-bold mb-4">Revisions and Errata</h2>
          <p class="text-body-1 mb-4">
            The materials appearing on NearBuy's platform could include technical, typographical, or 
            photographic errors. NearBuy does not warrant that any of the materials on its platform 
            are accurate, complete, or current. NearBuy may make changes to the materials contained 
            on its platform at any time without notice.
          </p>
        </v-card>

        <!-- Links -->
        <v-card class="mb-6 pa-6">
          <h2 id="links" class="text-h5 font-weight-bold mb-4">Links</h2>
          <p class="text-body-1 mb-4">
            NearBuy has not reviewed all of the sites linked to its platform and is not responsible 
            for the contents of any such linked site. The inclusion of any link does not imply 
            endorsement by NearBuy of the site. Use of any such linked website is at the user's 
            own risk.
          </p>
        </v-card>

        <!-- Site Terms of Use Modifications -->
        <v-card class="mb-6 pa-6">
          <h2 id="modifications" class="text-h5 font-weight-bold mb-4">Site Terms of Use Modifications</h2>
          <p class="text-body-1 mb-4">
            NearBuy may revise these terms of use for its platform at any time without notice. By 
            using this platform, you are agreeing to be bound by the then current version of these 
            Terms of Service.
          </p>
        </v-card>

        <!-- Governing Law -->
        <v-card class="mb-6 pa-6">
          <h2 id="governing-law" class="text-h5 font-weight-bold mb-4">Governing Law</h2>
          <p class="text-body-1 mb-4">
            These terms and conditions are governed by and construed in accordance with the laws of 
            the United States and you irrevocably submit to the exclusive jurisdiction of the courts 
            in that location.
          </p>
        </v-card>

        <!-- Contact Information -->
        <v-card class="pa-6">
          <h2 id="contact" class="text-h5 font-weight-bold mb-4">Contact Information</h2>
          <p class="text-body-1 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          
          <v-row>
            <v-col cols="12" md="6">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-3">mdi-email</v-icon>
                <div>
                  <div class="font-weight-bold">Email</div>
                  <div class="text-body-2">legal@nearbuy.com</div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-3">mdi-map-marker</v-icon>
                <div>
                  <div class="font-weight-bold">Address</div>
                  <div class="text-body-2">
                    123 Commerce Street<br>
                    San Francisco, CA 94105
                  </div>
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

export default {
  name: 'TermsPage',
  setup() {
    const lastUpdated = ref('December 15, 2023')

    const sections = [
      { id: 'agreement', title: 'Agreement to Terms' },
      { id: 'definitions', title: 'Definitions' },
      { id: 'use-license', title: 'Use License' },
      { id: 'user-accounts', title: 'User Accounts' },
      { id: 'acceptable-use', title: 'Acceptable Use Policy' },
      { id: 'intellectual-property', title: 'Intellectual Property Rights' },
      { id: 'privacy', title: 'Privacy' },
      { id: 'disclaimers', title: 'Disclaimers' },
      { id: 'limitations', title: 'Limitations' },
      { id: 'revisions', title: 'Revisions and Errata' },
      { id: 'links', title: 'Links' },
      { id: 'modifications', title: 'Modifications' },
      { id: 'governing-law', title: 'Governing Law' },
      { id: 'contact', title: 'Contact Information' }
    ]

    const definitions = [
      {
        term: 'Platform',
        meaning: 'The NearBuy website, mobile application, and all related services and features.'
      },
      {
        term: 'User',
        meaning: 'Any individual or entity that accesses or uses the platform.'
      },
      {
        term: 'Content',
        meaning: 'Any information, data, text, graphics, photos, or other materials uploaded, posted, or transmitted through the platform.'
      },
      {
        term: 'Service',
        meaning: 'The e-commerce platform and related services provided by NearBuy.'
      }
    ]

    const useRestrictions = [
      'Modify or copy the materials',
      'Use the materials for any commercial purpose or for any public display',
      'Attempt to reverse engineer any software contained on the platform',
      'Remove any copyright or other proprietary notations from the materials',
      'Transfer the materials to another person or "mirror" the materials on any other server'
    ]

    const accountRequirements = [
      'Provide accurate and complete information',
      'Maintain the security of your account credentials',
      'Notify us immediately of any unauthorized use',
      'Comply with all applicable laws and regulations',
      'Be at least 18 years old or have parental consent'
    ]

    const securityRequirements = [
      'Use a strong, unique password',
      'Enable two-factor authentication when available',
      'Log out of your account when using shared devices',
      'Keep your contact information up to date',
      'Report suspicious activity immediately'
    ]

    const acceptableUseCategories = [
      {
        title: 'Illegal Activities',
        icon: 'mdi-gavel',
        items: [
          'Violate any applicable laws or regulations',
          'Infringe on intellectual property rights',
          'Engage in fraud or deceptive practices',
          'Distribute illegal content or materials'
        ]
      },
      {
        title: 'Harmful Behavior',
        icon: 'mdi-shield-alert',
        items: [
          'Harass, abuse, or threaten other users',
          'Spread malware or viruses',
          'Attempt to gain unauthorized access',
          'Interfere with platform functionality'
        ]
      },
      {
        title: 'Commercial Misuse',
        icon: 'mdi-store-off',
        items: [
          'Use for unauthorized commercial purposes',
          'Resell or redistribute platform access',
          'Scrape or collect user data without permission',
          'Engage in competitive analysis without authorization'
        ]
      },
      {
        title: 'Content Violations',
        icon: 'mdi-file-document-off',
        items: [
          'Post inappropriate or offensive content',
          'Share personal information without consent',
          'Upload copyrighted material without permission',
          'Create fake or misleading listings'
        ]
      }
    ]

    const intellectualProperty = [
      {
        title: 'Copyright',
        icon: 'mdi-copyright',
        description: 'All content on the platform is protected by copyright laws and owned by NearBuy or its licensors.'
      },
      {
        title: 'Trademarks',
        icon: 'mdi-trademark',
        description: 'NearBuy trademarks, logos, and service marks are protected and may not be used without permission.'
      },
      {
        title: 'Patents',
        icon: 'mdi-lightbulb',
        description: 'Our platform may contain patented technology and processes that are protected by patent law.'
      },
      {
        title: 'Trade Secrets',
        icon: 'mdi-lock',
        description: 'Confidential business information and trade secrets are protected and may not be disclosed.'
      }
    ]

    const disclaimers = [
      {
        title: 'Service Availability',
        content: 'We do not guarantee that the platform will be available at all times. We may suspend or discontinue the service at any time without notice.'
      },
      {
        title: 'Content Accuracy',
        content: 'We do not warrant the accuracy, completeness, or usefulness of any information on the platform. All content is provided "as is" without warranty.'
      },
      {
        title: 'Third-Party Content',
        content: 'We are not responsible for content provided by third parties, including sellers and other users. We do not endorse or verify third-party content.'
      },
      {
        title: 'Security',
        content: 'While we implement security measures, we cannot guarantee that the platform will be completely secure or free from vulnerabilities.'
      }
    ]

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    return {
      lastUpdated,
      sections,
      definitions,
      useRestrictions,
      accountRequirements,
      securityRequirements,
      acceptableUseCategories,
      intellectualProperty,
      disclaimers,
      scrollToSection
    }
  }
}
</script>

<style scoped>
.toc-card {
  position: sticky;
  top: 20px;
}
</style> 