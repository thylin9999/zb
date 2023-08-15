<template>
    <div class="header">
        <div class="searchInput">
            <i></i>
            <van-field placeholder="搜索专家昵称" @focus="showHistory = true" v-model="name" @input="handlerSearch"></van-field>
        </div>
        <div class="car">
            <span v-if="showHistory" @click="handlerCancel"> 取消 </span>
            <img v-else src="../../../assets/images/guide/car.png" alt="" srcset="" @click="showPur">
        </div>
        <div class="search-history" v-show="showHistory">
            <div class="lately-search">
                <div class="lately-body">
                    <span class="lately-l"> 近期搜索 </span>
                    <span class="lately-r"> <img src="../../../assets/images/guide/clear.png" alt="" @click="claerNear"> </span>
                </div>
                <div class="lately-name">
                    <p v-for="name in historyNames" :key="name" @click="nearSearch(name)">{{ name }}</p>
                </div>
            </div>
            <div class="relevant-expert" @click="goDown">
                <div class="relevant-title">相关专家</div>
                <div class="overflow-y-auto content-box" v-if="list.length">
                    <div class="relevant-body" v-for="item in list" :key="item.member_id">
                        <img :src="item.avatar ? item.avatar : userEmptyImg" alt="">
                        <div>
                            <div class="flex justify-between">
                                <span class="expert-name text-overflow-hidden"> {{item.nickname}} </span>
                                <div class="flex align-center">
                                    <p class="return m-l-10 m-r-10">近{{ item.return_sum }}场回报率{{ item.return_rate }}%</p>
                                    <p class="return">近{{ item.near_sum }}中{{ item.hit_sum }}</p>
                                </div>
                            </div>
                            <div class="expert-desc">
                                {{item.profession}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center font-12 p-10" style="color: #48506B" v-else>
                    没有更多...
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { Field, Toast } from 'vant'
import { debounce } from '@/utils/lodashUtils.js'
import { searchExpert } from '@/api/guide'
import { statusCode } from '@/utils/statusCode'
export default {
    components: {
        [Field.name]: Field,
        [Toast.name]: Toast
    },
    props: {
        purShow: {
            type: Boolean,
            defualt: false
        }
    },
    data () {
        return {
            showHistory: false,
            name: '',
            list: [],
            historyNames: localStorage.getItem('names') && localStorage.getItem('names').split(',').reverse().splice(0, 8) // 历史最多8个
        }
    },
    computed: {
        ...mapState('user', ['token'])
    },
    methods: {
        handlerSearch: debounce(async function () {
            if (this.name === '') return
            const jsonData = {
                pageNum: 1,
                pageSize: 10,
                search: this.name
            }
            const data = await searchExpert(jsonData)
            if (data.code === statusCode.success) {
                // this.list = data.data.list.splice(0, 3) // 最多3个
                this.list = data.data.list || []
                if (data.data.list.length) {
                    // 搜索成功存储历史
                    this.set(this.name)
                }
            } else {
                console.log('搜索错误')
            }
        }, 400),
        // 近期搜索
        nearSearch (name) {
            this.name = name
            this.handlerSearch()
        },
        claerNear () {
            localStorage.removeItem('names')
            this.historyNames = []
        },
        handlerCancel () {
            this.showHistory = false
            this.list = []
            this.name = ''
        },
        // 已购
        showPur () {
            if (!this.token) {
                this.$store.commit('commonData/SET', {
                    loginDialogUrl: this.$route.fullPath
                })
                this.openLoginDialog(this.$route.fullPath)
            } else {
                this.$emit('update:purShow', true)
            }
        },
        set (value) {
            const str = localStorage.getItem('names')
            if (str) {
                let temp = str.split(',')
                temp.push(value)
                temp = [...new Set(temp)]
                value = temp.join(',')
            }
            localStorage.setItem('names', value)
            if (this.historyNames && this.historyNames.length) {
                this.historyNames = value.split(',').reverse().splice(0, 8)
            } else {
                this.historyNames = [value]
            }
        },
        goDown () {
            this.openDownloadDialog()
        }
    }
}
</script>

<style lang="scss" scoped>

.header{
    // background: linear-gradient(180deg, #651E8A 0%, #0E0E23 100%);
    background: linear-gradient(180deg, #2C1447 0%, #232A38 100%);
    padding:14px;
    display: flex;
    justify-content: space-between;
    position: relative;
    .searchInput{
        position: relative;
        i{
            background: url('../../../assets/images/guide/search.png') no-repeat;
            background-size: 25px 25px;
            width: 25px;
            height: 25px;
            position: absolute;
            left: 10px;
            top: 2.5px;
            z-index: 2;
        }
    }
    .car{
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 25px;
        width: 25px;
        height: 25px;
        img{
            width: 25px;
            height:25px;
        }
    }
    .search-history{
        position: absolute;
        width: 100%;
        height: auto;
        // border: 1px solid red;
        left: 0px;
        top: 56px;
        background: linear-gradient(180deg, #0E0E23 0%, #2B1546 100%);
        z-index: 3;
        box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.51);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        .lately-search{
            padding: 5px 20px;
            .lately-body{
                display: flex;
                justify-content: space-between;
                .lately-l{
                    font-size: 14px;
                    color: #48506B;
                    line-height: 20px;
                }
                .lately-r{
                    img{
                        width: 25px;
                        height: 25px;
                    }
                }
            }
            .lately-name{
                display: flex;
                flex-wrap: wrap;
                p{
                    min-width: 46px;
                    height: 24px;
                    background: #0D0B18;
                    border-radius: 5px;
                    color: #FFFFFF;
                    font-size: 12px;
                    text-align: center;
                    line-height: 24px;
                    margin: 0 8px 5px 8px;
                    padding: 0 10px;
                }
            }
        }
        .relevant-expert{
            padding: 5px 20px;
            height: 240px;
            .content-box{
                height: 200px;
            }
            .relevant-title{
                font-size: 14px;
                color: #48506B;
                line-height: 20px;
            }
            .relevant-body{
                display: flex;
                align-items: center;
                padding: 10px 0;
                img{
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-right: 4px;
                }
                .expert-name{
                    font-size: 14px;
                    color: #FFFFFF;
                    line-height: 20px;
                    width: 100px;
                }
                .expert-desc{
                    font-size: 10px;
                    color: #6C73AF;
                    line-height: 14px;
                }
                .return{
                    width: auto;
                    height: 18.75px;
                    line-height: 18.75px;
                    background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
                    border-radius: 3px;
                    padding: 0 5px;
                    color:#2C1447;
                    font-size: 12px;
                    transform: scale(0.8);
                }
            }
        }
    }
}

::v-deep {
    .van-field{
        padding: 0;
        .van-field__control {
            width: 310px;
            height:30px;
            background-color: #020202;
            border-radius: 15px;
            font-size: 10px;
            color: #48506B;
            padding: 0 0 0 45px;
            &::-webkit-input-placeholder{
                color: #48506B;
            }
        }
    }
}
</style>
