<template>
  <div @click="drawer = true"><slot name="title">打开</slot></div>
  <el-drawer
    append-to-body
    :before-close="handleBeforeClose"
    v-model="drawer"
    ref="refDrawer"
    :size="props.size"
    :title="props.title"
    :with-header="!!props.title"
  >
    <template v-if="drawer">
      <slot name="center" :handleClose="handleClose"></slot>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import useMessageBox from '@/hooks/useMessageBox'
import { ElDrawer } from 'element-plus'
import { provide, ref } from 'vue'
const refDrawer = ref<InstanceType<typeof ElDrawer> | null>(null)
const drawer = ref(false)

interface Props {
  title?: string
  size?: string
  unsave?: boolean
}
let unsaved = ref<boolean>(false)
const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: '620px',
  unsave: false
})

// 关闭前
const handleBeforeClose = async (done: () => void) => {
  if (unsaved.value) {
    const { type } = await useMessageBox({ type: 'unsave' })
    if (type == 'success') done()
  } else {
    done()
  }
}
// 关闭
const handleClose = (val: boolean) => {
  unsaved.value = val
  if (refDrawer.value) {
    refDrawer.value.handleClose()
  }
}
// 变化
const handleUnsaved = (val: boolean = true): void => {
  unsaved.value = val
}

defineExpose({ handleClose })

provide('closeDrawer', handleClose)
provide('changeUnsaved', handleUnsaved)
// const closeDrawer = inject<() => void>('closeDrawer')
</script>
