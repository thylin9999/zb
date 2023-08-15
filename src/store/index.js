import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import commonData from '@/store/modules/commonData'
import voice from './modules/voice'
// import permission from './modules/permission'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        user,
        commonData,
        voice
        // permission
    }
})
