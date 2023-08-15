<template>
    <van-swipe-cell >
        <div class="row p-5  flex bg-white justify-between align-center">
            <div class="left-time flex flex-column justify-between text-center">
                <div class="league-type font-12 font-500 font-medium"
                     :style="{
                            color: ' #2B8ED4',
                            border: `1px solid  #2B8ED4`
                        }"
                >
                    {{ competition.leagueChsShort }}
                </div>
                <div class="flex m-t-5 flex-column flex-1 justify-center font-12 font-medium font-500 text-black-3 scale-9 align-center">
                    <span v-if="competition.roundCn">第{{ competition.roundCn }}轮</span>
                    <span>{{ startTime }}</span>
                </div>
            </div>
            <div class="middle flex-1">
                <div class="upper-info flex align-center font-12 font-medium font-500 w-100 text-center">
                    <div class="left flex align-center flex-end flex-1">
                        <div class="penalty">
                    <span class="red  card d-inline-block" :class="{ 'visibility-hidden': !competition.homeRed }">
                        <span class="d-inline-block scale-7 transform-center">{{ competition.homeRed }}</span>
                    </span>
                    <span class="yellow m-l-5 m-r-5 card d-inline-block" :class="{ 'visibility-hidden': !competition.homeYellow }">
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
                        <div class="penalty">
                    <span class="yellow m-l-5 card d-inline-block" :class="{ 'visibility-hidden': !competition.awayYellow }">
                        <span class="d-inline-block scale-7 transform-center">{{ competition.awayYellow }}</span>
                    </span>
                            <span class="red card m-l-5 d-inline-block" :class="{ 'visibility-hidden': !competition.awayRed }">
                        <span class="d-inline-block scale-7 transform-center">{{ competition.awayRed }}</span>
                    </span>
                        </div>
                    </div>
                </div>
                <div class="team-info flex m-t-10 align-center">
                    <div class="team flex-1 flex flex-end font-12 font-medium font-500 text-black-3 align-center">
                        <span class="name text-right scale-9 transform-center van-overflow-hidden text-clip">{{ competition.homeChs }}</span>
                        <span
                            class="team-icon m-l-5 border-50 d-inline-block bg-no-repeat bg-center bg-size-cover"
                            :style="{
                        backgroundImage: `url(${homeIcon})`
                    }"
                        ></span>
                        <span class="score text-center d-inline-block">{{ competition.homeScore }}</span>
                    </div>
                    <span class="status d-inline-block text-center"
                          :class="{
                            'is-going': isGoing,
                        }"
                    >
                        <span class="scale-9 delay-time font-400 font-12 d-inline-block transform-center">{{ middleStatus }}</span>
                    </span>
                    <div class="team flex-1 flex font-12 font-medium font-500 text-black-3 align-center">
                        <span class="score text-center d-inline-block">{{ competition.awayScore }}</span>
                        <span
                            class="team-icon m-r-5 border-50 d-inline-block bg-no-repeat bg-center bg-size-cover"
                            :style="{
                        backgroundImage: `url(${awayIcon})`
                    }"
                        ></span>
                        <span class="name scale-9 transform-center text-left van-overflow-hidden text-clip">{{ competition.awayChs }}</span>
                    </div>
                </div>
            </div>
            <div class="right-buttons flex align-center">
                <div  class="border m-r-5"></div>
                <div class="flex flex-1 align-center justify-center">
                    <div v-if="hasLive" class="">
                        <div >
                            <OnLiveButton class="on-live-button p-l-15 font-12 font-medium font-500" @click.native="openPopup" />
                        </div>
<!--                        <span v-else class="end font-14 text-center">{{ competition.state | filterStatus }}</span>-->
                    </div>
                    <div v-else class="buttons">
                        <SubscribeButton
                            v-if="isFuture"
                            :is-subscribe="isSubscribe"
                            @click.native="subscribeHost"
                        />
<!--                        <template v-else>-->
<!--                            <span class="end font-14 text-center">{{ competition.state | filterStatus }}</span>-->
<!--                        </template>-->
                    </div>
                </div>

            </div>

        </div>
        <template #right>
