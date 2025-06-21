<template>
  <!-- Main application layout -->
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <!-- Header shown on all pages -->
    <HeaderView />

    <!-- Dynamic content based on the current route -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script>
// Import defineComponent to declare a Vue component
import { defineComponent } from 'vue'
// Import the Header component shown at the top of all pages
import HeaderView from '@/components/Header.vue'

export default defineComponent({
  name: 'App', // Name of the root component
  components: {
    HeaderView // Included component in the template
  }
})
</script>