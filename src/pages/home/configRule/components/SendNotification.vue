<!--  -->
<template>
  <div class="offside-config color flex">
    <article class="center flex">
      <div class="form-title">发送消息</div>
      <div class="form-title">基本配置</div>

      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>规则代号
        </span>
        <el-input v-model="roleConfig.code" style="width: 260px" clearable />
      </div>
      <!--  -->
      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>设置定时发送
        </span>
        <el-checkbox v-model="roleConfig.timmer" disabled>定时发送</el-checkbox>
      </div>
      <!--  -->
      <div class="center-title flex">用户配置</div>
      <div class="user-box flex">
        <div class="box-left">
          <!--  -->
          <div class="input-unit flex">
            <span class="input-title require"> 用户组选择 </span>
            <el-select-v2
              v-model="roleConfig.group_id"
              :options="options.userGroup"
              filterable
              placeholder="请选择"
              style="width: 200px"
              disabled
            />
          </div>
          <!--  -->
          <div class="input-unit flex">
            <span class="input-title require"> 用户选择 </span>
            <el-select-v2
              v-model="roleConfig.uid"
              :options="options.userList"
              placeholder="无"
              filterable
              disabled
              style="width: 200px"
            />
          </div>
          <!--  -->
          <div class="input-unit flex">
            <span class="input-title require"> 群组选择 </span>
            <el-select-v2
              v-model="roleConfig.uid"
              :options="options.userList"
              placeholder="无"
              filterable
              style="width: 200px"
              disabled
            />
          </div>
          <!--  -->
          <div class="input-unit flex">
            <span class="input-title require"> 抄送用户 </span>
            <el-select-v2
              v-model="copyUser"
              :options="options.userList"
              placeholder="请选择"
              filterable
              style="width: 200px"
            />
          </div>
        </div>
        <div class="box-right">
          <template v-if="userList.carbonCopy.length">
            <div class="title flex">
              <span>抄送人</span
              ><span v-text="userList.carbonCopy.length"></span>
            </div>
            <template v-for="item in userList.carbonCopy" :key="item.value">
              <div class="item color flex">
                <span>{{ item.label }}</span>
                <span class="pointer" @click="deselect(item)">
                    <el-icon class="icon"
                  ><Close
                /></el-icon>
                </span>
              </div>
            </template>
          </template>
          <template v-if="userList.users.length">
            <div class="title flex">
              <span>发送用户</span><span v-text="userList.users.length"></span>
            </div>
            <template v-for="item in userList.users" :key="item.value">
              <div class="item color flex">
                <span>{{ item.name }}</span
                ><span>{{ item.department }}</span>
              </div>
            </template>
          </template>
        </div>
      </div>
      <div class="center-title">渠道消息</div>

      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>渠道选择
        </span>
        <el-checkbox-group v-model="channelAbout.choosedChannel">
          <el-checkbox disabled label="短信" value="短信" />
          <el-checkbox disabled label="邮箱" value="邮箱" />
          <el-checkbox disabled label="飞书" value="飞书" />
        </el-checkbox-group>
      </div>
      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>消息模板选择
        </span>
        <el-select-v2
          v-model="$props.info.template_id"
          :options="options.templateList"
          style="width: 200px"
          disabled
        />
      </div>
      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>消息模板选择
        </span>
        <el-input
          v-model="channelAbout.choosedTemplate"
          style="width: 100%"
          type="textarea"
          resize="none"
          rows="5"
          readonly
        />
      </div>
      <div
        class="input-unit flex"
        v-if="Object.entries(channelAbout.params).length"
      >
        <span class="input-title require"> </span>
        参数配置
      </div>
      <div class="value-box flex">
        <span class="box-zero"></span>
        <div class="flex box-input">
          <span>标题</span>
          <el-input
            class="input"
            v-model="title"
            placeholder="标题"
            clearable
          />
        </div>
      </div>
      <template v-if="Object.entries(channelAbout.params).length">
        <template
          v-for="[key] in Object.entries(channelAbout.params)"
          :key="key"
        >
          <div class="value-box flex">
            <span class="box-zero"></span>
            <div class="flex box-input">
              <span v-text="key"></span>
              <el-input
                class="input"
                v-model="channelAbout.params[key]"
                :autosize="{ minRows: 2, maxRows: 6 }"
                resize="none"
                type="textarea"
                placeholder="请填写"
                clearable
              />
            </div>
          </div>
        </template>
      </template>
      <!-- 底部 -->
    </article>
    <footer class="footer flex">
    <el-button
      type="primary"
      @click="sendNotification"
      :disabled="disabledSend && !loading"
              class="submit"
      >发送</el-button
    >
  </footer>
  </div>
 
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { GetUserGroupList, QueryUserGroup } from '@/apis/user/userGroup'
import {GetUserList} from '@/apis/user/user';

import { GetMessageTemplate } from '@/apis/template/template'
import { SendNotification } from '@/apis/notification/notification'
import type { ChannelAbout, RoleConfig, Option } from './types';
import useMessageBox from '@/hooks/useMessageBox';
const props = defineProps(['info'])
const emit = defineEmits(['onlySaveSuccess'])

const disabledSend = computed(() =>
  Object.entries(channelAbout.params).length
    ? Object.entries(channelAbout.params)
        .reduce((pre: any, item: any) => [...pre, item[1]], [])
        .includes('')
    : false
)

