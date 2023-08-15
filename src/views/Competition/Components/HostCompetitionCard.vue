<template>
<div class="card flex align-center bg-white">
    <div class="left h-100 p-r-5 w-50 flex flex-column align-center">
        <div class="league w-100 flex align-center">
            <span
                class="league-title font-12 font-medium text-center font-500"
                :style="{
                    color: '#2B8ED4',
                    border: `1px solid #2B8ED4`
                }"
            >{{ competition.leagueChsShort }}</span>
            <div class="font-12 m-l-10 font-medium font-500 text-black-3 scale-9 transform-center">
<!--                <span>第11轮</span>-->
                <span>{{ matchTime  }}</span>
            </div>
        </div>
        <div class="team-info m-t-10 w-100 font-500 font-12 font-medium text-black-3 flex align-center justify-center">
            <div class="team flex align-center">
                <span class="team-name p-r-5 text-clip text-right">{{ competition.homeChs}}</span>
                <span
                    class="icon d-inline-block border-50 d-inline-block bg-no-repeat bg-center bg-size-cover"
                    :style="{
                        backgroundImage: `url(${homeIcon})`
                    }"
                ></span>
            </div>
            <span class="font-13 text-center divider">-</span>
            <div class="team flex align-center">
                <span
                    class="icon d-inline-block border-50 d-inline-block bg-no-repeat bg-center bg-size-cover"
                    :style="{
                        backgroundImage: `url(${awayIcon})`
                    }"
                ></span>
                <span class="team-name p-l-5 text-clip text-left">{{ competition.awayChs }}</span>
            </div>
        </div>
    </div>
    <div class="right w-50 h-100 flex align-center">
        <div class="left-border"></div>
        <div class="hosts p-l-5 p-r-5 flex align-center flex-no-wrap overflow-x-auto">
            <template
                v-for="anchor in anchors"
            >
                <span
                    :key="anchor.id"
                    @click="viewAnchor(anchor)"
                    class="host m-l-5 border-50 shrink-0  bg-no-repeat bg-center bg-size-cover"
                    :style="{
                        backgroundImage: anchor.img ? `url(${anchor.img})` : `url(${userEmptyImg})`
                    }"
                ></span>
            </template>

        </div>

    </div>
    <van-dialog v-model="showAnchor" close-on-click-overlay lock-scroll  :show-confirm-button="false">
        <div class="host-box bg-center bg-size-100 p-relative bg-no-repeat">
            <van-icon size="23" color="#000" class="close p-absolute" name="close" @click="closeDialog" />
            <div class="host-img p-absolute flex">
                <div class="img">
                    <img class="border-50" :src="viewAnchorImg" alt="">
                    <span
                        v-if="currentAnchor.live_status * 1 === 2"
                        class="status d-inline-block p-absolute text-center font-12 font-regular font-400 text-color"
                    >
                        <span  class="d-inline-block transform-center scale-9">直播中</span>
                    </span>
                </div>
                <div class="fans font-12 m-l-5 font-regular font-400">粉丝：{{ currentAnchor.follow || 0}}</div>
            </div>
            <div class="info p-l-25">
                <div class="font-14 font-medium text-black-3 font-500">
                    <span>主播：</span>
                    <span>{{ currentAnchor.anchor_name }}</span>
                </div>
            </div>
            <span
                class="follow-button m-t-25 d-inline-block text-center text-color font-16 font-medium font-500"
                @click="follow"
            >{{ followAnchor }}</span>
        </div>
    </van-dialog>
</div>
</template>

<script>
import dayjs from 'dayjs'
import { followHost } from '@/api/Host'
import { Dialog, Toast, Icon } from 'vant'
import { statusCode } from '@/utils/statusCode'
import { mapState } from 'vuex'
export default {
    name: 'HostCompetitionCard',
    components: {
        [Dialog.Component.name]: Dialog.Component,
        [Toast.name]: Toast,
        [Icon.name]: Icon
    },
    props: {
        competition: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            showAnchor: false,
            currentAnchor: {},
            followStatus: null
        }
    },
    computed: {
        ...mapState('user', ['token']),
        matchTime () {
            return dayjs(this.competition.matchTime).format('HH:mm')
        },
        blankImg () {
            return this.competition.leagueType === 1 ? require('../../../assets/images/common/football.png') : require('../../../assets/images/common/basketball.png')
        },
        homeIcon () {
            return this.competition.homeLogo || this.blankImg
        },
        awayIcon () {
            return this.competition.awayLogo || this.blankImg
        },
        anchors () {
            return this.competition.scheduled_anchor || []
        },
        viewAnchorImg () {
            return (this.currentAnchor && this.currentAnchor.img) || this.userEmptyImg
        },
        followAnchor () {
            return this.followStatus === 1 ? '已关注' : '关注'
        },
        anchor () {
            return this.anchors[0]
        }
    },
    methods: {
        viewAnchor (anchor) {
            this.currentAnchor = anchor
            this.followStatus = this.currentAnchor.follow_this_anchor
            this.showAnchor = true
        },
        async follow () {
            if (!this.token) {
                this.openLoginDialog()
                return
            }
            try {
                const { code, msg } = await followHost(this.currentAnchor.room_id)
                if (code === statusCode.success) {
                    this.followStatus = this.followStatus === 1 ? 2 : 1
                    this.currentAnchor.follow = this.followStatus === 2 ? (this.currentAnchor.follow - 1) : (this.currentAnchor.follow + 1)
                    this.$emit('refresh')
                }
                Toast(msg)
            } catch (e) {
                console.log('出错了')
            }
        },
        closeDialog () {
            this.showAnchor = false
        }
    }
}
</script>

<style lang="scss" scoped>
.card{
    width: 360px;
    margin: 3px auto 0;
    padding: 4px;
    height: 62px;
    background: #FFFFFF;
    .league-title {
        width: 60px;
        height: 20px;
        line-height: 20px;
        border-radius: 3px;
        border: 1px solid #2B8ED4;
    }
    .team-info {
        .divider {
            width: 15px;
        }
        .team {
            width: calc(50% - 7.5px);
        }
        .icon {
            width: 15px;
            height: 15px;
        }
        .team-name {
            width: calc(100% - 15px);
        }
    }

    .right {
        .left-border {
            width: 1px;
            height: calc(100% - 2px);
            background-color: #D8D8D8;
        }
        .hosts {
            width: calc(100% - 1px);
        }
        .host {
            width: 35px;
            height: 35px;
            background-color: #eee;
        }
    }
}
.host-box {
    width: 270px;
    height: 270px;
    padding-top: 140px;
    background-image: url('../../../assets/images/competition/host-bg.png');
    .close{
        right: 15px;
        top: 15px;
    }
}
.host-img {
    top: 60px;
    left: 105px;
    align-items: flex-end;
    .img {
        width: 60px;
        height: 60px;
        img {
            width: 100%;
            height: 100%;
        }
        .status {
            width: 50px;
            bottom: -7px;
            left: 8px;
            background: #FB7674;
            border-radius: 3px;
            line-height: 14px;
            height: 14px;
        }
    }
    .fans {
        color: #404040;
    }
}
.follow-button {
    width: 173px;
    height: 38px;
    background: #FBA974;
    border-radius: 3px;
    line-height: 38px;
    margin-left: 50px;
}
::v-deep {
    .van-dialog {
        width: 270px;
        height: 270px;
        background-color: transparent;
    }
}
</style>
