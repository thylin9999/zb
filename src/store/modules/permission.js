import { getPermission } from '../../api/permission'
import { filterRoutes, asyncRoutes } from '../../router/router.config'

const state = {
    menus: [], // 菜单
    routes: [], // 过滤后的菜单
    permissions: null // 所有的权限
}
// permissions = {
// welcome: ['ADD', 'READ'],
// list: ['ADD', 'UPDATE', 'DELETE', 'READ'],
// detail: ['ADD', 'UPDATE', 'DELETE', 'READ'],
// posts: ['ADD', 'UPDATE', 'DELETE', 'READ'],
// Charts: ['ADD', 'UPDATE', 'DELETE', 'READ'],
// form: ['ADD', 'UPDATE', 'DELETE', 'READ'],
// }
const actions = {
    async getUserMenus ({ dispatch, commit, state }, payload) {
        try {
            const { data } = await getPermission()
            commit('SET', { permissions: data.data })
            const menus = Object.keys(data.data)
            commit('SET', { menus })
            return true
        } catch (error) {
            console.error(error, 'error')
            return false
        }
    },
    generateRoutes ({ state, dispatch, commit }) {
        try {
            const accessRoutes = filterRoutes(state.menus, asyncRoutes)
            commit('SET', { routes: accessRoutes })
            return true
        } catch (error) {
            console.log(error, 'error')
            return false
        }
    }
}

const mutations = {
    SET (state, payload) {
        Object.entries(payload).forEach(item => {
            const key = item[0]
            const value = item[1]
            state[key] = value
        })
    }
}

const getters = {

}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
