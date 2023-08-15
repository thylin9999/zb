<template>
    <div  class="containe p-relative guide">
        <!-- main -->
        <div v-show="purShow === false" class="h-100">
            <div class="search">
                <search-input :purShow.sync="purShow"></search-input>
            </div>
            <div class="body">
                <div class="banner">
                    <swiper-banner :list="bannerData"></swiper-banner>
                </div>
                <div class="expert">
                    <div class="expertTitle">
                        <icon-com icon="expert-icon" :width="20" :height="20" />
                        <span class="font-16 text-y p-l-5 font-medium font-500">精选专家</span>
                    </div>
                    <div class="expertContent">
                        <expert-content></expert-content>
                    </div>
                </div>
                <div class="plan">
                    <div class="planTitle" id="here">
                        <div class="plan-title-left">
                            <span @click="handlerPlan(0)" :class="{'plan-active': newColor === 0}">全部方案</span>
                            <span @click="handlerPlan(1)" :class="{'plan-active': newColor === 1}">足球 <i class="icon f-icon" /></span>
                            <span @click="handlerPlan(2)" :class="{'plan-active': newColor === 2}">篮球 <i class="icon b-icon" /></span>
                        </div>
                        <div class="plan-title-right">
                            <img src="../../assets/images/guide/filter.png" alt="" @click="handlerPlan(3)">
                        </div>
                        <!-- 筛选 -->
                        <van-popup v-model="show" position="bottom" closeable close-icon="close" @close="closeFilter">
                            <plan-type :show.sync="show" :type="planActive" :playType="activeColor"  @filterData="handlerFilter" :newColor.sync="newColor" />
                        </van-popup>
                    </div>
                    <div class="planContent">
                        <plan-content :list="list" :finished.sync="finished" @longList="longList"></plan-content>
                    </div>
                </div>
            </div>
            <div class="publish" :class="{'isSlide': isSlide}">
                <button @click="isSlide = !isSlide"></button>
                <img src="../../assets/images/guide/publish.png" alt="" @click="goDown">
            </div>
        </div>
        <!-- 已购 -->
        <purchased v-if="purShow" :purShow.sync="purShow"></purchased>
    </div>
</template>

