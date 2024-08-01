import axiosInstance from '@/utils/request/axios.ts'
import type {
  AddConfigRuleModel,
  AddConfigRuleResponse,
  GetConfigRuleListDataModel,
  GetConfigRuleListParamsModel,
  UpdateConfigRuleModel
} from './models/ruleModel'
import {
  handleResponse,
  handleResponseWithoutData
} from '@/utils/request/baseRes'
import type { GetBaseListResponse } from '../models/BaseResponse'

enum Api {
  RULE_LIST = '/saber/notification/rule/list',
  ADD_RULE = '/saber/notification/rule/add',
  UPDATE_RULE = '/saber/notification/rule/update',
  DEL_RULE = '/saber/notification/rule/delete'
}
// 获取规则
export async function GetConfigRule(
  params: GetConfigRuleListParamsModel,
  data?: GetConfigRuleListDataModel
): Promise<GetBaseListResponse | null> {
  return handleResponse<GetBaseListResponse>(
    axiosInstance({
      url: Api.RULE_LIST,
      method: 'POST',
      params,
      data
    })
  )
}

// 新建规则
export async function AddConfigRule(
  data: AddConfigRuleModel
): Promise<AddConfigRuleResponse | null> {
  return handleResponse(
    axiosInstance({
      url: Api.ADD_RULE,
      method: 'POST',
      data
    }),
    { success: '新建规则成功' }
  )
}

// 更新规则
export async function UpdateConfigRule(
  id: number,
  data: UpdateConfigRuleModel
): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.UPDATE_RULE,
      method: 'POST',
      params: { id },
      data
    }),
    { success: '更新规则成功' }
  )
}
// 删除规则
export async function DelConfigRule(id: number): Promise<boolean> {
  return handleResponseWithoutData(
    axiosInstance({
      url: Api.DEL_RULE,
      method: 'POST',
      params: {
        id
      }
    }),
    { success: '删除规则成功' }
  )
}
