import request from '../request'
import url from './url'

export function getOnlineBroadcast ({ pageNumber = 1, pageSize = 2000, type = null }) {
    return request({
        method: 'post',
        url: url.getOnlineBroadcast,
        data: {
            pageNum: pageNumber,
            pageSize,
            type
        }
    })
}

export function getHotHostRoom () {
    return request({
        method: 'post',
        url: url.getHotHostRoom
    })
}

// 主播列表
export function getHostList (status = null) { // 默认获取正在直播的主播
    return request({
        method: 'post',
        url: url.getHostList,
        data: {
            live_status: status
        }
    })
}

export function getLiveRoomApi ({ pageNum, pageSize, type }) {
    return request({
        method: 'post',
        url: url.getLiveRoom,
        data: {
            pageNum,
            pageSize,
            type
        }
    })
}

/* eslint-disable */
export function getFollowLiveApi ({ live_status = 2 }) {
    return request({
        method: 'post',
        url: url.getFollowLive,
        data: {
            live_status
        }
    })
}
/* eslint-enable */
// 主播赛程
export function getAnchorMatches ({ pageNumber = 1, pageSize = 2000, roomId }) {
    return request({
        method: 'post',
        url: url.getAnchorMatches,
        data: {
            pageNum: pageNumber,
            pageSize: pageSize,
            room_id: roomId
        }
    })
}

// 主播赛程列表
export function getHostCompetition ({ pageNumber = 1, pageSize = 2000, day }) {
    return request({
        method: 'post',
        url: url.getHostCompetition,
        data: {
            pageNum: pageNumber,
            pageSize: pageSize,
            day
        }
    })
}

export function followHost (anchorId) {
    return request({
        method: 'post',
        url: url.followHost,
        data: {
            anchor_id: anchorId
        }
    })
}

// 快捷发言
export function getQuickSpeech () {
    return request({
        method: 'get',
        url: url.getQuickSpeech,
        params: {
            type: 1,
            pageSize: 2000,
            pageNum: 1
        }
    })
}

// 本场直播
export function getCurrentLives ({ pageNum = 1, pageSize = 10, matchId, roomId = null }) {
    return request({
        method: 'post',
        url: url.getCurrentLives,
        data: {
            pageNum,
            pageSize,
            match_id: matchId,
            room_id: roomId
        }
    })
}

// 所搜直播

export function searchAnchor (search) {
    return request({
        method: 'get',
        url: url.searchAnchor,
        params: {
            search
        }
    })
}

export function searchBroadcast ({ search, pageSize = 20, pageNum = 1 }) {
    return request({
        method: 'post',
        url: url.searchBroadcast,
        data: {
            pageNum: pageNum,
            pageSize,
            search // 进行中， 2. 已结束
        }
    })
}

// 获取礼物列表
export function getGiftList () {
    return request({
        method: 'get',
        url: url.getGiftList
    })
}

// 赠送礼物
export function giveGift (data) {
    return request({
        method: 'post',
        url: url.giveGift,
        data
    })
}

// 获取宝箱列表
export function getTreasureList () {
    return request({
        method: 'get',
        url: url.getTreasureList
    })
}

// 开启宝箱
export function openTreasure (id) {
    return request({
        method: 'post',
        url: url.openTreasure,
        data: {
            id: id
        }
    })
}

// 领取宝箱
export function drawTreasure (id) {
    return request({
        method: 'post',
        url: url.drawTreasure,
        data: {
            id: id
        }
    })
}

// 获取贡献榜
export function getContribute ({ id, type }) {
    return request({
        method: 'get',
        url: url.getContribute,
        params: {
            anchor_id: id,
            type
        }
    })
}
