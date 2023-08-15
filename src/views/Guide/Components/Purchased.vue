<template>
    <div class="pur">
        <div class="p-title">
            <img src="../../../assets/images/guide/pur-back.png" alt="" @click="back">
            已购方案
        </div>
            <div class="p-body">
                <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                :immediate-check="false"
                :offset="0"
                @load="onLoad"
                >
                    <template v-if="list && list.length">
                        <purchased-item v-for="item in list" :item="item" :key="item.id" />
                    </template>
                    <van-empty
                    v-else
                    class="custom-image"
                    :image="require('../../../assets/images/notFound.png')"
                    description="暂无数据"
                    />
                </van-list>
            </div>
    </div>
</template>

<script>
import PurchasedItem from '@/views/Guide/Components/PurchasedItem.vue'
import { getPurchased } from '@/api/guide'
import { statusCode } from '@/utils/statusCode'
import { Empty, List, Toast } from 'vant'
import { debounce } from '@/utils/lodashUtils.js'
export default {
    components: {
        PurchasedItem,
        [Empty.name]: Empty,
        [List.name]: List,
        [Toast.name]: Toast
    },
    props: {
        purShow: {
            type: Boolean,
            default: false
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
            loading: false, // 长列表等待
            finished: false // 长列表全部加在完成
        }
    },
    computed: {
        apiParams () {
            return {
                pageNum: this.pagingData.pageNum,
                pageSize: this.pagingData.pageSize,
                type: 1
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
            try {
                const data = await getPurchased(this.apiParams)
                if (data.code === statusCode.success) {
                    if (data.data.list && data.data.list.length) {
                        this.list = [...this.list, ...data.data.list]
                        if (this.list.length === data.data.total) this.finished = true
                    } else {
                        this.list = []
                    }
                    // Toast.clear()
                    this.$hideLoading()
                    this.loading = false
                }
            } catch (e) {
                console.log('出现错误')
            }
        },
        // 长列表
        onLoad: debounce(function () {
            this.loading = true
            this.pagingData.pageNum += 1
            this.init()
        }, 1000),
        // 返回
        back () {
            this.$emit('update:purShow', false)
        }
    }

}
</script>

<style lang="scss" scoped>
.pur{
    position: fixed;
    top: 54px;
    left: 0;
    // height: 100%;
    height: calc(100% - 54px);
    width: 100%;
    z-index: 2;
    background: #0E0E23;
    // padding-bottom: 60px;
    overflow: auto;
    .p-title{
        width: 375px;
        height: 45px;
        background: linear-gradient(180deg, #651E8A 0%, #0E0E23 100%);
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 45px;
        text-align: center;
        box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.17);
        border-radius: 0px 0px 9px 9px;
        position: relative;
        border-bottom: 1px solid #2F3568;
        img{
            width: 10px;
            height: 17px;
            position: absolute;
            left: 15px;
            top: calc(50% - 8px);
        }
    }
    .p-body{
        background: #0E0E23;
        padding: 10px 15px;
        overflow-y: auto;
        height: calc(100% - 100px);
    }
}
</style>
