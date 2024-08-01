import type { BaseRes } from '@/apis/models/BaseResponse'
import { ResultCode } from '@/apis/models/ResultCode'
import { MessageType, useElMessage } from '@/hooks/useMessage'

// 入参 ： axiosInstance ，成功失败指定消息 ，重试次数默认 2 次
export async function handleResponse<T>(
  promise: Promise<BaseRes>,
  message?: { success?: string; fail?: string },
  retries: number = 2,
  time: number = 1000
): Promise<T | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await promise
      if (res?.result_code === ResultCode.SUCCESS) {
        useElMessage(message?.success ?? res?.message, MessageType.SUCCESS)
        return res.data as T
      } else {
        useElMessage(message?.fail ?? res?.message, MessageType.ERROR)
        return null
      }
    } catch (err) {
      if (attempt < retries) {
        console.log(`Retrying... Attempt ${attempt + 1}`)
        await new Promise(resolve => setTimeout(resolve, time));
      } else {
        useElMessage(message?.fail ?? (err as string), MessageType.ERROR)
        return null
      }
    }
  }
  return null
}

// axiosInstance ，成功失败指定消息 ，重试次数默认 0 次
export async function handleResponseWithoutData(
  promise: Promise<BaseRes>,
  message?: { success?: string; fail?: string },
  retries: number = 2,
  time: number = 1000
): Promise<boolean> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await promise
      if (res?.result_code === ResultCode.SUCCESS) {
        useElMessage(message?.success ?? res?.message, MessageType.SUCCESS)
        return true
      } else {
        useElMessage(message?.fail ?? res?.message, MessageType.ERROR)
        return false
      }
    } catch (err) {
      if (attempt < retries) {
        console.log(`Retrying... Attempt ${attempt + 1}`)
        await new Promise(resolve => setTimeout(resolve, time));
      } else {
        useElMessage(message?.fail ?? (err as string), MessageType.ERROR)
        return false
      }
    }
  }
  return false
}
