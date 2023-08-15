<template>
    <div class="page">
        <van-form class="p-l-15 p-r-15">
            <div class="section p-l-10 p-r-10 p-t-15 ">
                <div class="row border-bottom p-b-10 flex align-center ">
                    <span class="font-14 label font-400 text-white">主播赛事：</span>
                    <div class="content m-l-15 flex-1">
                        <span
                            v-for="league in leagueTypes"
                            :key="league.ids"
                            class="d-inline-block m-r-5 text-center radio-btn"
                            @click="setLeague(league)"
                            :class="{
                                'is-active': league.id === currentLeague
                            }">{{  league.label  }}</span>
                    </div>
                </div>
                <div class="row p-b-10 p-t-10 flex align-center ">
                    <span class="font-14 label font-400 text-white">主播经验：</span>
                    <div class="content m-l-15 flex-1">
                        <v-select
                        :options="experiences"
                        v-model="experice"
                        :reduce="item => item.id"
                        label="title" />
                    </div>

                </div>
            </div>
            <div class="m-t-15">
                <div class="row flex align-center">
                    <span class="font-14 label font-400 text-white">联系方式：</span>
                    <div class="flex-1">
                        <van-radio-group v-model="contactType">
                            <van-radio class="m-l-15" :name="1" icon-size="15px" checked-color="#FBA187">QQ</van-radio>
                            <van-radio class="m-l-15" :name="2" icon-size="15px" checked-color="#FBA187">微信</van-radio>
                            <van-radio class="m-l-15" :name="3" icon-size="15px" checked-color="#FBA187">电话</van-radio>
                        </van-radio-group>
                    </div>
                </div>
                <div class="contact-value m-t-10">
                    <van-field v-model="form.contactValue.value" placeholder="请输入QQ号码/微信号/电话号码" />
                </div>
            </div>
            <div class="m-t-15 description">
                <div class="">
                    <span class="font-14 label font-400 text-white">个人简介：</span>
                </div>
                <div class="m-t-10">
                    <van-field
                        v-model="form.description.value"
                        rows="6"
                        type="textarea"
                        :placeholder=" `1.主播经验几年 \n2.在那些平台直播过 \n3.获得过什么荣誉 \n4.擅长什么类型赛事`"
                        show-word-limit
                    />
                </div>
            </div>
            <!-- 暂时取消手机验证码 -->
            <!-- <div class="form-rows">
                <input-with-icon
                    class="m-t-10"
                >
                    <span class="font-14 text-white font-400" slot="icon">+86</span>
                    <van-field
                        class="p-l-10 p-r-25 text-color"
                        v-model="form.account.value"
                        maxlength="11"
                        placeholder="请输入手机号"
                    />
                </input-with-icon>
                <input-with-icon  :has-suffix="true"
                    class="m-t-10"
                >
                    <van-field
                        v-model="form.code.value"
                        name="验证码"
                        placeholder="请输入验证码"
                    />
                    <template slot="suffix">
                        <span class="font-13 text-white font-regular" @click="getCode">{{ codeString }}</span>
                    </template>
                </input-with-icon>
            </div> -->
            <div class="row procotol m-t-15 flex align-center">
                <van-checkbox v-model="agreeUs"  icon-size="15px" shape="square" checked-color="#FBA187 ">
                    <span class="font-12 protocol-label" @click.prevent="goToHelpCenter">播球直播协议</span>
                </van-checkbox>
            </div>
        </van-form>
        <div  class="p-t-30 p-b-20 w-100 text-center">
            <span class="next-step d-inline-block text-center " @click="submit">提交</span>
        </div>
    </div>
</template>

