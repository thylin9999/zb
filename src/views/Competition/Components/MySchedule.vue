<template>
    <div class="my-follow-schedule h-100 ">
       <template v-if="token">
           <div class="clear-schedule" v-if="followScheduleList.length > 0">
               <span class="clear-btn font-12" @click="clearAppointent">清空完场预约</span>
           </div>
           <div class="item-container overflow-y-auto  ">
               <div class="item-list h-100" v-if="followScheduleList.length > 0">
                <van-pull-refresh class="h-100 overflow-y-auto" v-model="isLoading" @refresh="onRefresh" disabled>
                    <div v-for="(competition, index) in followScheduleList" :key="index">
                        <template
                        v-if="competition.leagueType === 1"
                    >
                        <div
                            :key="competition.matchId + competition.appointment"
                        >
                            <competition-card-football
                                v-if="isTraditional"
                                :competition="competition"
                                show-swipe
                                :appointment.sync="competition.appointment"
                                class="m-t-5"
                                @deleteItem="deleteItem"
                            />
                            <competition-card-football-mode
                                v-else
                                :competition="competition"
                                show-swipe
                                :appointment.sync="competition.appointment"
                                class="m-t-5"
                                @deleteItem="deleteItem"
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
                                />
                            </div>
                        </template>
                    </div>
                </van-pull-refresh>

               </div>
               <template  class="battles flex justify-center align-center" v-else>
                   <div  class="battles flex justify-center align-center" v-if="!isLoading">
                       <no-data />
                   </div>
               </template>
           </div>
       </template>
       <div v-else class="flex align-center h-100 justify-center not-login-box">
           <NotLogin :redirect="myFollowCompetition"/>
       </div>
    </div>
</template>
<script>
import { getOrderMatchApi, clearFinishApi } from '@/api/competition'
import CompetitionCardFootball from './CompetitionCardFootball.vue'
import CompetitionCardBasketballMode from './CompetitionCardBasketballMode.vue'
import CompetitionCardFootballMode from './CompetitionCardFootballMode.vue'
import CompetitionCardBasketball from '@/views/Competition/Components/CompetitionCardBasketball'
import NotLogin from '@/components/NotLogin'
import { Toast, PullRefresh } from 'vant'
import NoData from '@/components/NoData'
import { matchStatus } from '@/utils/utils'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
    name: 'MySchedule',
    props: {
        mode: {
            type: String,
            default: 'traditional'
        }
    },
    data () {
        return {
            matchStatus,
            followScheduleList: [],
            isLoading: false,
            myFollowCompetition: '/competition/0'
        }
    },
    components: {
        NoData,
        NotLogin,
        [Toast.name]: Toast,
        [PullRefresh.name]: PullRefresh,
        CompetitionCardFootball,
        CompetitionCardBasketballMode,
        CompetitionCardFootballMode,
        CompetitionCardBasketball
    },
    filters: {
        changeTime (val) {
            return dayjs(val).format('MM-DD HH:mm')
        }
    },
    computed: {
        ...mapState('user', ['token']),
        isTraditional () {
            return this.mode === 'traditional'
        }
    },
    watch: {
        token: {
            handler () {
                if (this.token) {
                    this.getData()
                }
            },
            immediate: true
        }
    },
    methods: {
        onRefresh () {
            // 重新加载数据
            this.getData()
        },
        async clearAppointent () {
            const { code, msg } = await clearFinishApi()
            if (code === 200) {
                Toast(msg)
                this.getData()
            }
        },
        async getData () {
            this.isLoading = true
            // Toast.loading({
            //     duration: 0,
            //     forbidClick: true
            // })
            this.$showLoading()
            this.followScheduleList = []
            const params = {
                pageNum: 1,
                pageSize: 1000,
                match_status: 2000
            }
            const { data, code } = await getOrderMatchApi(params)
            if (code === 200 && data) {
                this.followScheduleList = data.list
                this.followScheduleList.map(item => {
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
            }
            // Toast.clear()
            this.$hideLoading()
            this.isLoading = false
        },
        deleteItem (matchId) {
            this.followScheduleList = this.followScheduleList.filter(x => x.matchId !== matchId)
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.my-follow-schedule{
    background-color: #0E0E23;
}
.battles {
    overflow-y: overlay;
}
.clear-schedule{
    text-align: right;
    .clear-btn{
        display: inline-block;
        margin: 8px 0;
        padding: 4px 12px;
        border-radius: 22px;
        color: #b3b3b3;
        border: 1px solid #b3b3b3;
        margin-right: 8px;
    }
}
.item-container{
    background-color: #0E0E23;
    width: 100%;
    height: calc(100% - 40px);
}
.item{
    // background-color: #fff;
    margin-bottom: 5px;
    padding-bottom: 10px;
    .item-wrapper{
        margin: 0 auto;
        position: relative;
    }
    .item-aside-left{
        position: absolute;
        .match-title{
            width: 50px;
            height: 14px;
            background-color: #d93232;
            color: #fff;
            text-align: center;
            display: inline-block;
            border-radius: 3px;
            margin-top: 3px;
            margin-left: 3px;
        }
    }
    .item-main{
        position: relative;
        width: 100%;
        display: inline-block;
        .match-info{
            margin-top: 6px;
            font-size: 10px;
            margin-bottom: 8px;
            .match-time{
                position: absolute;
                left: 58px;
                top: 5px;
                color: #999;
            }
            p{
                display: inline-block;
                width: 100%;
                text-align: center;
                color: #999;
                .score{
                    margin-right: 3px;
                    margin-left: 3px;
                }
            }
        }
        .match-team{
            margin-bottom: 15px;
            color: #333;
            width: 93%;
            margin: 0 auto;
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
            img{
                vertical-align: middle;
                width: 15px;
                height: 15px;
            }
            .schedule-status{
                text-align: center;
                background-color: #efefef;
                color: #B7B7B7;
                border-radius: 3px;
                width: 30px;
                display: inline-block;
            }
        }
    }
    .item-aside-right{
        position: absolute;
        right: 10px;
        top: 16px;
        .action-btn{
            scale: .8;
            font-size: 12px;
            width: 48px;
            height: 23px;
            line-height: 23px;
            border-radius: 3px;
            text-align: center;
        }
        .cancel-followed{
            background-color: #4164FF;
            color: #fff;
        }
    }
}

.not-login-box{
    height: calc(100vh - 135px);
}
.overflow-y-auto{
    overflow-y: auto !important;
}
</style>
