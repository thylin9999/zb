<template>
    <!-- <div v-if="show" class="plan-type" :class="{'plan-f-bg':type===1,'plan-b-bg':type===2,'plan-filter-bg':type===3}"> -->
    <div class="plan-type">
        <div class="title">
            {{ type === 1 ? '足球筛选' : type === 2 ? '篮球筛选' : '综合筛选'}}
            <p class="line" />
        </div>
        <!-- 足球/篮球 -->
        <div class="filters" v-if="type===1 || type===2">
            <div class="f-title">
                <div class="all" @click="changeLeagues('1,2,3')" :class="{'t-active' : allLeagues === '1,2,3'}">全部联赛</div>
                <div class="hot" @click="changeLeagues('1,2')" :class="{'t-active' : allLeagues === '1,2'}">热门联赛</div>
            </div>
            <div class="f-center">
                <div v-for="item in list" :key="item.leagueId" :class="{'c-active': item.select}" @click="singleSelect(item)">{{ item.nameChsShort }}</div>
            </div>
            <div class="f-bottom">
                <div class="flex">
                    <p @click="allSelect">全选</p>
                    <p @click="turnSelect">反选</p>
                </div>
                <p class="b-active" @click="submit">确定</p>
            </div>
        </div>
        <!-- 玩法/价格 -->
        <div class="filters p-t-10" v-else-if="type===3">
            <div class="f-play">
                <span>玩法</span>
                <div class="flex" v-if="playType === 1" @click="handlerPlay($event)">
                    <p data="11,12,13" color="0" :class="{'p-active' : playColor==0}">全部</p>
                    <p data="11" color="1" :class="{'p-active' : playColor==1}">胜平负</p>
                    <p data="12" color="2" :class="{'p-active' : playColor==2}">让球</p>
                    <p data="13" color="3" :class="{'p-active' : playColor==3}">大小</p>
                </div>
                <div class="flex" v-else-if="playType === 2" @click="handlerPlay($event)">
                    <p data="21,22,23" color="0" :class="{'p-active' : playColor==0}">全部</p>
                    <p data="21" color="1" :class="{'p-active' : playColor==1}">胜负</p>
                    <p data="22" color="2" :class="{'p-active' : playColor==2}">让分</p>
                    <p data="23" color="3" :class="{'p-active' : playColor==3}">大小</p>
                </div>
            </div>
            <div class="f-play">
                <span>价格</span>
                <div class="flex" @click="handlerPrice($event)">
                    <p data="" :class="{'p-active' : price==0}">全部</p>
                    <p data="1" :class="{'p-active' : price==1}">球币</p>
                    <p data="2" :class="{'p-active' : price==2}">球票</p>
                    <p data="3" :class="{'p-active' : price==3}">免费</p>
                </div>
            </div>
            <div class="b-btn">
                <p @click="submit">确定</p>
            </div>
        </div>
    </div>
</template>

