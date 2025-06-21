<template>
  <!-- Main container with white background and padding -->
  <div class="p-8 bg-white text-gray-900 min-h-screen">

    <!-- Breadcrumb component for navigation trail -->
    <Breadcrumb :crumbs="$route.meta.breadcrumb" />

    <!-- Main page title -->
    <h1 class="text-2xl font-bold mb-6">
      List of assessments for
      <span class="text-blue-700">{{ ueId }}</span>
      <span class="text-gray-600 ml-2">(session: {{ sessionLabel || '...' }})</span>
    </h1>

    <!-- List of assessments displayed as clickable cards -->
    <div class="flex flex-wrap gap-4 mb-8">
      <CardLink
        v-for="epreuve in epreuves"
        :key="epreuve.id"
        :to="`/sessions/${sessionId}/ue/${ueId}/event/${epreuve.id}`"
        :label="epreuve.label"
      />
    </div>

    <!-- Form to add a new assessment using a reusable component -->
    <AddForm
      title="Add an assessment"
      label="Label:"
      placeholder="exam, project, presentation..."
      button-text="Create"
      :model-value="nouvelleEpreuve"
      :on-submit="addEpreuve"
      @update:modelValue="nouvelleEpreuve = $event"
    />
    
  </div>
</template>

<script>
// Import breadcrumb component
import Breadcrumb from '@/components/Breadcrumb.vue'

// Import reusable form component
import AddForm from '@/components/AddForm.vue'

// Import card link component
import CardLink from '@/components/CardLink.vue'

// Import UE-related service functions
import {
  loadUEPage,       // Loads all data needed for the view
  tryAddEvent,      // Attempts to add a new assessment
  fetchEvents       // Reloads assessments after addition
} from '@/services/ueService'

export default {
  name: 'UEView',
  components: {
    Breadcrumb,
    AddForm,
    CardLink
  },
  data() {
    return {
      sessionId: this.$route.params.sessionId,  // Session ID from the route
      ueId: this.$route.params.ueId,            // UE ID from the route
      sessionLabel: '',                         // Session name (for display)
      sessionCompoId: null,                     // Link between session and UE
      epreuves: [],                             // List of assessments
      nouvelleEpreuve: ''                       // New assessment input field
    }
  },
  async mounted() {
    // Initial data load on mount
    await this.loadData()
  },
  methods: {
    // Load session, session_compo, and assessments
    async loadData() {
      const { sessionLabel, sessionCompoId, epreuves } = await loadUEPage(this.sessionId, this.ueId)
      this.sessionLabel = sessionLabel
      this.sessionCompoId = sessionCompoId
      this.epreuves = epreuves
    },

    // Try to add a new assessment if the label doesn't already exist
    async addEpreuve() {
      const existingLabels = this.epreuves.map(e => e.label)
      const { success, error } = await tryAddEvent(this.nouvelleEpreuve, existingLabels, this.sessionCompoId)

      if (!success) {
        alert(error)
        return
      }

      // Reset input field and reload assessment list
      this.nouvelleEpreuve = ''
      this.epreuves = await fetchEvents(this.sessionCompoId)
    }
  }
}
</script>