export interface ListAbout {
    pageNo: number
    pageSize: number
    pages: number
    total: number
    keyword: string
    createBy: string
    email_status: boolean
    sms_status: boolean
    feishu_status: boolean
  }

  export interface TemplateData {
    name: string
    description: string
    content: string
    feishu_status: boolean
    email_status: boolean
    sms_status: boolean
  }