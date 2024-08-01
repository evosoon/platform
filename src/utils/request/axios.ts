import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import {showErrorInfo} from './error'
import { useElMessage } from '@/hooks/useMessage'

const baseURL = import.meta.env.VITE_BASE_URL

const axiosInstance = axios.create({
  // baseURL: '/api',
  baseURL,
  // baseURL: bestURL,
  // baseURL: 'http://192.168.115.22:38210',
  timeout: 5000
})

axiosInstance.interceptors.request.use(
  (req: InternalAxiosRequestConfig) => {
    req.headers['Content-Type'] = 'application/json'
    // req.headers['accept-encoding'] = 'gzip'
    if (localStorage.getItem('access_token'))
      req.headers['Authorization'] = localStorage.getItem('access_token')
    return req
  },
  (err: any) => Promise.reject(err)
)

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res && res.status === 200) {
      return res.data
    }
    return Promise.reject(res.data)
  },
  (err: any) => {
    showErrorInfo({ result_code: err.response.status, message: err.response.data.message })
    return Promise.reject()
  }
)

export default axiosInstance
