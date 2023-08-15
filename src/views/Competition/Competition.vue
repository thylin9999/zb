<template>
<div class="w-100 h-100 competition-container"
    :class="{
         'is-expand': showTimeLine,
         'is-small': isMyBooked
    }"
>
    <div class="common-filter  van-overflow-hidden"

    >
        <div class="first-level-tab p-b-5 m-l-15 m-r-10 p-t-5 flex justify-between align-center">
            <!--  一级， 我的预约 ，足球，篮球 -->
            <ul class="flex  align-center flex-1 ">
                <li
                    class="sport-tab p-l-5 p-r-5 font-14 font-500 font-medium  text-center"
                    :class="{'is-active': sportTabId === 0 }"
                    @click="changeSportTab()"
                >
                    我的预约
                </li>
                <li
                    v-for="tab in sportTabs"
                    :key="tab.id"
                    class="sport-tab m-l-5 p-l-5 p-r-5 font-14 font-599  font-medium  text-center"
                    :class="{'is-active': sportTabId === tab.id }"
                    @click="changeSportTab(tab)"
                >
                    {{ tab.name }}
                </li>
            </ul>

            <div class="filter-section ">

                <!-- <span class="border-50 text-center   icon-box d-inline-block" @click="openDownloadDialog">
                    <IconCom :icon="mode" :width="21" :height="20"/>
                </span> -->
                <ChangeMode
                    :mode.sync="mode"
                />
                <!-- <span class="border-50 icon-box text-center d-inline-block m-l-10" @click="refresh">
                    <van-icon name="replay" size="12" />
                </span> -->
                <span class="border-50 text-center m-l-10 icon-box d-inline-block" :class="{ 'is-disable opacity-7': !canFilter }" @click="canFilter ? showFilter = true : null">
                    <img src="../../assets/images/competition/fiter.png" alt="" class="filter-icon">
                </span>
            </div>
        </div>
        <!--    二级 全部， 进行中， 赛程，赛果-->
        <div v-if="isCompetitionList" class="sub-class p-relative">
            <van-tabs
                v-model="subTabId"
                @change="resetDate"
                title-active-color="#FBA187"
                title-inactive-color="#fff"
            >
                <van-tab
                    v-for="subItem in subTabs"
                    :key="subItem.id"
                    :name="subItem.id"
                    :title="`${subItem.name}(${subItem.total?subItem.total:0})`" />
            </van-tabs>
            <IconPng
                class="p-absolute setting-btn"
                icon="my/system-setting"
                :width="21" :height="20"
                @click.native="openSettings"
            />
        </div>
        <TimeLine
            v-if="showTimeLine"
            :key="showPrev"
            :time.sync="date"
            :show-prev="showPrev"
        />
    </div>
    <div :key="refreshKey" class="content-wrapper" :class="{
        'competition-section': !isMyBooked,
        'my-schedule': isMyBooked,
        'has-time-line': showTimeLine
    }">
        <template v-if="!isMyBooked">
            <div
                v-if="!isHost"
                class="h-100 overflow-hidden"
            >
                <CompetitionList
                    :key="updateListKey"
                    :playing="subTabId"
                    :league-ids="leagueIds"
                    :league-type="sportTabId"
                    :has-three-leagues="hasThreeLeagues"
                    :day="date"
                    :mode="mode"
                    @totals="handlerTotals"
                    :totals="totals"
                />
            </div>
            <template v-else>
                <!--    主播赛程-->
                <HostCompetition
                    :day="date"
                />
            </template>
        </template>
        <div v-else class="h-100">
            <MySchedule :mode="mode"/>
        </div>
    </div>

   <!-- <div class="fixed-btn-wrapper">
       <div class="top-btn-wrapper" v-if="showTopIcon">
           <span class="to-top-btn" @click="quickToTop"></span>
       </div>
   </div> -->
    <van-action-sheet v-model="chooseLiveDialog" :style="{ height: '40%' }" :round=false title="选择直播间">
        <div class="content">
            <van-list
                :finished="finished"
                @load="onLoad"
            >
                <template
                    v-for="live in liveData"
                >
                    <ChooseLive
                        :liveItem="live"
                        :key="live.id"
                    />
                </template>
            </van-list>
        </div>
    </van-action-sheet>
    <FilterLeagueTypes
        class="p-fixed filters"
        v-if="showFilter"
        :league-ids.sync="leagueIds"
        :league-type="sportTabId"
        :has-three-leagues.sync="hasThreeLeagues"
        @closeFilter="closeFilter"
    />
    <Settings
        class="p-fixed w-100 h-100 settings"
        :value.sync="showSettings"
        :sportTabId="sportTabId"
        v-if="showSettings"
    />
