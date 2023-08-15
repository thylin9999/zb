<template>
    <div class="page h-100">
        <van-nav-bar
            title="偏好设置"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="body p-l-15 p-r-15">
            <van-cell class="m-t-10" center title="进球声音" v-if="!isBasketball">
                <template #right-icon>
                    <van-switch
                        @change="(value) => change('voice', value)"
                        v-model="showVoice"
                        size="24"
                        inactive-color="#30366A" active-color="#03BEDE"
                    />
                </template>
            </van-cell>
            <van-cell class="m-t-5" center title="进球动画" v-if="!isBasketball" >
                <template #right-icon>
                    <van-switch v-model="showAnimation" size="24"
                        @change="(value) => change('animation', value)"
                        inactive-color="#30366A" active-color="#03BEDE"
                    />
                </template>
            </van-cell>
            <van-cell class="m-t-5" center title="排名展示"  >
                <template #right-icon>
                    <van-switch v-model="showRanking" size="24"
                    @change="(value) => change('ranking', value)"
                    inactive-color="#30366A" active-color="#03BEDE"
                    />
                </template>
            </van-cell>
            <van-cell class="m-t-5" center title="红黄牌展示" v-if="!isBasketball" >
                <template #right-icon>
                    <van-switch v-model="showCardTip" size="24"
                    @change="(value) => change('cardTip', value)"
                    inactive-color="#30366A" active-color="#03BEDE"
                    />
                </template>
            </van-cell>
            <van-cell class="m-t-5" center title="红黄牌动画" v-if="!isBasketball" >
                <template #right-icon>
                    <van-switch v-model="showCardAnimation" size="24"
                    @change="(value) => change('cardAnimation', value)"
                    inactive-color="#30366A" active-color="#03BEDE"
                    />
                </template>
            </van-cell>
        </div>
    </div>
</template>

<script>
import { Cell, NavBar, Switch } from 'vant'
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'Settings',
    components: {
        [Switch.name]: Switch,
        [NavBar.name]: NavBar,
        [Cell.name]: Cell
    },
    props: {
        sportTabId: { // 1足球，2篮球
            type: [String, Number],
            default: null
        }
    },
    data () {
        return {
            showVoice: null,
            showAnimation: false,
            showRanking: false,
            showCardTip: false,
            showCardAnimation: false
        }
    },
    computed: {
        ...mapState('voice', ['voice', 'animation', 'ranking', 'cardTip', 'cardAnimation']),
        isBasketball () {
            return this.sportTabId === 2
        }
    },
    created () {
        this.showVoice = this.voice
        this.showAnimation = this.animation
        this.showRanking = this.ranking
        this.showCardTip = this.cardTip
        this.showCardAnimation = this.cardAnimation
    },
    methods: {
        ...mapMutations('voice', ['SET']),
        onClickLeft () {
            this.$emit('update:value', false)
        },
        change (type, value) {
            this.SET({ [type]: value })
        }
    }
}

</script>

<style lang="scss" scoped>
.page {
    background-color: #0E0E23;
    z-index: 999;
}
::v-deep {
    .van-cell {
        background-color: #161C4F!important;
        border-radius: 5px;
    }
}
</style>
