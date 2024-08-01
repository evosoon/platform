import { createApp } from 'vue'
import App from './App.vue'
import store from './stores'
import router from '@/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import './assets/main.css'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store)

app.use(router)

app.mount('#app')
