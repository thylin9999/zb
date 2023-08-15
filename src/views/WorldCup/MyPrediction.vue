<template>
    <div class="index__modal2">
        <div class="index__myPrediction">
            <div class="index__containbox">
                <div class="index_container">
                    <template
                        v-for="(stage1, key) in stage1Datas"
                    >
                        <div class="index__step1list flex justify-between"
                            :key="key"
                             :class="{
                                'is-first': key === 'A/B'
                             }"
                        >
                            <div>
                                <template
                                    v-for="item in stage1[0]"
                                >
                                    <div class="index__itemchild" :key="item.id">
                                        <div class="index__icon">
                                            <img
                                                :src="require(`../../assets/images/worldCup/teams/${item.img}.png`)"
                                            >
                                        </div>
                                        <div class="index__counters">{{ item.name }}</div>
                                    </div>
                                </template>
                            </div>
                            <div>
                                <template
                                    v-for="item in stage1[1]"
                                >
                                    <div class="index__itemchild" :key="item.id">
                                        <div class="index__icon">
                                            <img
                                                :src="require(`../../assets/images/worldCup/teams/${item.img}.png`)"
                                            >
                                        </div>
                                        <div class="index__counters">{{ item.name }}</div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>

                </div>

                <div class="index__container2">
                    <template
                        v-for="(stage2, key) in stage2Datas"
                    >
                        <div class="index__step2list p-relative flex justify-between"
                             :key="key"
                        >
                            <template
                                v-for="(item) in stage2"
                            >
                                <div class="index__itemchild" :key="item.id">
                                    <div class="index__icon">
                                        <img
                                            :src="require(`../../assets/images/worldCup/teams/${item.img}.png`)"
                                        >
                                    </div>
                                    <div class="index__counters">{{ item.name }}</div>
                                </div>
                            </template>
                            <div  class="index__linebox1-left"></div>
                            <div  class="index__linebox1-right"></div>
                        </div>
                    </template>
                </div>

                <div class="index__container3">
                    <template
                        v-for="(stage3, key) in stage3Datas"
                    >
                        <div class="index__step3list  p-relative flex justify-between"
                            :key="key + 'stage3'"
                        >
                            <template
                                v-for="(item) in stage3"
                            >
                                <div class="index__itemchild" :key="item.id">
                                    <div class="index__icon">
                                        <img
                                            :src="require(`../../assets/images/worldCup/teams/${item.img}.png`)"
                                        >
                                    </div>
                                    <div class="index__counters">{{ item.name }}</div>
                                </div>
                            </template>
                            <div class="index__linebox2-left"></div>
                            <div class="index__linebox2-right"></div>
                        </div>
                    </template>
                </div>

                <div class="index__container4">
                    <div class="index__topbox">
                        <div class="index__item5child">
                            <div class="index__icon">
                                <img
                                    :src="require(`../../assets/images/worldCup/teams/${stage5Datas.img}.png`)"
                                >
                            </div>
                            <div class="index__counters">{{ stage5Datas.name }}</div></div></div>
                    <div class="index__step4list">
                        <template
                            v-for="(stage4) in stage4Datas"
                        >
                            <div
                                v-for="item in stage4"
                                class="index__item4child"
                                :key="item.id">
                                <div class="index__icon">
                                    <img
                                        :src="require(`../../assets/images/worldCup/teams/${item.img}.png`)"
                                    >
                                </div>
                                <div class="index__counters">{{ item.name }}</div>
                            </div>
                        </template>
                        <div class="index__step4title">决赛</div>
                        <div class="index__step4vs">vs</div>
                        <div class="index__linebox4-left"></div>
                        <div class="index__linebox4-right"></div>
                    </div>
                </div>

            </div>
            <div class="index__winroad">
                <div class="index__bottombar">生成我的冠军之路</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getItem } from '@/utils/cookie'
