<template>
  <div class="form-title">渠道信息</div>
  <div class="input-unit flex">
    <span class="input-title require">
      <span class="require">* </span>渠道选择
    </span>
    <el-checkbox-group v-model="choosedChannel">
      <el-checkbox label="短信" value="短信" />
      <el-checkbox label="邮箱" value="邮箱" />
      <el-checkbox label="飞书" value="飞书" />
    </el-checkbox-group>
  </div>
  <!--  -->
  <template v-if="choosedChannel.length">
    <!--  -->
    <template
      v-if="
        choosedChannel.length &&
        choosedChannel[choosedChannel.length - 1] == '飞书'
      "
    >
     <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>机器人选择
        </span>
        <el-select-v2
          v-model="channel.feishu_app_id"
          :options="options.robotList"
          filterable
          placeholder="请选择"
          style="width: 200px"
        />
      </div>
      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>群组选择
        </span>
        <el-select-v2
          v-model="channel.chat_id"
          :options="options.clusterList"
          placeholder="请选择"
          filterable
          style="width: 200px"
        />
      </div>
     <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>消息类型
        </span>
        <el-radio-group v-model="channel.message_type" class="ml-4">
          <el-radio value="post" size="large">富文本</el-radio>
          <el-radio value="card" size="large">卡片</el-radio>
        </el-radio-group>
      </div>
    </template>

    <!-- 飞书 -->
    <template
      v-if="
        channel.message_type == 'card' && choosedChannel[choosedChannel.length - 1] == '飞书'
      "
    >
    <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>输入卡片ID
        </span>
        <el-input
          v-model="channel.feishu_template_id"
          placeholder="请输入"
          clearable
          style="width: 200px"
        />
      </div>
    </template>
    <template
      v-if="
        (choosedChannel.length &&
          choosedChannel[choosedChannel.length - 1] != '飞书') ||
        (channel.message_type == 'post' &&
          choosedChannel[choosedChannel.length - 1] == '飞书')
      "
    >
     <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>消息模板选择
        </span>
        <el-select-v2
          v-model="channel.template_id"
          :options="options.templateList"
          placeholder="请选择"
          clearable
          filterable
          :disabled="isNewTemplate"
          style="width: 250px"
        />
        <div style="padding: 0 20px"></div>
        <el-button
          type="primary"
          style="width: 140px"
          @click="isNewTemplate = !isNewTemplate"
          >{{ !isNewTemplate ? '快速创建' : '取消' }}</el-button
        >
      </div>
    </template>
    <!--  -->
    <template
      v-if="
        (isNewTemplate &&
          choosedChannel.length &&
          choosedChannel[choosedChannel.length - 1] != '飞书') ||
        (isNewTemplate &&
        channel.message_type == 'post' &&
          choosedChannel[choosedChannel.length - 1] == '飞书')
      "
    >
   <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>模板名称
        </span>
        <el-input v-model="newTemplate.name" class="input" clearable />
      </div>
      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>模板简介
        </span>
        <el-input
          v-model="newTemplate.description"
          type="textarea"
          resize="none"
          rows="2"
          style="width: calc(100% - 120px)"
        />
      </div>
      <div class="input-unit flex">
        <span class="input-title require"> 正文</span>
        <el-input
          v-model="newTemplate.content"
          type="textarea"
          resize="none"
          rows="5"
          style="width: calc(100% - 120px)"
          placeholder="占位符请使用:
          邮箱，飞书：    { 关键字 }
          短信：             ${ 关键字 }"
          clearable
        />
      </div>
    </template>
    <template
      v-if="
        choosedChannel.length &&
        choosedChannel[choosedChannel.length - 1] == '飞书'
      "
    >
    </template>
  </template>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { GetRobotList } from '@/apis/robot/robot'
import { GetMessageTemplateList } from '@/apis/template/template'
import { GetClusterList } from '@/apis/user/cluster'
import { GetFeishuAttrs } from '@/apis/feishuAttrs/feishuAttrs'
const props = defineProps(['ruleInfo'])
const emit = defineEmits(['channelChange'])

// 渠道选择
type Channel = {
  rule_id: number | null
  message_type: 'card' | 'post' | null
  feishu_app_id: number | null
  chat_id: number | null
  template_id: number | null
  feishu_template_id: string | null
}
const channel: Channel = reactive({
  rule_id: null,
  message_type: null,
  feishu_app_id: null,
  chat_id: null,
  template_id: null,
  feishu_template_id: null
})

let choosedChannel = ref<string[]>([])
watch(choosedChannel, (val) => {
  channel.template_id = null
  newTemplate.sms_status = val.indexOf('短信') != -1
  newTemplate.email_status = val.indexOf('邮箱') != -1
  newTemplate.feishu_status = val.indexOf('飞书') != -1
  getMessageTemplate()
})

// edit - channel
const getFeishuAttrs = async () => {
  const data = await GetFeishuAttrs(props.ruleInfo.id)
  if (!data) return
  const { rule_id, chat_id, feishu_app_id, message_type,template_id } = data as any
  channel.message_type = message_type
  channel.feishu_app_id = feishu_app_id
  channel.chat_id = Number(chat_id)
  channel.rule_id = rule_id
  channel.feishu_template_id = template_id
}
onMounted(() => {
  if (props?.ruleInfo && props?.ruleInfo.feishu_status) getFeishuAttrs()
  if (props?.ruleInfo && props?.ruleInfo.template_id) {
    channel.message_type = 'post'
  }
  if (props.ruleInfo?.sms_status) {
    choosedChannel.value.push('短信')
    newTemplate.sms_status = true
  }
  if (props.ruleInfo?.email_status) {
    choosedChannel.value.push('邮箱')
    newTemplate.email_status = true
  }
  if (props.ruleInfo?.feishu_status) {
    choosedChannel.value.push('飞书')
    newTemplate.feishu_status = true
  }
})

// 新增模板
let isNewTemplate = ref(false)
watch(isNewTemplate, (newVal) => {
  if (newVal) channel.template_id = null
})
const newTemplate = reactive({
  name: '',
  description: '',
  content: '',
  feishu_status: false,
  email_status: false,
  sms_status: false
})
watch([channel, newTemplate], () => {
  emit('channelChange', {
    ...channel,
    ...newTemplate,
    message_type:channel.message_type,
    isNewTemplate: isNewTemplate.value,
    channelRadio: channel.message_type
  })
})

// 选项卡获取数据
const options:any = reactive({
  robotList: [],
  templateList: [],
  clusterList: []
})
// 获取机器人
const getRobotList = async () => {
  const data = await GetRobotList({ page_no: 1, page_size: 1000 }) as any
  if(!data) return
  options.robotList = data.result_list.map((item:any)=>({ value: item.feishu_app_id, label: item.name }))
}
// 获取群组
const getClusterList = async () => {
  const data = await GetClusterList({ page_no: 1, page_size: 1000 })
  if(!data) return
  options.clusterList = data.result_list.map((item)=>({ value: parseInt(item.id), label: item.name }))
}
const getMessageTemplate = async () => {
  const data = await GetMessageTemplateList({
    page_no: 1,
    page_size: 1000,
  },{
    feishu_status: newTemplate.feishu_status,
    email_status: newTemplate.email_status,
    sms_status: newTemplate.sms_status
  })
  if(!data) return
  options.templateList = data.result_list.map((item)=>({ value: parseInt(item.id), label: item.name }))

  nextTick(() => {
  channel.template_id = props?.ruleInfo?.template_id
  })

}

onMounted(() => {
  getRobotList()
  getClusterList()
  getMessageTemplate()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-offside-config-styles.scss';
</style>
