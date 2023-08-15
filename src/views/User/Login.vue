<template>
    <div class="w-100 h-100 login-box overflow-y-auto bg-center bg-no-repeat p-relative text-color">
        <span class="p-absolute close-button" @click="goBack">
            <van-icon name="arrow-left"></van-icon>
        </span>
        <div class="logo-box bg-center bg-no-repeat p-absolute"></div>
        <div class="login-section w-100 ">
            <div class="form-field font-regular">
                <van-form class="m-t-10">
                    <!-- 通过 pattern 进行正则校验 -->
                    <div class="box p-relative bg-center bg-no-repeat bg-size-100"
                        :class="{
                            'is-fast-login': isLoginMode && fastLogin,
                            'is-login': isLoginMode,
                            'is-register': isRegister && !isResetPassword,
                            'is-reset': isRegister && isResetPassword
                        }"
                    >
                        <div
                            class="tabs flex align-center text-center w-100"
                            v-if="isLoginMode"
                        >
                            <span class="flex-1 tab"
                                @click="commonLogin"
                            >极速登录</span>
                            <span class="flex-1 tab"
                                @click="passwordLogin"
                            >密码登录</span>
                        </div>
                        <div class="font-16 p-t-25 text-white font-500 text-center" v-else>
                            <span>{{ isResetPassword ? '忘记密码' : '注册'}}</span>
                        </div>
                        <input-with-icon class=" m-t-30"
                            :class="{
                                'm-b-25': !isRegister,
                                'm-b-10': isRegister,
                            }"
                        >
                            <span slot="icon" class="flex align-center">
                                <svg-icon icon-class="phone"></svg-icon>
                                <span class="m-l-10 font-13">+86</span>
                            </span>
                            <van-field
                                class="p-l-10 p-r-25 text-color"
                                v-model="form.account.value"
                                maxlength="11"
                                placeholder="请输入手机号"
                            />
                        </input-with-icon>
                        <!-- 易盾 -->
                        <div id="captcha"></div>
                        <input-with-icon v-if="showCode" :has-suffix="true"
                            :class="{
                                'm-b-25': !isRegister,
                                'm-b-10': isRegister,
                            }"
                        >
                            <svg-icon icon-class="safe" slot="icon"></svg-icon>
                            <van-field
                                class="m-l-10"
                                v-model="form.code.value"
                                name="验证码"
                                placeholder="请输入验证码"
                            />
                            <template slot="suffix">
                                <span class="font-13 font-regular" @click="getBeforeValidateCode">{{ codeString }}</span>
                            </template>
                        </input-with-icon>
                        <input-with-icon
                            v-if="!fastLogin || isResetPassword"
                            :class="{
                                'm-b-25': !isRegister,
                                'm-b-10': isRegister,
                            }"
                        >
                            <svg-icon icon-class="password" slot="icon"></svg-icon>
                            <van-field
                                class="p-l-10 p-r-25"
                                type="password"
                                v-model="form.password.value"
                                name="密码"
                                :placeholder="isResetPassword ? '请输入新密码' : '请输入密码'"
                            />
                        </input-with-icon>
                        <div
                         class="w-100 forget p-absolute text-center font-12 font-400 text-white"
                            :class="{
                                'visibility-hidden': !isLoginMode
                            }"
                         >
                            <div>
                                <span class="" @click="forgetPassword">
                                    忘记密码
                                </span>
                                |
                                <span class="" @click="fastRegister">
                                    立即注册
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="m-t-25 submit-button">
                        <van-button
                            class="font-16"
                            block type="default" round
                            @click.native="beforeSubmit">{{ buttonTitle }}</van-button>
                    </div>
                </van-form>
                <div class="protocol flex align-center m-t-25 flex-direction-c">
                    <van-checkbox v-model="agreeUs" >
                        <span class="text-999 font-12 font-400">我已阅读并同意</span>
                        <template #icon="props">
                            <img class="img-icon" :src="props.checked ? checkedLogo : checkEmpty " />
                        </template>
                    </van-checkbox>
                    <div class="font-12 font-400 link p-t-5 p-b-5">
                        <span  @click="goToProtocol">《用户协议》</span>
                        <span  @click="goToPolicy">《隐私政策》</span>
                    </div>
                </div>
                <div class="logo2  w-100 text-center">
                    <img :src="logo2" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { Form, Field, Button, Icon, Loading, Toast, Checkbox } from 'vant'
