import { reactive } from 'vue'
import type { Ref } from 'vue'
import dataBoard from '@/assets/icons/dataBoard.svg'
import dService from '@/assets/icons/dService.svg'
import messageTemplate from '@/assets/icons/messageTemplate.svg'
import userManager from '@/assets/icons/userManager.svg'
import appliedManage from '@/assets/icons/appliedManage.svg'
import logMonitoring from '@/assets/icons/logMonitoring.svg'
import type { EnumItem } from '../types';

export const navList = reactive<EnumItem[]>([
  {
    icon: messageTemplate,
    title: '规则管理',
    link: '/manage/rule'
  },
  {
    icon: dService,
    title: '消息模板',
    link: '/manage/template'
  },
  {
    icon: dataBoard,
    title: '数据看板',
    link: '/manage/board'
  },
  {
    icon: userManager,
    title: '用户管理',
    showChild: false,
    children: [
      { title: '用户', link: '/manage/user/users' },
      { title: '用户组', link: '/manage/user/group' },
      { title: '群组', link: '/manage/user/cluster' }
    ]
  },
  {
    icon: appliedManage,
    title: '应用管理',
    link: '/manage/app'
  },
  {
    icon: dService,
    title: '下游服务',
    showChild: false,
    children: [
      { title: '飞书', link: '/manage/stream/feishu' },
      { title: '短信', link: '/manage/stream/sms' },
      { title: '邮箱', link: '/manage/stream/email' }
    ]
  },
  {
    icon: dataBoard,
    title: '通知记录',
    link: '/manage/record'
  },
  {
    icon: logMonitoring,
    title: '日志监控',
    link: '/manage/log'
  },
  {
    icon: logMonitoring,
    title: '定时任务',
    link: '/manage/time'
  }
])

export const findRoute = (list: EnumItem[], target: string, nowRoute: Ref<EnumItem | undefined>) => {
  list.forEach((item: EnumItem) => {
    if (item.children) {
      if (findChild(item.children, target, nowRoute)) {
        item.showChild = true
      }
    } else if (item.link === target) {
      nowRoute.value = item
    }
  })
}

const findChild = (list: EnumItem[], target: string, nowRoute: Ref<EnumItem | undefined>): boolean => {
  let found = false
  list.forEach((item) => {
    if (item.children) {
      if (findChild(item.children, target, nowRoute)) {
        found = true
      }
    } else if (item.link === target) {
      nowRoute.value = item
      found = true
    }
  })
  return found
}
