import Vue from 'vue'
import ShowGiveGift from '@/components/ShowGiveGift'

/**
 *礼物显示逻辑
 * 1.第一次展示的时候该礼物的信息返回给父元素
 * 2.如果第二次或以后送的礼物是同一个人 && 是同一种礼物，做连击处理
 * 3.连击，父元素根据第一次返回的礼物信息，清除定时器，并且将连击数累加
*/

const ShowGiftStructor = Vue.extend(ShowGiveGift)

const theShowGift = function (item, $bus) {
    const showGiftDom = new ShowGiftStructor({
        el: document.createElement('div')
    })
    let parent
    if (item.gift_type === 1) { // 1全屏礼物 2横幅礼物
        parent = document.querySelector('#fullScreenId')
    } else {
        parent = document.querySelector('#giveGiftId')
    }
    // parent.appendChild(showGiftDom.$el)
    parent.prepend(showGiftDom.$el)
    showGiftDom.item = item

    const timeStart = function (clear) {
        clear && clearTimeout(clear)
        clear = setTimeout(() => { // 显示完礼物后销毁dom
            $bus.$emit('showGiftList', clear) // 通知父元素，删除列表对应的礼物，使用定时器的值来查找
            $bus.$emit(`stopSvgaPlayer${item.svgaId}`) // 通知svga组件，停止动画的播放
            showGiftDom.$el.remove()
            parent = null
        }, item.time + 1000) // 横幅需要多1秒动画过度在销毁
        return clear
    }
    const clear = timeStart()
    // 需要返回 dom, 会员id，礼物id，启动定时器函数，清除定时器，连击数, svgId(唯一值)
    return {
        dom: showGiftDom.$el, // dom
        user_id: item.member_id, // 会员id
        gift_id: item.gift_id, // 礼物id
        count: item.count, // 连击数
        timeStart, // 定时器fn
        clear, // 定时器
        svgaId: item.svgaId
    }
}

export default theShowGift
