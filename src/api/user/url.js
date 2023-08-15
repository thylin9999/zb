
const url = {
    userInfo: '/api/member/details',
    login: '/api/member/login',
    updateToken: '/api/jwt/refresh',
    oneLogin: '/api/member/oneLogin',
    logout: '/api/member/logout',
    register: '/api/member/register',
    findBackPwd: '/api/member/editPwd',
    getHosts: '/api/user/getHosts',
    getCode: '/api/sendSms/send',
    updatePassword: '/api/member/updatePwd',
    editUserInfo: '/api/member/editMember',
    updatePhone: '/api/member/editMobile',
    validatePhone: '/api/member/editOldMobile',
    // 主播列表
    getSubscribeHosts: '/api/follow/myLists',
    subscribeHost: '/api/follow/add',

    // 实名认证
    validateAuth: '/api/realname/add',
    applyAnchor: '/api/apply/anchor',
    applyExpert: '/api/apply/expert',
    getApplyResult: '/api/realname/status',
    getApplyStatus: '/api/apply/status',

    // 用户注销
    toLogout: '/api/member/logoff'
}
export default url
