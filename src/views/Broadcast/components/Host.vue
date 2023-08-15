<template>
    <div class="h-100 overflow-y-auto main-wrapper" v-if="anchorInfo">
        <div class="host-header m-t-15 m-b-10 flex justify-betwwen font-regular align-center m-l-10 m-r-10">
            <div class="user-info flex align-center">
                <div
                    class="user-icon bg-size-cover bg-center bg-no-repeat border-50"
                    :style="{
                           backgroundImage: `url(${userLogo})`
                    }"
                ></div>
                <div class="user-name  flex flex-column m-l-5">
                    <span class="font-14 text-white font-500 font-medium">{{ anchorInfo.anchor_name }}</span>
                    <span class="font-12 sign text-primary font-400 ">{{  anchorInfo.sign }}</span>
                </div>
            </div>
            <div class="right-button">
                <div class="flex flex-column flex-end m-l-5">
                    <span class="font-14 visibility-hidden">占位</span>
                    <div class="collect-info flex  align-center">
                        <span class="font-12 text-primary font-400">粉丝</span>
                        <span class="font-12 text-white m-l-5 font-400 font-regular">{{ anchorInfo.follow }}</span>
                    </div>
                </div>
<!--                <span-->
<!--                    class="font-12 font-400 m-t-5 subscribe-button text-color d-inline-block text-center"-->
<!--                    :class="{-->
<!--                        'is-subscribed': is_follow !== 0-->
<!--                    }"-->
<!--                    @click="subscription"> {{ is_follow == 0 ? '订阅' : '已订阅' }} </span>-->
            </div>
        </div>
        <div class="live-list-wrapper m-t-10 m-l-10 m-r-10">
            <template
                v-for="item in list"
            >
                <MatchCard
                    :key="item.id"
                    @updateList="fetchData"
                    :match-info="item" />
            </template>
        </div>
        <!-- 联系主播 -->
        <div class="link" v-if="showLink" @click="show = true">
            <i @click.stop="showLink = false" />
        </div>
        <van-popup v-model="show" closeable close-icon="close" position="bottom" class="pop-content" >
            <div class="pop-title">
                主播联系方式
            </div>
            <div class="qrcode">
                <van-image width="100" height="100" :src="this.roomInfo.qrcode"
            />
            </div>
            <div class="common-line qq">
                <span>QQ：<span  ref="qq">{{ this.roomInfo.qq }}</span></span>
                <button @click="copy('qq')">复制</button>
            </div>
            <div class="common-line wechat">
                <span>微信：<span ref="wechat">{{this.roomInfo.wechat}}</span></span>
                <button @click="copy('wechat')">复制</button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Icon, Toast, Popup, Image } from 'vant'
import { subscribeHost } from '@/api/competition'
import { getAnchorMatches } from '@/api/Host'
import { mapGetters, mapState } from 'vuex'
// import IconPng from '@/components/IconPng'
import { statusCode } from '@/utils/statusCode'
import MatchCard from '@/views/Broadcast/components/MatchCard'
import { Copy } from '@/utils/utils'
export default {
    props: {
        anchorInfo: {
            type: Object,
            default: function () {
                return {}
            }
        },
        roomInfo: {
            type: Object,
            default: () => [{}]
        }
    },
    name: 'Host',
    components: {
        [Icon.name]: Icon,
        MatchCard,
        [Popup.name]: Popup,
        [Image.name]: Image
    },
    data () {
        return {
            is_follow: 0,
            list: [],
            roomId: null,
            updateKey: +new Date().getTime(),
            showLink: this.roomInfo.wechat || this.roomInfo.qq || this.roomInfo.qrcode,
            show: false
        }
    },
    computed: {
        ...mapState('user', ['nickname', 'token', 'avatar']),
        ...mapGetters('user', ['isLogin']),
        apiParams () {
            return {
                sportId: this.sportTabId,
                subId: this.subTabId
            }
        },
        userLogo () {
            return this.anchorInfo.logo ? this.anchorInfo.logo : require('../../../assets/images/my/user-empty.png')
        }
    },
    watch: {
        anchorInfo: {
            handler () {
                if (this.anchorInfo) {
                    this.is_follow = this.anchorInfo.is_follow
                }
            },
            immediate: true,
            deep: true
        }
    },
    created () {
        this.roomId = this.$route.query.room_id
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                const { data, code } = await getAnchorMatches({
                    roomId: this.roomId
                })
                if (code === statusCode.success) {
                    if (data.list) {
                        this.list = data.list || []
                    }
                }
            } catch (e) {
                console.log('出错了。。。')
            } finally {
            }
        },
        async subscription () {
            if (!this.token) {
                this.$store.commit('commonData/SET', {
                    loginDialogUrl: this.$route.fullPath
                })
                this.openLoginDialog()
            } else {
                try {
                    const { code, msg } = await subscribeHost({ anchor_id: this.anchorInfo.member_id })
                    if (code === 200) {
                        this.is_follow = this.is_follow ? 0 : 1
                    }
                    Toast(msg)
                } catch (e) {
                    console.log('出错了')
                }
            }
        },
        copy (type) {
            Copy(this.$refs[type].textContent)
        }
    }
}
</script>

<style lang="scss" scoped>
.m-r-5{
    margin-right: 5px;
}
.main-wrapper{
    .live-list-wrapper{
        border-radius: 3px;
    }
}
.host-header{
    border-left: 2px solid #6C73AF;
    background-color: #2B1845;
    padding: 12px 10px;
    .user-name{
        width: 200px;
        .sign {
            line-height: 17px;
        }
    }
    .user-icon {
        width: 35px;
        height: 35px;
    }

    .right-button {
        width: 60px;
        span{
            display: block;
        }
        .collect-info{
            min-width: 80px;
        }
        .subscribe-button{
            width: 60px;
            height: 24px;
            background-color: #4164FF;
            border-radius: 15px;
            line-height: 24px;
            &.is-subscribed {
                border: 1px solid #939393;
                background-color: transparent;
                font-weight: 300;
                color: #939393;
            }
        }
    }
}
.link{
    position: fixed;
    background: url('../../../assets/images/live/link.gif') no-repeat;
    background-size:100% 100%;
    width: 75px;
    height: 75px;
    right: 20px;
    i{
        position: absolute;
        top: 0;
        right: -10px;
        background: url('../../../assets/images/live/close.png') no-repeat;
        background-size:100% 100%;
        width: 15px;
        height: 15px;
    }
}
.pop-content{
    width: 375px;
    height: 353px;
    background: #2B1845;
    border-radius: 5px 5px 0px 0px;
    .pop-title{
        width: 342px;
        height: 47px;
        line-height: 47px;
        text-align: center;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        margin: auto;
        position: relative;
        &::before{
            content: '';
            background: #2F3568;
            position: absolute;
            bottom: 0;
            left: -171px;
            width: 200%;
            height: 1px;
            transform: scale(0.5);
        }
    }
    .qrcode{
        width: 144px;
        height: 144px;
        background: #30366A;
        margin: 20px auto;
    }
    .common-line{
        width: 347px;
        height: 44px;
        line-height: 44px;
        background: #30366A;
        border-radius: 24px;
        margin: 0 auto 10px;
        color: #ffffff;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        padding: 0 5px 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        button{
            width: 70px;
            height: 34px;
            background: #FBA187;
            border-radius: 17px;
            border: none;
            color: #ffffff;
        }
    }
}

::v-deep{
    .van-icon:before{
        color:#6C73AF;
    }
    .van-image__img{
        width: 144px;
        height: 144px;
    }
}

</style>
