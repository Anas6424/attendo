<template>
  <!-- Main container -->
  <div class="p-8 bg-white text-gray-900 min-h-screen">

    <!-- Dynamic breadcrumb -->
    <Breadcrumb :crumbs="$route.meta.breadcrumb" />

    <!-- Page title -->
    <h1 class="text-2xl font-bold mb-6">Sessions</h1>

    <!-- Block shown only if the user is authenticated -->
    <div v-if="user">

      <!-- Table displaying existing sessions -->
      <TableGeneric
        v-if="sessions.length"
        :headers="['SESSIONS']"
        :fields="['label']"
        :rows="sessions"
      >
        <!-- Custom cell with link to session details -->
        <template #cell="{ row, field }">
          <RouterLink
            :to="`/sessions/${row.id}`"
            class="text-fuchsia-600 hover:underline"
          >
            {{ row[field] }}
          </RouterLink>
        </template>
      </TableGeneric>

      <!-- Message shown if no sessions are available -->
      <p v-else class="text-gray-500">No sessions recorded.</p>

      <!-- Form to add a new session -->
      <AddForm
        title="Add a session"
        placeholder="Session name"
        button-text="Add"
        :model-value="newSession"
        :on-submit="submitSession"
        :error-message="errorMessage"
        @update:modelValue="newSession = $event"
      />
    </div>

    <!-- Message shown if the user is not authenticated -->
    <div v-else>
      <p class="text-red-500">Please log in to access session data.</p>
    </div>

  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { fetchSessions, addSessionIfNotExists } from '@/services/listSessionsService.js'
import TableGeneric from '@/components/TableGeneric.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import AddForm from '@/components/AddForm.vue'

export default defineComponent({
  name: 'SessionView',
  components: {
    TableGeneric,
    Breadcrumb,
    AddForm
  },
  data() {
    return {
      user: null,          // Current authenticated user
      sessions: [],        // List of fetched sessions
      newSession: '',      // New session input value
      errorMessage: ''     // Error message if session creation fails
    }
  },
  async created() {
    // Load user from the store
    const store = useUserStore()
    this.user = store.user
    await store.fetchUser()
    this.user = store.user

    // If authenticated, fetch sessions
    if (this.user) {
      this.sessions = await fetchSessions()
    }
  },
  methods: {
    // Handle session creation form submission
    async submitSession() {
      const label = this.newSession.trim()
      if (!label) return

      const { added, errorMessage } = await addSessionIfNotExists(label, this.sessions)

      if (added) {
        this.newSession = ''
        this.errorMessage = ''
        this.sessions = await fetchSessions()
      } else {
        this.errorMessage = errorMessage
      }
    }
  }
})
</script>