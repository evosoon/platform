import axiosInstance from "@/utils/request/axios";
import { handleResponse, handleResponseWithoutData } from "@/utils/request/baseRes";
import type { UpdateFeishuAttrsModel } from "./models/feishuAttrsModel";

enum Api {
    GET_ATTRS = '/saber/feishu/attrs',
    UPDATE_ATTRS = '/saber/feishu/attrs'
}
// 获取飞书升级参数
export async function GetFeishuAttrs( id: number): Promise<object | null> {
    return handleResponse(
      axiosInstance({
        url: Api.GET_ATTRS,
        method: 'GET',
        params:{ id }
      })
    );
  }
  
// 更新飞书升级参数
  export async function UpdateFeishuAttrs(data: UpdateFeishuAttrsModel): Promise<boolean> {
    return handleResponseWithoutData(
      axiosInstance({
        url: Api.UPDATE_ATTRS,
        method: 'POST',
        data
      }),
      { success: '更新飞书升级参数成功'}
    );
  }
  