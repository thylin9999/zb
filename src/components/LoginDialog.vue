<template>
    <van-dialog
        v-model="show"
        :show-confirm-button="false"
        :width="300"
        className="download-dialog">
        <div class="box">
            <img class="img" :src="img" />
            <div class="download-text m-t-20 text-center font-18 font-medium font-500 ">
                <span class="bg d-inline-block text-color bg-size-100 bg-center bg-no-repeat" @click="goToLogin">
                </span>
            </div>
            <div class="icon-box text-center m-t-30">
                <span class="icon-bg d-inline-block pointer" @click="close">
                    <van-icon name="cross"></van-icon>
                </span>
            </div>
        </div>
    </van-dialog>
</template>

<script>
import { Dialog, Icon } from 'vant'
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'LoginDialog',
    components: {
        [Dialog.Component.name]: Dialog.Component,
        [Icon.name]: Icon
    },
    data () {
        return {
            img: require('../assets/images/login/login-tip.png'),
            show: false
        }
    },
    computed: {
        ...mapState('commonData', ['showLoginTipDialog'])
    },
    watch: {
        showLoginTipDialog: {
            handler () {
                this.show = this.showLoginTipDialog
            },
            immediate: true
        }
    },
    methods: {
        ...mapMutations('commonData', ['SET']),
        goToLogin () {
            this.close()
            this.$router.push({
                name: 'Login'
            })
        },
        close () {
            this.SET({
                showLoginTipDialog: false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    .img {
        width: 300px;
        height: 230px;
    }
    .download-text{
        height: 40px;
        line-height: 40px;
        .bg {
            width: 110px;
            height: 38px;
            background-image: url("../assets/images/login/login-now.png");
        }
    }
    .icon-box{
        .icon-bg {
            width: 27px;
            height: 27px;
            line-height: 27px;
            background-color: #D8D8D8;
            border-radius: 50%;
            font-size: 14px;
        }
    }
}
</style>
