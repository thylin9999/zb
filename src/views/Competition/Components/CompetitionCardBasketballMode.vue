<template>
    <div class="row  flex justify-between align-center bg-no-repeat bg-center bg-size-100">
        <div class="left-section p-relative">
            <div class="battle h-100">
                <div class="battle-name font-12 flex align-center justify-between">
                    <div class="battle-time">
                      <span class="font-12 m-r-10 font-regular text-primary">{{ competition.leagueChsShort}}</span>
                      <span class="time scale-7 d-inline-block text-primary">{{ competition.matchTime | filterTime  }}</span>
                    </div>
                    <div class=" status font-12  text-left">
                      <span class="scale-7 d-inline-block" v-if="isGoing">{{ shortTime }} {{ competition.remainTime }}</span>
                      <span class="other-status scale-7  d-inline-block" v-else>{{ middleStatus.charAt(0) }}</span>
                    </div>
                    <span class="placeholder text-primary scale-9 font-12 font-medium font-500 ">
                        分差{{  scoreMinus  }}
                    </span>
                </div>
                <div class="flex-1">
                    <div class="team font-12 m-t-10 text-white font-medium flex align-center justify-between">
                        <span class="team-name text-overflow-hidden">{{ ranking ? `[${competition.home_rank}]` : '' }}{{ competition.homeChs }}</span>
                        <div
                            class="scores flex align-center justify-between text-center"

                        >
                            <span>{{ isFuture ? '-' : competition.homeScore }}</span>
                            <div class="modes m-l-25  flex-1 flex align-center justify-between" v-if="isScoreMode">
                                <span class="flex-1 scale-9">{{ oddsEurope ? oddsEurope.init_home_win_odds : '-' }}</span>
                                <!-- <span class="flex-1 m-l-5 m-r-5">{{ oddsEurope ? oddsEurope.init_tie_odds : '-' }}</span> -->
                                <span class="flex-1 text-right scale-9">{{ oddsEurope ?oddsEurope.init_away_win_odds : '-' }}</span>
                            </div>
                            <div class="modes m-l-25  flex-1 flex align-center justify-between" v-else>
                                <!-- 大小 -->
                                <span class="flex-1 scale-9">{{ oddsOverUnder ? oddsOverUnder.init_over_odds : '-' }}</span>
                                <span class="flex-1 scale-9 m-l-5 m-r-5">{{ oddsOverUnder ? oddsOverUnder.init_odds : '-'}}</span>
                                <span class="flex-1 text-right scale-9">{{ oddsOverUnder ? oddsOverUnder.init_under_odds : '-' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="team font-12 m-t-10 text-white font-medium flex align-center justify-between">
                        <span class="team-name text-overflow-hidden">{{ ranking ? `[${competition.away_rank}]` : '' }}{{ competition.awayChs }}</span>
                        <div
                            class="scores flex align-center justify-between text-center"

                        >
                            <span>{{ isFuture ? '-' : competition.awayScore }}</span>
                            <div class="modes m-l-25  flex-1 flex align-center justify-between" v-if="isScoreMode">
                                <span class="flex-1 scale-9">{{ oddsEurope ? oddsEurope.init_home_win_odds : '-' }}</span>
                                <!-- <span class="flex-1 m-l-5 m-r-5">{{ oddsEurope ? oddsEurope.init_tie_odds : '-' }}</span> -->
                                <span class="flex-1 text-right scale-9">{{ oddsEurope ?oddsEurope.init_away_win_odds : '-' }}</span>
                            </div>
                            <div class="modes m-l-25  flex-1 flex align-center justify-between" v-else>
                                <!-- 大小 -->
                                <span class="flex-1 scale-9">{{ oddsOverUnder ? oddsOverUnder.init_over_odds : '-' }}</span>
                                <span class="flex-1 scale-9 m-l-5 m-r-5">{{ oddsOverUnder ? oddsOverUnder.init_odds : '-'}}</span>
                                <span class="flex-1 text-right scale-9">{{ oddsOverUnder ? oddsOverUnder.init_under_odds : '-' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-buttons flex align-center ">
            <div  class="border "></div>
            <div class="flex flex-column w-100 btns flex-1 align-center justify-between">
                <span class="font-12 scale-9 text-primary font-medium font-500 p-t-3">总分 {{ totalScore }}</span>
                <div class=" flex flex-column align-center flex-1 justify-center">
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
import dayjs from 'dayjs'
import { basketStatus } from '@/utils/utils'
import { Toast, Popup } from 'vant'
import { addSubscribeMatch } from '@/api/competition'
import { statusCode } from '@/utils/statusCode'
import { mapState } from 'vuex'
export default {
    name: 'CompetitionCardBasketballMode',
    filters: {
        filterTime (value) {
            return dayjs(value).format('HH:mm')
        },
        filterStatus (state) {
            return basketStatus[state]
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
        ...mapState('voice', ['ranking']),
        startTime () {
            return this.competition.matchTime && dayjs(this.competition.matchTime).format('HH:mm')
        },
        isGoing () {
            return [1, 2, 3, 4, 5].includes(this.competition.state)
        },
        shortTime () {
            return [1, 2, 3, 4].includes(this.competition.state) ? `第${this.competition.state}节` : this.middleStatus
        },
        middleStatus () {
            // 比赛中时，展示时间，其他展示 状态
            return this.isGoing
                ? (this.competition.timing || 0) + '`'
                : basketStatus[this.competition.state]
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
        hasManyLive () {
            return this.competition.anchor_list.length > 2
        },
        homeIcon () {
            return this.competition.homeLogo || this.emptyImg
        },
        awayIcon () {
            return this.competition.awayLogo || this.emptyImg
        },
        totalScore () {
            return this.competition.homeScore + this.competition.awayScore
        },
        scoreMinus () {
            return Math.abs(this.competition.homeScore - this.competition.awayScore)
        },
        isScoreMode () { // traditional 传统比分 mode 比分只是 size 大小指数
            return this.mode === 'mode'
        },
        isSizeMode () {
            return this.mode === 'size'
        },
        oddsEurope () {
            return this.competition.odds_moneyline
        },
        oddsOverUnder () {
            return this.competition.odds_total
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
.row {
    position: relative;
    // width: 360px;
    // width: 100%;
    width: 347px;
    margin: 0 auto;
    height: 85px;
    background-image: url('../../../assets/images/competition/card-bg.png');
    .left-section {
        width: calc(100% - 66px);
        height: 70px;
        top: 0;
        .bar {
            width: 5px;
            height: 55px;
            border-radius: 3px;
        }
        .league-type{
            line-height: 18px;
            height: 20px;
            border-radius: 3px;
            color: #2B8ED4;
            border: 1px solid #2B8ED4;
        }
    }
    .battle {
        margin-left: 15px;
        padding-right: 5px;
        .battle-name {
          .battle-time {
            width: 100px;
            flex-shrink: 0;
          }
          .placeholder {
            text-align: right;
            width: 60px;
          }
          .status {
            width: 120px;
            color: #F7464E;
            font-weight: 400;
            .other-status {
              padding: 2px;
              margin-left: 5px;
              width: 12px;
              height: 12px;
              background: #0E0E23;
              border-radius: 3px;
              color: #6C73AF;
              box-sizing: content-box;
            }
          }
        }
        .time {
            color: #999999;
        }
        .team {
            .scores {
                // width: 80px;
                flex: 1;
                span {
                    font-size: 12px;
                    font-family: PingFang-SC-Medium;
                    font-weight: 500;
                    color: #fff;
                    display: inline-block;
                    width: 20px;
                }
            }
            .total-score{
                width: 30px;
            }
            .team-name{
                flex-shrink: 0;
                display: inline-block;
                width: 100px;
            }
        }
    }
    .right-buttons{
        width: 68px;
        padding-right: 3px;
        .btns {
            height: 70px;
        }
        .icon-box {
            height: 20px;
        }
        .border {
            min-height: 40px;
            width: 1px;
            background-color: #30366A;
            margin-top: 20px;
        }
        .end {
            color: #999;
        }
        .on-live-button{
            width: 55px;
            height: 25px;
            background-color: #F7464E;
            border-radius: 3px;
            font-size: 12px;
            line-height: 25px;
        }
        .virtual-room {
            width: 27px;
            height: 20px;
            background-image: url('../../../assets/images/liveroom/virtual.png');
        }
        .live-room {
            width: 35px;
            height: 16px;
            background-image: url('../../../assets/images/liveroom/live.png');
        }
        .subscribe-button {
          width: 40px;
          height: 20px;
          color: #0E0E23;
          font-size: 12px;
          line-height: 20px;
          background-color: #00E1FD;
          border-radius: 3px;
          border: 1px solid transparent;
          span{
            line-height: 20px;
          }
          &.is-subscribed {
            border: 1px solid #00E1FD;
            color: #00E1FD;
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
    right: 105px;
}
.p-t-3{
    padding-top: 3px;
}
</style>
