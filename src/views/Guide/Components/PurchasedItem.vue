<template>
    <div class="plan-item" @click="openDownloadDialog()">
        <div class="top">
            <div class="info">
                <img :src="item.avatar ? item.avatar : userEmptyImg" alt="" class="avatar">
                <div class="m-l-5">
                    <p class="name text-overflow-hidden">{{item.nickname}}</p>
                    <p class="desc">{{item.profession}}</p>
                </div>
            </div>
            <div>
                <img :src="item.hit===0?not:item.hit===1?red:black" class="status" />
            </div>
            <div class="return">
                近{{item.return_sum}}场回报率{{item.return_rate}}%
            </div>
            <div class="return1">
                近{{item.near_sum}}中{{ item.hit_sum }}
            </div>
        </div>
        <div class="center">
            <p class="cpt-desc">{{item.title}}</p>
            <div class="competition text-overflow-hidden">
                <span>{{item.type_text}} | {{ item.match_time }}</span>
                <span class="m-l-10 m-r-10">{{ item.league }}</span>
                <span>{{ item.home }}  <span class="m-l-5 m-r-5">vs</span>  {{ item.away }}</span>
            </div>
        </div>
        <div class="bottom">
            <div class="b-right">
                <span class="time">购买时间：{{ item.buy_time }}</span>
                <span class="money">{{ item.coin == 0 ? "免费": item.sales_type == 1 ? `${item.coin}球币` : `${item.coin}球票`}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => [{}]
        }
    },
    data () {
        return {
            not: require('../../../assets/images/guide/not.png'),
            red: require('../../../assets/images/guide/red.png'),
            black: require('../../../assets/images/guide/black.png')
        }
    }
}
</script>

<style lang="scss" scoped>
.plan-item{
    width: 345px;
    height: 140px;
    background: url('../../../assets/images/guide/planItemBg.png') no-repeat;
    background-size:100% 100%;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    padding: 10px 14px;
    margin-bottom: 5px;
    .top{
        display: flex;
        justify-content: space-between;
        position: relative;
        img{
            width: 40px;
            height: 40px;
        }
        .status{
            width: 30px;
            height: 30px;
        }
        .info{
            display: flex;
            align-items: center;
            .avatar{
                border-radius: 50%;
            }
            .name{
                font-size: 14px;
                color: #FFFFFF;
                line-height: 20px;
                width: 85px;
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
            width: 105px;
            height: 18.75px;
            line-height: 18.75px;
            background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
            border-radius: 3px;
            color: #2C1447;
            position: absolute;
            left: calc(50% - 30px);
            top: 4px;
            font-size: 7px;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            transform: scale(0.8);
        }
        .return1 {
            width: 50px;
            height: 18.75px;
            line-height: 18.75px;
            background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
            border-radius: 3px;
            color: #2C1447;
            position: absolute;
            left: calc(50% + 70px);
            top: 4px;
            font-size: 7px;
            text-align: center;
            transform: scale(0.8);
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
        // padding-left: 80px;
        .play{
            position: absolute;
            width: 76px;
            height: 24px;
            background: url('../../../assets/images/guide/play.png') no-repeat;
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
            padding-top: 8px;
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