</div>
</template>

<script>
import ChangeMode from './Components/ChangeMode.vue'
import MySchedule from '@/views/Competition/Components/MySchedule'
import HostCompetition from '@/views/Competition/Components/HostCompetition'
import TimeLine from '@/views/Competition/Components/TimeLine'
import ChooseLive from '@/views/Competition/Components/ChooseLive'
import { Tabs, Tab, ActionSheet, List, Toast, Icon } from 'vant'
import { getHotScheduleApi } from '@/api/competition'
import { mapState } from 'vuex'
import CompetitionList from '@/views/Competition/Components/CompetitionList'
// import FilterLeagueTypes from '@/views/Competition/FilterLeagueTypes'
import Settings from './Components/Settings.vue'
import IconPng from '@/components/IconPng'
import dayjs from 'dayjs'
export default {
    name: 'Competition',
    components: {
        ChooseLive,
        MySchedule,
        [Tabs.name]: Tabs,
        [Tab.name]: Tab,
        [ActionSheet.name]: ActionSheet,
        [List.name]: List,
        [Toast.name]: Toast,
        [Icon.name]: Icon,
        CompetitionList,
        TimeLine,
        FilterLeagueTypes: () => import('@/views/Competition/FilterLeagueTypes'),
        HostCompetition,
        IconPng,
        ChangeMode,
        Settings
    },
    data () {
        return {
            leagueId: null,
            matchData: [],
            loginToken: '',
            finished: false,
            chooseLiveDialog: false,
            showTopIcon: false,
            sportTabs: [
                {
                    id: 1,
                    name: '足球'
                },
                {
                    id: 2,
                    name: '篮球'
                }
                // {
                //     id: 3,
                //     name: '主播赛程'
                // }
            ],
            subTabs: [
                {
                    id: 5,
                    name: '全部',
                    comName: 'CompetitionSchedule',
                    total: 0
                },
                {
                    id: 2000,
                    name: '进行中',
                    comName: 'CompetitionSchedule',
                    total: 0
                },
                {
                    id: 1000,
                    name: '赛程',
                    comName: 'CompetitionWithTime',
                    showPrev: false,
                    total: 0
                },
                {
                    id: 3000,
                    name: '赛果',
                    comName: 'CompetitionWithTime',
                    showPrev: true,
                    total: 0
                }
            ],
            sportTabId: 1,
            subTabId: 5,
            competitions: [],
            liveData: [], // 可供用户选择的直播间数据
            date: dayjs().format('YYYY-MM-DD'),
            updateListKey: +new Date().getTime(),
            refreshKey: +new Date().getTime(),
            showFilter: false,
            leagueIds: [], // 联赛id集合
            mode: 'traditional',
            showSettings: false,
            hasThreeLeagues: true, // true = 1，2，3 全部。fasle = 1,2 热门联赛
            totals: {}

        }
    },
    computed: {
        ...mapState('user', ['token']),
        canFilter () {
            // 能够预约
            return this.isCompetitionList
        },
        apiParams () {
            return {
                sportId: this.sportTabId,
                subId: this.subTabId
            }
        },
        isCompetitionList () {
            return !this.isMyBooked && !this.isHost
        },
        isHost () {
            return this.sportTabId === 3
        },
        isMyBooked () {
            return this.sportTabId === 0
        },
        currentSubTab () {
            return this.subTabs.find(x => x.id === this.subTabId)
        },
        comName () {
            return this.currentSubTab.comName
        },
        showTimeLine () {
            return ([1000, 3000].includes(this.subTabId) || this.isHost) && !this.isMyBooked
        },
        listKey () {
            return {
                playing: this.subTabId,
                leagueType: this.sportTabId,
                day: this.date,
                leagueIds: this.leagueIds
            }
        },
        showPrev () {
            return this.subTabId === 3000
        }
    },
    watch: {
        listKey: {
            handler () {
                this.$nextTick(() => {
                    this.updateListKey = +new Date().getTime()
                })
            },
            deep: true
        },
        sportTabId: {
            immediate: true,
            handler (val, oldVal) {
                if (this.sportTabId === 1) {
                    this.getHotSchedule()
                }
            }
        },
        showFilter (newVal, oldVal) {
            if (newVal) {
                this.$showLoading()
            }
        }
    },
    created () {
        this.sportTabId = (this.$route.params.leagueType || 1) * 1
    },
    mounted () {
        window.addEventListener('scroll', this.handlerScroll, true)
    },
    methods: {
        openSettings () {
            this.showSettings = true
        },
        resetDate () {
            this.date = dayjs().format('YYYY-MM-DD')
        },
        getMatchId (match) {
            this.leagueId = match.leagueId
            // this.fetchData()
        },
        async getHotSchedule () {
            this.matchData = []
            const { data } = await getHotScheduleApi(this.sportTabId)
            const temp = [
                {
                    leagueId: null,
                    nameChsShort: '全部'

                }
            ]
            this.matchData = [].concat(temp, data)
        },
        onLoad () {},
        chooseLiveRoom (list) {
            this.liveData = list
            if (this.liveData.length > 1) {
                this.chooseLiveDialog = true
            } else {
                this.$router.push({
                    name: 'Broadcast',
                    query: {
                        room_id: this.liveData[0].room_id
                    }
                })
            }
        },
        handlerScroll () {
            if (window.pageYOffset > 100) {
                this.showTopIcon = true
            } else {
                this.showTopIcon = false
            }
        },
        quickToTop () {
            document.documentElement.scrollTop = 0
        },
        changeSportTab (tab) {
            this.resetDate()
            this.totals.all = 0
            this.totals.ing = 0
            this.totals.notStart = 0
            this.totals.over = 0
            if (tab) {
                this.leagueIds = []
                this.leagueId = null
                this.leagueType = null
                this.subTabId = 5
                this.sportTabId = tab.id
            } else {
                if (!this.token) {
                    this.$store.commit('commonData/SET', {
                        loginDialogUrl: '/competition/0'
                    })
                    this.openLoginDialog()
                } else {
                    this.sportTabId = 0
                }
            }
        },
        changeSubTab (subItem) {
            this.subTabId = subItem.id
        },
        closeFilter () {
            this.showFilter = false
        },
        refresh () {
            // 更新数据，三个地方
            this.refreshKey = +new Date().getTime()
        },
        handlerTotals (totals) {
            this.totals = totals // 将数据同步给子组件
            this.subTabs.map(item => {
                if (item.id === 5) {
                    item.total = totals.all
                } else if (item.id === 2000) {
                    item.total = totals.ing
                } else if (item.id === 1000) {
                    item.total = totals.notStart
                } else if (item.id === 3000) {
                    item.total = totals.over
                }
            })
        }
    },
    beforeDestroy () {
        window.removeEventListener('scroll', this.handlerScroll)
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.competition-container{
    background-color: #0E0E23;
}
.fixed-btn-wrapper{
    position: fixed;
    bottom: 75px;
    right: 18px;
    .top-btn-wrapper{
        text-align: right;
        .to-top-btn{
            bottom: 138px;
            width: 58px;
            height: 58px;
            display: inline-block;
            background-image: url('../../assets/icons/toTop.png');
            background-size: 58px 58px;
            background-repeat: no-repeat;
        }
    }

    .convenient-btn-wrapper{
        display: flex;
        .all-schedule-btn{
            background-color: #faa873;
        }
        .hot-schedule-btn{
            margin-left: 10px;
            background-color: #75a6fb;
        }
        .convenient-btn{
            width: 58px;
            line-height: 58px;
            height: 58px;
            border-radius: 50px;
            display: inline-block;
            color: #fff;
            font-weight: bolder;
            text-align: center;
        }
    }
}
.fixed-header-wrapper{
    width: 100%;
    z-index: 1;
    left: 0;
    top: 0;
}

.item-match-active{
    color: #4164FF;
}
.match-wrap{
    font-size: 14px;
    // background-color: #fff;
    border-bottom: 1px solid #E4E4E4;
    ul{
        white-space: nowrap; /* ul中的内容不换行 */
        overflow-x: scroll;  /* 横向滚动 */
        overflow-y: hidden; /* 禁止纵向滚动*/
    }
    .itemMatch{
        position: relative;
        float: left;
        line-height: 16px;
        padding: 0  8px;
        margin: 5px 0;
        border-right: 1px solid #333;
    }
    .itemMatch:last-child{
        border-right: none !important;
    }
    .more-icon{
        height: 18px;
        display: inline-block;
        left: 30px;
        top: 0;
        width: 18px;
        background-color: $background-gray;
        box-shadow: -1px 0px 7px 0px rgba(151, 151, 151, 0.5);
        background-image: url('../../assets/images/icons/more.png');
        background-size: 18px 18px;
    }
}

.common-filter {
    width: 100%;
    padding-top: 15px;
    box-shadow: 0 0 6px 0 rgba(0,0,0,0.17);
    border-radius: 0 0 9px 9px;
    z-index: 3;
    // background-image: url('../../assets/images/header/small.png');
    background: url('../../assets/images/header/small.png') no-repeat;
    background-size: 100% 120%;
    .first-level-tab{
        color: #fff;
        border-bottom: 1px solid #30366A;
        .sport-tab{
            line-height: 24px;
            height: 24px;
            border-radius: 3px;
            position: relative;
            &.is-active {
                background: -webkit-linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
                -webkit-text-fill-color: transparent;
                -webkit-background-clip: text;
                &:before {
                    content: ' ';
                    position: absolute;
                    background: url('../../assets/images/competition/icon.png');
                    background-size:11px 11px ;
                    width: 11px;
                    height: 11px;
                    top: -2px;
                    right: -2px;
                    // right: 0;
                    // top: 0;
                    // width: 6px;
                    // height: 6px;
                    // border-radius: 4px;
                    // border-top: 3px solid rgba(237, 197, 165, 1);
                    // border-right: 3px solid rgba(237, 197, 165, 1);
                    // border-image: linear-gradient(137deg, rgba(249, 229, 209, 1), rgba(237, 197, 165, 1)) 2 2;
                }
            }
        }
    }
    .filter-icon{
        width: 20px;
        height: 20px;
    }
    .sub-class {
        width: 100%;
        padding: 0 50px;
        .sub-item {
            font-size: 12px;
            height: 30px;
            font-weight: 500;
            border-bottom: 2px solid transparent;
            font-family: PingFang-SC-Medium;
        }
        .bottom-line{
            left: 0;
            bottom: 0;
            height: 1px;
            z-index: 2;
            background-color: $un-active-color;
        }
        .setting-btn{
            right: 15px;
            top: 6px;
        }
    }
    .filter-section {
        color: #fff;
        width: 60px;
        .icon-box {
            line-height: 20px;
            vertical-align: middle;
            width: 20px;
            height: 20px;
            box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.25);
        }

    }
}

.content-wrapper {
    height: calc(100% - 80px);
    &.has-time-line {
        height: calc(100% - 135px);
    }
    &.my-schedule {
        height: calc(100% - 50px);
    }
}
.settings {
    left: 0;
    top: 0;
}
::v-deep {
    .sub-class {
        .van-tab {
            height: 30px;
        }
        .van-tabs--line .van-tabs__wrap {
            height: 30px;
            .van-tab__text{
                font-size: 12px;
                font-family: PingFang-SC-Medium;
            }
        }
        .van-tabs__line {
            width: 20px;
            height: 3px;
            background: #FBA187;
            bottom: 0;
        }
        .van-tabs__nav--line {
            padding-bottom: 0;
        }
        //.van-tabs__nav {
        //    background-color: #f8f8f8;
        //}
    }
    .home-header {
        .header {
            margin-bottom: 0!important;
        }
    }
    .fixed-header-wrapper {
        &.is-expand {
            .header {
                height: 150px;
            }
        }
        &.is-small {
            .header {
                height: 70px!important;
            }
        }
    }
}
</style>
