<template>
<div class="about-index bg-gray h-100">
    <van-nav-bar
        title="关于我们"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="content">
        <div class="logo-with-version m-b-5 w-100 bg-center bg-no-repeat ">

        </div>
        <div class="items">
            <van-cell  center title="用户服务协议" @click="goToProtocol" is-link/>
            <van-cell  center title="隐私政策" @click="goToPolicy" is-link/>
        </div>
    </div>
</div>
</template>

<script>
import { NavBar, Cell } from 'vant'
export default {
    name: 'Index',
    components: {
        [NavBar.name]: NavBar,
        [Cell.name]: Cell
    },
    methods: {
        onClickLeft () {
            this.$router.go(-1)
        },
        goToProtocol () {
            this.$router.push({
                name: 'Protocol'
            })
        },
        goToPolicy () {
            this.$router.push({
                name: 'Policy'
            })
        }
    }
}
</script>

<style lnag="scss" scoped>
.items {
    background-color: #161C4F;
}
.logo-with-version {
    height: 200px;
    background-image: url('../../assets/images/my/app-logo.png');
    background-size: 80px 80px;
    background-color: #161C4F;
}
</style>
