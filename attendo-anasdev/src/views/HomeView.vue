<template>
  <!-- Main container with padding and background styles -->
  <div class="p-8 bg-white text-gray-900 min-h-screen">
    <!-- Main title -->
    <h1 class="text-2xl font-bold mb-4">Home</h1>

    <!-- If the user is authenticated, display a welcome message -->
    <p v-if="user">
      <!-- Show the first name from full_name with emoji, fallback to "..." -->
      Welcome, {{ user.user_metadata?.full_name?.split(' ')[0] + " 😎" || '...' }}
    </p>

    <!-- If no user is logged in -->
    <p v-else>Please log in to continue.</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'                 // Import defineComponent to declare the component
import { useUserStore } from '@/stores/userStore'     // Import the user Pinia store

export default defineComponent({
  name: 'HomeView',                                   // Name of the component
  data() {
    return {
      user: null                                      // Local variable to store the user
    }
  },
  created() {
    const store = useUserStore()                      // Use the store
    this.user = store.user                            // Initialize with current user

    // Refresh user info if needed (async)
    store.fetchUser().then(() => {
      this.user = store.user                          // Update after fetching
    })
  }
})
</script>