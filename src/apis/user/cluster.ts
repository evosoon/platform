import axiosInstance from '@/utils/request/axios'
import type {
  AddClusterModel,
  GetClusterModel,
  UpdateClusterModel
} from './models/clusterModel'
import {
  handleResponse,
  handleResponseWithoutData
} from '@/utils/request/baseRes'
import type { GetBaseListResponse } from '../models/BaseResponse'

enum Api {
  CLUSTER_LIST = '/saber/chat/list',
  ADD_CLUSTER = '/saber/chat/add',
  UPDATE_CLUSTER = '/saber/chat/update',
  DEL_CLUSTER = '/saber/chat/delete'
}
// 群组列表
export async function GetClusterList(
  params: GetClusterModel
): Promise<GetBaseListResponse | null> {
  return handleResponse(
    axiosInstance({
      url: Api.CLUSTER_LIST,
      method: 'GET',
      params
    })
  )
}

// 新增群组
export async function AddCluster(data: AddClusterModel): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.ADD_CLUSTER,
      method: 'POST',
      data
    }),
    {success:'新建群组成功'}
  )
}
// 更新群组
export async function UpdateCluster(
  data: UpdateClusterModel
): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.UPDATE_CLUSTER,
      method: 'POST',
      data
    }),
    {success:'更新群组成功'}
  )
}
// 删除群组
export async function DelCluster(id: number): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.DEL_CLUSTER,
      method: 'POST',
      params: {
        id
      }
    }),
    {success:'删除群组成功'}
  )
}
