<template>
  <div ref="chart" id="chart" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, markRaw } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  options: echarts.EChartsOption
}>()

const chart = ref<HTMLDivElement | null>(null)
const myChart = ref<echarts.ECharts | null>(null)

const init = () => {
  if (chart.value) {
    myChart.value = markRaw(echarts.init(chart.value))
    myChart.value.setOption(props.options)
  }
}

// 监听 props.options 变化
watch(
  () => props.options,
  (newOptions) => {
    if (myChart.value) {
      myChart.value.setOption(newOptions)
    }
  },
  { deep: true }
)

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (myChart.value) {
    myChart.value.dispose()  // 清理 ECharts 实例
  }
})
</script>

<style lang="scss" scoped></style>
