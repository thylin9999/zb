/* eslint-disable */
import { getUserInfo, login, register, logout, updateToken } from '../../api/user'
import { setToken, removeToken, setItem, removeSessionStorageItem, getItem } from '../../utils/cookie'
import { statusCode } from '@/utils/statusCode'
const state = {
    age: null,
    account: '',
    avatar: null,
    birth: null,
    level: 1,
    member_id: null,
    nickname: '',
    sign: null,
    gender: null,
    token: null, // token
    refreshToken: null, // 更新token
    signature: '', //
    ball_coin:0,
    ball_ticket:0,
    fans_count:0,
    follow_count:0,
    is_anchor:null,
    is_expert:null,
    label: null,
    labels: null
}

const actions = {
    async getUserInfo ({ state, dispatch, commit, getters }) {
        try {
            const userInfo = JSON.parse(getItem('userInfo'))
            console.log(userInfo, 'sdf')
            const { data } = await getUserInfo()
            const params = {
                ...data,
                refreshToken: userInfo && userInfo.refreshToken
            }
            commit('SET', params)
            setItem('userInfo', JSON.stringify(params))
            return true
        } catch (error) {
            console.log(error, 'error')
            return false
        }
    },
    async login ({ state, dispatch, commit }, payload) {
        try {
            // eslint-disable-next-line camelcase
            const { code, data, msg, token, refresh_token } = await login(payload)
            if (code === statusCode.success) {
                setToken(token)
                const params = {
                    ...data, token, refreshToken: refresh_token
                }
                setItem('userInfo', JSON.stringify(params))
                commit('SET', params)
                return {
                    code
                }
            } else {
                return { code, msg, data: null }
            }
        } catch (error) {
            console.error(error, 'error')
        }
    },
    async register ({ state, dispatch, commit }, payload) {
        try {
            const { code, msg, data } = await register(payload)
            return { code, msg, data }
        } catch (error) {
            console.error(error, 'error')
        }
    },
    async logoutAction ({ state, dispatch, commit }) {
        // 菜单等 路由信息也应该删除。。。
        // 去除token
        try {
            await logout()
        } catch (e) {
            console.log('出错了')
        } finally {
            removeToken()
            removeSessionStorageItem('userInfo')
            // 删除用户信息
            commit('SET', { token: null, nickname: null, age: null, avatar: null, ball_coin: null, ball_ticket: null })
        }
    },
    async updateToken ({ state, commit }) {
        const userInfo = JSON.parse(getItem('userInfo'))
        // eslint-disable-next-line camelcase
        const { code, data } = await updateToken(userInfo.member_id, userInfo.refreshToken)
        if (code === statusCode.success) {
            const { token, refresh_token } = data
            setToken(token)
            const params = {
                ...state,
                token,
                refreshToken: refresh_token
            }
            setItem('userInfo', JSON.stringify(params))
            commit('SET', params)
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
    isLogin (state) {
        return !!state.token
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