import { mapState } from 'vuex'
export default {
    name: 'MyPrediction',
    data () {
        return {
            groups: [
                'A/B',
                'C/D',
                'E/F',
                'G/H'
            ],
            group2: [
                'A/E',
                'B/F',
                'C/G',
                'D/H'
            ],
            stage1Datas: {},
            stage2Datas: {},
            stage3Datas: {},
            stage4Datas: {},
            stage5Datas: {}
        }
    },
    created () {
        this.initStage2()
        this.initStage3()
        this.initStage4()
        this.initStage5()
        this.initStage6()
    },
    computed: {
        ...mapState('commonData', ['stage2Res', 'stage1Res', 'stage3Res', 'stage4Res', 'stage5Res'])
    },
    methods: {
        initStage6 () {
            const stage5Res = getItem('stage5Res')
            const _stage5Res = stage5Res ? JSON.parse(stage5Res) : {}
            this.SET({ stage5Res: _stage5Res })
            this.stage5Datas = this.stage5Res.A
            console.log(this.stage5Res, this.stage5Datas, 'stage5Res')
        },
        initStage5 () {
            const stage4Res = getItem('stage4Res')
            const _stage4Res = stage4Res ? JSON.parse(stage4Res) : {}
            this.SET({ stage4Res: _stage4Res })
            const groups = ['A/B']
            this.stage4Datas = groups.reduce((all, key) => {
                const keys = key.split('/')
                const leftKey = keys[0]
                const rightKey = keys[1]
                all[key] = [
                    this.stage4Res[leftKey],
                    this.stage4Res[rightKey]
                ]
                return all
            }, {})
            console.log(this.stage4Datas, 'stage4Datas')
        },
        initStage4 () {
            const stage3Res = getItem('stage3Res')
            const _stage3Res = stage3Res ? JSON.parse(stage3Res) : {}
            this.SET({ stage3Res: _stage3Res })
            const groups = ['A/C', 'B/D']
            this.stage3Datas = groups.reduce((all, key) => {
                const keys = key.split('/')
                const leftKey = keys[0]
                const rightKey = keys[1]
                all[key] = [
                    this.stage3Res[leftKey],
                    this.stage3Res[rightKey]
                ]
                return all
            }, {})
        },
        initStage3 () {
            const stage2Res = getItem('stage2Res')
            const _stage2Res = stage2Res ? JSON.parse(stage2Res) : {}
            this.SET({ stage2Res: _stage2Res })
            this.stage2Datas = this.group2.reduce((all, key) => {
                const keys = key.split('/')
                const leftKey = keys[0]
                const rightKey = keys[1]
                all[key] = [
                    this.stage2Res[leftKey],
                    this.stage2Res[rightKey]
                ]
                return all
            }, {})
        },
        initStage2 () {
            const stage1Res = getItem('stage1Res')
            const _stage1Res = stage1Res ? JSON.parse(stage1Res) : {}
            this.SET({ stage1Res: _stage1Res })
            const res = this.groups.reduce((all, key) => {
                const keys = key.split('/')
                const leftKey = keys[0] // A
                const rightKey = keys[1] // B
                // 要交叉
                const arr1 = this.stage1Res[leftKey]
                const arr2 = this.stage1Res[rightKey]
                all[leftKey] = [
                    arr1[0],
                    arr2[1]
                ]
                all[rightKey] = [
                    arr1[1],
                    arr2[0]
                ]
                return all
            }, {})
            this.stage1Datas = this.group2.reduce((all, item) => {
                const keys = item.split('/')
                const leftKey = keys[0]
                const rightKey = keys[1]
                all[item] = [
                    res[leftKey],
                    res[rightKey]
                ]
                return all
            }, {})
        }
    }
}
</script>

