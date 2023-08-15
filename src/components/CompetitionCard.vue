<template>
    <div
        class="card  m-b-10"
        @click="goToBroadcast"
    >
        <div class="competition-preview w-100 p-relative"
             :class="{
                'bg-size-auto': !competition.live_cover,
                'bg-size-cover': competition.live_cover
             }"
             :style="{
                backgroundImage: `url(${bgImg})`
            }"
        >
        <i class="tag" :style="{backgroundImage: `url(${tagImg})`}" v-if="showTag"></i>
        </div>
        <div class="text-info p-relative p-l-5 flex align-center w-100">
            <div class="avatar bg-size-cover bg-no-repeat bg-center border-50"
                :style="{
                    backgroundImage: `url(${logo})`
                }"
            ></div>
            <div class="p-l-5 name-box">
                <div class="competition-name text-white font-12 flex justify-between align-center font-regular">
                    <span class="d-inline-block font-500 font-medium text-ellipsis">{{ competition.room_title  }}</span>
                </div>
                <div class="host-info text-white text-ellipsis font-12 scale-7 font-regular flex  align-center">
                    <span>主播：{{ competition.nick || competition.anchor_name }}</span>
                </div>
            </div>
            <div class="flex justify-between align-center follow-number p-absolute">

                <!-- <IconPng class="scale-7" icon="common/hot" :width="10" :height="12" /> -->
                <span class="font-12 m-l-5 scale-7 font-400 font-regular  d-inline-block text-white ">{{ competition.heat_num }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { giveHeatNumber } from '@/utils/utils'

export default {
    name: 'CompetitionCard',
    filters: {
        hotNumber (value) {
            return giveHeatNumber(value)
        }
    },
    props: {
        competition: {
            type: Object,
            default: () => ({})
        },
        index: { // 下标前两个需要固定标签
            type: Number,
            default: 0
        },
        showTag: { // 只有推荐页展示标签
            type: Boolean,
            default: false
        }
    },
    computed: {
        bgImg () {
            return this.competition.live_cover
                ? this.competition.live_cover
                : require('../assets/images/common/host-blank1.jpg')
        },
        logo () {
            return this.competition.img || require('../assets/images/live/default.png')
        },
        roomId () {
            return this.competition.room_id || this.competition.member_id
        },
        tagImg () {
            return this.index === 0 ? require('../assets/images/live/hot.png')
                : this.index === 1 ? require('../assets/images/live/top.png')
                    : this.competition.type === '1' ? require('../assets/images/live/football.png')
                        : this.competition.type === '2' ? require('../assets/images/live/basketball.png')
                            : this.competition.type === '3' ? require('../assets/images/live/game.png')
                                : require('../assets/images/live/other.png')
        }
    },
    methods: {
        goToBroadcast () {
            // this.$router.push({
            //     name: 'Broadcast',
            //     params: {
            //         id: this.competition.id
            //     },
            //     query: { room_id: this.roomId }
            // })
            const { href } = this.$router.resolve({
                name: 'Broadcast',
                params: { id: this.competition.id },
                query: { room_id: this.roomId, type: this.competition.type }, // type字段，直播间里如果是电竞/其他，需要隐藏有料，赛况，阵容
                append: true
            })
            window.open(href, '_blank')
        }
    }
}
</script>

<style lang="scss" scoped>
.card{
    width: 170px;
    border-radius: 3px;
    overflow: hidden;
    background: #161C4F;
    margin-right: 5px;
    border-image: linear-gradient(159deg, rgba(114, 114, 128, 1), rgba(23, 21, 42, 1)) 1 1;
    &:nth-child(2n) {
        margin-right: 0;
    }
}
.competition-preview {
    width: 100%;
    height: 98px;
    background-color: #f2f2f2;
    background-repeat: no-repeat;
    background-position: center;

}
.tag{
    width: 50px;
    height: 14px;
    position: absolute;
    top: 0;
    left: 0;
    background-size: 100%;
    background-repeat: no-repeat;
}
.competition-name{
    line-height: 17px;
}
.text-info {
    margin-top: 3px;
    height: 30px;
    .avatar {
        width: 24px;
        height: 24px;
    }
    .name-box {
        width: calc(100% - 30px);
    }
    .follow-number{
        right: 0;
        bottom: 0;
        line-height: 12px;
    }
}
.host-info {
    .hot-icon {
        width: 8px;
        height: 10px;
        margin-right: 3px;
    }
}

::v-deep {
    .host-info {
        .svg-icon {
            width: 10px;
            height: 10px;
        }
    }
}
</style>
