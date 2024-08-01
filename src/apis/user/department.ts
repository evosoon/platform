import axiosInstance from "@/utils/request/axios";
import { handleResponse } from "@/utils/request/baseRes";

enum Api {
    DEPARTMENT_LIST = '/saber/user/department'
}
// 获取部门列表
export async function GetDepartmentList(): Promise<string[] | null> {
    return handleResponse(
      axiosInstance({
        url: Api.DEPARTMENT_LIST,
        method: 'GET',
      })
    )
  }