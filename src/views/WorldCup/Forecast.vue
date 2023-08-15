<template>
    <div class="forecast h-100">
        <div class="index__titlebox">
            <span>世界杯冠军预测</span>
<!--            <div class="index__titleclose">-->
<!--                <van-icon name="cross" />-->
<!--            </div>-->
        </div>
        <div class="index__content">
            <div class="index__steparr">
                <div class="index__step"
                     :class="{
                        'is-active': currentStage >= 1
                     }"
                >小组赛</div>
                <div class="index__step"
                     :class="{
                        'is-active': currentStage >= 2
                     }"
                >1/8决赛</div>
                <div class="index__step"
                     :class="{
                        'is-active': currentStage >= 3
                     }"
                >1/4决赛</div>
                <div class="index__step"
                     :class="{
                        'is-active': currentStage >= 4
                     }"
                >半决赛</div>
                <div class="index__step"
                     :class="{
                        'is-active': currentStage >= 5
                     }"
                >决赛</div>
                <div class="index__step">完成</div></div>

            <div class="index__PredictionBall">
                <div class="index__notice">{{ tip }}</div>
                <div class="item-scroll">
                    <template v-if="currentStage === 1">
                        <template
                            v-for="(group, key) in groupTeams"
                        >
                            <Group
                                :key="key"
                                :groupName="key"
                                @changeGroup="changeGroup"
                                :group="group"/>
                        </template>
                    </template>
                    <template v-if="currentStage === 2">
                        <Battle1Vs8 :can-next-step.sync="canNextStep"/>
                    </template>
                    <template v-if="currentStage === 3">
                        <Battle1Vs4 :can-next-step.sync="canNextStep"/>
                    </template>
                    <template v-if="currentStage === 4">
                        <Battle1Vs2 :can-next-step.sync="canNextStep"/>
                    </template>
                    <template v-if="currentStage === 5">
                        <Battle1Vs1 :can-next-step.sync="canNextStep"/>
                    </template>
                </div>
            </div>
            <div class="index__confirm flex align-center justify-center">
                <div v-if="currentStage > 1" class="index__button flex-1 prev-button is-active" @click="prevStep">上一步</div>
                <div v-if="currentStage !== 5" class="index__button flex-1" @click="nextStep">下一步</div>
                <div v-if="currentStage === 5" class="index__button flex-1 is-active" @click="submit">提交</div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon, Toast } from 'vant'
