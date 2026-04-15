<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) {
    userStore.setUser(JSON.parse(user))
  }
})
</script>
