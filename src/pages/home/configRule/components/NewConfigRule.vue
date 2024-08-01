<template>
  <div class="offside-config color flex">
    <article class="center flex">
      <div class="form-title">{{ props.id ? '编辑' : '新增' }}规则配置</div>
      <div class="form-title">基本配置</div>

      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>规则代号
        </span>
        <el-input v-model="configRuleData.code" class="input" clearable />
      </div>

      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>规则描述
        </span>
        <el-input
          v-model="configRuleData.description"
          class="input"
          clearable
        />
      </div>

      <div class="input-unit flex">
        <span class="input-title require">
          设置定时发送
        </span>
        <el-checkbox @change="handleRuleType($event)">定时发送</el-checkbox>
      </div>

      <div class="form-title">用户组配置</div>

      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>用户组选择
        </span>
        <el-select-v2
          v-model.trim="configRuleData.groupId"
          :options="choose.userGroupList"
          filterable
          clearable
          :disabled="choosed.isNewUserGroup"
          placeholder="请选择"
          style="width: 250px"
        />
        <div style="padding: 0 20px"></div>
        <el-button
          type="primary"
          style="width: 140px"
          @click="handleNewUserGroup"
          >{{ !choosed.isNewUserGroup ? '快速创建' : '取消' }}</el-button
        >
      </div>
      <!-- new user group -->
      <template v-if="choosed.isNewUserGroup">
        <div class="input-unit flex">
          <span class="input-title require">
            <span class="require">* </span>用户组名称
          </span>
          <el-input v-model="newUserGroup.name" class="input" clearable />
        </div>

        <div class="input-unit flex">
          <span class="input-title require">
            <span class="require">* </span>用户组描述
          </span>
          <el-input
            v-model="newUserGroup.description"
            class="input"
            clearable
          />
        </div>
        <div class="input-unit flex">
          <span class="input-title require">
            <span class="require">* </span>用户选择
          </span>
          <UserChooseBox @userGroupChange="handelUserGroup"></UserChooseBox>
        </div>
        <div class="line"></div>
      </template>
      <!--  -->
      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>用户选择
        </span>
        <el-select-v2
          v-model.trim="configRuleData.uid"
          :options="choose.userList"
          placeholder="请选择"
          filterable
          clearable
          style="width: 100%"
        />
      </div>
      <ConfigRuleChannelInfo
        :ruleInfo="$props.configRuleInfo"
        @channelChange="handelChannel"
      ></ConfigRuleChannelInfo>
    </article>
    <footer class="footer flex">
      <el-button
        type="primary"
        :disabled="!disabled"
        @click="handleSubmit"
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
  unref,
  watchEffect
} from 'vue'
import { AddConfigRule, UpdateConfigRule } from '@/apis/rule/rule'
import { GetUserList } from '@/apis/user/user'
import { GetUserGroupList, AddUserGroup } from '@/apis/user/userGroup'
import { AddMessageTemplate } from '@/apis/template/template'
import { UpdateFeishuAttrs } from '@/apis/feishuAttrs/feishuAttrs'
import { useUserWeightRemoval } from '@/hooks/useUserWeightRemoval'
import deepEqual from '@/utils/base/isEqual'
import ConfigRuleChannelInfo from './ConfigRuleChannelInfo.vue'
import UserChooseBox from './UserChooseBox.vue'
import type { Channel, ConfigRule, FeishuAttrs, NewUserGroup } from './types'
const props = defineProps(['configRuleInfo', 'id'])
const emits = defineEmits(['success', 'handleClose'])
const changeUnsaved = inject<(val: boolean) => void>('changeUnsaved')


const configRuleDataInit = {
  code: undefined,
  description: '',
  type: 0,
  groupId: undefined,
  uid: undefined,
  templateId: undefined,
  feishu_status: false,
  sms_status: false,
  email_status: false
}



/**
 *    直接规则 - configRuleDataInit
 *
 *    新增用户组 - newUserGroup
 *
 *    新增模板 - newTemplate
 *
 *    飞书升级 - feishuAtt
 */
