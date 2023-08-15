import request from '../request.js'
import url from './url.js'

export function getGuideList (params) { // 专家列表
    return request({
        method: 'get',
        url: url.getGuideList,
        params
    })
}

export function getLeaguesList (params) { // 联赛列表
    return request({
        method: 'get',
        url: url.getLeaguesList,
        params
    })
}

export function getChoiceList () { // 精选专家
    return request({
        method: 'get',
        url: url.getChoiceList
    })
}

export function searchExpert (data) { // 专家搜索
    return request({
        method: 'post',
        url: url.searchExpert,
        data
    })
}

export function getPurchased (params) { // 已够方案
    return request({
        method: 'get',
        url: url.getPurchased,
        params
    })
}
