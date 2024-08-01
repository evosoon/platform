<template>
  <el-watermark
    :content="watermarkConfig.content"
    :font="watermarkConfig.font"
    :z-index="watermarkConfig.zIndex"
    :rotate="watermarkConfig.rotate"
    :gap="watermarkConfig.gap"
    :offset="watermarkConfig.offset"
  >
    <div class="home flex">
      <HomeNav
        @changeRouter="changeRouter"
        :navList="navList"
        :nowRouteTitle="nowRoute?.title"
      />
      <div class="center flex">
        <HomeHead :routerTitle="nowRoute?.title" />
        <div class="center-body"><RouterView /></div>
      </div>
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HomeHead from "./components/HomeHead.vue"
import HomeNav from "./components/HomeNav.vue"
import { navList, findRoute } from './utils/navData'
import type { EnumItem } from './types';

const $router = useRouter()

const watermarkConfig = reactive({
  content: '',
  font: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.05)'
  },
  zIndex: 10,
  rotate: -22,
  gap: [200, 100] as [number, number],
  offset: [] as unknown as [number, number]
})

onMounted(() => {
  watermarkConfig.content = localStorage.getItem('username') || 'unknown user'
})

let nowRoute = ref<EnumItem | undefined>(undefined)

const changeRouter = (val: EnumItem) => {
  nowRoute.value = val
}

onMounted(() => {
  findRoute(navList, $router.currentRoute.value.fullPath, nowRoute)
})
</script>

<style lang="scss" scoped>
.home {
  overflow: auto;
  width: 100vw;
  height: 100vh;
  min-height: 512px;
  min-width: 900px;
  background-color: var(--color-background);
  .center {
    flex: 1;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    .center-body {
      flex: 1;
      border-radius: 12px 0 0 0;
      background-color: var(--color-background-light);
    }
  }
}
</style>