import { mapMutations, mapState } from 'vuex'
import { getItem, setItem } from '@/utils/cookie'
import Group from './Group'
import Battle1Vs8 from '@/views/WorldCup/Battle1Vs8'
import Battle1Vs4 from '@/views/WorldCup/Battle1Vs4'
import Battle1Vs2 from '@/views/WorldCup/Battle1Vs2'
import Battle1Vs1 from '@/views/WorldCup/Battle1Vs1'
import dayjs from 'dayjs'
export default {
    name: 'Forecast.vue',
    components: {
        [Icon.name]: Icon,
        Group,
        Battle1Vs8,
        Battle1Vs4,
        Battle1Vs2,
        Battle1Vs1
    },
    data () {
        return {
            teams: [
                {
                    id: 1,
                    name: '荷兰',
                    group: 'A',
                    img: 'holland'
                },
                {
                    id: 2,
                    name: '塞内加尔',
                    group: 'A',
                    img: 'senegal'
                },
                {
                    id: 3,
                    name: '厄瓜多尔',
                    group: 'A',
                    img: 'ecuador'
                },
                {
                    id: 4,
                    name: '卡塔尔',
                    group: 'A',
                    img: 'qatar'
                },
                {
                    id: 5,
                    name: '威尔士',
                    group: 'B',
                    img: 'welsh'
                },
                {
                    id: 6,
                    name: '英格兰',
                    group: 'B',
                    img: 'england'
                },
                {
                    id: 7,
                    name: '美国',
                    group: 'B',
                    img: 'america'
                },
                {
                    id: 8,
                    name: '伊朗',
                    group: 'B',
                    img: 'eran'
                },
                {
                    id: 9,
                    name: '波兰',
                    group: 'C',
                    img: 'poland'
                },
                {
                    id: 10,
                    name: '墨西哥',
                    group: 'C',
                    img: 'mexico'
                },
                {
                    id: 11,
                    name: '阿根廷',
                    group: 'C',
                    img: 'argentina'
                },
                {
                    id: 12,
                    name: '沙特阿拉伯',
                    group: 'C',
                    img: 'arab'
                },
                {
                    id: 13,
                    name: '丹麦',
                    group: 'D',
                    img: 'denmark'
                },
                {
                    id: 14,
                    name: '法国',
                    group: 'D',
                    img: 'france'
                },
                {
                    id: 15,
                    name: '突尼斯',
                    group: 'D',
                    img: 'tunisia'
                }, {
                    id: 16,
                    name: '澳大利亚',
                    group: 'D',
                    img: 'australia'
                },
                {
                    id: 17,
                    name: '西班牙',
                    group: 'E',
                    img: 'spain'
                },
                {
                    id: 18,
                    name: '德国',
                    group: 'E',
                    img: 'germany'
                },
                {
                    id: 19,
                    name: '哥斯达黎加',
                    group: 'E',
                    img: 'costaRica'
                },
                {
                    id: 20,
                    name: '日本',
                    group: 'E',
                    img: 'japan'
                },
                {
                    id: 21,
                    name: '克罗地亚',
                    group: 'F',
                    img: 'croatia'
                },
                {
                    id: 22,
                    name: '比利时',
                    group: 'F',
                    img: 'belgium'
                },
                {
                    id: 23,
                    name: '加拿大',
                    group: 'F',
                    img: 'canada'
                },
                {
                    id: 24,
                    name: '摩洛哥',
                    group: 'F',
                    img: 'morocco'
                },
                {
                    id: 25,
                    name: '瑞士',
                    group: 'G',
                    img: 'switzerland'
                },
                {
                    id: 26,
                    name: '巴西',
                    group: 'G',
                    img: 'baxi'
                },
                {
                    id: 27,
                    name: '喀麦隆',
                    group: 'G',
                    img: 'cameroon'
                },
                {
                    id: 28,
                    name: '塞尔维亚',
                    group: 'G',
                    img: 'serbia'
                },
                {
                    id: 29,
                    name: '葡萄牙',
                    group: 'H',
                    img: 'portugal'
                },
                {
                    id: 30,
                    name: '乌拉圭',
                    group: 'H',
                    img: 'uruguay'
                },
                {
                    id: 31,
                    name: '韩国',
                    group: 'H',
                    img: 'korean'
                },
                {
                    id: 32,
                    name: '加纳',
                    group: 'H',
                    img: 'ghana'
                }
            ],
            groupTeams: {},
            currentStage: 1, // 小组赛
            stage1Res: {}, // 小组赛结果
            canNextStep: false,
            tips: [
                '请选择每个小组的前两名晋级16强',
                '请选择每个小组的前1名晋级8强',
                '请选择每个小组的前1名晋级4强',
                '请选择每个小组的前1名晋级半决赛',
                '请选择本届世界杯冠军'
            ]
        }
    },
    computed: {
        ...mapState('commonData', ['stage2Res']),
        tip () {
            return this.tips[this.currentStage - 1]
        }
    },
    created () {
        const stage1Res = getItem('stage1Res')
        this.stage1Res = stage1Res ? JSON.parse(stage1Res) : {}
        this.SET({ stage1Res: this.stage1Res })

        const stage2Res = getItem('stage2Res')
        this.SET({ stage2Res: stage2Res || {} })
        this.canNextStep = this.handleStage1Res()
        this.init()
    },
    methods: {
        ...mapMutations('commonData', ['SET']),
        init () {
            this.groupTeams = this.teams.reduce((all, item) => {
                const groupKey = item.group
                if (!all[groupKey]) {
                    all[groupKey] = []
                }
                all[groupKey].push({ ...item })
                return all
            }, {})
        },
        handleStage1Res () {
            const keys = Object.keys(this.stage1Res)
            return keys.every(key => this.stage1Res[key] && this.stage1Res[key].length === 2) && keys.length === 8
        },
        submit () {
            const prevSubmitInfo = getItem('submitTime')
            const _info = prevSubmitInfo ? JSON.parse(prevSubmitInfo) : ''
            let canSubmit = !_info // 没有信息是可以提交的
            if (_info) {
                const time = _info.time
                canSubmit = dayjs().isAfter(dayjs(time), 'day')
            }
            if (canSubmit) {
                const stage1Res = getItem('stage1Res')
                const stage2Res = getItem('stage2Res')
                const stage3Res = getItem('stage3Res')
                const stage4Res = getItem('stage4Res')
                const stage5Res = getItem('stage5Res')
                const submitInfo = JSON.stringify({
                    token: this.token,
                    stageDatas: {
                        stage1Res,
                        stage2Res,
                        stage3Res,
                        stage4Res,
                        stage5Res
                    },
                    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
                })
                setItem('submitTime', submitInfo)
                Toast.success('提交成功')
                this.$emit('finishPredict')
            } else {
                const originData = _info.stageDatas
                setItem('stage1Res', originData.stage1Res)
                setItem('stage2Res', originData.stage2Res)
                setItem('stage3Res', originData.stage3Res)
                setItem('stage4Res', originData.stage4Res)
                setItem('stage5Res', originData.stage5Res)
                Toast('一天只能提交一次！')
            }
        },
        changeGroup ({ key, res }) {
            this.stage1Res[key] = [...res]
            this.canNextStep = this.handleStage1Res()
            this.SET({ stage1Res: this.stage1Res })
            setItem('stage1Res', JSON.stringify(this.stage1Res))
        },
        nextStep () {
            if (!this.canNextStep) return
            this.currentStage++
            this.canNextStep = false
        },
        prevStep () {
            this.currentStage--
        }
    }
}
</script>