// configRuleData
const configRuleData = reactive<ConfigRule>({ ...configRuleDataInit })
  const disabled = computed(()=>{
  const {code, description, feishu_status,sms_status,email_status, groupId,templateId} = unref(configRuleData)
  const res = (code && description && (feishu_status || sms_status || email_status))
   && (groupId || (newUserGroup.name && newUserGroup.description && newUserGroup.uid_list))
   && (templateId || (newTemplate.name && newTemplate.description) || (feishuAttrs.templateId))
   return res
})

// 新用户组
const newUserGroup:NewUserGroup = reactive({
  name: '',
  description: '',
  uid_list: []
})
// 新增模板
const newTemplate = reactive({
  name: '',
  description: '',
  content: '',
  feishu_status: false,
  email_status: false,
  sms_status: false
})

const choosed = reactive({
  choosedUsers: {
    checkedDepartment: [],
    checkedUser: []
  },
  isNewUserGroup: false,
  isNewTemplate: false
})
// 新建用户组回传
const handelUserGroup = (val: any) => {
  choosed.choosedUsers = val
}
const handleNewUserGroup = () => {
  choosed.isNewUserGroup = !choosed.isNewUserGroup
  if (choosed.isNewUserGroup) configRuleData.groupId = undefined
}

// 定时任务切换
const handleRuleType = (val: boolean) => {
  if (val) {
    configRuleData.type = 1
  } else {
    configRuleData.type = 0
  }
}

// 选项卡数据
const choose = reactive<Record<string, any>>({
  userGroupList: [],
  userList: []
  // isCreateUserGroup: false
})

// 获取用户列表
const getUserList = async () => {
  const res = await GetUserList({ d: '', k: '', page_no: 0, page_size: 10000 })
  if (!res) return
  choose.userList = res.result_list.map((item) => ({
    value: item.id,
    label: item.name
  }))
}
// 获取用户组列表
const getUserGroupList = async () => {
  const res = await GetUserGroupList({ page_no: 1, page_size: 1000 })
  if (!res) return
  choose.userGroupList = res.result_list.map((item) => ({
    value: item.id,
    label: item.name
  }))
}
onMounted(() => {
  getUserList()
  getUserGroupList()
})
// 渠道信息
// 飞书升级参数
const feishuAttrs = reactive<FeishuAttrs>({
  ruleId: null,
  chatId: null,
  templateId: null,
  feishuAppId: null,
  messageType: null
})
// 渠道回传
const channel = ref<Channel>()
const handelChannel = (val: any) => {
  channel.value = val
  // new - Tempalte
  newTemplate.name = val.name
  newTemplate.description = val.description
  newTemplate.content = val.content
  newTemplate.feishu_status = val.feishu_status
  newTemplate.email_status = val.email_status
  newTemplate.sms_status = val.sms_status
  //
  choosed.isNewTemplate = val.isNewTemplate
  // 规则
  configRuleData.templateId = val.template_id
  configRuleData.feishu_status = val.feishu_status
  configRuleData.sms_status = val.sms_status
  configRuleData.email_status = val.email_status
  // 飞书
  feishuAttrs.ruleId = val.rule_id
  feishuAttrs.chatId = val.chat_id
  feishuAttrs.templateId = val.feishu_template_id
  feishuAttrs.feishuAppId = val.feishu_app_id
  feishuAttrs.messageType = val.message_type
}

onMounted(() => {
  if (props.configRuleInfo) {
    const {
      code,
      description,
      email_status,
      feishu_status,
      group_id,
      sms_status,
      template_id,
      type
    } = props.configRuleInfo
    Object.assign(configRuleData, {
      ...configRuleDataInit,
      code,
      description,
      email_status,
      feishu_status,
      groupId: group_id,
      sms_status,
      templateId: template_id,
      type
    })
  } else {
    Object.assign(configRuleData, configRuleDataInit)
  }
  tmp.value = Object.freeze({...configRuleData});
})
const tmp = ref()
watchEffect(() => {
  if (
    deepEqual(
      configRuleData,
      unref(tmp)
    )
  ) {
    changeUnsaved?.(false)
  } else {
    changeUnsaved?.(true)
  }
})
// -------
// 请求函数
// -------

