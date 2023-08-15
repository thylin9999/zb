<template>
<div>
    <div class="index__BOX">
        <div class="index__startGusses"
             @click="viewPrediction">{{ showViewPrediction ? '查看我的预测' : '开始预测'}}</div>
        <div class="index__activeRule">
            <div class="index__title">【 活动详情 】</div>
            <div class="index__contentext">
                <div class="index__head">活动周期
                    <div class="index__left"></div>
                    <div class="index__right"></div>
                </div>
                <div class="index__timeicon"></div>
                <div class="index__bottomssapn"> 2022-11-01 00:00 至 2022-11-20 24:00</div>
            </div>

            <div class="index__contentext2">
                <div class="index__head">奖品设置
                    <div class="index__left"></div>
                    <div class="index__right"></div>
                </div>
                <SwiperCom />
            </div>

            <div class="index__contentext3">
                <div class="index__head">参与资格
                    <div class="index__left"></div>
                    <div class="index__right"></div>
                </div>
                <div class="index__discoun">
                    <div class="index__icon"></div>
                    <p>所有活动参与者必须阅读并同意此规则，方有资格 参与本次活动</p>
                </div>
                <div class="index__discoun">
                    <div class="index__icon"></div>
                    <p>年满18周岁播球注册用户（以本活动开始之日起为 准），且具有完全民事行为能力</p>
                </div>
                <div class="index__discoun">
                    <div class="index__icon"></div>
                    <p>凡在本次活动中，涉及作弊的活动参与者，或主办 方有确实证据证明认为有舞弊行为的活动参与者， 主办方有权取消其兑换奖品的权利，我方保留最终 解释和取消资格的权利</p>
                </div>
            </div>

            <div class="index__contentext4">
                <div class="index__head">参与方式
                    <div class="index__left"></div>
                    <div class="index__right"></div>
                </div>
                <div class="index__discoun">
                    <div class="index__icon"></div>
                    <p>用户在活动截止前，按照规则提交预测</p>
                </div>
                <div class="index__discoun">
                    <div class="index__icon"></div>
                    <p>用户一次完成世界杯十六强、八强、四强、半决 赛以及冠军，共计31个选择</p>
                </div>
                <div class="index__discoun">
                    <div class="index__icon"></div>
                    <p>随世界杯赛程的进行，统计用户命中的预测数量并确认所获奖励</p>
                </div>
                <div class="index__discoun">
                    <div class="index__icon"></div>
                    <p>一台设备每日可进行一次竞猜，已完场赛事仍可参与，但不会计入竞猜总积分</p>
                </div>
            </div>

            <div class="index__contentext5">
                <div class="index__head">奖品的发放及领取
                    <div class="index__left"></div>
                    <div class="index__right"></div>
                </div>
                <div class="index__discoun">
                    <div class="index__icon"></div>
                    <p>获奖名单在活动页以及其他方式公布</p>
                </div>
                <div class="index__discoun">
                    <div class="index__icon"></div>
                    <p>获奖用户，请通过联系在线客服确认领取</p>
                </div>
                <div class="index__discoun">
                    <div class="index__icon"></div>
                    <p>用户参与活动前，需如实提供个人联系方式，因信 息不全导致奖品无法发放的责任自负</p>
                </div>
            </div>
        </div>
    </div>
    <div class="index__bottombar">
        <div class="index__item"
            :class="{
                'is-active': tab === 1
            }"
             @click="goHome"
        >活动首页</div>
        <div class="index__item" :class="{
            'is-active': tab === 2
        }" @click="goToMyPrediction">
            <div class="index__itebefor"></div>
            我的预测
            <div class="index__itemafter"></div>
        </div>
        <div class="index__item"
            @click="showTips"
        >获奖名单</div>
    </div>
    <MyPrediction v-if="tab === 2" />
    <van-popup
        class="w-100 popup"
        closeable
        close-icon="cross"
        round position="bottom"
        v-model="show" style="height: 92%;">
        <Forecast @finishPredict="finishPredict"/>
    </van-popup>
</div>
</template>

