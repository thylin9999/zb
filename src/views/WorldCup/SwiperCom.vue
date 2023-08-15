<template>
<div class="styles_huandengboxlist">
    <section>
        <swiper
            ref="domSwiper"
            class="swiper"
            :options="swiperOption"
            @slide-change="onSlideChange"
        >
            <swiper-slide
                v-for="prize in prizes"
                :key="prize.id"
            >
                <div class="styles_item">
                    <div class="styles_heads">{{ prize.level }}</div>
                    <img :alt="prize.title"
                         :src="prize.img"
                         style="color:transparent">
                    <div class="styles_bottom">{{ prize.title }}</div>
                    <div class="styles_detail">{{ prize.info}}</div>
                </div>
            </swiper-slide>

        </swiper>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
    </section>
    <div class="styles_swapbox w-100">
        <div class="styles_pointlist">
            <div class="styles_point flex justify-center align-center"
                 v-for="(prize, index) in prizes"
                 :key="prize.id + 'point'"
                 :class="{
                     'is-active': index === activeIndex
                 }"
            >
                <div class="styles_activepointafter"></div>
            </div>
        </div>
        <div class="styles_giftboxlist">
            <div class="styles_gift1"
                 v-for="(prize, index) in prizes"
                 :key="prize.id + 'prize'"
                 :class="{
                     'is-active': index === activeIndex
                 }"
            >
                <img  :src="prize.img">
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
    name: 'SwiperCom',
    components: {
        swiper,
        swiperSlide
    },
    data () {
        return {
            swiperOption: {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                pagination: {
                    el: '.swiper-pagination'
                }
            },
            prizes: [
                {
                    id: 0,
                    title: '保时捷帕拉梅拉汽车',
                    info: '命中31个选项',
                    level: '特等奖',
                    img: require('../../assets/images/worldCup/img-gift-che.png')
                },
                {
                    id: 1,
                    title: '劳力士水鬼系列手表',
                    info: '命中29~30个选项',
                    level: '一等奖',
                    img: require('../../assets/images/worldCup/img-gift-biao.png')
                },
                {
                    id: 2,
                    title: '苹果电脑IMAC',
                    info: '命中27-28个选项',
                    level: '二等奖',
                    img: require('../../assets/images/worldCup/img-gift-mac.png')
                },
                {
                    id: 3,
                    title: ' 华为Nova10 Pro',
                    info: '命中25~26个选项',
                    level: '三等奖',
                    img: require('../../assets/images/worldCup/img-gift-shouji.png')
                },
                {
                    id: 4,
                    title: '小米空气净化器',
                    info: '命中21~24个选项',
                    level: '四等奖',
                    img: require('../../assets/images/worldCup/img-gift-xiaomi.png')
                },
                {
                    id: 5,
                    title: '奖励 ZIPP打火机',
                    info: '命中17~20个选项',
                    level: '五等奖',
                    img: require('../../assets/images/worldCup/img-gift-huoji.png')
                }
            ],
            activeIndex: 0
        }
    },
    methods: {
        onSlideChange () {
            this.activeIndex = this.$refs.domSwiper.swiper.activeIndex
        }
    }
}
</script>

<style lang="scss" scoped>
.styles_huandengboxlist {
    width: 327px;
    height: 400px;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
}
.swiper {
    width: 250px;
    z-index: 0!important;
}
.swiper-slide {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    position: relative;
    transition-property: transform;
    .styles_item {
        width: 250px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .styles_heads {
            width: 80px;
            height: 25px;
            position: relative;
            font-family: PingFangSC;
            font-size: 14px;
            font-weight: 500;
            line-height: 25px;
            text-align: center;
            color: #fff;
            margin-top: 22px;
            background-color: #da2259;
            background-size: 100%;
            background-image: url('../../assets/images/worldCup/img-jiang-bg.png');
            &:before {
                content: "";
                position: absolute;
                left: -25px;
                height: 0;
                border: 12.5px solid transparent;
                border-right-color: #da2259;
            }
            &:after {
                content: "";
                position: absolute;
                right: -25px;
                height: 0;
                border: 12.5px solid transparent;
                border-left-color: #da2259;
            }
        }
        .styles_bottom {
            font-family: PingFangSC;
            font-size: 22px;
            font-weight: 600;
            text-align: center;
            color: #da2259;
            margin-top: 13px;
        }
        .styles_detail {
            font-family: PingFangSC;
            font-size: 14px;
            text-align: center;
            color: #333;
            margin-top: 5px;
        }
    }
    img {
        width: 250px;
        height: 144px;
    }
}

.styles_giftboxlist {
    display: flex;
    justify-content: center;
    align-items: center;
    top: 300px;
    left: 6px;
    position: absolute;
    .styles_gift1 {
        width: 44px;
        height: 44px;
        border-radius: 4px;
        background-color: #fff;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 4px;
        &.is-active {
            border: 1px solid #da285e;
        }
        img {
            width: 100%;
            vertical-align: middle;
        }
    }
}
.styles_pointlist {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 250px;
    margin: 16px auto 0;
    .styles_point {
        width: 10px;
        height: 10px;
        border: 1px solid rgba(218,40,94,.5);
        margin: 0 5px;
        border-radius: 50%;
        &.is-active {
            .styles_activepointafter {
                height: 6px;
                width: 6px;
                content: "";
                border-radius: 50%;
                background-color: #da285e;
            }
        }
    }
}
::v-deep {
    .swiper-button-prev {
        background-image: url('../../assets/images/worldCup/icon-jiantou-zuo.png');
        position: absolute;
        left: 5%;
        cursor: pointer;
        width:24px;
        height:24px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        top: 33%;
        &:after {
            display: none;
        }
    }
    .swiper-button-next {
        cursor: pointer;
        width:24px;
        height:24px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        top: 33%;
        right: 5%;
        &:after {
            display: none;
        }
        background-image: url('../../assets/images/worldCup/icon-jiantou-you.png');
    }
}
</style>
