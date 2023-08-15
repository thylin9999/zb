<template>
    <div class="p-t-5">
        <div class="tabs flex  justify-center"
            :class="`tab${currentTab}`"
        >
            <span
                class="tab font-12 font-500 text-center"
                :class="{
                    'is-active': tab.id === currentTab
                }"
                v-for="(tab) in tabs"
                :key="tab.id"
                @click="setTab(tab)"
            >{{  tab.name }}</span>
        </div>
        <div class="body">
            <p class="title m-l-15 m-r-15 m-b-10 p-l-5 font-12 font-400 text-white">首发阵容</p>
            <div class="m-auto p-relative playground">
                <Playground
                    class="w-100"
                    :home="homePlayers"
                    :away="awayPlayers"
                />
                <div class="p-absolute home coach p-l-10 flex flex-column justify-center font-12 font-400 text-white">
                    <span class="text-ellipsis">教练：{{ homeInfo.coach }}</span>
                    <span>阵型：{{ homeInfo.array }}</span>
                </div>
                <div class="p-absolute away coach p-l-10 flex flex-column justify-center font-12 font-400 text-white">
                    <span class="text-ellipsis">教练：{{ awayInfo.coach }}</span>
                    <span>阵型：{{ awayInfo.array }}</span>
                </div>
            </div>
            <p class="title m-t-10 m-l-15 m-r-15 m-b-10 p-l-5 font-12 font-400 text-white">替补阵容</p>
            <div class="backup-rows">
                <template
                    v-for="player in showInfo.backup"
                >
                    <div class="row flex align-center justify-between" :key="player.playerId">
                        <div class="left-info flex align-center">
                            <span class="font-400 text-center d-inline-block number text-999">{{ player.number}}</span>
                            <div class="icon bg-center m-r-10 m-l-10 bg-no-repeat bg-size-100"
                                :style="{
                                    'background-image': `url(${player.phone})`
                                }"
                            ></div>
                            <div class="flex flex-column">
                                <span class="text-white font-12 font-400">{{ player.nameCht}}</span>
                                <span class="font-12 m-t-5 text-primary font-400">位置</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import Playground from './Playground.vue'
export default {
    name: 'FootballLineup',
    components: {
        Playground
    },
    props: {
        roomInfo: {
            type: Object,
            default: () => ({})
        },
        lineupData: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            currentTab: 1,
            playGroundSize: {
                w: 345,
                h: 800,
                offsetHorization: 10, // 水平的外间距
                offsetVertical: 50, // 竖向外间距
                sectionW: 325,
                sectionH: 320
            },
            memberSize: {
                w: 50,
                h: 50
            },
            homePlayers: {},
            awayPlayers: {}
        }
    },
    computed: {
        matchId () {
            return this.roomInfo.match_id
        },
        homeInfo () {
            return this.lineupData
                ? {
                    coach: this.lineupData.homeCoachCn,
                    name: this.lineupData.homeNameChs,
                    array: this.lineupData.homeArray.split('').join('-'),
                    lineup: this.lineupData.homeLineup, // 首发
                    backup: this.lineupData.homeBackup // 替补
                }
                : {}
        },
        awayInfo () {
            return this.lineupData
                ? {
                    coach: this.lineupData.awayCoachCn,
                    name: this.lineupData.awayNameChs,
                    array: this.lineupData.awayArray.split('').join('-'),
                    lineup: this.lineupData.awayLineup, // 首发
                    backup: this.lineupData.awayBackup // 替补
                }
                : {}
        },
        tabs () {
            return [
                {
                    id: 1,
                    name: this.lineupData.homeNameChs
                },
                {
                    id: 2,
                    name: this.lineupData.awayNameChs
                }
            ]
        },
        showInfo () {
            return this.currentTab === 1 ? this.homeInfo : this.awayInfo
        }
    },
    created () {
        this.initPlayers()
    },
    methods: {
        initPlayers () {
            this.homePlayers = this.handlePosition(this.homeInfo.lineup, true)
            this.awayPlayers = this.handlePosition(this.awayInfo.lineup, false)
        },
        handlePosition (players, isHome) {
            //  isHome 主场球员
            // 布局 宽345 * 800
            // 上下守门员 距离上下边缘 50px ,自身50px * 50
            // 人员宽高 50 * 50 （上方图标 35 * 35 包含底部15px的人名）
            // 每行宽度 345 - 20（每边 10） 325 px
            // 看阵容
            let count = 0
            const info = players.reduce((all, item) => {
                const key = item.positionId
                if (!all[key]) {
                    all[key] = []
                    count++
                }
                all[key].push(item)
                return all
            }, {})
            // 需要知道有几列
            Object.keys(info).forEach(key => {
                const members = info[key]
                if (key === '0') {
                    // 守门员
                    const position = {
                        x: (this.playGroundSize.w - this.memberSize.w) / 2,
                        y: isHome ? this.playGroundSize.offsetVertical : (
                            this.playGroundSize.h - this.playGroundSize.offsetVertical - this.memberSize.h
                        )
                    }
                    members.forEach(member => {
                        member.position = { ...position }
                    })
                } else {
                    // 非守门员, 主队是这样
                    // 根据列数来计算位置
                    // const horizationGap = Math.floor((this.playGroundSize.sectionW - this.memberSize.w * (count - 1)) / (count))
                    // 横坐标
                    const verticalGap = Math.floor((this.playGroundSize.sectionH - this.memberSize.h * (count - 1)) / (count))
                    let memberY = 0
                    if (isHome) {
                        memberY = key * verticalGap + key * this.memberSize.h + this.playGroundSize.offsetVertical
                    } else {
                        // 客队
                        const y = key * verticalGap + key * this.memberSize.w + this.playGroundSize.offsetVertical
                        const gap = this.playGroundSize.h / 2 - y - this.memberSize.h
                        memberY = y + 2 * gap + this.memberSize.w
                    }
                    // 计算纵向坐标
                    const horizationCount = members.length * 1
                    const horizationGap = Math.floor((this.playGroundSize.sectionW - this.memberSize.w * horizationCount) / (horizationCount + 1))
                    members.forEach((item, index) => {
                        const x = horizationGap * (index * 1 + 1) + index * this.memberSize.w + this.playGroundSize.offsetHorization
                        item.position = {
                            x,
                            y: memberY
                        }
                    })
                }
            })
            return { ...info }
        },
        setTab (tab) {
            this.currentTab = tab.id
        }
    }
}

</script>

<style lang="scss" scoped>
.tabs {
    height: 80px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
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
.body {
    margin-top: -30px;
    // height: calc(100% - 50px);
    background: #2B1845;
    .playground{
        width: 345px;
        .coach {
            height: 40px;
            border-radius: 10px 0px 0px 0px;
            line-height: 15px;
        }
        .home.coach {
            background: linear-gradient(90deg, #FF5B5D 0%, rgba(216,216,216,0) 100%);
            left: 0;
            top: 0;
        }
        .away.coach {
            padding-right: 10px;
            background: linear-gradient(90deg, rgba(216,216,216,0) 0%, #3DB1FB 100%);
            right: 1px;
            bottom: 0;
            border-radius: 0px 0px 10px 0px;
        }
    }
}
.title {
    border-left: 5px solid #FBA187;
    line-height: 17px;
}

.backup-rows {
    .row {
        height: 50px;
        border-bottom: 1px solid #2F3568;
        &:last-child {
            border: none;
        }
    }
    .left-info {
        .number {
            font-size: 13px;
            width: 35px;
        }
        .icon {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #D8D8D8;
        }
    }
}
</style>
