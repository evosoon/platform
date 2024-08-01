<script setup lang="ts">
import { onMounted, provide } from 'vue'
import { useUserStore } from './stores/user'
const userStore = useUserStore()

const pageSizeInit: number[] = [15, 25, 50, 100]
provide('pageSizeInit', pageSizeInit)

const getUserInfo = () => {
  if (localStorage.getItem('username')) {
    userStore.updateName(localStorage.getItem('username') as string)
  }
}
onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
