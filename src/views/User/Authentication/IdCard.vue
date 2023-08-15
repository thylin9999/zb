<template>
    <div class="text-white">
        <p class="font-14 p-l-15 font-500">实名信息</p>
        <van-form class="p-l-15 m-t-10 p-r-15" ref="form">
            <input-with-icon
                :class="{

                }"
            >
                <span class="font-14 font-400" slot="icon">姓名：</span>
                <van-field
                    class="p-l-10 p-r-25"
                    v-model="form.account.value"
                    name="姓名"
                    :rules="[{ required: true, message: '请填写姓名' }]"
                    placeholder="请输入姓名"
                    :disabled="isConfirmed"
                />
            </input-with-icon>
            <input-with-icon
                class="m-t-15"
            >
                <span class="font-14 font-400" slot="icon">身份证：</span>
                <van-field
                    class="p-l-10 p-r-25"
                    v-model="form.card.value"
                    name="身份证"
                    :rules="[{ required: true, message: '请填写身份证' }]"
                    placeholder="请输入身份证号"
                    :disabled="isConfirmed"
                />
            </input-with-icon>
            <p class="font-14 m-t-15 m-b-15 p-l-20 font-400 text-primary">请上传与实名信息一致的身份证照片</p>
            <div class="imgs flex align-center justify-center">
                <UploadImg
                    :isConfirmed="isConfirmed"
                    label="身份证正面照"
                    :url.sync="imgs.frontImg"/>
                <UploadImg
                    :isConfirmed="isConfirmed"
                    class="m-l-20 m-r-20"
                    :url.sync="imgs.backImg"
                    label="身份证背面照"/>
                <UploadImg
                    :isConfirmed="isConfirmed"
                    label="手持正面照"
                    :url.sync="imgs.handInImg"/>
            </div>
            <div v-if="applyInfo.status !== 3" class="m-t-30 p-t-30 w-100 text-center">
                <span class="next-step d-inline-block text-center pointer " @click="submit">下一步</span>
            </div>
        </van-form>
    </div>
</template>

<script>
import InputWithIcon from '@/views/User/Components/InputWithIcon'
import { Form, Field, Uploader, Toast } from 'vant'
import UploadImg from './UploadImg.vue'
import { isRequire } from '@/utils/validator'
import { validateAuth } from '@/api/user/index'
import { statusCode } from '../../../utils/statusCode'
export default {
    name: 'IdCard',
    props: {
        applyInfo: {
            type: Object,
            default: () => ({})
        },
        isConfirmed: { // 是否已经通过实名制
            type: Boolean,
            default: false
        }
    },
    components: {
        InputWithIcon,
        [Toast.name]: Toast,
        [Field.name]: Field,
        [Form.name]: Form,
        [Uploader.name]: Uploader,
        UploadImg
    },
    data () {
        return {
            form: {
                account: {
                    value: '',
                    validators: [isRequire('姓名')]
                },
                card: {
                    value: '',
                    validators: [isRequire('身份证')]
                }
            },
            imgs: {
                frontImg: '',
                backImg: '',
                handInImg: ''
            },
            errorInfo: []
        }
    },
    computed: {
        hasImg () {
            return this.imgs.backImg && this.imgs.frontImg && this.imgs.handInImg
        }
    },
    watch: {
        applyInfo: {
            handler () {
                this.handleOriginalData()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        handleOriginalData () {
            this.$nextTick(() => {
                if (this.applyInfo.name) {
                    this.form.account.value = this.applyInfo.name
                    this.form.card.value = this.applyInfo.id_card
                    this.imgs.frontImg = this.applyInfo.id_card_front_photo
                    this.imgs.backImg = this.applyInfo.id_card_back_photo
                    this.imgs.handInImg = this.applyInfo.hand_held_id_card_photo
                }
            })
        },
        submit () {
            if (this.applyInfo.status === 2) { // 未通过审核，需要继续审核
                this.$refs.form.validate().then(async res => {
                    // 接着验证
                    if (this.hasImg) {
                        //
                        const params = this.finalData()
                        const { code, msg } = await validateAuth(params)
                        if (code === statusCode.success) {
                            Toast.success(msg)
                            // 添加成功后跳转第二步
                            this.$emit('changeStatus', 2)
                        } else {
                            Toast.fail(msg)
                        }
                    } else {
                        Toast.fail('请上传证件照片')
                    }
                }).catch(e => {
                    console.log(e, '1111111111111')
                })
            } else if (this.applyInfo.status === 1) {
                // 通过
                this.$emit('changeStatus', 2)
            } else if (this.applyInfo.status === 3) {
                // 审核中
                this.$emit('changeStatus', 3)
            }
        },
        finalData () {
            return {
                name: this.form.account.value,
                idCard: this.form.card.value,
                imgs: this.imgs
            }
        }
    }
}

</script>

<style lang="scss" scoped>
::v-deep {
    .row {
        background-color: #161C4F;
    }
}
.next-step {
    width: 290px;
    height: 40px;
    background: #FBA187;
    border-radius: 19px;
    line-height: 40px;
}
</style>
