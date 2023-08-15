<template>
    <div class="card text-white font-12 p-t-5">
        <div class="header p-b-5  flex font-500 font-medium justify-between align-center p-r-5">
            <div class="left-title p-l-5 flex align-center  bg-no-repeat bg-center bg-size-cover">
                <img :src="matchIcon" alt="">
                <span class="font-12 m-l-5 font-500 font-medium text-white">{{ match.leagueChsShort }}</span>
            </div>
            <div class="time">
                <div v-if="showLiveButton"
                     class="flex align-center"
                     @click="liveRoomButton"
                >
                   <span class="live-icon"></span>
                    <div class="live-broad-icon bg-no-repeat" >
                        <span class="button d-inline-block">进入直播间</span>
                    </div>
                </div>
                <span
                    v-else
                    class=" font-12 time-span d-inline-block scale-9 font-regular"
                    :class="{'text-white': match.isSubscribe, 'pointer': !match.isSubscribe }"
                >{{
                    isGoing ? giveMatchStatus : matchTime
                }}</span>
            </div>
        </div>
        <div class="footer-buttons p-l-10 p-r-10 p-t-10 p-b-15 flex align-center">
            <div class="flex flex-1 flex-column justify-between">
                <div class="row flex justify-between align-center">
                    <div class="left-info flex align-center">
                <span
                    class="icon d-inline-block border-50 bg-center bg-no-repeat bg-size-100"
                    :style="{
                        backgroundImage: `url(${homeLogo})`
                    }"
                ></span>
                        <span class="m-l-5 text-white font-regular scale-9 team-name text-ellipsis">{{ match.homeChs }}</span>
                    </div>
                    <span v-if="!isFuture" class="font-12 scale-9 font-600">{{ match.homeScore }}</span>
                </div>
                <div class="row m-t-10 flex justify-between align-center">
                    <div
                        class="left-info flex align-center">
                    <span
                        class="icon d-inline-block border-50 bg-center bg-no-repeat bg-size-100"
                        :style="{
                            backgroundImage: `url(${awayLogo})`
                        }"
                    ></span>
                        <span class="m-l-5 text-white font-regular scale-9 team-name text-ellipsis">{{ match.awayChs }}</span>
                    </div>
                    <span v-if="!isFuture" class="font-12 scale-9 font-600">{{ match.awayScore }}</span>
                </div>
            </div>
            <div v-if="isFuture"
                 @click="book(match)"
                 class="buttons text-center font-12"
                 :class="{ 'is-subscribed': isSubscribe}">
                {{ buttonString }}
            </div>
        </div>
        <van-popup
            v-model="show"
            closeable
            close-icon="close"
            position="bottom"
            :style="{ height: '40%' }"
        >
            <div class="popup-box">
                <p class="font-16 m-t-15 text-center font-500 font-medium p-b-10">选择直播间</p>
                <div class="anchors">
                    <div class="border"></div>
                    <template
                        v-for="anchor in match.anchor_list"
                    >
                        <LiveHostCard
                            :key="anchor.room_id"
                            :anchor="anchor"
                            :match-info="match"
                        />
                    </template>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { addSubscribeMatch } from '@/api/competition'