// 新增用户组
const requestNewUserGroup = async (): Promise<any> => {
  const { array }: any = await useUserWeightRemoval(choosed.choosedUsers)
  newUserGroup.uid_list = array
  const res = await AddUserGroup(newUserGroup)
  if (res) {
    configRuleData.groupId = Number(res.id)
    choosed.isNewUserGroup = false
    return true
  }
  return false
}

// 新增模板
const requestNewTemplate = async (): Promise<any> => {
  const res = await AddMessageTemplate(newTemplate)
  if (res) {
    configRuleData.templateId = Number(res.id)
    choosed.isNewTemplate = false
    return true
  }
  return false
}

// 新增规则
const requestConfigRule = async (): Promise<any> => {
  const data = {
    code: configRuleData.code,
    description: configRuleData.description,
    email_status: configRuleData.email_status,
    feishu_status: configRuleData.feishu_status,
    group_id: configRuleData.groupId,
    sms_status: configRuleData.sms_status,
    template_id: configRuleData.templateId,
    type: configRuleData.type
  }
  const res = props.id
    ? await UpdateConfigRule(props.id, data)
    : await AddConfigRule(data)
 
  if (res && configRuleData.feishu_status) {
    feishuAttrs.ruleId = typeof res === 'boolean' ? props.id : res?.id
    return true
  }
  else if (res) {
    emits('handleClose')
    emits('success')
  }
  return false
}
// 飞书升级参数
const requestFeishuAttrs = async (): Promise<any> => {
  const data = {
    chat_id: feishuAttrs.chatId,
    feishu_app_id: feishuAttrs.feishuAppId,
    message_type: feishuAttrs.messageType,
    rule_id: feishuAttrs.ruleId,
    template_id: feishuAttrs.templateId
  }
  const res = await UpdateFeishuAttrs(data)
  if (res) {
    emits('handleClose')
    emits('success')
    return true
  }
}

// -------
// 状态列表
// -------

// 新用户组 - status
class NewUserGroupStatus implements SubmitState {
  async execute() {
    const userGroupResult = await requestNewUserGroup()
    if (userGroupResult) {
      // 切换到下一个状态
      setState(new ConfigRuleState())
      currentState.execute()
    }
  }
}
// 新建模板 - status
class NewTemplateStatus implements SubmitState {
  async execute() {
    const templateResult = await requestNewTemplate()
    if (templateResult) {
      // 切换到下一个状态
      setState(new ConfigRuleState())
      currentState.execute()
    }
  }
}
// 并发请求 - status
class ConcurrentRequestStatus implements SubmitState {
  async execute() {
    try {
      // 并发执行用户组和模板的请求
      const [userGroupResult, templateResult] = await Promise.all([
        choosed.isNewUserGroup ? requestNewUserGroup() : Promise.resolve(null),
        choosed.isNewTemplate ? requestNewTemplate() : Promise.resolve(null)
      ])

      if (userGroupResult && templateResult) {
        // 切换到下一个状态
        setState(new ConfigRuleState())
        currentState.execute()
      }
    } catch (error) {
      console.error('处理并发请求时出错：', error)
    }
  }
}
// 规则 - status
class ConfigRuleState implements SubmitState {
  async execute() {

    if (await requestConfigRule()) {
      setState(new FeishuAttrsState())
      currentState.execute()
    }
  }
}
// 升级参数 - status
class FeishuAttrsState implements SubmitState {
  async execute() {
    await requestFeishuAttrs()
  }
}
// -------
// 状态管理
// -------
interface SubmitState {
  execute: () => Promise<void>
}

let currentState: SubmitState
const setState = (state: SubmitState) => {
  currentState = state
}

const handleSubmit = async () => {
  // tattus
  if (choosed.isNewUserGroup || choose.isNewTemplate) {
    setState(new ConcurrentRequestStatus())
  } else if (choosed.isNewUserGroup) {
    setState(new NewUserGroupStatus())
  } else if (choose.isNewTemplate) {
    setState(new NewTemplateStatus())
  } else {
    setState(new ConfigRuleState())
  }
  // 运行当前状态
  await currentState.execute()
}
// ----------------------
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-offside-config-styles.scss';
</style>