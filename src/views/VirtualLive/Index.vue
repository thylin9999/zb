<template>
    <div class="h-100 p-relative">
        <div class="back_box" @click="onClickLeft">
            <img class="back" :src="require('@/assets/icons/back.png')" alt="">
        </div>
        <div class="live-room bg-center bg-no-repeat bg-size-100">
            <!-- 动画直播前的静态 -->
            <div class="before-start" v-if="!showAnimation" >
                <div class="name-time">
                    <p>{{ matchInfo.matchInfo.leagueChsShort }}</p>
                    <p>{{ matchInfo.matchInfo.matchTime }}</p>
                </div>
                <div class="match-msg">
                    <div class="team ">
                        <img :src="matchInfo.matchInfo.homeLogo ? matchInfo.matchInfo.homeLogo : require('@/assets/images/virtual/team-logo.png')" alt="">
                        <p class="w-100 text-overflow-hidden">{{ matchInfo.matchInfo.homeChs }}</p>
                    </div>
                    <div class="text-center ">
                        <p class="times"> {{ matchInfo.matchInfo.state === 0 ? '未' : '完' }} </p>
                        <div class="score">
                            <p>{{ matchInfo.matchInfo.homeScore }} - {{ matchInfo.matchInfo.awayScore }}</p>
                            <p>半场 {{ matchInfo.matchInfo.homeHalfScore }}-{{ matchInfo.matchInfo.awayHalfScore }}</p>
                        </div>
                        <div class="btn"  @click="showAnimation = true">
                            <img :src="require('@/assets/images/virtual/icon.png')" alt="">
                            <p>动画直播</p>
                        </div>
                    </div>
                    <div class="team ">
                        <img :src="matchInfo.matchInfo.awayLogo ? matchInfo.matchInfo.awayLogo  : require('@/assets/images/virtual/team-logo.png')" alt="">
                        <p class="w-100 text-overflow-hidden">{{ matchInfo.matchInfo.awayChs }}</p>
                    </div>
                </div>
            </div>
            <!-- 动画直播 -->
            <iframe class="w-100 h-100" :src="animationUrl" frameborder="0" v-else></iframe>
        </div>
        <div class="down-section">
            <div class="chat-host-live-broadcast p-l-25 p-r-25 flex align-center justify-between">
                <van-tabs
                    v-model="currentTab"
                    title-active-color="#00E1FD"
                    title-inactive-color="#6C73AF"
                >
                    <van-tab
                        v-for="tab in tabs"
                        :key="tab.id"
                        :name="tab.id"
                        :title="tab.text"></van-tab>
                </van-tabs>
            </div>
            <div class="host-component overflow-y-auto" >
                <keep-alive>
                    <component
                        v-if="!isChat"
                        :roomInfo="roomInfo"
                        :league-type="leagueType"
                        is-virtual
                        :is="contentComp"></component>
                    <ChatRoom
                        v-else
                        :roomInfo="roomInfo"
                        :match-id="id"
                        is-virtual
                    />
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
import { getMatchInfo } from '../../api/competition'
import { statusCode } from '../../utils/statusCode'
import ChatRoom from '@/views/Broadcast/components/ChatRoom'
import Host from '@/views/Broadcast/components/Host'
import AboutLive from '@/views/Broadcast/components/AboutLive'
import CompetitionResult from '@/views/Broadcast/components/CompetitionResult'
import Lineup from '@/views/Broadcast/components/Lineup'
import { Tab, Tabs, NavBar, Toast } from 'vant'
import liveGuide from '@/views/Guide/Components/liveGuide.vue'
export default {
    name: 'VirtualLive',
    props: ['id'], // matchId
    components: {
        [NavBar.name]: NavBar,
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        [Toast.name]: Toast,
        ChatRoom,
        Host,
        AboutLive,
        CompetitionResult,
        Lineup,
        liveGuide
    },
    data () {
        return {
            leagueType: null, // 1 足球， 2 篮球
            matchInfo: null,
            tabs: [
                {
                    id: 4,
                    text: '赛况',
                    com: 'CompetitionResult'
                },
                {
                    id: 5,
                    text: '阵容',
                    com: 'Lineup'
                },
                {
                    id: 6,
                    text: '有料',
                    com: 'liveGuide'
                },
                {
                    id: 1,
                    text: '聊天',
                    com: 'ChatRoom'
                },
                {
                    id: 3,
                    text: '主播',
                    com: 'AboutLive'
                }

            ],
            currentTab: 4,
            showAnimation: false
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.pathUrl = from.fullPath
        })
    },
    created () {
        const { leagueType } = this.$route.query
        this.leagueType = leagueType * 1
        this.init()
    },
    computed: {
        contentComp () {
            return this.tabs.find(x => x.id === this.currentTab).com
        },
        matchType () {
            return this.leagueType === 1 ? 'football' : 'basketball'
        },
        animationUrl () {
            return this.matchInfo && this.matchInfo.animeUrl
        },
        roomInfo () {
            return {
                ...this.matchInfo,
                match_id: this.id
            }
        },
        isChat () {
            return this.currentTab === 1
        }
    },
    methods: {
        async init () {
            try {
                const { code, data } = await getMatchInfo(this.matchType, this.id)
                console.log(code, data, 'asdfasdf')
                if (code === statusCode.success) {
                    this.matchInfo = data
                }
            } catch (e) {
                console.log('出错了', e)
            }
        },
        onClickLeft () {
            if (this.pathUrl === '/') {
                this.$router.push({ path: '/' })
            } else {
                this.$router.back()
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.back_box{
    top: 0;
    left: 10px;
    z-index: 1;
    position:absolute;
    width: 30px;
    height: 30px;
    .back{
        width: 20px;
        height: 20px;
        margin:10px auto;
    }
}
.live-room {
    height: 270px;
    background-color: #eee;
    // background-image: url('../../assets/images/virtual/football-bg.png');
}
.down-section {
    height: calc(100% - 270px);
    background-color: #000000;
}
::v-deep {
.chat-host-live-broadcast {
    background-color: #2B1845 ;
    .van-tabs__line {
        width: 65px;
        background-color: #00E1FD;
    }
}
.host-component {
    height: calc(100% - 30px);
}
.van-tab{
    width: 65px;
    padding: 0;
}
.van-tabs__line {
    bottom: 0;
}
.van-tabs--line .van-tabs__wrap {
    height: 30px;
    line-height: 30px;
}
.van-tab__text {
    font-size: 14px;
}
.van-tabs__nav--line.van-tabs__nav--complete {
    padding-left: 12px;
    padding-right: 0;
}
}
.before-start{
    background: url('../../assets/images/virtual/football-bg.png');
    background-size: 100% 100%;
    width: 375px;
    height: 270px;
    padding: 20px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #ffffff;
    .name-time{
        text-align: center;
        font-size: 12px;
        line-height: 17px;
        font-weight: 400;
    }
    .match-msg{
        display: flex;
        justify-content: space-around;
        height: 150px;
        align-items: center;
        .team{
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            text-align: center;
            width: 85px;
            img{
                width: 55px;
                height: 55px;
                border-radius: 50%;
            }
        }
        .times{
            width: 20px;
            height: 20px;
            line-height: 20px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            text-align: center;
            font-size: 12px;
            margin: 0 auto;
        }
        .score{
            p:nth-child(1){
                font-size: 30px;
                font-weight: 800;
                margin-top: 25px;
                letter-spacing: 5px;
                text-align: center;
            }
            p:nth-child(2){
                font-size: 12px;
                font-weight: 400;
                line-height: 17px;
                margin-bottom: 25px;
            }
        }
        .btn{
            width: 101px;
            height: 25px;
            background: rgba(0,0,0,.5);
            border-radius: 13px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0 10px;
            margin: 0 auto -50px;
            img{
                width: 22px;
                height: 15px;
            }
            p{
                font-size: 12px;
                font-weight: 400;
            }
        }

    }
}
.flex1{
    flex: 1;
}
</style>
