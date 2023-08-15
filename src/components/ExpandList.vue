<template>
<div class="box van-overflow-hidden" :class="{ 'is-expand': isExpand }">
    <div class="header flex align-center justify-between" @click="changeStatus">
        <slot name="header" />
        <van-icon class="m-r-20" color="#999999" :name="isExpand ? 'arrow-down' : 'arrow'" />
    </div>
    <div class="content">
        <slot name="content" />
    </div>
</div>
</template>

<script>
import { Icon } from 'vant'

export default {
    name: 'ExpandList',
    components: {
        [Icon.name]: Icon
    },
    data () {
        return {
            isExpand: true
        }
    },
    methods: {
        changeStatus () {
            this.isExpand = !this.isExpand
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    height: 44px;
    transition: .3s ease;
    &.is-expand {
        height: auto;
    }
}
.header {
    height: 44px;
}
</style>