<style lang="scss" scoped>
.index__titlebox {
    font-size: 16px;
    font-weight: 600;
    padding-top: 19px;
    z-index: 100000;
    font-family: PingFangSC;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .index__titleclose {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 15px;
        right: 12px;
        color: #fff;
        display: inline-block;
    }
}
.index__content {
    height: calc(100% - 40px);
    background-color: #510a24;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .index__steparr {
        padding: 19px 12px 12px;
        display: flex;
    }
    .index__step {
        width: 58px;
        height: 37px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-family: PingFangSC;
        font-size: 10px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('../../assets/images/worldCup/btn-xuanzhong-n.png');
        color: hsla(0,0%,100%,.7);
        &.is-active {
            background-image: url('../../assets/images/worldCup/btn-xuanzhong-h.png');
            color: #fff;
        }
    }

    .index__PredictionBall {
        height: calc(100% - 68px);
        padding: 0 12px 12px;
        margin-bottom: 68px;
        overflow: hidden;
        .index__notice {
            height: 17px;
            font-family: PingFangSC;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
            color: #fff;
            margin-bottom: 12px
        }
        .item-scroll{
            height: calc(100% - 30px);
            padding-bottom: 40px;
            overflow-y: auto;
        }
    }
    .index__listbox {
        overflow-y: scroll;
        height: 400px;
        margin-top: 12px;
    }
    .index__confirm {
        width: 100%;
        height: 68px;
        background-color: #510a24;
        position: fixed;
        bottom: 0;
        left: 0;
        padding: 12px;
    }

    .index__button {
        height: 44px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-family: PingFangSC;
        font-size: 14px;
        text-align: center;

        background-image: url('../../assets/images/worldCup/btn-qx-351-44.png');
        color: hsla(0,0%,100%,.7);

        &.is-active {
            margin-right: 12px;
        }
    }
}
</style>
