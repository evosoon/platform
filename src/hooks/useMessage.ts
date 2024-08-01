import { ElMessage } from "element-plus"

export enum MessageType {
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  ERROR = 'error'
}

export const useElMessage = (message:string | undefined,type:'success' | 'warning' | 'info' | 'error') => {
  if(!message) return
  ElMessage({
    message,
    type,
  })
}