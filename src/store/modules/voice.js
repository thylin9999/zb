const state = {
    voiceUrl: 'default',
    playStatus: false,
    // 赛事提示效果
    voice: false,
    animation: true,
    ranking: false,
    cardTip: true,
    cardAnimation: true
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
