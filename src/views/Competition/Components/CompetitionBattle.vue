<template>
    <div class="item-container">
        <div class="item">
            <div class="item-wrapper">
                <div class="item-aside-left">
                <span
                    class="match-title font-12"
                    :style="{backgroundColor: battle.color}"
                >{{ battle.leagueChsShort }}</span>
                </div>
                <div class="item-main">
                    <div class="match-info">
                        <span class="match-time">{{ battle.matchTime | changeTime }}</span>
                        <p>
                            <span class="score">半:{{ battle.homeHalfScore }}-{{ battle.awayHalfScore }}</span>
                            <span class="score">角:{{ battle.homeCorner }}-{{ battle.awayCorner }}</span>
                        </p>
                    </div>
                    <div class="match-team">
                        <div class="team home-team font-12">
                            <span class="error-num num m-r-2" v-if="battle.homeRed">{{ battle.homeRed }}</span>
                            <span class="warn-num num" v-if="battle.homeYellow">{{ battle.homeYellow }}</span>
                            {{ battle.homeChs.substring(0, 4) }}
                            <img  v-lazy="homeLogo" />
                        </div>
                        <div class="team team-score font-12 ">
                            <span class="w-18 text-center d-inline-block">{{ battle.homeScore }}</span>
                            <span class="schedule-status font-medium" :style="[1, 2, 3, 4, 5].includes(battle.state)&&{color:'#f26161'}">
                                {{ [1, 2, 3, 4, 5].includes(battle.state) ? battle.timing + "`" : matchStatus[battle.state] }}
                            </span>
                            <span class="w-18 text-center d-inline-block">{{ battle.awayScore }}</span>
                        </div>
                        <div class="team away-team font-12">
                            <img v-lazy="awayLogo" />
                            {{ battle.awayChs.substring(0, 4) }}
                            <span class="warn-num num m-r-2" v-if="battle.awayYellow">{{ battle.awayYellow }}</span>
                            <span class="error-num num" v-if="battle.awayRed">{{ battle.awayRed }}</span>
                        </div>
                    </div>
                </div>
                <div class="item-aside-right">
                    <div v-if="battle.state === '-1' ||  battle.state === -1">
                        <!--完场-->
                    </div>
<!--                    有直播-->
                    <div class="action-btn on-live font-12" v-if="battle.anchor_list.length > 0" @click="getLive">直播中
                    </div>
                    <div v-else>
