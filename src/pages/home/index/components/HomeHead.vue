<template>
  <div class="home-head flex color">
    <span class="head-title nowrap">{{ props.routerTitle }}</span>
    <div class="head-user flex">
      <span class="username nowrap">{{ username }}</span>
      <el-icon><User /></el-icon>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { ref, onMounted } from 'vue'
const userStore = useUserStore()

let username = ref('')
onMounted(() => {
  username.value = userStore.username || 'username'
})
const props = defineProps({
  routerTitle: {
    default: '规则管理'
  }
})
</script>

<style lang="scss" scoped>
.home-head {
  background-color: var(--color-background);
  z-index: 2;
  padding: 10px 20px;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  line-height: 60px;
  .head-title {
    letter-spacing: 1px;
    font-family: AliBold;
    font-size: 20px;
    font-weight: bold;
  }
  .head-user {
    align-items: center;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    .username {
      margin-right: 10px;
      opacity: 0.8;
    }
  }
}
</style>
