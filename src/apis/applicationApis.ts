import axiosInstance from '@/utils/request/axios.ts'
// success 1
// 业务列表 - 获取
export async function GetAppList(params: {
  page_no?:number
  page_size?:number
}) {
  const {
    result_code,
    data
  } = await axiosInstance({
    url: '/saber/app/list',
    method: 'GET',
    params
  })
  if (result_code === 'success') {
    return data
  }
}
// 添加app
export async function AddApp(data: {
  app_id:string
  description:string
}) {
  return await axiosInstance({
    url: '/saber/app/add',
    method: 'POST',
    data
  })
}

// 更新app
export async function UpdateApp(data: {
  app_id:string
  description:string
}) {
  return await axiosInstance({
    url: '/saber/app/update',
    method: 'POST',
    data
  })
}

// 删除app
export async function DelApp( app_id:string
) {
  return await axiosInstance({
    url: '/saber/app/delete',
    method: 'POST',
    params: {
      app_id
    }
  })
}