// 规则相关
// 规则新建

const roleConfig = reactive<RoleConfig>({
  code: props.info?.code,
  description: props.info?.description,
  timmer: false,
  group_id: props.info?.group_id,
  uid: props.info?.uid,
  template_id: props.info?.template_id,
  feishu_status: props.info?.feishu_status,
  sms_status: props.info?.sms_status,
  email_status: props.info?.email_status
})

// 选项

let options: Option = reactive({
  userGroup: [],
  userList: [],
  templateList: []
})

// ------------
// 用户 - 用户组
const userList: any = reactive({
  carbonCopy: [],
  users: []
})

let copyUser = ref({})
watch(copyUser, (newVal) => {
  if (newVal) {
    let target = options.userList.filter((item:any) => {
      return item?.value === newVal
    })
    userList.carbonCopy.push(...target)
  }
})
// 获取用户组列表
const getUserGroupList = async () => {
  const data = await GetUserGroupList({ page_no: 1, page_size: 1000 })
  if(!data)return
  options.userGroup = data.result_list.reduce(
    (pre: RoleConfig[] | [], item: any) => {
      return [...pre, { value: item.id, label: item.name }]
    },
    []
  )
}

// 获取用户列表
const getUserList = async () => {
  const data = await GetUserList({
    d: '',
    k: '',
    page_no: 0,
    page_size: 10000
  })
  if(!data)return
  options.userList = data.result_list.map(item => ({ value: item.id, label: item.name}))
}
const queryUserGroup = async () => {
  if (!props.info.group_id) return
  const res = await QueryUserGroup(Number(props.info.group_id)) as any
  if(!res)return
  userList.users = res.user_info_list
}

const deselect = (item: any) => {
  userList.carbonCopy = userList.carbonCopy.filter((i: any) => {
    if (i != item) return i
  })
}

onMounted(() => {
  getUserGroupList()
  getMessageTemplate()
  getUserList()
  queryUserGroup()
})

// ------------
// 渠道信息

const channelAbout: ChannelAbout = reactive({
  choosedChannel: [],
  choosedTemplate: '',
  params: {}
})

// 渠道选择
onMounted(() => {
  if (props.info?.sms_status) channelAbout.choosedChannel.push('短信')
  if (props.info?.email_status) channelAbout.choosedChannel.push('邮箱')
  if (props.info?.feishu_status) channelAbout.choosedChannel.push('飞书')
})

// 获取模板内容
const getMessageTemplate = async () => {
  if (!props.info.template_id) return
  const res = await GetMessageTemplate(Number(props.info?.template_id))
  if (!res) return
  options.templateList = [{ value: res.id, label: res.name }]

  channelAbout.choosedTemplate = res.content
  let htmlTemp = htmlTemplate(res.content)
  let regList = regTemplate(htmlTemp)

  regList.forEach((item) => {
    channelAbout.params[item] = ''
  })
}
//
const htmlTemplate = (template: string) => {
  let res = template.match(/<body(.*?)<\/body>/s)
  return res ? res[0] : template
}
// 匹配
const regTemplate = (template: string) => {
  const regex = /\${([^{}]*)}|(?<!#)\{([^{}]*)\}(?!})/g
  let match: RegExpExecArray | null
  const results = []
  while ((match = regex.exec(template)) !== null) {
    results.push(match[1] || match[2])
  }
  return new Set(results)
}

let title = ref('')
// 发送
const loading = ref(false)

const sendNotification = async () => {
    const {type} = await useMessageBox({
        message: '确定执行发送操作？',
        confrim: '发送',
    })
    if (type == 'success') send()
}
const send = async () => {
    loading.value = true
  let carbonCopy = userList.carbonCopy.reduce(
    (pre: number[], item: any) => [...pre, item.value],
    []
  )
  let users = userList.users.reduce(
    (pre: number[], item: any) => [...pre, item.id],
    []
  )
  let uid_list = [...carbonCopy, ...users]
  let data = {
    code: props.info.code,
    uid_list,
    extra_data: {
      title: title.value || '标题'
    },
    params: channelAbout.params
  }
  await SendNotification(data)
  loading.value = true

}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-offside-config-styles.scss';
.user-box {
  height: 220px;
  width: calc(100% - 10px);
  .box-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .box-right {
    flex: 1;
    margin: 9px 0;
    padding: 5px;
    font-size: 14px;
    border-radius: 3px;
    overflow: auto;
    border: 1px solid var(--color-border);
    .title {
      opacity: 0.6;
      justify-content: space-between;
      border-bottom: 1px solid var(--color-border-primary);
    }
    .item {
      justify-content: space-between;
      padding: 4px;
    }
    .item:hover {
      background-color: #f7f7f7;
      border-radius: 6px;
    }
  }
}
.value-box {
    width: calc(100% - 10px);
  .box-zero {
    width: 135px;

  }
  .box-input {
    flex: 1;
    align-items: top;
    margin: 10px 0;
    span {
      width: 150px;
      padding-left: 5px;

    }
    span:first-child {
      border-left: 2px solid var(--color-border-primary);
      color: var(--color-border-primary);
    }
    span:last-child {
      border-left: 2px solid var(--color-border-primary);
      color: var(--color-border-primary);
    }
    .input {
      width: 100%;
    }
  }
}
</style>
