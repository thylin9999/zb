<template>
    <div class="chat-box p-relative h-100 p-t-10">
        <div class="announcement flex align-center">
            <!-- 系统提示：任何群、广告均为诈骗，违规者封号处理!-->
            <img :src="trumpet" width="14" height="14" alt="">
            <marquee behavior=scroll class="scroll">
                <!-- 这里可以填写走马灯内容 -->
                {{ mequeList[0]?mequeList[0].content:'' || '系统提示：任何群、广告均为诈骗，违规者封号处理!' }}
            </marquee>
        </div>
        <van-overlay :show="showEmoji" @click="showEmoji = false">
            <Picker class="picker" :data="emojiIndex" set="twitter" @select="inputEmoji"/>
        </van-overlay>
        <div class="message-section" ref="element">
            <message-row
                :hideCome="hideCome"
                v-for="(tem,i) in chatList" :key="i" :msgCon="tem"
                @showPopup="showPopup"
            />
        </div>
        <div v-if="showLabel"
             class="tips text-center p-fixed flex align-center justify-center"
             @click="goToBottom"
        >
            <IconCom icon="down-arrow" :width="10" :height="6"/>
            <span class="font-12 m-l-5 text-color">有更多新的消息</span>
        </div>
        <div v-if="isLogin && speechs && speechs.length" class="quick-speech m-b-10 flex align-center  w-100 overflow-x-auto">
            <template
                v-for="speech in speechs"
            >
                <div class="item text-ellipsis m-r-10 font-12 text-center" :key="speech.id"
                    @click="quickSpeech(speech)"
                >
                   {{ speech.content }}
                </div>
            </template>
            <icon-png icon="chat/more" :width="17" :height="17" class="more" />
        </div>
        <div class="footer p-l-10 p-r-10 w-100">
            <input-message
                v-on:lock="option"
                v-on:hideCome="option"
                v-on:clear="option"
                v-on:getMsg=sendMessage
                :anchor_id="anchorInfo.member_id"
                :room_id="roomInfo.member_id"
                :isVirtual="isVirtual"
                @changeScreen="changeScreen"
                :showEmoji.sync="showEmoji"
            />
        </div>
        <van-popup
            v-model="showJumpUrl"
           position="bottom"
            closeable
           :style="{ height: '40%' }"
        >
            <div class="popup-body">
                <div class="header text-center font-16 text-white">
                    <span>互动弹幕</span>
                </div>
                <div class="content m-t-20 text-white m-b-20 font-14 p-t-10 p-b-10 p-l-30 p-r-30">
                    全天赛事精彩不断 看赛事直播上播球
                    <span class="w-100 d-inline-block text-center">{{ showPopupData.content && showPopupData.content.jump_url}}</span>
                </div>
                <div class="w-100 text-center">
                    <span
                        class="copy-link d-inline-block text-center text-color"
                        @click="goToLink">访问链接</span>
                </div>
            </div>
        </van-popup>
        <!-- 宝箱 -->
        <van-badge :content="tag"  class="treasure-box" v-if="!isVirtual">
            <img src="../../../assets/images/chat/treasure-box.png" alt="" @click="handlerTreasure">
            <div class="times">
                {{ currentTime ? currentTime : '00:00' }}
            </div>
        </van-badge>
        <!-- 宝箱弹窗 -->
        <van-popup v-model="showTreasure" position="bottom">
            <div class="gift-title">
                开宝箱
                <img src="../../../assets/images/chat/close.png" alt="" class="close" @click="showTreasure = false">
            </div>
            <van-divider :style="{ margin: '0 auto', borderColor: '#2F3568'}"/>
            <div class="gift-content">
                <TreasureItem v-for="item in treasureList" :key="item.id" :item="item" :currentTime="currentTime" @draw="handlerDraw" />
            </div>
        </van-popup>
        <!--  送礼物展示 -->
        <!-- 横幅礼物 -->
        <div id="giveGiftId"></div>
        <!-- 全屏礼物 -->
        <div id="fullScreenId"></div>
        <!-- 客服链接 -->
        <cs-link />
    </div>
