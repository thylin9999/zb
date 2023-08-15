<template>
    <div class="d-inline-block">
        <span class="border-50 text-center   icon-box d-inline-block" @click="changeMode">
            <IconCom :icon="mode" :width="21" :height="20"/>
        </span>
        <!-- <van-popup v-model="show"  position="top" :overlay="false"> -->
            <div class="body p-t-30 p-l-30 p-r-30" v-if="show">
                <p class="font-14 m-b-15">比分模式</p>
                <div class="flex align-center justify-between">
                    <div
                        v-for="item in modes"
                        :key="item.id"
                        class="flex item flex-column justify-center align-center"
                        :class="{
                            'is-active': currentMode === item.icon
                        }"
                        @click="setMode(item)"
                    >
                        <IconCom :icon="currentMode === item.icon ? item.icon : `${item.icon}_h`" :width="20" :height="15"/>
                        <span class="font-12 m-t-5 font-400 ">{{ item.label}}</span>
                    </div>
                </div>
                <div class="footer m-t-30 text-center flex font-12 font-400 text-white align-center justify-center">
                    <span class="m-r-30" @click="cancel">取消</span>
                    <span class="confirm" @click="confirm">确定</span>
                </div>
            </div>
        <!-- </van-popup> -->
    </div>
</template>

<script>
import { Popup } from 'vant'
import IconCom from '@/components/IconCom'
export default {
    name: 'ChangeMode',
    components: {
        [Popup.name]: Popup,
        IconCom
    },
    props: {
        mode: {
            type: String,
            default: 'traditional'
        }
    },
    data () {
        return {
            show: false,
            modes: [
                {
                    id: 1,
                    icon: 'traditional',
                    label: '传统比分'
                },
                {
                    id: 2,
                    icon: 'mode',
                    label: '比分指数'
                },
                {
                    id: 3,
                    icon: 'size',
                    label: '大小指数'
                }
            ],
            currentMode: 'traditional'
        }
    },
    watch: {
        mode: {
            handler () {
                this.currentMode = this.mode
            },
            immediate: true
        }
    },
    methods: {
        changeMode () {
            this.show = !this.show
        },
        setMode (item) {
            this.currentMode = item.icon
        },
        cancel () {
            this.show = false
            this.currentMode = this.mode
        },
        confirm () {
            this.$emit('update:mode', this.currentMode)
            this.show = false
        }
    }
}

</script>

<style lang="scss" scoped>
.icon-box {
    line-height: 20px;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.25);
}
.body {
    width: 100%;
    height: 190px;
    background-color: transparent;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url('../../../assets/images/common/popup-bg.png');
    position: absolute;
    z-index: 11;
    left: 0;
    top: 88px;
    .item {
        width: 90px;
        height: 55px;
        background-color: #30366A;
        border-radius: 5px;
        color: #6C73AF;
        &.is-active {
            color: #fff;
            background-color: #FBA187;
        }
    }
    .footer {
        line-height: 17px;
        span {
            width: 60px;
            line-height: 30px;
            background-color: #30366A;
            border-radius: 5px;
        }
        .confirm {
            background-color: #FBA187;
        }
    }
}

::v-deep {
    .van-popup {
        background-color:transparent;
    }
    .van-popup--top {
        top: 92px;
    }
}
</style>
