import { createApp,ref } from 'vue'
import App from './App.vue'

// import './assets/main.css'

const app = createApp(App)
// 全局注册的数据源
app.config.globalProperties.$history = ref([])
app.config.globalProperties.$chart = ref({})
app.mount('#app')

