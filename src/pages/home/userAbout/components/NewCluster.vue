<template>
  <div class="offside-config color flex">
    <article class="center flex">
      <div class="form-title">
        {{ props?.detail ? '修改群组信息' : '新增群组' }}
      </div>
      <div class="input-unit flex">
        <div class="input-title require"><span class="require">* </span>ID</div>
        <el-input v-model="cluster.id" style="width: 360px" clearable />
      </div>

      <div class="input-unit flex">
        <span class="input-title require"
          ><span class="require">* </span>ChatID</span
        >
        <el-input v-model="cluster.chat_id" style="width: 360px" clearable />
      </div>

      <div class="input-unit flex flex">
        <span class="input-title require"
          ><span class="require">* </span>名称</span
        >
        <el-input v-model="cluster.name" style="width: 360px" clearable />
      </div>
    </article>

    <div class="center-title flex" style="justify-content: end">
      <el-button
        style="padding: 15px 45px; margin: 20px 30px"
        type="primary"
        @click="submit"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AddCluster, UpdateCluster } from '@/apis/user/cluster'
import deepEqual from '@/utils/base/isEqual'
import { reactive, inject, onMounted, ref, unref, watchEffect } from 'vue'
const changeUnsaved = inject<(val: boolean) => void>('changeUnsaved')

const props = defineProps(['detail', 'info'])
const emits = defineEmits(['success', 'handleClose'])

const cluster = reactive({
  id: props?.info?.id ?? undefined,
  chat_id: props?.info?.chat_id ?? '',
  name: props?.info?.name ?? ''
})

onMounted(() => {
  if (props.info) {
    Object.assign(cluster, props.info)
  }
  tmp.value = Object.freeze({ ...cluster })
})
const tmp = ref()
watchEffect(() => {
  if (deepEqual(cluster, unref(tmp))) {
    changeUnsaved?.(false)
  } else {
    changeUnsaved?.(true)
  }
})

const submit = async () => {
  const res = props.detail
    ? await UpdateCluster(cluster)
    : await AddCluster(cluster)
  if (res) {
    emits('handleClose')
    emits('success')
  }
  // 修改
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-offside-config-styles.scss';
</style>
