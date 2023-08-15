<template>
    <van-dialog
        v-model="show"
        :show-confirm-button="false"
        close-on-click-overlay
        :width="260"
        @closed="closed"
        className="login-dialog">
        <div class="box bg-center bg-no-repeat bg-size-100 p-t-30 p-b-15 p-l-20 p-r-20">
            <p class="font-14 text-center font-400 font-medium title">您暂未登录，请先登录</p>
            <div class="buttons m-t-20 font-12 font-medium font-500 text-color flex align-center flex-column justify-between">
                <span class="d-inline-block text-center confirm" @click="goToLogin">去登录</span>
                <span class="d-inline-block m-t-10 text-primary text-center" @click="closed">取消</span>
            </div>
        </div>
    </van-dialog>
</template>

<script>
import { Dialog, Icon } from 'vant'
import { mapState } from 'vuex'
export default {
    name: 'GoToLogin',
    components: {
        [Dialog.Component.name]: Dialog.Component,
        [Icon.name]: Icon
    },
    inject: ['reloadPage'],
    data () {
        return {
            show: false
        }
    },
    computed: {
        ...mapState('commonData', ['showLoginDialog', 'loginDialogUrl'])
    },
    watch: {
        showLoginDialog: {
            handler () {
                this.show = this.showLoginDialog
            }
        }
    },
    methods: {
        closed () {
            // this.reloadPage()
            this.closeLoginDialog()
        },
        goToLogin () {
            this.$router.replace({
                path: '/user/login',
                query: {
                    redirect: this.loginDialogUrl
                }
            })
            this.$store.commit('commonData/SET', {
                loginDialogUrl: '/' // 跳转完后改为默认值
            })
            this.closeLoginDialog()
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    background-image: url('../assets/images/common/login-dialog.png');
    .title {
        line-height: 20px;
        color: #999;
    }
    .buttons {
        span {
            width: 160px;
            height: 35px;
            line-height: 35px;
            border-radius: 18px;
        }
        .confirm{
            background: linear-gradient(to right, #fdeede, #e3ac83);
        }
    }
}

</style>
