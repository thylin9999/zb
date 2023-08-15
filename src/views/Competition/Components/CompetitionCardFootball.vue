<template>
    <div class="new-row flex flex-column justify-center bg-no-repeat bg-center bg-size-100" @click="gotoVirtualLive">
        <div class="league-info font-12 flex align-center justify-center font-medium font-500">
            <span class="date">{{ competition.matchTime | filterDate }}</span>
            <span class="m-l-5">{{startTime }}</span>
            <span class="m-l-5">{{ competition.leagueChsShort }} {{ roundInfo}}</span>
        </div>
        <div class="team-info">
            <div class=" flex m-t-5 align-center">
                <div class="team flex-1 flex flex-end font-12 font-medium font-500 text-black-3 align-center">
                    <span class="name text-white text-right  transform-center van-overflow-hidden text-clip">{{ competition.homeChs }}{{ranking ? `[${competition.home_rank}]` : '' }}</span>
                    <span
                        class="team-icon m-l-5 border-50 d-inline-block bg-no-repeat bg-center bg-size-cover"
                        :style="{
                            backgroundImage: `url(${homeIcon})`
                        }"
                    ></span>
                    <span class="score text-white font-medium text-center d-inline-block">{{ competition.homeScore }}</span>
                </div>
                <span class="status d-inline-block text-center"
                      :class="{
                            'is-going': isGoing,
                        }"
                >
                    <span class="scale-9 delay-time font-400 font-12 d-inline-block transform-center">{{ middleStatus }}</span>
                </span>
                <div class="team flex-1 flex font-12 font-medium font-500 text-black-3 align-center">
                    <span class="score text-center d-inline-block text-white">{{ competition.awayScore }}</span>
                    <span
                        class="team-icon m-r-5 border-50 d-inline-block bg-no-repeat bg-center bg-size-cover"
                        :style="{
                    backgroundImage: `url(${awayIcon})`
                }"
                    ></span>
                    <span class="name scale-9 text-white transform-center text-left van-overflow-hidden text-clip">{{ranking ? `[${competition.away_rank}]` : '' }}{{ competition.awayChs }}</span>
                </div>
            </div>
            <div class="upper-info m-t-5 flex align-center font-12 font-regular font-500 w-100 text-center">
                <div class="left flex align-center flex-end flex-1">
                    <div class="penalty"
                        :class="{
                            'visibility-hidden': !cardTip
                        }"
                    >
                        <span class="red  card d-inline-block" >
                            <span class="d-inline-block scale-7 transform-center">{{ competition.homeRed }}</span>
                        </span>
                        <span class="yellow m-l-5 m-r-5 card d-inline-block" >
                            <span class="d-inline-block scale-7 transform-center">{{ competition.homeYellow }}</span>
                        </span>
                    </div>
                    <div class="half scale-9 transform-center">
                        <span>半:</span>
                        <span class="number">{{ competition.homeHalfScore }}</span>
                        <span class="vertical-top">-</span>
                        <span class="number">{{ competition.awayHalfScore }}</span>
                    </div>
                </div>
                <div class="right flex-1 m-l-5 flex align-center" >
                    <div class="half scale-9 transform-center">
                        <span>角:</span>
                        <span class="number">{{ competition.homeCorner }}</span>
                        <span class="vertical-top">-</span>
                        <span class="number">{{ competition.awayCorner }}</span>
                    </div>
                    <div class="penalty"
                        :class="{
                            'visibility-hidden': !cardTip
                        }"
                    >
                        <span class="yellow m-l-5 card d-inline-block " >
                            <span class="d-inline-block scale-7 transform-center">{{ competition.awayYellow }}</span>
                        </span>
                                <span class="red card m-l-5 d-inline-block" >
                            <span class="d-inline-block scale-7 transform-center">{{ competition.awayRed }}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="asistant-info m-t-10 flex align-center justify-center">
            <div v-if="isFuture && !hasLive"
                 class="subscribe-button text-center"
                 :class="{
                     'is-subscribed': isSubscribe
                 }"
            >
                <span
                    class="font-regular"
                    @click.stop="subscribeHost"
                >{{ isSubscribe ? '已预约' : '预约直播'}}</span>
            </div>
            <span
                v-if="hasManyLive"
                class="live-room m-l-10 m-r-10 d-inline-block bg-no-repeat bg-center bg-size-100"
                @click.stop="openPopup"
            ></span>
            <span
                class="virtual-room d-inline-block bg-no-repeat bg-center bg-size-100"
                @click.stop="gotoVirtualLive"
            ></span>
            <!-- 在播主播 展示 -->
            <div v-if="showLives.length" class="rooms  p-l-10 p-r-10 overflow-x-auto">
                <div class="flex align-center box" :style="{
                    width: `${roomWidth}px`
                }">
                    <span
                        v-for="anchor in showLives"
                        :key="anchor.room_id"
                        class="d-inline-block m-r-5 room-icon bg-center bg-no-repeat bg-size-100"
                        :style="{
                         backgroundImage: `url(${anchor.img ? anchor.img : userEmptyImg})`
                        }"
                        :class="{isLive: anchor.live_status === 2}"
                        @click.stop="goToLiveRoom(anchor)"
                    ></span>
                </div>
            </div>
            <!-- 预约主播 展示 -->
            <div v-if="showScheduled && showScheduled.length" class="rooms  p-l-10 p-r-10 overflow-x-auto">
                <div class="flex align-center box" :style="{
                    width: `${roomWidth}px`
                }">
                    <span
                        v-for="anchor in showScheduled"
                        :key="anchor.room_id"
                        class="d-inline-block m-r-5 room-icon bg-center bg-no-repeat bg-size-100"
                        :style="{
                         backgroundImage: `url(${anchor.img ? anchor.img : userEmptyImg})`
                        }"
                        @click.stop="goToLiveRoom(anchor)"
                    ></span>
                </div>
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
                <p class="font-16 m-t-15 text-center font-500 text-black-3 font-medium">选择直播间</p>
                <div class="anchors">
                    <template
                        v-for="anchor in competition.anchor_list"
                    >
                        <LiveHostCard
                            :key="anchor.room_id"
                            :anchor="anchor"
                            :match-info="competition"
                        />
                    </template>
                </div>
            </div>
        </van-popup>
        <i class="haveTag" v-if="!!competition.material_num" />
    </div>

