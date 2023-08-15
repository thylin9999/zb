<template>
    <div class="h-100 overflow-y-auto">
        <div class="charts ">
            <template>
                <div class="flex align-center justify-center p-t-30 p-b-30 overflow-hidden">
                    <div
                        v-for="(item) in circleStatistics"
                        :key="item.key"
                        class="circle-item flex align-center p-l-15 p-r-15 font-12 font-500 text-white"
                    >
                        <span>{{ item.home_team }}</span>
                        <div class="circle m-l-10 m-r-10">
                            <circle-chart
                                :label="item.label"
                                :clockwise="item.awayVal > item.homeVal"
                                :rate-value="item.rateValue"
                                :percent="item.percent"
                                :color="item.awayVal < item.homeVal ? '#FB7775' : '#3DB1FB'"
                            />
                        </div>
                        <span>{{ item.away_team }}</span>
                    </div>
                </div>
                <div class="">
                    <div v-if="attack" class="row flex align-center justify-center">
                        <div class="left p-relative">
                        <div class="p-absolute label">
                                <span class="score">
                                    <IconPng
                                        class=""
                                        icon="liveroom/corner"
                                        :width="12"
                                        :height="13"
                                    />
                                </span>
                                <span class="score">
                                    <IconPng
                                        class=""
                                        icon="liveroom/red"
                                        :width="12"
                                        :height="13"
                                    />
                                </span>
                                <span class="score">
                                    <IconPng
                                        icon="liveroom/yellow"
                                        :width="12"
                                        :height="13"
                                    />
                                </span>
                        </div>
                        </div>
                        <div class="middle m-l-5 m-r-5 flex flex-column">
                            <div class="label w-100 text-center">
                                <span class="font-12 text-white">{{ attack.home_team }}</span>
                                <span class="font-12 m-r-10 m-l-10 font-400 text-primary">进攻</span>
                                <span class="font-12 text-white">{{ attack.away_team }}</span>
                            </div>
                            <div class="progress">
                                <van-progress
                                    :percentage="attack.percent"
                                    :show-pivot="false"
                                />
                            </div>
                        </div>
                        <div class="right p-relative">
                            <div class="p-absolute label">
                                <span class="score">
                                    <IconPng
                                        icon="liveroom/yellow"
                                        :width="12"
                                        :height="13"
                                    />

                                </span>
                                <span class="score">
                                    <IconPng
                                        class=""
                                        icon="liveroom/red"
                                        :width="12"
                                        :height="13"
                                    />

                                </span>
                                <span class="score">
                                    <IconPng
                                        class=""
                                        icon="liveroom/corner"
                                        :width="12"
                                        :height="13"
                                    />
                                </span>
                            </div>

                        </div>
                    </div>
                    <div v-if="dangeAttack && matchInfo" class="row flex align-center justify-center">
                        <div class="left font-12 text-white font-500 p-relative">
                            <div class="p-absolute label">
                                <span class="score">{{ matchInfo.homeCorner }}</span>
                                <span class="score">{{ matchInfo.homeRed }}</span>
                                <span class="score">{{ matchInfo.homeYellow || matchInfo.HomeYellow }}</span>
                            </div>
                        </div>
                        <div class="middle flex flex-column">
                            <div class="label w-100 text-center">
                                <span class="font-12 text-white">{{ dangeAttack.home_team}}</span>
                                <span class="font-12 m-r-10 m-l-10 font-400 text-primary">危险进攻</span>
                                <span class="font-12 text-white">{{ dangeAttack.away_team}}</span>
                            </div>
                            <div class="progress">
                                <van-progress
                                    :percentage="dangeAttack.percent"
                                    :show-pivot="false"
                                />
                            </div>
                        </div>
                        <div class="right font-12 text-white font-500 p-relative">
                            <div class="p-absolute label">
                                <span class="score">{{ matchInfo.awayYellow }}</span>
                                <span class="score">{{ matchInfo.awayRed }}</span>
                                <span class="score">{{ matchInfo.awayCorner }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <!-- <NoData
                class="flex flex-column align-center p-b-10"
                v-else
                :width="150"
                :height="140"
            /> -->
        </div>
        <div class="body">
            <div class="tabs m-t-5 flex  justify-center"
                :class="`tab${tabIndex}`"
            >
                <span
                    class="tab font-12 font-500 text-center"
                    :class="{
                        'is-active': tab.key === currentTab
                    }"
                    v-for="(tab, index) in tabs"
                    :key="tab.key"
                    @click="setTab(tab, index)"
                >{{  tab.label }}</span>
            </div>
            <div class="content">
                <div v-if="tabIndex !== 2 && matchInfo">
                    <TeamWithIcon
                        :match-info="matchInfo"
                    />
                </div>
                <Events
                    v-if="events && isEvent"
                    :events="events"
                />
                <TextLive
                    v-if="isTextLine && matchInfo"
                    :key="currentTab"
                    :match-info="matchInfo"
                    :match-id="matchId"
                />
                <Statistic
                    v-if="statistics && isStatistic"
                    :statistics="statistics"
                />
                <div class="weather" v-if="matchInfo">
                    <span v-if="matchInfo.temp && matchInfo.locationCn && matchInfo.weatherCn">
                        {{ matchInfo.temp }}（{{ matchInfo.locationCn }}）,{{ matchInfo.weatherCn }}
                    </span>
                    <span v-else>
                        暂无天气数据
                    </span>
                </div>
            </div>
        </div>
        <div  class="footer m-t-5">
            <IconWithLabel />
        </div>
    </div>
