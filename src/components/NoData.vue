<template>
<div class="text-center">
    <div class="no-data bg-center bg-no-repeat" :style="style">
    </div>
    <span class="font-14 font-regular ">暂无数据</span>
</div>
</template>

<script>
export default {
    name: 'NoData',
    props: {
        width: {
            type: Number,
            default: 240
        },
        height: {
            type: Number,
            default: 230
        }
    },
    computed: {
        style () {
            return {
                width: this.width / 375 * 100 + 'vw',
                height: this.height / 375 * 100 + 'vw'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.no-data {
    // width: 240px;
    // height: 230px;
    background-image: url('../assets/images/notFound.png');
    background-size: 100% 100%;
}
span {
    color: #6C73AF;
}
</style>
