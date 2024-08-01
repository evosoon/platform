import { GetUserList } from '@/apis/user/user'
import { ref } from 'vue'

/**
 * 新增用户组去重复
 */

interface Choosed {
  checkedUser: CheckedUser[]
  checkedDepartment: CheckedDepartment[]
}
type CheckedUser = {
  parent?: string
  type: 'personage'
  value: User
}
type CheckedDepartment = {
  value: string
  type: 'department'
}
type User = {
  id: number
  user_id: string
  name: string
  email: string | null
  mobile: string | null
  department: string
  create_by: string
  create_time: string
}
export function useUserWeightRemoval(choosed: Choosed) {
  let array = ref<number[]>([])
  // 用户
  if (choosed.checkedUser) {
    array.value = [
      ...array.value,
      ...choosed.checkedUser.reduce(
        (pre: number[], item: CheckedUser) => [...pre, item.value.id],
        []
      )
    ]
  }
  // 部门
  return new Promise((resolve, reject) => {
    if (choosed.checkedDepartment && choosed.checkedDepartment.length) {
      Promise.all(
        choosed.checkedDepartment.map((item: CheckedDepartment) =>
          GetUserList({ d: item.value, k: '', page_no: 1, page_size: 10000 })
        )
      )
        .then((data) => {
          data.forEach((i:any) => {
            array.value = [
              ...array.value,
              ...i.result_list.reduce(
                (pre: number[], item: User) => [...pre, item.id],
                []
              )
            ]
          })
          array.value = [...new Set(array.value)]
          resolve({array})
        })
        .catch((error) => {
          console.error('请求中发生错误:', error)
          reject(error)
        })
    } else {
      array.value = [...new Set(array.value)]
      resolve({array})
    }
  })
}