</template>

<script>
import { getMatchInfo } from '../../../api/competition'
import CircleChart from '../../../components/charts/CircleChart.vue'
import { percentToNum } from '../../../utils/utils'
import IconWithLabel from './IconWithLabel.vue'
import IconPng from '@/components/IconPng'
import TeamWithIcon from './TeamWithIcon.vue'
import Events from './football/Events.vue'
import TextLive from './football/TextLive.vue'
import Statistic from './football/Statistic.vue'
// import NoData from '../../../components/NoData.vue'
import { Progress } from 'vant'
export default {
    name: 'FootballStatus',
    components: {
        CircleChart,
        IconWithLabel,
        IconPng,
        [Progress.name]: Progress,
        TeamWithIcon,
        Events,
        TextLive,
        Statistic
        // NoData
    },
    props: {
        matchId: {
            type: [Number, String],
            default: null
        }
    },
    data () {
        return {
            matchStatusInfo: [],
            currentTab: 'event',
            tabIndex: 1,
            tabs: [
                {
                    key: 'event',
                    label: '关键事件',
                    comName: ''
                },
                {
                    key: 'text',
                    label: '文字直播',
                    comName: ''
                },
                {
                    key: 'technology',
                    label: '技术统计',
                    comName: ''
                }
            ]
        }
    },
    computed: {
        statistics () {
            return this.matchStatusInfo && this.matchStatusInfo.statistics
        },
        circleStatistics () {
            // 射门， 射正， 控球率
            let res = []
            if (this.statistics) {
                Object.entries(this.statistics).forEach(([key, value]) => {
                    if ([3, 4, 14].includes(key * 1)) {
                        // 表示需要填入
                        const homeVal = percentToNum(value.home_team) * 1 || 0
                        const awayVal = percentToNum(value.away_team) * 1 || 0
                        const rateValue = homeVal > awayVal ? homeVal : awayVal
                        res.push({
                            key,
                            ...value,
                            label: value.event.slice(0, 2),
                            rate: homeVal + awayVal,
                            rateValue: rateValue,
                            percent: Math.floor((rateValue / (homeVal + awayVal)) * 100),
                            homeVal: homeVal,
                            awayVal: awayVal
                        })
                    }
                })
            } else {
                res = [
                    {
                        away_team: '0',
                        event: '射门次数',
                        home_team: '0',
                        key: '1',
                        label: '射门',
                        rate: 0,
                        rateValue: 0,
                        percent: 0,
                        homeVal: 0,
                        awayVal: 0
                    },
                    {
                        away_team: '0',
                        event: '射正次数',
                        home_team: '0',
                        key: '2',
                        label: '射正',
                        rate: 0,
                        rateValue: 0,
                        percent: 0,
                        homeVal: 0,
                        awayVal: 0
                    },
                    {
                        away_team: '0',
                        event: '控球率',
                        home_team: '0',
                        key: '3',
                        label: '控球',
                        rate: 0,
                        rateValue: 0,
                        percent: 0,
                        homeVal: 0,
                        awayVal: 0
                    }
                ]
            }
            return res
        },
        attack () {
            const statistics = this.statistics && this.statistics['43']
            return this.statistics ? {
                ...statistics,
                percent: statistics.home_team * 100 / (statistics.home_team * 1 + statistics.away_team * 1)
            } : {
                away_team: '0',
                event: '进攻次数',
                home_team: '0',
                percent: 0
            }
        },
        dangeAttack () {
            const statistics = this.statistics && this.statistics['44']
            return this.statistics ? {
                ...statistics,
                percent: statistics.home_team * 100 / (statistics.home_team * 1 + statistics.away_team * 1)
            } : {
                away_team: '0',
                event: '危险进攻次数',
                home_team: '0',
                percent: 0

            }
        },
        matchInfo () {
            return this.matchStatusInfo && this.matchStatusInfo.matchInfo
        },
        events () {
            return this.matchStatusInfo && this.matchStatusInfo.event
        },
        isEvent () {
            return this.currentTab === 'event'
        },
        isStatistic () {
            return this.currentTab === 'technology'
        },
        isTextLine () {
            return this.currentTab === 'text'
        }
    },
    created () {
        this.init()
    },
    methods: {
        async init () {
            try {
                const { data } = await getMatchInfo('football', this.matchId)
                this.matchStatusInfo = data || []
            } catch (e) {
                console.log(e, '出错了')
            }
        },
        setTab (tab, index) {
            this.tabIndex = index + 1
            this.currentTab = tab.key
        }
    }
}

