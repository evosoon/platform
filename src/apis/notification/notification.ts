import axiosInstance from '@/utils/request/axios'
import {
  handleResponse,
  handleResponseWithoutData
} from '@/utils/request/baseRes'
import type {
  GetNotificationListModel,
  SendNotificationModel
} from './Models/notificationModel'
import type { GetBaseListResponse } from '../models/BaseResponse'

enum Api {
  SEND_NOTIFICATION = '/saber/notification',
  NOTIFICATION_LIST = '/saber/notification/list'
}
// 获取通知记录
export async function GetNotificationList(
  params: GetNotificationListModel
): Promise<GetBaseListResponse | null> {
  return handleResponse(
    axiosInstance({
      url: Api.NOTIFICATION_LIST,
      method: 'GET',
      params
    })
  )
}

// 发送通知
export async function SendNotification(
  data: SendNotificationModel
): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.SEND_NOTIFICATION,
      method: 'POST',
      data
    }),
    { success: '发送成功' }
  )
}
