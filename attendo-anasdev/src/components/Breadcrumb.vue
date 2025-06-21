<template>
  <!-- Main container for the breadcrumb -->
  <nav class="text-sm text-gray-600 mb-4" aria-label="breadcrumb">
    <!-- Horizontal list of breadcrumb items -->
    <ol class="flex space-x-2">
      <!-- Loop through each breadcrumb item -->
      <li
        v-for="(crumb, index) in resolvedCrumbs"
        :key="index"
        class="flex items-center"
      >
        <!-- If the breadcrumb has a defined link -->
        <template v-if="crumb.to">
          <!-- Clickable link to the specified route -->
          <RouterLink :to="crumb.to" class="hover:underline">
            {{ crumb.label }}
          </RouterLink>
        </template>
        <!-- Otherwise, display the label as plain text -->
        <template v-else>
          <span class="text-gray-500">{{ crumb.label }}</span>
        </template>

        <!-- Show a chevron › between items, except for the last one -->
        <span v-if="index < resolvedCrumbs.length - 1" class="mx-1">›</span>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'BreadcrumbCompo', // Component name for debugging and dev tools

  props: {
    // `crumbs` is an array of objects containing:
    // - label: the display text
    // - to: a string path or a dynamic function (optional)
    crumbs: {
      type: Array,
      required: true
    }
  },

  computed: {
    // Computes the breadcrumbs, resolving dynamic `to` values if they are functions
    resolvedCrumbs() {
      return this.crumbs.map(crumb => ({
        label: crumb.label,
        to: typeof crumb.to === 'function' ? crumb.to(this.$route) : crumb.to
      }))
    }
  }
}
</script>