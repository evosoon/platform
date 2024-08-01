export interface GetMessageTemplateParamsModel {
  page_no?: number
  page_size?: number
}

export interface GetMessageTemplateDataModel {
  keyword?: string
  create_by?: string
  feishu_status?: boolean
  sms_status?: boolean
  email_status?: boolean
}

export interface AddMessageTemplateModel {
  name: string
  description: string
  content: string
  feishu_status: boolean
  email_status: boolean
  sms_status: boolean
}

export interface UpdateMessageTemplateModel {
  name: string
  description: string
  content: string
}

export interface AddMessageTemplateResponse {
  content: string
  create_by: string
  create_time: string
  description: string
  email_status: boolean
  feishu_status: boolean
  id: number
  name: string
  sms_status: boolean
  update_by: string
  update_time: string
}

export interface GetMessageTemplateResponse {
  id: number
  name: string
  content: string
  create_by: string
  create_time: string
  description: string
  email_status: string
  feishu_status: string
  sms_status: string
  update_by: string
  update_time: string
}
