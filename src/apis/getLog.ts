import axiosInstance from '@/utils/request/axios.ts'
// 登录
export async function GetLog(params: {
  level: string | null
  start_log_id: string | null
  end_log_id: string | null
  start_time: number | null
  end_time: number | null
  keyword: string | null
}) {
  const { result_code, data } = await axiosInstance({
    url: '/saber/log',
    method: 'get',
    params
  })
  return { result_code, data }
}

export async function GetHistory() {
  const { result_code, data } = await axiosInstance({
    url: '/saber/log/histogram',
    method: 'get'
  })
  return { result_code, data }
}
