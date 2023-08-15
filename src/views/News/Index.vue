<template>
    <div class="page">
        <div class="content h-100 p-relative">
            <div class="tabs flex">
                <div class="w-100 flex align-center overflow-x-auto">
                    <span
                        v-for="tab in  newsTypes"
                        :key="tab.id"
                        @click="changeTab(tab)"
                        class="d-inline-block font-14 font-400  tab-item"
                        :class="{
                            'is-active': tab.id === active
                        }"
                    >
                        {{ tab.label }}
                    </span>
                </div>
            </div>
            <van-pull-refresh class="h-100 w-100" v-model="refreshing" @refresh="onRefresh" disabled>
                <div class="item-wrapper p-t-10">
                    <SwiperBanner
                        :list="list"
                        :type="true"
                    />
                    <template>
                        <van-list
                            class="w-100 body m-t-5 p-b-5"
                            v-model="isLoading"
                            :finished="finished"
                            finished-text="没有更多了"
                            :immediate-check="false"
                            @load="onLoad"
                        >
                            <template v-if="newsList && newsList.length && !shelf">
                                <li
                                    class="w-100 m-b-5"
                                    v-for="news in newsList"
                                    :key="news.id"
                                    @click="goToDetail(news)"
                                >
                                    <Card
                                        :info="news"
                                    />
                                </li>
                            </template>
                            <template v-else>
                                <li
                                    class="w-100 m-b-5"
                                    v-for="i, index in 5"
                                    :key="index"
                                >
                                    <div class="shelf">
                                        <div class="s-left">
                                            <p></p>
                                            <p></p>
                                            <p></p>
                                        </div>
                                        <div class="s-right"></div>
                                    </div>
                                </li>
                            </template>
                        </van-list>
                    </template>
                </div>
            </van-pull-refresh>

        </div>
    </div>
</template>

<script>
import { Toast, Tabs, Tab, List, PullRefresh } from 'vant'
import SwiperBanner from '../../components/SwiperBanner.vue'
import Card from './Card.vue'
import { getNewsBanner, getNews, getNewsTypes } from '../../api/common'
import { statusCode } from '../../utils/statusCode'
import { mapState } from 'vuex'
export default {
    name: 'News',
    components: {
        [Tabs.name]: Tabs,
        [Tab.name]: Tab,
        [Toast.name]: Toast,
        [List.name]: List,
        [PullRefresh.name]: PullRefresh,
        SwiperBanner,
        Card
    },
    data () {
        return {
            active: 0,
            list: [],
            newsList: [],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            },
            refreshing: false,
            isLoading: false,
            finished: false,
            shelf: 5
        }
    },
    computed: {
        ...mapState('commonData', ['newsTypes']),
        apiParams () {
            const type = this.newsTypes.find((_, index) => index === this.active)
            return {
                pageSize: this.pagination.pageSize,
                currentPage: this.pagination.currentPage,
                type: (type && type.label) || '全部'
            }
        },
        isEmptyPage () {
            return !this.list.length && !this.newsList.length
        }
    },
    watch: {
        newsTypes: {
            handler () {
                // Toast.loading()
                this.$showLoading()
                this.refreshPage()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        onRefresh () {
            this.refreshing = true
            this.finished = false
            this.refreshPage()
        },
        onLoad () {
            this.pagination.currentPage++
            this.getNews()
        },
        refreshPage () {
            this.getBanners()
            this.init()
        },
        init () {
            if (this.newsTypes.length) {
                this.newsList = []
                this.getNews()
            }
            this.refreshing = false
        },
        async getTypes () {
            try {
                const { data, code } = await getNewsTypes()
                if (code === statusCode.success) {
                    this.tabs = data.reduce((all, item, index) => {
                        all.push({
                            label: item,
                            id: index
                        })
                        return all
                    }, [])
                    this.getBanners()
                    this.getNews()
                }
            } catch (e) {
                console.log('出错了', e)
            }
        },
        async getBanners () {
            try {
                const { data, code } = await getNewsBanner()
                if (code === statusCode.success) {
                    this.list = data.reduce((all, item) => {
                        all.push({
                            ...item,
                            pic_url: item.cover
                        })
                        return all
                    }, [])
                }
            } catch (e) {
                console.log(e, '出错了')
            }
        },
        async getNews () {
            try {
                const { data, code } = await getNews(this.apiParams)
                if (code === statusCode.success) {
                    if (data.list) {
                        this.newsList.push(...data.list)
                    }
                    if (this.newsList.length >= data.total) {
                        this.finished = true
                    }
                }
                this.isLoading = false
                this.$hideLoading()
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                this.shelf = false
            }
        },
        changeTab (tab) {
            this.active = tab.id
            this.pagination.currentPage = 1
            this.finished = false
            this.init()
        },
        goToDetail (news) {
            this.$router.push({
                name: 'NewsDetail',
                params: {
                    id: news.id
                }
            })
        }
    }
}

</script>

<style lang="scss" scoped>
.page {
    background: #0E0E23;
    // 头部54 底部65
    height: calc(100vh - 119px);
}

.tabs {
    padding: 0 15px 0 8px;
    background: url('../../assets/images/header/small.png') no-repeat;
    background-size: 100% 100%;
    width: 375px;
    height: 60px;
    .tab-item {
        flex-shrink: 0;
        width: 55px;
        height:44px;
        text-align: center;
        line-height: 44px;
        color: #fff;
        &.is-active {
            color: #FBA187;
            position: relative;
            &:after {
                display: inline-block;
                position: absolute;
                left: 17px;
                bottom: 3px;
                content: '';
                width: 20px;
                height: 3px;
                background: #FBA187;
            }
        }
    }
}
.item-wrapper {
    height: calc(100% - 44px);
    .body {
        height: calc(100% - 140px);
        overflow-y: auto;
    }
}
.shelf{
    width: 347px;
    height: 90px;
    background: #161C4F;
    border-radius: 10px;
    background: #161C4F;
    margin: 0 auto 5px;
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    .s-left{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
        p{
            height: 15px;
            background: #6C73AF;
            border-radius: 3px;
        }
        p:nth-child(1){
            width: 201px;
        }
        p:nth-child(2){
            width: 112px;
        }
        p:nth-child(3){
            width: 70px;
        }
    }
    .s-right{
        width: 110px;
        height: 65px;
        background: #6C73AF;
        border-radius: 3px;
    }
}
</style>
