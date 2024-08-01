export interface GetConfigRuleListParamsModel {
  page_no: number
  page_size: number
}

export interface GetConfigRuleListDataModel {
  keyword?: string
  type?: number
  channel?: string
  group_id?: number
  create_by?: string
}

export interface AddConfigRuleModel {
  code: string | undefined
  type: number | undefined
  description: string | undefined
  group_id: number | undefined
  template_id: number | undefined
  feishu_status: boolean | undefined
  sms_status: boolean | undefined
  email_status: boolean | undefined
}

export interface AddConfigRuleResponse {
  code: string
  create_by: string
  create_time: string
  description: string
  email_status: boolean
  feishu_status: boolean
  group_id: number
  id: number
  sms_status: boolean
  template_id: number
  type: number
  uid: number
  update_by: string
  update_time: string
}

export interface UpdateConfigRuleModel {
  code: string | undefined
  type: number
  description: string | undefined
  group_id: number | undefined
  template_id: number | undefined
  feishu_status: boolean | undefined
  sms_status: boolean | undefined
  email_status: boolean | undefined
}
