<template>
    <div v-if="list && list.length" class="gifts">
        <div class="gift-item" v-for="item in list" :key="item.id" @click="showSvga(item)">
            <div class="top-img" :class="{active: item.id === id}">
                <!-- 1普通 2热 3贵族 4 球票 -->
                <span v-if="item.flag === 2">热</span>
                <CommonSvga v-if="item.id === id" :url="item.animation" :width="svgaWidth" :height="svgaHight" :id="id"  />
                <img v-else  :src="item.img" alt="">
            </div>
            <div>
                <p class="name text-overflow-hidden">{{ item.name }}</p>
                <p class="price">{{ item.amount }}{{ ['-','球币','球票'][item.sales_type] }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import CommonSvga from '@/components/CommonSvga'
export default {
    components: {
        CommonSvga
    },
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            id: '',
            svgaWidth: null,
            svgaHight: null
        }
    },
    methods: {
        showSvga (item) {
            this.id = item.id
            this.$emit('update:item', item)
            this.svgaHight = 100
            this.svgaWidth = 100
        }
    }
}
</script>

<style lang="scss" scoped>
.gift-item{
    text-align: center;
    margin-bottom: 15px;
    width: 60px;
    .top-img{
        width: 60px;
        height: 60px;
        background: #0E0E23;
        border-radius: 10px;
        position: relative;
        // padding-top: 5px;
        margin: 0 auto;
        overflow: hidden;
        span{
            position: absolute;
            top: -2px;
            left: -3px;
            // width: 19px;
            // height: 12px;
            width: 23.75px; // 0.8处理
            height: 15px;
            line-height: 15px;
            background: #6C73AF;
            border-radius: 10px 0px 5px 0px;
            font-size: 10px;
            transform: scale(.8);
            text-align: center;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
        }
        img{
            display: block;
            width: 60px;
            height: 60px;
            margin: auto;
        }
        &.active{
            border: 1px solid #6C73AF;
        }
    }
    .name{
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 14px;
        margin-top: 5px;
        margin-bottom: 1px;
        transform: scale(.83);
        width: 100%;
    }
    .price{
        font-size: 8px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FBEBDA;
        background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transform: scale(.83);
    }
}
</style>
