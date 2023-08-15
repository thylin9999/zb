<template>
<div class="list h-100 overflow-y-auto">
    <!-- <span @click="test">点我</span> -->
    <template v-if="!hasNoCompetition">
        <van-pull-refresh class="h-100" v-model="isLoading" @refresh="onRefresh" disabled >
            <div class="section h-100 overflow-y-auto" v-for="(competitionsInDate, key) in list" :key="key">
                <div class="w-100">
                    <template v-for="competition in competitionsInDate" >
                        <template
                            v-if="competition.leagueType === 1"
                        >
                            <div
                                :key="competition.matchId + competition.appointment"
                            >
                                <competition-card-football
                                    v-if="isTraditional"
                                    :competition="competition"
                                    :appointment.sync="competition.appointment"
                                    class="m-t-5"
                                />
                                <competition-card-football-mode
                                    v-else
                                    :competition="competition"
                                    :appointment.sync="competition.appointment"
                                    class="m-t-5"
                                    :mode="mode"
                                />
                            </div>
                        </template>
                        <template v-else>
                            <div :key="competition.matchId + competition.appointment">
                                <competition-card-basketball
                                    v-if="isTraditional"
                                    :competition="competition"
                                    :appointment.sync="competition.appointment"
                                    class="m-t-5"
                                />
                                <competition-card-basketball-mode
                                    v-else
                                    :competition="competition"
                                    :appointment.sync="competition.appointment"
                                    class="m-t-5"
                                    :mode="mode"
                                />
                            </div>
                        </template>
                    </template>
                </div>
            </div>
        </van-pull-refresh>
    </template>
    <template v-else-if="hasNoCompetition && shelf">
        <div class="shelf-style" v-for="i in shelf" :key="i"> <p></p><p></p><p></p><p></p></div>
    </template>
    <template v-else>
        <van-empty
            v-if="!isLoading"
            class="custom-image"
            :image="require('../../../assets/images/notFound.png')"
            description="暂无数据"
        />
    </template>

</div>
</template>

