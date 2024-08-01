import { MessageType, useElMessage } from '@/hooks/useMessage'
import { useRouter } from 'vue-router'
const $router = useRouter()

interface Status {
  result_code: string | number
  message: string
}
export function showErrorInfo(status: Status): void {
  switch (status.result_code) {
    case 'success': {
      break
    }
    case 'invalid_param': {
      console.log(status.message)
      break
    }
    case 401: {
      localStorage.clear()
      useElMessage('身份认证失败（401）', MessageType.ERROR)
      setTimeout(() => {
        location.reload()
      }, 1800)
      break
    }

    case 404: {
      console.error('请求地址不存在（404）')
      setTimeout(() => {
        $router.replace('/notFound')
      }, 1000)
      break
    }

    case 500: {
      console.error(status.message || '服务器发生了未知错误（500）')
      useElMessage(status.message , MessageType.ERROR)

      break
    }

    default: {
      console.error('请求失败, 请稍后重试.')
      useElMessage('请求失败, 请稍后重试.', MessageType.ERROR)
    }
  }
}
