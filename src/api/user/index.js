import request from '../request'
import url from './url'
export function getUserInfo (id) {
    return request({
        method: 'get',
        url: url.userInfo,
        params: {
            id
        }
    })
}

export function login ({ account = 'admin', code = 666666, password = '000000', type }) {
    return request({
        method: 'POST',
        url: url.login,
        data: {
            type,
            account,
            mobile_code: code,
            password
        }
    })
}

// eslint-disable-next-line camelcase
export function oneLogin ({ process_id, accesscode, phone, auth_code }) {
    return request({
        method: 'post',
        url: url.oneLogin,
        data: {
            process_id,
            accesscode,
            device: 'H5',
            phone,
            auth_code
        },
        timeout: 60 * 1000
    })
}

export function logout () {
    return request({
        method: 'post',
        url: url.logout
    })
}
export function register ({ account = 'admin', code = 666666, password = '000000' }) {
    return request({
        method: 'POST',
        url: url.register,
        data: {
            account,
            mobile_code: code,
            password
        }
    })
}
// 找回密码
export function findBackPwd ({ account = '', code = 666666, password = '000000' }) {
    return request({
        method: 'post',
        url: url.findBackPwd,
        data: {
            account,
            password,
            mobile_code: code
        }
    })
}

export function getHosts () {
    return request({
        method: 'get',
        url: url.getHosts
    })
}

export function getCode ({ mobile, msType = 1, validate }) {
    return request({
        method: 'post',
        url: url.getCode,
        data: {
            mobile,
            'msg_type': msType,
            validate
        }
    })
}

export function updatePassword ({ phone, code, password, oldPassword }) {
    return request({
        method: 'post',
        url: url.updatePassword,
        data: {
            mobile: phone,
            pwd_new: password,
            vcode: code,
            pwd_old: oldPassword
        }
    })
}

// 更新个人信息
export function editUserInfo ({ nickname, sign, birth, gender, avatar, label }) {
    return request({
        method: 'post',
        url: url.editUserInfo,
        data: {
            nickname,
            sign,
            birth,
            gender,
            avatar,
            label
        }
    })
}

// 订阅主播
export function getSubscribeHosts () {
    return request({
        method: 'post',
        url: url.getSubscribeHosts
    })
}

export function subscribeHost (anchorId, type) {
    return request({
        method: 'post',
        url: url.subscribeHost,
        data: {
            anchor_id: anchorId,
            type
        }
    })
}

// 验证及换绑手机
export function updatePhone ({ mobile, code, isValidatePhone = false }) {
    return request({
        method: 'post',
        url: isValidatePhone ? url.validatePhone : url.updatePhone,
        data: {
            mobile,
            mobile_code: code
        }
    })
}

// 申请主播
export function validateAuth ({
    name,
    idCard,
    imgs
}) {
    return request({
        method: 'post',
        url: url.validateAuth,
        data: {
            name,
            id_card: idCard,
            id_card_front_photo: imgs.frontImg,
            id_card_back_photo: imgs.backImg,
            hand_held_id_card_photo: imgs.handInImg
        }
    })
}
export function applyAnchor ({
    leagueType, contact, contactValue, description, code, experience
}) {
    return request({
        method: 'post',
        url: url.applyAnchor,
        data: {
            exp: experience,
            league_type: leagueType,
            contact: contact,
            contact_value: contactValue,
            bio: description,
            mobile_code: code
        }
    })
}
// 申请专家
export function applyExpert ({
    profession, reference, goodAt, imgs, code
}) {
    const images = imgs.reduce((all, item, index) => {
        const key = 'image_url_' + (index + 1)
        all[key] = item
        return all
    }, {})
    return request({
        method: 'post',
        url: url.applyExpert,
        data: {
            profession,
            reference,
            ...images,
            good_at_games: goodAt,
            mobile_code: code
        }
    })
}
// 实名认证 状态
export function getApplyResult () {
    return request({
        method: 'get',
        url: url.getApplyResult
    })
}
// 获取申请状态
export function getApplyStatus (type) { // type: 1 主播 2 专家
    return request({
        method: 'get',
        url: url.getApplyStatus,
        params: {
            type
        }
    })
}

// 用户注销
export function toLogout (code) {
    return request({
        method: 'post',
        url: url.toLogout,
        data: {
            mobile_code: code
        }
    })
}

// 刷新token
export function updateToken (memberId, refreshToken) {
    return request({
        method: 'post',
        url: url.updateToken,
        data: {
            member_id: memberId,
            refresh_token: refreshToken
        }
    })
}
