<template>
    <div class="d-inline-block box w-100 h-100 overflow-hidden">
        <van-circle
            :value="percent"
            :text="label"
            :color="color"
            :layer-color="layerColor"
            :stroke-width="strokeWidth"
            :clockwise="clockwise"
        />
    </div>
</template>

<script>
import { Circle } from 'vant'
export default {
    name: 'CircleChart',
    props: {
        rateValue: {
            type: [Number, String],
            default: 0
        },
        color: {
            type: [String, Object],
            default: '#3DB1FB'
        },
        layerColor: {
            type: String,
            default: '#0E0E23'
        },
        strokeWidth: {
            type: [Number, String],
            default: 80
        },
        label: {
            type: String,
            default: ''
        },
        clockwise: { // 默认false=逆时针=主队，true=顺时针=客队
            type: Boolean,
            default: false
        },
        percent: { // 百分比
            type: Number,
            default: null
        }
    },
    components: {
        [Circle.name]: Circle
    }
}

</script>

<style lang="scss" scoped>
.overflow-hidden{
    width: 100%;
    overflow: hidden;
}
::v-deep {
    .van-circle {
        width: 100%;
        height: 100%;
    }
    .van-circle__text{
        font-size: 12px;
        color: #999;
    }
}
</style>
