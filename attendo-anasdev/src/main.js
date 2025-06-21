// Import base functions from Vue
import { createApp } from 'vue'
// Root component of the application
import App from '@/App.vue'
// Routing system (vue-router)
import router from '@/router'
// Main stylesheet (e.g. TailwindCSS)
import '@/assets/main.css'

// Pinia: state management system
import { createPinia } from 'pinia'
// User store (authentication via Supabase)
import { useUserStore } from '@/stores/userStore'

// Create the Vue application
const app = createApp(App)

// Initialize Pinia (state manager)
const pinia = createPinia()
app.use(pinia)

// Wait for user to be fetched (authentication step)
const userStore = useUserStore()
userStore.fetchUser().then(() => {
  // Once user is ready, install the router
  app.use(router)
  // Mount the app to the HTML element with id "app"
  app.mount('#app')
})