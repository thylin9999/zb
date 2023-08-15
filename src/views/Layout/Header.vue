<template>
    <div class="containe">
        <div class=" header flex justify-between align-center p-l-10 p-r-10  bg-center bg-no-repeat bg-size-100">
            <a href="javascript:void(0);"  @click="goDownApp">
                <img src="../../assets/images/header/new-title.png" alt="" class="title">
            </a>
            <a href="javascript:void(0);" @click="goDownApp" >
                <img src="../../assets/images/header/down-btn.png" alt="" class="down-btn">
            </a>
        </div>
    </div>
</template>
<script>

export default {
    name: 'Header',
    data () {
        return {
            logo: 'https://qiuyou.live/h5/img/logo.38d15be9.png'

        }
    },
    methods: {
        goDownApp () {
            if (this.isIos) {
                window.open(this._appDownloadUlrIOS, '_blank')
            } else if (this.isAnd) {
                window.open(this._appDownloadUlr, '_blank')
            }
        },
        downloadApp (type) {
            type === 1 && window.open(this._appDownloadUlr, '_blank')
            type === 2 && window.open(this._appDownloadUlrIOS, '_blank')
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.containe{
    height: 54px;
}
.header {
    height: 61px;
    width: 375px;
    background-image: url("../../assets/images/header/new-bg.png");
    position: fixed;
    z-index:5;
}
.title{
    width: 140px;height: 47px
}
.down-btn{
    width: 94px;height: 40px
}
</style>
