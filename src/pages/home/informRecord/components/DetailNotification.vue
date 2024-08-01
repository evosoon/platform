<template>
  <div class="offside-config color flex">
    <article class="center color">
      <div class="form-title">详情信息</div>

      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>消息ID</span
        >
        <el-input v-model="props.info.id" disabled />
      </div>
      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>规则代号</span
        >
        <el-input v-model="props.info.rule_code" disabled />
      </div>

      <div class="input-unit flex">
        <span class="input-title require"> 发送时间</span>
        <el-input v-model="props.info.create_time" disabled />
      </div>
      <div class="input-unit flex">
        <span class="input-title require"> 推送类型</span>
        <el-input v-model="props.info.type" disabled />
      </div>
      <div class="input-unit flex">
        <span class="input-title require"> 发送渠道</span>
        <el-input v-model="props.info.strategy" disabled />
      </div>
      <div class="input-unit flex">
        <span class="input-title require"> 接收方</span>
        <el-input v-model="props.info.receiver" disabled />
      </div>
      <div class="input-unit flex">
        <span class="input-title require"> 消息内容</span>
        <el-input
          style="width: calc(100% - 120px)"
          v-model="props.info.content"
          type="textarea"
          resize="none"
          rows="5"
          readonly
        />
      </div>
      <div class="input-unit flex status">
        <span class="input-title require">消息状态</span>
        <div class="status-item flex" style="opacity: 0.6">
          <div v-if="props.info.status >= 200 && props.info.status < 300">
            <el-icon type="success"><Check style="color: green" /></el-icon
            ><span style="color: green"> 发送成功</span>
          </div>
          <div v-if="props.info.status >= 300">
            <el-icon><Close style="color: red" /></el-icon
            ><span style="color: red"> 发送失败</span>
          </div>
          <div v-if="props.info.status == -1">
            <el-icon type="success"><Clock style="color: orange" /></el-icon
            ><span style="color: orange"> 发送超时</span>
          </div>
          <div v-if="props.info.status === 0">
            <el-icon type=""><Loading style="color: gray" /></el-icon
            ><span style="color: gray"> 待发送</span>
          </div>
          <el-button type="default" link @click="jump">查看日志</el-button>
        </div>
      </div>
    </article>
    <footer class="footer flex">
      <el-button class="submit" @click="handleClose">完成</el-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const props = defineProps(['info'])
const router = useRouter()
const emits = defineEmits(['handleClose'])

const handleClose = () => {
  emits('handleClose')
}
const jump = () => {
  router.push({
    path: '/manage/log',
    query: {
      id: props.info.trace_id
    }
  })
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-offside-config-styles.scss';
.status {
  .status-item {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
