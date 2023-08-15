<template>
    <div>
        <!-- 横幅 -->
        <transition name="van-slide-left" v-if="item.gift_type === 2">
            <div class="show-give-gift" v-show="item.show">
                <div class="item">
                    <div class="avatar">
                        <img :src="item.avatar" alt="">
                    </div>
                    <div class="text">
                        <p class="name">{{item.nickname}} 送出</p>
                        <p class="gift-name">{{ item.gift_name }}</p>
                    </div>
                    <div class="svga">
                        <CommonSvga :url="item.animation" :width="100" :height="100" :id="item.svgaId" v-if="item.show" />
                    </div>
                    <!-- 连击 -->
                    <div class="combo">
                        <img src="../assets/images/x.png" alt="">
                        <img :src="require(`../assets/images/${one}.png`)" alt="">
                        <img :src="require(`../assets/images/${two}.png`)" alt="" v-show="item.count>=10">
                        <img :src="require(`../assets/images/${three}.png`)" alt="" v-show="item.count>=100">
                    </div>
                </div>
            </div>
        </transition>
        <!-- 全屏 -->
        <div v-else>
            <CommonSvga :url="item.animation" :id="item.svgaId" v-if="item.show" />
        </div>
    </div>
</template>

<script>
import CommonSvga from '@/components/CommonSvga'
export default {
    components: {
        CommonSvga
    },
    data () {
        return {
            item: {
                animation: null, // svga 地址
                avatar: null, // 头像地址
                gift_id: null, // 礼物id
                gift_name: null, // 礼物名称
                label: null,
                member_id: '',
                msg: '',
                nickname: '',
                room_id: '',
                type: '',
                time: null
            },
            clear: null,
            one: '1', // 个位数图片
            two: '0', // 十位数图片
            three: '0' // 百位数图片
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.item.show = true
            this.outTime()

            this.$bus.$on(`up${this.item.svgaId}Count`, (count) => { // 连击数改变重新定时
                this.item.count = count
                clearTimeout(this.clear)
                this.outTime()
                this.handlerNub(count)
            })
        })
    },
    methods: {
        outTime () {
            this.clear = setTimeout(() => {
                this.item.show = false
            }, this.item.time)
        },
        handlerNub (count) {
            if (count < 10) { // 1位数
                this.one = count
            } else if (count >= 10 && count < 100) { // 2位数
                const str = String(count)
                this.two = str[1]
                this.one = str[0]
            } else { // 3位数
                const str = String(count)
                this.three = str[2]
                this.two = str[1]
                this.one = str[0]
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.show-give-gift{
    // margin-bottom: 10px;
}
.item{
    width: 255px;
    height: 85px;
    position: relative;
    background: url('../assets/images/chat/banners.png');
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    .avatar{
        width: 58px;
        height: 58px;
        position: absolute;
        background: url('../assets/images/chat/avatar.png');
        background-size: 100% 100%;
        top: 16px;
        left: 7px;
        padding-top: 4px;
        padding-left: 4px;
        img{
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
    }
    .text{
        position: absolute;
        left: 75px;
        .name{
            font-size: 12px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
        }
        .gift-name{
            margin-top: 3px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FBEBDA;
            background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
    .svga{
        position: absolute;
        // top: -8.5px;
        // right: -25px;
        right: 0;
        img{
            width: 100px;
            height: 100px;
        }
    }
}
.combo{
    img{
        width: 29px;
        height: 38.94px;
    }
    img:nth-child(1) {
        width: 25px;
        height: 21.78px;
    }
    position: absolute;
    right: -60px;
    display: flex;
    align-items: center;
}
</style>
