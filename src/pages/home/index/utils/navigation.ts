import type { Router } from 'vue-router'
import type { EnumItem } from '../types'

type EmitFunction = {
  (event: 'changeRouter', ...args: any[]): void;
};

export const routeJump = (item: EnumItem, emit: EmitFunction, router: Router): void => {
  if (item.children) {
    item.showChild = !item.showChild
    return
  } else if (item.link === '/login') localStorage.removeItem('access_token')

  emit('changeRouter', item)
  router.push({ path: item.link })
}

export const outLogin = (emit: EmitFunction, router: Router): void => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('username')
  routeJump({ icon: '', title: '退出账户', link: '/login' }, emit, router)
}
