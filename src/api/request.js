import axios from 'axios'
import { statusCode } from '@/utils/statusCode'
import {
    getItem,
    getToken,
    removeSessionStorageItem,
    removeToken
} from '@/utils/cookie'
import { Toast } from 'vant'
import Store from '../store/index'
import url from './user/url'
const instance = axios.create({
    timeout: 6000,
    // eslint-disable-next-line no-undef
    baseURL: _requestApiUrl
    // baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_URL : '/'
})

const errorHandle = (error) => {
    const { message } = error.toJSON()
    Store.commit('commonData/SET', { badNetwork: message === 'Network Error' })
    return Promise.reject(error)
}

instance.interceptors.request.use((config) => {
    // 请求拦截器
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, errorHandle)

let isAuthorization = true // 是否退出了
instance.interceptors.response.use((response) => {
    const requestUrl = response.config.url
    const whiteList = [url.login, url.register]
    // 407 只是token失效了，408才是重新登录
    if (response && response.data.code === statusCode.authorizationFail) {
        const userInfo = JSON.parse(getItem('userInfo'))
        // 407 有种情况，userInfo为null，但token依然存在，需要登出，让用户在此登陆
        if (!userInfo.refreshToken) {
            Store.dispatch('user/logoutAction')
            return
        } else {
            // 407 需要去更新 token
            Store.dispatch('user/updateToken')
        }
    }
    if (response && response.data.code === statusCode.refreshTokenFail) {
        // 清楚token等
        removeToken()
        removeSessionStorageItem('userInfo')
        Store.commit('user/SET', {
            token: null,
            nickname: null,
            age: null,
            is_anchor: 1,
            avatar: null
        })
        Toast(response.data.msg)
        if (isAuthorization) {
            isAuthorization = false
            Store.commit('commonData/SET', { isExpired: true })
            setTimeout(() => {
                Store.commit('commonData/SET', { isExpired: false })
                isAuthorization = true
            }, 5000)
        }
    }
    Store.commit('commonData/SET', { badNetwork: false })
    // 响应拦截器
    if (
        response &&
        response.data.code === statusCode.success &&
        !whiteList.includes(requestUrl)
    ) {
        return response.data
    } else {
        return response.data
    }
}, errorHandle)

export default instance