<script>
import SwiperBanner from '@/components/SwiperBanner.vue'
import IconCom from '@/components/IconCom.vue'
import ExpertContent from '@/views/Guide/Components/ExpertContent.vue'
import PlanContent from '@/views/Guide/Components/PlanContent.vue'
import SearchInput from '@/views/Guide/Components/SearchInput.vue'
import PlanType from '@/views/Guide/Components/PlanType.vue'
// import Purchased from '@/views/Guide/Components/Purchased.vue'
import { getGuideList } from '@/api/guide'
import { statusCode } from '@/utils/statusCode'
import { getBanners } from '@/api/common'
import { Popup } from 'vant'
import { throttle } from '@/utils/lodashUtils'
export default {
    name: 'Guide',
    components: {
        SwiperBanner,
        IconCom,
        ExpertContent,
        PlanContent,
        SearchInput,
        PlanType,
        Purchased: () => import('@/views/Guide/Components/Purchased.vue'),
        [Popup.name]: Popup
    },
    data () {
        return {
            bannerData: [],
            planActive: 0, // 子组件类型：1足球/2篮球/3筛选
            activeColor: 0, // 0全部方案 1足球 2篮球
            show: false, // 显示筛选
            purShow: false, // 显示已够
            pagingData: {
                pageNum: 1,
                pageSize: 10,
                total: null
            },
            list: [],
            filterData: {
                ids: '', // 联赛id
                play: '', // 玩法
                price: '' // 价格 => 后端暂未处理
            },
            isPush: false,
            finished: false,
            isSlide: false,
            newColor: 0
        }
    },
    computed: {
        apiParams () {
            return {
                pageNum: this.pagingData.pageNum,
                pageSize: this.pagingData.pageSize,
                league_id: this.filterData.ids,
                type: this.planActive, // 1足球 2篮球
                play: this.filterData.play,
                pay_type: this.filterData.price
            }
        }
    },
    mounted () {
        this.init()
        this.getBannersData()
        const dom = document.querySelector('.body')
        dom.addEventListener('scroll', throttle(() => {
            this.isSlide = false
        }, 500))
    },
    methods: {
        async init () {
            this.$showLoading()
            if (!this.isPush) this.pagingData.pageNum = 1
            const data = await getGuideList(this.apiParams)
            if (data.code === statusCode.success) {
                if (this.isPush) {
                    this.list = [...this.list, ...data.data.list]
                } else {
                    this.list = data.data.list
                }
                if (data.data.list.length < 10) this.finished = true
                if (this.pagingData.pageNum === 1 && data.data.total > 10) this.finished = false
                this.isPush = false
                this.$hideLoading()
            } else {
                this.$toast('出现错误')
            }
        },
        // 长列表
        longList () {
            this.pagingData.pageNum += 1
            this.isPush = true
            this.init()
        },
        // 过滤数据
        handlerFilter (data) {
            this.filterData = data
            this.planActive = this.activeColor
            // this.finished = false
            this.init()
        },
        handlerPlan (type) {
            console.log('yuan:', this.planActive, 'xian:', type, 'color:', this.newColor)
            // document.querySelector('#here').scrollIntoView({ // 定位到方案赛选
            //     behavior: 'smooth'
            // })
            // 只有足球和篮球才能筛选玩法
            if (this.newColor === 0 && type === 3) {
                return
            }
            // 如果是足球或篮球再去点击筛选，保留篮球或足球选中样式
            if ((this.planActive === 1 || this.planActive === 2) && type === 3) {
                this.show = true
                this.planActive = type
                // this.finished = false
                return
            }
            // 全部方案关闭筛选
            if (type === 0) {
                this.show = false
                this.activeColor = type
                this.planActive = type
                this.filterData = {}
                this.newColor = type
                // this.finished = false
                this.init()
                return
            }
            // 2次点击相同的类型会关闭
            if (type === this.planActive && this.show === true) {
                this.show = false
                this.planActive = this.activeColor
                return
            }
            if (type === 1 || type === 2) {
                this.planActive = type
                this.filterData = {}
                // this.finished = false
                // this.init()
            }
            this.show = true // 显示筛选
            this.planActive = type // 显示哪一个筛选
            this.activeColor = type // 选择样式
        },
        // banner
        async getBannersData () {
            const data = await getBanners(3)
            if (data.code === statusCode.success) {
                if (data.data && data.data.length) {
                    this.bannerData = data.data
                } else {
                    console.log('有料banner有错')
                }
            }
        },
        // 发布方案
        goDown () {
            this.openDownloadDialog()
        },
        // 关闭筛选
        closeFilter () {
            this.show = false
            this.planActive = this.activeColor
        }
    }
}

</script>

<style lang="scss" scoped>
.guide{
    // 头部54 底部65
    height: calc(100vh - 119px);
    overflow: hidden;
}
.publish{
    position: absolute;
    right: -85px;
    bottom: 80px;
    transition: all .5s;
    button{
        position: absolute;
        height: 58px;
        width: 50px;
        border:none;
        background: rgba(0,0,0, 0);
    }
    img{
        width: 117px;
        height: 58px;
    }
}
.isSlide{
    right: 15px;
}
.body{
    background: linear-gradient(180deg, #191E29 0%, #232A38 100%) #0E0E23;
    padding: 10px 0 10px 0;
    height: 100%;
    overflow-y: auto;
    transition: all 1s;
    .expert{
        padding: 16px 14px 0 14px;
        .expertTitle{
            display: flex;
            align-items: center;
        }
        .expertContent{
            padding-top:10px;
        }
    }
    .plan{
        margin-bottom: 40px;
        height: 100px;
        .planTitle{
            padding: 12px 25px 0 25px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            .plan-title-left{
                display: flex;
                justify-content: space-between;
                width: 180px;
                span{
                    display: flex;
                    align-items: center;
                }
                .icon{
                    display: block;
                    background: url('../../assets/images/guide/down.png');
                    background-size: 100% 100%;
                    width: 15px;
                    height: 10px;
                    margin-left: 3px;
                }
                .plan-active{
                    background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
                    -webkit-background-clip: text;
                    color: transparent;
                }
                .f-icon{

                }
                .b-icon{

                }
            }
            .plan-title-right{
                display: flex;
                align-items: center;
                img{
                    width: 20px;
                    height: 20px;
                }
            }
        }
        .planContent{
            padding-bottom: 50px;
        }
    }
}
.text-y{
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #00E0FC;
    background: linear-gradient(180deg, #FAE7D4 0%, #E7B590 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
::v-deep{
    .van-icon:before{
        color: #6C73AF;
    }
}
</style>
