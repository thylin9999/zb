<template>
<div class="w-100 h-100">
    <TimeLine
        :time.sync="currentTime"
        :show-prev="showPrev"
    />
    <div class="battles p-t-15">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="loadData"
            >
                <template
                    v-for="battle in battles"
                >
                    <competition-battle
                        :battle="battle"
                        :key="battle.id"
                    />
                </template>
            </van-list>
        </van-pull-refresh>
    </div>
    <div v-if="!battles.length" class="battles flex justify-center align-center">
        <no-data />
    </div>
</div>
</template>

<script>
import TimeLine from '@/views/Competition/Components/TimeLine'
import dayjs from 'dayjs'
import CompetitionBattle from '@/views/Competition/Components/CompetitionBattle'
import NoData from '@/components/NoData'
import { getBattles } from '@/api/competition'
import { statusCode } from '@/utils/statusCode'
import { List, PullRefresh } from 'vant'
export default {
    name: 'CompetitionWithTime',
    props: {
        showPrev: {
            type: Boolean,
            default: false
        }
    },
    components: {
        [List.name]: List,
        [PullRefresh.name]: PullRefresh,
        TimeLine,
        CompetitionBattle,
        NoData
    },
    data () {
        return {
            currentTime: dayjs().format('MM-DD'),
            battles: [],
            pagination: {
                pageSize: 20,
                currentPage: 1,
                total: 0
            },
            loading: false,
            finished: false,
            refreshing: false
        }
    },
    computed: {
        apiParams () {
            return {
                date: this.currentTime
            }
        }
    },
    watch: {
        currentTime () {
            this.battles = []
            this.fetchData()
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            const { data } = await getBattles(this.apiParams)
            if (this.refreshing) {
                this.battles = []
                this.refreshing = false
            }
            if (data.code === statusCode.success) {
                this.pagination.total = data.page.count
                this.pagination.currentPage = data.page.currentPage
                const list = data.data.reduce((all, item) => {
                    all.push({
                        ...item,
                        statusName: item.status === 1 ? '未开始' : (item.status === 2 ? '进行中' : '已结束')
                    })
                    return all
                }, [])
                this.battles.push(...list)
                this.loading = false
                if (this.battles.length > 100) {
                    this.finished = true
                }
            }
        },
        loadData () {
            // this.fetchData()
        },
        onRefresh () {
            // 清空列表数据
            // this.battles = []
            this.finished = false
            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.loading = true
            this.fetchData()
        }
    }
}
</script>

<style lang="scss" scoped>
.battles {
    height: calc(100% - 70px);
    overflow-y: overlay;
}
.no-more{
    font-size: 13px;
}
.no-data {

}
</style>
