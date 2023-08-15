<template>
    <div class="h-100 bg-gray">
        <TimeLine
            v-if="showTimeLine"
            :league-type="leagueType"
            :time.sync="currentTime"
            :show-prev="showPrev"
            @refresh="fetchData"
        />
        <div class="content-box" :class="{'has-time-line': showTimeLine }">
            <template v-if="competitions.length">
                <ul class=" battles h-100 m-auto p-b-10 p-t-5 p-l-5 p-r-5">
                    <template
                        v-for="battle in competitions"
                    >
                        <competition-battle
                            :battle="battle"
                            :key="battle.id"
                            @refresh="fetchData"
                            @chooseLive="$emit('chooseLive', battle.anchor_list)"
                        />
                    </template>
                </ul>
<!--                <van-list-->
<!--                    v-model="loading"-->
<!--                    :finished="finished"-->
<!--                    finished-text="没有更多了"-->
<!--                    @load="onLoad"-->
<!--                    class=" battles h-100 m-auto p-b-10 p-l-5 p-r-5"-->
<!--                    :class="{'has-time-line': showTimeLine }"-->
<!--                >-->
<!--                    <template-->
<!--                        v-for="battle in competitions"-->
<!--                    >-->
<!--                        <competition-battle-->
<!--                            :battle="battle"-->
<!--                            :key="battle.id"-->
<!--                            @refresh="fetchData"-->
<!--                            @chooseLive="$emit('chooseLive', battle.anchor_list)"-->
<!--                        />-->
<!--                    </template>-->
<!--                </van-list>-->
            </template>
            <van-empty
                v-if="!isLoading && !competitions.length"
                class="custom-image"
                :image="require('../../../assets/images/notFound.png')"
                description="暂无数据"
            />
        </div>
        <!-- </van-pull-refresh> -->
    </div>
</template>

<script>
import CompetitionBattle from '@/views/Competition/Components/CompetitionBattle'
import TimeLine from '@/views/Competition/Components/TimeLine'
import { getMatchList, getHotScheduleApi } from '@/api/competition'
import { Toast, Empty, PullRefresh, List, Cell, Button } from 'vant'
import { statusCode } from '@/utils/statusCode'
import dayjs from 'dayjs'
// import { statusCode } from '@/utils/statusCode'
export default {
    name: 'CompetitionSchedule',
    props: {
        leagueType: {
            type: [String, Number],
            default: 1 // 足球
        },
        leagueId: {
            type: [String, Number],
            default: null
        },
        playing: {
            type: [String, Number],
            default: null // 全部
        },
        showTimeLine: {
            type: Boolean,
            default: false
        }
    },
    components: {
        [Toast.name]: Toast,
        [Empty.name]: Empty,
        [PullRefresh.name]: PullRefresh,
        [List.name]: List,
        [Cell.name]: Cell,
        CompetitionBattle,
        [Button.name]: Button,
        TimeLine
    },
    data () {
        return {
            isLoading: false,
            showMore: false,
            finished: false,
            loading: false,
            // refreshing: false,
            competitions: [],

            pagination: {
                total: 0,
                currentPage: 1,
                pageSize: 2000
            },
            matchData: [],
            currentTime: dayjs().format('YYYY-MM-DD')
        }
    },
    computed: {
        apiParams () {
            return {
                // eslint-disable-next-line eqeqeq
                playing: this.playing == 5 ? null : this.playing,
                leagueId: this.leagueId,
                leagueType: this.leagueType,
                pageNumber: this.pagination.currentPage,
                pageSize: this.pagination.pageSize,
                hierarchy: this.leagueId === 100000 ? '3' : '',
                // eslint-disable-next-line eqeqeq
                day: this.showTimeLine ? this.currentTime : (this.playing == 5 ? dayjs().format('YYYY-MM-DD') : null)
            }
        },
        showPrev () {
            // eslint-disable-next-line eqeqeq
            return !!(this.playing == 1000)
        },
        fetchParams () {
            return {
                leagueType: this.leagueType,
                leagueId: this.leagueId,
                playing: this.playing
            }
        }
    },
    watch: {
        fetchParams: {
            handler () {
                this.fetchData()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async getHotSchedule () {
            this.matchData = []
            const { data } = await getHotScheduleApi(this.leagueType)
            this.matchData = data
        },
        onConfirm () {
            this.$refs.item.toggle()
        },
        getMore () {
            this.showMore = !this.showMore
        },
        closeMore () {
            this.showMore = false
        },
        async onLoad () {
            // this.pagination.currentPage++
            // Toast.loading({
            //     duration: 0,
            //     forbidClick: true
            // })
            this.$showLoading()
            const { data, code, msg } = await getMatchList(this.apiParams)
            if (code === statusCode.success) {
                // if (this.refreshing) {
                //     this.competitions = []
                //     this.pagination.currentPage = 1
                //     this.pagination.total = 0
                //     this.refreshing = false
                // }
                const tempRes = data ? data.list.reduce((all, item) => {
                    all.push({
                        ...item
                    })
                    return all
                }, []) : []
                this.competitions.push(...tempRes)
                this.competitions.map(item => {
                    switch (item.state) {
                    case 0: // 未开
                        item.stateItem = '未'
                        return item.stateItem
                    case 1: // 上半场
                        item.stateItem = '上半'
                        return item.stateItem
                    case 2: // 中场
                        item.stateItem = '中场'
                        return item.stateItem
                    case 3: // 下半场
                        item.stateItem = '下半'
                        return item.stateItem
                    case 4: // 加时
                        item.stateItem = '加时'
                        return item.stateItem
                    case 5: // 点球
                        item.stateItem = '点球'
                        return item.stateItem
                    case -1: // 完场
                        item.stateItem = '完'
                        return item.stateItem
                    case -10: // 取消
                        item.stateItem = '取消'
                        return item.stateItem
                    case -11: // 待定
                        item.stateItem = '待定'
                        return item.stateItem
                    case -12: // 腰斩
                        item.stateItem = '腰斩'
                        return item.stateItem
                    case -13: // 中断
                        item.stateItem = '中断'
                        return item.stateItem
                    case -14: // 推迟
                        item.stateItem = '推迟'
                        return item.stateItem
                    default:
                        break
                    }
                })
                this.loading = false
                this.pagination.currentPage = data.current_page
                this.pagination.total = data.total
                // console.log('this.finished', this.finished)
                // if (this.competitions.length >= this.pagination.total) {
                //     this.finished = true
                // }
            } else {
                Toast(msg)
            }
            // Toast.clear()
            this.$hideLoading()
        },
        async fetchData () {
            try {
                this.isLoading = true
                // Toast.loading({
                //     duration: 0,
                //     forbidClick: true
                // })
                this.$showLoading()
                const { data, code, msg } = await getMatchList(this.apiParams)
                if (code === statusCode.success) {
                    this.competitions = data ? data.list.reduce((all, item) => {
                        all.push({
                            ...item
                        })
                        return all
                    }, []) : []
                } else {
                    Toast(msg)
                }
            } finally {
                // Toast.clear()
                this.$hideLoading()
                this.isLoading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.no-data-tips{
    line-height: 35px;
    color: #b9b9b9;
    text-align: center;
}
.close-btn{
    height: 29px;
    line-height: 29px;
    position: relative;
    text-align: right;
    padding-right: 20px;
    margin-bottom: 10px;
}
.item-match-active{
    color: #4164FF;
}

.clearfix:after{
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}

.content-box{
    height: 100%;
    overflow-y: auto;
    &.has-time-line {
        height: calc(100% - 55px);
    }
}

</style>
