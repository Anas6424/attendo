<template>
  <!-- Container with horizontal scroll, rounded corners, and shadow -->
  <div class="overflow-x-auto rounded shadow">
    <!-- Main table -->
    <table class="min-w-full bg-white border border-gray-200">
      <!-- Table header -->
      <thead class="bg-gray-900 text-white text-left text-sm">
        <tr>
          <!-- Loop through provided header labels -->
          <th
            v-for="(header, i) in headers"
            :key="`header-${i}`"
            class="px-4 py-3 font-semibold"
            scope="col"
          >
            {{ header }}
          </th>
        </tr>
      </thead>

      <!-- Table body -->
      <tbody>
        <!-- Loop through rows -->
        <tr
          v-for="row in rows"
          :key="row.id"
          class="border-t hover:bg-gray-50 transition"
          @click="$emit('row-click', row.id)"
        >
          <!-- Loop through each field in the row -->
          <td
            v-for="field in fields"
            :key="`cell-${row.id}-${field}`"
            class="px-4 py-2 text-sm text-gray-800"
          >
            <!--
              Named slot fallback logic:
              - Try slot named 'cell-[field]'
              - Then try generic 'cell'
              - Otherwise render raw data from row[field]
            -->
            <slot :name="`cell-${field}`" :row="row" :field="field">
              <slot name="cell" :row="row" :field="field">
                {{ row[field] }}
              </slot>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'TableGeneric',
  props: {
    headers: { type: Array, required: true }, // Table header labels
    fields: { type: Array, required: true },  // Data field keys for each column
    rows: { type: Array, required: true }     // Array of data objects (rows)
  },
  emits: ['row-click'] // Emits row-click event with row.id when a row is clicked
}
</script>