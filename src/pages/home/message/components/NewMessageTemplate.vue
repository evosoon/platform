<template>
  <div class="offside-config color flex">
    <article class="center flex">
      <div class="form-title">{{ props.id ? '编辑' : '新增' }}消息模板</div>

      <div class="form-title">基本配置</div>

      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>模板名称
        </span>
        <el-input v-model="templateData.name" class="input" clearable />
      </div>
      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>模板简介
        </span>
        <el-input v-model="templateData.description" class="input" clearable />
      </div>
      <div class="input-unit flex">
        <span class="input-title require"> 正文 </span>
        <el-input
          v-model="templateData.content"
          type="textarea"
          resize="none"
          rows="5"
          class="input"
          placeholder="占位符请使用 “ { 关键字 } ” 或者 “ ${ 关键字 } ”"
          clearable
        />
      </div>
      <div class="input-unit flex" style="align-items: center">
        <span class="input-title require">
          <span class="require">* </span>发送渠道
        </span>
        <el-checkbox
          v-model="templateData.sms_status"
          label="短信"
          size="large"
        />
        <el-checkbox
          v-model="templateData.email_status"
          label="邮箱"
          size="large"
        />
        <el-checkbox
          v-model="templateData.feishu_status"
          label="飞书"
          size="large"
        />
      </div>
    </article>
    <footer class="footer flex">
      <el-button
        type="primary"
        :disabled="disabled"
        @click="submit"
        class="submit"
        >保存</el-button
      >
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  onMounted,
  reactive,
  ref,
  watch,
  watchEffect
} from 'vue'
import {
  AddMessageTemplate,
  UpdateMessageTemplate
} from '@/apis/template/template'
import deepEqual from '@/utils/base/isEqual'
import type { TemplateData } from '../types';

const props = defineProps(['templateInfo', 'id'])
const emits = defineEmits(['success', 'handleClose'])
const changeUnsaved = inject<(val: boolean) => void>('changeUnsaved')

const templateDataInit = {
  name: '',
  description: '',
  content: '',
  feishu_status: false,
  email_status: false,
  sms_status: false
}
const disabled = computed(() => {
  return !!!(
    templateData.name &&
    templateData.description &&
    (templateData.feishu_status ||
      templateData.email_status ||
      templateData.sms_status)
  )
})

onMounted(() => {
  if (props.templateInfo) {
    Object.assign(templateData, props.templateInfo)
  } else {
    Object.assign(templateData, templateDataInit)
  }
})
const filterKeys = (obj: any, keys: string[]) => {
  return Object.keys(obj)
    .filter((key) => keys.includes(key))
    .reduce((pre, item) => {
      pre[item] = obj[item]
      return pre
    }, {} as any)
}
const templateData = reactive<TemplateData>({ ...templateDataInit })

watchEffect(() => {
  if (
    deepEqual(
      props.templateInfo ? props.templateInfo : templateDataInit,
      templateData
    )
  ) {
    changeUnsaved?.(false)
  } else {
    changeUnsaved?.(true)
  }
})

let choosedCannel = ref([])
watch(choosedCannel, (newVal: string[]) => {
  templateData.feishu_status = newVal.includes('飞书')
  templateData.email_status = newVal.includes('邮箱')
  templateData.sms_status = newVal.includes('短信')
})

const submit = () => {
  props.id ? updateMessageTemplate() : addMessageTemplate()
}
const addMessageTemplate = async () => {
  if (await AddMessageTemplate(templateData)) {
    emits('handleClose')
    emits('success')
  }
}
const updateMessageTemplate = async () => {
  if (
    await UpdateMessageTemplate(
      props.id,
      filterKeys(templateData, [
        'content',
        'description',
        'name',
        'email_status',
        'feishu_status',
        'sms_status'
      ]) as any
    )
  ) {
    emits('handleClose')
    emits('success')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-offside-config-styles.scss';
</style>