<script>
import SwiperCom from '@/views/WorldCup/SwiperCom'
import Forecast from '@/views/WorldCup/Forecast'
import MyPrediction from '@/views/WorldCup/MyPrediction'
import { mapState } from 'vuex'
import { Toast, Popup } from 'vant'
import { getItem } from '@/utils/cookie'
import dayjs from 'dayjs'
export default {
    name: 'index',
    components: {
        SwiperCom,
        Forecast,
        [Popup.name]: Popup,
        MyPrediction
    },
    data () {
        return {
            tab: 1,
            showForecast: false,
            show: false,
            showMyPrediction: false,
            predictionInTime: false
        }
    },
    computed: {
        ...mapState('user', ['token']),
        showViewPrediction () {
            return this.token && this.predictionInTime
        }
    },
    created () {
        const prevSubmitInfo = getItem('submitTime')
        if (prevSubmitInfo) {
            const time = prevSubmitInfo.time
            this.predictionInTime = !dayjs().isAfter(time, 'day')
        }
    },
    methods: {
        goHome () {
            this.tab = 1
        },
        showTips () {
            Toast('世界杯结束后结算')
        },
        finishPredict () {
            this.tab = 1
            this.predictionInTime = true
        },
        goToMyPrediction () {
            if (!this.token) {
                Toast('请先登录')
                this.$router.push({
                    name: 'Login',
                    query: {
                        redirect: '/world-cup'
                    }
                })
                return
            }
            if (this.predictionInTime) {
                this.tab = 2
            } else {
                Toast('请先预测')
            }
        },
        viewPrediction () {
            if (!this.token) {
                Toast('请先登录')
                this.$router.push({
                    name: 'Login',
                    query: {
                        redirect: '/world-cup'
                    }
                })
                return
            }
            if (this.predictionInTime) {
                this.tab = 2
            } else {
                this.show = true
            }
        },
        forecast () {
            if (!this.token) {
                Toast('请先登录')
                this.$router.push({
                    name: 'Login',
                    query: {
                        redirect: '/world-cup'
                    }
                })
                return
            }
            this.showForecast = true
        }
    }
}
</script>

