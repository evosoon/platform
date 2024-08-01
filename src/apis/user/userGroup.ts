import axiosInstance from '@/utils/request/axios'
import type {
  AddUserGroupModel,
  AddUserGroupResponse,
  GetUserGroupListModel
} from './models/userGroupModel'
import { handleResponse, handleResponseWithoutData } from '@/utils/request/baseRes'
import type { GetBaseListResponse, QueryUserGroupResopnse } from '../models/BaseResponse'

enum Api {
  QUERY_USER_GROUP = '/saber/group',
  USER_GROUP_LIST = '/saber/group/list',
  ADD_USER_GOUP = '/saber/group/add',
  UPDATE_USER_GROUP = '/saber/group/update',
  DEL_USER_GROUP = '/saber/group/delete'

}

// 查询用户组
export async function QueryUserGroup(
  id: number
): Promise<QueryUserGroupResopnse | null> {
  return handleResponse(
    axiosInstance({
      url: Api.QUERY_USER_GROUP,
      method: 'GET',
      params: { id }
    })
  )
}

// 获取用户组
export async function GetUserGroupList(
  params?: GetUserGroupListModel
): Promise<GetBaseListResponse | null> {
  return handleResponse<GetBaseListResponse>(
    axiosInstance({
      url: Api.USER_GROUP_LIST,
      method: 'GET',
      params
    })
  )
}

// 新增用户组
export async function AddUserGroup(data: AddUserGroupModel): Promise<AddUserGroupResponse | null> {
  return handleResponse(
    axiosInstance({
      url: Api.ADD_USER_GOUP,
      method: 'POST',
      data
    }),
    { success: '新增用户组成功' }
  )
}
export async function UpdateUserGroup(id:number,data: AddUserGroupModel): Promise<boolean | null> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.UPDATE_USER_GROUP,
      method: 'POST',
      params: {
        id
      },
      data
    }),
    { success: '更新用户组成功' }
  )
}
// 删除用户信息
export async function DelUserGroup(
  id: number, 

): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.DEL_USER_GROUP,
      method: 'POST',
      params: {
        id
      },
    })
  )
}