</script>

<style lang="scss" scoped>
.circle-item{
    .circle {
        width: 45px;
        height: 45px;
    }
    &:nth-child(2n) {
        position: relative;
        &:after {
            position: absolute;
            right: 0;
            top: 7px;
            content: '';
            width: 1px;
            height: 30px;
            background-color: #6C73AF;
        }
        &:before {
            position: absolute;
            left: 0;
            top: 7px;
            content: '';
            width: 1px;
            height: 30px;
            background-color: #6C73AF;
        }
    }
}
.charts {
    background-color: #2B1845;
    height: 165px;
}
.body {
    min-height: calc(100% - 290px);
    .tabs {
        height: 80px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        &.tab1 {
            background-image: url('../../../assets/images/liveroom/tab1.png');
        }
        &.tab2 {
            background-image: url('../../../assets/images/liveroom/tab2.png');
        }
        &.tab3 {
            background-image: url('../../../assets/images/liveroom/tab3.png');
        }
        .tab {
            color: #6C73AF;
            width: 100px;
            margin-top: 13px;
            &.is-active {
                color: #00E1FD;
            }
        }
    }
    .content {
        // min-height: calc(100% - 80px);
        margin-top: -35px;
        padding: 0 35px;
        background-color: #2B1845;
        padding-bottom: 10px;
        min-height: 110px;
    }
}

.row {
    .middle {
        width: 160px;
    }
    .left, .right {
        width: calc(50% - 80px);
        height: 25px;
        display: flex;
        align-items: center;
        .label {
            top: 15px;
            line-height: 14px;
            span.score {
                width: 30px;
                text-align: center;
                display: inline-block;
            }
        }
    }
    .left {
        .label {
            right: 0;
        }
    }
    .right {
        .label {
            left: 0;
        }
    }
}
.weather{
    width: 300px;
    height: 52px;
    line-height: 52px;
    background: #30366A;
    border-radius: 3px;
    font-size: 12px;
    color: #6C73AF;
    text-align: center;
    margin-top: 10px;
}
</style>