<style lang="scss" scoped>
.index__BOX {
    background-color: #8a1639;
    background-image: url('../../assets/images/worldCup/img-big-bg.jpg');
    background-repeat: no-repeat;
    background-size: 100%;
    height: 880px;
    padding-top: 442px;
    position: relative;
    .index__startGusses {
        background-image: url('../../assets/images/worldCup/btn-yuce.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 366px;
        height: 55px;
        margin-left: 5px;
        color: #833600;
        font-family: PingFang-SC;
        font-size: 18px;
        font-weight: 900;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .index__download_area_app {
        width: 351px;
        height: 60px;
        background-image: url('../../assets/images/worldCup/img-download.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-top: 16px;
        padding: 20px;
        margin-left:12px;
    }
    .index__activeRule {
        width: 100%;
        min-height: 199px;
        border-radius: 4px;
        background-color: #730d2b;
        margin-top: 60px;
        height: 1333px;
        background-image: url('../../assets/images/worldCup/img-2.png');
        background-size: 100% 100%;
        position: relative;
        padding: 0 20px;
    }
    .index__title {
        width: 375px;
        height: 100px;
        background-image: url('../../assets/images/worldCup/img-1.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-family: PingFangSC;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 12px;
        position: absolute;
        top: -40px;
        left: 0;
    }
    .index__contentext{
        width: 335px;
        border-radius: 8px;
        box-shadow: 0 1px 4px 0 rgb(231 146 175 / 16%), 0 4px 8px 0 rgb(33 24 93 / 7%), inset 0 1px 12px 0 rgb(255 227 242 / 26%), inset 0 0 24px 0 hsl(0deg 0% 100% / 80%);
        border: 1px solid #fff;
        background-image: linear-gradient(180deg,#fff,#ffeffa);
        position: absolute;
        display: flex;
        flex-direction: column;
        height: 129px;
        top: 18px;

        .index__timeicon {
            width: 24px;
            height: 24px;
            margin: 12px auto 9px;
            background-image: url('../../assets/images/worldCup/icon-time.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .index__bottomssapn {
            font-family: PingFang-SC;
            font-size: .14rem;
            font-weight: 700;
            color: #da2259;
            height: 0.22rem;
            margin-top: 0.1rem;
            display: flex;
            justify-content: center;
        }
    }
    .index__head {
        height: 23px;
        position: relative;
        display: flex;
        justify-content: center;
        font-size: 14px;
        line-height: 1.64;
        text-align: justify;
        color: #ad1341;
        font-weight: 600;
        align-items: center;
        margin: 20px auto 0;
        padding: 0 50px;
    }
    .index__contentext3,.index__contentext2, .index__contentext4, .index__contentext5 {
        width: 335px;
        border-radius: 8px;
        border: 1px solid #fff;
        display: flex;
        position: absolute;
        flex-direction: column;
        align-items: center;
        padding: 0 16px;
    }
    .index__contentext3 {
        height: 243px;
        box-shadow: 0 1px 4px 0 rgb(231 146 175 / 16%), 0 4px 8px 0 rgb(33 24 93 / 7%), inset 0 1px 12px 0 rgb(255 227 242 / 26%), inset 0 0 24px 0 hsl(0deg 0% 100% / 80%);
        background-image: linear-gradient(180deg,#fff,#ffeffa);
        top: 610px;
    }
    .index__contentext4 {
        height: 220px;
        box-shadow: 0 1px 4px 0 rgb(231 146 175 / 16%), 0 4px 8px 0 rgb(33 24 93 / 7%), inset 0 1px 13px 0 rgb(255 227 242 / 26%);
        background-image: linear-gradient(180deg,#fff,#ffecf9);
        top: 869px;
    }
    .index__contentext2 {
        height: 436px;
        top: 160px;
        align-items: center;
        background-image: linear-gradient(180deg,#fff,#ffeffa);
    }
    .index__left {
        background-image: url('../../assets/images/worldCup/iname.png');
        background-size: 100% 11px;
        background-repeat: no-repeat;
        width: 44px;
        height: 11px;
        position: absolute;
        left: 0;
        top: 5px;
    }
    .index__right {
        background-image: url('../../assets/images/worldCup/hname.png');
        background-repeat: no-repeat;
        background-size: 100% 11px;
        width: 44px;
        height: 11px;
        position: absolute;
        right: 0;
        top: 5px;
    }

    .index__discoun {
        display: flex;
        justify-content: left;
        margin-top: 12px;
        width: 100%;
        .index__icon {
            width: 15px;
            height: 9px;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            border-left: 9px solid #da285e;
            margin-top: 3px;
            padding-right: 5px;
        }
        p {
            font-family: PingFangSC;
            font-size: 13px;
            color: #333;
            line-height: 18px;
        }
    }

    .index__contentext5 {
        height: 171px;
        border: 0.01rem solid #fff;
        box-shadow: 0 1px 4px 0 rgb(231 146 175 / 16%), 0 4px 8px 0 rgb(33 24 93 / 7%), inset 0 1px 12px 0 rgb(255 227 242 / 26%), inset 0 0 24px 0 hsl(0deg 0% 100% / 80%);
        background-image: linear-gradient(180deg,#fff,#ffeffa);
        top: 1105px;
        flex-direction: column;
        align-items: center;
        padding: 0 16px;
    }
}
.index__bottombar {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 48px;
    width: 100%;
    z-index: 1000;
    font-family: PingFang-SC;
    font-size: 14px;
    color: #333;
    background: #fff;
    display: flex;
    justify-content: center;
    box-shadow: 5px 2px 5px 5px #e7bebe;
    .index__item {
        width: 125px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        &.is-active {
            border-right: 1px solid #ddd;
            background-image: linear-gradient(0deg,#ffa017,#ffda2a 33%);
            font-size: 14px;
            font-weight: 900;
            color: #833600;
        }
        .index__itebefor {
            width: 1px;
            height: 29px;
            background-color: #ddd;
            position: absolute;
            left: 0;
            top: 10px;

        }
        .index__itemafter {
            width: 1px;
            height: 29px;
            background-color: #ddd;
            position: absolute;
            right: 0;
            top: 10px;
        }
    }
}
.popup{
    background: #510a24;
}
</style>
