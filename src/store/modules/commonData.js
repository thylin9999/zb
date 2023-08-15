const state = {
    isExpired: false,
    matchTypes: [
        {
            id: 5,
            title: '全部'
        },
        {
            id: 1,
            title: '足球直播'
        },
        {
            id: 2,
            title: '篮球直播'
        },
        {
            id: 3,
            title: '电竞直播'
        },
        {
            id: 4,
            title: '其他'
        }
    ],
    serviceSite: 'https://tb.53kf.com/code/client/b8ccba789e8f30713194b500e84013f22/1',
    showDownloadDialog: false,
    showLoginTipDialog: false, // 登录提示
    showLoginDialog: false,
    loginDialogUrl: '/', // 默认登录后跳转首页
    appUrls: {
        ad_status: 1,
        android_link: 'http://www.wuhaicj.com/#/home',
        create_by: 'admin',
        create_time: '2022-09-19 04:43:23',
        id: 1,
        ios_link: 'http://www.wuhaicj.com/#/home',
        remark: '测试使用',
        status: 1,
        update_by: 'admin',
        update_time: '2022-09-20 04:12:19'
    },
    badNetwork: false, // 是否网络断开

    stage1Res: {}, // 小组赛结果
    stage2Res: {}, // 1/8赛果
    stage3Res: {}, // 1/4赛果
    stage4Res: {}, // 1/2赛果
    stage5Res: {}, // 决赛

    matchIcons: [
        {
            kind: 1,
            id: 'goal',
            label: '进球'
        },
        {
            kind: 7,
            id: 'penalty',
            label: '点球'
        },
        {
            kind: 13,
            id: 'penaltyF',
            label: '点球不进'
        },
        {
            kind: 8,
            id: 'og',
            label: '乌龙球'
        },
        {
            id: 'corner',
            label: '角球'
        },
        {
            id: 'assistant',
            label: '助攻'
        },
        {
            kind: 3,
            id: 'yellow',
            label: '黄牌'
        },
        {
            kind: 2,
            id: 'red',
            label: '红牌'
        },
        {
            kind: 9,
            id: 'cardChange',
            label: '两黄一红'
        },
        {
            kind: 11,
            id: 'change',
            label: '换人'
        },

        {
            id: 'hurt',
            label: '受伤'
        },
        {
            kind: 14,
            id: 'var',
            label: 'VAR'
        }
    ],
    // 资讯类型
    newsTypes: []

}

const actions = {

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
