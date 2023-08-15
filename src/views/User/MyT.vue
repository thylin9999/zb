<template>
    <div class="box bg-center bg-no-repeat bg-size-100">
        <div class="header-user w-100 bg-no-repeat bg-center p-relative">
            <template v-if="token">
                <div class="icons w-100 flex flex-end p-r-15 p-t-10">
                    <icon-png
                        icon="my/message"
                        :width="25"
                        :height="25"
                        @click.native="openDownloadDialog"
                    />
                </div>
                <div class="p-l-30 p-relative m-t-5 p-r-20 user-row flex justify-between w-100" >
                    <div class="flex align-center w-100">
                        <div
                            class="logo bg-no-repeat bg-center"
                            :key="userLogo"
                            :style="{
                                backgroundImage: `url(${userLogo})`
                            }"
                        >
                        </div>
                        <div class="user-info overflow-hidden m-l-15 flex flex-column flex-end">
                            <div class="">
                                <span class="font-16 text-white font-500 font-medium" @click.prevent="login">{{ headerTitle.title }}</span>
                                <span
                                    class="gender-logo d-inline-block bg-no-repeat bg-size-cover bg-center"
                                    :style="{
                                        backgroundImage: `url(${genderLogo})`
                                    }"
                                ></span>
                            </div>
                            <LongText class="font-12 text-white description font-regular m-t-5 font-400 " :content="headerTitle.subTitle" />
                            <div class="follows m-t-5 font-14 font-500 text-white">
                                <span class="m-r-15">粉丝：<span class="bg-white">{{ fans_count }}</span></span>
                                <span class="m-l-15">关注：<span class="bg-white">{{ follow_count }}</span></span>
                            </div>
                        </div>
                    </div>
                    <div class="personal-center text-center p-absolute font-12 font-500 text-white"
                        @click="goToDetail"
                    >
                        个人中心
                    </div>
                </div>
                <div class="btns m-t-15 flex alignc-center justify-center">
                    <span class="host bg-center bg-no-repeat bg-size-100 d-inline-block"
                        :class="{
                            'not-host': !isAnchor
                        }"
                        @click="applyHost"
                    ></span>
                    <span class="expert bg-center bg-no-repeat bg-size-100 d-inline-block"
                        :class="{
                            'not-expert': !isExpert
                        }"
                        @click="applyExpert"
                    ></span>
                </div>
            </template>
            <div v-else class="flex p-t-20 p-b-20 align-center text-white flex-column">
                <span class="font-16 font-500">登录播球</span>
                <span class="font-14 m-t-5 font-400">注册体验更多功能</span>
                <span class="login m-t-10 font-12 font-500" @click="login">登录 / 注册</span>
            </div>
        </div>
        <div class="content">
            <!-- 活动banner 暂时隐藏 -->
            <!-- <div
                class="new-my-service p-t-10 p-l-15 p-r-15 bg-size-100 bg-no-repeat bg-center"
                @click="clickBanner(banners[0])"
                :style="{
                        backgroundImage: `url(${bannerUlr})`
                    }"
            >
            </div> -->
            <div class="wallet">
                <div class="flex justify-between align-center">
                    <p class="font-14">我的钱包</p>
                    <p class="top-up" @click="openDownloadDialog()">充值</p>
                </div>
                <div class="flex justify-around m-t-5 align-center">
                    <p class="line">
                        <icon-png icon="my/coin" :width="25" :height="25"/>
                        <span class="money">{{ball_coin | floor}}</span>
                        <span class="type">球币</span>
                    </p>
                    <p class="line">
                        <icon-png icon="my/ticket" :width="25" :height="25"/>
                        <span class="money">{{ ball_ticket | floor }}</span>
                        <span class="type">球票</span>
                    </p>
                </div>
            </div>
            <div class="task">
                <div>
                    <icon-png icon="my/task" :width="20" :height="20" />
                    <span class="task-center">任务中心</span>
                </div>
                <div @click="openDownloadDialog()">
                    <span class="task-ticked">做任务领球票</span>
                    <icon-png icon="my/right" :width="6" :height="12" />
                </div>
            </div>
            <div class="setting-list p-b-30 p-t-20 p-l-10 p-r-10 text-white bg-center bg-no-repeat bg-size-100">
                <p class="font-14 p-l-15 font-w-800">我的服务</p>
                <div class="my-service p-b-20 p-t-15 p-l-20 p-r-20 justify-between flex align-center">
                    <div class="item  flex flex-column align-center"
                        v-for="item in services"
                        :key="item.id"
                        @click="goToPage(item)"
                    >
                        <icon-png
                            :icon="item.icon"
                            :width="item.width"
                            :height="item.height"
                        />
                        <span class="font-10 font-600 text-white m-t-5">{{  item.title  }}</span>
                    </div>
                </div>
                <p class="font-14 m-t-15 p-l-15 font-w-800">常用功能</p>
                <div class="common p-b-20 p-t-15 p-l-20 p-r-20 justify-between flex align-center">
                    <div class="item  flex flex-column align-center"
                        v-for="item in commons"
                        :key="item.id"
                        @click="goToPage(item)"
                    >
                        <icon-png
                            :icon="item.icon"
                            :width="item.width"
                            :height="item.height"
                        />
                        <span class="font-10 font-600 text-white  m-t-5">{{  item.title  }}</span>
                    </div>
                    <div class="item visibility-hidden">
                        <span>占位用</span>
                    </div>
                    <div class="item visibility-hidden">
                        <span>占位用</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import IconPng from '@/components/IconPng'
