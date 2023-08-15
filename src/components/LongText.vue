<template>
<div class="long-text w-100">
    <p class="text-overflow-hidden">{{ content ? content : '爱体育爱生活、讲球届扛把子'}}</p>
</div>
</template>

<script>
export default {
    name: 'LongText',
    props: {
        content: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.long-text{
    // overflow-x: auto;
    width: 180px;
    p {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 22px;
    }
}
</style>
