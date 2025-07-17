<template>
  <v-container>
    <!-- Hero Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card class="hero-card text-center pa-8">
          <h1 class="text-h3 font-weight-bold mb-4">About NearBuy</h1>
          <p class="text-h6 text-medium-emphasis mb-6">
            Connecting local businesses with customers in your neighborhood
          </p>
          <v-btn
            color="primary"
            size="large"
            @click="scrollToSection('mission')"
          >
            Learn More
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Mission Section -->
    <v-row class="mb-8" id="mission">
      <v-col cols="12" md="6">
        <div class="d-flex flex-column h-100 justify-center">
          <h2 class="text-h4 font-weight-bold mb-4">Our Mission</h2>
          <p class="text-body-1 mb-4">
            At NearBuy, we believe in the power of local commerce. Our mission is to 
            strengthen communities by connecting customers with the amazing businesses 
            right in their neighborhood.
          </p>
          <p class="text-body-1 mb-4">
            We're committed to helping local businesses thrive in the digital age while 
            providing customers with convenient access to quality products and services 
            from trusted local vendors.
          </p>
          <v-list class="bg-transparent">
            <v-list-item
              v-for="(value, index) in missionValues"
              :key="index"
              class="px-0"
            >
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-3">
                  {{ value.icon }}
                </v-icon>
              </template>
              <v-list-item-title>{{ value.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <v-img
          src="https://picsum.photos/600/400?random=10"
          height="400"
          cover
          class="rounded-lg"
        />
      </v-col>
    </v-row>

    <!-- Story Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card class="story-card pa-8">
          <v-row align="center">
            <v-col cols="12" md="6">
              <v-img
                src="https://picsum.photos/600/400?random=11"
                height="400"
                cover
                class="rounded-lg"
              />
            </v-col>
            <v-col cols="12" md="6">
              <h2 class="text-h4 font-weight-bold mb-4">Our Story</h2>
              <p class="text-body-1 mb-4">
                Founded in 2023, NearBuy was born from a simple observation: while 
                e-commerce giants dominated the market, local businesses were struggling 
                to compete in the digital landscape.
              </p>
              <p class="text-body-1 mb-4">
                Our founders, passionate about supporting local economies, created a 
                platform that would bridge the gap between traditional local commerce 
                and modern digital convenience.
              </p>
              <p class="text-body-1">
                Today, NearBuy serves thousands of local businesses and customers across 
                the country, helping to build stronger, more connected communities.
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stats Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card class="stats-card pa-8">
          <h2 class="text-h4 font-weight-bold text-center mb-6">Our Impact</h2>
          <v-row>
            <v-col
              v-for="stat in stats"
              :key="stat.label"
              cols="12"
              sm="6"
              md="3"
              class="text-center"
            >
              <div class="stat-item">
                <div class="text-h3 font-weight-bold text-primary mb-2">
                  {{ stat.value }}
                </div>
                <div class="text-body-1 text-medium-emphasis">
                  {{ stat.label }}
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Team Section -->
    <v-row class="mb-8" id="team">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-center mb-6">Meet Our Team</h2>
        <v-row>
          <v-col
            v-for="member in team"
            :key="member.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="team-card text-center h-100">
              <v-img
                :src="member.image"
                height="250"
                cover
                class="bg-grey-lighten-2"
              />
              <v-card-text class="pa-4">
                <h3 class="text-h6 font-weight-bold mb-1">{{ member.name }}</h3>
                <p class="text-body-2 text-primary mb-2">{{ member.position }}</p>
                <p class="text-body-2 text-medium-emphasis mb-3">
                  {{ member.bio }}
                </p>
                <div class="d-flex justify-center gap-2">
                  <v-btn
                    v-for="social in member.social"
                    :key="social.platform"
                    :icon="social.icon"
                    variant="text"
                    size="small"
                    :href="social.url"
                    target="_blank"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Values Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-center mb-6">Our Values</h2>
        <v-row>
          <v-col
            v-for="value in values"
            :key="value.title"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="value-card text-center h-100 pa-6">
              <v-icon
                :icon="value.icon"
                size="64"
                color="primary"
                class="mb-4"
              />
              <h3 class="text-h6 font-weight-bold mb-3">{{ value.title }}</h3>
              <p class="text-body-2 text-medium-emphasis">
                {{ value.description }}
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- CTA Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="cta-card text-center pa-8">
          <h2 class="text-h4 font-weight-bold mb-4">Join the NearBuy Community</h2>
          <p class="text-body-1 mb-6">
            Whether you're a local business looking to grow or a customer wanting to 
            support your community, we'd love to have you on board.
          </p>
          <div class="d-flex gap-4 justify-center flex-wrap">
            <v-btn
              color="primary"
              size="large"
              @click="$router.push('/sign-up')"
            >
              Get Started
            </v-btn>
            <v-btn
              variant="outlined"
              size="large"
              @click="$router.push('/contact')"
            >
              Contact Us
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
  name: 'AboutPage',
  setup() {
    const missionValues = ref([
      {
        icon: 'mdi-store',
        title: 'Support Local Businesses'
      },
      {
        icon: 'mdi-account-group',
        title: 'Build Strong Communities'
      },
      {
        icon: 'mdi-handshake',
        title: 'Foster Trust & Relationships'
      },
      {
        icon: 'mdi-rocket-launch',
        title: 'Drive Innovation'
      }
    ])

    const stats = ref([
      {
        value: '10,000+',
        label: 'Local Businesses'
      },
      {
        value: '500,000+',
        label: 'Happy Customers'
      },
      {
        value: '50+',
        label: 'Cities Served'
      },
      {
        value: '99%',
        label: 'Customer Satisfaction'
      }
    ])

    const team = ref([
      {
        name: 'Sarah Johnson',
        position: 'CEO & Co-Founder',
        bio: 'Former tech executive with 15+ years experience in e-commerce and local business development.',
        image: 'https://picsum.photos/300/300?random=20',
        social: [
          { platform: 'linkedin', icon: 'mdi-linkedin', url: '#' },
          { platform: 'twitter', icon: 'mdi-twitter', url: '#' }
        ]
      },
      {
        name: 'Michael Chen',
        position: 'CTO & Co-Founder',
        bio: 'Software engineer and entrepreneur passionate about building technology that serves communities.',
        image: 'https://picsum.photos/300/300?random=21',
        social: [
          { platform: 'linkedin', icon: 'mdi-linkedin', url: '#' },
          { platform: 'github', icon: 'mdi-github', url: '#' }
        ]
      },
      {
        name: 'Emily Rodriguez',
        position: 'Head of Operations',
        bio: 'Operations expert focused on creating seamless experiences for both businesses and customers.',
        image: 'https://picsum.photos/300/300?random=22',
        social: [
          { platform: 'linkedin', icon: 'mdi-linkedin', url: '#' }
        ]
      },
      {
        name: 'David Kim',
        position: 'Head of Marketing',
        bio: 'Marketing strategist dedicated to helping local businesses grow their digital presence.',
        image: 'https://picsum.photos/300/300?random=23',
        social: [
          { platform: 'linkedin', icon: 'mdi-linkedin', url: '#' },
          { platform: 'twitter', icon: 'mdi-twitter', url: '#' }
        ]
      }
    ])

    const values = ref([
      {
        icon: 'mdi-heart',
        title: 'Community First',
        description: 'We prioritize the well-being and growth of local communities above all else.'
      },
      {
        icon: 'mdi-shield-check',
        title: 'Trust & Transparency',
        description: 'We build trust through honest communication and transparent business practices.'
      },
      {
        icon: 'mdi-lightbulb',
        title: 'Innovation',
        description: 'We continuously innovate to provide the best solutions for our users.'
      },
      {
        icon: 'mdi-account-group',
        title: 'Inclusivity',
        description: 'We welcome and support businesses and customers from all backgrounds.'
      },
      {
        icon: 'mdi-leaf',
        title: 'Sustainability',
        description: 'We promote sustainable business practices and environmental responsibility.'
      },
      {
        icon: 'mdi-star',
        title: 'Excellence',
        description: 'We strive for excellence in everything we do, from technology to customer service.'
      }
    ])

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    return {
      missionValues,
      stats,
      team,
      values,
      scrollToSection
    }
  }
}
</script>

<style scoped>
.hero-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.story-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stats-card {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.cta-card {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.team-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.value-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.value-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-item {
  padding: 1rem;
}
</style> 