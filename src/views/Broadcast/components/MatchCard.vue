<template>
<div class="w-100">
    <div class="live-other-item m-b-5">
        <div class="live-left">
            <div class="live-time font-12 font-medium text-primary font-500">
                <span class="scale-9">{{ date }}</span>
                <span class="m-l-5 scale-9 m-r-5">|</span>
                <span class="scale-9">{{ time }}</span>
                <span class="m-l-15">{{ matchInfo.leagueChsShort }}</span></div>
            <div class="live-info flex align-center">
               <div class="team flex flex-end align-center">
                   <span class="flex-1 m-r-5 font-14 font-regular font-400 text-white text-right text-ellipsis">{{ matchInfo.homeChs }}</span>
                   <span
                       class="team-pic d-inline-block bg-no-repeat bg-center bg-size-100 border-50"
                       :style="{
                            backgroundImage: `url(${matchInfo.homeLogo})`
                       }"
                   ></span>
               </div>
                <span class="font-12 font-regular vs text-center font-400 text-white">VS</span>
                <div class="team flex align-center">
                    <span
                        class="team-pic d-inline-block bg-no-repeat bg-center bg-size-100 border-50"
                        :style="{
                            backgroundImage: `url(${matchInfo.awayLogo})`
                       }"
                    ></span>
                    <span class="flex-1 m-l-5 font-14 font-regular font-400  text-white text-ellipsis">{{ matchInfo.awayChs }}</span>
                </div>
            </div>
        </div>
        <div
            class="live-right text-center"
            :class="{
                'is-subscribed': isSubscribed
            }"
            @click="subscribeMatch"
        >
            <span class="d-inline-block font-12">{{ subscribeString}}</span>
        </div>
    </div>
</div>
</template>

<script>
import dayjs from 'dayjs'
import { addSubscribeMatch } from '@/api/competition'
import { statusCode } from '@/utils/statusCode'
import { Toast } from 'vant'
import { mapState } from 'vuex'
import { getToken } from '@/utils/cookie'
export default {
    name: 'MatchCard',
    components: {
        [Toast.name]: Toast
    },
    props: {
        matchInfo: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        ...mapState('user', ['token']),
        date () {
            return dayjs(this.matchInfo.matchTime).format('YYYY-MM-DD')
        },
        time () {
            return dayjs(this.matchInfo.matchTime).format('HH:mm')
        },
        isSubscribed () {
            return this.matchInfo.appointment * 1 === 1
        },
        subscribeString () {
            return this.isSubscribed ? '已预约' : '预约'
        }
    },
    methods: {
        async subscribeMatch () {
            if (!getToken()) {
                this.$store.commit('commonData/SET', {
                    loginDialogUrl: this.pathUrl
                })
                this.openLoginDialog()
                return
            }
            try {
                const { code, msg } = await addSubscribeMatch(this.matchInfo.matchId, this.matchInfo.leagueType)
                if (code === statusCode.success) {
                }
                Toast(msg)
            } catch (e) {
                console.log('出错了')
            } finally {
                this.$emit('updateList')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.live-other-item{
    display: flex;
    align-items: center;
    padding: 10px 6px;
    background-color: #30366A ;
    .live-left{
        width: calc(100% - 50px);
        .live-time{
            text-align: left;
        }
        .live-info{
            margin-top: 5px;
            .team-pic{
                width: 20px;
                height: 20px;
                vertical-align: middle;
                background-color: #C9CFED;
            }
            .vs {
                width: 30px;
            }
            .team {
                width: calc(50% - 15px);
            }
        }
    }
    .live-right{
        width: 50px;
        line-height: 23px;
        border-radius: 3px;
        background-color: #00E1FD;
        span{
            color: #0E0E23;
            border-radius: 3px;
        }
        &.is-subscribed {
            border: 1px solid #00E1FD;
            background-color: transparent;
            font-weight: 300;
            span {
                color: #00E1FD;
            }
        }
    }
}
</style>
