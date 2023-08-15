<template>
    <div class="contribute">
        <van-tabs type="card" class="card" @change="switchStatus">
            <van-tab :title="item.title" :name="item.id" v-for="item in tabs" :key="item.id"></van-tab>
        </van-tabs>
        <div class="list flex align-center justify-between" v-for="item,index in list" :key="index">
            <div class="left">
                <div class="flex align-center">
                    <p class="rank">
                        <span v-if="index+1 === 1"><img src="../../../assets/images/chat/one.png" alt=""></span>
                        <span v-else-if="index+1 === 2"><img src="../../../assets/images/chat/tow.png" alt=""></span>
                        <span v-else-if="index+1 === 3"><img src="../../../assets/images/chat/three.png" alt=""></span>
                        <span v-else class="sort">{{ index+1 }}</span>
                    </p>
                    <div class="user-info flex" v-if="item.nickname !== '' && item.total !== ''">
                        <img v-if="item.avatar" :src="item.avatar" alt="" class="avatar">
                        <img v-else src="../../../assets/logo.png" alt="" class="avatar">
                        <div class="ml-5">
                            <p class="flex align-center">
                                <!-- 空未球童, 11主播, 12专家,1球迷  -->
                                <img v-if="item.label == ''" src="../../../assets/images/chat/qiutong.png" alt="" class="tag" />
                                <img v-else-if="item.label == 1" src="../../../assets/images/chat/qiumi.png" alt="" class="tag" />
                                <img v-else-if="item.label == 11" src="../../../assets/images/chat/zhubo.png" alt="" class="tag" />
                                <img v-else-if="item.label == 12" src="../../../assets/images/chat/zhubo.png" alt="" class="tag" />
                                <span class="name">{{item.nickname}}</span>
                            </p>
                            <p class="totle">贡献{{ item.total }}球币</p>
                        </div>
                    </div>
                    <div v-else class="user-info empty">
                        虚位以待
                    </div>
                </div>
            </div>
            <div class="right">
                <img v-if="item.up_down === 1" src="../../../assets/images/chat/top.png" alt="">
                <img v-else-if="item.up_down === 2" src="../../../assets/images/chat/bottom.png" alt="">
                <img v-else src="../../../assets/images/chat/not.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
import { Tab, Tabs } from 'vant'
import { getContribute } from '@/api/Host'
import { statusCode } from '@/utils/statusCode'
export default {
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs
    },
    props: {
        anchorInfo: {
            type: Object,
            default: () => [{}]
        }
    },
    data () {
        return {
            tabs: [
                {
                    title: '贡献日榜',
                    id: 1
                },
                {
                    title: '贡献周榜',
                    id: 2
                }
            ],
            list: [],
            currentId: 1
        }
    },
    computed: {
        apiParams () {
            return {
                id: this.anchorInfo.member_id,
                type: this.currentId
            }
        }
    },
    mounted () {
        this.init()
        setInterval(() => {
            this.init()
        }, 60000)
    },
    methods: {
        async init () {
            const data = await getContribute({ ...this.apiParams })
            if (data.code === statusCode.success) {
                this.list = data.data
            } else {
                this.list = []
            }
        },
        switchStatus (type) {
            this.currentId = type
            this.init()
        }
    }
}
</script>

<style lang="scss" scoped>
.contribute{
    padding: 15px 15px 0 15px;
    .card{
        margin-bottom: 15px;
    }
    .list{
        margin-bottom: 5px;
    }
    .rank{
        width: 35px;
        img{
            width: 35px;
            height: 35px;
        }
        .sort{
            display: block;
            width: 25px;
            height: 25px;
            text-align: center;
            line-height: 25px;
            background: #6C73AF;
            color: #ffffff;
            border-radius: 50%;
            margin: 0 auto;
        }
    }
    .empty{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 35px;
    }
    .user-info{
        margin-left: 10px;
        .avatar{
            width: 35px;
            height: 35px;
            border-radius: 50%;
            margin-right: 5px;
        }
        .tag{
            width: 46px;
            height: 19px
        }
        .name{
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            margin-left: 5px;
        }
        .totle{
            margin-top: 2px;
            padding-left: 5px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FBEBDA;
            background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
    .right{
        img{
            width: 20px;
            height: 20px;
        }
    }
}
::v-deep{
    .van-tabs__nav--card{
        border: none;
        margin: 0 64px
    }
    .van-tabs__nav--card .van-tab{
        color: #6C73AF;
        background: #161C4F;
        width: 96px !important;
        height: 24px;
        line-height: 24px;
        border-radius: 4px;
        border: none;
    }
    .van-tabs__nav--card .van-tab.van-tab--active{
        background: #FBA187;
        color: #ffffff;
    }
}
</style>
