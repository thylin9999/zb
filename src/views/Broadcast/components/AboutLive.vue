<template>
    <div class="about-live-wrapper h-100 overflow-y-auto">
        <template v-if="currentLives.length">
            <p class="title m-t-10 m-l-15 m-r-15 m-b-10 p-l-5 font-12 font-400 text-white">本场直播</p>
            <div v-if="currentLives.length" class="">
                <ul class="flex flex-wrap">
                    <template
                        v-for="competition in currentLives"
                    >
                        <competition-card
                        class="m-b-5"
                            :key="competition.id"
                            :competition="competition"
                        />

                    </template>
                </ul>
            </div>
            <NoData
                class="flex flex-column align-center p-b-10"
                v-else
                :width="150"
                :height="140"
            />
        </template>
        <p class="title m-l-15 m-r-15 m-b-10 p-l-5 font-12 m-t-5 font-400 text-white">推荐直播</p>
        <div class="about-live  m-t-10">
            <ul v-if="list.length" class="flex flex-wrap">
                <template
                    v-for="competition in list"
                >
                    <competition-card
                    class="m-b-5"
                        :key="competition.id"
                        :competition="competition"
                    />

                </template>
            </ul>
            <NoData
                class="flex flex-column align-center p-b-10"
                v-else
                :width="150"
                :height="140"
            />
            <!-- <van-empty
                v-else
                class="custom-image"
                :image="require('../../../assets/images/notFound.png')"
                description="暂无数据"
            /> -->
        </div>
    </div>
</template>
<script>
import { getHotRoom } from '@/api/competition'
import { statusCode } from '@/utils/statusCode'
import CompetitionCard from './CompetitionCard'
import { getCurrentLives } from '@/api/Host'
import NoData from '../../../components/NoData.vue'
export default {
    props: {
        roomInfo: {
            type: Object,
            default: () => ({})
        },
        isVirtual: {
            type: Boolean,
            default: false
        }
    },
    components: {
        CompetitionCard,
        NoData
    },
    data () {
        return {
            list: [],
            currentLives: []
        }
    },
    created () {
        if (this.isVirtual) {
            this.getCurrents()
        }
        this.fetchData()
    },
    computed: {
        matchInfo () {
            return this.roomInfo.match_info
        }
    },
    methods: {
        async getCurrents () {
            try {
                const { data, code } = await getCurrentLives({ matchId: this.roomInfo.match_id })
                if (code === statusCode.success) {
                    this.currentLives = data.list || []
                }
            } catch (e) {
                console.log('出粗了')
            }
        },
        async fetchData () {
            try {
                const { data, code } = await getHotRoom({})
                if (code === statusCode.success) {
                    if (this.isVirtual && data.list && data.list.length > 3) { // 动画直播随机展示3条
                        this.randomList(data.list)
                    } else {
                        this.list = data.list || []
                    }
                }
            } catch (e) {
                console.log('出粗了')
            }
        },
        randomList (list) {
            console.log(666)
            for (let i = 0; i < 3; i++) { // 随机推荐3个
                const randomNub = Math.floor(Math.random() * (list.length - 1))
                this.list.push(list[randomNub])
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.about-live-wrapper{
    .host-header{
        margin: 0 11px;
        border-left: 2px solid #4164FF;
        background-color: #f2f0fc;
        text-align: center;
        padding-bottom: 11px;
        h4{
            margin: 0;
        }
        .host-info{
            line-height: 20px;
            padding: 9px 0 2px 0;
        }
        .live-total-num{
            line-height: 17px;
            color: #828282;
            background-image: url('../../../assets/images/common/live.gif');
            background-position: left center;
            background-size: 12px 14px;
        }
    }
    .about-live{
        width: 345px;
        margin: 0 auto;
    }
}
.title {
    border-left: 5px solid #FBA187;
    line-height: 17px;
}
</style>