<style lang="scss" scoped>
.index__modal2 {
    position: fixed;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    border-radius: 8px 8px 0 0;
    background: #510a24;
    overflow-y: scroll;
    z-index: 5;
    .index__myPrediction {
        width: 100%;
        height: 650px;
        position: relative;
        margin-bottom: 140px;
        .index__containbox {
            background-image: url('../../assets/images/worldCup/imgs-top-bg.jpg');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            width: 100%;
            height: 100%;
            padding: 80px 13px 0;
            .index_container {
                width: 351px;
                height: 470px;
            }

            .index__container2 {
                width: 263px;
                height: 430px;
                position: absolute;
                left: 57px;
                top: 110px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                z-index: 2;
            }

            .index__container3 {
                width: 175px;
                height: 300px;
                position: absolute;
                left: 101px;
                top: 170px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                z-index: 1;
            }

            .index__container4 {
                width: 80px;
                height: 210px;
                position: absolute;
                left: 147px;
                top: 129px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
            }
        }
    }

    .index__step1list {
        margin-top: 16px;
        &.is-first {
            margin-top: 0;
        }
    }

    .index__itemchild {
        width: 34px;
        height: 42px;
        border-radius: 4px;
        background-color: #fff;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-direction: column;

    }

    .index__icon {
        width: 16px;
        height: 16px;
        overflow: hidden;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 26px;
            margin: 8px 10px;
        }
    }
    .index__counters{
        width: 52px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-family: PingFangSC;
        font-weight: 500;
        color: #333;
        transform: scale(.65);
        font-size: 12px;
    }

    .index__step2list {
        .index__linebox1-left {
            width: 5px;
            height: 54px;
            left: -10px;
            top: -7px;
            position: absolute;
            border-radius: 3px;
            border-right: 2px solid #da89a6;
            border-top: 2px solid #da89a6;
            border-bottom: 2px solid #da89a6;
        }
        .index__linebox1-right {
            width: 5px;
            height: 54px;
            right: -10px;
            top: -7px;
            position: absolute;
            border-radius: 3px;
            border-left: 2px solid #da89a6;
            border-top: 2px solid #da89a6;
            border-bottom: 2px solid #da89a6;
        }
    }

    .index__step3list {
        .index__linebox2-left {
            width: 45px;
            height: 125px;
            left: -50px;
            top: -40px;
            position: absolute;
            border-radius: 3px;
            border-right: 2px solid #da89a6;
            border-top: 2px solid #da89a6;
            border-bottom: 2px solid #da89a6;
        }
        .index__linebox2-right {
            width: 45px;
            height: 125px;
            right: -50px;
            top: -40px;
            position: absolute;
            border-radius: 3px;
            border-left: 2px solid #da89a6;
            border-top: 2px solid #da89a6;
            border-bottom: 2px solid #da89a6;
        }
    }
    .index__step4list {
        width: 80px;
        height: 58px;
        display: flex;
        justify-content: space-between;
        background-image: url('../../assets/images/worldCup/bg-guojia-l.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: relative;
        align-items: center;
        .index__item4child {
            width: 34px;
            height: 58px;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-top: 15px;
            .index__icon {
                width: 22px;
                height: 22px;
                overflow: hidden;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: 36px;
                    height: 36px;
                }
            }
            .index__counters {
                width: 52px;
                height: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                font-family: PingFangSC;
                font-weight: 500;
                color: #333;
                transform: scale(.75);
                font-size: 12px;
            }
        }
        .index__step4title{
            position: absolute;
            font-family: PingFang-SC;
            font-weight: 500;
            line-height: 1;
            text-align: center;
            color: #9f6324;
            left: 0;
            top: 0;
            transform: scale(.65);
            font-size: 12px;
            width: 100%;
        }
        .index__step4vs {
            position: absolute;
            font-family: PingFang-SC;
            font-size: 14px;
            font-weight: 500;
            line-height: 1;
            text-align: center;
            color: #333;
            left: 0;
            top: 40%;
            width: 100%;
        }
        .index__linebox4-left {
            width: 46px;
            height: 250px;
            left: -53px;
            top: -90px;
            position: absolute;
            border-radius: 3px;
            border-right: 2px solid #da89a6;
            border-top: 2px solid #da89a6;
            border-bottom: 2px solid #da89a6;

        }
        .index__linebox4-right {
            width: 46px;
            height: 250px;
            right: -53px;
            top: -90px;
            position: absolute;
            border-radius: 3px;
            border-left: 2px solid #da89a6;
            border-top: 2px solid #da89a6;
            border-bottom: 2px solid #da89a6;
        }
    }

    .index__topbox {
        width: 50px;
        height: 125px;
        background-image: url('../../assets/images/worldCup/img-guanjun-x.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;

        .index__item5child {
            width: 46px;
            height: 55px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-top: 69px;
            .index__icon {
                width: 22px;
                height: 22px;
                margin-top: 10px;
                overflow: hidden;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
}

.index__winroad {
    position: fixed;
    width: 375px;
    height: 84px;
    background-color: #510a24;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 48px;
    left: 0;
    z-index: 9999;
    .index__bottombar {
        width: 351px;
        height: 41px;
        border-radius: 4px;
        box-shadow: inset 0 -2px 11px 0 #ff004c;
        background-image: linear-gradient(180deg,#c90c46,#a0103e);
        font-family: PingFangSC;
        font-size: 14px;
        text-align: center;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
