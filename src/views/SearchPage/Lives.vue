<template>
<div class="page"
    :class="{
        'h-100 overflow-y-auto': !isAll
    }"
>
    <p v-if="isAll" class="title p-t-10 p-l-20 p-b-10 font-14 font-400 ">相关直播</p>
    <div class="list w-100 flex p-l-15  flex-wrap ">
        <van-list
            class="w-100 flex flex-wrap"
            v-model="isLoading"
            :finished="finished"
            :immediate-check="!isAll"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <template v-if="list.length">
                <template
                    v-for="competition in list"
                >
                    <competition-card
                        class="item-card"
                        :key="competition.id"
                        :competition="competition"
                    />
                </template>
            </template>
            <NoData class=" w-100 flex align-center flex-column" v-if="!isLoading &&!list.length" />
        </van-list>
    </div>
</div>
</template>

<script>

import { statusCode } from '@/utils/statusCode'
import NoData from '@/components/NoData'
import { searchBroadcast } from '@/api/Host'
import CompetitionCard from '@/components/CompetitionCard'
import { Toast, List } from 'vant'
export default {
    name: 'Lives',
    components: {
        [Toast.name]: Toast,
        [List.name]: List,
        NoData,
        CompetitionCard
    },
    props: {
        search: {
            type: String,
            default: ''
        },
        isAll: { // 是否位列表页
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            isLoading: false,
            loading: false,
            list: [],
            pagination: {
                currentPage: 0,
                pageSize: 10,
                total: 0
            },
            finished: false
        }
    },
    created () {
        if (this.isAll) {
            this.pagination.currentPage = 1
            this.fetchData()
        }
    },
    computed: {
        apiParams () {
            return {
                search: this.search,
                pageNum: this.pagination.currentPage,
                pageSize: this.pagination.pageSize
            }
        }
    },
    methods: {
        onLoad () {
            if (!this.isAll) {
                this.pagination.currentPage++
                this.fetchData()
            } else {
                this.isLoading = false
            }
        },
        async fetchData () {
            this.isLoading = true
            try {
                const { data, code } = await searchBroadcast(this.apiParams)
                if (code === statusCode.success && !!data) {
                    this.pagination.currentPage = data.current_page
                    this.pagination.pageSize = data.per_page
                    this.pagination.total = data.total
                    const list = (data && data.list) || []
                    if (!this.isAll) {
                        this.list.push(...list)
                        this.finished = this.list.length >= this.pagination.total
                    } else {
                        this.list = list.slice(0, 10)
                    }
                } else {
                    this.finished = true
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    color: #48506B;
}

::v-deep {
    .van-list__loading, .van-list__finished-text {
        width: 100%;
    }

}
</style>
