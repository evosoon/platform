<template>
  <div @click="centerDialogVisible = true">
    <slot>
       打开
    </slot>
  </div>

  <el-dialog
    v-model="centerDialogVisible"
    :title="props.title"
    :width="props.width"
    append-to-body
    align-center 
    style="border-radius: 6px;"
  >
  <article class="center color">
   {{props.data}}
  </article>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCopy(props.data)" >
        <el-icon><DocumentCopy /></el-icon><span>复制</span>
        </el-button>
        <el-button type="primary" @click="centerDialogVisible = false">
          完成
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { MessageType, useElMessage } from "@/hooks/useMessage";
interface Props {
  title:string
  width:number
  data:string
}
const props = withDefaults(defineProps<Props>(),{
  title:'模板内容',
  width: 800,
  data:''
})
const centerDialogVisible = ref(false)

const handleCopy = (data:string)=>{
  navigator.clipboard.writeText(data).then(() => {
    useElMessage('复制成功',MessageType.SUCCESS)
  });
}
</script>

<style lang="scss" scoped>
    .center{
    min-width: 300px;
    max-width: 1200px;
    min-height: 60px;
    max-height: 60vh;
    overflow: auto;
    text-align: left;
    white-space: pre-wrap;
    padding: 6px;
    box-shadow: 0 0 6px 3px var(--color-background-light) inset;
    border-radius: 6px;
    }
</style>