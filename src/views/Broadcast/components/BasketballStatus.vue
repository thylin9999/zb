<template>
    <div class="page h-100">
        <div class="score-table font-12 font-400 text-white p-l-10 p-r-10 flex flex-column">
            <div class="title-row p-t-15 p-b-5 flex align-center justify-between">
                <span class="team-info p-l-5">
                    球队
                </span>
                <div class="scores flex-1 flex align-center">
                    <span>一</span>
                    <span>二</span>
                    <span>三</span>
                    <span>四</span>
                    <span v-if="isOT1">OT</span>
                    <span>总分</span>
                </div>
            </div>
            <div class="team-row m-t-5 flex align-center justify-between">
                <span class="team-info home p-l-5">
                    {{ matchInfo.homeChs }}
                </span>
                <div class="scores flex-1 flex align-center">
                    <span>{{  matchInfo.home1 }}</span>
                    <span>{{  matchInfo.home2 }}</span>
                    <span>{{  matchInfo.home3 }}</span>
                    <span>{{  matchInfo.home4 }}</span>
                    <span v-if="isOT1">{{  matchInfo.home4 }}</span>
                    <span>{{ matchInfo.homeScore }}</span>
                </div>
            </div>
            <div class="team-row m-t-5 flex align-center justify-between">
                <span class="team-info away p-l-5">
                    {{ matchInfo.awayChs }}
                </span>
                <div class="scores flex-1 flex align-center">
                    <span>{{  matchInfo.away1 }}</span>
                    <span>{{  matchInfo.away2 }}</span>
                    <span>{{  matchInfo.away3 }}</span>
                    <span>{{  matchInfo.away4 }}</span>
                    <span v-if="isOT1">{{  matchInfo.away1 }}</span>
                    <span>{{ matchInfo.awayScore }}</span>
                </div>
            </div>
        </div>
        <div class="tabs m-t-15 flex  justify-center"
            :class="`tab${currentTab}`"
        >
            <span
                class="tab font-12 font-500 text-center"
                :class="{
                    'is-active': tab.id === currentTab
                }"
                v-for="(tab) in tabs"
                :key="tab.key"
                @click="setTab(tab)"
            >{{  tab.label }}</span>
        </div>
        <div class="body">
            <TextLive
                v-if="isTextLine && matchInfo"
                :match-info="matchInfo"
                :matchId="matchInfo.matchId"
            />
            <div class="statistics" v-if="statistics && isStatistic">
                <div>
                    <TeamWithIcon
                        :match-info="matchInfo"
                    />
                </div>
                <Statistic
                    :statistics="statistics"
                />
            </div>

        </div>
    </div>
</template>

<script>
import { getMatchInfo } from '../../../api/competition'
import TextLive from './basketball/TextLive.vue'
import Statistic from './football/Statistic.vue'
import TeamWithIcon from './TeamWithIcon.vue'
import { Progress } from 'vant'
export default {
    name: 'BasketballStatus',
    components: {
        TextLive,
        Statistic,
        TeamWithIcon,
        [Progress.name]: Progress
    },
    props: {
        matchId: {
            type: [Number, String],
            default: null
        }
    },
    data () {
        return {
            matchStatusInfo: null,
            currentTab: 1,
            tabs: [
                {
                    id: 1,
                    key: 'text',
                    label: '文字直播',
                    comName: ''
                },
                {
                    id: 2,
                    key: 'technology',
                    label: '技术统计',
                    comName: ''
                }
            ]
        }
    },
    computed: {
        matchInfo () {
            return (this.matchStatusInfo && this.matchStatusInfo.matchInfo) || {}
        },
        statistics () {
            const statistics = this.matchStatusInfo && this.matchStatusInfo.statistics
            if (statistics) {
                return {
                    score: {
                        event: '得分',
                        home_team: statistics.homeScore,
                        away_team: statistics.awayScore
                    },
                    fastScore: {
                        event: '快攻得分',
                        home_team: statistics.homeFast,
                        away_team: statistics.awayFast
                    },
                    scoreInside: {
                        event: '内线得分',
                        home_team: statistics.homeInside,
                        away_team: statistics.awayInside
                    },
                    scoreExceed: {
                        event: '最多领先分数',
                        home_team: statistics.homeExceed,
                        away_team: statistics.awayExceed
                    },
                    totalmis: {
                        event: '总失误',
                        home_team: statistics.homeTotalmis,
                        away_team: statistics.awayTotalmis
                    }
                }
            } else {
                return null
            }
        },
        isStatistic () {
            return this.currentTab === 2
        },
        isTextLine () {
            return this.currentTab === 1
        },
        isOT1 () { // 加时赛1的主客队比分不为空
            return this.matchStatusInfo && this.matchStatusInfo.matchInfo?.homeOT1 !== 0 && this.matchStatusInfo.matchInfo?.awayOT1 !== 0
        }
    },
    created () {
        this.init()
    },
    methods: {
        async init () {
            try {
                const { data } = await getMatchInfo('basketball', this.matchId)
                // const { code, data } = await getMatchInfo('basketball', '523978')
                this.matchStatusInfo = data
            } catch (e) {
                console.log(e, '出错了')
            }
        },
        setTab (tab) {
            this.currentTab = tab.id
        }
    }
}

</script>

<style lang="scss" scoped>
.page {
    background-color: #2B1845;
    .score-table {
        .team-info {
            width: 110px;
            &.home {
                border-left: 5px solid #FF5B5D;
            }
            &.away {
                border-left: 5px solid #3DB1FB;
            }
        }
        .title-row {
            border-bottom: 1px solid #fff;
        }
    }
    .scores {
        span {
            flex: 1;
            text-align: center;
        }
    }

    .tabs {
        height: 80px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-color: #0E0E23;
        &.tab1 {
            background-image: url('../../../assets/images/liveroom/2tab1.png');
        }
        &.tab2 {
            background-image: url('../../../assets/images/liveroom/2tab2.png');
        }
        .tab {
            color: #6C73AF;
            width: 160px;
            margin-top: 13px;
            &.is-active {
                color: #00E1FD;
            }
        }
    }
}
.body {
    margin-top: -30px;
    height: calc(100% - 138px);
    .statistics {
        padding: 0 35px;
    }
}
</style>
