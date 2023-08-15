<template>
    <div class="w-100 h-100 page">
        <div class=" flex align-center flex-column">
            <div class="result-btn p-relative">
                <div class="content "
                    :class="{
                        'circle-repeat': isGoing
                    }"
                >
                    <img :src="logo" alt="">
                </div>
                <span v-if="isGoing" class="font-20 text-white is-abroving font-500 p-absolute">审核中</span>
            </div>
            <span class="text-white m-t-20 font-20 font-500">{{  label  }}</span>
        </div>
        <div class="m-auto flex flex-column align-center">
          <template v-if="isSuccess">
            <span class="m-t-5 font-14 text-white font-400">{{ successLabel }}</span>
            <span
                class="btn pointer m-t-30 d-inline-block text-center"
                @click="deliverySolution"
            >{{ isAnchor ? '立即开播' : '发布方案'}}</span>
          </template>
          <template v-if="isFail">
            <div class="font-14 text-white font-400">
              <span>未通过原因：</span>
              <span>{{ applyInfo.reason }}</span>
            </div>
            <span
                class="btn pointer is-fail m-t-30 d-inline-block text-center"
                @click="applyAgain"
            >重新申请</span>
          </template>
        </div>
        <slot />
    </div>
</template>

<script>

export default {
    name: 'v2',
    props: {
        applyInfo: {
            type: Object,
            default: () => ({})
        },
        isAnchor: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            status: 3
        }
    },
    watch: {
        applyInfo: {
            handler () {
                this.changeStatus()
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        isGoingLogo () {
            return require('../../../assets/images/my/apply/going.png')
        },
        isSuccessLogo () {
            return require('../../../assets/images/my/apply/success.png')
        },
        isFailLogo () {
            return require('../../../assets/images/my/apply/fail.png')
        },
        logo () {
            return this.isGoing
                ? this.isGoingLogo
                : (this.isSuccess
                    ? this.isSuccessLogo
                    : this.isFailLogo
                )
        },
        label () {
            return this.isGoing
                ? '请耐心等待，正在审核中'
                : (this.isSuccess
                    ? '审核通过'
                    : '审核未通过'
                )
        },
        isGoing () {
            return this.status === 3
        },
        isFail () {
            return this.status === 2
        },
        isSuccess () {
            return this.status === 1
        },
        successLabel () {
            return this.isAnchor ? '恭喜您成为播球一名主播；请开启你的直播之旅吧' : '恭喜您成为播球专家，快去展示你的风采吧！'
        }
    },
    methods: {
        changeStatus () {
            this.status = this.applyInfo.status
        },
        applyAgain () {
            this.$emit('applyAgain')
        },
        deliverySolution () { // 发布方案
            this.openDownloadDialog()
        }
    }
}

</script>

<style lang="scss" scoped>
.page{
    padding-top: 130px;
}
.content {
    transform-origin: center;
}
img {
    width: 135px;
    height: 135px;
}

.btn {
  border-radius: 20px;
  width: 290px;
  height: 40px;
  line-height: 40px;
  background-color: #FBA187;
  color: #fff;
  &.is-fail {
    background-color: #30366A;
  }
}
.is-abroving {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