import InputWithIcon from '@/views/User/Components/InputWithIcon'
import { phone, isRequire } from '@/utils/validator'
import { statusCode } from '@/utils/statusCode'
import { getCode, findBackPwd, oneLogin } from '@/api/user'
import OneLogin from '@/utils/oneLogin'
import { setItem, setToken } from '@/utils/cookie'
import { initNECaptcha } from '@/utils/NECaptcha.js'
export default {
    name: 'Login',
    components: {
        [Icon.name]: Icon,
        [Form.name]: Form,
        [Field.name]: Field,
        [Button.name]: Button,
        [Loading.name]: Loading,
        [Toast.name]: Toast,
        [Checkbox.name]: Checkbox,
        InputWithIcon
    },
    data () {
        return {
            form: {
                account: {
                    value: '',
                    validator: [isRequire('手机号'), phone]
                },
                code: {
                    value: '',
                    validator: [isRequire('验证码')]
                },
                password: {
                    value: '',
                    validator: [isRequire('密码')]
                }
            },
            errorInfo: [],
            isRegister: false,
            showLoading: true,
            timeLeft: process.env.VUE_APP_CODE_TIME,
            canNotSend: false, // 是否为发送验证码
            timer: null,
            isResetPassword: false, // 是否为找回密码
            redirect: '/',
            agreeUs: true,
            fastLogin: true,
            onePassCode: false, // 意味着发送短信
            captchaIns: null
        }
    },
    computed: {
        ...mapState('commonData', ['loginDialogUrl']),
        codeString () {
            return this.canNotSend ? `${this.timeLeft}s` : '获取验证码'
        },
        buttonTitle () {
            return this.isResetPassword ? '立即找回' : (this.isRegister ? '立即注册' : '立即登录')
        },
        showCode () {
            return !!this.isRegister || (this.onePassCode && this.isLoginMode && this.fastLogin)
        },
        logo2 () {
            return require('../../assets/images/login/logo2.png')
        },
        isLoginMode () { // 是否为登录，否则展示注册或者 重置密码
            return !this.isRegister && !this.isResetPassword
        }
    },
    created () {
        const { redirect } = this.$route.query
        this.redirect = redirect || '/'
        OneLogin.init(this.onePass, this.onePassError)
        // 易盾
        initNECaptcha(this)
    },
    methods: {
        ...mapActions('user', ['login', 'register', 'getUserInfo']),
        ...mapMutations('user', ['SET']),
        async submit () {
            // Toast.loading({
            //     duration: 0,
            //     forbidClick: true
            // })
            this.$showLoading()
            const params = {
                account: this.form.account.value,
                code: this.form.code.value,
                password: this.form.password.value
            }
            // Toast.clear()
            this.$hideLoading()
            if (this.isResetPassword) {
                try {
                    const { code, msg } = await findBackPwd(params)
                    if (code === statusCode.success) {
                        const account = this.form.account.value
                        this.initTimer()
                        this.registerOrLogin()
                        this.form.account.value = account
                        Toast(msg)
                    } else {
                        Toast(msg)
                    }
                } catch (e) {
                    console.log('出错了')
                }
            } else {
                if (this.isRegister) {
                    try {
                        const { code, msg } = await this.register(params)
                        if (code === statusCode.success) {
                            this.loginRequest(params)
                        } else {
                            Toast(msg)
                        }
                    } catch (e) {
                        console.log('出错了')
                    }
                } else {
                    params.type = this.onePassCode ? 1 : 2 // 1手机验证码登录 2密码登录
                    // 登录
                    this.loginRequest(params)
                }
            }
        },
        async loginRequest (params) {
            try {
                const { code, msg } = await this.login(params)
                if (code === statusCode.success) {
                    // this.$router.push({ path: this.redirect })
                    this.$router.push({ path: this.loginDialogUrl })
                    this.getUserInfo() // 获取用户个人资料
                } else {
                    Toast(msg)
                    this.form.password.value = ''
                    this.form.code.value = ''
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        beforeSubmit () {
            if (this.isLoginMode && this.fastLogin && !this.onePassCode) {
                const isOk = this.validateRow('account')
                if (isOk) {
                    OneLogin.fastLogin(this.form.account.value)
                } else {
                    Toast('手机号格式错误')
                }
                return
            }
            if (!this.agreeUs) {
                Toast.fail('请同意协议和政策！')
                return
            }
            this.errorInfo = []
            this.validateForm()
            const isOk = this.giveTips()
            if (isOk) {
                this.submit()
            }
        },
        giveTips () {
            let flag = false
            if (!this.errorInfo.length) {
                flag = true
            } else {
                // 给出提示
                Toast(this.errorInfo[0])
                this.errorInfo = []
                flag = false
            }
            return flag
        },
        beginTimer () {
            if (this.canNotSend) {
                return
            }
            this.canNotSend = true
            window.clearInterval(this.timer)
            this.timer = null
            this.timeLeft = 60
            this.timer = setInterval(() => {
                if (this.timeLeft > 1) {
                    this.timeLeft--
                } else {
                    this.initTimer()
                }
            }, 1000)
        },
        // 易盾验证
        getBeforeValidateCode () {
            this.captchaIns && this.captchaIns.verify()
        },
        async getValidateCode (validate) {
            if (this.canNotSend) {
                return
            }
            const isOk = this.validateRow('account')
            if (isOk) {
                try {
                    const { code, msg } = await getCode({
                        mobile: this.form.account.value,
                        msType: this.isResetPassword ? 2 : 1,
                        validate // 易盾验证
                    })
                    if (code === statusCode.success) {
                        // 验证通过再开始倒计时
                        this.beginTimer()
                    } else {
                        Toast(msg)
                    }
                } catch (e) {
                    console.log('出错了')
                } finally {

                }
            } else {
                Toast('手机号格式错误')
            }
        },
        forgetPassword () {
            this.isRegister = true
            this.isResetPassword = true
            this.initTimer()
        },
        validateForm () {
            // 分别校验 三个值
            const res = []
            Object.keys(this.form).forEach(key => {
                if (key === 'code') {
                    if (this.isRegister && this.showCode) {
                        res.push(this.validateRow(key))
                    }
                } else if (key === 'password') {
                    if (!this.fastLogin) {
                        res.push(this.validateRow(key))
                    }
                }
            })
            return res.every(x => x)
        },
        validateRow (key) {
            let flag = true
            this.form[key].validator.forEach(validator => {
                const { message } = validator(this.form[key].value)
                if (message) {
                    this.errorInfo.push(message)
                    flag = false
                }
            })
            return flag
        },
        registerOrLogin () {
            this.isRegister = false
            this.isResetPassword = false
            this.initForm()
            this.initTimer()
        },
        fastRegister () {
            this.isRegister = true
            this.isResetPassword = false
            this.fastLogin = false
            this.initForm()
            this.initTimer()
        },
        commonLogin () {
            this.isRegister = false
            this.isResetPassword = false
            this.fastLogin = true
            this.initForm()
            this.initTimer()
        },
        async onePass (params) {
            try {
                // eslint-disable-next-line camelcase
                const { code, data, token, refresh_token, msg } = await oneLogin(params)
                if (code === statusCode.success) {
                    setToken(token)
                    const params = {
                        ...data, token, refreshToken: refresh_token
                    }
                    setItem('userInfo', JSON.stringify(params))
                    this.SET(params)
                    this.$router.push({ path: this.redirect })
                } else {
                    Toast(msg)
                }
            } catch (e) {
                console.log(e, '出错了')
            }
        },
        onePassError () {
            this.onePassCode = true
            this.getValidateCode()
        },
        passwordLogin () {
            this.fastLogin = false
            this.isRegister = false
            this.isResetPassword = false
            this.onePassCode = false
            this.initForm()
            this.initTimer()
        },
        initForm () {
            this.errorInfo = []
            Object.keys(this.form).forEach(key => {
                this.form[key].value = ''
            })
        },
        initTimer () {
            this.canNotSend = false
            window.clearInterval(this.timer)
            this.timer = null
            this.timeLeft = 60
        },
        goBack () {
            console.log(this.$route.query)
            this.$router.replace({
                path: this.$route.query.redirect ? this.$route.query.redirect : this.loginDialogUrl // 直播间进入，返回直播间
            })
        },
        goToProtocol () { // 用户协议
            this.$router.push({
                name: 'Protocol'
            })
        },
        goToPolicy () { // 隐私政策
            this.$router.push({
                name: 'Policy'
            })
        }
    },
    beforeDestroy () {
        this.initTimer()
    }
}
</script>
<style lang="scss" scoped>
.login-box {
    background-image: url('../../assets/images/login/bg.png');
    background-size: 100% 100%;
}
.close-button {
    left: 25px;
    top: 25px;
}
.logo-box {
    width: 170px;
    height: 55px;
    background-image: url('../../assets/images/login/logo.png');
    background-size: 100% 100%;
    left: 103px;
    top: 80px;
}
.login-section{
    padding-top: 165px;
    padding-left: 45px;
    padding-right: 45px;
    // min-height: 700px;
    .login-text {
        font-size: 28px;
        line-height: 40px;
    }
    .access {
        font-size: 13px;
        .link {
            color: #ECBE49;
        }
    }

    .logo2{
        // left: 0;
        // bottom: 40px;
        margin-top: 50px;
        img{
            width: 170px;
            height: 45px;
        }
    }
}

.box {
    width: 285px;
    height: 270px;
    padding: 0 25px;
    &.is-login {
        background-image: url('../../assets/images/login/register-bg.png');
    }
    &.is-fast-login {
        background-image: url('../../assets/images/login/login-bg.png');
    }

    &.is-reset, &.is-register {
        background-image: url('../../assets/images/login/forget.png');
    }
    .forget {
        left: 0;
        bottom: 20px;
    }
}
.tabs {
    line-height: 50px;
    height: 50px;
}
.protocol {
    .link {
        color: #3DB1FB;
    }
}
::v-deep {
    .close-button {
        .svg-icon {
            width: 20px;
            height: 20px;
        }
    }
    .van-form {
        .van-field {
            background-color: transparent;
            padding: 10px 0;
        }
        .van-field__control{
            color: #fff!important;
        }
        .van-field__error-message{
            position: absolute;
            left: 0;
            top: 100%;
        }
    }
    .submit-button{
        .van-button--normal{
            line-height: 50px;
            height: 50px;
            font-family: PingFang-SC-Medium;
            font-weight: 400;
            color: #fff;
            background: #FBA187;
            border-radius: 24px;
            border: none;
        }
    }
    .login-section{
        .suffix-button {
            text-align: center;
        }
    }
}
</style>

<style scoped>
@media screen and (max-width: 320px) {
    .flex-direction-c{
        flex-direction: column;
    }
}
</style>