<script>
import { getLeaguesList } from '@/api/guide'
import { statusCode } from '@/utils/statusCode'
import { Toast } from 'vant'
export default {
    components: {
        [Toast.name]: Toast
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        type: { // 筛选显示类型： 1足球 2篮球 3筛选
            type: Number,
            default: 1
        },
        playType: { // 玩法类型： 1足球 2篮球
            type: Number,
            default: 1
        },
        newColor: {
            type: [Number, String],
            default: ''
        }
    },
    data () {
        return {
            allLeagues: '1,2,3', // 全部'1,2,3' 热门'1,2'
            playColor: 0, // 0全部，1胜负平，2让球，3大小
            list: [], // 联赛列表
            play: this.playType === 1 ? '11,12,13' : '21,22,23',
            price: 0 // 0全部 1球币 2球票 3免费 =>后端暂时未做
        }
    },
    watch: {
        playType (newVlue, oldVlue) {
            this.play = newVlue === 1 ? '11,12,13' : '21,22,23'
            this.init()
        }
    },
    computed: {
        apiParams () {
            return {
                league_type: this.type, // 1足球 2篮球
                hierarchy: this.allLeagues,
                playing: '1000' // 赛程：1000 进行中：2000 已结束：3000 未结束：4000
            }
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        async init () {
            // Toast.loading({ forbidClick: true })
            this.$showLoading()
            const data = await getLeaguesList(this.apiParams)
            if (data.code === statusCode.success) {
                if (data.data && data.data.length) {
                    this.list = data.data.map((item) => {
                        item.select = false
                        return item
                    })
                }
                // Toast.clear()
            } else {
                Toast('出现错误')
            }
            this.$hideLoading()
        },
        submit () {
            const ids = []
            this.list.forEach((item) => {
                if (item.select) {
                    ids.push(item.leagueId)
                }
            })
            const data = {
                ids: ids.join(),
                play: this.play,
                price: this.price
            }
            this.$emit('filterData', data)
            this.$emit('update:show', false)
            this.$emit('update:newColor', this.playType)
        },
        // 价格选择
        handlerPrice (e) {
            if (e.target.attributes.data) {
                this.price = e.target.attributes.data.value
            }
        },
        // 玩法选择
        handlerPlay (e) {
            if (e.target.attributes.data && e.target.attributes.color) {
                this.play = e.target.attributes.data.value
                this.playColor = e.target.attributes.color.value
            }
        },
        // 反选
        turnSelect (item) {
            this.list.forEach((item) => {
                item.select = !item.select
            })
        },
        // 单选
        singleSelect (item) {
            item.select = !item.select
        },
        // 全选
        allSelect () {
            this.list.forEach((item) => {
                item.select = true
            })
        },
        // 切换 全部/热门
        changeLeagues (type) {
            this.allLeagues = type
            this.init()
        }
    }
}
</script>

<style lang="scss" scoped>
.plan-f-bg{
    background: url('../../../assets/images/guide/plan-f-bg.png');
}
.plan-b-bg{
    background: url('../../../assets/images/guide/plan-b-bg.png');
}
.plan-filter-bg{
    background: url('../../../assets/images/guide/plan-filter-bg.png');
}
.plan-type{
    z-index: 3;
    // position: absolute;
    // width: 355px;
    height: 318px;
    background-size: 100% 100%;
    // top: 30px;
    // left: 8px;
    // padding-top: 25px;
    padding-bottom: 10px;
    font-size: 12px;
    background: #2B1845;
    .title{
        font-size: 16px;
        height: 47px;
        line-height: 47px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        text-align: center;
        margin-bottom: 20px;
        .line{
            width: 342px;
            height: 1px;
            background: #2F3568;
            margin: 0 auto;
        }
    }
    .f-title{
        width: 190px;
        height: 32px;
        background: #0D0B18;
        border-radius: 16px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #6C73AF;
        padding: 0 2px;
        div{
            width:95px;
            line-height: 30px;
            text-align: center;
        }
        .t-active{
            width: 93px;
            height: 28px;
            background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
            border-radius: 16px;
            color: #161C4F;
        }
    }
    .f-center{
        padding: 12px 25px;
        display: grid;
        grid-template-columns: repeat(4,1fr);
        font-family: PingFangSC-Regular, PingFang SC;
        height: 135px;
        overflow: auto;
        div{
            width: 69px;
            height: 28px;
            background: #30366A;
            border-radius: 5px;
            font-size: 12px;
            color:#FFFFFF;
            line-height: 28px;
            text-align: center;
            margin-bottom: 10px;
        }
        .c-active{
            background: #FBA187;
        }
    }
    .f-bottom{
        width: 325px;
        margin: 15px auto 0;
        border-top: 1px solid #30366A;
        padding: 10px 12px;
        display: flex;
        justify-content: space-between;
        p{
            width: 57px;
            height: 26px;
            line-height: 26px;
            background: #30366A;
            border-radius: 4px;
            color: #CCCCCC;
            font-size: 12px;
            text-align: center;
            margin-right: 10px;
        }
        .b-active{
            background: #FBA187;
            color: #ffffff;
        }
    }
    .f-play{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 32px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        span{
            font-size: 14px;
            font-weight: 500;
            color: #FFFFFF;
        }
        div{
            display: grid;
            grid-template-columns: repeat(3,1fr);
        }
        p{
            width: 69px;
            height: 28px;
            line-height: 28px;
            border-radius: 5px;
            background: #30366A;
            color: #FFFFFF;
            text-align: center;
            margin: 0 10px 10px 0;
            font-size: 12px;
            &.p-active{
                background: #FBA187;
            }
        }
    }
    .b-btn{
        width: 325px;
        margin: 10px auto 0;
        border-top: 1px solid #30366A;
        padding: 15px 10px;
        display: flex;
        justify-content: end;
        p{
            width: 57px;
            height: 26px;
            line-height: 26px;
            background: #FBA187;
            border-radius: 4px;
            color: #FFFFFF;
            text-align: center;
        }
    }
}
</style>
