<template>
  <div v-if="props.data === null" class="box flex">
    <span class="text">网络出错啦！请检查网络后重试</span>
    <el-button type="primary" text @click="handleRequest"><el-icon><MagicStick /></el-icon><span>点击重试</span></el-button>
  </div>
  <div v-else>暂无数据</div>
</template>

<script lang="ts" setup>
const props = defineProps(['data'])
const emits = defineEmits(['request'])
const handleRequest = () => {
  emits('request')
}

</script>

<style lang="scss" scoped>
   .box{
    flex-direction: column;
     .text {
        font-size: 14px;
    }
   }
</style>