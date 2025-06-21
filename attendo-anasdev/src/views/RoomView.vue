<template>
  <!-- Main container of the view -->
  <div class="p-8 bg-white text-gray-900 min-h-screen">

    <!-- Display the breadcrumb navigation -->
    <Breadcrumb :crumbs="$route.meta.breadcrumb" />

    <!-- Page title with event name and UE -->
    <h1 class="text-2xl font-bold mb-6">
      Room list for
      <span class="text-blue-700">{{ eventLabel }}</span> -
      <span class="text-blue-700">{{ ueId }}</span>
    </h1>

    <!-- List of already assigned rooms -->
    <div class="flex flex-wrap gap-4 mb-8">
      <CardLink
        v-for="room in enrichedRooms"
        :key="room.id"
        :to="`/sessions/${sessionId}/ue/${ueId}/event/${eventId}/room/${room.id}`"
        :label="room.room"
        :present-count="room.presentCount"
        :capacity="room.capacity"
        :supervisor="room.supervisor"
      />
    </div>

    <!-- Form to add a new room -->
    <SelectActionBlock
      title="Add a room"
      label="Room"
      placeholder="Select a room"
      button-text="Add"
      :items="availableRooms"
      item-key="label"
      item-label="label"
      item-value="label"
      :selected="selectedRoom"
      :on-submit="addRoom"
      empty-message="All available rooms have already been assigned to this event."
      @update:selected="selectedRoom = $event"
    />
  </div>
</template>

<script>
// Vue components
import Breadcrumb from '@/components/Breadcrumb.vue'
import SelectActionBlock from '@/components/SelectActionBlock.vue'
import CardLink from '@/components/CardLink.vue'

// Data services (Supabase)
import {
  fetchEventLabel,
  fetchAllRooms,
  fetchAssignedRooms,
  addRoomToEvent
} from '@/services/roomService.js'

export default {
  name: 'RoomView',
  components: {
    Breadcrumb,
    SelectActionBlock,
    CardLink
  },
  data() {
    return {
      // URL parameters
      sessionId: this.$route.params.sessionId,
      ueId: this.$route.params.ueId,
      eventId: this.$route.params.eventId,

      // Retrieved data
      eventLabel: '',
      allRooms: [],
      assignedRooms: [],
      enrichedRooms: [],

      // Currently selected room
      selectedRoom: ''
    }
  },
  computed: {
    // Computes the list of rooms that haven't been assigned yet
    availableRooms() {
      const assigned = this.assignedRooms.map(r => r.room)
      return this.allRooms.filter(r => !assigned.includes(r.label))
    }
  },
  methods: {
    // Initial data loading
    async initialize() {
      this.eventLabel = await fetchEventLabel(this.eventId)
      this.allRooms = await fetchAllRooms()
      this.assignedRooms = await fetchAssignedRooms(this.eventId, this.allRooms)
      this.enrichedRooms = this.assignedRooms
    },

    // Add a room to the event
    async addRoom() {
      if (!this.selectedRoom) return
      const { success } = await addRoomToEvent(this.eventId, this.selectedRoom)
      if (success) {
        this.selectedRoom = ''
        this.assignedRooms = await fetchAssignedRooms(this.eventId, this.allRooms)
        this.enrichedRooms = this.assignedRooms
      }
    }
  },
  mounted() {
    this.initialize()
  }
}
</script>