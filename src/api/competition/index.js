import request from '../request'
import url from './url'
export function getLiveList ({ pageNumber = 1, pageSize = 2000, type = 0 }) {
    return request({
        method: 'post',
        url: url.getLiveList,
        data: {
            'pageNum': pageNumber,
            'pageSize': pageSize,
            type
        }
    })
}
// 首页热门直播
export function getHotRoom ({ pageSize = 2000, pageNumber = 1 }) {
    return request({
        method: 'post',
        url: url.getHotRoom,
        data: {
            pageSize,
            pageNum: pageNumber
        }
    })
}
export function getRoomInfo (data) { // 直播间信息
    return request({
        method: 'post',
        url: url.getRoomInfo,
        data
    })
}

export function subscribeHost (data) { //  预约主播
    return request({
        method: 'post',
        url: url.subscribeHost,
        data
    })
}

export function getBattles ({ date }) {
    return request({
        method: 'get',
        url: url.getBattles,
        params: {
            date
        }
    })
}

export function getHotMatches ({ day = null }) {
    return request({
        method: 'post',
        url: url.getHotMatches,
        data: {
            day: day || null
        }
    })
}

// 卡片预约赛事
export function addSubscribeMatch (matchId, leagueType) {
    return request({
        method: 'post',
        url: url.addSubscribeMatch,
        data: {
            match_id: matchId,
            leagueType
        }
    })
}

// 赛程
export function getMatchList ({
    pageNumber = 1,
    pageSize = 20,
    leagueId = [],
    playing = '',
    leagueType = null,
    day = null,
    hierarchy = ''
}) {
    return request({
        method: 'post',
        url: url.getMatchList,
        timeout: 1000 * 60, // 1分钟
        data: {
            'pageNum': pageNumber,
            pageSize,
            day,
            leagueId,
            playing,
            leagueType,
            hierarchy
        }
    })
}

export function getBookedMatches () {
    return request({
        method: 'post',
        url: url.getBookedMatches
    })
}

// 获取我的预约列表接口
/* eslint-disable */
export function getOrderMatchApi ({ pageNumber = 1, pageSize = 1000, match_status = '2000' }) {
    return request({
        method: 'post',
        url: url.getOrderMatchList,
        data: {
            'pageNum': pageNumber,
            'pageSize': pageSize,
            match_status:  match_status + ''
        }
    })
}

// 赛事-获取热门联赛
export function getHotScheduleApi ({league_type, day, hierarchy}){
    return request ({
        method: 'post',
        url: url.getHotSchedule,
        data: {
            league_type,
            day,
            hierarchy
        }
    })
}
// 三级联赛
// eslint-disable-next-line camelcase
export function getThreeLeagueType (league_type) {
    return request({
        method: 'post',
        url: url.getThreeLeagueType,
        data: {
            league_type
        }
    })
}
// 获取本场比赛相关
export function getMatchLive ({ pageNumber = 1, pageSize = 2000, matchId }) {
    return request({
        method: 'post',
        url: url.getMatchLive,
        data: {
            pageNum: pageNumber,
            pageSize: pageSize,
            match_id: matchId
        }
    })
}

// 清空完场预约
export function clearFinishApi () {
    return request({
        method: 'post',
        url: url.clearFinish
    })
}

// 取消预约
export function cancelScheduleApi ({ matchId }) {
    return request({
        method: 'post',
        url: url.cancelSchedule,
        data: {
            matchId
        }
    })
}

// 获取阵容信息
export function getLineup (type, matchId) {
    return request({
        method: 'post',
        url: url.lineup + type,
        data: {
            match_id: matchId
        }
    })
}
//  获取拉流配置
export function getSignurl (params) {
    return request({
        method: 'get',
        url: url.signurl,
        params
    })
}


// 获取直播间比赛数据

export function getMatchInfo(type, matchId) {
    return request({
        method: 'get',
        url: url.getMatchInfo + type,
        params: {
            match_id: matchId
        }
    })
}

// 文字直播

export function getTextLive (matchId, type = 1, quarter, currentPage = 1, pageSize = 3000) {
    return request({
        method: 'post',
        url: url.getTextLive,
        data: {
            match_id: matchId * 1,
            type: type + '',
            quarter,
            page: currentPage,
            page_size: pageSize

        },
        timeout: 1000 * 60
    })
}