import { defineStore } from 'pinia'      // Import Pinia's store creation function
import { ref } from 'vue'                // Import ref for declaring reactive variables
import supabase from '@/lib/supabase'    // Import the configured Supabase instance

// Define the "user" store
export const useUserStore = defineStore('user', () => {
  // Reactive variable to store the authenticated user
  const user = ref(null)

  // Fetch the currently authenticated user from Supabase
  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser()
    user.value = data.user
  }

  // Log in using Google OAuth
  const login = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  // Log out the user
  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    window.location.reload() // Reload the app to reflect logout across all views
  }

  // Listen for changes in auth state (login, logout, token refresh)
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })

  // Expose variables and functions from the store
  return {
    user,
    fetchUser,
    login,
    logout
  }
})