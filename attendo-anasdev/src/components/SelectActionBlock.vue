<template>
  <div class="bg-gray-50 p-4 rounded border mt-6">
    <!-- Block title -->
    <h2 class="text-md font-semibold mb-2">{{ title }}</h2>

    <!-- Show form if there are items or no empty message -->
    <form v-if="items.length || !emptyMessage" @submit.prevent="onSubmit" class="flex items-center gap-4">
      
      <!-- Optional label -->
      <label v-if="label" class="text-sm font-semibold">{{ label }}</label>

      <!-- Dropdown select -->
      <select
        :value="selected"
        @change="$emit('update:selected', $event.target.value)"
        class="border px-2 py-1 rounded w-64"
      >
        <option disabled value="">{{ placeholder }}</option>
        <option
          v-for="item in items"
          :key="itemKey ? item[itemKey] : item"
          :value="itemValue ? item[itemValue] : item"
        >
          {{ itemLabel ? item[itemLabel] : item }}
        </option>
      </select>

      <!-- Submit button -->
      <button type="submit" class="bg-fuchsia-500 text-white px-4 py-2 rounded hover:bg-fuchsia-600">
        {{ buttonText }}
      </button>
    </form>

    <!-- Message displayed when no items are available -->
    <p v-else class="text-gray-500 text-sm">
      {{ emptyMessage }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'SelectActionBlock',
  props: {
    title: String,           // Section title
    label: String,           // Optional label before select
    placeholder: String,     // Placeholder shown in <option disabled>
    buttonText: String,      // Submit button text
    items: {                 // Array of available options
      type: Array,
      required: true
    },
    selected: String,        // Currently selected value (v-model)
    itemKey: String,         // Property used for :key (e.g. "id")
    itemLabel: String,       // Property used for display text (e.g. "name")
    itemValue: String,       // Property used for option :value
    onSubmit: Function,      // Callback when form is submitted
    emptyMessage: String     // Message shown when list is empty
  },
  emits: ['update:selected'] // Emits when selected value changes
}
</script>