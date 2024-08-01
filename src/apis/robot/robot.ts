import axiosInstance from '@/utils/request/axios.ts'
import type { GetRobotListModel, UpdateRobotModel } from './models/robotModel'
import { handleResponse, handleResponseWithoutData } from '@/utils/request/baseRes'
import type { GetBaseListResponse } from '../models/BaseResponse'
// 下游服务

enum Api {
  ROBOT_LIST = '/saber/robot/list',
  ROBOT_UPDATE = '/saber/robot/update',
  ROBOT_DEL = '/saber/robot/delete'
}
export async function GetRobotList(
  params: GetRobotListModel
): Promise<GetBaseListResponse | null> {
  return handleResponse(
    axiosInstance({
      url: Api.ROBOT_LIST,
      method: 'GET',
      params
    })
  )
}
// UpdateRobot
export async function UpdateRobot(
  id: number,
  data: UpdateRobotModel
): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.ROBOT_UPDATE,
      method: 'POST',
      params:{
        id
      },
      data
    }),
    {success:'编辑成功'}
  )
}
export async function DelRobot(id: number): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.ROBOT_DEL,
      method: 'POST',
      params:{
        id
      }
    }),
    {success:'删除成功'}
  )
}
