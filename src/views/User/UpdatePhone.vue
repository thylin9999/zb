<template>
<div class="settings h-100">
    <van-nav-bar
        title="换绑手机"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="">
        <van-cell v-if="isFirst" center title="验证方式" >
            <template #right-icon>
                <span
                    class="label-span text-center text-primary font-medium font-500 font-12 d-inline-block"
                    > 手机验证（+86{{ account | showPhone }}）</span>
            </template>
        </van-cell>
        <van-field
            v-else
            v-model="form.account.value"
            name="password"
            placeholder="请输入新手机号"
        />
        <div class="row p-relative">
            <van-field
                v-model="form.code.value"
                name="code"
                placeholder="请输入验证码"
            />
            <span
                :class="{
                    'opacity-7 text-gray1': canNotSend
                }"
                class="font-12 font-500 code-string font-regular p-absolute"
                @click="getBeforeValidateCode">{{ codeString }}</span>

        </div>
        <div class="w-100 text-center m-t-30">
            <ConfirmButton class="w-50 font-16 p-t-10 p-b-10 font-medium font-500 text-color" @click.native="confirm" :title="buttonString"/>
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
import { getCode, findBackPwd, updatePhone } from '@/api/user'
import { hidePhone } from '@/utils/utils'
import { statusCode } from '@/utils/statusCode'
import { mapState, mapActions } from 'vuex'
import { initNECaptcha } from '@/utils/NECaptcha.js'
export default {
    name: 'UpdatePhone',
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
            isFirst: true,
            form: {
                account: {
                    value: '',
                    validator: [isRequire('手机号')]
                },
                code: {
                    value: '',
                    validator: [isRequire('验证码')]
                }
            },
            errorInfo: [],
            timeLeft: process.env.VUE_APP_CODE_TIME,
            canNotSend: false, // 是否为发送验证码
            timer: null,
            captchaIns: null // 易盾
        }
    },
    computed: {
        ...mapState('user', ['account']),
        codeString () {
            return this.canNotSend ? `${this.timeLeft}s` : '获取验证码'
        },
        buttonString () {
            return this.isFirst ? '下一步' : '确定换绑'
        }
    },
    mounted () {
        // 易盾
        initNECaptcha(this)
    },
    methods: {
        ...mapActions('user', ['logoutAction']),
        onClickLeft () {
            this.$router.go(-1)
        },
        confirm () {
            if (this.isFirst) {
                this.validateForm(true)
                const isOk = this.giveTips()
                if (isOk) {
                    this.validatePhone()
                }
            } else {
                this.beforeSubmit()
            }
        },
        async validatePhone () {
            try {
                const { code, msg } = await updatePhone({
                    mobile: this.isFirst ? this.account : this.form.account.value,
                    code: this.form.code.value,
                    isValidatePhone: this.isFirst
                })
                if (code === statusCode.success) {
                    this.clearForm()
                    this.initTimer()
                    if (!this.isFirst) {
                        Toast(msg)
                        this.$nextTick(() => {
                            this.logoutAction()
                            this.$router.push({
                                name: 'My'
                            })
                        })
                    }
                    this.isFirst = false
                } else {
                    Toast(msg)
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        clearForm () {
            this.form.code.value = ''
            this.form.account.value = ''
            this.errorInfo = []
        },
        beforeSubmit () {
            this.validateForm()
            const isOk = this.giveTips()
            if (isOk) {
                this.validatePhone()
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
        validateForm (ignoreAccount = false) {
            // 分别校验 三个值
            const res = []
            Object.keys(this.form).forEach(key => {
                if (ignoreAccount && key === 'account') {
                    // 不校验account
                } else {
                    res.push(this.validateRow(key))
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
                    mobile: this.isFirst ? this.account : this.form.account.value,
                    msType: 4,
                    validate // 易盾验证
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
.settings {
    background-color: #161C4F;
}
.code-string {
    right: 15px;
    top: 15px;
    color: #fff;
}
</style>
