<template>
<div class="box">
    <img :src="loginUrl" alt="">
    <div class="button w-100 m-t-15 font-medium font-500 text-color font-16 text-center" @click="goToLogin">去登录</div>
</div>
</template>

<script>
export default {
    name: 'NotLogin',
    props: {
        redirect: {
            type: String,
            default: null
        }
    },
    data () {
        return {
            loginUrl: require('../assets/images/common/login-bg.png')
        }
    },
    computed: {
        pathUrl () { // 返回时
            return this.redirect
        }
    },
    methods: {
        goToLogin () {
            this.$router.push({
                path: '/user/login',
                query: {
                    redirect: this.pathUrl
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    width: 175px;
    img {
        width: 100%;
    }
    .button {
        line-height: 38px;
        height: 38px;
        background: #75A6FB;
        border-radius: 3px;
    }
}
</style>