<script>
// import TimeTitle from '@/views/Competition/Components/TimeTitle'
import CompetitionCardFootball from '@/views/Competition/Components/CompetitionCardFootball'
import CompetitionCardFootballMode from './CompetitionCardFootballMode.vue'
import CompetitionCardBasketball from '@/views/Competition/Components/CompetitionCardBasketball'
import CompetitionCardBasketballMode from './CompetitionCardBasketballMode.vue'
import { getMatchList } from '@/api/competition'
import { statusCode } from '@/utils/statusCode'
import { isEmpty } from '@/utils/lodashUtils'
import { Empty, Toast, PullRefresh } from 'vant'
import dayjs from 'dayjs'
import ScoreWs from '@/utils/scoreWs'
import { notification } from '../../../utils/msgDialog'
import { mapState } from 'vuex'
export default {
    name: 'CompetitionList',
    props: {
        mode: {
            type: String,
            default: 'traditional'
        },
        playing: { // 比赛状态 5全部 2000进行中 1000赛程 3000赛果
            type: Number,
            default: null
        },
        leagueType: { // 联赛类型
            type: Number,
            default: 1 // 默认足球
        },
        leagueIds: { // 联赛id
            type: Array,
            default: () => []
        },
        day: {
            type: String,
            default: null
        },
        hasThreeLeagues: {
            type: Boolean,
            default: false
        },
        totals: { // 统计显示数量
            type: Object,
            default: () => [{}]
        }
    },
    components: {
        [Empty.name]: Empty,
        [PullRefresh.name]: PullRefresh,
        // TimeTitle,
        CompetitionCardFootball,
        CompetitionCardBasketball,
        CompetitionCardBasketballMode,
        CompetitionCardFootballMode
    },
    data () {
        return {
            pagination: {
                total: 0,
                currentPage: 0,
                pageSize: 2000
            },
            list: {},
            competitionIds: [], // 赛事id 合集
            isLoading: false,
            hasNoCompetition: true,
            showTipType: ['goal', 'card'],
            finished: false,
            refreshing: false,
            shelf: 6 // 骨架
        }
    },
    computed: {
        ...mapState('voice', ['voiceUrl', 'voice', 'cardAnimation', 'cardTip', 'animation']),
        apiParams () {
            return {
                playing: this.playing === 5 ? '' : this.playing,
                leagueType: this.leagueType,
                day: this.day,
                hierarchy: this.hasThreeLeagues ? '1,2,3' : '',
                pageNumber: this.pagination.currentPage,
                pageSize: this.pagination.pageSize,
                leagueId: this.leagueIds.join(',')
            }
        },
        isTraditional () {
            return this.mode === 'traditional'
        }
    },
    created () {
        this.fetchData()
        this.initWs()
        // setTimeout(() => {
        //     this.giveNotifycation({
        //         type: 'goal',
        //         data: {
        //             match_id: 2356068,
        //             home_score: 0,
        //             away_score: 2,
        //             who: 'home',
        //             state: 3,
        //             away_name: '22222',
        //             home_name: '111111111',
        //             time: '93'
        //         }
        //     })
        // }, 2000)
    },
    methods: {
        calcListLength () {
            this.hasNoCompetition = isEmpty(this.list)
            this.shelf = 0
        },
        onRefresh () {
            // 清空列表数据
            this.pagination.currentPage = 1
            this.pagination.total = 0
            // 重新加载数据
            this.fetchData()
        },
        async fetchData () {
            this.isLoading = true
            // Toast.loading({
            //     duration: 0,
            //     forbidClick: true
            // })
            this.$showLoading()
            try {
                const { data, code, msg } = await getMatchList(this.apiParams)
                if (code === statusCode.success) {
                    if (data) {
                        this.pagination.total = data.total
                        this.handleData(data)
                        this.handleTotals(data.list)
                        this.finished = true
                    } else {
                        this.list = {
                            [this.date]: []
                        }
                    }
                } else {
                    Toast(msg)
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                // Toast.clear()
                this.$hideLoading()
                this.isLoading = false
            }
        },
        handleData (data) {
            const dates = []
            const tempMap = data.list.reduce((all, item) => {
                const date = dayjs(item.matchTime).format('YYYY-MM-DD')
                this.competitionIds.push(item.matchId)
                if (!all[date]) {
                    all[date] = []
                    dates.push(date)
                }
                all[date].push(item)
                return all
            }, {})
            const dateArr = dates.sort((a, b) => {
                return dayjs(a) - dayjs(b)
            })
            this.list = dateArr.reduce((all, date) => {
                all[date] = tempMap[date]
                return all
            }, {})
            this.calcListLength()
        },
        // 处理数量显示
        handleTotals (data) {
            // 默认获取全部处理方式
            if (this.playing === 5) {
                this.totals.all = data.length
                if (!this.totals.ing) this.totals.ing = data.filter(item => item.state === 3).length
                if (!this.totals.notStart) this.totals.notStart = data.filter(item => item.state === 0).length
                if (!this.totals.over) this.totals.over = data.filter(item => item.state === -1).length
            } else if (this.playing === 2000) {
                this.totals.ing = data.length
            } else if (this.playing === 1000) {
                this.totals.notStart = data.length
            } else if (this.playing === 3000) {
                this.totals.over = data.length
            }
            this.$emit('totals', this.totals)
        },
        // test () {
        //     // 模拟修改数据
        //     // this.giveNotifycation({
        //     //     type: 'gogal',
        //     //     // data: {
        //     //     //     // match_id: 1221,
        //     //     //     // red: 0,
        //     //     //     // state: 3,
        //     //     //     // team_name: 'asdfasdf',
        //     //     //     // time: '90',
        //     //     //     // who: 'away',
        //     //     //     // yellow: 6
        //     //     //     match_id: 2356068,
        //     //     //     home_score: 0,
        //     //     //     away_score: 2,
        //     //     //     who: 'home',
        //     //     //     state: 3,
        //     //     //     away_name: '22222',
        //     //     //     home_name: '111111111',
        //     //     //     time: '93'
        //     //     // }
        //     //     data: [{
        //     //         match_id: 2381753,
        //     //         who: 'away',
        //     //         state: 3,
        //     //         away_name: '22222',
        //     //         home_name: '111111111',
        //     //         time: '93',
        //     //         away_corner: 3,
        //     //         away_half_score: 2,
        //     //         away_yellow: 1,
        //     //         away_red: 0,
        //     //         away_score: 2,
        //     //         home_corner: 1,
        //     //         home_half_score: 0,
        //     //         home_red: 0,
        //     //         home_score: 0,
        //     //         home_yellow: 3,
        //     //         now_time: '80',
        //     //     }]
        //     // })
        //     // const data = [{
        //     //         // match_id: 2285529,
        //     //         // who: 'away',
        //     //         // state: 3,
        //     //         // away_name: '22222',
        //     //         // home_name: '111111111',
        //     //         // time: '93',
        //     //         // away_corner: 3,
        //     //         // away_half_score: 2,
        //     //         // away_yellow: 1,
        //     //         // away_red: 0,
        //     //         // away_score: 2,
        //     //         // home_corner: 1,
        //     //         // home_half_score: 0,
        //     //         // home_red: 0,
        //     //         // home_score: 0,
        //     //         // home_yellow: 3,
        //     //         // now_time: '80',

        //     //         // odds
        //     //     }]
        //     // const data = {
        //     //     europe_odds: [
        //     //         {
        //     //             "match_id":2381753,
        //     //             "company_id":3,
        //     //             "home_win_main_odds":2.91,
        //     //             "tie_main_odds":2.47,
        //     //             "away_win_main_odds":2.49,
        //     //             "change_time":"2022-12-30 21:19:51",
        //     //             "is_close":false,
        //     //             "odds_type":3
        //     //         }
        //     //     ],
        //     //     over_under: [
        //     //         {
        //     //             "match_id":2381753,
        //     //             "company_id":3,
        //     //             "handicap_odds":2.25,
        //     //             "big_ball_odds":1.03,
        //     //             "small_ball_odds":0.79,
        //     //             "change_time":"2022-12-30 21:19:56",
        //     //             "is_close":false,
        //     //             "odds_type":3
        //     //         },
        //     //         {
        //     //             "match_id":2285529,
        //     //             "company_id":3,
        //     //             "handicap_odds":15,
        //     //             "big_ball_odds":20,
        //     //             "small_ball_odds":12,
        //     //             "change_time":"2022-12-30 21:19:56",
        //     //             "is_close":false,
        //     //             "odds_type":3
        //     //         }
        //     //     ]
        //     // }
        //     //     this.updateScoreOrOdds({ type: 'odds', data})
        // },
        giveNotifycation ({ type, data }) {
            // console.log(type)
            if (this.$route.path !== '/competition') return // 只在赛事页面展示
            const flag = ['yellow', 'red'].includes(type) ? 'card' : type
            if (!this.showTipType.includes(flag)) {
                return
            }
            const params = data
            let showAnimation = false
            if (flag === 'goal' && this.animation) {
                showAnimation = true
            }
            if (flag === 'card' && this.cardAnimation) {
                showAnimation = true
            }
            if (showAnimation) {
                notification.close()
                notification.success({
                    type,
                    data: params
                })
                setTimeout(() => {
                    notification.close()
                }, 3000)
            }

            // 不光要有音效，还需要更新数据
            if (this.voice) {
                const audio = new Audio(`/voices/${this.voiceUrl}.mp3`)
                audio.play()
            }
            this.updateRow(data, type)
        },
        updateRow () {
            // 更新数据
        },
        updateScoreOrOdds ({ type, data }) { // score 更新列表
            if (type === 'score') {
                data.forEach(item => {
                    Object.entries(this.list).forEach(([date, items]) => {
                        this.traverseItem(date, item, 'score')
                    })
                })
            } else if (type === 'odds') {
                //
                const europeOdds = data.europe_odds
                const overUnder = data.over_under
                europeOdds.forEach(item => {
                    Object.entries(this.list).forEach(([date, items]) => {
                        this.traverseItem(date, item, 'odds_europe')
                    })
                })
                overUnder.forEach(item => {
                    Object.entries(this.list).forEach(([date, items]) => {
                        this.traverseItem(date, item, 'odds_over_under')
                    })
                })
            }
        },
        traverseItem (date, match, type) {
            const isOdds = type === 'score'
            const dateList = this.list[date]
            const rowIndex = dateList.findIndex(item => item.matchId === match.match_id)
            if (rowIndex > -1) {
                const item = dateList[rowIndex]
                const updateKey = `${item.matchId}` + new Date().getTime()
                let newItem = {}
                if (isOdds) {
                    newItem = {
                        ...item,
                        awayCorner: match.away_corner,
                        awayHalfScore: match.away_half_score,
                        awayRed: match.away_red,
                        awayYellow: match.away_yellow,
                        awayScore: match.away_score,
                        homeCorner: match.home_corner,
                        homeHalfScore: match.home_half_score,
                        homeRed: match.home_red,
                        homeYellow: match.home_yellow,
                        homeScore: match.home_score,
                        timing: match.now_time,
                        state: match.state,
                        updateKey
                    }
                } else {
                    if (type === 'odds_europe') {
                        newItem = {
                            ...item,
                            updateKey,
                            odds_europe: {
                                ...item.odds_europe,
                                company_id: match.company_id,
                                curr_home_win_odds: match.home_win_main_odds,
                                curr_tie_main_odds: match.tie_main_odds,
                                curr_away_win_odds: match.away_win_main_odds,
                                odds_type: match.odds_type,
                                is_close: match.is_close,
                                change_time: match.change_time
                            }
                        }
                    } else {
                        newItem = {
                            ...item,
                            updateKey,
                            odds_over_under: {
                                ...item.odds_over_under,
                                company_id: match.company_id,
                                odds_type: match.odds_type,
                                is_close: match.is_close,
                                change_time: match.change_time,
                                curr_odds: match.handicap_odds,
                                curr_over_odds: match.big_ball_odds,
                                curr_under_odds: match.small_ball_odds
                            }
                        }
                    }
                }
                this.list[date].splice(rowIndex, 1, newItem)
            }
        },
        initWs () {
            ScoreWs.listener.on('info', this.giveNotifycation)
            ScoreWs.listener.on('score', this.updateScoreOrOdds)
            ScoreWs.listener.on('odds', this.updateScoreOrOdds)
        }
    },
    beforeDestroy () {
        ScoreWs.listener.on('info', this.giveNotifycation)
        ScoreWs.listener.on('score', this.updateScoreOrOdds)
        ScoreWs.listener.on('odds', this.updateScoreOrOdds)
    }
}
</script>

<style lang="scss" scoped>
.list {
    background-color: #0E0E23;
}
.shelf-style{
    width: 347px;
    height: 110px;
    margin: 5px auto 0;
    background: #161C4F;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    p{
        width: 150px;
        margin: 0 auto;
        height: 12px;
        background: #6C73AF;
        border-radius: 3px;
    }
    p:nth-child(2){
        width: 307px;
    }
}
</style>
