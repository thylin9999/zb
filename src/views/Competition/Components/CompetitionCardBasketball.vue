<template>
    <div class="row  flex justify-between align-center bg-no-repeat bg-center bg-size-100">
        <div class="left-section p-relative" :class="{w30: isScheduled}" @click="gotoVirtualLive">
            <div class="battle p-r-10">
                <!-- line 1 -->
                <div class="battle-name font-12 flex align-center justify-between">
                    <div class="battle-time">
                      <span class="font-12 m-r-10 font-regular d-inline-block text-primary scale-83">{{ competition.matchTime | filterYear}}{{ competition.matchTime | filterTime  }}</span>
                    </div>
                    <div class=" status font-12  text-left" :class="{'m-l-15': isScheduled}">
                      <span class="scale-7 d-inline-block" v-if="isGoing">{{ shortTime }} {{ competition.remainTime }}</span>
                      <span class="other-status scale-7  d-inline-block" v-else>{{ middleStatus.charAt(0) }}</span>
                    </div>
                    <span class="placeholder text-primary scale-9 font-12 font-medium font-500" v-show="!isScheduled">
                        分差 {{  scoreMinus  }}
                    </span>
                </div>
                <div class="new-line">
                    <span class="font-12 m-r-10 font-regular text-primary d-inline-block scale-83">{{ competition.leagueChsShort }}</span>
                </div>
                <!-- line 2 -->
                <div class="team font-12 m-t-5 text-white font-medium flex align-center justify-between">
                    <span class="team-name text-overflow-hidden">{{ ranking ? `[${competition.home_rank}]` : '' }}{{ competition.homeChs }}</span>
                    <div
                        class="scores flex align-center text-center"
                        :class="{
                            'visibility-hidden': isFuture
                        }"
                    >
                        <span>{{ competition.home1 }}</span>
                        <span>{{ competition.home2 }}</span>
                        <span>{{ competition.home3 }}</span>
                        <span>{{ competition.home4 }}</span>
                        <span :class="{
                            'visibility-hidden': !competition.homeOT1
                        }">{{ competition.homeOT1 }}</span>
                        <span
                        :class="{
                            'visibility-hidden': !competition.homeOT2
                        }"
                        >{{ competition.homeOT2 }}</span>
                        <span
                        :class="{
                            'visibility-hidden': !competition.homeOT3
                        }">{{ competition.homeOT3 }}</span>
                    </div>
                    <span
                        class="total-score font-12 text-white text-center font-medium font-500"
                        :class="{
                            'visibility-hidden': isFuture
                        }"
                    >{{ competition.homeScore}}</span>
                </div>
                <!-- line 3 -->
                <div class="team font-12 m-t-5 text-white font-medium flex align-center justify-between">
                    <span class="team-name text-overflow-hidden">{{ ranking ? `[${competition.away_rank}]` : '' }}{{ competition.awayChs }}</span>
                    <div
                        class="scores flex align-center text-center"
                        :class="{
                            'visibility-hidden': isFuture
                        }"
                    >
                        <span>{{ competition.away1 }}</span>
                        <span>{{ competition.away2 }}</span>
                        <span>{{ competition.away3 }}</span>
                        <span>{{ competition.away4 }}</span>
                        <span
                        :class="{
                            'visibility-hidden': !competition.awayOT1
                        }">{{ competition.awayOT1 }}</span>
                        <span
                        :class="{
                            'visibility-hidden': !competition.awayOT2
                        }">{{ competition.awayOT2 }}</span>
                        <span
                        :class="{
                            'visibility-hidden': !competition.awayOT3
                        }">{{ competition.awayOT3 }}</span>
                    </div>
                    <span
                        class="total-score font-12 text-white text-center font-medium font-500"
                        :class="{
                            'visibility-hidden': isFuture
                        }"
                    >{{ competition.awayScore}}</span>
                </div>
            </div>
        </div>
        <!-- 比赛未开始，有主播预约 -->
        <div class="scheduled_anchor" v-if="isScheduled">
            <img v-for="item in competition.scheduled_anchor" :src="item.img?item.img: require('@/assets/logo.png')" :key="item.anchor_id" alt="">
        </div>
        <div class="right-buttons flex align-center ">
            <div  class="border "></div>
            <div class="flex flex-column flex-1 align-center justify-center p-t-15">
                <span class="font-12 scale-9 text-primary font-medium font-500 p-t-3 score">总分 {{ totalScore }}</span>
                <div v-if="hasLive" class="m-l-10 m-r-10 ">
                    <div class="icon-box">
                        <span
                            class="live-room d-inline-block bg-no-repeat bg-center bg-size-100"
                            @click.stop="openPopup"
                        ></span>
                    </div>
                </div>
                <div class="icon-box">
                    <span
                        class="virtual-room d-inline-block bg-no-repeat bg-center bg-size-100"
                        @click.stop="gotoVirtualLive"
                    ></span>
                </div>
                <!-- && isFuture -->
                <div v-if="!hasLive && isFuture"
                     class="subscribe-button m-t-5 icon-box text-center m-l-10 m-r-10 "
                     :class="{
                       'is-subscribed': isSubscribe
                   }"
                >
                  <span
                      class="font-regular"
                      @click.stop="subscribeHost"
                  >{{ isSubscribe ? '已预约' : '预约'}}</span>
                </div>
            </div>

        </div>
        <van-popup
            v-model="show"
            closeable
            close-icon="close"
            position="bottom"
            @click-close-icon.stop="show = false"
            :style="{ height: '40%' }"
        >
            <p class="font-16 m-t-15 p-b-10 text-center font-500 text-white font-medium">选择直播间</p>
            <div class="anchors">
                <div class="border"></div>
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
    name: 'CompetitionCardBasketball',
    filters: {
        filterTime (value) {
            return dayjs(value).format('HH:mm')
        },
        filterStatus (state) {
            return basketStatus[state]
        },
        filterYear (value) {
            return dayjs(value).format('MM月DD日')
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
        isScheduled () {
            return this.competition.scheduled_anchor && this.competition.scheduled_anchor.length && !this.hasLive
        },
        totalScore () {
            return this.competition.homeScore + this.competition.awayScore
        },
        scoreMinus () {
            return Math.abs(this.competition.homeScore - this.competition.awayScore)
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
        height: 75px;
        top: 0;
        .battle{
            height: 75px;
        }
        .bar {
            width: 5px;
            height: 75px;
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
    .w30 {
        width: calc(100% - 200px);
    }
    .battle {
        margin-left: 15px;
        .battle-name {
          .battle-time {
            width: 100px;
            flex-shrink: 0;
          }
          .placeholder {
            width: 50px;
            text-align: right;
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
        min-width: 68px;
        padding-right: 3px;
        .icon-box {
            height: 20px;
        }
        .border {
            min-height: 40px;
            width: 1px;
            background-color: #30366A;
            margin-top: 30px;
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
            width: 40px;
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
            display: block;
            line-height: 20px;
          }
          &.is-subscribed {
            border: 1px solid #00E1FD;
            color: #00E1FD;
            background-color: transparent;
          }
        }
    }
    .scheduled_anchor{
        width: 100%;
        display: flex;
        justify-content: space-around;
        padding-top: 20px;
        img{
            width: 16px;
            height: 16px;
            border-radius: 50%;
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
.scale-83{
    transform: scale(.83);
    transform-origin:0 50%;
    width: 120px;
}
.score{
    position: absolute;
    top: 6px;
}
::v-deep {
    .van-popup{
        background: #2B1845;
        border-radius: 5px 5px 0px 0px;
    }
}
.anchors{
    height: 260px;
    overflow: auto;
}
.border{
    height: 1px;
    width: 347px;
    margin: 0 auto 10px;
    background: #2F3568;
}
</style>
