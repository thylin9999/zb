<template>
  <div class="home h-100 p-t-10">
    <div class="home-header  bg-center bg-no-repeat ">
        <div class="swiper w-100" >
            <swiper-banner
                :list="listData"
            />
        </div>
    </div>
    <div class="w-100 m-t-10">
        <running-text class="m-auto" />
    </div>
      <booked-matches />
<!--      推荐主播-->
      <!-- <HostRecommend class="m-t-5" /> -->
    <div class="list m-t-10">
        <div class="list-header flex justify-between align-center p-b-10 p-l-15 p-r-15">
            <div class="hot-recommend flex align-center">
<!--                <span class="tv-icon bg-center bg-size-100 bg-no-repeat"></span>-->
                <IconCom icon="live-cast" :width="20" :height="21"/>
                <span class="font-16 p-l-5 font-medium font-500 color-y">推荐直播</span>
            </div>
            <!-- <div class="font-12 text-gray1 font-regular view-more">
                <span @click="viewMore">更多</span>
                <van-icon name="arrow" color="#8D8D8D"></van-icon>
            </div> -->
        </div>
        <div class="list-section ">
            <HostBroads v-if="!badNetwork" />
            <BadNetwork v-else />
        </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SwiperBanner from '@/components/SwiperBanner'
import { Icon } from 'vant'
import HostBroads from '@/views/Competition/Components/HostBroads'
import BookedMatches from '@/components/BookedMatches'
import IconCom from '@/components/IconCom'
import BadNetwork from '@/components/BadNetwork'
import RunningText from '../components/RunningText.vue'
import dayjs from 'dayjs'
import { getBanners } from '@/api/common'
import { mapMutations, mapState } from 'vuex'
import { statusCode } from '@/utils/statusCode'
export default {
    name: 'Home',
    components: {
        SwiperBanner,
        HostBroads,
        BookedMatches,
        [Icon.name]: Icon,
        IconCom,
        BadNetwork,
        RunningText
    },
    data () {
        return {
            banner: 'https://cdn.podapi.com/image/slide/20210930/aa47247b900012c9e5236744adfa087b.png',
            updateKey: +new Date().getTime(),
            appInfo: {
                name: '播球直播app',
                developer: '成都五五柒柒科技有限公司',
                version: 'v.1.0',
                updateTime: dayjs().format('YYYY-MM-DD')
            },
            listData: []
        }
    },
    computed: {
        ...mapState('user', ['token']),
        ...mapState('commonData', ['badNetwork'])
    },

    created () {
        this.init()
    },
    methods: {
        ...mapMutations('commonData', ['SET']),
        viewMore () {
            this.$router.push({
                name: 'LiveList'
            })
        },
        async init () {
            try {
                const { data, code } = await getBanners(1)
                if (code === statusCode.success) {
                    this.listData = data && data.reduce((all, item) => {
                        all.push({
                            ...item
                        })
                        return all
                    }, [])
                }
            } catch (e) {
                console.log('出错了')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.home {
    background: transparent;
}
.home-header {
    background-size: 100% 100%;
}

.swiper {
    height: 125px;
}
.divider{
    background-color: rgb(247,247,247);
}
.list-section {
    min-height: 200px;
}
.list-header {
    font-size: 15px;
    .hot-recommend {
        line-height: 22px;
        height: 22px;
        .tv-icon {
            width: 17px;
            height: 17px;
            background-image: url('../assets/images/icons/tv.png');
        }
        .match-icon {
            width: 17px;
            height: 17px;
            background-image: url('../assets/images/icons/match.png');
        }
    }
}
.first-line {
    padding: 10px 20px;
    line-height: 20px;
}
.color-y{
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    background: linear-gradient(180deg, #FAE7D4 0%, #E7B590 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
::v-deep {
    .view-more {
        .icon {
            width: 16px;
            height: 16px;
            background-size: 8px 16px;
            fill: $light-text-color;
        }
    }

}
</style>
