import axiosInstance from '@/utils/request/axios'
import type {
  AddAppModel,
  GetAppListModel,
  UpdateAppModel
} from './models/applicationModels'
import {
  handleResponse,
  handleResponseWithoutData
} from '@/utils/request/baseRes'

enum Api {
  APP_LIST = '/saber/app/list',
  ADD_APP = '/saber/app/add',
  UPDATE_APP = '/saber/app/update',
  DEL_APP = '/saber/app/delete'
}

// 业务列表
export async function GetAppList( params: GetAppListModel ): Promise<object | null> {
  return handleResponse(
    axiosInstance({
      url: Api.APP_LIST,
      method: 'GET',
      params
    })
  )
}

// 添加应用
export async function AddApp(data: AddAppModel): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.ADD_APP,
      method: 'POST',
      data
    })
  )
}

// 更新应用
export async function UpdateApp(data: UpdateAppModel): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.UPDATE_APP,
      method: 'POST',
      data
    })
  )
}

// 删除应用
export async function DelApp(app_id: number): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.DEL_APP,
      method: 'POST',
      params: { app_id }
    })
  )
}
