// 易盾
export function initNECaptcha (_this) {
    // const _this = this
    initNECaptchaWithFallback ({
        element: '#captcha',
        captchaId: '0b2751aad8d94852b196e2d74ea0e5dd',
        width: '320px',
        mode: 'popup',
        apiVersion: 2,
        popupStyles: {
            position: 'fixed',
            top: '20%'
        },
        onVerify: function (err, data) {
            if (err) return // 当验证失败时，内部会自动refresh方法，无需手动再调用一次
            // 若成功拿到 validate，可向后端发送请求
            _this.getValidateCode(data.validate)
            _this.captchaIns && _this.captchaIns.refresh()
        }
    }, function onload (instance) {
        _this.captchaIns = instance
    }, function onerror (err) {
        console.warn(err)
    })
}
