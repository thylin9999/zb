<template>
<div class="live-host-card p-t-15 p-b-15 m-l-15 m-r-15 flex align-center ">
    <div
        class="icon bg-size-cover bg-center bg-no-repeat"
        :style="{
            backgroundImage: `url(${anchor.live_cover})`
        }"
    ></div>
    <div class="flex m-l-10 m-r-10 flex-1 justify-between align-center">
        <div class="flex flex-column justify-between">
            <span class="font-14 font-medium font-500 flex align-center text-white"><i class="img m-r-5" :style="{backgroundImage: `url(${anchor.img ? anchor.img : userEmptyImg})`}" />
                {{ anchor.anchor_name }}
            </span>
            <span class="font-12 league font-regular font-400">{{ anchor.room_title }}</span>
        </div>
        <!-- <span class="font-12 league font-regular font-400">{{ anchor.heat_num | hotNumber}}</span> -->
    </div>
    <!-- <span
        @click.prevent="goToLiveRoom"
        class="button font-12 font-medium font-500 text-color text-center">进入直播间</span> -->
</div>
</template>

<script>
import { giveHeatNumber } from '@/utils/utils'

export default {
    name: 'LiveHostCard',
    filters: {
        hotNumber (value) {
            return giveHeatNumber(value)
        }
    },
    props: {
        matchInfo: {
            type: Object,
            default: () => ({})
        },
        anchor: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        goToLiveRoom () {
            this.$router.push({
                name: 'Broadcast',
                params: {
                    id: this.matchInfo.matchId
                },
                query: { room_id: this.anchor.room_id }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.live-host-card {
    width: 347px;
    height: 90px;
    background: #161C4F;
    border-radius: 5px;
    margin-bottom: 5px;
    padding: 10px;
    .icon {
        width: 120px;
        height: 67px;
        border-radius: 10px;
        background-color: #C9CFED;
    }
    .img{
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-size:100% 100%;
    }
    .button {
        width: 87px;
        height: 25px;
        line-height: 25px;
        background: #00E0FC;
        box-shadow: inset 0px 0px 1px 0px rgba(0,0,0,0.2300);
        border-radius: 3px;
        color: #322E47;
    }
    .league{
        line-height: 14px;
        color: #6C73AF;
        padding-top: 5px;
    }
}
</style>
