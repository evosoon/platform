import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      username: ' '
    }
  },
  actions: {
    updateName(name: string) {
      this.username = name
    }
  }
})

// 官方文档 https://pinia.vuejs.org/introduction.html
