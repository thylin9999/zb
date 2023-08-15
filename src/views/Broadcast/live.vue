<template>
    <div class="live-broad">
        <div class="content  p-relative">
            <div class="header-box">
                <div class="search-box w-100 p-l-10 p-r-5 flex align-center ">
                    <IconPng icon="my/app-logo-trans" :width="30" :height="30" />
                    <van-search
                        class="m-l-15 text-primary font-12 flex-1"
                        v-model="searchValue"
                        placeholder="搜索 房间ID/主播ID/赛事.."
                        @focus="searchInput"
                    >
                    <template slot="left-icon">
                        <img :src="searchIcon" alt="" class="search-icon">
                    </template>
                    </van-search>
                </div>
                <div class="tabs w-100 flex align-center overflow-x-auto">
                <span
                    v-for="tab in  liveClassificData"
                    :key="tab.id"
                    @click="changeTab(tab)"
                    class="d-inline-block font-14 font-400  tab-item"
                    :class="{
                        'is-active': tab.id === supportId
                    }"
                >
                    {{ tab.label }}
                </span>
                </div>
            </div>
            <div class="live-wrapper overflow-y-auto">
                <div v-if="supportId === 5 && !token" class="flex align-center justify-center w-100 h-100" >
                    <NotLogin :redirect="myFollowCompetition"/>
                </div>
                <div v-if="supportId === 6" class="flex align-center justify-center w-100 h-100" >
                    <home class="w-100"/>
                </div>
                <template v-else>
                    <div class="live-list p-t-10">
                        <van-pull-refresh class="h-100 w-100 " v-model="refreshing" @refresh="onRefresh" disabled>
                            <van-list
                                class="w-100 flex flex-wrap overflow-y-auto"
                                v-model="loading"
                                :finished="finished"
                                :immediate-check="false"
                                :finished-text="liveData.length ? '没有更多了' : ''"
                                @load="onLoad"
                            >
                                <template
                                    v-for="competition in liveData"
                                >
                                    <competition-card
                                        class="item-card"
                                        :key="competition.id"
                                        :competition="competition"
                                    />

                                </template>
                            </van-list>
                        </van-pull-refresh>
                    </div>
                    <div  class="battles flex justify-center align-center" v-if="!loading && !liveData.length">
                        <no-data />
                    </div>
                </template>

            </div>
        </div>

    </div>
</template>

