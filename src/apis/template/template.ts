import axiosInstance from '@/utils/request/axios'
import {
  handleResponse,
  handleResponseWithoutData
} from '@/utils/request/baseRes'
import type { BaseRes, GetBaseListResponse } from '../models/BaseResponse'
import type { AddMessageTemplateModel, AddMessageTemplateResponse, GetMessageTemplateDataModel, GetMessageTemplateParamsModel, GetMessageTemplateResponse, UpdateMessageTemplateModel } from './models/templateModel'

enum Api {
  TEMPLATE_LIST = '/saber/template/list',
  GET_TEMPLATE = '/saber/template',
  ADD_TEMPLATE = '/saber/template/add',
  UPDATE_TEMPLATE = '/saber/template/update',
  DEL_TEMPLATE = '/saber/template/delete'
}

// 消息模板列表
export async function GetMessageTemplateList(
  params: GetMessageTemplateParamsModel,
  data: GetMessageTemplateDataModel
): Promise<GetBaseListResponse | null> {
  return handleResponse(
    axiosInstance({
      url: Api.TEMPLATE_LIST,
      method: 'POST',
      params,
      data
    })
  )
}

// 消息模板获取
export async function GetMessageTemplate(id: number): Promise<GetMessageTemplateResponse | null> {
  return handleResponse(
    axiosInstance({
      url: Api.GET_TEMPLATE,
      method: 'GET',
      params: { id }
    })
  )
}

//  添加消息模板
export async function AddMessageTemplate(
  data: AddMessageTemplateModel
): Promise<AddMessageTemplateResponse | null> {
  return handleResponse(
    axiosInstance({
      url: Api.ADD_TEMPLATE,
      method: 'POST',
      data
    }),
    { success: '添加模板成功' }
  )
}

//  更新消息模板
export async function UpdateMessageTemplate(
  id: number,
  data: UpdateMessageTemplateModel
): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.UPDATE_TEMPLATE,
      method: 'POST',
      params: { id },
      data
    }),
    { success: '修改模板成功' }
  )
}

// 删除消息模板
export async function DelMessageTemplate(id: number): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.DEL_TEMPLATE,
      method: 'POST',
      params: { id }
    }),
    { success: '删除成功'}
  )
}
