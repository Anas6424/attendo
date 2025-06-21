<template>
  <RouterLink
    :to="to"
    class="w-40 border rounded shadow p-4 text-center hover:shadow-lg transition bg-white"
  >
    <!-- Main text (label) -->
    <div class="text-2xl font-bold capitalize mb-1">{{ label }}</div>

    <!-- Conditional display if info is available -->
    <template v-if="hasDetails">
      <div class="text-sm text-fuchsia-600 border rounded-full inline-block px-2 py-0.5 mb-1">
        {{ presentCount }} / {{ capacity }}
      </div>
      <div class="text-sm font-semibold">
        Supervisor <span class="font-normal">{{ supervisor || '—' }}</span>
      </div>
    </template>
  </RouterLink>
</template>

<script>
export default {
  name: 'CardLink',
  props: {
    to: { type: String, required: true },
    label: { type: String, required: true },
    presentCount: Number,
    capacity: Number,
    supervisor: String
  },
  computed: {
    hasDetails() {
      return this.presentCount !== undefined && this.capacity !== undefined
    }
  }
}
</script>