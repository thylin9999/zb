<template>
<div class="settings bg-gray h-100">
    <van-nav-bar
        title="申请专家"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="apply">
        <div class="icons p-t-25 p-b-20 p-l-20 p-r-20 flex align-center justify-around">
            <span
                v-for="step in steps"
                :key="step.id"
            >
                <IconPng :icon="step.id === currentStep ?  `${step.icon}_h` : step.icon" :width="35" :height="25" />
            </span>
        </div>
        <div class="step">
            <IdCard
                v-if="currentStep===1"
                :apply-info="applyInfo"
                :isConfirmed="isConfirmed"
                @changeStatus="changeStatus"
            />
            <ApplyExpertInfo
                v-if="currentStep===2"
                @refresh="refresh"
            />
            <ApplyResult
                :is-anchor="false"
                :apply-info="appliedInfo"
                v-if="currentStep===3"
                @applyAgain="applyAgain"
            />
        </div>
    </div>
</div>
</template>

<script>
import { NavBar, Toast } from 'vant'
import IdCard from './Authentication/IdCard.vue'
import ApplyExpertInfo from './ApplyInfo/Expert.vue'
import IconPng from '@/components/IconPng'
import { getApplyResult, getApplyStatus } from '@/api/user/index'
import { statusCode } from '../../utils/statusCode'
import ApplyResult from './Authentication/ApplyResult.vue'
export default {
    name: 'ApplyExpert',
    components: {
        [NavBar.name]: NavBar,
        [Toast.name]: Toast,
        IconPng,
        ApplyExpertInfo,
        IdCard,
        ApplyResult
    },
    data () {
        return {
            currentStep: null,
            steps: [
                {
                    id: 1,
                    icon: 'my/apply/id'
                },
                {
                    id: 2,
                    icon: 'my/apply/info'
                },
                {
                    id: 3,
                    icon: 'my/apply/result'
                }
            ],
            applyInfo: {},
            appliedInfo: {}, // 申请信息
            isConfirmed: false, // 是否已经认证
            isApplied: false// 是否已经申请
        }
    },
    created () {
        this.init()
    },
    methods: {
        async init () {
            // Toast.loading()
            this.$showLoading()
            try {
                const { code, data } = await getApplyResult()
                // 未通过认证，那么就需要认证
                if (code === statusCode.success) {
                    // 200 表示申请了，不代表认真通过了
                    if (!data) {
                        this.currentStep = 1
                        // Toast.clear()
                        this.$hideLoading()
                    } else {
                        this.handleData(data)
                    }
                } else if (code === 6004) {
                    // 未申请实名认证，需先申请
                    this.currentStep = 1
                    // 第一步提交需要状态status，status=2未申请，status=1通过，status=3未通过
                    this.applyInfo.status = 2
                    // Toast.clear()
                    this.$hideLoading()
                }
            } catch (e) {
                console.log('出错了', e)
            }
        },
        handleData (data) {
            // 验证过身份了
            if (data.status === 3) {
                // 审核中
                this.applyInfo = data
                // this.currentStep = this.currentStep || 1
                this.currentStep = 3 // 提交了身份信息，处于审核状态，跳转第三步显示审核状态
                this.appliedInfo = data
                // Toast.clear()
                this.$hideLoading()
            } else if (data.status === 1) {
                // 通过
                this.isConfirmed = true
                this.applyInfo = data
                // 在这里去查询是否填写了下一步的申请信息
                this.getApplyStatus()
            } else {
                // 2 认真失败，查看原因
                this.currentStep = 3
                this.appliedInfo = data
                // Toast.clear()
                this.$hideLoading()
            }
        },
        async getApplyStatus () {
            try {
                const { code, data } = await getApplyStatus(2)
                if (code === 6004) {
                    // 实名验证通过，去第一步（只能查看，不能编辑）
                    this.currentStep = 1
                } else if (code === statusCode.success) {
                    this.isApplied = true
                    this.appliedInfo = data
                    // status是否通过审核 1是 2否 3审核中
                    // 审核中和失败都去3， 查看结果
                    this.currentStep = 3
                }
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                // Toast.clear()
                this.$hideLoading()
            }
        },
        onClickLeft () {
            this.$router.go(-1)
        },
        changeStatus (step) {
            // 进行下一步
            this.currentStep = step
        },
        applyAgain () {
            // this.currentTab = 2
            if (this.isConfirmed) { // 通过了身份验证
                this.applyInfo.status = 1
            } else { // 身份验证未通过
                this.applyInfo.status = 2
            }
            this.currentStep = 1
        },
        refresh () {
            this.init()
        }
    }
}

</script>

<style lang="scss" scoped>
.apply{
    height: calc(100vh - 107px);
    overflow: hidden;
}
.step {
    height: calc(100vh - 120px);
}
</style>
