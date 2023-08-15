
// _scoreWs
export default class ScoreWs {
    static initScoreWs (cb) {
        this.cb = cb
        this.types = ['score', 'goal', 'yellow', 'red', 'odds']
        this.ws = null
        // eslint-disable-next-line no-undef
        this.wsUrl = _scoreWs
        this.listener = new Listener()
        this.init()
    }

    static init () {
        this.ws = new WebSocket(this.wsUrl)
        this.ws.onmessage = this.onMessage.bind(this)
        this.ws.onclose = this.onClose.bind(this)
        this.ws.onerror = this.onError.bind(this)
        this.ws.onopen = this.onOpen.bind(this)
    }

    static sendMsg (msg) {
        this.ws.send(msg)
    }

    static onOpen (e) {
        if (this.cb) {
            this.cb()
        }
    }

    static onMessage ({ data }) {
        const originalData = JSON.parse(data)
        const type = originalData[0]
        const _data = originalData[1]
        if (this.types.includes(type)) {
            if (type === 'score') {
                this.listener.emit('score', { data: _data, type })
            } else if (type === 'odds') {
                this.listener.emit('score', { data: _data, type })
            } else if (type !== 'score') {
                // 需要发出通知，只在订阅的页面发出通知
                // notification.success({ type, data: _data })
                this.listener.emit('info', { data: _data, type })
            }
        }
    }

    static onError (e) {
        console.log(e, 'onError')
    }

    static onClose (e) {
        console.log(e, 'onClose')
    }
}

class Listener {
    constructor () {
        this.cbs = {}
    }

    on (type, cb) {
        const existCbs = this.cbs[type]
        if (!existCbs) {
            this.cbs[type] = []
        }
        this.cbs[type].push(cb)
    }

    emit (type, params) {
        const cbs = this.cbs[type] || []
        cbs.forEach(cb => {
            cb(params)
        })
    }

    off (type, cb) {
        const existCbs = this.cbs[type]
        const index = existCbs.findIndex(x => x === cb)
        this.cbs[type].splice(index, 1)
    }
}
