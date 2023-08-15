<template>
    <div class="page">
        <div class="header text-center w-100 bg-no-repeat bg-center bg-size-100">
            <van-icon
                class="text-white p-absolute back-btn"
                name="arrow-left"
                @click="goBack"
            />
            <span class="font-16 text-white font-medium">资讯详情</span>
        </div>
        <div class="content p-t-20 p-l-20 p-r-20 text-white">
            <van-skeleton title :row="5" :loading="isLoading">
                <div class="title font-16 font-600">{{ detail.title }}</div>
                <div class="flex time m-t-5 flex-column font-12 text-primary">
                    <span>作者：{{  detail.author }}</span>
                    <span>发布时间：{{  detail.update_time }}</span>
                </div>
                <div class="paragraph flex align-center flex-column p-t-20 font-14 text-white font-400" >
                    <!-- <img :src="detail.cover" alt=""> -->
                    <div class="m-t-10 v-html" v-html="detail.content"></div>
                </div>
                <div class="m-t-20 p-b-20">
                    <RecommendNews :id="detail.id" />
                </div>
            </van-skeleton>
        </div>
    </div>
</template>

<script>
import { getNewsDetail } from '@/api/common'
import { statusCode } from '@/utils/statusCode'
import { Icon, Toast, Skeleton } from 'vant'
import RecommendNews from './RecommendNews.vue'
export default {
    name: 'NewsDetail',
    components: {
        [Icon.name]: Icon,
        [Toast.name]: Toast,
        [Skeleton.name]: Skeleton,
        RecommendNews
    },
    data () {
        return {
            detail: {},
            isLoading: false
        }
    },
    watch: {
        '$route': {
            handler () {
                const query = this.$route.params
                this.id = query.id
                if (this.id) {
                    this.fetchData()
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async  fetchData () {
            // Toast.loading()
            this.$showLoading()
            this.isLoading = true
            try {
                const { code, data } = await getNewsDetail(this.id)
                if (code === statusCode.success) {
                    this.detail = { ...data }
                }
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                // Toast.clear()
                this.$hideLoading()
                this.isLoading = false
            }
        },
        goBack () {
            this.$router.push({
                name: 'News'
            })
        }
    }
}

</script>
.
<style lang="scss" scoped>
.page {
    background: #0E0E23;
    height: calc(100vh - 118px);
    .header {
        left: 0;
        top: 0;
        background-image: url('../../assets/images/header/small.png');
        height: 46px;
        line-height: 46px;
        position: relative;
        .back-btn{
            left: 10px;
            top: 14px;
        }
    }
}
.content {
    height: calc(100vh - 105px);
    overflow-y: auto;
    .title {
        line-height: 22px;
    }
    .time {
        line-height: 14px;
    }
    .paragraph{
        line-height: 20px;
        // text-indent: 30px;
        min-height: 300px;
        img {
            width: 335px;
        }
    }
    .v-html{
        width: 100%;
        word-break:break-all;
        overflow: hidden;
    }
}

::v-deep {
    .header {
        height: 40px;
        line-height: 40px;
    }
}
</style>
