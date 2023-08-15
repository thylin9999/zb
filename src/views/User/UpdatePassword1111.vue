<template>
<div class="page h-100">
    <van-nav-bar
        title="重置密码"
        left-arrow
        @click-left="onClickLeft"
    />
    <van-form class="m-t-10">
        <van-cell center title="验证方式" >
            <template #right-icon>
                <span
                    class="label-span text-center text-primary font-medium font-500 font-12 d-inline-block"
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
                    'opacity-7 text-gray1': canNotSend
                }"
                class="font-12 font-500 code-string font-regular p-absolute"
                @click="getValidateCode">{{ codeString }}</span>

        </div>
        <!-- 通过 pattern 进行正则校验 -->
        <van-field
            v-model="form.oldPassword.value"
            name="旧密码"
            label="旧密码"
            type="password"
            placeholder="请输入旧密码"
        />
        <van-field
            v-model="form.newPassword.value"
            name="新密码"
            label="新密码"
            type="password"
            placeholder="请输入新密码"
        />
        <!-- <van-field
            v-model="form.confirmPassword.value"
            name="确认密码"
            label="确认密码"
            type="password"
            placeholder="请确认新密码"
        /> -->
        <div class="m-t-30 p-l-20 p-r-20">
            <van-button class="font-16 submit-button" block type="info" @click="beforeSubmit">确认修改</van-button>
        </div>
    </van-form>
</div>
</template>

<script>
import { NavBar, Form, Field, Button, Toast, Cell } from 'vant'
import { updatePassword, getCode } from '@/api/user'
import { isRequire } from '@/utils/validator'
import { statusCode } from '@/utils/statusCode'
import { mapState } from 'vuex'
import { hidePhone } from '@/utils/utils'
export default {
    name: 'UpdatePassword',
    filters: {
        showPhone (value) {
            return hidePhone(value)
        }
    },
    components: {
        [Cell.name]: Cell,
        [NavBar.name]: NavBar,
        [Form.name]: Form,
        [Field.name]: Field,
        [Button.name]: Button
    },
    data () {
        return {
            form: {
                oldPassword: {
                    value: '',
                    validator: [isRequire('旧密码')]
                },
                newPassword: {
                    value: '',
                    validator: [isRequire('新密码')]
                },
                // confirmPassword: {
                //     value: '',
                //     validator: [isRequire('确认密码')]
                // },
                code: {
                    value: '',
                    validator: [isRequire('验证码')]
                }
            },
            errorInfo: [],
            pattern: /\d{6}/,
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
    methods: {
        onClickLeft () {
            console.log('返回')
            this.$router.go(-1)
        },
        beforeSubmit (errorInfo) {
            this.validateForm()
            const isOk = this.giveTips()
            if (isOk) {
                this.submit()
            }
        },
        async submit () {
            // Toast.loading({
            //     duration: 0,
            //     forbidClick: true
            // })
            this.$showLoading()
            try {
                const { code, msg } = await updatePassword({
                    phone: this.account,
                    code: this.form.code.value,
                    password: this.form.newPassword.value,
                    oldPassword: this.form.oldPassword.value
                })
                // Toast.clear()
                this.$hideLoading()
                if (code === statusCode.success) {
                    // 去登录页吗？
                    this.$router.push({
                        name: 'Login'
                    })
                } else {
                    Toast(msg)
                }
                console.log(code, 'code')
            } catch (e) {
                console.log('出错了')
                // Toast.clear()
                this.$hideLoading()
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
        async getValidateCode () {
            if (this.canNotSend) {
                return
            }
            this.beginTimer()
            try {
                const { code, msg } = await getCode({
                    mobile: this.isFirst ? this.account : this.form.account.value,
                    msType: 4
                })
                if (code === statusCode.success) {
                    // 只是验证码完成了
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
@import '@/theme/default-vars.scss';
.page {
    background-color: #161C4F;
}

.code-string {
    right: 15px;
    top: 15px;
    color: #fff;
}
::v-deep {
    .van-form {
        .van-field__label {
            line-height: 40px;
            font-family: PingFang-SC-Regular;
        }
        .van-field__value{
            .van-field__body {
                line-height: 40px;
            }
        }
    }
    .van-button {
        border-radius: 8px;
        background-color: $active-color;
    }
}
</style>
