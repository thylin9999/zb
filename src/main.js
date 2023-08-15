// import './mock'
import './assets/fonts/font.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import bootstrap from './utils/bootstrap'
// 页面权限
// import './router/permission'
// 清除默认样式
import 'normalize.css/normalize.css'
// 全局样式
import './styles/index.scss'
// svg icon
import './icons/index'

import { i18n } from './utils/lang/index'

import { globalMixin } from '@/mixins/globalMixin'

import VueLazyload from 'vue-lazyload'

// import lyzTable from 'lyz-table'
// Vue.use(lyzTable)

import { Toast } from 'vant'
Vue.use(Toast)
Vue.prototype.$showLoading = Toast.loading.bind(Toast, {
    icon: require('@/assets/loading.gif'),
    message: '加载中...',
    duration: 0,
    forbidClick: true
})
Vue.prototype.$hideLoading = Toast.clear.bind(Toast)

Vue.use(VueLazyload)
const bus = new Vue()
Vue.prototype.$bus = bus

Vue.use(VueLazyload, {
    preLoad: 1.3,
    attempt: 1
})

Vue.config.productionTip = false
Vue.mixin(globalMixin)
new Vue({
    router,
    store,
    i18n, // 国际化
    created: bootstrap, // 刷新时，从localstorage中获取 token赋值给vuex
    render: h => h(App)
}).$mount('#app')
