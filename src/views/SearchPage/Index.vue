<template>
<div class="page h-100">
    <div class="header p-t-15 p-b-5 p-l-15 p-r-15">
        <van-search
            v-model="search"
            show-action
            placeholder="请输入搜索关键词"
            @input="onSearch"
            @cancel="onCancel"
        >
        <template slot="left-icon">
            <img :src="searchIcon" alt="" class="search-icon">
        </template>
        </van-search>
        <div class="tabs flex align-center justify-center">
            <span
                class="tab-item"
                v-for="tab in tabs"
                :key="tab.id"
                :class="{
                    'is-active': currentTab === tab.id
                }"
                @click="changeTab(tab)"
            >{{ tab.label }}</span>
        </div>
    </div>
    <div class="body overflow-y-auto p-t-5" :key="updateKey">
        <Host
            v-if="notLives"
            :search="search"
            :is-all="isAll"
        />
        <Lives
            v-if="notHost"
            :search="search"
            :is-all="isAll"
        />
    </div>
</div>
</template>

<script>
import { Search } from 'vant'
import Host from '@/views/SearchPage/Host'
import Lives from '@/views/SearchPage/Lives'
import { debounce } from '@/utils/lodashUtils.js'
export default {
    name: 'Index',
    components: {
        [Search.name]: Search,
        Host,
        Lives
    },
    data () {
        return {
            search: '',
            currentTab: 1,
            tabs: [
                {
                    id: 1,
                    label: '综合'
                },
                {
                    id: 2,
                    label: '主播'
                },
                {
                    id: 3,
                    label: '直播'
                }
            ],
            updateKey: +new Date().getTime(),
            searchIcon: require('@/assets/images/search.png')
        }
    },
    created () {
        const params = this.$route.params
        this.search = params.search
    },
    computed: {
        notLives () {
            return this.currentTab !== 3
        },
        notHost () {
            return this.currentTab !== 2
        },
        isAll () {
            return this.currentTab === 1
        }
    },
    methods: {
        onSearch: debounce(function () {
            this.updateKey = +new Date().getTime()
        }, 500),
        onCancel () {
            this.$router.go(-1)
        },
        changeTab (tab) {
            this.currentTab = tab.id
            this.updateKey = +new Date().getTime()
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    background: linear-gradient(180deg, #651E8A 0%, #0E0E23 100%);
}
.search-icon{
    width: 25px;
    height: 25px;
    position: absolute;
}
.tabs {
    padding: 0 8px;
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
.body {
    height: calc(100% - 98px);
    paddin-top: 12px;
    background: linear-gradient(180deg, #191E29 0%, #232A38 100%) #0E0E23;
}
::v-deep {
    .van-search  {
        background-color: transparent;
    }
    .van-search__content {
        background-color: #020202;
        border-radius: 18px;
    }
    .van-search__action {
        color: #fff;
    }
    .van-search {
        padding: 0;
    }
    .van-field__body{
        .van-field__control{
            padding-left: 25px;
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
