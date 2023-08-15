<template>
    <div class="page p-t-15">
        <div class="charts p-l-30 p-b-20 p-r-30">
            <TeamWithIcon
                :match-info="matchInfo"
            />
            <div class="max-charts" v-if="showChart && showIds.length">
                <div v-for="item in  maxTotal" :key="item.key"
                    class="m-t-10"
                >
                    <template
                    >
                        <div class="upper flex align-center justify-between">
                            <span class="icon  d-inline-block bg-center bg-no-repeat bg-size-cover"
                                :style="{
                                    backgroundImage: `url(${homeIds[homeMax[item.key].playerId].photo})`
                                }"
                            >
                            </span>
                            <div class="middle-chart flex align-center ">
                                <div class="home h-100 flex-1 p-relative">
                                    <span class="font-12 label p-absolute font-500"
                                        :style="{
                                            color: '#FF5B5D',
                                            top: homeMax[item.key][item.key] / item.total * 25 + 'px'
                                        }"
                                    >{{ homeMax[item.key][item.key]  }}</span>
                                    <span class="bar p-absolute d-inline-block"
                                        :style="{
                                            width: '13px',
                                            bottom: 0,
                                            backgroundColor: '#FF5B5D',
                                            height: homeMax[item.key][item.key] / item.total * 50 + 'px'
                                        }"
                                    ></span>
                                </div>
                                <div class="away m-l-5  h-100 flex-1 p-relative"

                                >
                                    <span class="bar p-absolute d-inline-block"
                                        :style="{
                                            bottom: 0,
                                            width: '13px',
                                            backgroundColor: '#3DB1FB',
                                            height: awayMax[item.key][item.key] / item.total * 50 + 'px'
                                        }"
                                    ></span>
                                    <span
                                        class="font-12 p-absolute label font-500"
                                        :style="{
                                            color: '#3DB1FB',
                                            top: homeMax[item.key][item.key] / item.total * 25 + 'px'
                                        }"
                                    >{{ awayMax[item.key][item.key]  }}</span>

                                </div>
                            </div>
                            <span class="icon  d-inline-block bg-center bg-no-repeat bg-size-cover"
                                :style="{
                                    backgroundImage: `url(${awayIds[awayMax[item.key].playerId].photo})`
                                }"
                            >
                            </span>
                        </div>
                        <div class="lower flex font-12 font-400 text-white align-center justify-between">
                            <span class="flex-1 text-ellipsis d-inline-block">{{ homeMax[item.key].playerCht }}</span>
                            <div class="middle">
                                <span class="w-100 d-inline-block">{{ item.label }}</span>
                            </div>
                            <span class="flex-1 text-right text-ellipsis d-inline-block">{{ awayMax[item.key].playerCht }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="tabs  flex  justify-center"
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
        <div class="table flex  font-12 font-500 text-white" v-if="matchStatusInfo">
            <div class="left fixed flex  text-center">
                <div class="column flex flex-column"
                    v-for="column in fixedColumns"
                    :key="column.prop"
                    :class="`${column.class}`"
                >
                    <span class="head row p-l-5 p-r-5" :class="`text-${column.align || 'center'}`">{{ column.label }}</span>
                    <template
                        v-for="(player, index) in showList"
                    >
                        <span :key="player.playerId" v-if="column.prop === 'playerId'" class="row text-ellipsis p-l-5 p-r-5"
                            :class="`text-${column.align || 'center'} ${index % 2 === 1 ? 'is-striped' : ''}`"
                        >{{  showIds.length ? showIds[player[column.prop]].number : '-' }}</span>
                        <span :key="player.playerId" v-else class="row text-ellipsis p-l-5 p-r-5"
                            :class="`text-${column.align || 'center'} ${index % 2 === 1 ? 'is-striped' : ''}`"
                        >{{  player[column.prop]  }}</span>
                    </template>
                    <span v-show="column.showAll" class="column row p-l-5 p-r-5">全部</span>
                </div>
            </div>
            <div class="right-columns flex">
                <div class="column flex flex-column "
                    v-for="column in showColumns"
                    :key="column.prop"
                >
                    <span class="head row p-l-5 p-r-5" :class="`text-${column.align || 'center'}`">{{ column.label }}</span>
                    <template
                        v-for="(player, index) in showList"

                    >
                        <template v-if="column.prop === 'isFirst'">
                            <span class="row p-l-5 p-r-5"
                            :key="player.playerId"
                                :class="`text-${column.align || 'center'} ${index % 2 === 1 ? 'is-striped' : ''}`"
                            >{{  showLineupIds.includes(player[column.prop]) ? '是' : '否'  }}</span>
                        </template>
                        <span v-else class="row p-l-5 p-r-5"
                        :key="player.playerId"
                            :class="`text-${column.align || 'center'} ${index % 2 === 1 ? 'is-striped' : ''}`"
                        >{{  player[column.prop]  }}</span>

                    </template>
                    <span class="row p-l-5 p-r-5 text-center">{{  total[column.prop+'Total'] }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getMatchInfo } from '@/api/competition'
import TeamWithIcon from '../TeamWithIcon'
export default {
    name: 'BasketballLineup',
    components: {
        TeamWithIcon
    },
    props: {
        matchId: {
            type: [Number, String],
            default: null
        },
        lineupData: {
            type: Object,
            default: () => ({})
        },
        roomInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            showChart: false,
            matchStatusInfo: null,
            currentTab: 1,
            tabs: [
                {
                    id: 1,
                    key: 'home',
                    label: '主队统计',
                    comName: ''
                },
                {
                    id: 2,
                    key: 'away',
                    label: '客队统计',
                    comName: ''
                }
            ],
            columns: [
                {
                    id: 1,
                    prop: 'playerId',
                    label: '#',
                    isFixed: true,
                    width: 35,
                    notTotal: true
                },
                {
                    id: 2,
                    prop: 'playerCht',
                    label: '球员',
                    align: 'left',
                    class: 'flex-1',
                    isFixed: true,
                    notTotal: true,
                    showAll: true
                },
                {
                    id: 3,
                    prop: 'isFirst',
                    label: '首发',
                    notTotal: true
                },
                {
                    id: 4,
                    prop: 'playtime',
                    label: '上场时间'
                },
                {
                    id: 5,
                    prop: 'score',
                    label: '得分'
                },
                {
                    id: 6,
                    prop: 'shootPercent',
                    label: '投篮数'
                },
                {
                    id: 8,
                    prop: 'threePointPercent',
                    label: '三分'
                },
                {
                    id: 10,
                    prop: 'freeThrowPercent',
                    label: '罚球'
                },
                {
                    id: 12,
                    prop: 'offensiveRebound',
                    label: '进攻篮板'
                },
                {
                    id: 13,
                    prop: 'defensiveRebound',
                    label: '防守篮板'
                },
                {
                    id: 14,
                    prop: 'assist',
                    label: '助攻'
                },
                {
                    id: 15,
                    prop: 'steal',
                    label: '抢断'
                },
                {
                    id: 16,
                    prop: 'block',
                    label: '盖帽'
                },
                {
                    id: 17,
                    prop: 'foul',
                    label: '犯规'
                },
                {
                    id: 18,
                    prop: 'turnover',
                    label: '失误'
                }
            ],
            homePlayers: [],
            awayPlayers: [],
            homeMax: {},
            awayMax: {},
            maxKeys: [
                {
                    key: 'score',
                    label: '得分'
                },
                {
                    key: 'rebound',
                    label: '篮板'
                },
                {
                    key: 'assist',
                    label: '助攻'
                }
            ] // 最值统计
        }
    },
    computed: {
        maxTotal () {
            if (this.showChart) {
                return this.maxKeys.reduce((all, item) => {
                    if (item.key !== 'rebound') {
                        const total = this.homeMax[item.key][item.key] * 1 > this.awayMax[item.key][item.key] * 1
                            ? this.homeMax[item.key][item.key] * 1
                            : this.awayMax[item.key][item.key] * 1
                        all.push({
                            ...item,
                            total
                        })
                    } else {
                        const homeRebound = this.homeMax[item.key].defensiveRebound * 1 + this.homeMax[item.key].offensiveRebound * 1
                        const awayRebound = this.awayMax[item.key].defensiveRebound * 1 + this.awayMax[item.key].offensiveRebound * 1
                        const total = homeRebound > awayRebound
                            ? homeRebound
                            : awayRebound
                        all.push({
                            ...item,
                            total
                        })
                    }
                    return all
                }, [])
            }
            return this.maxKeys
        },
        matchInfo () {
            return this.roomInfo && this.roomInfo.match_info
        },
        players () {
            return this.matchStatusInfo && {
                home: this.matchStatusInfo.homePlayerList,
                away: this.matchStatusInfo.awayPlayerList
            }
        },
        total () {
            const res = {}
            const keys = ['shoot', 'threePoint', 'freeThrow']
            this.showColumns.forEach(column => {
                if (!column.notTotal) {
                    // 统计
                    const key = column.prop + 'Total'
                    if (keys.includes(column.prop.replace('Percent', ''))) { // shoot threePoint freeThrow
                        // 分开累加
                        const _key = column.prop.replace('Percent', '')
                        const shootKey = _key === 'shoot' ? _key : _key + 'Shoot'
                        const hitKey = _key + 'Hit'
                        const sum = this.showList.reduce((all, item) => {
                            all.shoot += item[shootKey] * 1
                            all.hit += item[hitKey] * 1
                            return all
                        }, { shoot: 0, hit: 0 })
                        res[shootKey] = sum.shoot
                        res[hitKey] = sum.hit
                    } else {
                        res[key] = this.showList.reduce((all, item) => {
                            all += item[column.prop] * 1
                            return all
                        }, 0)
                    }
                }
            })
            // 缺少上面三个key
            keys.forEach(key => {
                const shootKey = key === 'shoot' ? key : key + 'Shoot'
                const hitKey = key + 'Hit'
                res[key + 'PercentTotal'] = `${res[hitKey]}/${res[shootKey]}`
            })
            return res
        },
        showLineupIds () {
            return this.currentTab === 1 ? this.homeLinupIds : this.awayLinupIds
        },
        showList () {
            return this.currentTab === 1 ? this.homePlayers : this.awayPlayers
        },
        fixedColumns () {
            return this.columns.filter(x => x.isFixed)
        },
        showColumns () {
            return this.columns.filter(x => !x.isFixed)
        },
        homeLinupIds () {
            return this.lineupData.homeLineup.reduce((all, item) => {
                all.push(item.playerId)
                return all
            }, [])
        },
        showIds () {
            return this.currentTab === 1 ? this.homeIds : this.awayIds
        },
        homeIds () {
            const players = [].concat(this.lineupData.homeLineup, this.lineupData.homeBackup)
            return players.reduce((all, item) => {
                const playerId = item.playerId
                if (!all[playerId]) {
                    all[playerId] = { ...item }
                }
                return all
            }, {})
        },
        awayIds () {
            const players = [].concat(this.lineupData.awayLineup, this.lineupData.awayBackup)
            return players.reduce((all, item) => {
                const playerId = item.playerId
                if (!all[playerId]) {
                    all[playerId] = { ...item }
                }
                return all
            }, {})
        },
        awayLinupIds () {
            return this.lineupData.awayLineup.reduce((all, item) => {
                all.push(item.playerId)
                return all
            }, [])
        }
    },
    created () {
        this.init()
    },
    methods: {
        async init () {
            try {
                const { data } = await getMatchInfo('basketball', this.matchId)
                // const {  data } = await getMatchInfo('basketball', 523978)
                this.matchStatusInfo = data
                this.homePlayers = this.handlePlayers(this.matchStatusInfo.homePlayerList, true)
                this.awayPlayers = this.handlePlayers(this.matchStatusInfo.awayPlayerList, false)
                this.showChart = true
            } catch (e) {
                console.log(e, '出错了')
            }
        },
        handlePlayers (list, isHome) {
            // 得分，篮板，助攻
            const max = {
                'score': null,
                'rebound': null,
                'assist': null
            }
            const res = list.reduce((all, item) => {
                const rebound = item.offensiveRebound * 1 + item.defensiveRebound * 1
                Object.keys(max).forEach(key => {
                    if (!max[key]) {
                        max[key] = item
                    } else {
                        // 比较。
                        const isBigger = key === 'rebound'
                            ? max[key].offensiveRebound * 1 + max[key].defensiveRebound * 1 < rebound
                            : max[key][key] * 1 < item[key]
                        if (isBigger) {
                            if (key === 'rebound') {
                                item.rebound = rebound
                            }
                            max[key] = item
                        }
                    }
                })
                all.push({
                    ...item,
                    shootPercent: `${item.shootHit}/${item.shoot}`,
                    threePointPercent: `${item.threePointHit}/${item.threePointShoot}`,
                    freeThrowPercent: `${item.freeThrowHit}/${item.freeThrowShoot}`
                })
                return all
            }, [])
            if (isHome) {
                this.homeMax = max
            } else {
                this.awayMax = max
            }

            return res
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
}
.tabs {
    height: 80px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-color: #0E0E23;
    &.tab1 {
        background-image: url('../../../../assets/images/liveroom/2tab1.png');
    }
    &.tab2 {
        background-image: url('../../../../assets/images/liveroom/2tab2.png');
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
.table {
    margin-top: -30px;
    min-height: calc(100% - 360px);
    background-color:#2B1845;
    .head, .is-striped {
        background-color: #30366A;
    }
    .row {
        line-height: 30px;
    }
    .left {
        width: 150px;
        flex-shrink: 0;
    }
    .right-columns {
        width: calc(100% - 150px);
        overflow-x: auto;

    }
    .column {
        flex-shrink: 0;
    }
}

.max-charts {
    .icon {
        border-radius: 50%;
        width: 40px;
        height: 40px;
    }
    .upper {
        border-bottom: 1px solid #2F3568;
    }
    .middle-chart, .middle {
        width: 70px;

        flex-shrink: 0;
        text-align: center;
    }
    .middle-chart {
        height: 50px;
        .bar {
            bottom: 0;
        }
        .home {
            .bar {
                right: 0;
            }
            .label {
                left: 0;
            }
        }
        .away {
            .bar {
                left: 0;
            }
            .label {
                right: 0;
            }
        }
    }
    .middle {
        background-color: #30366A;
    }
    .lower {
        line-height: 24px;
        height: 24px;
    }

}
</style>
