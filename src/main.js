import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import router from './router'
import store from './store/auth'

const vuetify = createVuetify({
  defaults: {
    VApp: {
      fullHeight: true
    }
  }
})

const app = createApp(App)

// Make store available globally
app.config.globalProperties.$store = store

app.use(router)
app.use(vuetify)
app.use(store)

app.mount('#app')
