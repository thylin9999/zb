<template>
<div class="box flex flex-column align-center p-b-15 p-t-15">
    <img :src="bgUrl" alt="">
    <span class="font-14 m-t-5 p-t-5 p-b-5 p-l-15 p-r-15 reload-button font-medium text-color" @click="refreshPage">点击重新加载</span>
</div>
</template>

<script>
export default {
    name: 'BadNetwork',
    inject: ['reloadPage'],
    data () {
        return {
            bgUrl: process.env.VUE_APP_BAD_NETWORK
        }
    },
    methods: {
        refreshPage () {
            this.reloadPage()
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    img {
        width: 243px;
        height: 173px;
    }
}
.reload-button{
    line-height: 20px;
    background: #86B2E8;
    border-radius: 16px;
}
</style>
