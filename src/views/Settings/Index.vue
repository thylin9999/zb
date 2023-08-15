<template>
<div class="settings bg-gray h-100">
    <van-nav-bar
        title="设置"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="box">
        <div class="m-t-5">
            <van-cell center title="密码" is-link>
                <template #default>
                    <span class="label-span text-center font-medium font-500 font-12 d-inline-block" @click="goToForgetPsd"> 修改密码</span>
                </template>
            </van-cell>
            <van-cell center title="手机号" is-link>
                <template #default>
                    <span class="label-span text-center font-medium font-500 font-12 d-inline-block" @click="goToUpdatePhone"> 换绑手机</span>
                </template>
            </van-cell>
            <van-cell @click="goToAbout(1)" center title="关于我们" is-link />
            <!-- <van-cell center title="隐私协议" is-link /> -->
            <van-cell @click="goToLogut" center title="注销账户" class="lastCell" is-link />
        </div>
        <div class="w-100 text-center m-t-30">
            <button  @click="logout">退出登录</button>
        </div>
    </div>
</div>
</template>

<script>
import { NavBar, CellGroup, Cell, Uploader, Toast, Field, Picker, Popup } from 'vant'
// import ConfirmButton from '@/components/ConfirmButton'
import { mapActions, mapState } from 'vuex'
export default {
    name: 'Index',
    components: {
        [NavBar.name]: NavBar,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Uploader.name]: Uploader,
        [Toast.name]: Toast,
        [Field.name]: Field,
        [Picker.name]: Picker,
        [Popup.name]: Popup
        // ConfirmButton
    },
    computed: {
        ...mapState('user', ['token'])
    },
    methods: {
        ...mapActions('user', ['logoutAction']),
        onClickLeft () {
            this.$router.go(-1)
        },
        goToForgetPsd () {
            if (!this.token) {
                this.openLoginDialog()
                return
            }
            this.$router.push({
                name: 'ForgetPassword'
            })
        },
        goToUpdatePhone () {
            if (!this.token) {
                this.openLoginDialog()
                return
            }
            this.$router.push({
                name: 'UpdatePhone'
            })
        },
        goToAbout (type) {
            this.$router.push({
                name: type === 1 ? 'About' : 'Policy'
            })
        },
        logout () {
            this.logoutAction()
            this.$nextTick(() => {
                this.$router.push({
                    name: 'My'
                })
            })
        },
        // 注销
        goToLogut () {
            if (!this.token) {
                this.openLoginDialog()
                return
            }
            this.$router.push({
                name: 'ToLogout'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    height: calc(100vh - 45px);
    overflow-y: auto;
    background-color: #161C4F;
    position: relative;
}
.label-span{
    width: 75px;
    line-height: 20px;
    border-radius: 10px;
    color: #B7B7B7;
}
button{
    width: 271px;
    height: 36px;
    line-height: 36px;
    background: #30366A;
    border-radius: 18px;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    bottom: 90px;
    border: none;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
}
.lastCell::before{
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 16px;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #2F3568 ;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
}
::v-deep {
    .van-cell-group {
        background-color: #161C4F;
        &::after {
            display: none;
        }
    }
    .van-cell-group__title {
        font-size: 12px;
    }
    .van-cell__title {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
    }
}
</style>