import { Icon, Cell } from 'vant'
import { Copy } from '@/utils/utils'
import { getBanners } from '@/api/common'
import { statusCode } from '@/utils/statusCode'
import LongText from '@/components/LongText'
export default {
    components: {
        IconPng,
        [Icon.name]: Icon,
        [Cell.name]: Cell,
        LongText
    },
    filters: {
        floor (value) {
            return Math.floor(value)
        }
    },
    data () {
        return {
            services: [
                {
                    id: 1,
                    title: '我的关注',
                    height: 30,
                    width: 34,
                    icon: 'my/favorite',
                    key: 'SubscribeHost',
                    requireToken: true
                },
                {
                    id: 2,
                    title: '密码管理',
                    height: 34,
                    width: 38,
                    icon: 'my/password',
                    key: 'UpdatePassword',
                    requireToken: true
                },
                {
                    id: 3,
                    title: '手机管理',
                    height: 34,
                    width: 38,
                    icon: 'my/phone',
                    key: 'UpdatePhone',
                    requireToken: true
                },
                {
                    id: 4,
                    title: '我的有料',
                    height: 34,
                    width: 38,
                    icon: 'my/guide',
                    key: 'Guid',
                    showDownload: true
                }
            ],
            commons: [
                {
                    id: 1,
                    title: '关于我们',
                    height: 30,
                    width: 30,
                    icon: 'my/about',
                    key: 'AboutIndex'
                },
                // {
                //     id: 2,
                //     title: '意见反馈',
                //     key: 'Feedback',
                //     icon: 'my/feedback',
                //     height: 30,
                //     width: 30
                // },
                {
                    id: 3,
                    title: '系统设置',
                    key: 'Settings',
                    icon: 'my/system-setting',
                    requireToken: true,
                    height: 30,
                    width: 30
                }
            ],
            banners: []
        }
    },
    computed: {
        ...mapState('user', ['token', 'gender', 'nickname', 'sign', 'avatar', 'member_id', 'is_anchor', 'is_expert', 'follow_count', 'fans_count', 'ball_coin', 'ball_ticket']),
        userLogo () {
            return this.avatar ? this.avatar : this.userEmptyImg
        },
        genderLogo () {
            return this.gender === 1
                ? require('../../assets/images/my/female.png')
                : (this.gender === 2 ? require('../../assets/images/my/male.png') : '')
        },
        bannerUlr () {
            return this.banners && this.banners.length && this.banners[0].pic_url
        },
        headerTitle () {
            return {
                title: this.token ? this.nickname : '登录/注册',
                subTitle: this.token ? this.sign : '注册体验更多功能'
            }
        },
        isAnchor () {
            return this.is_anchor === 2
        },
        isExpert () {
            return this.is_expert === 1
        }
    },
    created () {
        this.getBanners()
    },
    methods: {
        async getBanners () {
            try {
                const { data, code } = await getBanners(2) // 轮盘活动
                if (code === statusCode.success) {
                    this.banners = data && data.reduce((all, item) => {
                        all.push({
                            ...item
                        })
                        return all
                    }, [])
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        clickBanner (item) {
            if (item.type === 1) { // 1，无， 2.内跳，3.外跳
                return
            }
            if (item.type === 2) {
                this.$router.push(item.links)
            }
            if (item.type === 3) { // 手机版都是直接跳转，不带token，引导 下载app
                // const url = item.links + `?token=${this.token}`
                const url = item.links
                window.open(url, 'blank')
            }
        },
        login () {
            if (!this.token) {
                this.$router.push({
                    name: 'Login',
                    query: {
                        redirect: this.$route.fullPath
                    }
                })
            }
        },
        enjoyService (item, needLogin) {
            const customKeys = ['onlineService', 'feedback']
            if (customKeys.includes(item.key)) {
                this.queryCustom()
            } else if (item.key === 'share') {
                // 分享链接
                const { origin } = window.location
                Copy(origin)
            } else {
                if (needLogin && !this.token) {
                    this.$router.push({
                        name: 'Login'
                    })
                    return
                }
                this.$router.push({
                    name: item.key
                })
            }
        },
        goToDetail () {
            if (this.token) {
                // 做点什么
                this.$router.push({
                    name: 'UpdateUserInfo'
                })
            }
        },
        goToPage (item) {
            if (item.requireToken && !this.token) {
                // this.$store.commit('commonData/SET', {
                //     loginDialogUrl: this.$route.fullPath
                // })
                // this.openLoginDialog()
                this.goToLogin(this.$route.fullPath) // 直接跳登陆页面，不再提示
            } else {
                if (item.showDownload) {
                    this.openDownloadDialog()
                } else {
                    this.$router.push({
                        name: item.key
                    })
                }
            }
        },
        goToSettings () {
            if (!this.token) {
                this.$router.push({
                    name: 'Login'
                })
                return
            }
            this.$router.push({
                name: 'Settings'
            })
        },
        applyHost () {
            //
            if (this.isAnchor) {
                this.openDownloadDialog()
                return
            }
            this.$router.push({
                name: 'ApplyHost'
            })
        },
        applyExpert () {
            if (this.isExpert) {
                this.openDownloadDialog()
                return
            }
            this.$router.push({
                name: 'ApplyExpert'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.box {
    background-color: #fcf9fc;
    // 头部54 底部65
    min-height: calc(100vh - 119px);
    background-image: url('../../assets/images/my/page-bg.png');
}
.setting-button{
    top: 5px;
    right: 15px;
}
.header-user {
    .logo {
        width: 70px;
        height: 70px;
        left: 35px;
        bottom: 85px;
        border-radius: 5px;
        background-size: cover;
    }
    .user-row{
        padding-top: 20px;
        align-items: flex-end;
        .personal-center{
            right: 0;
            top: 40px;
            width: 75px;
            height: 24px;
            line-height: 24px;
            background: #161C4F;
            border-radius: 16px 0px 0px 16px;
        }
    }
    .user-info{
        width: calc(100% - 85px);
        height: 65px;
        .description{
            line-height: 17px;
            height: 17px;
        }
        .gender-logo {
            width: 12px;
            height: 12px;
        }
        .follows{
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 17px;
            background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
    .banner{
        width: 345px;
        height: 130px;
        left: 15px;
        bottom: -50px;
        background-size: 100% 100%;
    }
    .row {
        height: 66.5px;
    }
    .btns{
        span {
            width: 175px;
            height: 45px;
        }
        .host {
            background-image: url('../../assets/images/my/host.png');
            &.not-host {
                background-image: url('../../assets/images/my/apply-host.png');
            }
        }
        .expert {
            background-image: url('../../assets/images/my/expert.png');
            &.not-expert {
                background-image: url('../../assets/images/my/apply-expert.png');
            }
        }
    }
    .login {
        width: 160px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #FBA187;
        border-radius: 15px;
    }
}
.service-item {
    .icon-div {
        height: 32px;
        line-height: 32px;
    }
}
.content {
    height: calc(100% - 286px);
    // overflow-y: auto;
    padding-bottom: 10px;
    .card-item {
        width: 345px;
        margin: 0 auto;
        box-shadow: 0px 0px 7px 0px rgba(0,0,0,0.0500);
        border-radius: 3px;
        .item {
            width: 20%;
        }
    }
}
.new-my-service {
    width: 345px;
    height: 115px;
    background-color: #fff;
    box-shadow: 0px 0px 7px 0px rgba(0,0,0,0.05);
    border-radius: 5px;
    margin: 0  auto;
}
.setting-list {
    width: 360px;
    height: 330px;
    margin: 0 auto;
    box-shadow: 0px 0px 7px 0px rgba(0,0,0,0.05);
    background-image: url('../../assets/images/my/service-bg.png');
    border-radius: 10px;
    .my-service {
        border-bottom: 1px solid #6C73AF;
    }
}
.wallet{
    background: url('../../assets/images/my/wallet-bg.png') no-repeat;
    background-size: 100% 100%;
    width: 361px;
    height: 94px;
    margin: 0 auto;
    color: #ffffff;
    padding: 14px 30px 0 30px;
    .top-up{
        background: url('../../assets/images/my/top-up-bg.png') no-repeat;
        background-size: 100% 100%;
        width: 56px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        font-size: 10px;
    }
    .line{
        display: flex;
        align-items: center;
        .money,.type{
            font-size: 20px;
            font-family: adineuePRO-Bold, adineuePRO;
            font-weight: bold;
            color: #FFFFFF;
            background: linear-gradient(180deg, #FEF4E6 0%, #E2A87D 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .money{
            margin-left: 3px;
        }
        .type{
            font-size: 12px;
            font-weight: 600;
            margin-left: 2px;
            margin-bottom: -5px;
        }
    }
}
.task{
    background: url('../../assets/images/my/task-bg.png');
    background-size: 100% 100%;
    width: 361px;
    height: 74px;
    margin: 0 auto;
    display: flex;
    padding: 0 30px;
    align-items: center;
    justify-content: space-between;
    font-family: PingFang-SC-Heavy, PingFang-SC;
    div{
        display: flex;
        align-items: center;
    }
    .task-center{
        font-size: 14px;
        font-weight: 800;
        color: #FFFFFF;
        margin-left:3px;
    }
    .task-ticked{
        font-size: 12px;
        font-weight: 400;
        color: #6C73AF;
        margin-right: 3px;
    }
}
.font-10{
    font-size: 12px;
    transform: scale(0.83);
}
.bg-white{
    background: #ffffff;
    -webkit-background-clip: text;
}
.font-w-800{
    font-weight: 800;
}
::v-deep {
    .fixed-header {
        .header {
            margin-top: 0!important;
        }
    }
}
</style>
