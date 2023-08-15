/* eslint-disable */
const loacalAppIds = {
    'http://localhost:8080': 'efd3ae5242c65222e3d227822fd9fd92',
    'http://m.wuhaicj.com': 'd07837f047cc05b1ce68816fe4701b5f',
    'https://m.haibao88.com': 'd92d8ea601114c3a1cb0586665582d2a',
    'https://m.haibao98.com': 'b1764ba4c0d7813b25ff70f3cdeeec30',
    'https://m.bq88.cn': '636bf324c277b2b19cd0a93e48aa27e0'
}
export default class OneLogin {
    static instance = null
    static network = null
    static appId = null
    errorCb = null
    successCb = null
    static getNetworkType () {
        const common_cell = ['cellular', '2g', '3g', '4g', '5g', '3G/2G']
        const user_agent = navigator.userAgent.toLowerCase()
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || { type: 'unknown' }
        let type
        // 判断是否是微信内置浏览器
        const isWeixin = /micromessenger/.test(user_agent)
        if (isWeixin) {
            if (user_agent.indexOf('nettype') !== -1) {
                type = user_agent.match(/nettype\/\w+/) ? user_agent.match(/nettype\/\w+/)[0] : 'nettype/unknow'
                type = type.replace('nettype/', '')
            } else {
                var weixinType = { 'network_type:wifi': 'wifi', 'network_type:edge': '3G/2G', 'network_type:fail': 'fail', 'network_type:wwan': '3G/2G' }
                document.addEventListener('WeixinJSBridgeReady', function onBridgeReady () {
                    // eslint-disable-next-line no-undef
                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                        type = weixinType[e.err_msg]
                    })
                })
            }
        } else {
            type = (connection && connection.type) || 'unknown'
        }
        // 对type 做统一处理
        if (type && common_cell.indexOf(type) !== -1) {
            return 'cellular'
        } else if (type === 'wifi') {
            return 'wifi'
        }
        return 'unknown'
    }

    static init (successCb, errorCb) {
        const { origin } = window.location
        this.appId = loacalAppIds[origin] || 'd92d8ea601114c3a1cb0586665582d2a'
        this.successCb = successCb
        this.errorCb = errorCb
        this.instance = this.initOnepass()
        console.log(this.appId,origin,_appIds,_appIds[origin],loacalAppIds, 'asdf')
    }

    static initOnepass () {
        //  判断当前网络状态的方法,用户可根据业务需求进行更改,为可选步骤
        var nettype = this.getNetworkType()
        var ispre = nettype !== 'wifi'
        // step3: 初始化onepass 参数
        var opInstance = new GOP({
            app_id: this.appId, // app id
            timeout: 3000, // 超时
            pre_init: ispre // 是否初始化时获取运营商参数
        })
        // step6: 网关调用成功后触发
        opInstance.onGatewaySuccess((data) => {
            // 网关验证成功， 获取运营商取号标示
            this.successCb && this.successCb(data)
            /**
             * 调用后端校验接口，获取是否是本机校验结果
             * request 参数: {
             *      app_id: // app id
             *      phone: // 需校验手机号
             *      process_id: SDK返回的流水号 data.process_id
             *      accesscode: 运营商返回取号的标识 data.accesscode
             *  }
             * **/
        })
            // step6: 网关调用失败后触发
            .onGatewayFail((data) => {
                // 网关失败，调用短信
                // sendMessage()
                this.errorCb()
            })
        return opInstance
    }

    static async fastLogin (phone) {
        const res = await this.instance && this.instance.gateway({ phone })
    }
}
