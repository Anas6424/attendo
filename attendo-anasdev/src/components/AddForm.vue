<template>
  <div class="mt-8">
    <h2 class="text-lg font-semibold mb-2">{{ title }}</h2>

    <form @submit.prevent="onSubmit" class="flex items-center gap-4">
      <!-- Optional label -->
      <label
        v-if="label"
        class="text-sm font-medium text-gray-700"
      >
        {{ label }}
      </label>

      <!-- Text input field -->
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        :placeholder="placeholder"
        class="border px-4 py-2 rounded w-64"
      />

      <!-- Error message -->
      <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

      <!-- Submit button -->
      <button type="submit" class="bg-fuchsia-500 text-white px-4 py-2 rounded hover:bg-fuchsia-600">
        {{ buttonText }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AddForm',
  props: {
    title: String,
    placeholder: String,
    label: String,
    buttonText: String,
    errorMessage: String,
    modelValue: String, // used for v-model binding
    onSubmit: Function
  },
  emits: ['update:modelValue']
}
</script>