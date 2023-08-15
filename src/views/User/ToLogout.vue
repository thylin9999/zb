<template>
    <div class="to-logout">
        <div class="l-title">
            注销账号
            <img src="../../assets/images/tologout/back.png" alt="" @click="back">
        </div>
        <div class="l-body">
            <div class="b-title">
                <img src="../../assets/images/tologout/step1-a.png" alt="" v-show="step === 1">
                <img src="../../assets/images/tologout/step1.png" alt="" v-show="step !== 1">
                <img src="../../assets/images/tologout/step2-a.png" alt="" v-show="step === 2">
                <img src="../../assets/images/tologout/step2.png" alt="" v-show="step !== 2">
                <img src="../../assets/images/tologout/step3-a.png" alt="" v-show="step === 3">
                <img src="../../assets/images/tologout/step3.png" alt="" v-show="step !== 3">
            </div>
            <!-- 第一步 -->
            <div class="b-content" v-if="step === 1">
                <p class="m-b-5">确认信息</p>
                <p>1. 你的账号和基本信息（手机等）、实名认证、银行信息、身份证登身份信息将被清空且无法恢复。</p>
                <p>2. 你的账号绑定的社交账号信息：QQ、微信，将被解除且无法恢复。</p>
                <p class="m-b-10">3. 你的直播间将被关闭且无法恢复。</p>
                <div class="users">
                    <p class="m-b-10">您要注销的账号</p>
                    <div class="user-info">
                        <img :src="userInfo.avatar" alt="">
                        <div>
                            <p class="name">{{ userInfo.nickname }}</p>
                            <p class="id">ID：{{ userInfo.member_id }}</p>
                        </div>
                    </div>
                </div>
                <button @click="next(2)">下一步</button>
            </div>
            <!-- 第二步 -->
            <div class="b-content" v-if="step === 2">
                <p>注销原因</p>
                <textarea cols="50" rows="10" placeholder="请输入您注销的原因" v-model="text"></textarea>
                <button @click="next(3)">下一步</button>
            </div>
            <!-- 第三步 -->
            <div class="b-content" v-if="step === 3">
                <div class="step3">
                    <span>验证方式</span>
                    <span class="color">手机验证 ({{hidMobile}})</span>
                </div>
                <div class="step3">
                    <input type="text" placeholder="请输入验证码" v-model="code">
                    <span class="yzm" @click="getBeforeCodeData" v-if="outTime === 60">获取验证吗</span>
                    <span v-else> {{ outTime }}s</span>
                </div>
                <button @click="submit">确认注销</button>
            </div>
        </div>
        <!-- 易盾 -->
        <div id="captcha"></div>
    </div>
</template>

<script>
import { getCode, toLogout } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import { Toast } from 'vant'
import { getItem, removeSessionStorageItem, removeToken } from '@/utils/cookie'
import { initNECaptcha } from '@/utils/NECaptcha.js'
export default {
    components: {
        [Toast.name]: Toast
    },
    data () {
        return {
            step: 1,
            text: '',
            mobile: '17823267575',
            outTime: 60,
            code: '',
            captchaIns: null // 易盾
        }
    },
    computed: {
        userInfo () {
            return JSON.parse(getItem('userInfo'))
        },
        hidMobile () {
            return this.userInfo.mobile && this.userInfo.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
        }
    },
    mounted () {
        initNECaptcha(this) // 易盾
    },
    methods: {
        getBeforeCodeData () { // 易盾验证
            this.captchaIns && this.captchaIns.verify()
        },
        async getValidateCode (validate) {
            const jsonData = {
                mobile: this.userInfo.mobile,
                msType: 3,
                validate
            }
            const data = await getCode(jsonData)
            if (data.code === statusCode.success) {
                this.getOuttime()
                Toast('获取成功')
            } else {
                Toast(data.msg)
            }
        },
        // 注销
        async submit () {
            const data = await toLogout(this.code)
            if (data.code === statusCode.success) {
                // 清除当前数据
                removeSessionStorageItem('userInfo')
                removeToken()
                Toast('注销成功')
                this.$store.commit('user/SET', { token: null, nickname: null, age: null, avatar: null })
                setTimeout(() => {
                    this.$router.push('/')
                }, 2000)
            } else {
                Toast(data.msg)
            }
        },
        // 下一步
        next (step) {
            if (step === 3 && this.text === '') {
                Toast('请填写原因')
                return
            }
            this.step = step
        },
        // 返回
        back () {
            if (this.step === 3) {
                this.step = 2
            } else if (this.step === 2) {
                this.step = 1
            } else if (this.step === 1) {
                this.$router.go(-1)
            }
        },
        // 倒计时
        getOuttime () {
            const id = setInterval(() => {
                this.outTime -= 1
                if (this.outTime === 0) {
                    clearInterval(id)
                    this.outTime = 60
                }
            }, 1000)
        }
    }
}
</script>

<style lang="scss" scoped>
.to-logout{
    height: 100vh;
    width: 100%;
}
.l-title{
    width: 375px;
    height: 45px;
    line-height: 45px;
    background: linear-gradient(180deg, #651E8A 0%, #0E0E23 100%);
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    text-align: center;
    position: relative;
    img{
        width: 10px;
        height: 17px;
        position: absolute;
        top: 13px;
        left: 15px;
    }
}
.l-body{
    height: calc(100% - 121px);
    .b-title{
        width: 100%;
        height: 76px;
        background: #000000;
        display: flex;
        justify-content: space-around;
        align-items: center;
        img{
            width: 30px;
            height: 30px;
        }
    }
    .b-content{
        position: relative;
        p:first-child{
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
        }
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        background: #161C4F;
        height: 100%;
        padding: 10px 0;
        line-height: 17px;
        >p{
            padding: 0 15px;
        }
        .users{
            border-top: 3px solid #000000;
            padding:10px 15px;
            .user-info{
                display: flex;
                align-items: center;
                img{
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    margin-right: 5px;
                }
                .name{
                    font-size: 14px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #FFFFFF;
                }
                .id{
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #6C73AF;
                }
            }
        }
        button{
            width: 271px;
            height: 36px;
            background: #FBA187;
            border-radius: 18px;
            border:none;
            position: absolute;
            bottom: 80px;
            margin: 0 auto;
            left: 0;
            right: 0;
        }
        // 第二步
        textarea{
            margin:5px 15px;
            border:1px solid #6C73AF;
            background: #161C4F;
            border-radius: 10px;
            padding: 10px;
            font-size: 10px;
            color: #6C73AF;
            &::-webkit-input-placeholder{
                color: #6C73AF;
            }
        }
        // 第三步
        .step3{
            padding: 0 15px;
            height: 45px;
            line-height: 45px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #2F3568;
            position: relative;
            input{
                background: #161C4F;
                border:none;
                &::-webkit-input-placeholder{
                    color: #6C73AF;
                }
            }
            .yzm{
                position: absolute;
                right: 15px;
            }
        }
        .color{
            color: #6C73AF;
        }
    }
}
</style>
