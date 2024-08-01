import axiosInstance from '@/utils/request/axios.ts'
import type { AddUserModel, GetUserListModel, UpdateUserModel } from './models/userModel'
import { handleResponse, handleResponseWithoutData } from '@/utils/request/baseRes'
import type { GetBaseListResponse } from '../models/BaseResponse'

enum Api {
  USER_LIST = '/saber/user/list',
  ADD_USER = '/saber/user/add/single',
  UPDATE_USER = '/saber/user/update',
  DEPARTMENT_LIST= '/saber/user/department'
}
// 用户列表 - 获取
export async function GetUserList(
  params: GetUserListModel
): Promise<GetBaseListResponse | null> {
  return handleResponse<GetBaseListResponse>(
    axiosInstance({
      url: Api.USER_LIST,
      method: 'GET',
      params
    })
  )
}

// 新增单个用户
export async function AddUser(data: AddUserModel): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.ADD_USER,
      method: 'POST',
      data
    }),{
     success:'用户新增成功'
    }
  )
}

// 更新用户信息
export async function UpdateUser(
  uid: number, 
  data: UpdateUserModel
): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.UPDATE_USER,
      method: 'POST',
      params: {
        uid
      },
      data
    }),{
      success:'信息更新成功'
    }
  )
}
