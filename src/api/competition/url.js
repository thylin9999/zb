const url = {
    getLiveList: '/api/live/roomLists',
    getRoomInfo: '/api/live/live',
    getHotRoom: '/api/live/hotRoom',
    subscribeHost: '/api/follow/add',
    getBattles: '/api/v1/battles',
    getHotMatches: '/api/scheduleMatch/hotMatch',
    addSubscribeMatch: '/api/attention/add', // 预约赛事
    getBookedMatches: '/api/attention/lists', // 预约列表
    getMatchList: '/api/scheduleMatch/lists', // 赛程
    getOrderMatchList: '/api/attention/lists', // 赛事-我的预约
    getHotSchedule: '/api/leagues/hotLists', // 赛事-获取热门联赛
    getThreeLeagueType: '/api/leagues/threeLists', // 三级联赛
    //  本场比赛
    getMatchLive: '/api/live/matchLive',
    clearFinish: '/api/attention/cancelFinish', // 清空完场预约
    cancelSchedule: '/api/preordain/cancel', // 取消预约
    // 阵容
    lineup: '/api/lineup/',
    // 获取拉流配置
    signurl: '/api/live/signurl',

    // 直播间比赛数据
    getMatchInfo: '/api/match/',

    // 文字直播
    getTextLive: '/api/match/textLive'
}
export default url
