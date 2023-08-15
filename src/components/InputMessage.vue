<template>
    <div class="flex align-center">
        <!-- 屏蔽按钮 -->
        <van-popover v-model="showScreen" trigger="click" placement='top-start' v-if="!isVirtual">
            <div class="screen-box" >
                <van-checkbox icon-size="15px" v-model="screenMsg" class="ft12" checked-color="#FBA187"  @change="handlerScreen('screenMsg')">屏蔽礼物消息</van-checkbox>
                <van-checkbox icon-size="15px" v-model="screenGift" class="ft12" checked-color="#FBA187"  @change="handlerScreen('screenGift')">屏蔽礼物特效</van-checkbox>
            </div>
            <template #reference>
                <img src="../assets/images/chat/screen.png" alt="" class="screen">
            </template>
        </van-popover>
        <div class="box w-100 flex justify-between align-center">
            <div class="input-with-send flex align-center flex-1 p-r-5">
                <van-field @blur="checkValue" maxlength="30" :disabled="!isLogin" class="p-l-15 p-r-5" clearable v-model="newMessage"
                        :placeholder="isLogin ? '和大家聊聊...': ''"/>
                <img @click.stop="callEmjio" class="emjio" :src="require('@/assets/icons/emjio.png')" alt="">
                <van-button mini type="info" @click="sendMesage">发送</van-button>
                <!-- <div class="control_box">
                    <img @click="showControl = !showControl" class="control"
                        :src="require('@/assets/images/icons/control.png')" alt="">
                    <div class="control_list" v-if="showControl">
                        <ul class="list">
                            <li @click="option('lock')">
                                <van-checkbox icon-size="15px" v-model="checkedLock">锁定聊天窗口</van-checkbox>
                            </li>
                            <li @click="option('hideCome')">
                                <van-checkbox icon-size="15px" v-model="hideCome">屏蔽进场特效</van-checkbox>
                            </li>
                            <li @click="option('clear')">
                                <img class="icon" :src="require('@/assets/icons/clear.png')" alt="">
                                <span>清屏</span>
                            </li>
                            <li @click="option('copy')">
                                <img class="icon" :src="require('@/assets/icons/share.png')" alt="">
                                <span>分享</span>
                            </li>
                        </ul>
                    </div>
                </div> -->
                <div class="noLogin" v-if="!isLogin">
                    <span class="login text-white" @click="login">登录</span>
                    <span class="txt">发弹幕，参与主播互动</span>
                </div>
            </div>
        </div>
        <!-- 礼物按钮 -->
        <img src="../assets/images/chat/gift.png" alt="" class="gift" @click="gift" v-if="!isVirtual">
        <!-- 礼物弹窗 -->
        <van-popup v-model="showGift" position="bottom">
            <div class="gift-title">
                礼物
                <img src="../assets/images/chat/close.png" alt="" class="close" @click="showGift = false">
            </div>
            <van-divider :style="{ margin: '0 auto', borderColor: '#2F3568'}"/>
            <div class="gift-content">
                <GiftItem :list="giftList" :item.sync="item" />
            </div>
            <van-divider :style="{ margin: '0 auto', borderColor: '#2F3568'}"/>
            <div class="gift-footer">
                <div class="f-left flex">
                    <div class="coin">
                        <img src="../assets/images/chat/qiubi.png" alt="" class="qiubi-icon">
                        <span>球币：</span>
                        <span>{{ball_coin}}</span>
                    </div>
                    <div class="coin">
                        <img src="../assets/images/chat/qiupiao.png" alt="" class="qiupiao-icon">
                        <span>球票：</span>
                        <span>{{ ball_ticket }}</span>
                    </div>
                </div>
                <div class="give-btn" @click="handlerGive">赠送</div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Field, Button, Toast, Checkbox, Popover, Popup, Divider } from 'vant'
