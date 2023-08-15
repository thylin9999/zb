<template>
    <van-list
    v-model="loading"
    :finished="finished"
    :finished-text="list.length ? '没有更多了': ''"
    :immediate-check="false"
    :offset="0"
    @load="onLoad"
    >
        <div class="plan-content" v-if="list && list.length" @click="goDown">
            <plan-item v-for="item in list" :key="item.id" :item="item" />
        </div>
        <van-empty
        v-else
        class="custom-image"
        :image="require('../../../assets/images/notFound.png')"
        description="暂无数据"
        />
    </van-list>
</template>

<script>
import PlanItem from './PlanItem.vue'
import { Empty, List } from 'vant'
import { debounce } from '@/utils/lodashUtils.js'
export default {
    components: {
        PlanItem,
        [Empty.name]: Empty,
        [List.name]: List
    },
    props: {
        list: {
            type: Array,
            default: () => ([])
        },
        finished: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            loading: false
        }
    },
    watch: {
        list (newVlue, oldVlue) {
            if (oldVlue.length === newVlue.length) {
                this.$emit('update:finished', true)
                return
            }
            // 数据全部加载完成
            this.loading = false
        }
    },
    methods: {
        onLoad: debounce(function () {
            // 加载状态结束
            this.loading = true
            this.$emit('longList')
        }, 1000),
        goDown () {
            this.openDownloadDialog()
        }
    }
}
</script>

<style lang="scss" scoped>
.plan-content{
    padding: 10px 15px;
}
</style>
