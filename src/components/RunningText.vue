<template>
    <div class="box p-l-10 p-r-10 flex align-center">
        <img :src="trumpet" width="16" height="16" alt="">
        <div class="flex-1 m-l-5">
            <marquee height="20" style="color: #fff;font-size: 12px;line-height: 21px;" behavior=scroll v-if="list.length === 1">
                <!-- 这里可以填写走马灯内容 -->
                {{ list[0].content }}
            </marquee>
            <van-swipe style="height: 20px;" :show-indicators="false" vertical :autoplay="5000" v-else>
                <van-swipe-item v-for="item in list" :key="item.id" class="text-white text-overflow-hidden swipe-item">{{ item.title }}</van-swipe-item>
            </van-swipe>
        </div>
    </div>
</template>

<script>
import { getAnnouncementList } from '@/api/common'
import { Swipe, SwipeItem } from 'vant'
export default {
    name: 'RunningText',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    data () {
        return {
            trumpet: require('@/assets/images/common/lb.png'),
            list: []
        }
    },
    computed: {
        apiParams () {
            return {
                pageNum: 1,
                pageSize: 20,
                type: 1, // 1全局， 2直播间
                device: 'H5'
            }
        }
    },
    mounted () {
        this.getAnnouncementLists()
    },
    methods: {
        async getAnnouncementLists () {
            const { data } = await getAnnouncementList(this.apiParams)
            this.list = data.list || []
        }
    }
}

</script>

<style lang="scss" scoped>
.box {
    width: 345px;
    height: 19px;
    background: linear-gradient(90deg, #7C2246 0%, #251222 100%);
    border-radius: 15px;
    // border: 1px solid;
    // border-image: linear-gradient(180deg, rgba(114, 114, 128, 1), rgba(23, 21, 42, 1)) 1 1;
    background: url('../assets/images/common/running-bg.png') no-repeat;
    background-size: 100%;
}
.flex-1 {
    line-height: 20px;
    height: 20px;
    font-size: 12px;
}
.swipe-item{
    width: 320px;
}
</style>
