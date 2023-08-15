const url = {
    getOnlineBroadcast: '/api/live/roomLists',
    // 主播角度 的推荐直播
    getHotHostRoom: '/api/anchor/hot',
    getHostList: '/api/anchor/all', // 主播列表
    getLiveRoom: '/api/live/roomLists',
    getFollowLive: '/api/follow/lists', // 获取关注的直播间列表
    // 主播赛程
    getAnchorMatches: '/api/anchor/AnchorMatch',

    getHostCompetition: '/api/scheduleMatch/preList',
    followHost: '/api/follow/add',
    getQuickSpeech: '/api/speech/list',

    // 本场直播
    getCurrentLives: '/api/live/matchLive',
    // 主播搜索
    searchAnchor: '/api/anchor/search',
    // 直播搜索
    searchBroadcast: '/api/live/search',
    // 礼物列表
    getGiftList: '/api/gift/lists', // 礼物列表
    giveGift: '/api/gift/giveGift', // 赠送礼物
    // 宝箱列表
    getTreasureList: '/api/box/list', // 宝箱列表
    openTreasure: '/api/box/openBox', // 开启宝箱
    drawTreasure: '/api/box/drawBox', // 领取宝箱
    // 贡献榜
    getContribute: '/api/gift/ranking'

}

export default url
