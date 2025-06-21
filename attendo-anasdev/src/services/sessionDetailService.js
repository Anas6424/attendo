// Import the preconfigured Supabase instance
import supabase from '@/lib/supabase'

/**
 * Fetch the label (name) of a session by its ID.
 * Used mainly for displaying session titles.
 *
 * @param {number} sessionId - The unique ID of the session
 * @returns {Promise<string>} - The session label or an empty string if an error occurs
 */
export async function fetchSessionLabel(sessionId) {
  const { data, error } = await supabase
    .from('session')
    .select('label')
    .eq('id', sessionId)
    .single()

  if (error) {
    console.error('fetchSessionLabel error:', error.message)
    return ''
  }

  return data?.label || ''
}

/**
 * Fetch all UEs assigned to a session via the `session_compo` table.
 *
 * @param {number} sessionId - The session ID
 * @returns {Promise<Array<{ ue: string }>>} - List of assigned UEs
 */
export async function fetchAssignedUes(sessionId) {
  const { data, error } = await supabase
    .from('session_compo')
    .select('ue')
    .eq('session', sessionId)

  if (error) {
    console.error('fetchAssignedUes error:', error.message)
    return []
  }

  return data || []
}

/**
 * Fetch all UEs that are not yet assigned to the session.
 * Subtracts already assigned UEs from the global list of UEs.
 *
 * @param {number} sessionId - The session ID
 * @returns {Promise<Array<{ ue: string }>>} - UEs available for assignment
 */
export async function fetchAvailableUes(sessionId) {
  // Step 1: Get already assigned UEs
  const { data: existing, error: existingError } = await supabase
    .from('session_compo')
    .select('ue')
    .eq('session', sessionId)

  if (existingError) {
    console.error('session_compo error:', existingError.message)
    return []
  }

  const linkedUes = existing.map(row => row.ue)

  // Step 2: Get all UEs in the system
  const { data, error } = await supabase
    .from('ue')
    .select('ue')

  if (error) {
    console.error('fetchAllUes error:', error.message)
    return []
  }

  // Step 3: Filter out UEs already assigned
  return data.filter(ue => !linkedUes.includes(ue.ue))
}

/**
 * Link a UE to a session by inserting a row into `session_compo`.
 *
 * @param {number} sessionId - The session ID
 * @param {string} ueCode - The UE code to assign
 * @returns {Promise<{ success: boolean, error?: object }>} - Operation result
 */
export async function addUeToSession(sessionId, ueCode) {
  const { error } = await supabase
    .from('session_compo')
    .insert({ session: sessionId, ue: ueCode })

  return { success: !error, error }
}

/**
 * Load all data needed to display session details:
 * - the session name
 * - the list of assigned UEs
 * - the list of UEs still available
 *
 * @param {number} sessionId - The session ID
 * @returns {Promise<{ label: string, ues: Array, allUes: Array }>}
 */
export async function loadSessionDetail(sessionId) {
  const label = await fetchSessionLabel(sessionId)
  const ues = await fetchAssignedUes(sessionId)
  const allUes = await fetchAvailableUes(sessionId)

  return { label, ues, allUes }
}

/**
 * Validates the selected UE and attempts to assign it to the session.
 * Prevents insertion if the UE is empty.
 *
 * @param {number} sessionId - The session ID
 * @param {string} selectedUe - The selected UE code
 * @returns {Promise<{ success: boolean, error?: object }>}
 */
export async function tryAddUeToSession(sessionId, selectedUe) {
  if (!selectedUe) return { success: false }

  const { error } = await supabase
    .from('session_compo')
    .insert({ session: sessionId, ue: selectedUe })

  return { success: !error, error }
}