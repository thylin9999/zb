<template>
    <div>
        <div class="live-item">
            <div class="live-info">
                <div class="live-broadcast-pic bg-no-repeat bg-center" :style="{
                    backgroundImage: `url(${liveItem.img})`
                }">
<!--                    <img :src="liveItem.img"/>-->
                </div>
                <div class="live-detail-info">
                    <h4 class="font-14">{{liveItem.anchor_name}}</h4>
                    <p class="font-12">{{liveItem.room_title}}</p>
                </div>
            </div>
            <div class="live-action">
                <span class="font-12">{{liveItem.heat_num}}</span>
                <div class="enter-live-btn" @click="enterLive">进入直播间</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    props: {
        liveItem: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    methods: {
        /* eslint-disable */
        enterLive (room_id) {
            this.$router.push({
                name: 'Broadcast',
                params: {
                    id: this.liveItem.match_id
                },
                query: { room_id: this.liveItem.room_id }
            })
        }
        /* eslint-enable */
    }

}
</script>

<style lang="scss" scoped>
.live-item{
    width: 96%;
    margin: 15px auto 0;
    padding-bottom: 15px;
    display: flex;
    border-bottom: 1px solid #d8d8d8;
    justify-content: space-between;
    .live-info{
        display: flex;
        align-items: center;
        .live-broadcast-pic{
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background-size: cover;
            //img{
            //    width: 35px;
            //    height: auto;
            //    background-size: 35px 35px;
            //}
        }
        .live-detail-info{
            margin-left: 6px;
            p,h4{
                margin: 0;
            }
        }
    }
    .live-action{
        display: flex;
        align-items: center;
        span{
            margin-right: 12px;
        }
        .enter-live-btn{
            display: inline-block;
            background-color: #FBA974;
            font-size: 14px;
            color: #fff;
            font-weight: 500;
            line-height: 20px;
            padding: 2px 6px;
        }
    }
}
.live-item:last-child{
    border-bottom: none;
}
</style>