import { statusCode } from '@/utils/statusCode'
import { Toast, Popup } from 'vant'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
import { matchStatus } from '@/utils/utils'
import LiveHostCard from '@/components/LiveHostCard'
export default {
    name: 'MatchCard',
    components: {
        [Toast.name]: Toast,
        [Popup.name]: Popup,
        LiveHostCard
    },
    props: {
        match: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            show: false
        }
    },
    computed: {
        ...mapState('user', ['token']),
        showLiveButton () {
            return this.match.anchor_list.length >= 1
        },
        isFuture () {
            return this.match.state === 0 // 未开始
        },
        isGoing () {
            // 是否进行中
            return this.match.state > 0 // 进行中
        },
        giveMatchStatus () {
            return matchStatus[this.match.state]
        },
        isSubscribe () { // 是否订阅了
            return this.match.appointment * 1 === 1
        },
        buttonString () {
            return this.isSubscribe ? '已预约' : '预约'
        },
        isToday () {
            return !!dayjs().isSame(dayjs(this.match.matchTime), 'day')
        },
        matchTime () {
            const title = this.isToday ? '今天' : '明天'
            return title + ' ' + dayjs(this.match.matchTime).format('HH:mm')
            // return dayjs(this.match.matchTime).format('MM-DD HH:mm')
        },
        homeLogo () {
            return this.match.homeLogo ? this.match.homeLogo : require('../assets/images/common/match-logo.png')
        },
        awayLogo () {
            return this.match.awayLogo ? this.match.awayLogo : require('../assets/images/common/match-logo.png')
        },
        matchIcon () {
            return this.match.leagueType === 1 ? require('../assets/images/common/football.png') : require('../assets/images/common/basketball.png')
        }
    },
    methods: {
        liveRoomButton () {
            if (this.match.anchor_list.length > 1) {
                this.show = true
            } else {
                // 直接跳转
                this.enterLiveRoom(this.match, this.match.anchor_list[0])
            }
        },
        async book (match) {
            if (!match.isGoing) {
                if (this.token) {
                    const { code, msg } = await addSubscribeMatch(match.matchId, match.leagueType)
                    if (code === statusCode.success) {
                        Toast(msg)
                        this.$emit('refresh')
                    }
                } else {
                    this.$store.commit('commonData/SET', {
                        loginDialogUrl: '/'
                    })
                    this.openLoginDialog()
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.card{
    width: 155px;
    height: 90px;
    background: linear-gradient(180deg, #6F4E5E 0%, #161147 100%);
    box-shadow: 0px 0px 4px 0px rgba(15,85,153,0.22);
    border-radius: 5px;
    border-image: linear-gradient(159deg, rgba(114, 114, 128, 1), rgba(23, 21, 42, 1)) 1 1;
}
.header {
    .left-title {
        // width: calc(100% - 75px);
        flex:1.2;
        line-height: 20px;
        img {
            width: 15px;
            height: 15px;
        }
    }
    .time {
        .time-span {
            font-weight: 400;
            line-height: 11px;
            font-size: 10px;
            font-family: PingFangSC-Regular, PingFang SC;
        }
        .live-icon {
            display: inline-block;
            width: 15px;
            height: 10px;
            background-image: url('../assets/images/common/live-blue.gif');
            background-position: left center;
            background-size: 100%;
            margin-left: -12px;
        }
        .live-broad-icon {
            font-size: 12px;
            height: 14px;
            line-height: 14px;
            color:#322E47;
            background-color: #00E2FE;
            background-position: 5px center;
            background-size: 12px 14px;
            box-shadow: inset 0px 0px 1px 0px rgba(0,0,0,0.2300);
            border-radius: 3px;
            .button {
                transform: scale(0.8);
            }
        }
    }
}
.left-info {
    .icon {
        width: 15px;
        height: 15px;
    }
    .team-name {
        width: 70px;
    }
}
.buttons {
    width: 40px;
    line-height: 23px;
    // background-color: #4164FF;
    box-shadow: inset 0px 0px 2px 0px rgba(0,0,0,0.2900);
    background: linear-gradient(to right,  #681e3e 0%, #2f1426 100% );
    border-radius: 3px;
    color: #fff;

    &.is-subscribed {
        box-shadow: none;
        border: 1px solid #fff;
        background: transparent;

        border-radius: 3px;
        font-weight: 300;
        color: #fff;
    }
}
::v-deep{
    .van-popup{
        background: #2B1845;
        color: #ffffff;
        z-index: 9999;
    }
    .van-icon:before{
        color: #6C73AF;
    }
}
.anchors{
    height: 210px;
    overflow: auto;
}
.border{
    height: 1px;
    width: 347px;
    margin: 0 auto 10px;
    background: #2F3568;
}
</style>
