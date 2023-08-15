<template>
    <div class="page h-100 overflow-y-auto">
        <van-form class="p-l-15 p-r-15">
            <div class="m-t-10 row-filed">
                <input-with-icon>
                    <span class="font-14 text-white font-400" slot="icon">职业：</span>
                    <van-field
                        class="p-l-10 p-r-25 text-color"
                        v-model="form.position.value"
                        placeholder="请输出职业，如民间高手，篮球大亨等…"
                    />
                </input-with-icon>
            </div>
            <div class="m-t-15">
                <span class="font-14 label font-400 text-white">主要参考：</span>
                <div class="m-t-10">
                    <span
                        v-for="refer in references"
                        :key="refer.id"
                        class="d-inline-block m-r-5 m-b-10 text-center radio-btn"
                        @click="setRefer(refer)"
                        :class="{
                            'is-active': refer.id === currentRefer
                    }">{{  refer.label  }}</span>
                </div>
            </div>

            <div class="m-t-15 description">
                <div class="">
                    <span class="font-14 label font-400 text-white">擅长比赛：</span>
                </div>
                <div class="m-t-10">
                    <van-field
                        v-model="form.goodAt.value"
                        rows="6"
                        type="textarea"
                        placeholder="请输出自己所擅长的联赛"
                        show-word-limit
                    />
                </div>
            </div>
            <div class="m-t-15 pics">
                <div class="">
                    <span class="font-14 label font-400 text-white">附加图片：</span>
                </div>
                <div class="m-t-10 section p-t-10 p-b-10 p-l-10 p-r-10">
                    <div class="imgs m-b-5 w-100 flex align-center">
                        <UploadFiles  :fileList.sync="imgs" />
                    </div>
                    <span class="font-12 font-400 text-white">说明：非必填，最多上传3张，上传您的线下实单或在其他平台推荐经历
证明，有助于提高您的过审几率</span>
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
        <div  class="p-t-30 p-b-30 w-100 text-center">
            <span class="next-step d-inline-block text-center " @click="submit">提交</span>
        </div>
    </div>
</template>

<script>
import { Form, RadioGroup, Radio, Field, Toast, Checkbox, Uploader } from 'vant'
import InputWithIcon from '@/views/User/Components/InputWithIcon'
import { getCode, applyExpert } from '../../../api/user'
import { isRequire } from '@/utils/validator'
import { statusCode } from '../../../utils/statusCode'
import UploadFiles from '../Authentication/UploadFiles.vue'
export default {
    name: 'ApplyExpertInfo',
    components: {
        [Form.name]: Form,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [Field.name]: Field,
        [Checkbox.name]: Checkbox,
        [Uploader.name]: Uploader,
        UploadFiles,
        InputWithIcon
    },
    data () {
        return {
            imgs: [],
            currentRefer: 1,
            references: [
                {
                    id: 1,
                    label: '欧盘'
                },
                {
                    id: 2,
                    label: '亚盘'
                },
                {
                    id: 3,
                    label: '历史交战'
                },
                {
                    id: 4,
                    label: '赛前信息'
                },
                {
                    id: 5,
                    label: '近期状态'
                },
                {
                    id: 6,
                    label: '球队打法'
                },
                {
                    id: 7,
                    label: '其他'
                }
            ],
            form: {
                position: {
                    value: '',
                    validator: [isRequire('职业')]
                },
                goodAt: {
                    value: '',
                    validator: [isRequire('擅长比赛')]
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
            errorKeys: ['position', 'goodAt', 'account', 'code'],
            agreeUs: true,
            maxSize: null

        }
    },
    computed: {
        codeString () {
            return this.canNotSend ? `${this.timeLeft}s` : '获取验证码'
        }
    },
    methods: {
        setRefer (refer) {
            this.currentRefer = refer.id
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
                    const { code, data, msg } = await applyExpert(params)
                    console.log(code, data, 'asdfasdf')
                    if (code === statusCode.success) {
                        this.$emit('refresh')
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
                profession: this.form.position.value,
                reference: this.currentRefer,
                goodAt: this.form.goodAt.value,
                imgs: this.imgs
                // code: this.form.code.value
            }
        },
        addFile (file) {
            this.imgs.push(file)
        }
    }
}

</script>

<style lang="scss" scoped>
.page {
    background-color: #0E0E23;
}
.row {
    .label {
        width: 70px;
    }
}
.section {
    background: #161C4F;
    border-radius: 10px;
}

.form-rows, .row-filed {
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

.plus {
    width: 100px;
    height: 70px;
    background-color: #6C73AF;
    background-image: url('../../../assets/images/my/apply/upload-bg.png');
    border-radius: 5px;
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

.imgs {
    .preview-image {
        width: 100px;
        height: 70px;
        margin-right: 12px;
        &:last-child {
            margin-right: 0;
        }
    }
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
    .van-uploader__wrapper {
        width: 325px!important;
        display: flex;
        align-items: center;
        .van-uploader__preview {
            margin-right: 12px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    .van-uploader__preview, .van-uploader__preview-image, .van-uploader {
        width: 100px;
        height: 70px;
    }
    .van-uploader__preview {
        margin: 0;
    }
}
</style>
