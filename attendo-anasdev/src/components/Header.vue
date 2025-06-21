<template>
  <!-- Global application header -->
  <header>
    <!-- Top banner with app title -->
    <div class="bg-gray-900 py-4 flex justify-center">
      <h1 class="text-3xl font-bold text-fuchsia-500">Attendo</h1>
    </div>

    <!-- Navigation bar -->
    <nav class="bg-gray-100 flex items-center justify-between px-6 py-2">

      <!-- Navigation links -->
      <div class="flex gap-6 text-gray-800">
        <RouterLink to="/" class="hover:underline">Home</RouterLink>
        <RouterLink to="/sessions" class="hover:underline">Sessions</RouterLink>
        <RouterLink to="/about" class="hover:underline">About</RouterLink>
      </div>

      <!-- Authentication zone -->
      <div class="flex items-center gap-4">
        <!-- Show user email if logged in -->
        <span v-if="user" class="text-sm text-gray-600">{{ user.email }}</span>

        <!-- Google login button if user is not logged in -->
        <button
          v-if="!user"
          @click="login"
          class="text-gray-500 border border-gray-500 px-4 py-1 rounded hover:bg-gray-200 transition"
        >
          Sign in with Google
        </button>

        <!-- Logout button if user is logged in -->
        <button
          v-else
          @click="handleLogout"
          class="text-gray-500 border border-gray-500 px-4 py-1 rounded hover:bg-gray-200 transition"
        >
          Log out
        </button>
      </div>
    </nav>
  </header>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

export default defineComponent({
  name: 'HeaderView',

  data() {
    return {
      userStore: useUserStore(),
      router: useRouter()
    }
  },

  computed: {
    // Direct access to user from the store
    user() {
      return this.userStore.user
    }
  },

  created() {
    // Try to fetch user when component is created
    this.userStore.fetchUser()
  },

  methods: {
    // Trigger login via Google
    login() {
      this.userStore.login()
    },

    // Log out and redirect to homepage
    async handleLogout() {
      await this.userStore.logout()
      this.router.push('/')
    }
  }
})
</script>