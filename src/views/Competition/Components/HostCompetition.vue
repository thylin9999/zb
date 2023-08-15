<template>
<div class="list ">
    <template
        v-if="showList.length"
    >
        <HostCompetitionCard
            v-for="competition in showList"
            :key="competition.matchId"
            :competition="competition"
            @refresh="fetchData"
        />

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
import HostCompetitionCard from '@/views/Competition/Components/HostCompetitionCard'
import { getHostCompetition } from '@/api/Host'
import { statusCode } from '@/utils/statusCode'
import { Empty } from 'vant'
export default {
    name: 'HostCompetition',
    components: {
        HostCompetitionCard,
        [Empty.name]: Empty
    },
    props: {
        day: {
            type: String,
            default: null
        }
    },
    data () {
        return {
            pagination: {
                total: 0,
                currentPage: 1,
                pageSize: 2000
            },
            showList: [],
            isLoading: false
        }
    },
    computed: {
        apiParams () {
            return {
                day: this.day,
                pageNumber: this.pagination.currentPage,
                pageSize: this.pagination.pageSize
            }
        }
        // competition () {
        //     return this.showList[0]
        // }
    },
    watch: {
        day: {
            handler () {
                this.fetchData()
            },
            immediate: true
        }
    },
    methods: {
        async fetchData () {
            this.isLoading = true
            // Toast.loading({
            //     duration: 0,
            //     forbidClick: true
            // })
            this.$showLoading()
            try {
                const { data, code } = await getHostCompetition(this.apiParams)
                if (code === statusCode.success) {
                    this.showList = data && data.list
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                // Toast.clear()
                this.$hideLoading()
                this.isLoading = false
            }
        }
    }
}
</script>

<style scoped>

</style>
