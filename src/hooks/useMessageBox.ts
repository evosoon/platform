import { ElMessageBox } from 'element-plus'

enum EnumItem {
  DELETE = 'delete',
  UNSAVE = 'unsave',
  DEFAULT = 'default',
}

interface Data {
  type: string
  message: string | [string, string]
  confrim: string
  extends: string
}
let data: Data = {
  type: EnumItem.DEFAULT,
  message: '确定执行此操作？',
  confrim: '确定',
  extends: ''
}
interface Res {
  type: 'success' | 'fail'
  data: string
}
export default function useMessageBox(props: Partial<Data>): Promise<Res> {
  props = Object.assign(data,props)
  switch (props.type) {
    case EnumItem.DELETE:
      props.message = `确定删除 ${(props.message && props.message[0]) || '名称'} 的 ${(props.message && props.message[1]) || '类型'} 吗？删除后不可恢复`
      props.confrim= '删除'
      break
    case EnumItem.UNSAVE:
      props.message = `已修改内容尚未保存，是否关闭？`
      props.confrim= '关闭'
      break
    case EnumItem.DEFAULT:
      break
    default:
      throw new Error(`Unexpected input: ${props.type}`)
  }

  return ElMessageBox.confirm(props.message, {
    confirmButtonText: props.confrim,
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      return {
        type: 'success',
        data: props.extends
      }
    })
    .catch(() => {
      return {
        type: 'fail',
        data: props.extends
      }
    })
}