</template>

<script>
import IconCom from '@/components/IconCom'
import InputMessage from '@/components/InputMessage'
import MessageRow from '@/views/Broadcast/components/MessageRow'
import { mapGetters, mapState } from 'vuex'
import { Popup, Toast, Badge, Divider, Overlay } from 'vant'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import data from 'emoji-mart-vue-fast/data/all.json'
import { removeSessionStorageItem, removeToken, getItem } from '@/utils/cookie'
import { getQuickSpeech, getTreasureList, openTreasure, drawTreasure } from '@/api/Host'
import { statusCode } from '@/utils/statusCode'
import TreasureItem from '@/components/treasureItem.vue'
import theShowGift from '@/utils/giftMsgBox'
import dayjs from 'dayjs'
import IconPng from '@/components/IconPng.vue'
import CsLink from '@/components/CsLink'
import { getAnnouncementList } from '@/api/common'

const include = ['smileys', 'people']
const emojiIndex = new EmojiIndex(data, { include })
export default {
    name: 'ChatRoom',
    components: {
        InputMessage,
        MessageRow,
        Picker,
        IconCom,
        [Toast.name]: Toast,
        [Popup.name]: Popup,
        [Badge.name]: Badge,
        [Divider.name]: Divider,
        [Overlay.name]: Overlay,
        TreasureItem,
        IconPng,
        CsLink
    },
    props: {
        roomInfo: {
            type: Object,
            default: () => ({})
        },
        anchorInfo: {
            type: Object,
            default: () => ({})
        },
        isVirtual: {
            type: Boolean,
            default: false
        },
        matchId: {
            type: [String, Number],
            default: ''
        }
    },
    data () {
        return {
            emojiOptions: {
                showPreview: false,
                showSkinTones: false,
                showSearch: false,
                showRecents: false,
                showEmoticons: false,
                showCategories: false,
                title: ''
            },
            showEmoji: false,
            emojiIndex: emojiIndex,
            hideCome: false,
            checkedLock: false,
            connectTime: null,
            countdown: 5, // 倒计时 5秒重连
            timer: null,
            isLeave: false,
            isConnect: false,
            announcement: '',
            webSocket: null,
            value: '600',
            chatList: [],
            speechs: [],
            showLabel: false,
            showJumpUrl: false,
            showPopupData: {},
            trumpet: require('@/assets/images/common/trumpet.png'),
            showTreasure: false, // 宝箱弹窗
            ShowGiveGiftList: {},
            treasureList: [],
            currentTime: null, // 当前计时宝箱的时间
            screenMsg: getItem('screenMsg') ? !!parseInt(getItem('screenMsg')) : false,
            screenGift: getItem('screenGift') ? !!parseInt(getItem('screenGift')) : false,
            giveGiftList: [], // 横屏礼物列表
            fullScreenItem: null, // 全屏礼物
            mequeList: [] // 跑马灯
        }
    },
    watch: {
        isConnect (newVal) {
            if (!newVal && !this.isLeave) { // 非主动断线
                this.reConnect()
            }
            if (newVal) { // 连接成功 清楚重连定时器
                clearInterval(this.connectTime)
            }
        }
    },
    computed: {
        ...mapState('user', ['nickname', 'token', 'avatar', 'member_id', 'signature']),
        ...mapGetters('user', ['isLogin']),
        tag () {
            return this.treasureList.filter(item => item.status === 2).length
        },
        apiParams () {
            return {
                pageNum: 1,
                pageSize: 20,
                type: 2, // 1全局， 2直播间
                device: 'H5'
            }
        }
    },
    created () {
        this.getSpeechList()
        // this.$bus.$on('callEmjio', val => {
        //     this.showEmoji = val
        // })
        this.getTreasureList()
    },
    mounted () {
        this.connectWebSocket()
        this.$refs.element.addEventListener('scroll', () => this.scrollChatList(true))
        this.goToBottom()
        // giftMsgBox.js 同步删除
        this.$bus.$on('showGiftList', (clear) => {
            if (this.giveGiftList && this.giveGiftList.length) {
                this.giveGiftList.find((item, index) => {
                    if (item && item.clear === clear) {
                        this.giveGiftList.splice(index, 1)
                    }
                })
            }
            if (this.fullScreenItem && this.fullScreenItem.clear === clear) { // 如果全屏的倒计时结束，则同步删除存储信息
                this.fullScreenItem = null
            }
        })
        this.getAnnouncementLists()
    },
    methods: {
        async getAnnouncementLists () {
            const { data } = await getAnnouncementList(this.apiParams)
            this.mequeList = data.list || []
        },
        quickSpeech (speech) {
            // 测试效果
            this.send('1040', speech.content)
        },
        goToBottom () {
            this.$refs.element.scrollTop = this.$refs.element.scrollHeight
            this.showLabel = false
        },
        async getSpeechList () {
            try {
                const { code, data } = await getQuickSpeech()
                if (code === statusCode.success) {
                    this.speechs = data.list || []
                }
            } catch (e) {
                console.log(e, '出错了')
            }
        },
        inputEmoji (emoji) {
            this.showEmoji = !this.showEmoji
            this.$bus.$emit('selectEmjio', emoji.native)
            // this.inpTxt = this.inpTxt + emoji.native
        },
        sendMessage (msg) {
            this.send('1040', msg)
        },
        option (type) { // 锁定 屏蔽进场 清屏 分享
            if (type.type === 'lock') {
                this.checkedLock = type.flag
            }
            if (type.type === 'hideCome') {
                this.hideCome = type.flag
            }
            if (type.type === 'clear') {
                this.chatList = []
            }
        },
        send (num, msg) {
            if (num === '1040') { // 发言
                const sendCon = {
                    msg,
                    device: 'H5',
                    type: num,
                    // room_id: this.$route.query.room_id,
                    room_id: this.isVirtual ? this.matchId * 1 : this.$route.query.room_id,
                    member_id: this.member_id,
                    nickname: this.nickname,
                    signature: this.signature
                }
                this.webSocket.send(JSON.stringify(sendCon))
            }
        },
        connectWebSocket () {
            const that = this
            // eslint-disable-next-line no-undef
            this.webSocket = new WebSocket(_requestWS)
            this.webSocket.onopen = function (e) {
                if (e.type === 'open') {
                    const sendCon = {
                        device: 'H5',
                        type: '1010',
                        // room_id: that.$route.query.room_id,
                        room_id: that.isVirtual ? that.matchId * 1 : that.$route.query.room_id,
                        nickname: that.nickname,
                        member_id: that.member_id,
                        signature: that.signature
                    }
                    console.log('---websocke已连接成功---')
                    that.isConnect = true
                    that.webSocket.send(JSON.stringify(sendCon))
                }
            }
            this.webSocket.onmessage = function (evt) {
                if (!evt.data.includes('type')) return
                const obj = JSON.parse(evt.data)
                let item = {}
                if (obj) {
                    switch (obj.type) {
                    case '1000': // 心跳检测
                    case '1010': // 用户进入直播间
                        // if (that.hideCome) return // 屏蔽进场
                        item = {
                            type: '1010',
                            msg: '进入直播间',
                            member_id: obj.member_id ? obj.member_id : null, // 会员
                            nickname: obj.nickname,
                            content: obj.content
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.wsMsgScroll(obj)
                            // if (that.checkedLock) {
                            //
                            // } else {
                            //     that.$refs.element.scrollTop = that.$refs.element.scrollHeight
                            // }
                        })
                        break
                    case '1040': // 普通发言
                        item = {
                            type: obj.type,
                            nickname: obj.nickname,
                            msg: obj.content.msg,
                            member_id: obj.member_id,
                            content: obj.content
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.wsMsgScroll(obj)
                        })
                        that.$bus.$emit('send', {
                            'id': 'hbzb',
                            'author': 'DIYgod',
                            'time': 0,
                            'text': item.msg,
                            'color': 16777215,
                            'type': 0
                        })
                        break
                    case '1090': // 1090主播关闭直播
                        item = {
                            type: '1090',
                            msg: '系统提示：主播已下播'
                        }
                        break
                    case '1072': // 被禁言
                        Toast('您已被禁言,请联系在线客服。')
                        break
                    case '1120': // 系统提示
                        item = {
                            type: '1120',
                            msg: obj.content.msg
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.wsMsgScroll(obj)
                        })
                        break
                    case '1210': // 系统提示
                        Toast(obj.content)
                        removeSessionStorageItem('userInfo')
                        removeToken()
                        setTimeout(() => {
                            // 刷新当前界面
                            window.location.reload()
                        }, 1500)
                        // that.openLoginDialog()
                        break
                    case '1310': // 关播提示
                        that.$bus.$emit('changeLiveStatus', { room_id: that.$route.query.room_id, status: 1 })
                        break
                    case '2010': // 信息發送頻繁
                        item = {
                            type: '2010',
                            msg: obj.content
                        }
                        break
                    case '1121':
                        item = { // 礼物赠送
                            type: '1121',
                            msg: `${obj.nickname} 送出 ${obj.gift_name}`,
                            label: obj.label,
                            img: obj.img ? obj.img : require('@/assets/logo.png')
                        }
                        // 礼物消息
                        if (!that.screenMsg) { // 不屏蔽礼物消息
                            that.chatList.push(item)
                            that.$nextTick(() => {
                                that.wsMsgScroll(obj)
                            })
                        }
                        // 横幅
                        if (!that.screenGift) {
                            obj.show = false // 滑动动效需要
                            obj.time = obj.duration * 1000 // 展示多长时间
                            obj.svgaId = Math.floor(Math.random() * 1000) // 渲染svga的id不能重复
                            obj.count = 1 // 统计连续赠送
                            // 创建横幅之前判断是否是：同一个会员送的同一个礼物，如果是 乘以n
                            const isEmpty = that.handlerManyGift(obj)
                            if (isEmpty) { // 无连击
                                // 创建礼物横幅
                                const res = theShowGift(obj, that.$bus)
                                // 处理展示礼物
                                that.handlerGiftRes(res, obj.gift_type)
                            }
                        }
                        break
                    default: // 1110主播回来
                        break
                    }
                }
            }
            // 关闭链接
            this.webSocket.onclose = function () {
                console.log('webScoket  已经断开')
                if (!this.isLeave) that.isConnect = false
            }
        },
        wsMsgScroll (obj) {
            if (obj.member_id === this.memberId) {
                // 需要滚动到最底下
                this.goToBottom()
            } else {
                this.scrollChatList()
            }
        },
        scrollChatList (notShowAgain = false) { // 获取消息后，判断是否需要展示 最新消息
            if (this.$refs.element.scrollHeight - 10 > this.$refs.element.scrollTop + this.$refs.element.offsetHeight) {
                if (!notShowAgain) { // 手动滑动时，不展示 更多消息
                    this.showLabel = true
                }
            } else {
                this.showLabel = false
            }
        },
        closeWs () {
            this.webSocket.close()
        },
        reConnect () { // 断线重连
            this.connectTime = setInterval(() => {
                this.connectWebSocket()
                console.log('断线重连')
            }, 5000)
        },
        showPopup (data) {
            this.showJumpUrl = true
            this.showPopupData = data
        },
        goToLink () {
            this.showJumpUrl = false
            window.open(this.showPopupData.content.jump_url, '_blank')
        },
        // 宝箱列表
        async getTreasureList () {
            const data = await getTreasureList()
            if (data.code === statusCode.success) {
                this.treasureList = data.data
                this.handlerTreasureTimes(data.data)
            } else {
                this.treasureList = []
            }
        },
        // 宝箱时间处理
        handlerTreasureTimes (data) {
            const item = data.find(i => i.status === 1)
            // 如果没有了就返回
            if (!item) return
            item.current = true
            this.handlerTimes(item.time, item.id)
        },
        // 时间处理
        handlerTimes (second, id) {
            const key = setInterval(() => {
                second--
                if (second <= 0) {
                    // 清楚当前定时器
                    clearInterval(key)
                    // 设置该宝箱状态为待领取
                    this.handlerOpen(id)
                }
                this.currentTime = dayjs(second * 1000).format('mm:ss')
            }, 1000)
        },
        // 倒计时结束修改宝箱状态为待领取
        async handlerOpen (id) {
            const data = await openTreasure(id)
            if (data.code === statusCode.success) {
                this.getTreasureList()
            } else {
                this.getTreasureList()
                Toast(data.msg)
            }
        },
        // 领取宝箱
        async handlerDraw (item) {
            const data = await drawTreasure(item.id)
            if (data.code === statusCode.success) {
                item.status = 3
                Toast.success(data.msg)
            } else {
                Toast(data.msg)
            }
        },
        // 宝箱弹窗
        handlerTreasure () {
            this.openDownloadDialog()
            // this.showTreasure = true
        },
        changeScreen (json) {
            if (json[0] === 'screenMsg') {
                this.screenMsg = json[1]
            } else if (json[0] === 'screenGift') {
                this.screenGift = json[1]
            }
        },
        // 礼物结果处理,横幅礼物最多3个，全屏最多1个
        handlerGiftRes (res, type) {
            if (type === 2) { // 横屏礼物
                // 最多可以存在3个
                this.giveGiftList.push(res)
                if (this.giveGiftList.length > 3) {
                    // 删除第一个
                    const first = this.giveGiftList.shift()
                    first.dom.remove()
                }
            } else if (type === 1) { // 全屏礼物
                this.fullScreenItem = res
            }
            res = null
        },
        // 多个礼物 乘n 来表示
        handlerManyGift (obj) {
            if (obj.gift_type === 2 && this.giveGiftList.length) { // 横幅礼物
                const item = this.giveGiftList.find((item) => {
                    return item.user_id === obj.member_id && item.gift_id === obj.gift_id
                })
                if (item) {
                    // 该礼物还在展示中，数量+1，重置关闭时间
                    item.count++
                    this.$bus.$emit(`up${item.svgaId}Count`, item.count) // 更新连击数
                    item.clear = item.timeStart(item.clear) // 重新定时
                    return false
                }
            } else if (obj.gift_type === 1 && this.fullScreenItem) { // 全屏礼物 非首张图片
                this.$bus.$emit(`stopSvgaPlayer${this.fullScreenItem.svgaId}`) // 通知svga组件，停止动画的播放
                this.fullScreenItem.dom.remove()
                clearTimeout(this.fullScreenItem.clear) // 清除定时
            }
            return true
        }
    },
    beforeDestroy () {
        clearInterval(this.connectTime)
        this.isLeave = true // 主动离开 不需重连
        this.closeWs()
        this.$refs.element.removeEventListener('scroll', () => this.scrollChatList(true))
    }

}
</script>