<!--            <van-button square text="删除" type="danger" class="delete-button" />-->
            <span class="delete-button flex align-center justify-center m-t-5 d-inline-block ">
                <span class="d-inline-block m-t-5 text text-color font-12 font-regular font-400" @click="subscribeHost">删除</span>
            </span>
        </template>
        <van-popup
            v-model="show"
            closeable
            close-icon="close"
            position="bottom"
            get-container="body"
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
    </van-swipe-cell>

</template>

<script>
import SubscribeButton from '@/views/Competition/Components/SubscribeButton'
import OnLiveButton from '@/components/OnLiveButton'
import LiveHostCard from '@/components/LiveHostCard'
import dayjs from 'dayjs'
import { matchStatus } from '@/utils/utils'
import { Toast, Popup, SwipeCell, Button } from 'vant'
import { addSubscribeMatch } from '@/api/competition'
import { statusCode } from '@/utils/statusCode'
import { mapState } from 'vuex'

export default {
    name: 'SwipeCompetitionCard',
    filters: {
        filterStatus (state) {
            return matchStatus[state]
        }
    },
    components: {
        SubscribeButton,
        OnLiveButton,
        LiveHostCard,
        [SwipeCell.name]: SwipeCell,
        [Button.name]: Button,
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
        startTime () {
            return this.competition.matchTime && dayjs(this.competition.matchTime).format('HH:mm')
        },
        isGoing () {
            return [1, 2, 3, 4, 5].includes(this.competition.state)
        },
        middleStatus () {
            // 比赛中时，展示时间，其他展示 状态
            return this.isGoing ? this.competition.timing + '`' : matchStatus[this.competition.state]
        },
        isSubscribe () {
            return this.competition.appointment * 1 === 1
        },
        isFuture () {
            return this.competition.state === 0 // 未开始
        },
        hasLive () {
            // 是否有直播
            return this.competition.anchor_list && this.competition.anchor_list.length
        },
        homeIcon () {
            return this.competition.homeLogo || this.emptyImg
        },
        awayIcon () {
            return this.competition.awayLogo || this.emptyImg
        }
    },
    methods: {
        changeStatus () {
            this.$emit('update:appointment', this.isSubscribe ? 2 : 1)
        },
        async subscribeHost () {
            if (!this.token) {
                Toast('请先登录')
                return
            }
            try {
                const { code, msg } = await addSubscribeMatch(this.competition.matchId, this.competition.leagueType)
                if (code === statusCode.success) {
                    Toast(msg)
                    this.$emit('update:appointment', this.isSubscribe ? 2 : 1)
                    this.$emit('deleteItem', this.competition.matchId)
                } else {
                    Toast(msg)
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        openPopup () {
            this.show = true
            // if (this.competition.anchor_list.length === 1) {
            //     this.enterLiveRoom(this.competition, this.competition.anchor_list[0])
            // } else if (this.competition.anchor_list.length > 1) {
            //     this.show = true
            // }
        }
    }
}
</script>

<style lang="scss" scoped>
.row {
    width: 360px;
    margin: 0 auto;
    .left-time {
        width: 60px;
        height: 50px;
        .league-type{
            line-height: 20px;
            height: 20px;
            border-radius: 3px;
            color: #2B8ED4;
            border: 1px solid #2B8ED4;
        }
    }
    .right-buttons{
        width: 66px;
        .border {
            min-height: 50px;
            width: 1px;
            background-color: #D8D8D8;
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
    }
}
.middle {
    .upper-info {
        color: #999;
        line-height: 14px;
        .penalty {
            .card {
                padding: 0 2px;
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
        .half {
            .number {
                display: inline-block;
                width: 18px;
                text-align: center;
            }
        }
    }
    .team-info{
        line-height: 17px;
        height: 17px;
        .team-icon {
            width: 15px;
            height: 15px;
            background-color: #eee;
        }
        .score {
            width: 20px;
            height: 17px;
        }
        .team {
            width: calc(50% - 15px);
        }
        .name {
            width: 60px;
        }
        .status {
            width: 30px;

            color: #B7B7B7;
            .delay-time {
                background-color: #EFEFEF;
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
    }
}
.delete-button {

    width: 25px;
    height: 50px;
    text-align: center;
    background: #F7464E;
    border-radius: 3px;
    .text {
        writing-mode:vertical-rl;
        line-height: 25px;
    }
}
</style>