<script>
import { getLiveRoomApi, getFollowLiveApi } from '@/api/Host'
import CompetitionCard from '@/components/CompetitionCard'
import Home from '../Home.vue'
import NoData from '@/components/NoData'
import { Toast, Tabs, Tab, PullRefresh, List, Search } from 'vant'
import { getItem } from '@/utils/cookie'
import NotLogin from '@/components/NotLogin'
import IconPng from '@/components/IconPng'
import { mapState } from 'vuex'
export default {
    data () {
        return {
            loading: false,
            refreshing: false,
            liveClassificData: [
                { id: 5, label: '关注' },
                { id: 6, label: '推荐' },
                // { id: 0, label: '全部' },
                { id: 1, label: '足球' },
                { id: 2, label: '篮球' },
                { id: 3, label: '电竞' },
                { id: 4, label: '其他' }
            ],
            supportId: 6,
            liveData: [],
            loginToken: '',
            myFollowCompetition: '/live-list/5',
            finished: false,
            pagination: {
                currentPage: 0,
                pageSize: 10,
                total: 0
            },
            searchValue: '',
            searchIcon: require('@/assets/images/search.png')
        }
    },
    components: {
        NoData,
        [Toast.name]: Toast,
        [Tabs.name]: Tabs,
        [Tab.name]: Tab,
        [PullRefresh.name]: PullRefresh,
        [List.name]: List,
        [Search.name]: Search,
        CompetitionCard,
        NotLogin,
        Home,
        IconPng
    },
    computed: {
        ...mapState('user', ['token']),
        apiParams () {
            return {
                pageNum: this.pagination.currentPage,
                pageSize: this.pagination.pageSize,
                type: this.supportId === 0 ? '' : this.supportId
            }
        }
    },
    created () {
        this.loginToken = getItem('token')
        this.supportId = (this.$route.params.tab || 6) * 1
    },
    methods: {
        onLoad () {
            this.loading = true
            this.pagination.currentPage++
            this.getData()
        },
        onRefresh () {
            // 重新加载数据
            this.refreshing = true
            this.finished = false
            this.pagination.currentPage = 1
            this.getData(true)
        },
        /* eslint-disable */
        enterLive (room_id) {
            this.$router.push({
                name: 'Broadcast',
                query: {
                    room_id: room_id
                }
            })
        },
        /* eslint-enable */
        changeClassific (classificId) {
            if (classificId === 5) {
                if (!this.token) {
                    this.$store.commit('commonData/SET', {
                        loginDialogUrl: '/live-list/5'
                    })
                    this.openLoginDialog()
                    return
                }
            }

            this.supportId = classificId
            if (classificId !== 5 || (classificId === 5 && this.token)) {
                this.pagination.currentPage = 0
                this.liveData = []
                this.finished = false
                this.onLoad()
            }
        },
        changeTab (tab) {
            this.changeClassific(tab.id)
        },
        async getData () {
            if (this.supportId !== 5) {
                const { data } = await getLiveRoomApi(this.apiParams)
                if (data) {
                    const list = data.list || []
                    if (this.refreshing) {
                        this.liveData = list
                    } else {
                        this.liveData.push(...list)
                    }
                    this.pagination.total = data.total
                } else {
                    // 无数据，终止请求
                    this.finished = true
                }
            } else {
                const { data } = await getFollowLiveApi({ ...this.apiParams, live_status: 2 })
                const list = data || []
                if (this.refreshing) {
                    this.liveData = list
                } else {
                    this.liveData.push(...list)
                }
                this.pagination.total = (data && data.length) || 0
            }
            if (this.pagination.total <= this.liveData.length) {
                this.finished = true
            }
            this.loading = false
            this.refreshing = false
        },
        searchInput () {
            this.$router.push({
                name: 'SearchPage',
                params: {
                    search: this.searchValue
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.header-box{
    //border-radius: 0 0 10px 10px;
    // background: linear-gradient(180deg, #651E8A 0%, #0E0E23 100%);
    background: linear-gradient(180deg, #2C1447 0%, #232A38 100%);
    box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.51);
    padding-top: 15px;
}
.search-box {
    background-color: transparent;
}
.battles {
    height: calc(100% - 70px);
    overflow-y: overlay;
}
.live-broad{
    // 头部54 底部65
    height: calc(100vh - 119px);
}
.home-header {
    z-index: 1;
}
.fixed-header{
    width: 100%;
}
.content {
    z-index: 3;
    // 头部54 底部65
    height: calc(100vh - 119px);
}
.live-wrapper{
    font-weight: 300;
    height: calc(100% - 44px);
    background: linear-gradient(180deg, #191E29 0%, #232A38 100%) #0E0E23;
    h4{
        font-weight: 400;
    }
    .live-list{
        padding-left: 14px;
        padding-right: 14px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .live-item{
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-radius: 3px;
            .live-show-img{
                position: relative;
                img{
                    width: 178px;
                    height: 103px;
                    border-radius: 3px 3px 0 0;
                }
                .live-show-num{
                    position: absolute;
                    bottom: 10px;
                    right: 8px;
                    color: #FFFFFF;
                }
            }
            .live-show-info{
                display: flex;
                margin-top: 3px;
                margin-left: 8px;
                .live-portrait{
                    display: flex;
                    align-items: center;
                    img{
                        width: 20px;
                        height: auto;
                        margin-right: 5px;
                    }
                }
                .live-content{
                    p,h4{
                        margin: 0;
                    }
                }
            }
        }
        .live-item:last-child{
            margin-bottom: 62px;
        }
        .item-card {
            height: 132px;
        }
    }

}
.tabs {
    padding: 0 8px;
    //background-image: url('../../assets/images/header/small.png');
    .tab-item {
        flex: 1;
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
                left: 50%;
                transform: translateX(-50%);
                bottom: 0;
                content: '';
                width: 20px;
                height: 3px;
                background: #FBA187;
            }
        }
    }
}
.search-icon{
    width: 25px;
    height: 25px;
    position: absolute;
}
::v-deep {
    .van-field__body{
        padding-left: 25px;
    }
    .van-pull-refresh__track {
        display: flex;
        flex-wrap: wrap;
    }
    .van-list__finished-text, .van-list__loading {
        width: 100%;
    }
    .van-search {
        padding: 0;
        border-radius: 15px;
        color: #48506B;
        background-color: transparent;
        .van-icon , .van-field__control{
            color: #48506B!important;
        }
    }
    .van-search__content {
        border-radius: 18px;
        background: #020202;
    }
    .van-field__left-icon {
        font-size: 16px;
    }

    .van-field__body{
        .van-field__control{
            &::-webkit-input-placeholder{
                color: #48506B;
                font-size: 10px;
            }
            &::-moz-placeholder{
                color: #48506B;
                font-size: 10px;
            }
        }
    }

}
</style>
