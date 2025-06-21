// Import the preconfigured Supabase instance
import supabase from '@/lib/supabase'

/**
 * Fetches all sessions from the `session` table.
 * Sessions are ordered by insertion (ascending).
 *
 * @returns {Promise<Array<{ id: number, label: string }>>}
 * - An array of session objects (id and label)
 */
export async function fetchSessions() {
  const { data, error } = await supabase
    .from('session')     // Target the `session` table
    .select('*')         // Fetch all fields (id, label)
    .order('id')         // Sort sessions by ascending ID

  if (error) {
    console.error('fetchSessions error:', error.message)
    return []
  }

  return data || []
}

/**
 * Inserts a new session into the `session` table.
 *
 * @param {string} name - The label (name) of the session to add
 * @returns {Promise<Object|null>} - The inserted session object or null on error
 */
export async function addSession(name) {
  const { data, error } = await supabase
    .from('session')
    .insert({ label: name }) // Field must match the table schema
    .select()
    .single()

  if (error) {
    console.error('addSession error:', error.message)
    return null
  }

  return data
}

/**
 * Adds a new session only if it doesn't already exist (client-side check).
 * Prevents duplicate entries with the same name.
 *
 * @param {string} label - Name of the session to add
 * @param {Array} existingSessions - List of existing sessions (from fetchSessions)
 * @returns {Promise<{ added: boolean, errorMessage?: string }>}
 * - added: true if successfully inserted
 * - errorMessage: a string describing why the insertion failed
 */
export async function addSessionIfNotExists(label, existingSessions) {
  // Check for duplicates (case-insensitive)
  const exists = existingSessions.some(
    session => session.label.toLowerCase() === label.toLowerCase()
  )

  if (exists) {
    return {
      added: false,
      errorMessage: 'This session already exists.'
    }
  }

  const inserted = await addSession(label)

  if (!inserted) {
    return {
      added: false,
      errorMessage: 'Error while adding the session.'
    }
  }

  return { added: true }
}