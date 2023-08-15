<template>
<div class="card flex bg-white justify-between align-center p-l-15 p-r-15 p-b-10 p-t-10">
    <div class="left-title h-100 flex align-center">
        <span
            class="user-icon d-inline-block bg-center bg-no-repeat p-relative"
            :style="{ 'backgroundImage': `url(${logoUrl ? logoUrl : userEmptyImg})`}"
        >
            <span v-if="isLiving" class="living font-12 p-absolute text-center">
                <span class="scale-7 m-l-5 d-inline-block w-100 h-100  font-12 font-regular font-400 text-color">直播中</span>
            </span>
        </span>
        <div class="flex flex-column m-l-10 info">
            <span class=" font-14 font-500 text-white anchor-name font-medium">{{ host.anchor_name }}</span>
            <span class="font-12 font-regular text-primary font-400 sign text-ellipsis">{{ host.sign || '--' }}</span>
        </div>
    </div>
    <div class="right-icon flex justify-center align-center">
        <van-button
            plain round type="info"
            @click="subscribe"
        >{{ host.isSubscribe ? '取消关注' : '关注'}}</van-button>
    </div>
</div>
</template>

<script>
import { Icon, Button, Toast } from 'vant'
import { subscribeHost } from '@/api/user'
import { mapState } from 'vuex'
import { statusCode } from '@/utils/statusCode'
export default {
    name: 'HostCard',
    components: {
        [Icon.name]: Icon,
        [Button.name]: Button
    },
    props: {
        host: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
        }
    },
    computed: {
        ...mapState('user', ['token']),
        logoUrl () {
            return this.host.logo ? this.host.logo : ''
        },
        isSubscribe () {
            return this.host.is_follow
        },
        isLiving () {
            return this.host.live_status === 2
        }
    },
    methods: {
        async subscribe () {
            if (!this.isSubscribe && !this.token) {
                this.$router.push({
                    name: 'Login'
                })
                return
            }
            try {
                // Toast.loading({
                //     duration: 0,
                //     forbidClick: true
                // })
                this.$showLoading()
                const { code, msg } = await subscribeHost(this.host.member_id, 1)
                if (code === statusCode.success) {
                    Toast(msg)
                    this.$emit('refresh')
                }
            } catch (e) {
                console.log('出凑了')
            } finally {
                // Toast.clear()
                this.$hideLoading()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.card {
    width: 345px;
    height: 75px;
    margin: 0 auto;
    background-color: #161C4F;
    border-radius: 10px;
    .left-title {
        width: calc(100% - 80px);
        .user-icon {
            width: 35px;
            height: 35px;
            background-size: 100% 100%;
            border-radius: 50%;
        }
        .info {
            width: calc(100% - 45px);
        }
        .living {
            width: 37px;
            height: 12px;
            line-height: 12px;
            background: #FB7674;
            border-radius: 3px;
            left: -1px;
            bottom: 0;
        }
        .sign{
            line-height: 14px;
        }
        .anchor-name {
            line-height: 20px;
        }
    }
}
::v-deep {
    .right-icon {
        .van-button {
            line-height: 22px;
            height: 22px;
            font-size: 12px;
            border-radius: 3px;
            color: #00E1FD;
            border: 1px solid #00E1FD;
            background-color: transparent;
        }
    }
    .van-button--normal{
        padding: 0 10px;
    }
}
</style>
