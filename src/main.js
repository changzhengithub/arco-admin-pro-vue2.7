import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 中央事件主线mitt
import mitt from 'mitt'

// reset.css
import '@/assets/css/reset.css'
// arco各种弹框弹层样式覆盖
import '@/assets/css/arco.css'

// arco-design
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon' // 引入图标库
import '@arco-design/web-vue/dist/arco.css'

// mock数据
import '@/mock'

// 权限设置
import '@/permission'

const app = createApp(App)

app.config.globalProperties.bus = new mitt()

app.use(store)
app.use(router)
app.use(ArcoVue)
app.use(ArcoVueIcon)
app.mount('#app')

// createApp(App).use(store).use(router).mount('#app')