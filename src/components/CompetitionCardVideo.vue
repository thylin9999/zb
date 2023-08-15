<template>
    <div
        class="card m-r-5  m-b-15 bg-white"
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
        </div>
        <div class="text-info p-relative flex align-center w-100">
            <div class="name-box text-overflow-hidden">
                {{ competition.room_title }}
            </div>
        </div>
    </div>
</template>

<script>
import { giveHeatNumber } from '@/utils/utils'

export default {
    name: 'CompetitionCardVideo',
    filters: {
        hotNumber (value) {
            return giveHeatNumber(value)
        }
    },
    props: {
        competition: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        bgImg () {
            return this.competition.live_cover
                ? this.competition.live_cover
                : require('../assets/images/common/host-blank.png')
        },
        logo () {
            return this.competition.img || this.competition.logo
        },
        roomId () {
            return this.competition.room_id || this.competition.member_id
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
                query: { room_id: this.roomId },
                append: true
            })
            window.open(href, '_blank')
        }
    }
}
</script>

<style lang="scss" scoped>
.card{
    // width: calc(50% - 5px);
    border-radius: 3px;
    //overflow: hidden;
    width: 104px;
    height: 60px;
}
.competition-preview {
    width: 104px;
    height: 60px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.competition-name{
    line-height: 17px;
}
.text-info {
    .avatar {
        width: 20px;
        height: 20px;
    }
    .name-box {
        line-height: 20px;
        font-size: 12px;
        color: #fff;
        // width: calc(100% - 30px);
        width: 100px;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: normal;
    }
    .follow-number{
        right: 0;
        bottom: 5px;
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
