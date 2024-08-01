import axiosInstance from '@/utils/request/axios'

export async function getTimeTaskList(params: {
  page_no: number
  page_size: number
  channel?: {
    feishu?: boolean
    sms?: boolean
    email?: boolean
  }
  group_id?: number | null
  task_type?: number | null
  is_create?: boolean | null
  sort_type: number | null
}) {
  const { result_code, data } = await axiosInstance({
    url: '/scheduled/task/list',
    method: 'post',
    params: {
      page_no: params.page_no,
      page_size: params.page_size
    },
    data: {
      channel: params.channel,
      group_id: params.group_id,
      task_type: params.task_type,
      is_create: params.is_create,
      sort_type: params.sort_type
    }
  })
  if (result_code !== 'success') alert(result_code)
  return { result_code, data }
}

export async function updateTimeTask(params: {
  id?: number | null
  start_time?: number | null
  task_time?: number | null
  end_time?: number | null
  task_type?: number | null
  notification?: {
    code?: string
    uid_list: null
    extra_data: null
    params: null
    access_token: null
  }
}) {
  const { result_code, data } = await axiosInstance({
    url: '/scheduled/task/update',
    method: 'POST',
    data: params
  })
  if (result_code === 'success') {
    // ElMessage.success(result_code)
  } else {
    // ElMessage.error(result_code)
  }
  return { result_code, data }
}

export async function addTimeTask(params: {
  start_time?: number | null
  task_time?: number | null
  end_time?: number | null
  task_type?: number | null
  notification?: {
    code?: string
    uid_list: null
    extra_data: null
    params: null
    access_token: null
  }
}) {
  const { result_code, data } = await axiosInstance({
    url: '/scheduled/task/add',
    method: 'POST',
    data: params
  })
  if (result_code === 'success') {
    // ElMessage.success(result_code)
  } else {
    // ElMessage.error(result_code)
  }
  return { result_code, data }
}

export async function getGroup(params: { page_no: number; page_size: number }) {
  const { result_code, data } = await axiosInstance({
    url: '/saber/group/list',
    method: 'GET',
    params
  })
  if (result_code === 'success') {
    return data
  }
}

export async function deleteTimeTask(params: { id: number }) {
  const { result_code, data } = await axiosInstance({
    url: '/scheduled/task/delete',
    method: 'POST',
    params
  })
  if (result_code === 'success') {
    return data
  }
}