<script>
import vSelect from 'vue-select'
import { Form, RadioGroup, Radio, Field, Toast, Checkbox } from 'vant'
// import InputWithIcon from '@/views/User/Components/InputWithIcon'
import 'vue-select/dist/vue-select.css'
import { getCode, applyAnchor } from '@/api/user'
import { isRequire } from '@/utils/validator'
import { statusCode } from '@/utils/statusCode'
export default {
    name: 'ApplyHostInfo',
    components: {
        [Form.name]: Form,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [Field.name]: Field,
        [Checkbox.name]: Checkbox,
        // InputWithIcon,
        vSelect
    },
    data () {
        return {
            currentLeague: 1,
            leagueTypes: [
                {
                    id: 1,
                    label: '足球'
                },
                {
                    id: 2,
                    label: '篮球'
                },
                {
                    id: 3,
                    label: '电竞'
                },
                {
                    id: 4,
                    label: '其他'
                }
            ],
            experice: 1,
            experiences: [
                {
                    id: 1,
                    title: '一个月'
                },
                {
                    id: 2,
                    title: '三个月'
                },
                {
                    id: 3,
                    title: '一年'
                },
                {
                    id: 4,
                    title: '两年'
                },
                {
                    id: 5,
                    title: '五年'
                },
                {
                    id: 6,
                    title: '五年以上'
                }
            ],
            contactType: 1,
            form: {
                description: {
                    value: '',
                    validator: [isRequire('个人简介')]
                },
                contactValue: {
                    value: '',
                    validator: [isRequire('联系方式')]
                }
                // account: {
                //     value: '',
                //     validator: [isRequire('手机号'), phone]
                // },
                // code: {
                //     value: '',
                //     validator: [isRequire('验证码')]
                // }
            },
            timeLeft: process.env.VUE_APP_CODE_TIME,
            canNotSend: false, // 是否为发送验证码
            timer: null,
            errorInfo: {

            },
            errorKeys: ['contactValue', 'description', 'account', 'code'],
            agreeUs: true
        }
    },
    computed: {
        codeString () {
            return this.canNotSend ? `${this.timeLeft}s` : '获取验证码'
        }
    },
    methods: {
        setLeague (league) {
            this.currentLeague = league.id
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
        validateRow (key) {
            let flag = true
            this.form[key].validator.forEach(validator => {
                const { message } = validator(this.form[key].value)
                if (message) {
                    this.errorInfo[key] = message
                    flag = false
                } else {
                    this.errorInfo[key] = ''
                }
            })
            return flag
        },
        async getCode () {
            if (this.canNotSend) {
                return
            }
            const isOk = this.validateRow('account')
            if (isOk) {
                this.beginTimer()
                try {
                    const { code, msg } = await getCode({
                        mobile: this.form.account.value,
                        msType: 4
                    })
                    if (code === statusCode.success) {
                        // 只是验证码完成了
                    } else {
                        Toast.fail(msg)
                    }
                } catch (e) {
                    console.log('出错了')
                }
            } else {
                Toast.fail('手机号格式错误')
            }
        },
        goToHelpCenter () {
            this.$router.push({
                name: 'Protocol'
            })
        },
        validateForm () {
            // 分别校验 三个值
            const res = []
            Object.keys(this.form).forEach(key => {
                res.push(this.validateRow(key))
            })
            return res.every(x => x)
        },
        async submit () {
            const isValidate = this.validateForm()
            if (isValidate) {
                if (this.agreeUs) {
                    // 同意
                    const params = this.finalData()
                    const { code, data, msg } = await applyAnchor(params)
                    console.log(code, data, 'asdfasdf')
                    if (code === statusCode.success) {
                        this.$emit('changeStatus', 3)
                        Toast.success(msg)
                    } else {
                        Toast.fail(msg)
                    }
                } else {
                    Toast.fail('提交前查看播球协议！')
                }
            } else {
                let show = false
                this.errorKeys.forEach(key => {
                    if (this.errorInfo[key] && !show) {
                        show = true
                        Toast.fail(this.errorInfo[key])
                    }
                })
            }
        },
        finalData () {
            return {
                leagueType: this.currentLeague,
                contact: this.contactType,
                contactValue: this.form.contactValue.value,
                description: this.form.description.value,
                // code: this.form.code.value,
                experience: this.experice
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.row {
    .label {
        width: 70px;
    }

}
.border-bottom {
    border-bottom: 1px solid #2F3568;
}
.section {
    background: #161C4F;
    border-radius: 10px;
}
.contact-value {
    background: #161C4F;
    border-radius: 24px;
}
.radio-btn {
    width: 55px;
    height: 25px;
    background: #30366A;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 25px;
    color: #6C73AF;
    &.is-active {
        background-color: #FBA187;
        color: #fff;
    }
}

.form-rows {
    .row {
        background-color: #161C4F;
    }
}
.protocol-label {
    color: #3DB1FB;
}
.next-step {
    width: 290px;
    height: 40px;
    background: #FBA187;
    border-radius: 19px;
    line-height: 40px;
    color:#fff;
}
::v-deep {
    .vs__dropdown-toggle {
        background-color: #6C73AF;
    }
    .vs__dropdown-menu {
        background-color: #30366A;
        color: #fff;
    }
    .vs__selected, .vs__search, .vs__search:focus{
        color: #fff;
    }
    .van-radio__label{
        color: #fff;
        font-size: 12px;
        font-weight: 400;
    }
    .van-radio-group {
        display: flex;
        align-items: center;
    }
    .van-cell.van-field {
        background-color: #161C4F!important;
        border-radius: 10px;
        .van-field__control{
            color:#fff!important;
        }
    }
    .van-field__body{
        input::-webkit-input-placeholder,textarea::-webkit-input-placeholder{
            color: #6C73AF;
        }
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
    }
}
</style>