<!--                        只有未开的才展示 预约-->
                        <div class="action-btn"
                             v-if="battle.state === 0"
                             @click="subscribeHost"
                             :class="battle.appointment == 1 ? 'followed' : 'un-followed'"
                        >
                            <!--进行中 优先展示直播列表 - 预约状态-->
                            {{ battle.appointment == 1 ? '已预约' : '预约' }}
                        </div>
                        <div
                            class="action-btn other-status font-12"
                            v-else
                        >
                            {{battle.state | getStatus}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { matchStatus } from '@/utils/utils'
import { addSubscribeMatch } from '@/api/competition'
import { Icon, Toast } from 'vant'
import dayjs from 'dayjs'
import { statusCode } from '@/utils/statusCode'
import { getItem } from '@/utils/cookie'
export default {
    name: 'CompetitionBattle',
    data () {
        return {
            matchStatus,
            loginToken: ''
        }
    },
    filters: {
        timeFilter (value) {
            return dayjs(value).format('HH:mm')
        },
        changeTime (val) {
            var time = new Date(val)
            var h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
            var m = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
            return h + ':' + m
        },
        getStatus (val) {
            switch (val) {
            case 0: // 未开
                val = '未'
                return val
            case 1: // 上半场
                val = '上半'
                return val
            case 2: // 中场
                val = '中场'
                return val
            case 3: // 下半场
                val = '下半'
                return val
            case 4: // 加时
                val = '加时'
                return val
            case 5: // 点球
                val = '点球'
                return val
            case -1: // 完场
                val = '完'
                return val
            case -10: // 取消
                val = '取消'
                return val
            case -11: // 待定
                val = '待定'
                return val
            case -12: // 腰斩
                val = '腰斩'
                return val
            case -13: // 中断
                val = '中断'
                return val
            case -14: // 推迟
                val = '推迟'
                return val
            default:
                break
            }
        }
    },
    components: {
        [Icon.name]: Icon,
        [Toast.name]: Toast
    },
    props: {
        battle: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        isGoing () {
            return !this.isNotStart && !this.isEnd
        },
        isEnd () {
            return this.battle.state * 1 === -1
        },
        isNotStart () {
            // 未开始
            // eslint-disable-next-line eqeqeq
            return this.battle.state * 1 === 0
        },
        isAppointment () {
            // eslint-disable-next-line eqeqeq
            return this.battle.appointment * 1 === 1
        },
        hasHosts () {
            return !!this.battle.anchor_list.length
        },
        statusString () {
            return this.isNotStart ? (this.isAppointment ? '已预约' : '预约') : matchStatus[this.battle.state]
        },
        hostIcon () {
            return require('../../../assets/images/chat/user-logo.jpeg')
        },
        homeLogo () {
            return this.battle.homeLogo ? this.battle.homeLogo : require('../../../assets/images/common/team-flag.png')
        },
        awayLogo () {
            return this.battle.awayLogo ? this.battle.awayLogo : require('../../../assets/images/common/team-flag.png')
        }
    },
    created () {
        this.loginToken = getItem('token')
    },
    methods: {
        getLive () {
            this.$emit('chooseLive')
        },
        async subscribeHost () {
            if (!this.loginToken) {
                Toast('请先登录')
                return
            }
            try {
                const { code, msg } = await addSubscribeMatch(this.battle.matchId, this.battle.leagueType)
                if (code === statusCode.success) {
                    // console.log('this is msg', msg)
                    Toast(msg)
                    this.$emit('refresh')
                } else {
                    Toast(msg)
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        goToLiveRoom (anchor) {
            this.$router.push({
                name: 'Broadcast',
                params: {
                    id: this.battle.matchId // 此id只是用来更新页面的
                },
                query: { room_id: anchor.room_id }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/theme/default-vars.scss';

    .item-container {
        background-color: #f8f8f8;
        width: 100%;
    }

    .item {
        background-color: #fff;
        margin-bottom: 5px;
        padding-bottom: 10px;
        .item-wrapper {
            // width: 95%;
            margin: 0 auto;
            position: relative;
            // display: flex;
            // justify-content: space-evenly;
        }

        .item-aside-left {
            position: absolute;
            .match-title {
                width: 50px;
                height: 14px;
                background-color: #d93232;
                color: #fff;
                text-align: center;
                display: inline-block;
                border-radius: 3px;
                margin-top: 4px;
                margin-left: 3px;
            }
        }

        .item-main {
            position: relative;
            width: 100%;
            display: inline-block;
            .match-info {
                margin-top: 6px;
                font-size: 10px;
                margin-bottom: 8px;

                .match-time {
                    position: absolute;
                    left: 58px;
                    top: 5px;
                    color: #999;
                }

                p {
                    display: inline-block;
                    width: 100%;
                    text-align: center;
                    color: #999;

                    .score {
                        margin-right: 3px;
                        margin-left: 3px;
                    }
                }
            }

            .match-team {
                margin-bottom: 15px;
                color: #333;
                width: 93%;
                margin:0 auto;
                .team{
                    display: inline-block;
                }
                .home-team, .away-team{
                    width: 35%;
                    text-align: center;
                }
                .home-team{
                    text-align: right;
                }
                .away-team{
                    text-align: left;
                }
                .team-score{
                    text-align: center;
                    margin: 0 5px;
                }
                .w-18{
                    width: 18px;
                }
                .num {
                    width: 7px;
                    height: 9px;
                    border-radius: 1px;
                    color: #fff;
                    padding: 1px 2px;
                    border-radius: 2px;
                }

                .warn-num {
                    background-color: #ffc460;
                }

                .error-num {
                    background-color: #ff5b5d;
                }

                .m-r-2{
                    margin-right: 2px;
                }

                img {
                    vertical-align: middle;
                    width: 15px;
                    height: 15px;
                }

                .schedule-status {
                    text-align: center;
                    background-color: #efefef;
                    color: #B7B7B7;
                    border-radius: 3px;
                    width: 30px;
                    display: inline-block;
                }
            }
        }

        .item-aside-right {
            position: absolute;
            right: 10px;
            top: 16px;
            .action-btn {
                scale: .8;
                font-size: 12px;
                width: 48px;
                height: 23px;
                line-height: 23px;
                border-radius: 3px;
                text-align: center;
            }

            .action-btn-h{
                opacity: .8;
            }

            .on-live {
                background-color: #e7464e;
                color: #fff;
            }

            .followed {
                opacity: .8;
                background-color: #fff;
                color: #4164FF;
            }

            .un-followed {
                color: #fff;
                background-color: #4164FF;
            }

            .other-status {
                color: #B9B9B9;
            }
        }
    }

    // .card {
    //     width: 355px;
    //     height: 80px;
    //     border: 1px solid $un-active-color;
    //     border-radius: 4px;
    //     font-size: 13px;
    //     .team-info {
    //         width: 100px;
    //       .team-name {
    //         width: 65px;
    //       }
    //       .team-icon {
    //         width: 18px;
    //         height: 18px;
    //         border: 1px solid #E4E4E4;
    //         border-radius: 50%;
    //         display: inline-block;
    //         .bg {
    //           display: inline-block;
    //           width: 16px;
    //           height: 16px;
    //           border-radius: 50%;
    //           background-position: center;
    //           background-repeat: no-repeat;
    //           background-size: 100% 100%;
    //         }
    //       }
    //     }
    //     .score {
    //         width: 35px;
    //     }
    //     .score-time {
    //         .battle-time {
    //             line-height: 20px;
    //             height: 20px;
    //         }
    //        .battle-status {
    //            line-height: 26px;
    //            width: 70px;
    //            text-align: center;
    //            border-radius: 15px;
    //            color: $active-color;
    //            border: 1px solid $active-color;
    //            &.is-end{
    //                border-color: $border-gray;
    //                color: $border-gray;
    //            }
    //        }
    //     }
    //     .host{
    //         width: 80px;
    //         border-left: 1px solid $un-active-color;
    //         .anchors {
    //           width: 100%;
    //           overflow-x: auto;
    //           .anchors-box{
    //               width: fit-content;
    //           }
    //         .item {
    //           width: 20px;
    //           height: 20px;
    //         }
    //       }
    //     }
    // }
</style>
