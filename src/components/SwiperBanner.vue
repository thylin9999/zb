<template>
    <div class="seamless-warp " >
        <swiper
            v-if="list && list.length >= 1"
            ref="mySwiper"
            class="item"
            :options="swiperOption"
        >
            <swiper-slide
                v-for="(item,index) in list"
                :key="index"
                class="swiperslide"
            >
                <div class=" h-100" @click.prevent.stop="clickBanner(item)">
                    <img class="w-100" :src="item.pic_url" alt="">

                </div>
                <div class="bannerTitle text-overflow-hidden" v-if="type">
                    {{ item.title }}
                </div>
            </swiper-slide>
            <div class="swiper-pagination p-r-5" slot="pagination" :style="{'text-align': type ? 'right' : 'left'}"></div>
        </swiper>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
    name: 'SwiperBanner',
    components: {
        swiper,
        swiperSlide
    },
    props: {
        list: {
            type: Array,
            default: () => ([])
        },
        type: { // 只有新闻的进来需要展示 bannerTitle
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            swiperOption: {
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false // 手动滑动后继续自动播放
                },
                pagination: {
                    el: '.swiper-pagination'
                }
            }
        }
    },
    methods: {
        clickBanner (item) {
            if (this.type) { // 新闻banner点击进入详情
                this.$router.push({
                    name: 'NewsDetail',
                    params: {
                        id: item.id
                    }
                })
            }
            if (item.type === 1) { // 1，无， 2.内跳，3.外跳
                return
            }
            if (item.type === 2) {
                this.$router.push(item.links)
            }
            if (item.type === 3) {
                window.open(item.links, 'blank')
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.seamless-warp{
    width: 345px;
    border-radius: 3px;
    overflow: hidden;
    margin: 0 auto;
    border-radius: 10px;
}
.swiperslide{
    width: 100%;
    height: 125px;
}
.bannerTitle{
    position: absolute;
    width: 100px;
    height: 100px;
    z-index: 2;
    top: 95px;
    left: 5px;
    width: 150px;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 20px;
}

::v-deep {
    .swiper-pagination {
        text-align: right;
        padding-left: 15px;
    }
    .swiper-pagination-bullet {
        width: 6px;
        height: 6px;
        display: inline-block;
        background-color: #989898;
        border-radius: 1px;
        margin-right: 5px;
    }
    .swiper-pagination-bullet-active {
        width: 23px;
        height: 5px;
        border-radius: 2px;
        background-color: #FFFFFF;
    }
}
</style>
