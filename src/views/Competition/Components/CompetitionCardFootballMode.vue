<template>
    <div class="new-row flex flex-column justify-center bg-no-repeat bg-center bg-size-100">
        <div class="row w-100 p-l-15 p-r-15 flex align-center">
            <div class="left-info font-12 font-500 flex flex-column justify-center">
                <div class=" text-primary">
                    <!-- <span class="date">{{ competition.matchTime | filterDate }}</span> -->
                    <span class="">{{startTime }}</span>
                    <span class="m-l-5">{{ competition.leagueChsShort }} {{ roundInfo}}</span>
                </div>
                <div class="text-white m-t-5 flex align-center justify-between">
                    <span class="w110 text-overflow-hidden">{{ranking ? `[${competition.home_rank}]` : '' }}{{ competition.homeChs  }}</span>
                    <div class="cards flex align-center"
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
                </div>
                <div class="text-white m-t-5 flex align-center justify-between">
                    <span class="text-white m-t-5 w110 text-overflow-hidden">{{ranking ? `[${competition.away_rank}]` : '' }}{{ competition.awayChs  }}</span>
                    <div class="cards flex align-center"
                    :class="{
                            'visibility-hidden': !cardTip
                        }"
                    >
                        <span class="red  card d-inline-block" >
                            <span class="d-inline-block scale-7 transform-center">{{ competition.awayRed }}</span>
                        </span>
                        <span class="yellow m-l-5 m-r-5 card d-inline-block" >
                            <span class="d-inline-block scale-7 transform-center">{{ competition.awayYellow }}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="middle-time font-12 flex flex-column ">
                <span class="status d-inline-block text-center"
                    :class="{
                        'is-going': isGoing,
                    }"
                >
                    <span class="scale-9 delay-time font-400 font-12 d-inline-block transform-center">{{ middleStatus }}</span>
                </span>
                <span class="m-t-5 text-center text-white font-16 font-500">{{ competition.homeScore }}</span>
                <span class="m-t-5 text-center text-white font-16 font-500">{{ competition.awayScore }}</span>
            </div>
            <div class="middle-scores h-100 flex flex-column justify-center">
                <div class="flex  align-center font-400 text-primary">
                    <div class="half scale-9 transform-center">
                        <span>半:</span>
                        <span class="number">{{ competition.homeHalfScore }}</span>
                        <span class="vertical-top">-</span>
                        <span class="number">{{ competition.awayHalfScore }}</span>
                    </div>
                    <div class="half scale-9 transform-center">
                        <span>角:</span>
                        <span class="number">{{ competition.homeCorner }}</span>
                        <span class="vertical-top">-</span>
                        <span class="number">{{ competition.awayCorner }}</span>
                    </div>
                </div>
                <div class="flex m-t-5 text-white text-center font-12 font-400 align-center justify-between">
                    <template v-if="isScoreMode">
                        <span class="flex-1">{{ oddsEurope ? oddsEurope.init_home_win_odds : '-' }}</span>
                        <span class="flex-1 m-l-5 m-r-5">{{ oddsEurope ? oddsEurope.init_tie_odds : '-' }}</span>
                        <span class="flex-1">{{ oddsEurope ?oddsEurope.init_away_win_odds : '-' }}</span>
                    </template>
                    <template v-else>
                        <!-- 大小 -->
                        <span class="flex-1">{{ oddsOverUnder ? oddsOverUnder.init_over_odds : '-' }}</span>
                        <span class="flex-1 m-l-5 m-r-5">{{ oddsOverUnder ? oddsOverUnder.init_odds : '-'}}</span>
                        <span class="flex-1">{{ oddsOverUnder ? oddsOverUnder.init_under_odds : '-' }}</span>
                    </template>
                </div>
                <div class="flex m-t-5 text-white text-center font-12 font-400 align-center justify-between">
                    <template v-if="isScoreMode">
                        <span class="flex-1">{{ oddsEurope ? oddsEurope.curr_home_win_odds : '-' }}</span>
                        <span class="flex-1 m-l-5 m-r-5">{{ oddsEurope ? oddsEurope.curr_tie_main_odds : '-' }}</span>
                        <span class="flex-1">{{ oddsEurope ? oddsEurope.curr_away_win_odds : '-' }}</span>
                    </template>
                    <template v-else>
                        <span class="flex-1">{{ oddsOverUnder ? oddsOverUnder.curr_over_odds : '-' }}</span>
                        <span class="flex-1 m-l-5 m-r-5">{{ oddsOverUnder ? oddsOverUnder.curr_odds :  '-'}}</span>
                        <span class="flex-1">{{ oddsOverUnder ? oddsOverUnder.curr_under_odds : '-' }}</span>
                    </template>
                </div>
            </div>
            <div class="flex asistant-info flex-column flex-1 align-center justify-center">
                <div v-if="hasLive" class="">
                    <div class="icon-box">
                        <span
                            class="live-room m-l-10 m-r-10 d-inline-block bg-no-repeat bg-center bg-size-100"
                            @click="openPopup"
                        ></span>
                    </div>
                </div>
                <div class="icon-box">
                    <span
                        class="virtual-room d-inline-block bg-no-repeat bg-center bg-size-100"
                        @click="gotoVirtualLive"
                    ></span>
                </div>
                <!-- && !hasLive isFuture  足球-》比分指数/篮球指数不需要预约-->
                <div v-if="!isScoreMode && !isSizeMode"
                     class="subscribe-button m-t-5 icon-box text-center"
                     :class="{
                       'is-subscribed': isSubscribe
                   }"
                >
                  <span
                      class="font-regular"
                      @click="subscribeHost"
                  >{{ isSubscribe ? '已预约' : '预约'}}</span>
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
    name: 'CompetitionCardFootballMode',
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
        },
        mode: {
            type: String,
            default: 'traditional'
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
        isScoreMode () { // traditional 传统比分 mode 比分只是 size 大小指数
            return this.mode === 'mode'
        },
        isSizeMode () {
            return this.mode === 'size'
        },
        oddsEurope () {
            return this.competition.odds_europe
        },
        oddsOverUnder () {
            return this.competition.odds_over_under
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
    // width: 100%;
    width: 347px;
    position: relative;
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
            .card {
                // padding: 0 2px;
                // border-radius: 1px;
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
            width: 70px;
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
.row {
    height: 85px;
    .left-info{
        width: 140px;
    }
    .cards {

        .card {
                // padding: 0 2px;
                // border-radius: 1px;
                width: 8.75px;
                height: 11.25px;
                line-height: 11.25px;
                border-radius: 1px;
                color: #fff;
                text-align: center;
            }
            .red {
                background-color: #FF5B5D;
            }
            .yellow {
                background-color: #FFC460;
            }
    }
    .status {
            width: 30px;

            color: #6C73AF;
            .delay-time {
                background-color: #0E0E23;
                padding: 0 3px;
                border-radius: 3px;
                font-weight: 400;
                text-align: center;
            }
            &.is-going {
                color: #F7464E;
                .delay-time {
                    background-color: transparent;
                }
            }
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
.w110{
    display: block;
    width: 110px;
}
</style>