</template>

<script>
import LiveHostCard from '@/components/LiveHostCard'

import { matchStatus } from '@/utils/utils'
import { Toast, Popup } from 'vant'
import { addSubscribeMatch } from '@/api/competition'
import { statusCode } from '@/utils/statusCode'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
    name: 'CompetitionCardFootball',
    filters: {
        filterStatus (state) {
            return matchStatus[state]
        },
        filterDate (date) {
            return dayjs(date).format('MM月DD日')
        }
    },
    components: {
        LiveHostCard,
        [Popup.name]: Popup,
        [Toast.name]: Toast
    },
    props: {
        competition: {
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
        ...mapState('voice', ['cardTip', 'ranking']),
        startTime () {
            return this.competition.matchTime && dayjs(this.competition.matchTime).format('HH:mm')
        },
        isGoing () {
            return [1, 2, 3, 4, 5].includes(this.competition.state)
        },
        roundInfo () {
            return this.competition.roundCn ? `第${this.competition.roundCn}轮` : ''
        },
        middleStatus () {
            // 比赛中时，展示时间，其他展示 状态
            return this.isGoing ? (this.competition.timing || 0) + '`' : matchStatus[this.competition.state]
        },
        isSubscribe () {
            return this.competition.appointment * 1 === 1
        },
        isFuture () {
            return this.competition.state === 0 // 未开始
        },
        hasLive () {
            // 是否有直播
            return !!this.competition.anchor_list.length
        },
        showLives () {
            return this.hasLive ? this.competition.anchor_list.slice(0, 2) : []
        },
        hasManyLive () {
            return this.competition.anchor_list.length > 2
        },
        homeIcon () {
            return this.competition.homeLogo || this.emptyImg
        },
        awayIcon () {
            return this.competition.awayLogo || this.emptyImg
        },
        roomWidth () {
            return this.competition.anchor_list.length * 20 + 'px'
        },
        showScheduled () {
            return this.competition.scheduled_anchor && this.competition.scheduled_anchor.slice(0, 2)
        }
    },
    methods: {
        changeStatus () {
            this.$emit('update:appointment', this.isSubscribe ? 2 : 1)
        },
        async subscribeHost () {
            if (!this.token) {
                // Toast('请先登录')
                // return
                this.$store.commit('commonData/SET', {
                    loginDialogUrl: '/competition/1'
                })
                this.openLoginDialog()
                return
            }
            try {
                const { code, msg } = await addSubscribeMatch(this.competition.matchId, this.competition.leagueType)
                if (code === statusCode.success) {
                    Toast(msg)
                    this.$emit('update:appointment', this.isSubscribe ? 2 : 1)
                } else {
                    Toast(msg)
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        openPopup () {
            if (this.competition.anchor_list.length === 1) {
                this.enterLiveRoom(this.competition, this.competition.anchor_list[0])
            } else if (this.competition.anchor_list.length > 1) {
                this.show = true
            }
        },
        goToLiveRoom (anchor) {
            this.$router.push({
                name: 'Broadcast',
                params: {
                    id: anchor.match_id
                },
                query: { room_id: anchor.room_id }
            })
        },
        gotoVirtualLive () {
            this.$nextTick(() => {
                const { href } = this.$router.resolve({
                    name: 'VirtualLive',
                    params: { id: this.competition.matchId },
                    query: { leagueType: this.competition.leagueType }
                })
                window.open(href, '_blank')
            })
        }
    }

}
</script>

<style lang="scss" scoped>
.new-row {
    position: relative;
    // width: 100%;
    width: 347px;
    height: 110px;
    margin: 0  auto;
    border-radius: 10px;
    background-image: url('../../../assets/images/competition/card-bg.png');
    .league-info{
        color: #6C73AF;
    }
    .team-info{
        line-height: 17px;
        .team-icon {
            width: 20px;
            height: 20px;
            background-color: #eee;
        }
        .score {
            width: 20px;
            height: 17px;
        }
        .team {
            width: calc(50% - 15px);
        }
        .status {
            width: 30px;

            color: #6C73AF;
            .delay-time {
                background-color: #0E0E23;
                padding: 0 3px;
                border-radius: 3px;
                font-weight: 400;
            }
            &.is-going {
                color: #F7464E;
                .delay-time {
                    background-color: transparent;
                }
            }
        }
        .penalty {
            height: 11.25px;
            display: flex;
            .card {
                // padding: 0 2px;
                // border-radius: 2px;
                width: 8.75px;
                height: 11.25px;
                line-height: 11.25px;
                border-radius: 1px;
                color: #fff;
            }
            .red {
                background-color: #FF5B5D;
            }
            .yellow {
                background-color: #FFC460;
            }
        }
    }
    .asistant-info {
        .subscribe-button {
            width: 85px;
            height: 20px;
            color: #161C4F;
            font-size: 12px;
            line-height: 20px;
            transform: scale(0.9);
            background-color: #00E1FD;
            border-radius: 10px;
            &.is-subscribed {
                border: 1px solid #00E1FD;
                color: #00E1FD;
                background-color: transparent;
            }
        }
        .rooms {
            //width: 40%;
            .box {
                flex-wrap: nowrap;
            }
            .room-icon {
                width: 16px;
                height: 16px;
                border-radius: 50%;
            }
        }
    }
    .upper-info {
        color: #6C73AF;
    }
    .virtual-room {
        width: 25px;
        height: 16px;
        background-image: url('../../../assets/images/liveroom/virtual.png');
    }
    .live-room {
        width: 35px;
        height: 16px;
        background-image: url('../../../assets/images/liveroom/live.png');
    }
}
.haveTag{
    background: url('../../../assets/images/competition/haveTag.png') no-repeat;
    background-size: 100% 100%;
    width: 40px;
    height: 26px;
    position: absolute;
    top: 0;
    right: 15px;
}
.isLive{
    position: relative;
    &::after{
        content: 'LIVE•';
        width: 30px;
        height: 10px;
        line-height: 10px;
        background: #F7464E;
        border-radius: 8px;
        position: absolute;
        bottom: -2px;
        left: -7.5px;
        font-size: 10px;
        margin: auto;
        transform: scale(.5);
        text-align: center;
        color: #ffffff;
    }
}
</style>
