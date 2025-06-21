<template>
  <!-- Main container -->
  <div class="p-8 bg-white text-gray-900 min-h-screen">

    <!-- Breadcrumb navigation -->
    <Breadcrumb :crumbs="$route.meta.breadcrumb" />

    <!-- Page title showing the room and the assigned supervisor -->
    <h1 class="text-2xl font-bold mb-6">
      Attendance for room {{ roomLabel }} supervised by {{ currentSupervisor || '—' }}
    </h1>

    <!-- Supervisor selection block -->
    <SelectActionBlock
      title="Set Supervisor"
      label="Supervisor"
      placeholder="Select/Change Supervisor"
      button-text="Assign Supervisor"
      :items="teachers"
      item-key="acro"
      item-label="acro"
      item-value="acro"
      :selected="selectedSupervisor"
      :on-submit="updateSupervisorWrapper"
      @update:selected="selectedSupervisor = $event"
    />

    <!-- Table of students assigned to this room -->
    <TableGeneric
      :headers="['ID', 'GROUP', 'LAST NAME', 'FIRST NAME']"
      :fields="['student_id', 'group', 'lastname', 'firstname']"
      :rows="students"
    >
      <!-- Custom slot for each cell -->
      <template #cell="{ row, field }">
        <!-- Highlight if the student is marked present -->
        <div
          class="w-full h-full"
          :class="row.present ? 'bg-blue-100' : ''"
          @click="togglePresenceWrapper(row)"
        >
          {{ row[field] }}
        </div>
      </template>
    </TableGeneric>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb.vue'
import TableGeneric from '@/components/TableGeneric.vue'
import SelectActionBlock from '@/components/SelectActionBlock.vue'

import {
  fetchTeachers,
  updateSupervisor,
  togglePresence,
  loadFullRoomData
} from '@/services/attendanceService'

export default {
  name: 'AttendanceView',
  components: {
    Breadcrumb,
    TableGeneric,
    SelectActionBlock
  },
  data() {
    return {
      // Room ID from the route
      roomId: this.$route.params.roomId,

      // Room data
      roomLabel: '',
      currentSupervisor: '',
      selectedSupervisor: '',
      teachers: [],
      students: [],
      capacity: 0
    }
  },
  async created() {
    // Initial data load: room + available teachers
    await this.loadRoom()
    this.teachers = await fetchTeachers()
  },
  methods: {
    // Load all data required to manage attendance for this room
    async loadRoom() {
      const data = await loadFullRoomData(this.roomId)
      if (data) {
        this.roomLabel = data.roomLabel
        this.currentSupervisor = data.currentSupervisor
        this.capacity = data.capacity
        this.students = data.students
      }
    },

    // Set the selected supervisor for this room
    async updateSupervisorWrapper() {
      if (!this.selectedSupervisor) return
      const { error } = await updateSupervisor(this.roomId, this.selectedSupervisor)
      if (!error) {
        this.currentSupervisor = this.selectedSupervisor
        this.selectedSupervisor = ''
      }
    },

    // Toggle a student's presence status (present ↔ absent)
    async togglePresenceWrapper(student) {
      try {
        const { error } = await togglePresence(student, this.roomId, this.students, this.capacity)
        if (!error) {
          student.present = !student.present // Update UI instantly
        }
      } catch (e) {
        alert(e.message)
      }
    }
  }
}
</script>