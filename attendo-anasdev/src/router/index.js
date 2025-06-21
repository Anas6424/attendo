import { createRouter, createWebHistory } from 'vue-router'

// Views for each route
import HomeView from '@/views/HomeView.vue'
import SessionsView from '@/views/Session.vue'
import AboutView from '@/views/AboutView.vue'
import SessionDetail from '@/views/SessionDetail.vue'
import UEView from '@/views/UEView.vue'
import RoomView from '@/views/RoomView.vue'
import AttendanceView from '@/views/AttendanceView.vue'
import { useUserStore } from '@/stores/userStore'

// Define all application routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      breadcrumb: [{ label: 'Home', to: '/' }]
    }
  },
  {
    path: '/sessions',
    name: 'Sessions',
    component: SessionsView,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Sessions', to: '/sessions' }
      ]
    }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'About', to: '/about' }
      ]
    }
  },
  {
    path: '/sessions/:id',
    name: 'SessionDetail',
    component: SessionDetail,
    props: true,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Sessions', to: '/sessions' },
        { label: 'Session' }
      ]
    }
  },
  {
    path: '/sessions/:sessionId/ue/:ueId',
    name: 'UEView',
    component: UEView,
    props: true,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Sessions', to: '/sessions' },
        { label: 'Session', to: route => `/sessions/${route.params.sessionId}` },
        { label: 'UE' }
      ]
    }
  },
  {
    path: '/sessions/:sessionId/ue/:ueId/event/:eventId',
    name: 'RoomView',
    component: RoomView,
    props: true,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Sessions', to: '/sessions' },
        { label: 'Session', to: route => `/sessions/${route.params.sessionId}` },
        { label: 'UE', to: route => `/sessions/${route.params.sessionId}/ue/${route.params.ueId}` },
        { label: 'Event' }
      ]
    }
  },
  {
    path: '/sessions/:sessionId/ue/:ueId/event/:eventId/room/:roomId',
    name: 'AttendanceView',
    component: AttendanceView,
    props: true,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Sessions', to: '/sessions' },
        { label: 'Session', to: route => `/sessions/${route.params.sessionId}` },
        { label: 'UE', to: route => `/sessions/${route.params.sessionId}/ue/${route.params.ueId}` },
        { label: 'Event', to: route => `/sessions/${route.params.sessionId}/ue/${route.params.ueId}/event/${route.params.eventId}` },
        { label: 'Attendance' }
      ]
    }
  }
]

// Create the Vue Router instance using HTML5 history mode
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to protect routes requiring authentication
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (!userStore.user) {
    await userStore.fetchUser()
  }

  if (to.meta.requiresAuth && !userStore.user) {
    next('/') // Redirect to home if not authenticated
  } else {
    next() // Allow navigation
  }
})

export default router