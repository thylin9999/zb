<template>
    <div class="live-item" @click="openDownloadDialog">
        <div class="top">
            <div class="info">
                <img :src="item.avatar ? item.avatar : userEmptyImg" alt="">
                <div class="m-l-5">
                    <p class="name text-overflow-hidden">{{item.nickname}}</p>
                    <p class="desc">{{item.profession}}</p>
                </div>
            </div>
            <div class="text-center">
                <p class="percenta">{{ item.hit_rate }}%</p>
                <p class="seven">近{{ item.near_sum }}中 {{ item.hit_sum }}</p>
            </div>
            <div class="return">
                近{{item.return_sum}}场回报率{{item.return_rate}}%
            </div>
        </div>
        <div class="center">
            <p class="cpt-desc">{{item.title}}</p>
        </div>
        <div class="bottom">
            <div>
                <span class="play">{{play}}</span>
            </div>
            <div class="b-right">
                <span class="time">{{item.create_date}}</span>
                <span class="money">{{ item.coin == 0 ? "免费": item.sales_type == 1 ? `${item.coin}球币` : `${item.coin}球票`}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
    props: {
        item: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        matchTime () {
            return dayjs().format('MM-DD HH:mm')
        },
        play () {
            let msg = ''
            if (this.item.play === 11) {
                msg = '胜负平'
            } else if (this.item.play === 12) {
                msg = '让球'
            } else if (this.item.play === 13 || this.item.play === 23) {
                msg = '大小'
            } else if (this.item.play === 21) {
                msg = '胜负'
            } else if (this.item.play === 22) {
                msg = '让分'
            }
            return msg
        }
    }
}
</script>

<style lang="scss" scoped>
.live-item{
    width: 345px;
    height: 110px;
    background: #161C4F;
    background-size:100% 100%;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    padding: 10px 14px;
    margin: 0 auto 5px;
    .top{
        display: flex;
        justify-content: space-between;
        position: relative;
        img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
        .info{
            display: flex;
            align-items: center;
            .name{
                font-size: 14px;
                color: #FFFFFF;
                line-height: 20px;
                width: 70px;
            }
            .desc{
                font-size: 10px;
                color: #6C73AF;
                line-height: 14px;
            }
        }
        .percenta{
            font-size: 18px;
            color: transparent;
            line-height: 25px;
            background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
            -webkit-background-clip: text;
        }
        .seven{
            font-size: 12px;
            color: #FFFFFF;
            line-height: 17px;
        }
        .return {
            min-width: 130px;
            height: 18.75px;
            line-height: 18.75px;
            background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
            border-radius: 3px;
            color: #2C1447;
            position: absolute;
            left: calc(50% - 37px);
            top: 6px;
            font-size: 12px;
            text-align: center;
            transform: scale(0.8);
            margin-top: -4px;
            // overflow: hidden;
            // white-space: nowrap;
            // text-overflow: ellipsis
        }
    }
    .center{
        padding: 5px 0;
        .cpt-desc{
            width: 260px;
            font-size: 12px;
            color: #FFFFFF;
            line-height: 17px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-weight: 500;
        }
        .competition{
            width: 316px;
            height: 23px;
            line-height: 23px;
            background: linear-gradient(90deg, #161C4F 0%, #451959 100%);
            border-radius: 5px;
            font-size: 10px;
            color: #FFFFFF;
            font-weight: 400;
            margin-top: 5px;
            padding: 0 8px;
        }
    }
    .bottom{
        position: relative;
        padding-left: 80px;
        .play{
            position: absolute;
            width: 76px;
            height: 24px;
            background-size: 100%;
            line-height: 24px;
            text-align: center;
            color: #FFFFFF;
            font-size: 10px;
            padding-top: 2px;
            left: -18px;
        }
        .time{
            font-size: 10px;
            font-weight: 400;
            color: #6C73AF;
            line-height: 14px;
        }
        .b-right{
            display: flex;
            justify-content: space-between;
            padding-top: 7px;
            .money{
                color: transparent;
                font-size: 12px;
                line-height: 17px;
                background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
                -webkit-background-clip: text;
            }
        }
    }
}
</style>
