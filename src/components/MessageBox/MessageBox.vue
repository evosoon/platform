<template>
  <div @click="open"><slot>弹窗</slot></div>
</template>

<script lang="ts" setup>
import useMessageBox from '@/hooks/useMessageBox'

interface Res {
  type: 'success' | 'fail'
  data: string
}
const emit = defineEmits(['success', 'fail'])
const props = defineProps(['type', 'message', 'confrim', 'extends'])

const open = async () => {
  const res: Res = await useMessageBox(props)
  if (res.type == 'success') emit('success', res.data)
  if (res.type == 'fail') emit('fail', res.data)
}
</script>
