<template>
  <!-- Main container with padding, white background and dark text -->
  <div class="p-8 bg-white text-gray-900 min-h-screen">
    <!-- Breadcrumb component for navigation -->
    <Breadcrumb :crumbs="$route.meta.breadcrumb" />

    <!-- Main page title -->
    <h1 class="text-2xl font-bold mb-4">About</h1>

    <!-- Paragraph introducing the project author -->
    <p class="mb-2">
      Project created by <strong>Anas-dev</strong>
    </p>

    <!-- List of technologies used -->
    <p class="mb-2">
      Technologies used: Vue.js, Pinia, Vue Router, Supabase, TailwindCSS
    </p>
  </div>
</template>

<script>
import { defineComponent } from 'vue' // Import defineComponent from Vue
import Breadcrumb from '@/components/Breadcrumb.vue' // Import the breadcrumb component

export default defineComponent({
  name: 'AboutView', // Name of the component
  components: { Breadcrumb } // Register components
})
</script>