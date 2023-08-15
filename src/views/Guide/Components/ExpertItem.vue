<template>
    <div class="item">
        <div class="logo">
            <img :src="item.avatar ? item.avatar : userEmptyImg" alt="">
        </div>
        <div class="name text-overflow-hidden">
            {{ item.nickname }}
        </div>
        <div class="desc text-overflow-hidden">
            {{ item.profession }}
        </div>
  </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => ({})
        }
    }
}
</script>

<style lang="scss" scoped>
.item{
    width: 60px;
    text-align: center;
    margin: auto; // 配合父组件使用grid布局
    .logo{
        border: 1px solid #E2A77C;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
    }
    .name{
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 17px;
    }
    .desc{
        font-size: 8px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 11px;
        transform: scale(0.9);
    }
}
</style>
