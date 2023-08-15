/* eslint-disable */
import CryptoJS from 'crypto-js';

export function isRequire(label) {
    return (value) => {
        const message = value ? null : label + errorMessage.isRequire
        return {
            type: 'isRequire',
            message
        }
    }

}

export function phone(value) {
    const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    const result = reg.test(value)
    const message = reg.test(value) ? null : errorMessage.phone
    return {
        type: 'phone',
        message
    }
}

export const errorMessage = {
    isRequire: '不能为空',
    phone: '请输入正确的手机号码'
}

export function inputBlur() {  //修复 ios唤醒输入法弹窗导致视频上移
    let u = navigator.userAgent
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    if (isIOS) {
        setTimeout(() => {
            const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
            window.scrollTo(0, Math.max(scrollHeight - 1, 0))
        }, 200)
    }
}

/*拉流权健配置*/
// 传入key之前要调用，不然结果不对
function parseKey(key) {
    return CryptoJS.enc.Utf8.parse(key);
}
// 加密过程
function encrypt(mode, plainText, key, iv = null) {
    const uKey = parseKey(key);
    const uIv = parseKey(iv);

    return CryptoJS.AES.encrypt(plainText, uKey,
        {
            iv: uIv,
            mode: mode,
            padding: CryptoJS.pad.Pkcs7
        }
    ).toString();
}
// 解密过程
function decrypt(mode, cipherText, key, iv = null) {
    const uKey = parseKey(key);
    const uIv = parseKey(iv);

    let bytes = CryptoJS.AES.decrypt(cipherText, uKey,
        {
            iv: uIv,
            mode: mode,
            padding: CryptoJS.pad.Pkcs7
        }
    );
    return bytes.toString(CryptoJS.enc.Utf8);
}
// 辅助函数
function md5(data) {
    return CryptoJS.MD5(data).toString();
}
export function getPullUrl(url) {
    const key = 'ef14b146e989b922dcb5a00a19f907c5' // 32位
    const md5Key = md5(key); // 生成md5
    const iv = md5Key.substr(0, 16); // 16位
    console.log( 'iv', iv)
    // const cipherText = 'oDJZrCJy4/RZIPJC4hZ0hQXyPP0vQdcvsgEjL/Q4v8AwDmVpAvGHp+5YofkMTYg44A4oDh5dQXqljXr4zzClxIDJn8OPp3F2hFb7RobV+4RTyEbET+4QDGoeeFrSf/SWsnOJ4Pl04CJmUEgZ9/SWLw=='
    let plainText = decrypt(CryptoJS.mode.CBC, url, key, iv);
    return plainText
}
