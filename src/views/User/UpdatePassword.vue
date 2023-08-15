<template>
<div class="settings page h-100">
    <van-nav-bar
        title="修改密码"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="">
        <van-cell center title="验证方式" >
            <template #right-icon>
                <span
                    class="label-span text-primary text-center font-medium font-500 font-12 d-inline-block"
                    > 手机验证（+86{{ account | showPhone }}）</span>
            </template>
        </van-cell>
        <div class="row p-relative">
            <van-field
                v-model="form.code.value"
                name="code"
                placeholder="请输入验证码"
            />
            <span
                :class="{
                    'opacity-7 ': canNotSend
                }"
                class="font-12 text-white font-500 code-string font-regular p-absolute"
                @click="getBeforeValidateCode">{{ codeString }}</span>

        </div>
        <van-field
            v-model="form.password.value"
            name="password"
            placeholder="请输入新密码"
        />
        <div class="w-100 text-center m-t-30">
            <ConfirmButton class="w-50 font-16 p-t-10 p-b-10 font-medium font-500 text-color" @click.native="beforeSubmit" title="确认修改"/>
        </div>
    </div>
    <!-- 易盾 -->
    <div id="captcha"></div>
</div>
</template>

<script>
import { NavBar, Cell, Field, Toast } from 'vant'
import ConfirmButton from '@/components/ConfirmButton'
import { isRequire } from '@/utils/validator'
import { getCode, findBackPwd } from '@/api/user'
import { hidePhone } from '@/utils/utils'
import { statusCode } from '@/utils/statusCode'
import { mapState } from 'vuex'
import { initNECaptcha } from '@/utils/NECaptcha.js'
export default {
    name: 'ForgetPassword',
    filters: {
        showPhone (value) {
            return hidePhone(value)
        }
    },
    components: {
        [NavBar.name]: NavBar,
        [Cell.name]: Cell,
        [Field.name]: Field,
        [Toast.name]: Toast,
        ConfirmButton
    },
    data () {
        return {
            form: {
                password: {
                    value: '',
                    validator: [isRequire('密码')]
                },
                code: {
                    value: '',
                    validator: [isRequire('验证码')]
                }
            },
            errorInfo: [],
            timeLeft: process.env.VUE_APP_CODE_TIME,
            canNotSend: false, // 是否为发送验证码
            timer: null
        }
    },
    computed: {
        ...mapState('user', ['account']),
        codeString () {
            return this.canNotSend ? `${this.timeLeft}s` : '获取验证码'
        }
    },
    mounted () {
        // 易盾
        initNECaptcha(this)
    },
    methods: {
        onClickLeft () {
            this.$router.go(-1)
        },
        beforeSubmit () {
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
        async submit () {
            try {
                const { data, code, msg } = await findBackPwd({
                    account: this.account,
                    code: this.form.code.value,
                    password: this.form.password.value
                })
                if (code === statusCode.success) {
                    this.onClickLeft()
                }
                Toast(msg)
                console.log(data, code, msg)
            } catch (e) {
                console.log('出错了')
            }
        },
        validateForm () {
            // 分别校验 三个值
            const res = []
            Object.keys(this.form).forEach(key => {
                res.push(this.validateRow(key))
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
        initTimer () {
            this.canNotSend = false
            window.clearInterval(this.timer)
            this.timer = null
            this.timeLeft = 60
        },
        // 易盾验证
        getBeforeValidateCode () {
            this.captchaIns && this.captchaIns.verify()
        },
        async getValidateCode (validate) {
            if (this.canNotSend) {
                return
            }
            try {
                const { code, msg } = await getCode({
                    mobile: this.account,
                    // mobile: 18171440571,
                    msType: 2,
                    validate
                })
                if (code === statusCode.success) {
                    // 只是验证码完成了
                    this.beginTimer()
                } else {
                    Toast(msg)
                }
            } catch (e) {
                console.log('出错了')
            } finally {

            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    background-color: #161C4F;
}
.code-string {
    right: 15px;
    top: 15px;
}
</style>
