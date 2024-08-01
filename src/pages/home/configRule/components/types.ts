export interface FeishuAttrs {
  ruleId: number | null
  chatId: string | null
  templateId: string | null
  feishuAppId: number | null
  messageType: number | null
}
export interface NewUserGroup {
  name: string
  description?: string
  uid_list: number[] | []
}

export interface Channel {
  template_id: number | null
  name: string
  description: string
  content: string
  feishu_status: boolean
  email_status: boolean
  sms_status: boolean
  isNewTemplate: boolean
  channelRadio: string
  feishuAppId: number
  chatId: number
  messageType: 'post' | 'card' | null
}

// 配置规则
export interface ConfigRule {
  code: string | undefined
  description: string | undefined
  type: number
  groupId: number | undefined
  uid: number | undefined
  templateId: number | undefined
  feishu_status: boolean
  sms_status: boolean
  email_status: boolean
}

export interface GroupList {
    type: 'department' | 'personage'
    parent?: string
    value: any
  }

export type CheckedList = Record< 'checkedDepartment' | 'checkedUser' , GroupList[]>

export interface RoleConfig  {
  code: string
  description: string | null
  timmer: boolean
  group_id: number | null
  uid: number | null
  template_id: number | null
  feishu_status: boolean
  sms_status: boolean
  email_status: boolean
}

export interface Option {
  userGroup: any[]
  userList: any[]
  templateList: any[]
}

export interface ChannelAbout {
  choosedChannel: string[]
  choosedTemplate: string
  params: any
}