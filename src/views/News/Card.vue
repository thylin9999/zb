<template>
    <div class="card flex align-center justify-between p-10">
        <div class="left flex  flex-column">
            <div class="title text-white text-overflow-hidden">{{  info.title }}</div>
            <div class="time m-t-5 text-primary font-12 font-400 ">
                {{  info.update_time }}
            </div>
        </div>
        <div class="right overflow-hidden">
            <img class="w-100 h-100" :src="info.cover" alt="">
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewsCard',
    props: {
        info: {
            type: Object,
            default: () => ({})
        }
    },
    created () {

    }
}

</script>

<style lang="scss" scoped>
.card {
    width: 345px;
    height: 90px;
    margin: 0 auto;
    background: #161C4F;
    border-radius: 10px;
}
.left {
    .title {
        height: 40px;
        line-height: 20px;
        width: 200px;
    }
}
.right {
    width: 110px;
    height: 65px;
    border-radius: 2px;
}
</style>
