<template>
<span class="button d-inline-block font-12 font-500 font-medium text-center " :class="{
    'is-subscribe': isSubscribe
}">{{ title }}</span>
</template>

<script>
export default {
    name: 'SubscribeButton',
    props: {
        isSubscribe: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        title () {
            return this.isSubscribe ? '已预约' : '预约'
        }
    }
}
</script>

<style lang="scss" scoped>
.button {
    width: 55px;
    height: 25px;
    line-height: 25px;
    background-color: #4164FF;
    box-shadow: inset 0 0 2px 0 rgba(0,0,0,0.29);
    border-radius: 3px;
    color: #fff;
    &.is-subscribe {
        background-color: transparent;
        border: 1px solid #4164FF;
        color: #4164FF;
    }
}
</style>