import { mapGetters, mapState } from 'vuex'
import { Copy } from '@/utils/utils'
import { inputBlur } from '@/utils/validator'
import { getToken, getItem, setItem } from '@/utils/cookie'
import GiftItem from './giftItem.vue'
import { getGiftList, giveGift } from '@/api/Host'
import { statusCode } from '@/utils/statusCode'
import { throttle } from '@/utils/lodashUtils'

export default {
    name: 'InputMessage',
    props: {
        room_id: {
            type: [String, Number],
            default: ''
        },
        anchor_id: {
            type: [String, Number],
            default: ''
        },
        isVirtual: {
            type: Boolean,
            default: false
        },
        showEmoji: {
            type: Boolean,
            default: false
        }
    },
    components: {
        [Field.name]: Field,
        [Button.name]: Button,
        [Checkbox.name]: Checkbox,
        [Popover.name]: Popover,
        [Popup.name]: Popup,
        [Divider.name]: Divider,
        GiftItem
    },
    data () {
        return {
            showControl: false,
            newMessage: '',
            checkedLock: false,
            hideCome: false,
            showScreen: false, // 屏蔽弹窗
            screenMsg: getItem('screenMsg') ? !!parseInt(getItem('screenMsg')) : false, // 礼物消息屏蔽
            screenGift: getItem('screenGift') ? !!parseInt(getItem('screenGift')) : false, // 礼物特效屏蔽
            showGift: false, // 礼物弹窗
            giftList: [],
            item: {} // 赠送的礼物
        }
    },
    computed: {
        ...mapGetters('user', ['isLogin']),
        ...mapState('user', ['ball_coin', 'ball_ticket']),
        pathUrl () {
            return this.$route.fullPath
        }
    },
    created () {
        this.$bus.$on('selectEmjio', val => {
            this.newMessage += val
            console.log(123)
        })
        this.getGiftLists()
    },
    methods: {
        login () {
            this.$store.commit('commonData/SET', {
                loginDialogUrl: this.pathUrl
            })
            // this.openLoginDialog()
            this.goToLogin()
        },
        callEmjio () {
            if (!getToken()) {
                this.$store.commit('commonData/SET', {
                    loginDialogUrl: this.pathUrl
                })
                // this.openLoginDialog()
                this.goToLogin()
                return
            }
            // this.showEmoji = !this.showEmoji
            // this.$bus.$emit('callEmjio', this.showEmoji)
            this.$emit('update:showEmoji', !this.showEmoji)
        },
        checkValue () {
            inputBlur()
            this.$emit('checkValue')
        },
        option (type) { // 锁定 屏蔽进场 清屏 分享
            if (type === 'lock') {
                this.checkedLock = !this.checkedLock
                this.$emit('lock', { type: 'lock', flag: this.checkedLock })
            }
            if (type === 'clear') {
                this.$emit('clear', { type: 'clear' })
            }
            if (type === 'hideCome') {
                this.hideCome = !this.hideCome
                this.$emit('hideCome', { type: 'hideCome', flag: this.hideCome })
            }
            if (type === 'copy') {
                Copy(window.location.href)
            }
        },
        sendMesage () {
            if (!this.newMessage.trim().length) return
            if (!this.isLogin) {
                Toast('请先登录')
            } else {
                this.$emit('getMsg', this.newMessage)
                this.newMessage = ''
            }
        },
        // 获取礼物列表
        async getGiftLists () {
            const data = await getGiftList()
            if (data.code === statusCode.success) {
                this.giftList = data.data
            } else {
                this.giftList = []
            }
        },
        // 展示礼物
        gift () {
            this.openDownloadDialog()
            // this.showGift = !this.showGift
        },
        // 送礼物
        handlerGive: throttle(async function () {
            if (!this.isLogin) {
                this.openLoginDialog()
                return
            }
            if ((this.item.sales_type === 1 && this.item.amount <= this.ball_coin) || (this.item.sales_type === 2 && this.item.amount <= this.ball_ticket)) {
                const jsonData = {
                    gift_id: this.item.id,
                    anchor_id: this.room_id,
                    room_id: this.room_id
                }
                const data = await giveGift(jsonData)
                if (data.code === statusCode.success) {
                    // 赠送成功,处理礼物展示效果
                    // Toast('赠送成功')
                } else {
                    Toast(data.msg)
                }
            }
        }, 1000),
        handlerScreen (key) {
            console.log(this.screenMsg)
            console.log(this.screenGift)
            key === 'screenMsg' ? setItem(key, this.screenMsg ? 1 : 0) : setItem(key, this.screenGift ? 1 : 0)
            this.$emit('changeScreen', [key, key === 'screenMsg' ? this.screenMsg : this.screenGift])
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/theme/default-vars.scss';
    .screen{
        width: 25px;
        height: 25px;
        margin-right: 4px;
    }
    .gift{
        width: 25px;
        height: 25px;
        margin-left: 4px;
    }
    .box {
        background-color: #30366A;
        height: 38px;
        border-radius: 4px;
    }

    .emjio{
        width: 25px;
        height: 25px;
        margin-right: 8px;
    }

    .van-button {
        line-height: 30px;
        height: 30px;
        font-size: 14px;
        font-family: PingFang-SC-Regular;
        padding: 0;
        width: 50px;
        text-align: center;
        border-radius: 3px;
        background: $active-color;
    }

    .control_box {
        position: relative;

        .control {
            width: 20px;
            margin-left: 10px;
        }

        .control_list {
            position: absolute;
            right: -14px;
            bottom: 20px;
            width: 126px;
            height: 152px;
            background: url("../assets/images/chat/controlbox.png") no-repeat;
            background-size: 100% 100%;

            .list {
                padding: 10px 10px;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                font-size: 12px;
                color: #B7B7B7;

                .icon {
                    width: 14px;
                    vertical-align: bottom;
                    margin-right: 5px;
                }

                li:active {
                    opacity: .5;
                }
            }
        }
    }

    .noLogin {
        position: absolute;
        padding-left: 12px;
        font-size: 12px;
        color: #2B1845;
    }

    ::v-deep {
        .van-cell {
            background-color: transparent;
            line-height: 24px;
            padding: 0;
            font-family: PingFang-SC-Regular;
            font-size: 14px;
        }
        .van-field__control {
            color: #fff!important;
        }
        .van-button {
            font-size: 14px;
            font-weight: 400;
            background-color: #00E1FD;
            color: #2B1845;
        }
        .van-popover__arrow{
            color: #30366A !important;
        }
        .van-checkbox__label{
            font-weight: 400;
            color: #ffffff;
        }
        .van-field__clear {
            margin-right: 10px;
            padding-right: 0;
        }
    }
    .screen-pop{
        background: #30366A;
    }
    .screen-box{
        width: 128px;
        height: 90px;
        background: #30366A;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: center;
        padding: 5px 0;
    }
    .ft12{
        font-size: 12px;
        margin: 0 auto;
    }
    .van-popup{
        height: 342px;
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
        .gifts{
            height: 228px;
            padding: 15px 15px 0 15px;
            display: grid;
            grid-template-columns: repeat(5,1fr);
            overflow: auto;
        }
    }
    .gift-footer{
        color: #ffffff;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        padding: 15px 15px 0;
        .coin{
            display: flex;
            align-items: center;
            margin-right: 30px;
            height: 30px;
            line-height: 30px;
        }
        .qiubi-icon, .qiupiao-icon{
            width: 15px;
            height: 15px;
            margin-right: 3px;
        }
        .give-btn{
            width: 70px;
            height: 30px;
            line-height: 30px;
            background: #FBA187;
            border-radius: 15px;
            text-align: center;
        }
    }
</style>

<style>
    .van-popover--light .van-popover__arrow{
        color: #30366A;
    }
    .van-popover--light .van-popover__content{
        background: #30366A;
    }
</style>
