// Import the configured Supabase instance
import supabase from '@/lib/supabase'

/**
 * Fetch the label (name) of an event based on its ID.
 * Used for dynamically displaying event names in room-related views.
 *
 * @param {number} eventId - The ID of the event
 * @returns {Promise<string>} - The event label, or an empty string on error
 */
export async function fetchEventLabel(eventId) {
  const { data, error } = await supabase
    .from('event')
    .select('label')
    .eq('id', eventId)
    .single()

  if (error) {
    console.error('fetchEventLabel error:', error.message)
    return ''
  }

  return data?.label || ''
}

/**
 * Fetch all rooms with their respective capacities.
 * Used to populate the room dropdown for event assignment.
 *
 * @returns {Promise<Array<{ label: string, capacity: number }>>}
 */
export async function fetchAllRooms() {
  const { data, error } = await supabase
    .from('room')
    .select('label, capacity')

  if (error) {
    console.error('fetchAllRooms error:', error.message)
    return []
  }

  return data || []
}

/**
 * Fetch all rooms already assigned to a given event,
 * and enrich each with capacity and number of present students.
 *
 * @param {number} eventId - The ID of the event
 * @param {Array} allRooms - Full list of rooms (with capacities)
 * @returns {Promise<Array>} - Enriched list with room, supervisor, capacity, presentCount
 */
export async function fetchAssignedRooms(eventId, allRooms) {
  const { data: assignedRooms, error } = await supabase
    .from('examination_room')
    .select('id, room, supervisor')
    .eq('event', eventId)

  if (error) {
    console.error('fetchAssignedRooms error:', error.message)
    return []
  }

  const result = await Promise.all(
    (assignedRooms || []).map(async (r) => {
      const roomMeta = allRooms.find(a => a.label === r.room)
      const capacity = roomMeta?.capacity || 0

      const { count } = await supabase
        .from('examination')
        .select('id', { count: 'exact', head: true })
        .eq('examination_room', r.id)

      return {
        ...r,
        capacity,
        presentCount: count || 0
      }
    })
  )

  return result
}

/**
 * Assign a room to an event by inserting a new record in `examination_room`.
 * The supervisor is initially set to null and can be defined later.
 *
 * @param {number} eventId - The ID of the event
 * @param {string} roomLabel - The label of the room to assign
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function addRoomToEvent(eventId, roomLabel) {
  const { error } = await supabase
    .from('examination_room')
    .insert({
      event: eventId,
      room: roomLabel,
      supervisor: null
    })

  return { success: !error, error }
}