<template>
    <div class="live-guide">
        <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="list.length ? '没有更多了' : ''"
            :immediate-check="false"
            :offset="0"
            @load="onLoad"
            >
            <template v-if="list && list.length">
                <live-guide-item  v-for="item in list" :item="item" :key="item.id" />
            </template>
            <van-empty
            v-else
            class="custom-image"
            :image="require('../../../assets/images/notFound.png')"
            description="暂无数据"
            />
        </van-list>
    </div>
</template>

<script>
import liveGuideItem from '@/views/Guide/Components/liveGuideItem.vue'
import { Toast, Empty, List } from 'vant'
import { getGuideList } from '@/api/guide'
import { statusCode } from '@/utils/statusCode'
import { debounce } from '@/utils/lodashUtils.js'
export default {
    components: {
        liveGuideItem,
        [Toast.name]: Toast,
        [Empty.name]: Empty,
        [List.name]: List
    },
    props: {
        roomInfo: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            list: [],
            pagingData: {
                pageNum: 1,
                pageSize: 10,
                total: null
            },
            loading: false,
            finished: false
        }
    },
    computed: {
        apiParams () {
            return {
                pageNum: this.pagingData.pageNum,
                pageSize: this.pagingData.pageSize,
                match_id: this.roomInfo.match_id
            }
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        async init () {
            // Toast.loading({
            //     duration: 0,
            //     forbidClick: true
            // })
            this.$showLoading()
            const data = await getGuideList(this.apiParams)
            if (data.code === statusCode.success) {
                this.pagingData.total = data.data.total
                this.list = [...this.list, ...data.data.list]
                if (this.list.length === data.data.total) {
                    this.finished = true
                }
                this.loading = false
                // Toast.clear()
                this.$hideLoading()
            } else {
                this.$toast('出现错误')
            }
        },
        onLoad: debounce(function () {
            this.loading = true
            this.pagingData.pageNum += 1
            this.init()
            console.log('更新')
        }, 1000)
    }

}
</script>

<style lang="scss" scoped>
    .live-guide{
        height: 100%;
        padding: 10px 0;
        overflow-y: auto;
    }
</style>
