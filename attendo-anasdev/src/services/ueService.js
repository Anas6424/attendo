// Import the preconfigured Supabase instance
import supabase from '@/lib/supabase'

/**
 * Fetch all events associated with a session ↔ UE relation.
 *
 * @param {number} sessionCompoId - ID of the link in the `session_compo` table
 * @returns {Promise<Array<{ id: number, label: string }>>} - List of events with their ID and label
 */
export async function fetchEvents(sessionCompoId) {
  const { data, error } = await supabase
    .from('event') // Event table
    .select('id, label') // Select only the necessary fields
    .eq('session_compo', sessionCompoId) // Filter by the session_compo relation

  if (error) {
    console.error('fetchEvents error:', error.message)
    return []
  }

  return data || []
}

/**
 * Attempt to add a new event in the `event` table.
 * Includes multiple validations:
 *  - Non-empty label
 *  - Minimum length
 *  - Label not already used (case-insensitive)
 *
 * @param {string} label - Label entered by the user
 * @param {Array<string>} existingLabels - Already existing labels
 * @param {number} sessionCompoId - ID of the session ↔ UE relation
 * @returns {Promise<{ success: boolean, error: string }>} - Result of the operation
 */
export async function tryAddEvent(label, existingLabels, sessionCompoId) {
  const labelTrim = label.trim()

  if (!labelTrim || labelTrim.length < 3) {
    return { success: false, error: 'Please enter a valid label.' }
  }

  const exists = existingLabels.some(
    e => e.toLowerCase() === labelTrim.toLowerCase()
  )
  if (exists) {
    return { success: false, error: 'This event already exists.' }
  }

  const { error } = await supabase
    .from('event')
    .insert({ label: labelTrim, session_compo: sessionCompoId })

  return { success: !error, error: error?.message }
}

/**
 * Load all necessary data for the UE view:
 * - Session label
 * - ID of the session_compo link
 * - List of associated events
 *
 * @param {number} sessionId - ID of the session
 * @param {string} ueId - ID of the UE
 * @returns {Promise<{ sessionLabel: string, sessionCompoId: number, epreuves: Array }>}
 */
export async function loadUEPage(sessionId, ueId) {
  const sessionLabel = await fetchSessionLabel(sessionId)
  const sessionCompoId = await fetchSessionCompoId(sessionId, ueId)
  const epreuves = sessionCompoId ? await fetchEvents(sessionCompoId) : []

  return { sessionLabel, sessionCompoId, epreuves }
}

/**
 * Internal helper: fetch the label of a session from the `session` table.
 * Used only by loadUEPage.
 *
 * @param {number} sessionId - Session ID
 * @returns {Promise<string>} - Session label, or empty string on error
 */
async function fetchSessionLabel(sessionId) {
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
 * Internal helper: fetch the ID of the session ↔ UE link
 * from the `session_compo` table. Used only by loadUEPage.
 *
 * @param {number} sessionId - Session ID
 * @param {string} ueId - UE ID
 * @returns {Promise<number|null>} - Relation ID, or null if not found
 */
async function fetchSessionCompoId(sessionId, ueId) {
  const { data, error } = await supabase
    .from('session_compo')
    .select('id')
    .eq('session', sessionId)
    .eq('ue', ueId)
    .single()

  if (error) {
    console.error('fetchSessionCompoId error:', error.message)
    return null
  }

  return data?.id || null
}