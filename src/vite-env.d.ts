/// <reference types="vite/client" />

declare module 'element-plus'
declare module '@/utils/request/axios.ts'
declare module '*.svg'

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}
