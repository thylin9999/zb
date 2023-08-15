import { Toast } from 'vant'

export const weekDay = {
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    7: '星期日'
}
// 0：未开1：上半场2：中场3：下半场4：加时5：点球-1：完场-10：取消-11：待定-12：腰斩-13：中断-14：推迟
export const matchStatus = {
    '0': '未',
    '1': '上半场',
    '2': '中场',
    '3': '下半场',
    '4': '加时',
    '5': '点球',
    '-1': '完',
    '-10': '取消',
    '-11': '待定',
    '-12': '腰斩',
    '-13': '中断',
    '-14': '推迟'
}
export const basketStatus = {
    0: '未开赛',
    1: '一节',
    2: '二节',
    3: '三节',
    4: '四节',
    5: '1OT',
    6: '2OT',
    7: '3OT',
    50: '中场',
    '-1': '完场',
    '-2': '待定',
    '-3': '中断',
    '-4': '取消',
    '-5': '推迟'
}
export const basketGoingStates = [1, 2, 3, 4, 5, 6, 7, 50]
export const isGoingStates = [1, 2, 3, 4, 5]
export const isGoingCompetition = (state, key = 'football') => {
    const isGoingList = key === 'football' ? isGoingStates : basketGoingStates
    return isGoingList.includes(state)
}

export const hidePhone = phone => {
    const value = phone + ''
    return (value.slice(0, 3) + '*****' + value.slice(8))
}

export function Copy (copyValue) { // 复制
    const domUrl = document.createElement('input')
    domUrl.value = copyValue
    domUrl.id = 'creatDom'
    document.body.appendChild(domUrl)
    domUrl.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    const creatDom = document.getElementById('creatDom')
    creatDom.parentNode.removeChild(creatDom)
    Toast('复制成功')
}
export const giveHeatNumber = value => {
    if (value < 1000) {
        return value
    }
    return getBit(value / 10000) + '万'
}

function getBit (value) {
    const reg = /([0-9]+\.[0-9]{1})[0-9]*/
    let str = value.toString()
    str = str.replace(reg, '$1')
    return str
}

export const qulities = {
    Original: '超清',
    HD: '高清',
    ordinary: '一般'
}
export const groupChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export const percentToNum = (value) => {
    if (!value) {
        return
    }
    let res = value
    if (typeof value === 'string' && value.includes('%')) {
        res = value.slice(0, value.length - 1) * 1
    }
    return res
}
