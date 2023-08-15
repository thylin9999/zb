<template>
    <div class="broadcast h-100"  v-if="roomInfo">
        <div class="back_box" @click="onClickLeft">
            <img class="back" :src="require('@/assets/icons/back.png')" alt="">
        </div>
        <div class="view-video"
            :class="{
                'visibility-hidden': hideVideo
            }"
        >
            <video-display :videoInfo="roomInfo" v-if="roomInfo.live_status == 2" />
            <div class="no-video-box" v-else>
                <div class="no-video-title">主播已下播</div>
                <div class="no-video-list">
                    <HostBroadsVideo/>
                </div>
            </div>
        </div>
        <div class="chat-host-live-broadcast flex align-center justify-between">
            <van-tabs
                :before-change="beforeChange"
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
            <div class="follow-box flex align-center ignore- text-center bg-no-repeat bg-center bg-size-100">
                <img class="m-l-10" v-if="anchorInfo" :src="anchorInfo.logo ? anchorInfo.logo : require('@/assets/images/my/user-empty.png')" alt="">
                <span class="font-12 m-l-5 font-regular font-400 text-color " @click="subscribeHost">{{ followString }}</span>
            </div>
        </div>
        <div class="host-component" >
            <keep-alive>
                <component
                    :roomInfo="roomInfo"
                    :anchorInfo="anchorInfo"
                    :league-type="leagueType"
                    :is="contentComp"></component>
            </keep-alive>
        </div>
    </div>
<!--    <van-loading v-else class="loading" size="24px" type="spinner" color="#1989fa">加载中...</van-loading>-->
</template>

