<template>
  <!-- Main page container -->
  <div class="p-8 bg-white text-gray-900 min-h-screen">

    <!-- Breadcrumb for navigation -->
    <Breadcrumb :crumbs="$route.meta.breadcrumb" />

    <!-- Title displaying the session name -->
    <h1 class="text-2xl font-bold mb-6">
      Session <em>{{ sessionName || '...' }}</em>
    </h1>

    <!-- Table of UEs associated with this session -->
    <div v-if="ues.length">
      <TableGeneric
        :headers="['UE']"
        :fields="['ue']"
        :rows="ues"
      >
        <!-- Custom cell: link to UE details -->
        <template #cell="{ row, field }">
          <RouterLink
            :to="`/sessions/${sessionId}/ue/${row.ue}`"
            class="text-fuchsia-600 hover:underline"
          >
            {{ row[field] }}
          </RouterLink>
        </template>
      </TableGeneric>
    </div>

    <!-- Message if no UE is assigned yet -->
    <p v-else class="text-gray-500">No UE has been assigned to this session yet.</p>

    <!-- Form to select and add a UE -->
    <SelectActionBlock
      title="Add a UE to this session"
      placeholder="Select a UE"
      button-text="Add UE"
      :items="availableUes"
      item-key="ue"
      item-label="ue"
      item-value="ue"
      :selected="selectedUe"
      :on-submit="addUe"
      @update:selected="selectedUe = $event"
    />
    
  </div>
</template>

<script>
// Import reusable components
import Breadcrumb from '@/components/Breadcrumb.vue'
import TableGeneric from '@/components/TableGeneric.vue'
import SelectActionBlock from '@/components/SelectActionBlock.vue'

// Import session-related service functions
import {
  loadSessionDetail,     // Loads session name, associated UEs, and available UEs
  tryAddUeToSession       // Attempts to add a UE to a session
} from '@/services/sessionDetailService'

export default {
  name: 'SessionDetail',
  components: {
    Breadcrumb,
    TableGeneric,
    SelectActionBlock
  },
  data() {
    return {
      sessionId: this.$route.params.id, // From the URL
      sessionName: '',                  // Shown in the title
      ues: [],                          // Already linked UEs
      allUes: [],                       // All UEs available
      selectedUe: ''                    // UE selected from the dropdown
    }
  },
  computed: {
    // Dynamically filters available UEs (those not already added)
    availableUes() {
      const added = this.ues.map(u => u.ue)
      return this.allUes.filter(u => !added.includes(u.ue))
    }
  },
  async mounted() {
    // Load data when the component is mounted
    await this.loadData()
  },
  methods: {
    // Load session name, assigned UEs, and all available UEs
    async loadData() {
      const { label, ues, allUes } = await loadSessionDetail(this.sessionId)
      this.sessionName = label
      this.ues = ues
      this.allUes = allUes
    },

    // Attempt to add a UE and reload the data if successful
    async addUe() {
      const { success } = await tryAddUeToSession(this.sessionId, this.selectedUe)
      if (success) {
        this.selectedUe = ''
        await this.loadData()
      }
    }
  }
}
</script>