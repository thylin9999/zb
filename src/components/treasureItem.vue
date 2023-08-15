<template>
    <div class="treasure-item">
        <img src="../assets/images/chat/treasure-close.png" alt="">
        <div class="default" v-if="item.status === 3">
            {{ item.remark }}
        </div>
        <div class="default btn" v-else-if="item.status === 2" @click="draw">
            开启
        </div>
        <div class="default" v-else-if="item.current && item.status === 1 ">
            {{ currentTime }}
        </div>
        <div class="default" v-else>
            {{ time == '00:00' ? '60:00': time }}
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
    props: {
        item: {
            type: Object,
            default: () => [{}]
        },
        currentTime: {
            type: String,
            default: ''
        }
    },
    computed: {
        time () {
            return dayjs(this.item.time * 1000).format('mm:ss')
        }
    },
    methods: {
        draw () {
            this.$emit('draw', this.item)
        }
    }
}
</script>

<style lang="scss" scoped>
.treasure-item{
    text-align: center;
    line-height: 10px;
    width: 48px;
    img{
        width: 45px;
        height: 45px;
        margin-left: 2px;
    }
    .default{
        // width: 40px;  // 0.9处理
        // height: 14px;
        width: 44px;
        height: 17px;
        line-height: 17px;
        background: #6C73AF;
        border-radius: 10px;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        transform: scale(0.8);
        text-align: center;
        margin: 0 auto;
    }
    .btn{
        background: #FBA187;
    }
}
</style>