<script>
import { Tab, Tabs, NavBar, Toast } from 'vant'
import VideoDisplay from '@/components/VideoDisplay'
import ChatRoom from '@/views/Broadcast/components/ChatRoom'
import Host from '@/views/Broadcast/components/Host'
import AboutLive from '@/views/Broadcast/components/AboutLive'
import CompetitionResult from '@/views/Broadcast/components/CompetitionResult'
import Lineup from '@/views/Broadcast/components/Lineup'
import { getRoomInfo, subscribeHost } from '@/api/competition'
import { mapState } from 'vuex'
import { statusCode } from '@/utils/statusCode'
import HostBroadsVideo from '@/views/Competition/Components/HostBroadsVideo'
import liveGuide from '@/views/Guide/Components/liveGuide.vue'
import Contribute from '@/views/Broadcast/components/Contribute'
export default {
    name: 'Index',
    props: ['id'],
    components: {
        [NavBar.name]: NavBar,
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        [Toast.name]: Toast,
        VideoDisplay,
        ChatRoom,
        Host,
        AboutLive,
        CompetitionResult,
        Lineup,
        HostBroadsVideo,
        liveGuide,
        Contribute
    },
    data () {
        return {
            hideVideo: false,
            pathUrl: '',
            roomInfo: null,
            anchorInfo: null,
            matchInfo: null,
            tabs: [
                {
                    id: 1,
                    text: '聊天',
                    com: 'ChatRoom'
                },
                {
                    id: 2,
                    text: '主播',
                    com: 'Host'
                },
                {
                    id: 7,
                    text: '贡献',
                    com: 'Contribute'
                },
                {
                    id: 3,
                    text: '推荐',
                    com: 'AboutLive'
                },
                {
                    id: 6,
                    text: '有料',
                    com: 'liveGuide'
                },
                {
                    id: 4,
                    text: '赛况',
                    com: 'CompetitionResult'
                },
                {
                    id: 5,
                    text: '阵容',
                    com: 'Lineup'
                }
            ],
            currentTab: 1,
            updateKey: +new Date().getTime(),
            is_follow: false // 是否关注了主播
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.pathUrl = from.fullPath
        })
    },
    computed: {
        ...mapState('user', ['token']),
        ...mapState('commonData', ['showDownloadDialog']),
        contentComp () {
            return this.tabs.find(x => x.id === this.currentTab).com
        },
        followString () {
            // eslint-disable-next-line eqeqeq
            return this.is_follow == 0 ? '+关注' : `${(this.anchorInfo.follow / 10000).toFixed(1)}W`
        },
        hasMatch () {
            return this.matchInfo
        },
        leagueType () {
            // 如果有就是正常分类，如果是-1 表示没有比赛
            return (this.matchInfo && this.matchInfo.leagueType) || 1
        }
    },
    watch: {
        id () {
            if (this.id) {
                // 重新加载页面
                this.updateKey = +new Date().getTime()
                console.log(this.$route.params)
            }
        },
        showDownloadDialog: {
            handler () {
                this.hideVideo = this.showDownloadDialog
            }
        }
    },
    created () {
        /* 公共事件 由聊天室监听 1310状态发出 主播下播 */
        this.$bus.$on('changeLiveStatus', val => {
            if (this.$route.query.room_id === val.room_id) {
                this.roomInfo.live_status = val.status
            }
        })
        // 如果直播类型是，电竞/其他，需要隐藏：有料，赛况，阵容
        if (this.$route.query.type === '3' || this.$route.query.type === '4') {
            console.log('电竞')
            this.tabs = this.tabs.filter(item => item.id !== 4 && item.id !== 5 && item.id !== 6)
            console.log(this.tabs)
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        async subscribeHost () {
            if (!this.token) {
                this.$store.commit('commonData/SET', {
                    loginDialogUrl: this.$route.fullPath
                })
                // this.openLoginDialog()
                this.goToLogin()
            } else {
                // 关注、取消关注
                const { code, msg } = await subscribeHost({ anchor_id: this.anchorInfo.member_id })
                if (code === statusCode.success) {
                    this.is_follow = this.is_follow ? 0 : 1
                }
                await this.init(true)
                Toast(msg)
            }
        },
        beforeChange (index) {
            // if ([4, 5].includes(index)) {
            //     // 打开下载页
            //     this.openDownloadDialog()
            //     return false
            // }
            return true
        },
        async init (update) {
            try {
                // Toast.loading({
                //     duration: 0,
                //     forbidClick: true,
                //     message: '加载中...',
                //     loadingType: 'spinner'
                // })
                this.$showLoading()
                const { data, code, msg } = await getRoomInfo({ room_id: this.$route.query.room_id })
                if (code === 200) {
                    this.roomInfo = data.room_info
                    this.matchInfo = data.room_info.match_info
                    this.anchorInfo = data.anchor_info
                    this.is_follow = this.anchorInfo.is_follow
                } else {
                    Toast(msg)
                }
                if (update) {
                    this.updateKey = +new Date().getTime()
                }
            } finally {
                // Toast.clear()
                this.$hideLoading()
            }
        },
        onClickLeft () {
            console.log(this.pathUrl)
            if (this.pathUrl === '/' || !this.pathUrl || this.pathUrl === '/user/login') { // 原路返回排除登陆页面
                this.$router.push({ path: '/' })
            } else {
                this.$router.back()
            }
        }

    }
}
</script>

<style lang="scss" scoped>

    .broadcast{
        position: relative;
        background-color: #0E0E23;
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
        .no-video-box{
            background-color: rgba(45, 58, 69, 0.5);
            height: 61.333vw;
            width: 100%;
            overflow: hidden;

            .no-video-title{
                border-radius: 5px;
                width: 30vw;
                height: 10.5vw;
                margin: 15.2vw auto 0;
                line-height: 10.5vw;
                text-align: center;
                color: #fff;
                font-size: 12px;
                background-color: #4782a7;
            }
            .no-video-list{
                margin-top: 5vw;
            }
        }

    }

    .loading{
      width: 100%;
      height: 100%;
    }

  .host-component {
    height: calc(100% - 261px);
  }
  .chat-host-live-broadcast {
      border-bottom: 1px solid #2F3568;
      .follow-box {
          width: 75px;
          background-image: url("../../assets/images/follow-bg.png");
          img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
          }
      }
      .follow-box.ignore- {
          height: 30px;
          line-height: 30px;
      }
  }
  ::v-deep {
    .chat-host-live-broadcast {
        background-color: #2B1845 ;
        .van-tabs {
            width: calc(100% - 80px);
        }
      .van-tabs__line {
        width: 50px;
        background-color: #00E1FD;
      }
    }
    .van-tab{
        width: 48px;
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

  .van-toast--unclickable{
      background-color: #000;
  }
</style>