<style lang="scss" scoped>
    .quick-speech{
        width: 335px;
        padding: 0 0 0 10px;
        height: 22px;
        line-height: 22px;
        overflow-x: auto;
        flex-wrap: nowrap;
        position: relative;
        .item {
            flex-shrink: 0;
            // width: 80px;
            padding: 0 7px;
            height: 22px;
            border-radius: 3px;
            border: 1px solid #00E1FD;
            color: #00E1FD;
        }
        .more{
            position: fixed;
            left: 345px;
        }
    }
    .tips {
        width: 138px;
        height: 25px;
        line-height: 25px;
        background: #3DB1FB;
        border-radius: 13px;
        opacity: 0.8;
        left: 50%;
        transform: translateX(-50%);
        bottom: 80px;
    }
    .chat-box {
        display: flex;
        flex-direction: column;
        background-color: #2B1845;
        padding-bottom: 5px;
    }

    .add-host {
        width: 355px;
        height: 58px;

        .add-bg {
            background-image: url('../../../assets/images/host-bg.png');
            background-size: 100% 100%;
        }

        .user-name {
            .user-icon {
                width: 50px;
                height: 50px;
                margin-top: -20px;
                background-image: url('../../../assets/images/my/logo.png');
                background-size: 100% 100%;
            }

            .host {
                width: 44px;
                height: 16px;
                line-height: 16px;
                background-image: url('../../../assets/images/host-title-bg.png');
                background-size: 100% 100%;
                bottom: -5px;
                left: 2px;
            }
        }
    }

    .message-section {
        //height: calc(100% - 135px);
        overflow-y: scroll;
        flex: 1;
        margin-bottom: 10px;
    }

    .user-qq {
        width: 126px;
        height: 26px;
        line-height: 26px;
        background-image: url('../../../assets/images/qq-bg.png');
        background-size: 100% 100%;
    }

    .footer {
        height: 38px;
        left: 0;
        bottom: 0;
    }

    .popup-body{
        .header {
            height: 50px;
            line-height: 50px;
            font-weight: 500;
            border-bottom: 1px solid #2F3568;
        }
        .content {
            background-color: #30366A;
            width: 292px;
            margin: 0  auto;
            line-height: 22px;
        }
        .copy-link {
            width: 292px;
            height: 38px;
            line-height: 38px;
            background: #FBA187;
            border-radius: 19px;
            margin: 0  auto;
        }
    }
    .treasure-box{
        position: fixed;
        bottom: 120px;
        right: 10px;
        line-height: 10px;
        img{
            width: 60px;
            height: 60px;
        }
        .times{
            // width: 40px; // 0.8处理
            // height: 14px;
            width: 48px;
            height: 17px;
            line-height: 17px;
            background: #6C73AF;
            border-radius: 8px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            text-align: center;
            margin: 0 auto;
            transform: scale(0.83);
        }
    }
    .van-popup{
        height: 175px;
    }
    .van-divider{
        width: 342px;
    }
     .gift-title{
        height: 45px;
        line-height: 45px !important;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 22px;
        text-align: center;
        position: relative;
        .close{
            width: 23px;
            height: 23px;
            position: absolute;
            top: 12px;
            right: 15px;
        }
    }
    .gift-content{
        height: 125px;
        padding: 20px 15px 15px 15px;
        display: grid;
        grid-template-columns: repeat(7,1fr);
        overflow: hidden;
    }
    #giveGiftId{
        position: fixed;
        left: 10px;
        top: 354px;
        max-height: 255px;
        width: calc(375px - 20px);
        overflow-y: hidden;
        // transition: all 1s;
    }
    #fullScreenId{
        position: fixed;
        left: 0;
        top: 315px;
    }
    .announcement{
        width: 340px;
        height: 25px;
        background: #0E0E23;
        border-radius: 14px;
        margin: 0 auto;
        padding-left: 10px;
        .scroll{
            line-height: 25px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #6C73AF;
            margin-left: 10px;
            margin-right: 10px;
        }
    }
    .picker{
        z-index: 1;
    }
    ::v-deep {
        .van-popup {
            background-color: #2B1845;
        }
        .van-badge--fixed{
            top: 10px;
            right: 10px;
        }
        .van-overlay{
            background-color: rgba(0,0,0, 0.1);
        }
    }

</style>
