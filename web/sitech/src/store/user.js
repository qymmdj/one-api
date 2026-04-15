import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref('')

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role >= 10)
  const isRoot = computed(() => user.value?.role === 100)

  function setUser(userData) {
    user.value = userData
    if (userData) {
      token.value = userData.access_token || userData.token
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  function clearUser() {
    user.value = null
    token.value = ''
    localStorage.removeItem('user')
  }

  function updateUser(updates) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    isRoot,
    setUser,
    clearUser,
    updateUser
  }
})
