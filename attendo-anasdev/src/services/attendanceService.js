import supabase from '@/lib/supabase'

/**
 * Fetches all available teachers (supervisors).
 *
 * @returns {Promise<Array<{ acro: string }>>}
 */
export async function fetchTeachers() {
  const { data, error } = await supabase
    .from('teacher')
    .select('acro')

  if (error) throw new Error('Error loading teachers: ' + error.message)
  return data || []
}

/**
 * Updates the supervisor assigned to a given room.
 *
 * @param {number} roomId - Room ID
 * @param {string} acro - Acronym of the selected supervisor
 * @returns {Promise<Object>} - Supabase query result
 */
export async function updateSupervisor(roomId, acro) {
  return await supabase
    .from('examination_room')
    .update({ supervisor: acro })
    .eq('id', roomId)
}

/**
 * Fetches full room info, including:
 * - label
 * - assigned supervisor
 * - capacity
 * - UE linked via session_compo
 *
 * @param {number} roomId - ID of the room
 * @returns {Promise<Object>}
 */
export async function fetchRoomInfo(roomId) {
  const { data, error } = await supabase
    .from('examination_room')
    .select(`
      room,
      supervisor,
      event(session_compo(ue)),
      room_data:room(label, capacity)
    `)
    .eq('id', roomId)
    .single()

  if (error) throw new Error('Error fetchRoomInfo: ' + error.message)
  return data
}

/**
 * Fetches all students registered to a UE (via PAE),
 * and flags those already marked present in the given room.
 *
 * @param {string} ue - UE code
 * @param {number} roomId - Room ID
 * @returns {Promise<Array>}
 */
export async function fetchStudentsForUe(ue, roomId) {
  const { data: paeData, error: paeError } = await supabase
    .from('pae')
    .select('student_id, group, student(firstname, lastname)')
    .eq('ue', ue)

  if (paeError) throw new Error('Error loading students: ' + paeError.message)

  const { data: presentData, error: presentError } = await supabase
    .from('examination')
    .select('student')
    .eq('examination_room', roomId)

  if (presentError) throw new Error('Error loading attendance: ' + presentError.message)

  const presentSet = new Set(presentData.map(p => p.student))

  return paeData.map(s => ({
    student_id: s.student_id,
    group: s.group,
    firstname: s.student?.firstname || '',
    lastname: s.student?.lastname || '',
    present: presentSet.has(s.student_id)
  }))
}

/**
 * Toggles student attendance for a given room:
 * - If already present, remove them
 * - If absent, add them (unless room is full)
 *
 * @param {Object} student
 * @param {number} roomId
 * @param {Array} students - All students in the room
 * @param {number} capacity - Room capacity
 * @returns {Promise<{ error?: object }>}
 */
export async function togglePresence(student, roomId, students, capacity) {
  const isPresent = student.present
  const count = students.filter(s => s.present).length

  if (!isPresent && count >= capacity) {
    throw new Error('Maximum room capacity reached.')
  }

  if (isPresent) {
    const { error } = await supabase
      .from('examination')
      .delete()
      .eq('student', student.student_id)
      .eq('examination_room', roomId)
    return { error }
  } else {
    const { error } = await supabase
      .from('examination')
      .insert({ student: student.student_id, examination_room: roomId })
    return { error }
  }
}

/**
 * Main function that loads all necessary room data for the attendance view.
 *
 * @param {number} roomId - Room ID
 * @returns {Promise<Object>}
 */
export async function loadFullRoomData(roomId) {
  const data = await fetchRoomInfo(roomId)
  if (!data) return null

  const roomLabel = data.room || '—'
  const currentSupervisor = data.supervisor || ''
  const capacity = data.room_data?.capacity || 0
  const ue = data?.event?.session_compo?.ue

  const students = ue ? await fetchStudentsForUe(ue, roomId) : []

  return {
    roomLabel,
    currentSupervisor,
    capacity,
    students
  }
}